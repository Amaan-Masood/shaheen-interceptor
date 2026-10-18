# Shaheen Interceptor — Bank Integration Model

**Purpose:** The one-page answer to "how does this actually plug into a
real banking system?" Judges and technical due-diligence reviewers will
ask this. This document gives the concrete, industry-aligned answer.

**TL;DR:** Shaheen runs as a REST API **inside the bank's mobile app
backend**. It is called pre-submit — before the transaction hits Raast
or 1Link. The bank's app decides the customer-facing UX. Customers
never see Shaheen. This is the same integration pattern used by Sift,
ComplyAdvantage, and Compliance.ai globally.

---

## 1. The three integration models (and why we picked one)

### 1.1 Separate consumer app — NOT this

A bank customer installs a second app to protect their payments.

- **Why it fails:** Customers do not switch apps mid-transaction.
  Payment apps are one-shot actions; no app-switching tolerance.
- **Value ceiling:** Post-hoc monitoring only. Cannot intercept
  pre-settlement. Cannot stop the money leaving.
- **Market proof this does not work:** Every "safety app" startup of
  the last decade died or pivoted to B2B.

### 1.2 Switch-level inline engine — NOT (yet)

Shaheen sits inside the Raast / 1Link switch itself, inline with the
clearing protocol.

- **What it takes:** SBP payment system accreditation, ISO 8583 and
  ISO 20022 message transformation, formal clearing network
  membership.
- **Timeline:** 6 to 12 months of regulatory work before a first
  production call.
- **Who can do this:** Visa Acquirer Fraud Monitoring Service (AFMS),
  Mastercard Send Fraud Check. Legacy networks, not startups.
- **Our position:** This is the **Year 3+** target if and only if SBP
  opens the switch-accreditation door to domestic fintechs. It is
  not in the prototype scope. We say so openly.

### 1.3 Bank-side REST API — THIS (deployable now)

Shaheen runs as a service the bank's mobile app backend calls. The
bank is the customer; the bank decides when and how to call us.

- **Integration surface:** One REST endpoint, `POST /v1/assess`.
  JSON in, JSON out. Sub-second latency on our side.
- **Position in the flow:** Pre-submit. Called after the bank has
  validated credentials and before it forwards to Raast / 1Link.
- **Deployment:** SaaS, VPC, or on-premise (see section 4).
- **Market proof this pattern works:** Sift, ComplyAdvantage,
  Compliance.ai, Nectria, Featurespace. Every global enterprise
  fraud API is deployed this way.

---

## 2. The exact runtime flow

```
[Customer taps "Send" in HBL Mobile App]
            │
            ▼
[HBL Mobile Backend] — validates credentials, checks daily limits
            │
            ▼
[HBL calls POST /v1/assess on Shaheen]  ─────┐
        body: {                              │  SLA: < 3,000 ms
          transaction: {amount, iban, ...},  │
          call_context: {transcript?,        │
                         audio_rms?,         │
                         caller_number?},    │
          graph_signals: {account_age_days,  │
                          device_hash,       │
                          velocity_24h}       │
        }                                    │
            │                                │
            ▼                                ▼
[Shaheen pipeline.evaluate_transaction]
        - Agent 1: coercion & vishing scoring
        - Agent 2: mule graph scoring
        - Server-side institutional registry check
        - Server-side adversarial prompt-injection floor
            │
            ▼
[Return in <3s]
        verdict: APPROVE | WARN | QUARANTINE
        risk_score: 0..100
        reason_codes: [ ... ]
        agent_evidence: { ... }
        decision_latency_ms: 842
        engine: gemini | deterministic_fallback
            │
            ▼
[HBL Mobile Backend branches on verdict]
  APPROVE    → continue to Raast / 1Link, show customer success
  WARN       → show in-app warning banner with reason,
               customer can still proceed with explicit confirm
  QUARANTINE → hold transaction, alert bank's compliance queue,
               auto-generate SAR draft for analyst review
```

### What the customer sees

**The bank decides.** Shaheen returns a verdict and reason codes;
the bank's own UX layer shows whatever the bank wants. Common
patterns in production fraud engines:

- **APPROVE:** No additional UI. Payment completes as normal.
- **WARN:** Banner like *"This payment has unusual characteristics.
  Would you like to confirm?"* Customer clicks confirm or abort.
- **QUARANTINE:** Payment blocked. Customer sees
  *"This transaction has been held for security review. Your bank's
  fraud team will contact you within 4 business hours."*

### What Shaheen does NOT do

- **Does not modify the transaction.** Read-only on payment data.
- **Does not speak to the customer.** No direct consumer touchpoint.
- **Does not file with the FMU.** Generates SAR *drafts* marked
  `DRAFT — FOR COMPLIANCE ANALYST REVIEW. NOT FILED.` The bank's
  compliance team reviews and files.
- **Does not make the bank's credit decision.** Returns a risk
  signal; the bank's own policy engine is the final authority.

---

## 3. Integration cost for a bank

