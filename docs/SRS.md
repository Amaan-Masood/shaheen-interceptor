# 🦅 SHAHEEN INTERCEPTOR // SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
**Document Standard:** IEEE Std 830-1998 Compliant  
**Project:** Shaheen Interceptor — Real-Time BFSI APP-Fraud & Mule Interception Platform  
**Organization:** Team Shaheen // AI Builder Cup 2026  
**Status:** Released & Baselined  
**Date:** October 2026  

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) delineates the complete software, functional, external interface, and data specifications for **Shaheen Interceptor**. The software is engineered for commercial banks, payment service providers (PSPs), and financial intelligence units (FIUs) to detect and neutralize Authorised Push Payment (APP) Fraud, live vishing coercion, and money mule syndicates prior to inter-bank clearing.

### 1.2 Scope
Shaheen Interceptor encompasses:
* A containerized backend microservice written in Python 3.12 utilizing FastAPI, Google GenAI SDK (`gemini-2.5-flash`), and Firebase Admin (`google-cloud-firestore`).
* A high-performance Cyber SOC command center frontend constructed with React 19, Vite 8, Tailwind CSS v4, and Lucide React.
* A multi-agent pipeline executing parallel natural language coercion parsing, 3-hop graph anomaly traversal, and autonomous baiting honeypot interactions.
* Integration capabilities with Google Cloud Run (microservices host) and Cloud Firestore (persistence layer).

### 1.3 Definitions, Acronyms, and Abbreviations
* **ADC:** Application Default Credentials (Google Cloud Platform authentication).
* **AMLA 2010:** Anti-Money Laundering Act, 2010 (Pakistan).
* **APP Fraud:** Authorised Push Payment Fraud (where the legitimate user is manipulated into approving the transaction).
* **BFSI:** Banking, Financial Services, and Insurance.
* **CNIC:** Computerized National Identity Card (Pakistan 13-digit identifier).
* **FMU:** Financial Monitoring Unit (National AML agency of Pakistan).
* **IBAN:** International Bank Account Number.
* **IOC:** Indicator of Compromise (mule accounts, phone numbers, device hashes).
* **PECA:** Prevention of Electronic Crimes Act, 2016.
* **Raast:** Pakistan's instant inter-bank real-time retail payment gateway.
* **SAR:** Suspicious Activity Report.
* **STR:** Suspicious Transaction Report.
* **Vishing:** Voice Phishing (fraudulent telephone coercion).

### 1.4 References
1. IEEE Std 830-1998: *IEEE Recommended Practice for Software Requirements Specifications*.
2. State Bank of Pakistan (SBP) BPRD Circular No. 03 of 2023: *Regulations on Unauthorized Electronic Fund Transfers*.
3. Financial Action Task Force (FATF): *Guidance on Countering Money Laundering and Mule Accounts*.
4. Google Cloud Platform: *Cloud Run and Firestore Architecture Guidelines*.
5. Google GenAI Python SDK Documentation (`google-genai`, Gemini 2.5 Flash).

---

## 2. Overall Description

### 2.1 Product Perspective
Shaheen Interceptor acts as an inline defensive gateway and analytical SOC terminal positioned between the bank's core banking switch (1Link / Raast) and the customer-facing digital channels (Mobile Banking Application, Internet Banking).

```
[ MOBILE CLIENT / SENDER ]
             │
             ▼
   [ CORE SWITCH / RAAST ] ──── (Payment Payload) ────┐
             │                                        │
             ▼                                        ▼
    [ SETTLEMENT HOLD ]                    [ SHAHEEN INTERCEPTOR ]
 (Pending Multi-Agent Verdict)                 │
             │                                 ├── Agent 1 (Gemini Coercion)
             │                                 ├── Agent 2 (Firestore Graph)
             │                                 └── Agent 3 (Decoy & SAR)
             ▼                                        │
[ RELEASE OR QUARANTINE ] ◄── (Verdict: <1000ms) ─────┘
```

### 2.2 Product Functions
* **Parallel Risk Vector Analysis:** Evaluates live call audio transcripts alongside beneficiary account telemetry concurrently.
* **Sub-Second Pre-Settlement Decisioning:** Delivers a definitive settlement verdict (`QUARANTINED`, `FLAGGED`, `CLEARED`) within the 1Link/Raast 3-second inter-bank clearing window.
* **Multi-Hop Money Mule Tracing:** Analyzes 3-hop beneficiary topologies to detect account aging bypasses, structuring under Rs. 50,000 STR thresholds, shared device fingerprints, and immediate crypto/ATM liquidity drains.
* **Active AI Honeypot Engagement:** Deploys an automated believable persona to bait the scammer into providing alternate mule accounts when the initial target is locked.
* **Automated Regulatory Compliance:** Compiles SBP-compliant Suspicious Activity Reports (SARs) complete with verbatim evidence and SHA256 cryptographic digests.

