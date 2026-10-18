# 🦅 SHAHEEN INTERCEPTOR — MASTER PROJECT BRIEF & AI HANDOFF CONTEXT
**File Purpose:** Complete Project Context, Competition Rules, Technical Architecture, and Current Status for AI Assistants (Claude, Gemini, Antigravity, Cursor) & Human Evaluators.  
**Team Name:** Shaheen  
**Team Lead:** Amaan Masood  
**GitHub Repository:** `https://github.com/Amaan-Masood/shaheen-interceptor` (Public)  

---

## 1. What is the Competition? (The "Why" Behind This Project)

* **Event Name:** Google Cloud AI Builder Cup 2026 (JAPAC Regional Hackathon powered by Hack2skill).
* **Selected Challenge Track:** **BFSI: Intelligent Risk, Fraud & Financial Experiences**.
* **Mandatory Google Cloud Tech Stack Requirement:**
  The hackathon uses both an **Automated AI Evaluation Grader** and human judges (via a strict "Ladder Process"). To score 100% on the technical rubric and pass the AI grader, the solution MUST explicitly integrate and demonstrate all four of the following Google services:
  1. **Google Gemini (`gemini-2.5-flash` via `google-genai` SDK):** Core multi-agent reasoning engine.
  2. **Google Cloud Run:** Serverless containerized backend hosting (`python:3.12-slim` + FastAPI).
  3. **Google Cloud Firestore:** Real-time NoSQL state, telemetry, and 3-hop graph database.
  4. **Firebase Hosting:** Global CDN hosting for the React 19 frontend SOC dashboard.

* **Mandatory Submission Deliverables (Deadline: 18 Oct 2026, 11:29 PM IST):**
  1. **Deployed Prototype Link:** Must be live and publicly accessible on GCP / Cloud Run / Firebase throughout judging.
  2. **Pitch Deck (PDF < 5 MB):** Must strictly follow the official 14-slide Hack2skill template, including **Slide 12 (Prototype Performance Report / Benchmarking)**.
  3. **Demo Video (3 to 4 Minutes):** Must demonstrate live working functionality. Videos over 4 minutes or lacking live product demonstration do not progress to prototype evaluation.
  4. **Public GitHub Repository:** Complete source code and documentation (`https://github.com/Amaan-Masood/shaheen-interceptor`).
  5. **Brief Description (< 1024 Characters):** Summary highlighting how Firebase, Firestore, Cloud Run, and Gemini are leveraged.

---

## 2. The Problem We Are Solving: The "Valid OTP" Blindspot

In modern commercial banking (Raast / 1Link in Pakistan, UPI, PayNow across APAC), legacy fraud detection systems rely on static rules and credential checks. 

However, in **Authorised Push Payment (APP) Fraud** and **Voice Phishing (Vishing)**:
1. A scammer calls a victim (often impersonating FIA Cyber Crime, Central Bank/SBP officers, or Police) and threatens immediate arrest under PECA Section 21 unless funds are transferred to a "verification account" within 10 minutes.
2. Under severe psychological coercion, **the victim voluntarily unlocks their own phone, passes biometric verification, and enters the genuine SMS OTP**.
3. Because the credentials and OTP are 100% valid, traditional bank switches approve the transfer immediately.
4. Within **4 minutes**, the criminal syndicate splits ("smurfs") the funds across 3 hops of rented **Money Mule accounts** and liquidates them via Binance P2P crypto escrow (USDT) or physical ATM cash-outs. By the time the victim reports the scam hours later, the money is unrecoverable.

---

## 3. Our Solution: Shaheen Interceptor

**Shaheen Interceptor** is an autonomous, pre-settlement multi-agent cyber defense platform that sits inline at the core banking payment switch. 

When a high-value or new-beneficiary transfer is initiated during an active call, Shaheen pauses settlement for **< 750 milliseconds** (well within the 3,000 ms Raast real-time clearing SLA) and executes a 3-Agent pipeline:

### 🧠 Agent 1: `CoercionDetectorAgent` (Live Vishing & Psychological NLP)
* **Tech:** Google Gemini 2.5 Flash (`google-genai` SDK) with structured Pydantic JSON outputs + deterministic regex fallback.
* **Function:** Analyzes live call transcripts and acoustic frequency telemetry (`RMS: -14.2 dBFS`) to detect:
  * Authority Impersonation (FIA, SBP, Police, Army)
  * Artificial Urgency Traps ("10-minute deadline")
  * Legal/Arrest Threats (PECA Section 21 warrants)
  * Social Isolation Commands ("Do not hang up or tell family")
  * Legitimate Counter-Indicators (Hospital MRN numbers, surgery deposits, university challans)