| Effort | Time |
|--------|------|
| Backend engineer writes one HTTP client call to `POST /v1/assess` | 1–2 days |
| Schema mapping from bank's internal transaction format to our JSON | 3–5 days |
| Verdict branching logic in the payment flow (APPROVE / WARN / QUARANTINE) | 2–3 days |
| Sandbox integration testing against our dev environment | 1 week |
| SOC analyst onboarding to our alert dashboard | 2–3 days |
| **Total for a pilot go-live** | **2–3 weeks** |

This is why this pattern wins. Compare to switch-level: 6–12 months
of regulatory paperwork and clearance protocol integration.

---

## 4. Three deployment models for different bank tiers

### 4.1 SaaS (Cloud Run) — Fastest pilot

- **Where Shaheen runs:** Our Cloud Run, region `asia-south1`
  (Mumbai) or `asia-south2` (Delhi), both inside GCP's Pakistan-
  adjacent egress.
- **Bank side:** Calls our public HTTPS endpoint. Traffic encrypted
  in transit with TLS 1.3. Data minimized — we take only the fields
  needed for scoring, no full transaction record.
- **Data handling:** Transaction details are scored in-memory and
  discarded after the response. No long-term storage. Retention
  audit logs only.
- **Best fit:** Neobanks and digital wallets (SadaPay, NayaPay,
  JazzCash, Easypaisa) that already operate on public cloud APIs.
- **Pilot cost to bank:** Zero infrastructure. Zero setup.
- **Our cost to run:** ~$0.50–$2 per 1,000 assessment calls at
  Cloud Run scale-to-zero pricing.

### 4.2 VPC Deploy (Docker image in the bank's private network)

- **Where Shaheen runs:** Inside the bank's VPC, as a containerized
  service on their Kubernetes or Cloud Run private endpoint.
- **Bank side:** Our Docker image (`shaheen-engine:2026.10`), our
  Helm chart, our API. The bank manages hosting; we maintain the
  image and push updates on a monthly release cycle.
- **Data handling:** All data stays inside the bank's network.
  Nothing leaves. Only metadata (aggregated risk distributions,
  alert counts) is reported back to us for model iteration.
- **Best fit:** Mid-tier banks with digital transformation programs
  (Meezan, UBL digital initiative, Bank Alfalah digital).
- **Pilot cost to bank:** Standard container orchestration. No new
  cloud budget line.
- **Our revenue model:** Per-month platform fee + per-1,000-call
  usage tier. Standard SaaS pricing.

### 4.3 On-Premise (Bank's data center)

- **Where Shaheen runs:** On-premise in the bank's own data center.
  Bare-metal or VMware. Our engineering team deploys.
- **Best fit:** Tier-1 banks (UBL, NBP, MCB) and regulated
  institutions where data must not leave the bank's premises under
  any circumstances.
- **Cost to bank:** Highest. Requires physical hosting, dedicated
  integration engineering, and annual support contracts.
- **When we will offer this:** After 12+ months of SaaS and VPC
  deployments have proven the platform. On-premise is a premium
  tier for tier-1 banks, not a startup's first product.

---

## 5. What we have vs what we don't

**What we have today (in this repository):**

- Working REST API (`POST /api/analyze-transaction`) that accepts
  the exact input shape a bank integration would send.
- Measured performance on a frozen 40-case held-out dataset:
  90.9% recall, 5.6% FPR, sub-10 ms p50 decision latency.
- Deterministic fallback engine that produces a decision even when
  the LLM path is unavailable.
- Full security architecture for production deployment (see
  `docs/THREAT_MODEL.md`).
- Dockerized backend, `deploy.sh` ready for Cloud Run.
- SOC dashboard (this frontend) that a bank's fraud analyst team
  would use to review alerts.
- Compliance tooling (SAR draft generation) already in the pipeline.

**What we do NOT have yet (honest):**

- No integration with a live bank. No production traffic.
- No SBP accreditation. Not a licensed payment service provider.
- No ISO 8583 or ISO 20022 message transformation. This is a
  pre-submit REST API, not a switch plug-in.
- No audited data processing agreement (DPA) with any regulator.
- The `eval/heldout.json` dataset is synthetic. Real-world
  performance on live Raast traffic is unmeasured and will differ.

**Why we say this honestly:** Every pitch deck that claims
integration without having integration will be caught by judges
who have been at 5 previous hackathons. The defensible claim is
*"we have the working engine and the API surface; the bank
integration is a 3-week pilot away; here is the industry pattern
and the exact endpoint schema."*

---

## 6. Pakistan-specific roadmap

