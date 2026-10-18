#!/usr/bin/env bash
# ============================================================================
# SHAHEEN INTERCEPTOR - COMPLETE PRODUCTION DEPLOYMENT SCRIPT
# Deploys /backend to Google Cloud Run and /frontend to Firebase Hosting
# ============================================================================

set -euo pipefail

PROJECT_ID=${GOOGLE_CLOUD_PROJECT:-"shaheen-interceptor"}
REGION=${GCP_REGION:-"us-central1"}
SERVICE_NAME="shaheen-interceptor-backend"
GEMINI_SECRET_NAME="gemini-api-key"

# Shell history is off while this script runs so no secret value ever lands in
# the caller's shell history.
set +o history 2>/dev/null || true

echo "=========================================================="
echo "🦅 SHAHEEN INTERCEPTOR // PRODUCTION DEPLOYMENT PIPELINE"
echo "=========================================================="
echo "GCP Project: $PROJECT_ID"
echo "GCP Region:  $REGION"
echo "Service:     $SERVICE_NAME"
echo "=========================================================="

# ---------------------------------------------------------------------------
# 1. Prerequisites: fail fast and loudly, before any mutation happens
# ---------------------------------------------------------------------------
check_cmd() {
    if ! command -v "$1" &> /dev/null; then
        echo "❌ Error: '$1' is not installed."
        exit 1
    fi
}

check_cmd gcloud
check_cmd npm
check_cmd node

# Auth is the single most common first-run failure: gcloud is installed but no
# account is active, and every later step then fails with an opaque error.
if ! gcloud auth list --filter=status:ACTIVE --format='value(account)' 2>/dev/null | grep -q .; then
    echo "❌ No active gcloud account. Run: gcloud auth login"
    exit 1
fi
echo "   ✅ gcloud authed as: $(gcloud auth list --filter=status:ACTIVE --format='value(account)' | head -1)"

# Verify the configured project is real and reachable before enabling APIs.
if ! gcloud projects describe "$PROJECT_ID" &> /dev/null; then
    echo "❌ Project '$PROJECT_ID' not found or not accessible to this account."
    echo "   Check: gcloud projects list"
    echo "   Billing must also be enabled: gcloud billing list"
    exit 1
fi

if [ -z "${GEMINI_API_KEY:-}" ]; then
    echo "❌ Error: GEMINI_API_KEY is not set in the environment."
    echo "   export GEMINI_API_KEY=***"
    echo "   Without it the deployment runs entirely on the deterministic fallback."
    exit 1
fi

if [ ! -f "backend/requirements.txt" ] || [ ! -f "frontend/package.json" ]; then
    echo "❌ Error: run this script from the repository root."
    exit 1
fi

# ---------------------------------------------------------------------------
# 2. Configure project and enable required APIs
# ---------------------------------------------------------------------------
echo "[STEP 1/5] Configuring GCP Project and enabling required APIs..."
gcloud config set project "$PROJECT_ID"

# `set -euo pipefail` means a failing gcloud exits the script immediately, so no
# separate exit-code handling is needed. Billing must be enabled on the project
# before any of these succeed - the most common first-run failure.
gcloud services enable \
    run.googleapis.com \
    firestore.googleapis.com \
    artifactregistry.googleapis.com \
    cloudbuild.googleapis.com

# ---------------------------------------------------------------------------
# 3. Store the API key in Secret Manager
#
# The key is written to Secret Manager from a file descriptor. This avoids two
# real problems with `--set-env-vars "GEMINI_API_KEY=$GEMINI_API_KEY"`:
#   (a) it appears in the process argv, visible via `ps` on the same host
#   (b) it is retained on the service object, readable by anyone holding
#       `run services describe` permission
# Secret Manager grants audit, versioning and access control the env-var path
# cannot.
# ---------------------------------------------------------------------------
echo "[STEP 2/5] Storing GEMINI_API_KEY in Secret Manager..."
if ! gcloud secrets describe "$GEMINI_SECRET_NAME" &> /dev/null; then
    gcloud secrets create "$GEMINI_SECRET_NAME" --data-file=- <<EOF_SECRET
$GEMINI_API_KEY
EOF_SECRET
else
    # Update in place so an existing secret is never orphaned or duplicated.
    gcloud secrets versions add "$GEMINI_SECRET_NAME" --data-file=- <<EOF_SECRET
$GEMINI_API_KEY
EOF_SECRET
fi

