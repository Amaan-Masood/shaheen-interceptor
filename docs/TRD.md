# 🦅 SHAHEEN INTERCEPTOR // TECHNICAL REQUIREMENTS & ARCHITECTURE (TRD)
**Project:** Shaheen Interceptor — Real-Time BFSI Multi-Agent Fraud Defense  
**Track:** BFSI: Intelligent Risk, Fraud & Financial Experiences  
**Architecture Classification:** Distributed Microservices & Multi-Agent Event Architecture  
**Author:** Shaheen Engineering Team // AI Builder Cup 2026  
**Status:** Approved & Implemented  

---

## 1. System Architecture Overview

Shaheen Interceptor implements an asynchronous, distributed, multi-agent cyber defense architecture designed for sub-second transactional risk decisioning.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            FRONTEND LAYER                                   │
│            React 19 + Vite 8 + Tailwind CSS v4 + Lucide React              │
│       (3-Panel Tactical Command Center: Simulator, Graph, Dossier)          │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTPS / JSON (REST)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       API GATEWAY & PERSISTENCE LAYER                       │
│                         FastAPI on Google Cloud Run                         │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  StorageManager: Dual-Persistence (Firestore Sync + In-Memory Cache)│   │
│   └─────────────────────────────────────────────────────────────────────┘   │
└──────────────────────┬───────────────────────────────┬──────────────────────┘
                       │                               │
                       ▼                               ▼
       ┌───────────────────────────────┐ ┌───────────────────────────────┐
       │   AGENT 1: COERCION DETECTOR   │ │  AGENT 2: MULE GRAPH HUNTER   │
       │   Google Gemini 2.5 Flash     │ │  3-Hop Graph Traversal Engine │
       │   + Deterministic NLP Engine  │ │  + Shared Telemetry Analyzer  │
       └───────────────┬───────────────┘ └───────────────┬───────────────┘
                       │                               │
                       └───────────────┬───────────────┘
                                       ▼
                       ┌───────────────────────────────┐
                       │      RISK FUSION ENGINE       │
                       │ Combined Score = 0.55C + 0.45M │
                       │ Verdict: QUARANTINED | CLEARED│
                       └───────────────┬───────────────┘
                                       │ If Combined Score ≥ 75
                                       ▼
                       ┌───────────────────────────────┐
                       │  AGENT 3: ACTIVE DECOY & SAR  │
                       │  - Persona Baiting (Error 409)│
                       │  - Regex / NLP IOC Harvester  │
                       │  - SBP / FMU SAR Generator    │
                       └───────────────────────────────┘
