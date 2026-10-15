#!/usr/bin/env bash
# ============================================================================
# SHAHEEN INTERCEPTOR - COMPLETE PRODUCTION DEPLOYMENT SCRIPT
# Deploys /backend to Google Cloud Run and /frontend to Firebase Hosting
# ============================================================================

set -e

PROJECT_ID=${GOOGLE_CLOUD_PROJECT:-"shaheen-interceptor"}
REGION=${GCP_REGION:-"us-central1"}
SERVICE_NAME="shaheen-interceptor-backend"

echo "=========================================================="
echo "🦅 SHAHEEN INTERCEPTOR // PRODUCTION DEPLOYMENT PIPELINE"
echo "=========================================================="
echo "GCP Project: $PROJECT_ID"
echo "GCP Region:  $REGION"
echo "Service:     $SERVICE_NAME"
echo "=========================================================="

# 1. Check gcloud CLI
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: gcloud CLI is not installed. Please install Google Cloud SDK."
    exit 1
fi

# 2. Configure GCP Project
echo "[STEP 1/4] Configuring GCP Project..."
gcloud config set project "$PROJECT_ID"

# 3. Enable Required Google Cloud APIs
echo "[STEP 2/4] Enabling Required Cloud APIs (Cloud Run, Firestore, Artifact Registry)..."
gcloud services enable \
    run.googleapis.com \
    firestore.googleapis.com \
    artifactregistry.googleapis.com \
    cloudbuild.googleapis.com

# 4. Deploy Backend to Google Cloud Run
echo "[STEP 3/4] Deploying /backend to Google Cloud Run..."
cd backend
gcloud run deploy "$SERVICE_NAME" \
    --source . \
    --region "$REGION" \
    --platform managed \
    --allow-unauthenticated \
    --port 8080 \
    --set-env-vars "GOOGLE_CLOUD_PROJECT=$PROJECT_ID,GEMINI_API_KEY=${GEMINI_API_KEY}"

# Retrieve Cloud Run Service URL
BACKEND_URL=$(gcloud run services describe "$SERVICE_NAME" --region "$REGION" --format 'value(status.url)')
echo "✅ Backend successfully deployed: $BACKEND_URL"

# 5. Build and Deploy Frontend to Firebase Hosting
echo "[STEP 4/4] Building and Deploying Frontend to Firebase Hosting..."
cd ../frontend

# Export Vite API URL pointing to the deployed Cloud Run service
export VITE_API_URL="$BACKEND_URL"
echo "VITE_API_URL=$BACKEND_URL" > .env.production

npm install
npm run build

if command -v firebase &> /dev/null; then
    firebase use "$PROJECT_ID"
    firebase deploy --only hosting
    echo "✅ Frontend successfully deployed to Firebase Hosting!"
else
    echo "⚠️ Firebase CLI not found. To complete hosting deployment:"
    echo "   npm install -g firebase-tools"
    echo "   firebase login"
    echo "   firebase deploy --only hosting"
fi

echo "=========================================================="
echo "🦅 SHAHEEN INTERCEPTOR DEPLOYMENT COMPLETE!"
echo "Backend URL:  $BACKEND_URL"
echo "API Health:   $BACKEND_URL/api/health"
echo "=========================================================="