| Phase | Timeline | Target customer | Rationale |
|-------|----------|-----------------|-----------|
| **Pilot 1 (SaaS)** | Month 3–6 | SadaPay or NayaPay | Digital-native backend, easier to integrate, first live production data |
| **Pilot 2 (SaaS)** | Month 6–9 | JazzCash or Easypaisa | Massive transaction volume, high fraud loss base, urgent pain point |
| **Pilot 3 (VPC)** | Month 9–15 | Meezan or HBL digital | First mid-tier bank integration, first private deployment |
| **Pilot 4 (VPC)** | Month 15–24 | Standard Chartered PK, Habib Metro | Multi-bank reference set, product-metrics iteration |
| **Pilot 5 (On-premise)** | Month 18–36 | UBL, NBP, MCB | Tier-1 banks with data sovereignty mandates |
| **Pilot 6 (Switch)** | Year 3+ | Raast / 1Link | Only if SBP opens switch accreditation to domestic fintechs |

**First customer selection criteria:**
- Transaction volume above 1M per day (fraud loss base is measurable)
- Modern enough backend to add a REST call in <1 sprint
- Willingness to pilot with a domestic AI startup
- Not a neobank that already has an in-house fraud team
- Executive sponsor at CRO level (chief risk officer)

---

## 7. Judge questions and answers

### Q1: "How does this actually integrate with a real bank?"

**A:** It runs as a REST API inside the bank's mobile app backend,
called pre-submit before the transaction hits Raast or 1Link. The
bank calls us with the transaction details, gets a verdict back in
under 3 seconds, and branches on the result. Customers never see
Shaheen directly. This is the same pattern as Sift,
ComplyAdvantage, and Compliance.ai globally. A 3-week pilot
integration, not a 3-year regulatory path.

### Q2: "Do you have any live bank integration?"

**A:** No. This is a prototype. What we have is a working engine
with measured 90.9% recall on a frozen 40-case held-out dataset, a
REST API that takes the inputs a real bank integration would send,
and a full security architecture. The demo dashboard is what a
bank's SOC team would use to review alerts. The bank integration
itself is a 3-week pilot away — SadaPay or JazzCash would be the
natural first customer.

### Q3: "Why not integrate directly with the Raast switch?"

**A:** That is a real option and it is the Year 3+ target. It
requires SBP accreditation, ISO 8583 compliance, and clearing
network membership — 6 to 12 months of regulatory work. It is not
in the prototype scope, and pretending it is would be dishonest.
What we can do today is plug into any bank's backend. If SBP opens
the switch-accreditation door to domestic fintechs, we are
positioned to move there next.

### Q4: "What about customer privacy and data protection?"

**A:** Three-tier data handling based on deployment model. SaaS:
we take only the fields needed for scoring, no full transaction
record, and we discard in-memory after response — no long-term
storage. VPC: all data stays inside the bank's network, only
aggregated metadata comes back to us. On-premise: nothing leaves
the bank at all. In all cases, we comply with Pakistan's Personal
Data Protection Bill (once enacted) and current State Bank of
Pakistan circulars on customer data.

### Q5: "How is this different from existing fraud detection vendors?"

**A:** Three things. One: we are built for Raast's pre-settlement
window specifically — most vendors are post-transaction monitoring.
Two: the linguistic engine is trained on Urdu and Roman Urdu vishing
patterns, not English-only. Three: the deterministic fallback runs
sub-10 ms locally, so a Gemini outage does not block decisions —
many global vendors depend on their LLM being up.

### Q6: "What happens if Shaheen is down when a transaction comes in?"

**A:** The bank's backend has a timeout of 3 seconds on our call.
If we don't respond, the bank's default policy kicks in — typically
"continue to switch with a hold flag" or "queue for manual review."
The bank decides the failure mode, not us. Our own internal
fallback (deterministic engine, sub-10 ms) is a second line of
defense if the LLM path is down but our service is up.

### Q7: "How do you charge for this?"

**A:** Two tiers. A per-month platform fee covering deployment,
support, and monthly releases. Plus a per-1,000-call usage tier
on top. On the sandbox SaaS tier during pilot, pricing is
negotiated per-partner. This is standard SaaS fraud vendor pricing
— same structure as Sift, ComplyAdvantage, and Featurespace.

---

## 8. One-sentence answers (for time-constrained judges)

| Question | One-sentence answer |
|----------|---------------------|
| What kind of system is this? | A REST API fraud engine that banks call pre-submit. |
| Does the customer see it? | No. Customers see the bank's own app. |
| Is it a separate app? | No. Bank integrates it into their existing app backend. |
| Is it switch-level? | Not yet. That's a Year 3+ target with SBP accreditation. |
| What's the latency? | Sub-3 seconds total, sub-10 ms p50 on the rules path. |
| What if it's down? | Bank's own timeout and fail-mode policy kicks in. |
| Who uses it? | Bank fraud teams and compliance officers, not customers. |
| Is it deployed anywhere? | No. Prototype with a 3-week integration path to first pilot. |

---

*This document is a technical architecture guide. It reflects the
state of the prototype as of the current commit. If any claim
here conflicts with `docs/EVALUATION.md`, `docs/LIMITATIONS.md`, or
`docs/THREAT_MODEL.md`, the code and the SHA-256 digest of
`eval/heldout.json` win, and this file should be updated.*