```

---

## 2. Technology Stack Matrix

| Layer | Component | Version | Rationale / Strategic Advantage |
| :--- | :--- | :--- | :--- |
| **Backend Runtime** | Python | `3.12.10` | High performance, native typing support, modern async asyncio primitives. |
| **API Framework** | FastAPI | `0.115.0+` | Asynchronous ASGI framework, sub-millisecond route dispatch, auto-generated OpenAPI. |
| **AI / LLM Engine** | Google GenAI SDK | `google-genai 0.1.1+` | Official SDK accessing `gemini-2.5-flash` with native Structured Outputs. |
| **Database SDK** | Firebase Admin | `6.6.0+` | Direct interface to Google Cloud Firestore (Serverless NoSQL Document DB). |
| **Data Validation** | Pydantic | `2.9.0+` | High-speed C-based schema validation and type coercion. |
| **Server Engine** | Uvicorn | `0.32.0+` | Production ASGI web server with uvloop event loops. |
| **Frontend Framework**| React | `19.2.8` | Modern concurrent rendering, clean component isolation. |
| **Build Tool** | Vite | `8.3.4` | Sub-second HMR and optimized asset bundling via `@tailwindcss/vite`. |
| **Styling** | Tailwind CSS | `v4.0.0` | High-performance CSS engine enforcing Industrial Brutalist design tokens. |
| **Icons** | Lucide React | `0.470+` | Crisp, scalable SVG vector iconography. |
| **Cloud Services** | Google Cloud Run | Managed | Auto-scaling serverless containers with 0-to-N elasticity. |
| **Hosting** | Firebase Hosting | CDN Global | Edge CDN serving SPA assets with `/api/**` rewrites to Cloud Run. |

---

## 3. Multi-Agent Engine Specification

### 3.1 Dual-Mode Architecture Philosophy
A core engineering requirement for Shaheen is **100% Zero-Failure Guarantee**. During live judging, hackathon demonstrations, or network instability, an external API timeout or quota limit must **never crash the system**. 
* **Mode 1 (Online):** When `GEMINI_API_KEY` is present, executes Gemini 2.5 Flash via `google-genai` for deep cognitive synthesis.
* **Mode 2 (Deterministic Fallback):** If the key is missing or an exception occurs, the system instantly executes its embedded deterministic NLP and graph heuristics engine. Execution time drops to **$< 2\text{ ms}$** with zero downtime.

### 3.2 Agent 1: `CoercionDetectorAgent`
* **File:** `/backend/agents.py`
* **Model:** `gemini-2.5-flash` (Structured Output JSON)
* **Configuration:** `temperature=0.1`, `response_mime_type="application/json"`
* **Detection Dimensions:**
  1. *Authority Impersonation:* Claimed agency (FIA, SBP, Police, GHQ, NAB, Customs).
  2. *Urgency Compression:* Imposition of artificial deadlines ("10 minutes", "immediately").
  3. *Coercive Threat:* Arrest under PECA Section 21, physical raid, door breach.
  4. *Credential Coercion:* Demanding OTP, screen-sharing via AnyDesk/TeamViewer.
  5. *Social Isolation:* Commands preventing communication with family members or bank staff.
  6. *Legitimate Counter-Indicators:* Medical surgery MRN, institutional title accounts (Shaukat Khanum Hospital, NUST).

### 3.3 Agent 2: `MuleGraphHunterAgent`
* **File:** `/backend/agents.py`
* **Graph Evaluation Logic:**
  $$\text{Mule Score} = \sum \text{Risk Weights}(\text{Age}, \text{KYC}, \text{FanIn}, \text{Device}, \text{Drain}, \text{Wash})$$
  * **Account Age:** $< 7\text{ days}$ ($+30\text{ pts}$); $< 30\text{ days}$ ($+15\text{ pts}$).
  * **KYC Onboarding:** Tier 0 digital bypass ($+25\text{ pts}$); Tier 3 Institutional ($-25\text{ pts}$).
  * **Shared Device Fingerprint:** Same `DEV-MULE-8812` across multiple nodes ($+30\text{ pts}$).
  * **Fan-In Velocity:** $\ge 5$ concurrent feeder deposits structured under Rs. 50k ($+30\text{ pts}$).
  * **Outbound Drain Velocity:** Outgoing transfer initiated within 5 minutes to P2P crypto or ATM ($+25\text{ pts}$).
  * **Circular Routing:** Closed loop $A \rightarrow B \rightarrow A$ wash-trading ($+35\text{ pts}$).

### 3.4 Agent 3: `ActiveDecoyAndSarAgent`
* **File:** `/backend/agents.py`
* **Sub-module A (Honeypot Chat):**
  * Persona: *"Haji Saleem"*, a 68-year-old technologically confused customer terrified of arrest.
  * Bait Mechanism: Simulates transfer failure with `Error E-409: Security Interlock - Beneficiary Limit Exceeded`. Urgently solicits backup IBANs, other bank titles, or Raast phone numbers.
* **Sub-module B (Regex & NLP IOC Harvester):**
  * Pakistani IBANs: `r'\b(PK\s*\d{2}\s*[A-Za-z]{4}\s*[0-9A-Za-z]{12,18})\b'`
  * Pakistani Mobile/Raast: `r'(?:\+92|0092|0)?\s*(3[0-4]\d{1})[\s-]?(\d{7})\b'`
  * Pakistani CNIC: `r'\b(\d{5}-\d{7}-\d{1})\b'`
  * Crypto Wallets: `r'\b(0x[a-fA-F0-9]{40}|T[A-Za-z1-9]{33})\b'`
* **Sub-module C (Regulatory SAR Generator):**
  * Produces complete Markdown filing conforming to SBP AMLA 2010 Section 7 and BPRD Circular No. 03 of 2023.

---

## 4. API Endpoints Specification

### 4.1 Health Check
* **Path:** `GET /api/health`
* **Description:** Returns deployment environment, Firestore connectivity state, and Gemini readiness.
* **Response (200 OK):**
```json
{
  "status": "healthy",
  "service": "Shaheen Interceptor Cloud Run Service",
  "version": "1.0.0",
  "cloud_run_environment": "local-development",
  "firestore_mode": "LIVE_FIRESTORE" | "IN_MEMORY_MIRROR",
  "gemini_mode": "ONLINE_GEMINI_2_5_FLASH" | "DETERMINISTIC_FALLBACK_READY",
  "model": "gemini-2.5-flash",
  "uptime_seconds": 120.4,
  "timestamp": "2026-10-15T15:00:00Z"
}
```

### 4.2 Interactive Scenarios
* **Path:** `GET /api/scenarios`
* **Description:** Returns pre-loaded banking attack vectors with 3-hop graph topologies.
* **Response (200 OK):** Array containing `SCENARIO_1_VISHING`, `SCENARIO_2_SMURFING`, `SCENARIO_3_CLEAN_HOSPITAL`.

### 4.3 Transaction Analysis (Core Intercept)
* **Path:** `POST /api/analyze-transaction`
* **Request Payload:**
```json
{
  "scenario_id": "SCENARIO_1_VISHING",
  "transcript": "Optional custom transcript string...",
  "amount": 450000.0,
  "sender": { "name": "...", "iban": "..." },
  "receiver": { "name": "...", "iban": "..." }
}
```
* **Execution:** Concurrently invokes `Agent 1` and `Agent 2` via `asyncio.gather`.
* **Response (200 OK):**
```json
{
  "alert_id": "ALT-992140",
  "verdict": "QUARANTINED" | "FLAGGED" | "CLEARED",
  "combined_risk_score": 97,
  "coercion_score": 98,
  "mule_risk_score": 96,
  "latency_ms": 680.5,
  "detected_tactics": ["Authority Impersonation (FIA)", "Urgency Trap"],
  "highlighted_phrases": ["Main Inspector Tariq baat kar raha hoon..."],
  "graph_anomalies": ["EPHEMERAL_ACCOUNT_AGE_4_DAYS", "SHARED_DEVICE_FINGERPRINT"],
  "graph_topology": { "nodes": [...], "edges": [...] }
}
```

### 4.4 Decoy Chat
* **Path:** `POST /api/decoy/chat`
* **Request Payload:**
```json
{
  "session_id": "DEC-992140",
  "scammer_message": "Send immediately to backup account PK78HABB00034827190001",
  "history": [...]
}
```
* **Response (200 OK):**
```json
{
  "session_id": "DEC-992140",
  "reply": "Beta shukriya, main ne naya account note kar liya hai...",
  "captured_iocs": [
    { "type": "IBAN", "value": "PK78HABB00034827190001", "confidence": 0.98 }
  ],
  "cumulative_iocs": [...]
}
```

### 4.5 SAR Generation
* **Path:** `POST /api/generate-sar`
* **Request Payload:** `{ "alert_id": "ALT-992140" }`
* **Response (200 OK):** `{ "report_id": "SAR-...", "generated_markdown": "# SUSPICIOUS ACTIVITY REPORT..." }`

### 4.6 Benchmark Suite (Slide 12 Metrics)
* **Path:** `POST /api/run-benchmark`
* **Request Payload:** `{}`
* **Response (200 OK):**
```json
{
  "run_id": "BENCH-992140",
  "total_test_cases": 20,
  "metrics": {
    "detection_recall_percent": 100.0,
    "false_positive_rate_percent": 0.0,
    "precision_percent": 100.0,
    "accuracy_percent": 100.0,
    "avg_latency_ms": 0.8,
    "total_benchmark_time_ms": 16.1
  },
  "confusion_matrix": { "true_positives": 15, "false_negatives": 0, "true_negatives": 5, "false_positives": 0 },
  "results": [...]
}
```

---

## 5. Dual-Persistence Layer Architecture

```
                         [ INCOMING WRITE ]
                                 │
             ┌───────────────────┴───────────────────┐
             ▼                                       ▼
  [ IN-MEMORY STORE ]                   [ FIRESTORE CLIENT ]
- Zero Latency Read                   - Cloud Run ADC / Key
- Instant Synchronous Dict            - Background Async Write
- 100% Offline Resilience             - Multi-Region Durability
```

The `StorageManager` class in `/backend/main.py` provides transparent persistence:
1. Every write operation (`save_alert`, `save_decoy_session`, `save_sar_report`) immediately writes to thread-safe internal dictionaries.
2. If `self.is_firestore_connected` is true, it asynchronously mirrors the write to the respective Firestore collection (`active_alerts`, `decoy_sessions`, `sar_reports`).
3. If Firestore credentials are missing in local dev, it logs an informational note and continues serving requests from memory with zero errors.

---

## 6. Performance & Latency Budget

To intercept a transaction **before settlement**, the system operates well within the 1Link/Raast 3,000 ms SLA:

```
[ INGESTION ] ────► [ PARALLEL AGENTS ] ────► [ RISK FUSION ] ────► [ WRITE & RESPOND ]
  10 - 20 ms             600 - 750 ms              2 - 5 ms               15 - 30 ms
                                                                    Total: ~650 - 800 ms
```

* **Network Ingestion & Deserialization:** $10\text{--}20\text{ ms}$
* **Agent 1 (Gemini 2.5 Flash Structured Inference):** $550\text{--}750\text{ ms}$
* **Agent 2 (3-Hop Graph Telemetry Traversal):** $< 5\text{ ms}$ (concurrent with Agent 1)
* **Risk Fusion & Threshold Evaluation:** $< 1\text{ ms}$
* **Persistence & Serialization:** $15\text{--}30\text{ ms}$
* **Total End-to-End Latency:** **$\approx 650\text{--}800\text{ ms}$** (Well below the $3,000\text{ ms}$ threshold!).
* **Deterministic Fallback Latency:** **$< 3\text{ ms}$** total.

---

## 7. Cloud Run Container Deployment Configuration

```dockerfile
# Multi-stage minimal production image
FROM python:3.12-slim
ENV PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1 PORT=8080
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8080
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
```

* **Cloud Run Spec:**
  * CPU: 1 vCPU (Serverless, scales down to 0).
  * Memory: 512 MiB minimum, 1 GiB recommended.
  * Ingress: All (Public HTTP/HTTPS).
  * Concurrency: 80 requests per container instance.