* **Output:** `coercion_score` (0–100), `detected_tactics[]`, and verbatim `highlighted_phrases[]`.

### 🕸️ Agent 2: `MuleGraphHunterAgent` (3-Hop Topology & Velocity Engine)
* **Tech:** Python Graph Engine + Google Cloud Firestore (`/mule_graph` collection).
* **Function:** Traverses the beneficiary IBAN's 3-hop network and device telemetry to calculate a `mule_risk_score` (0–100) based on:
  * **Ephemeral Account Age:** Newly opened accounts (< 7 days old).
  * **KYC Tier Bypass:** Unverified Tier-0 wallets vs. Tier-3 corporate institutions.
  * **Shared Device Fingerprints:** Multiple accounts operating on the same IMEI/Android emulator hash (`DEV-MULE-8812`).
  * **Smurfing / Structuring Fan-In:** 5+ concurrent deposits structured just below the Rs. 50,000 AML reporting threshold (e.g., Rs. 45,000 each).
  * **Rapid Outbound Drain:** 98%+ of funds exiting to crypto P2P or ATMs within 120 seconds.
* **Output:** `mule_risk_score` (0–100), `graph_anomalies[]`, and SVG graph `nodes[]` & `edges[]`.

### ⚖️ Risk Fusion Engine (Pre-Settlement Verdict)
Agent 1 and Agent 2 execute concurrently via Python's `asyncio.gather`. Their scores (`C` and `M`) are fused:
* `Composite Score = (0.55 * C) + (0.45 * M)` (with high-risk single-vector boost overrides).
* **Clean Institutional Rule:** Verified Tier-3 institutions (e.g., Shaukat Khanum Hospital) are cleared ONLY when BOTH `mule_risk_score < 20` AND `coercion_score < 25`.
* **Verdicts:**
  * `Score >= 75` $\rightarrow$ **`QUARANTINED`** (Pre-settlement hold engaged; funds never leave the bank).
  * `45 <= Score < 75` $\rightarrow$ **`FLAGGED`** (Step-up biometric verification required).
  * `Score < 45` $\rightarrow$ **`CLEARED`** (Instant settlement released — 0.0% False Positive Rate).

### 🎭 Agent 3: `ActiveDecoyAndSarAgent` (Offensive Honeypot & Compliance)
Triggered automatically when a transaction is `QUARANTINED`:
1. **Active AI Decoy Honeypot (`/api/decoy/chat`):**
   * Instead of alerting the scammer that the account is blocked, Agent 3 adopts the persona of *"Haji Saleem"* (an anxious 68-year-old customer) and tells the scammer: *"Beta, my banking app shows Error Code E-409: Inter-bank Security Interlock. Please send me your backup bank account or Raast ID quickly!"*
   * When the scammer replies with a secondary mule IBAN, Raast phone number, CNIC, or TRC20/ERC20 crypto wallet, Agent 3 extracts the Indicator of Compromise (IOC) via hybrid Regex + LLM parsing and adds it to the inter-bank blocklist.
2. **1-Click Regulatory SAR Generator (`/api/generate-sar`):**
   * Generates a complete, 8-section **Suspicious Activity Report (SAR)** in Markdown/PDF compliant with **State Bank of Pakistan (SBP) BPRD Circular No. 03 of 2023**, **AMLA 2010 Section 7**, and **FATF Rec. 16**, sealed with a cryptographic `SHA256` audit digest.

---

## 4. Technical Architecture & Resilience Design

### 4.1 Dual-Mode AI & Dual-Persistence Storage (High Availability & Ablation Baseline)
To ensure the prototype maintains high resilience during live demonstrations:
* **Dual-Mode AI (`agents.py`):** Uses live `gemini-2.5-flash` when `GEMINI_API_KEY` is configured, and seamlessly executes a deterministic forensic NLP + graph heuristic engine for offline baseline ablation.
* **Dual-Persistence (`StorageManager` in `main.py`):** Writes all alerts, decoy chats, and SAR reports simultaneously to an in-memory dictionary cache and **Google Cloud Firestore** (`active_alerts`, `decoy_sessions`, `sar_reports`, `benchmark_runs`).

