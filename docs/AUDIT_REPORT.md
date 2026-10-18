# SHAHEEN INTERCEPTOR — Independent Audit Report

| | |
| :--- | :--- |
| **Audit date** | 2026-10-18 |
| **Branch audited** | `fix/integrity` @ `615b651` |
| **Scope** | Full repo — `backend/`, `frontend/`, `eval/`, `scripts/`, `docs/`, deploy & secrets |
| **Method** | Source read + live execution. Every metric below was recomputed, not copied from project docs. |
| **Auditor stance** | Adversarial. Optimized to find what a bank-facing judge will catch. |

---

## 1. Executive Verdict

**The P0 remediation is genuine and holds up.** This is not the pre-fix codebase. The original fabrication problems (fake latency constants, label leakage, client-controlled institutional bypass, ungrounded marketing) are actually resolved, and the headline evaluation numbers were independently reproduced by the auditor.

**However, four demo-blocking defects remain — two of which are the same class of problem that was just remediated.**

| | Count |
| :--- | :---: |
| CRITICAL (demo-blocking) | **4** |
| HIGH | **13** |
| LOW / housekeeping | **7** |
| Spec completion | **~90%** |
| Tests | 9 / 9 passing |
| Committed secrets | **0 found** |

> **One-line summary:** the demo will impress; the evaluation will not survive interrogation. The AI half of the pitch (Gemini) has never actually been executed, and the test set is separable by a one-line rule.

---

## 2. Methodology

| Action | Command | Result |
| :--- | :--- | :--- |
| Re-ran full held-out eval | `python scripts/run_eval.py --dataset eval/heldout.json` | 40/40 correct. 100% recall, 0.0% FPR **reproduced** |
| Exercised benchmark endpoint | `POST /api/run-benchmark?live=true` | 200 OK, but **20 cases** not 40 |
| Verified dataset digest | `sha256sum eval/heldout.json` | **MISMATCH** vs documented value |
| Cross-checked digest in git | `git show HEAD:eval/heldout.json \| sha256sum` | matches documented value |
| Baseline attack | hand-rolled rule vs all 40 cases | **100% recall / 0.0% FPR** — see C1 |
| Confirmed no label leakage | read `pipeline.py:31-44` signature + all call sites | confirmed |
| Reimplemented Wilson CI | hand-computed against `run_eval.py:38-52` | arithmetic correct |
| Secret sweep | regex grep repo-wide (excl. `node_modules`, `.git`) | 0 matches |