### 2.3 User Classes and Characteristics
1. **SOC Fraud Analysts:** High technical proficiency; require low-latency terminal feeds, rapid graph inspection, and instant SAR report exports.
2. **Compliance & AML Officers:** Legal and regulatory focus; require audit-ready markdown/PDF outputs compliant with SBP/FMU reporting directives.
3. **Executive Stakeholders / Judges:** High-level orientation; require real-time benchmark metrics (Recall, FPR, Precision) and clear presentation of prevented financial loss.

### 2.4 Operating Environment
* **Backend:** Linux container (`python:3.12-slim`) deployed on Google Cloud Run with 1 vCPU and 512MiB RAM minimum.
* **Database:** Google Cloud Firestore (Native Mode) with in-memory caching fallback.
* **Frontend:** Static web bundle hosted on Firebase Hosting or modern Web Server (NGINX / Node / Cloud Run).
* **Client Browsers:** Modern Evergreen Browsers (Chrome 120+, Edge 120+, Safari 17+, Firefox 120+).

### 2.5 Design and Implementation Constraints
* Must adhere strictly to RESTful architectural principles for the `/api/*` endpoints.
* Must implement a deterministic offline fallback engine ensuring zero downtime during API quota exhaustion or network dropouts.
* Must not store unencrypted customer passwords, PINs, or raw OTP authorization secrets.

---

## 3. External Interface Requirements

### 3.1 User Interfaces (UI)
* **Design System:** Industrial Brutalist Tactical Telemetry theme utilizing deep obsidian substrate (`#05070B`), 1px tactical slate borders (`#1E293B`), and high-contrast indicators (Crimson `#EF4444`, Amber `#F59E0B`, Emerald `#10B981`, Cyan `#38BDF8`).
* **Layout Structure:**
  * Top Bar: Falcon emblem, dual PKT/ZULU clocks, live GCP service pills, benchmark trigger.
  * Left Panel: 3 scenario cards, 28-band acoustic frequency spectrum, live scrolling transcript with highlighted threat tags.
  * Center Panel (2 Tabs): Interactive SVG 3-Hop Force Graph and Active AI Decoy Honeypot terminal.
  * Right Panel: SVG Semi-Circular Tachometer gauge (0–100), latency readout, evidence chain cards, and compliance action buttons.
  * Modals: 20-Case Benchmark Suite (Slide 12) and SBP SAR Report viewer.

### 3.2 Hardware Interfaces
No specialized hardware required; runs standard WebRTC/HTTP streams across commodity servers and mobile/desktop clients.

### 3.3 Software Interfaces
* **Google Gemini API (`gemini-2.5-flash`):** Connected via official `google-genai` Python SDK for structured JSON inference.
* **Google Cloud Firestore:** Connected via `firebase-admin` SDK for real-time document storage.
* **FastAPI Microservice Engine:** Serves ASGI endpoints over HTTP/1.1 and HTTP/2 on port 8080.

### 3.4 Communications Interfaces
* HTTPS with TLS 1.3 encryption for all external API and web communications.
* JSON-encoded payloads adhering to OpenAPI 3.0 specification.
* Cross-Origin Resource Sharing (CORS) configured to permit designated secure origins.

---

## 4. System Features & Detailed Requirements

### 4.1 System Feature 1: Live Call Coercion Detection (`CoercionDetectorAgent`)
* **Description:** Analyzes telephone conversational transcripts to detect psychological manipulation, authority impersonation, urgency traps, and threats of legal action.
* **Inputs:** `transcript` (string), `amount` (float), `sender` (object), `receiver` (object).
* **Processing:**
  1. If `GEMINI_API_KEY` exists, invokes Gemini 2.5 Flash with structured Pydantic schema.
  2. If offline or missing key, executes regex pattern matching across Urdu and English threat dictionaries:
     - Authority: "FIA", "State Bank", "PECA Section 21", "Police Raid", "Inspector Tariq".
     - Urgency: "10 minute", "immediate", "foran", "abhi ke abhi", "deadline".
     - Threat: "arrest warrant", "account freeze", "jail", "raid team".
     - Counter-Indicators: "hospital", "patient", "icu", "surgery", "challan".
* **Outputs:** `CoercionAnalysisResult` object containing `coercion_score` (0–100), `detected_tactics[]`, verbatim `highlighted_phrases[]`, and `reasoning`.

### 4.2 System Feature 2: Mule Graph & Velocity Hunter (`MuleGraphHunterAgent`)
* **Description:** Traverses the beneficiary account's multi-hop topology and analyzes device fingerprints to uncover money laundering and structuring.
* **Inputs:** `receiver_iban` (string), `amount` (float), `graph_data` (object).
* **Processing:**
  1. Inspects account age: $< 7\text{ days}$ (+30 risk), $< 30\text{ days}$ (+15 risk).
  2. Inspects KYC tier: Tier 0 (+25 risk), Tier 1 (+10 risk), Tier 3 Corporate (-25 risk).
  3. Detects shared device fingerprints (`DEV-MULE-8812`, Android emulators) bound to multiple accounts (+30 risk).
  4. Detects high fan-in velocity ($\ge 5$ feeders structured below Rs. 50,000 STR limit) (+30 risk).
  5. Detects rapid outbound drain to Binance P2P crypto or ATM networks (+25 risk).
  6. Detects circular wash-trading loops (A $\rightarrow$ B $\rightarrow$ A) (+35 risk).
