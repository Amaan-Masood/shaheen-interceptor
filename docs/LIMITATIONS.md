# Shaheen Interceptor — System Limitations & Operational Boundaries

**Classification:** Engineering Disclosure & Competition Governance  
**Scope:** Transparently documents the boundary conditions, operational assumptions, and technical limits of the Shaheen Interceptor prototype.

---

## 1. Prototype vs. Core Banking Integration Scope
* **Simulated Pre-Settlement Switch**: The prototype acts as an asynchronous pre-settlement screening service. In an actual production core banking deployment (e.g., 1Link or SBP Raast switch), an inline proxy requires formal ISO 8583 / ISO 20022 message transformation hooks and formal clearing network accreditation.
* **Telecommunications Signal Acquisition**: In this prototype, call transcripts and acoustic signals are supplied via simulated scenario payloads or direct audio file upload. In production, real-time voice telemetry requires customer consent on the mobile banking application (using Android/iOS accessibility/overlay security permissions) or direct lawful intercept integration with telecommunications operators.

---

## 2. Dataset Realism & Synthetic Nature
* **Synthetic Benchmarks**: All scenarios in `eval/dev.json` (20 cases) and `eval/heldout.json` (40 cases) are synthetically constructed to represent real-world fraud vectors without utilizing real customer banking records or personally identifiable financial data.
* **IBAN Compliance**: Fictional Pakistani IBANs are programmatically constructed using ISO 7064 MOD 97-10 check digits to maintain syntactic validity while remaining completely fictional.

---

## 3. Algorithmic Failure Modes & Blindspots
* **Cold / Offline Non-Conversational Transfers**: If an account holder transfers funds without any ongoing phone call, message, or linguistic interaction, Agent 1 produces a zero score. Interception then relies entirely on Agent 2's topological graph features (device sharing, account age, structuring, circularity).
* **Multi-Stage Physical Coercion**: Extortion or in-person coercion where no digital or verbal communication passes through telecommunication channels cannot be captured by NLP or audio telemetry.
* **Low-Frequency / Spaced Structuring**: If a money mule network spaces smurfing transfers over weeks or across multiple unrelated banking institutions without shared device hashes or common graph connections, localized graph traversal may not detect the broader syndicate.

---

## 4. Latency & Network Dependency
* **Online Mode (Gemini 2.5 Flash)**: Cloud Run inference latency typically ranges between 600 ms and 850 ms depending on network round trips and region location. While well inside Raast's 3,000 ms SLA, extreme network degradation could delay analysis.
* **Offline Fallback Baseline**: To guarantee continuous availability, the system includes a high-speed deterministic regex and topological heuristic engine that executes in under 3 ms. However, deterministic regex cannot capture novel or subtle semantic nuances as effectively as large language models.

---

## 5. Regulatory & Compliance Notice
* **Illustrative SAR/STR Drafts**: Generated Suspicious Activity Reports (SAR/STR) are drafts produced for compliance analyst investigation. They do not constitute automatic legal filings with the Financial Monitoring Unit (FMU) or law enforcement agencies. Final reporting decisions require human compliance officer review.
