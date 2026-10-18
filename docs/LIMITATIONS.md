# Shaheen Interceptor — System Limitations & Operational Boundaries

**Classification:** Engineering Disclosure & Competition Governance
**Scope:** Transparently documents the boundary conditions, operational
assumptions, and technical limits of the Shaheen Interceptor prototype.

The measured numbers in this document reflect the frozen evaluation
(`eval/heldout.json`, SHA-256 `9d650f03754dc84f02c637c4dfb3a4e698a497d175d6241a7328dc2ff545cb55`)
against the current rules baseline (Config A). Numbers for the Gemini
configurations (B and C) are pending a rerun with a working `GEMINI_API_KEY`.

---

## 1. Prototype vs. Core Banking Integration Scope

- **Pre-settlement screening service.** The prototype is asynchronous
  pre-settlement screening. A production core-banking deployment (e.g.
  1Link or SBP Raast) requires formal ISO 8583 / ISO 20022 message
  transformation hooks and clearing network accreditation. This
  prototype does not do that work.
- **Simulated voice telemetry.** Call transcripts and audio signals
  come from scenario payloads or uploaded WAV files. Real-time voice
  telemetry requires customer consent in the mobile banking app or
  lawful intercept integration with the carrier — neither is
  implemented here.

---

## 2. Dataset Realism & Synthetic Nature

- **Synthetic benchmarks.** All 40 held-out cases are synthetically
  constructed from an independent seed
  (`SHAHEEN_HARDCASE_2026`). No real customer banking records or PII
  are used. This is a limitation: production behaviour on real
  telemetry is not measured.
- **Fictional IBANs.** Pakistani IBANs are programmatically
  constructed with ISO 7064 MOD 97-10 check digits so they are
  syntactically valid but refer to no real account.
- **Small-n confidence width.** With n = 40, the Wilson 95% CI on FPR
  is `[1.0%, 25.8%]`. A single false positive produces a wide upper
  bound. Report the CI, not the point estimate, when presenting the
  number.

---

## 3. Algorithmic Failure Modes & Blindspots

Measured on the frozen held-out set (Config A, 90.9% recall, 5.6% FPR):

- **HO-SCAM-10** (missed fraud): soft-urgency scam with no authority
  impersonation or threats. The language paraphrases around the
  keyword taxonomy; the beneficiary account is old, Tier 2/3 KYC,
  with no graph anomaly. **Real detection gap.**
- **HO-SCAM-11** (missed fraud): clinical urgency wrapped in a
  legitimate medical-billing frame. Same failure mode — legitimate-
  sounding language, aged account, no graph signal. **Real detection
  gap.**
- **HO-CLEAN-06** (false positive): legitimate bank fraud-prevention
  cell calling a real customer. The call legitimately contains
  urgency and suspicious-activity language. The detector cannot
  distinguish a real bank from an impersonator without authenticated
  caller ID or a bank-side verification channel.

Additional structural blindspots (not specific to the 40-case set):

- **Cold / offline non-conversational transfers.** If a victim
  transfers funds without any call or message, Agent 1 produces a
  zero score. Interception relies entirely on Agent 2 graph features.
  Aged Tier 2/3 accounts have no graph anomaly either and will be
  missed.
- **Multi-stage physical coercion.** Extortion or in-person coercion
  that leaves no digital or verbal artifact cannot be captured.
- **Low-frequency / spaced structuring.** A mule network spacing
  smurfing transfers across weeks and institutions, with no shared
  device hash or common graph connection, will not surface through
  localized graph traversal.

---

## 4. Latency & Network Dependency

- **Local rules path.** Measured on the frozen 40-case set: **sub-10
  ms p50, sub-30 ms p95**, deterministic, no network. This is the
  latency quoted in `docs/EVALUATION.md`.
- **Live Gemini path.** Latency depends on Cloud Run instance sizing
  and the current Flash model. **Do not quote a specific number for
  the live path** — it has not been measured in this run, and quoting
  an unmeasured number is exactly what this project was rewritten to
  stop doing.
- **Fallback guarantees a decision.** When the LLM is unavailable,
  the deterministic engine produces a verdict. The verdict is
  recorded with `engine: "deterministic_fallback"` or
  `"ERROR_FALLBACK"` in the audit trail so reviewers know which
  engine made the call.

---

## 5. Server-Side and Infrastructure Limitations

- **Rate limiting is single-node.** Rate limits live in process
  memory and do not hold across Cloud Run instances. Production
  requires Redis. Documented in `docs/THREAT_MODEL.md` §3.5.
- **No row-level security.** The demo uses a single tenant. A
  multi-tenant production deployment requires RLS on the database
  layer; it is not implemented here.
- **In-memory state, no persistence.** Case audit logs, cached
  results, and session state are in-process. This prototype is not
  horizontally scalable as-is.
- **Institutional registry is seed-loaded.** The verified-institution
  registry is hardcoded in `backend/verified_registry.py`. Production
  requires a managed source of truth with change auditing.

---

## 6. Regulatory & Compliance Notice

- **SAR/STR drafts are drafts.** Generated reports are marked
  `DRAFT — FOR COMPLIANCE ANALYST REVIEW. NOT FILED.` They do not
  constitute automatic filings with the Financial Monitoring Unit or
  law enforcement. Final reporting decisions require human compliance
  officer review.
- **Prompt-injection defense is a floor, not a shield.** The
  server-side adversarial marker floor raises the risk score to 80
  when prompt-injection markers are detected in untrusted input. It
  is a defense that makes attacker attempts *worse for the
  attacker*; it is not a guarantee against novel injection
  techniques.

---

## 7. What this project is not

- Not a claim of 100% recall. Measured recall on the frozen held-out
  set is 90.9% with 2 honest misses documented above.
- Not a claim of production rate limiting. In-memory, single-node.
- Not a claim that the LLM makes the decision. The LLM proposes; a
  Python rule engine with a server-side adversarial floor decides.
- Not a claim of live-bank deployment. A deploy script is included and
  syntax-checked; the system has not been run on real bank traffic.

---

*This document reflects the state of the frozen evaluation as of the
last `run_eval.py` execution against SHA-256 `9d650f03754d...`. If
any claim here conflicts with `docs/EVALUATION.md` or
`docs/AUDIT_REPORT.md`, the code and the digest win and this file
should be updated.*