* **Outputs:** `MuleGraphAnalysisResult` containing `mule_risk_score` (0–100), `graph_anomalies[]`, `nodes[]`, `edges[]`, and `forensic_summary`.

### 4.3 System Feature 3: Active AI Decoy Honeypot (`ActiveDecoyAndSarAgent`)
* **Description:** Simulates an anxious customer ("Haji Saleem") to stall the scammer and extract secondary mule accounts.
* **Inputs:** `scammer_message` (string), `history` (array of turns).
* **Processing:**
  1. Analyzes incoming message using regex rules for Pakistani IBANs, phone numbers, CNICs, and crypto wallets.
  2. Formulates a baiting response reporting `Error Code E-409: Inter-bank Security Interlock - Beneficiary Account Daily Limit Exceeded`.
  3. Solicits secondary payment destinations ("Send me your backup IBAN, other bank account, or Raast Mobile ID").
  4. Stores freshly captured IOCs into `decoy_sessions` and triggers UI flashing banner.
* **Outputs:** `DecoyTurnResult` with `reply`, `captured_iocs[]`, `decoy_strategy`, and `scammer_intent_detected`.

### 4.4 System Feature 4: Regulatory SAR Generation
* **Description:** Generates an official Suspicious Activity Report compliant with SBP and FMU guidelines.
* **Inputs:** `alert_data` (object containing risk scores, evidence quotes, graph anomalies, captured IOCs).
* **Processing:** Formats an 8-section legal report in Markdown containing subject telemetry, verbatim quotes, 3-hop topology, regulatory interventions, and a SHA256 cryptographic digest.
* **Outputs:** `SarReportResult` with `report_id`, `generated_markdown`, `risk_category`, and `filing_timestamp`.

### 4.5 System Feature 5: Automated 20-Case Benchmark Suite
* **Description:** Executes 20 synthetic test cases (15 scams + 5 clean urgent baselines) to measure latency, recall, precision, and false positive rate.
* **Inputs:** `BENCHMARK_DATASET` array.
* **Processing:** Runs each case through Agents 1 and 2, measures execution time in milliseconds, tallies TP, FP, TN, FN, and computes percentage metrics.
* **Outputs:** Summary object with `metrics` (recall, FPR, precision, latency) and per-case results array.

---

## 5. Data Requirements & Schemas

### 5.1 Firestore Collection: `active_alerts`
```json
{
  "alert_id": "ALT-SHN-992140",
  "timestamp": "2026-10-15T15:00:00Z",
  "scenario_id": "SCENARIO_1_VISHING",
  "amount": 450000.0,
  "currency": "PKR",
  "channel": "Raast Instant Transfer",
  "sender": { "name": "Haji Abdul Rehman", "iban": "PK45HABB00099214710293", "bank": "HBL", "account_age_days": 4200, "kyc_tier": "Tier 2", "device_hash": "DEV-IPHONE12-F8-ISB-3912" },
  "receiver": { "name": "Muhammad Bilal", "iban": "PK36MEZN00019283746501", "bank": "Meezan Bank", "account_age_days": 4, "kyc_tier": "Tier 0", "device_hash": "DEV-MULE-8812" },
  "combined_risk_score": 97,
  "coercion_score": 98,
  "mule_risk_score": 96,
  "verdict": "QUARANTINED",
  "latency_ms": 740.0,
  "detected_tactics": ["Authority Impersonation (FIA)", "Urgency Trap", "Threat of Arrest under PECA"],
  "highlighted_phrases": ["Main Inspector Tariq baat kar raha hoon FIA se", "immediate arrest warrant issue kiya hai"],
  "graph_anomalies": ["EPHEMERAL_ACCOUNT_AGE_4_DAYS", "SHARED_DEVICE_FINGERPRINT", "RAPID_OUTBOUND_FANOUT"]
}
```

### 5.2 Firestore Collection: `decoy_sessions`
```json
{
  "session_id": "DEC-992140",
  "alert_id": "ALT-SHN-992140",
  "created_at": "2026-10-15T15:02:10Z",
  "messages": [
    { "sender": "decoy", "text": "Beta app par Error E-409 aa raha hai...", "timestamp": "2026-10-15T15:02:10Z" },
    { "sender": "scammer", "text": "Send to backup account PK78HABB00034827190001", "timestamp": "2026-10-15T15:03:00Z" }
  ],
  "cumulative_iocs": [
    { "type": "IBAN", "value": "PK78HABB00034827190001", "confidence": 0.98, "source": "DECOY_HONEYPOT" }
  ]
}
```

---

## 6. Verification & Quality Attributes

* **Reliability:** 100% operational availability guaranteed through dual-mode fallback (local NLP + Gemini).
* **Usability:** 3-panel command center allows SOC analysts to reach verdict analysis in $< 2$ clicks.
* **Maintainability:** Modular Python agents with strict Pydantic schemas and isolated React components.
* **Portability:** Containerized Dockerfile ready for single-command deployment to Google Cloud Run and Firebase Hosting.