# Grant Cloud Run's default service agent read access to the secret.
gcloud secrets add-iam-policy-binding "$GEMINI_SECRET_NAME" \
    --member="serviceAccount:${PROJECT_ID}@cloudbot.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor" \
    --condition="CloudRunSecretAccess" \
    || echo "⚠️  Secret IAM binding may need manual review (service may already have it)."

# ---------------------------------------------------------------------------
# 4. Deploy backend. --wait guards against a silent half-deployed revision.
# ---------------------------------------------------------------------------
echo "[STEP 3/5] Deploying /backend to Google Cloud Run..."
cd backend

# `--add-secrets` appends to the service's existing secret list, and
# `--update-secrets` replaces in place but does NOT create a missing entry.
# Naively always using --add-secrets is non-idempotent: a second deploy leaves
# TWO entries named GEMINI_API_KEY and Cloud Run's resolution becomes undefined.
# Branch on whether the service already exists so the first deploy and every
# redeploy are both correct.
if gcloud run services describe "$SERVICE_NAME" --region "$REGION" &> /dev/null; then
    echo "   Service exists - updating secret binding in place."
    SECRET_ARG="--update-secrets name=GEMINI_API_KEY,secret=$GEMINI_SECRET_NAME"
else
    echo "   New service - adding secret binding."
    SECRET_ARG="--add-secrets name=GEMINI_API_KEY,secret=$GEMINI_SECRET_NAME"
fi

# NOTE: gcloud flag semantics should be re-verified against the installed CLI
# version before a live deployment; `gcloud run deploy --help` documents the
# exact add-vs-update behaviour. This script was authored without gcloud access.
gcloud run deploy "$SERVICE_NAME" \
    --source . \
    --region "$REGION" \
    --platform managed \
    --allow-unauthenticated \
    --port 8080 \
    --wait=300s \
    --set-env-vars "GOOGLE_CLOUD_PROJECT=$PROJECT_ID" \
    $SECRET_ARG

BACKEND_URL=$(gcloud run services describe "$SERVICE_NAME" \
    --region "$REGION" --format 'value(status.url)')
echo "✅ Backend deployed: $BACKEND_URL"

# Post-deploy health check. Cloud Run cold-starts are slow, so allow a few polls.
echo "   Checking /api/health..."
HEALTH_URL="$BACKEND_URL/api/health"
HEALTH_OK=0
for attempt in 1 2 3 4 5 6; do
    if curl -fsS --max-time 10 "$HEALTH_URL" &> /dev/null; then
        HEALTH_OK=1
        echo "   ✅ Health check passed (attempt $attempt)."
        break
    fi
    echo "   ⏳ Attempt $attempt failed, retrying..."
    sleep 10
done

if [ "$HEALTH_OK" -ne 1 ]; then
    echo "❌ Health check never passed. The service deployed but is not answering."
    echo "   Inspect: gcloud logging read --service='$SERVICE_NAME'"
    echo "   Check whether GEMINI_API_KEY resolved from the secret binding."
    exit 1
fi

# ---------------------------------------------------------------------------
# 5. Build and deploy frontend
# ---------------------------------------------------------------------------
echo "[STEP 4/5] Building and deploying frontend to Firebase Hosting..."
cd ../frontend

export VITE_API_URL="$BACKEND_URL"
echo "VITE_API_URL=$BACKEND_URL" > .env.production

npm ci
npm run build

if command -v firebase &> /dev/null; then
    firebase use "$PROJECT_ID"
    firebase deploy --only hosting
    echo "✅ Frontend deployed to Firebase Hosting."
else
    echo "⚠️  Firebase CLI not found. Deploy hosting manually:"
    echo "   npm install -g firebase-tools && firebase login && firebase deploy --only hosting"
fi

# The frontend bundle is now built with the backend URL baked in. Keep the
# VITE_API_URL export in place for any later manual redeploy.
export GEMINI_API_KEY=""

echo ""
echo "=========================================================="
echo "🦅 SHAHEEN INTERCEPTOR DEPLOYMENT COMPLETE!"
echo "Backend URL:  $BACKEND_URL"
echo "API Health:   $BACKEND_URL/api/health"
echo ""
echo "Manual post-deploy checks:"
echo "  1. curl '$HEALTH_URL'            -> gemini_live should be true"
echo "  2. gcloud run services describe '$SERVICE_NAME' --region '$REGION'"
echo "  3. gcloud logging read --service='$SERVICE_NAME'"
echo ""
echo "Rollback if needed:"
echo "  gcloud run services rollback '$SERVICE_NAME' --region '$REGION'"
echo "=========================================================="
