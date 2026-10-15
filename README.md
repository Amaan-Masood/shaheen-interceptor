# 🦅 Shaheen Interceptor
### Autonomous BFSI Fraud, Vishing & Money Mule Defense Platform
**Track:** BFSI: Intelligent Risk, Fraud & Financial Experiences  
**Deployments:** Google Cloud Run (Backend), Cloud Firestore, Firebase Hosting (Frontend), Google Gemini 2.5 Flash

---

## 📚 Complete Project Documentation Suite
All authoritative specifications, architecture diagrams, decision records, and regulatory compliance documents are located in the [`/docs`](file:///s:/Projects/Ai%20builder%20cup%202026/docs) directory:

| Document | File Link | Focus & Highlights |
| :--- | :--- | :--- |
| **PRD** | [PRD.md](file:///s:/Projects/Ai%20builder%20cup%202026/docs/PRD.md) | Product Requirements, Personas, Functional (FR1-12) & Non-Functional Requirements, Slide 12 KPIs |
| **SRS** | [SRS.md](file:///s:/Projects/Ai%20builder%20cup%202026/docs/SRS.md) | IEEE 830-1998 Software Requirements, External Interfaces, Gemini/Firestore Data Dictionaries |
| **TRD** | [TRD.md](file:///s:/Projects/Ai%20builder%20cup%202026/docs/TRD.md) | Technical Architecture, Dual-Mode Fallback, API Endpoints, Latency Budgets (<850ms SLA), Docker Cloud Run |
| **FLOW** | [FLOW.md](file:///s:/Projects/Ai%20builder%20cup%202026/docs/FLOW.md) | 5 Complete Mermaid Visual Diagrams (System Architecture, Sequence, Decision Tree, Honeypot FSM, Benchmarks) |
| **DECISIONS** | [DECISIONS.md](file:///s:/Projects/Ai%20builder%20cup%202026/docs/DECISIONS.md) | Architecture Decision Records (ADR-001 through ADR-008: Pre-settlement lock, Gemini 2.5, Firestore, Brutalist UI) |
| **COMPLIANCE** | [SECURITY_COMPLIANCE.md](file:///s:/Projects/Ai%20builder%20cup%202026/docs/SECURITY_COMPLIANCE.md) | SBP BPRD Cir. 03 (2023), AMLA 2010 Sec. 7, PECA 2016, FATF Rec. 16, PII Tokenization & Cryptographic Digest |
| **PITCH DECK** | [PITCH_DECK.md](file:///s:/Projects/Ai%20builder%20cup%202026/docs/PITCH_DECK.md) | Complete 12-Slide Hackathon Pitch Deck + Empirical Benchmark Results + 3-Minute Verbal Script |

---

## 1. Executive Summary
**Shaheen Interceptor** is a real-time, multi-agent cyber defense platform engineered to stop **Authorised Push Payment (APP) Fraud, Vishing (Voice Phishing), and Coordinated Money Mule Networks** prior to inter-bank settlement.

When an elderly or vulnerable banking customer is coerced over a live telephone call into authorizing a transfer, conventional rule engines fail because the victim provides genuine credentials and valid OTPs. Shaheen neutralizes this vector by fusing **live conversational psychological coercion telemetry** with **3-hop recipient network graph analysis**, halting the transaction pre-settlement, deploying an **Active AI Decoy Honeypot** to bait the perpetrator into revealing secondary mule accounts, and generating an audit-ready **Suspicious Activity Report (SAR)**.

---

## 2. Multi-Agent Architecture

```
                                  [ INCOMING TRANSACTION ]
                                             │
                      ┌──────────────────────┴──────────────────────┐
                      ▼                                             ▼
           [ AGENT 1: COERCION ]                        [ AGENT 2: MULE GRAPH ]
           Gemini 2.5 Flash + NLP                      Cloud Firestore Telemetry
      - Authority Impersonation (FIA/SBP)         - 3-Hop Topology Velocity
      - Threat of Arrest (PECA Sec 21)            - Shared IMEI/Device Hashes
      - 10-Minute Urgency Traps                   - Fan-in Micro-Structuring (<50k)
      - OTP / Screen-Share Coercion               - Instant Crypto/ATM Cashout
                      │                                             │
                      └──────────────────────┬──────────────────────┘
                                             ▼
                                  [ RISK FUSION ENGINE ]
                                             │
                         ┌───────────────────┴───────────────────┐
                         ▼                                       ▼
                 Risk Score ≥ 75                         Risk Score < 45
                 [ QUARANTINED ]                           [ CLEARED ]
                         │                                       │
                         ▼                                       ▼
          ┌─────────────────────────────┐               Instant Settlement
          │  AGENT 3: ACTIVE AI DECOY   │
          │  - Simulates Error E-409    │
          │  - Baits for Backup IBANs   │
          │  - Extracts New Mule IOCs   │
          └──────────────┬──────────────┘
                         │
                         ▼
          ┌─────────────────────────────┐
          │  1-CLICK REGULATORY SAR     │
          │  - SBP / FMU Standard       │
          │  - Verbatim Evidence Chain  │
          │  - Cryptographic Digest     │
          └─────────────────────────────┘
```

1. **Agent 1 (`CoercionDetectorAgent`)**: Analyzes live audio transcripts and metadata using Gemini 2.5 Flash with structured Pydantic outputs and zero-failure deterministic NLP fallback. Flags psychological pressure, authority claims, and social isolation.
2. **Agent 2 (`MuleGraphHunterAgent`)**: Analyzes the recipient's 3-hop graph for ephemeral account age (<7 days), Tier 0 onboarding, shared emulator device hashes (`DEV-MULE-8812`), rapid structuring (<Rs. 50k), and instant crypto liquidation.
3. **Agent 3 (`ActiveDecoyAndSarAgent`)**:
   - **Active AI Decoy Honeypot**: Deploys persona *"Haji Saleem"* reporting `Error E-409: Inter-bank Security Interlock` to stall the scammer and extract secondary mule IBANs/phones into real-time blacklists.
   - **Regulatory SAR Generator**: Compiles an official Suspicious Activity Report (Markdown/PDF) citing verbatim quotes, device fingerprints, and network topology.

---

## 3. Benchmark Suite (Pitch Deck Slide 12)

Evaluated across 20 synthetic scenarios (15 diverse fraud vectors + 5 legitimate urgent baselines):

| Metric | Target | Verified Score |
| :--- | :--- | :--- |
| **Detection Recall** | $\ge 95\%$ | **100.0%** (15 / 15 Fraud Cases Quarantined) |
| **False Positive Rate (FPR)** | $\le 1.0\%$ | **0.0%** (0 / 5 Legitimate Urgent Hospitals Blocked) |
| **Precision** | $\ge 95\%$ | **100.0%** |
| **Accuracy** | $\ge 95\%$ | **100.0%** |
| **Average Decision Latency** | $< 1000\text{ ms}$ | **0.8 ms** (deterministic) / **$\approx$ 650 ms** (live Gemini) |

---

## 4. Local Execution

### Backend (FastAPI + Gemini + Firestore)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### Frontend (React + Vite + Tailwind CSS)
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 5. Production Cloud Deployment

### 1-Click Automated Deployment
```bash
chmod +x deploy.sh
./deploy.sh
```

### Manual Google Cloud Run & Firebase Hosting Commands
```bash
# 1. Deploy Backend to Google Cloud Run
cd backend
gcloud run deploy shaheen-interceptor-backend \
    --source . \
    --region us-central1 \
    --platform managed \
    --allow-unauthenticated \
    --port 8080 \
    --set-env-vars "GOOGLE_CLOUD_PROJECT=shaheen-interceptor,GEMINI_API_KEY=${GEMINI_API_KEY}"

# 2. Deploy Frontend to Firebase Hosting
cd ../frontend
npm run build
firebase deploy --only hosting
```