**Side effect disclosed:** running `run_eval.py` silently overwrote the committed `eval/REPORT.md` and created an extra `eval/results/eval_run_*.json`. See [Appendix B](#appendix-b--working-tree-hygiene).

---

## 3. Verified Solid — Do Not Touch

These are genuine, well-implemented, and above median for a hackathon. Preserve them.

### 3.1 Architecture integrity

| Check | Evidence | Verdict |
| :--- | :--- | :--- |
| Single canonical pipeline | `main.py:350`, `main.py:621`, `run_eval.py:124` all call `evaluate_transaction` | ✅ 3/3 call sites unified |
| Zero label leakage | `pipeline.py:31-44` accepts only raw features; `main.py:639` reads `type` only *after* verdict | ✅ |
| Institutional bypass server-gated | `verified_registry.py:75-77` IBAN-only lookup; `pipeline.py:86` dual gate (`mule < 20` **and** `coercion < 25`) | ✅ Client-supplied `role`/name cannot trigger exemption |

### 3.2 OWASP LLM01 prompt-injection defense

Real, not cosmetic — three layered controls:

1. `agents.py:214-216` —  explicitly forbids obeying transcript content
2. `agents.py:240-242` — untrusted transcript wrapped in `<transcript>…</transcript>` delimiters
3. `agents.py:287-298` — server-side regex guard (6 patterns) + `agents.py:264-267` **irreversible score floor ≥ 80**, so an attack can never *lower* a risk verdict

### 3.3 Real computation, not canned values

| Claim | Evidence | Verdict |
| :--- | :--- | :--- |
| SAR digest is cryptographic | `agents.py:817-818` — `hashlib.sha256` over canonical key-sorted JSON | ✅ not `hash()` |
| Audio RMS/dBFS is measured | `main.py:477-496` — real WAV byte parse, real `sqrt(Σs²/n)`, real dBFS | ✅ |
| IOC extraction is real | `agents.py:148-183` — regex + IBAN ISO 7064 MOD 97-10 checksum | ✅ |
| Latency is measured | `pipeline.py:53, 102` — `time.perf_counter()` | ✅ `680.4` / `740` fully absent |
| SAR marked as unfiled | `agents.py:833, 836, 906` — "DRAFT — FOR COMPLIANCE ANALYST REVIEW. NOT FILED." | ✅ |

### 3.4 Frontend demo resilience

`App.jsx` will **not** white-screen in a demo:

- `App.jsx:20` — `API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000"` (deploy-configurable)
- `App.jsx:134-140` — every fetch wrapped in `try/catch` with instant client-side fallback
- `App.jsx:290-299` — **persistent** banner: "OFFLINE DEMO MODE — cached results & deterministic baseline active"
- `TopBar.jsx:112` — Gemini pill honestly renders `FALLBACK` when `gemini_live` is false

### 3.5 Container & secrets hygiene

- `Dockerfile:23-25` — non-root `appuser` UID 1001 ✅
- `Dockerfile:31-32` — real `HEALTHCHECK` against `/api/health` ✅
- `Dockerfile:1` — `python:3.12-slim` pinned (not `:latest`) ✅
- `.dockerignore` excludes `.env`, `serviceAccountKey.json`, `tests/` ✅
- `.gitignore` covers `.env`, `.env.*`, `serviceAccountKey*.json`, `*.pem`, `*.key`, `*.p12` ✅
- **Zero committed secrets** across the entire repo ✅
- CORS allowlist `main.py:240-256` with `allow_credentials=False` ✅
- Input bounds `main.py:265` (transcript 20k), `main.py:276` (message 2k) ✅

### 3.6 Statistical rigor

`run_eval.py:38-52` — Wilson score interval implementation is **correct**: standard formula, `z = 1.95996`, proper `max(0)` / `min(100)` clamps. Hand-verified: 20/20 → `[83.9%, 100%]`, 0/20 → `[0%, 16.1%]`. Arithmetic checks out.

### 3.7 Test quality

9 tests, and they assert **security properties** rather than just HTTP 200: `test_no_label_access`, `test_spoofed_institution_name_not_exempt`, `test_prompt_injection_floor`, `test_sar_real_sha256`, `test_benign_negative_words_not_flagged`. This is better than most submissions.

---

## 4. CRITICAL — Will Be Caught Live

### C1. The test set is separable by ONE feature. 100% proves nothing. ⚠️ BIGGEST FINDING

Inspection of all 40 held-out cases reveals a total partition on a single feature:

| | Fraud cases (20) | Clean cases (20) |
| :--- | :--- | :--- |
| `account_age_days` | **2 – 12** | **1,200 – 4,500** |
| `kyc_tier` | **all `Tier 0`** | Tier 2 / Tier 3 Corporate Institutional |

Auditor baselines:

```python
flag if account_age_days < 60   →  Recall 100.0%  FPR 0.0%
flag if kyc_tier == "Tier 0"    →  Recall 100.0%  FPR 0.0%
```

**Identical to the full multi-agent pipeline.** On this dataset, a one-line rule replaces the coercion NLP engine, the mule graph hunter, and the risk fusion entirely. Nothing in the architecture is doing work the age threshold does not.

**Why this matters in the room:** a judge who samples three cases will notice the fraud beneficiaries are all 2–12 days old at Tier 0, and will ask "did your model do that, or did the fixture?" You cannot answer that well.

**Fix (2–3 hrs, highest payoff):** build a genuinely hard set where every fraud case must be caught by reading the *transcript* — some with aged accounts, Tier 2 KYC, `fan_in: 1`. Some clean cases should contain urgency language ("urgent invoice due today", "regulatory deadline"). Include 4–6 ambiguous cases that deliberately *look* like fraud but are labeled clean. Then report whatever you actually get. **85% recall with a credible CI is worth infinitely more than 100% on a fixture.** Adding a one-liner ablation row ("age-only baseline scores X%") signals senior-level rigor.

### C2. The "frozen dataset" digest is false. The command you publish fails.

```
claimed  (docs/EVALUATION.md:13, eval/heldout.sha256):  39881299449da43f7befc9e4e595e100fd1dd9a80c4c625844d0d365a6e117c9
actual    (eval/heldout.json on disk):                    6b75ef76afbaac452d5d75fb55c65fd8719c172e3ffe44519c715eb688a027b0
git blob  (HEAD:eval/heldout.json):                       39881299449da43f7befc9e4e595e100fd1dd9a80c4c625844d0d365a6e117c9  ✓
```

**Root cause:** `git config core.autocrlf = true` (Git for Windows default, `C:/Program Files/Git/etc/gitconfig`). Git stores the LF blob → `39881299…`; the working tree is CRLF → `6b75ef76…` (35,469 → 36,071 bytes). `git diff` normalizes, so the tree *appears* clean and hides the problem.

**Why this is dangerous:** `docs/EVALUATION.md:15-17` publishes the verification command. Every rigorous judge runs exactly that command — precisely because you told them to — and discovers on their first action that your frozen-dataset integrity claim is broken.

Note also: `run_eval.py:414` hashes `dataset_content.encode("utf-8")` on text-decoded content, so it prints the "correct" `39881299…` value while the documented shell command does not. Two different hashing conventions for one digest.

**Fix (20 min):** add a root `.gitattributes` containing:

```
eval/** text eol=lf
```

Then `git add --renormalize eval/` and re-commit. Update `docs/EVALUATION.md:15-17` so the published command and the code path hash the same bytes.

### C3. The API runs a different dataset than the paper

| Surface | Dataset | Size |
| :--- | :--- | :---: |
| `/api/run-benchmark` (`main.py:563`) | `BENCHMARK_DATASET` from `backend/seed_data.py` | **20** (15 fraud / 5 clean) |
| Paper headline (`docs/EVALUATION.md:37`) | `eval/heldout.json` | **40** (20 / 20) |
| `fallbackData.js:196` | hand-written `FALLBACK_BENCHMARK_CASES` | **3rd copy** |

`BenchmarkModal.jsx:41` correctly says "20 Synthetic BFSI Vectors: 15 Coercion/Mule Cases + 5 Clean Urgent Baselines" — so the 100%/0.0% a judge sees in the **running UI** comes from the 20-case set, not the paper's n=40. Reproducing the headline number requires hand-running a Python script.

**Fix (45 min):** point `/api/run-benchmark` at `eval/heldout.json` and delete the `fallbackData.js` benchmark copy.

### C4. Gemini has never been executed. Configs B and C are unmeasured.

`GEMINI_API_KEY` is unset, so **every** case reports `ERROR_FALLBACK` — including both committed run JSONs. `/api/health` returns `gemini_live: false`; `TopBar.jsx:112` renders **FALLBACK**.

Yet `docs/EVALUATION.md:38-39` still presents "Config B: Gemini Coercion + Rule Graph" and "Config C: Full Pipeline (Gemini + Graph + Fusion)" as measured results. The Gemini agent was silently replaced by the deterministic fallback, and the row received its architecture label back.

`run_eval.py:336` discloses this in a footnote — which is honest — but the table above it does not. **This is structurally identical to the original fabrication:** honest numbers, ungrounded attribution.

Additionally:

- **"650–750 ms live Gemini on Cloud Run"** (`docs/EVALUATION.md:41`) and **"600–850 ms"** (`docs/LIMITATIONS.md` §4) have **no measured source anywhere in the repo.** Two ranges, zero backing.
- `agents.py:251-255` and `agents.py:731-735` call `generate_content(...)` with **no timeout.** A hung Gemini request hangs the request indefinitely — both a DoS vector and the failure mode that would destroy the latency claim.

**Fix (30 min + honesty):** export the key and run once. If Gemini is *worse* than the fallback, say so — *"the deterministic fallback outperformed Gemini 2.5 Flash on this dataset (X% vs Y%); we deploy the fallback primary with Gemini as secondary"* is a far more credible engineering conclusion than an unmeasured "Gemini pipeline." If better, you finally have a real Cloud Run latency number for slide 12.

Add timeouts:

```python
response = self.client.models.generate_content(
    model=self.model_name, contents=prompt, config=config,
    timeout=client.Timeout(connect=5, read=15)   # hard cap
)
```

### C5. `run_eval.py` overwrites committed evidence

The script unconditionally rewrites the committed `eval/REPORT.md` and drops a new `eval/results/eval_run_<ts>.json` into the repo on every run. Auditing "to verify the numbers" destroys the frozen record. No `--dry-run`, no scratch directory, no write guard.

**Fix (15 min):** add `--dry-run` and default `--output-dir` to a gitignored path.

---

## 5. HIGH

| # | Finding | Evidence |
| :--- | :--- | :--- |
| H1 | **No auth, no rate limiting, no security headers, no exception handler.** Zero grep hits across all `backend/*.py` for: `jwt`, `bcrypt`, `argon2`, `login`, `lockout`, `MFA`, `current_user`, `owner_id`, `SecurityMiddleware`, `X-Frame-Options`, `Strict-Transport`, `Content-Security`, `Referrer-Policy`, `Retry-After`, `429`, `exception_handler`. Combined with `deploy.sh` `--allow-unauthenticated`. | Defensible on an isolated demo box — but must be disclosed, not implied. `FIX_REPORT.md:5` brands the project "Full SDLC & Security-First Compliance." |
| H2 | **`SECURITY_COMPLIANCE.md` §3.1 claims CNIC/phone masking that does not exist.** Only grep hit in the codebase is `seed_data.py:51`, a raw CNIC `37405-1829301-1`. No masking code. Cleartext CNICs and phones flow into alerts, decoy sessions, SAR markdown, and Firestore. | Security judges verify claims. This one is trivially disprovable. |
| H3 | **Same file: "raw authentication secrets are never transmitted to LLM context"** — but `main.py:235-242` sends `json.dumps(sender_info)` / `receiver_info` unredacted into the Gemini prompt. | Documented control is not implemented. |
| H4 | **`SECURITY_COMPLIANCE.md` §2 still asserts "halts settlement before funds leave core ledger"** — the very "inline core switch" claim scrubbed from `README.md`. Also "automated referral dispatched to FIA" and "placed on inter-bank Raast blocklist" — no such integrations exist; IOCs go to a Firestore collection. | `LIMITATIONS.md` §1 does correctly disclaim this. The two documents contradict each other. |
| H5 | **`THREAT_MODEL.md` §3.5 lists DoS "mitigations"** = benchmark caching + input length limits + CORS allowlist. Actual rate limiting: none. | Claimed control absent. |
| H6 | **Fail-open audit persistence.** `pipeline.py:135-140` swallows every storage exception with bare `except: pass`; `main.py:99-100` logs a warning only. The caller believes the forensic record was written when Firestore failed. | For a product whose pitch is a *regulatory audit trail*, this is the wrong default. Fail closed and surface. |
| H7 | **Python deps unpinned** — all `>=` in `requirements.txt`; `Dockerfile:17-18` `pip install -r` with no `--require-hashes`, no SBOM. npm has `package-lock.json`; Python has no equivalent lock. | Unrepeatable images. |
| H8 | **API key passed as plaintext CLI argument.** `deploy.sh:44` — `--set-env-vars "GEMINI_API_KEY=${GEMINI_API_KEY}"`. Visible in shell history and `gcloud` process args, readable by anyone with `run services describe` permission. | Use `--set-secrets` with Secret Manager. |
| H9 | **`deploy.sh` is aspirational.** `set -e` not `set -euo pipefail`; no prerequisite env validation (would deploy silently with an empty key); no post-deploy health check; no rollback; no retry. | |
| H10 | **No CI pipeline at all.** No `.github/`, and no `pip-audit`, `bandit`, `semgrep`, `trivy`, or `gitleaks` wired anywhere in the repo. | Citeable gap against the team's own secure-SDLC mandate. |
| H11 | **No `firestore.rules`.** `firebase.json` declares no rules or index files, so the Firebase web key can read all alerts. | |
| H12 | **`scripts/seed_firestore.py:43`** calls `initialize_app()` with no project id and no guard. Pointed at the wrong ADC, it writes into whatever project that credential owns. No confirmation prompt. | |
| H13 | **`BenchmarkModal.jsx:9-16` hardcodes `100.0` recall / `0.0` FPR** as render defaults with no "simulated" label. | Residual ungrounded-number risk inside the demo itself. |

---

## 6. LOW / Housekeeping

1. **Stray scaffolding at repo root** — `gemini-code-1792007424199.md`, `gemini-code-1792007695267.txt`. Delete.
2. **`graph_store.py:83-98` BFS** rescan `self.edges` linearly per node per level → `O(nodes × edges × depth)`. CPU amplifier once a large graph is ingested. Index adjacency lists.
3. **All application state is in-memory** — `active_alerts`, `decoy_sessions`, `sar_reports`, `benchmark_runs`. Cloud Run recycles instances on any deploy; every audit record is lost. Thinnest part of the "regulatory audit trail" story.
4. **Frontend deps use `^` ranges** in `package.json` (mitigated by committed `package-lock.json`).
5. **Missing artifacts:** `LICENSE`, `SECURITY.md`, `CHANGELOG`, presenter demo script, verified end-to-end README run instructions.
6. **Dev/held-out fixture reuse:** 0 transcript overlap, but 4 shared IBANs (`PK12SCBL00049281726350`, `PK20AKBL00039281726359`, `PK35HABB00021948291005`, `PK98BAFL00039281726350`).
7. **Credential hygiene note:** a GCP service-account ID token was pasted into the audit chat session. It is *not* present in the repo (verified by grep), but tokens paste into session history — delete/rotate it, and note that an `AQ.Ab…`-prefixed ID token is not a `AIza…` API key and would not authenticate the Gemini path regardless.

---

## 7. Spec Compliance — `SHAHEEN_FIX_AND_COMPLETION_SPEC.md`

| Area | Status |
| :--- | :--- |
| P0-1 Fake latency removal | ✅ Verified absent |
| P0-2 Single pipeline / no leakage | ✅ Verified by execution |
| P0-3 Generic taxonomy (no scenario keywords) | ✅ Verified |
| P0-4 Frozen held-out set + Wilson CIs | ⚠️ **Digest broken (C2); dataset trivially separable (C1)** |
| P0-5 Marketing claim scrub | ⚠️ README clean, but claims survive in `SECURITY_COMPLIANCE.md` and `THREAT_MODEL.md` (H4, H5) |
| P0-6 Server-side registry gate | ✅ Verified |
| P1-1 Cryptographic SAR digest | ✅ Verified |
| P1-3 Prompt-injection defense | ✅ Verified |
| P1-4 Graph store + BFS | ✅ Verified (perf note §6.2) |
| P1-5 Decoy + IOC persistence | ✅ Mostly; fail-open (H6) |
| P1-6 Real audio telemetry | ✅ Verified |
| P1-7/P1-8 Persistence + benchmark cache | ⚠️ Partial — in-memory only, and `/api/run-benchmark` dataset diverges (C3) |
| P2 Container/CORS/input hardening | ✅ Verified |
| **Overall** | **~90%** — P0 items all done; gaps are hardening + honesty, not functionality |

---

## 8. Prioritized Fix Plan

| # | Fix | Effort | Payoff |
| :---: | :--- | :---: | :---: |
| 1 | **Build a genuinely hard held-out set** (§4.C1) | 2–3 hrs | Highest. Turns a worthless metric into a credible one; one-liner ablation reads as senior rigor |
| 2 | **`.gitattributes` + re-commit so the published SHA command works** (§4.C2) | 20 min | Prevents being caught out in the judge's first 90 seconds |
| 3 | **Point `/api/run-benchmark` at `eval/heldout.json`** (§4.C3) | 45 min | UI number = paper number |
| 4 | **Export the key and run Gemini once, honestly** (§4.C4) | 30 min | Finally proves the AI half — or produces a stronger conclusion |
| 5 | **12-line security-headers middleware + 6-line rate limiter + `@app.exception_handler`** (H1) | 1 hr | Closes the single most visible security hole |
| 6 | **Pin `requirements.txt` to `==`** (H7) | 10 min | Repeatability |
| 7 | **`deploy.sh` → `--set-secrets` + `set -euo pipefail`** (H8, H9) | 20 min | Stops the key going through process args |
| 8 | **Soften `SECURITY_COMPLIANCE.md` §2/§3.1 + `THREAT_MODEL.md` §3.5** (H2, H3, H4, H5) | 30 min | Removes four claims that are easy to disprove |
| 9 | **`run_eval.py` `--dry-run` + gitignored output dir** (C5) | 15 min | Stops audits destroying the evidence |
| 10 | **Add `firestore.rules`; guard `seed_firestore.py`** (H11, H12) | 25 min | Real Firestore access control |
| 11 | **Add CI with pip-audit + npm audit + bandit + gitleaks** (H10) | 45 min | Turns "secure SDLC" from a slogan into a fact |

---

## 9. If You Only Have 90 Minutes

Do these three and nothing else:

1. **§4.C2** — `.gitattributes` + re-commit + fix `docs/EVALUATION.md:15-17`. (20 min)
2. **§4.C3** — make `/api/run-benchmark` use the held-out set; delete the third copy. (45 min)
3. **§5 H2/H3/H4/H5** — soften `SECURITY_COMPLIANCE.md` and `THREAT_MODEL.md`. (30 min)

Items 1 and 3 stop you from being caught out. **§4.C1 and §4.C4 are where the actual winning margin lives** — they are the gap between "good hackathon project" and "bank-grade fraud detection," and right now neither the Gemini half nor the test set has been exercised.

---

## 10. What an Adversarial Judge Will Ask, Ranked

| Q | Likely impact | Honest answer today |
| :--- | :---: | :--- |
| "Run the SHA command in your eval doc." | **Very high** | Fails (C2) |
| "Is there a baseline your model beats? Show it." | **Very high** | A one-line rule ties at 100% (C1) |
| "Where's the Gemini latency number from?" | High | Nowhere — never measured (C4) |
| "Show me the CNIC masking code." | High | It doesn't exist (H2) |
| "Is this API authenticated? Rate limited?" | High | No (H1) — be upfront, offer the 1-hr fix |
| "What happens if Firestore goes down?" | Medium | Alert is dropped silently (H6) |
| "Where's your CI?" | Medium | It doesn't exist (H10) |

---

## Appendix A — Reproduction Commands

```bash
# 1. Reproduce the evaluation (writes files — see Appendix B)
python scripts/run_eval.py --dataset eval/heldout.json

# 2. Reproduce the API benchmark (20 cases, NOT 40 — see C3)
python -c "import sys; sys.path.insert(0,'backend'); \
from fastapi.testclient import TestClient; from main import app; \
print(TestClient(app).post('/api/run-benchmark?live=true').json()['metrics'])"

# 3. Demonstrate C2 — the published digest check fails on a CRLF working tree
sha256sum eval/heldout.json          # 6b75ef76…  (disk, CRLF)
git show HEAD:eval/heldout.json | sha256sum   # 39881299…  (git blob, LF)
git config --get core.autocrlf      # true

# 4. Demonstrate C1 — the one-line baseline ties the full pipeline
python -c "
import json; d=json.load(open('eval/heldout.json'))
tp=fn=fp=tn=0
for c in d:
    f=c['graph_context']['account_age_days']<60; sc=c['type']=='FRAUD'
    if sc and f: tp+=1
    elif sc: fn+=1
    elif f: fp+=1
    else: tn+=1
print(f'age<60 baseline: Recall {tp/(tp+fn)*100:.1f}%  FPR {fp/(fp+tn)*100:.1f}%')"

# 5. Demonstrate C4 — Gemini never ran
grep -c ERROR_FALLBACK eval/results/eval_run_20261018_071648.json
```

## Appendix B — Working Tree Hygiene

Running `scripts/run_eval.py` during this audit produced two artifacts that must be removed before committing:

```bash
git checkout -- eval/REPORT.md
rm eval/results/eval_run_20261018_080930.json
```

`eval/REPORT.md` differs only in date, per-case latency, and wall time — recall/FPR/precision are identical. This is also the motivation for fix C5.