### 4.2 Frontend Design System
* Built with **React 19 + Vite 8 + Tailwind CSS v4 + Lucide React**.
* **Aesthetic:** Declassified Industrial Brutalist Cyber SOC Terminal (`#05070B` obsidian substrate, `1px` `#1E293B` tactical borders, `JetBrains Mono` telemetry, SVG radial tachometer gauge, simulated acoustic spectrum visualizer, and interactive SVG 3-hop node graph).

### 4.3 Three Pre-Loaded Interactive Demo Scenarios
1. **`SCENARIO_1_VISHING` (Critical Risk — Score 97/100):** Scammer posing as law enforcement investigator coercing Rs. 450,000 from senior citizen into an ephemeral mule account. -> **Verdict: QUARANTINED**.
2. **`SCENARIO_2_SMURFING` (High Risk — Score 95/100):** 6 micro-wallets structuring Rs. 45,000 transfers into an account sharing Android emulator hash `DEV-MULE-8812` before P2P cash-out. -> **Verdict: QUARANTINED**.
3. **`SCENARIO_3_CLEAN_HOSPITAL` (Clean Baseline — Score 3/100):** Legitimate urgent cardiac surgery deposit of Rs. 380,000 to verified hospital corporate IBAN. -> **Verdict: CLEARED**.

### 4.4 Automated Frozen Benchmark Suite (Slide 12 Proof & Ablation)
Accessible via the `[RUN 20-CASE BENCHMARK]` button on the top bar (`POST /api/run-benchmark`):
* **Frozen Benchmark Datasets:** `eval/dev.json` (20 cases) and `eval/heldout.json` (40 cases, SHA-256 frozen).
* **Protocol:** Zero label leakage. Pipeline evaluates raw transaction without answer key.
* **Held-Out Recall:** `100.0% [83.9%, 100.0%]` (Wilson 95% CI).
* **Held-Out False Positive Rate (FPR):** `0.0% [0.0%, 16.1%]` (Wilson 95% CI).
* **Measured Interception Latency:** `p50: 0.9 ms / p95: 2.7 ms` (local rule baseline); `< 750 ms` (Gemini Cloud Run inference). Complete report in `eval/REPORT.md`.

---

## 5. Repository Structure

```text
shaheen-interceptor/
├── backend/
│   ├── main.py              # FastAPI Gateway, Risk Fusion, Dual-Persistence StorageManager
│   ├── agents.py            # Agent 1 (Coercion), Agent 2 (Mule Graph), Agent 3 (Decoy & SAR)
│   ├── seed_data.py         # 3 Demo Scenarios, 3-Hop Graph Topologies & 20 Benchmark Cases
│   ├── requirements.txt     # fastapi, uvicorn, google-genai, firebase-admin, pydantic
│   └── Dockerfile           # Python 3.12-slim container exposing port 8080 for Cloud Run
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # 3-Panel SOC Dashboard, SVG Graph, Decoy Chat, Benchmark & SAR Modals
│   │   ├── fallbackData.js  # Complete client-side resilient fallback engine
│   │   └── main.jsx         # React 19 entry point
│   ├── package.json         # React 19, Vite 8, Tailwind CSS v4, Lucide React
│   └── vite.config.js       # Vite build config
├── docs/                    # Comprehensive IEEE/ADR Engineering Documentation
│   ├── PRD.md               # Product Requirements Document
│   ├── TRD.md               # Technical Requirements Document
│   ├── SRS.md               # Software Requirements Specification
│   ├── FLOW.md              # Mermaid Sequence, State Machine & Decision Tree Diagrams
│   ├── DECISIONS.md         # 8 Architectural Decision Records (Michael Nygard format)
│   ├── SECURITY_COMPLIANCE.md # SBP Circular 03/2023, AMLA 2010 & PECA 2016 mapping
│   └── PITCH_DECK.md        # Slide-by-slide content & 3-minute spoken pitch script
├── firebase.json            # Firebase Hosting configuration
├── .firebaserc              # Firebase project binding
├── deploy.sh                # Automated deployment script for Cloud Run + Firebase
└── README.md                # Project overview & quickstart instructions