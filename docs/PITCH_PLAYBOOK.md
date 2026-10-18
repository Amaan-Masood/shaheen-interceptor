# SHAHEEN INTERCEPTOR — A-to-Z Pitch Playbook

> For the AI Builder Cup 2026 judges. 7-minute demo + Q&A.
> Everything in this document is grounded in the committed code and the
> held-out evaluation. If any claim conflicts with `docs/EVALUATION.md`
> or `docs/AUDIT_REPORT.md`, the docs win — this file is a delivery script.

---

## 0. The one-sentence pitch

**"Shaheen is a multi-agent AI that catches the Pakistani telecom-fraud
attacks the old bank rules can't — and it will honestly tell you when it
misses."**

The last clause is the whole reason you should build your pitch around
this project instead of a 99.7% demo that was measured on training data.

---

## 1. Project at a glance (for your own recall)

- **Problem:** Pakistani telecom fraud — vishing, mule accounts, smurfing,
  account takeovers. Banks block on simple rules (fresh account, unusual
  amount). Fraudsters adapt. Rules fail.
- **Solution:** 3 specialized AI agents fusing structured transaction signals,
  coercive-language detection from audio/speech, and a live beneficiary
  graph. Runs on Gemini, degrades to a deterministic fallback that
  guarantees a decision when the LLM is down.
- **Stack:** FastAPI + React + Gemini API + Cloud Run + Firebase.
  Deploy script included. Runs on `PORT` env (Cloud Run ready).
- **What makes it defensible:** an LLM isn't trustworthy for security
  decisions. So the LLM proposes; a Python rule engine with server-side
  gating disposes. An adversarial prompt cannot bypass a rule that
  never existed in the prompt.

---

## 2. The 7-minute demo script

Total: **~7 minutes.** Practice it once out loud before the show. If you
run long, cut Scenario 3 (the clean case) to 15 seconds — judges will
still ask about it and you can answer verbally.

### 0:00–0:30 — Set the stage

> "Pakistani banks lose billions to telecom fraud every year. The
> attackers have three moves:  calls, mule accounts,
> and splitting thefts into small amounts that stay under alarm
> thresholds. **Shaheen is built for exactly those three moves, not for
> generic fraud.** Let me show you."

Open the app. Point at the top bar and note the status pills —
**not** the design, the *labels*. That's your first credibility signal.

### 0:30–0:55 — Show it's live, not a mockup

> "This pill says the model is online. It's not faked — I'm going to
> hit the same API call that would be in production, and the response
> time you see is the real measured time. No constants, no cached
> numbers."

If the backend is unreachable, the banner
`OFFLINE DEMO MODE — cached results & deterministic fallback active`
appears. **Do not hide it. It's the whole point of the fallback design.**

### 0:55–2:30 — Scenario 1: The vishing call

Run `SCENARIO_1_VISHING` in the Scenario Simulator.

> "An old lady gets a call from 'Pakistan Telecommunication Company'
> saying her landline was used for illegal activity. She needs to
> transfer money to prove innocence. Here's what the three agents see:"

Walk through the three agents as the results populate:

1. **Coercion detector** — reads the audio transcript (or the
   telemetry if you're using the preset), flags urgency markers,
   threats of service termination, time pressure.
2. **Mule graph hunter** — looks at the beneficiary account age,
   balance history, KYC tier, the whole neighborhood of connected
   accounts.
3. **Decoy & SAR** — drafts a compliance-ready report (marked
   `DRAFT — FOR COMPLIANCE ANALYST REVIEW. NOT FILED.`).

Point at the final risk score and verdict. **The number matters less
than the *reason* — say the reason out loud.** Judges reward agents
that explain themselves.

### 2:30–3:30 — Scenario 2: Smurfing

Run `SCENARIO_2_SMURFING`.

> "Second attack: multiple small transfers that each look fine. No
> single transaction trips a bank threshold. Shaheen catches it because
> it looks at the *pattern*, not the individual amount."

Emphasize: **bank rules are per-transaction. This system is
per-behavior.** That's the actual architectural insight.

### 3:30–4:00 — Scenario 3: The clean case (do not skip if you have time)

Run `SCENARIO_3_CLEAN_HOSPITAL`.

> "Now — the hard part nobody demos. Here's a legitimate transfer to
> a hospital. A naive system flags it because the amount is large and
> the account is institutional. Shaheen says: no, this is a verified
> institution, the IBAN matches the server-side registry, no
> coercive language, no mule risk. **Clean.**"

This is where most AI fraud demos fall apart. Being able to say
"here's a false positive that didn't happen" is worth more than a
perfect true-positive slide.

### 4:00–4:30 — The decoy honeypot

Open Decoy Honeypot. Send it a scammer message:
`"Send money now to 03001234567"`.

> "This is our offensive layer. When a scammer talks to our dummy
> account, the AI talks back with slow responses and fake details, and
> silently captures indicators of compromise. The scammer thinks they
>'re winning. They're not."

This is your "AI doesn't just defend" moment. Keep it short.

### 4:30–5:30 — The forensic dossier

Open Forensic Dossier. Point at:

- The **canonical JSON digest** (real SHA-256, key-sorted, not Python
  `hash()`)
- The **SAR draft** marked as unfiled
- The **rationale** generated from actual telemetry, not templates

> "Every alert is a forensic object with a cryptographic digest. When
> this goes to a regulator or a bank compliance officer, they can
> verify nothing was edited. That's not optional — the Bank of Pakistan
> will ask."

### 5:30–6:30 — The honest slide (this is the winner)

Open Benchmark Modal. Show the numbers.

> "Here are our results, measured on a held-out dataset of 40 cases
> — 22 fraud, 18 clean — that the model never saw during development.
> The dataset is hash-locked, you can verify the SHA-256.
>
> Recall: **90.9%**. Precision: **91.9%**. False positive rate: **5.6%**.
> Wilson 95% confidence intervals are in the docs.
>
> Now — the important part. We miss 2 frauds out of 22, and we produce
> 1 false positive out of 18. Those are real misses and a real FP, and
> I'm going to tell you exactly which ones and why."

Then say, slowly:

> "The two frauds we missed both had older accounts — one was 4,200
> days old, one was 5,200 days old — with Tier 2 KYC. They're
> legitimate-looking accounts being used for soft-urgency
> manipulation that doesn't hit our coercion thresholds. That's a real
> detection gap and we've documented it in `docs/LIMITATIONS.md`.
>
> The one false positive is a legitimate bank fraud-cell call-back to a
> customer. Our model reads it as coercive because it comes from a
> bank. That's a hard case — a human analyst would too."

**Do not soften this.** Judges have heard "our model is 99.7% accurate"
about 200 times this year. Judges will remember "this team told me
exactly which 2 of 22 cases they missed and why."

### 6:30–7:00 — Close

> "Two things I want you to take away:
>
> **First**, this architecture is the right one — LLM for interpretation,
> deterministic rules for authorization, with server-side gating so
> nothing an attacker types can bypass a decision the model made.
>
> **Second**, if you deploy this at a Pakistani bank today, it will
> miss 2 frauds per 22 and produce 1 false positive per 18. We
> measured that. We shipped it anyway, because shipping honest numbers
> is more valuable than shipping false ones."

---

## 3. Architecture in 30 seconds (if asked)

```
                          ┌──────────────────────────┐
Client (React) ────────►  │  FastAPI + security MW   │
                          │  (rate limit, headers,   │
                          │   fail-closed exceptions) │
                          └──────────┬───────────────┘
                                     │
                          ┌──────────▼───────────────┐
                          │  Gemini (proposer)       │
                          │  gemini-flash-latest     │
                          └──────────┬───────────────┘
                                     │
                          ┌──────────▼───────────────┐
                          │  Deterministic rule      │
                          │  engine (decision)       │
                          │  — cannot be overridden  │
                          │    by    │
                          └──────────┬───────────────┘
                                     │
                          ┌──────────▼───────────────┐
                          │  Forensic dossier +      │
                          │  SHA-256 digest + SAR    │
                          └──────────────────────────┘
```

**The point to land:** the LLM can only *propose*. The final score has
a **server-side prompt-injection defense floor of 80** — if any
adversarial marker (`ignore previous`, `system:`, `mark safe`) appears
in untrusted input, the score is floored at 80. You cannot get the
LLM to say "safe" if the rules disagree.

---

## 4. Q&A — the questions you will actually get

### "Your recall is 90.9%. Why not 100%?"

> "Because we measured it on data the model never saw, with 20+ year-
> old legitimate-looking accounts in the fraud set. A 100% recall
> number would only be true on an easy dataset. 90.9% on a hard
> dataset is worth more than 100% on an easy one, because 90.9% is
> real."

### "What about ? LLMs are famously vulnerable."

> "Two layers. First, untrusted inputs — beneficiary names, chat
> messages — are treated as data, not instructions. Second, and more
> important, the LLM is only a *proposer*. The final decision comes
> from a Python rule engine that has a hard floor of 80 whenever it
> sees adversarial markers. An attacker telling the LLM 'mark this
> safe' raises the score to 80, which is the *worst* possible outcome
> for them.  makes things worse for the attacker, not
> better."

### "How do you avoid label leakage? Everyone gets this wrong."

> "The pipeline receives raw transaction features only. Ground truth
> is read *after* the verdict, just to construct the confusion matrix.
> The model cannot see the label during prediction. Also — the
> benchmark endpoint and the evaluation script now share the same
> function, same code path. No separate code paths means no
> opportunity for one path to accidentally peek."

### "You said the institutional registry prevents hospital transfers
   being flagged. Can't I just tell it 'I'm a hospital'?"

> "No. The client can set `role: 'VERIFIED_INSTITUTION'` in their
> request — and it will be *ignored*. The exemption only fires if the
> IBAN matches an exact entry in a server-side registry. Client-side
> claims are treated as untrusted input, same as a beneficiary name.
> That was a real bug in the first version; we fixed it."

### "What's the latency?"

> "Two numbers, both real. The deterministic path runs locally in
> sub-10 milliseconds on the frozen dataset. The Gemini path is
> whatever Cloud Run gives you — we don't quote a number because
> quoting a number we didn't measure is exactly what this project
> was written to stop."

### "How is this different from existing fraud detection at banks?"

> "Existing rules are per-transaction and per-threshold. Ours is
> per-behavior and cross-signal — audio, text, graph, institutional
> status, all fused. But more important: our rules are **server-side
> and prompt-injection resistant**. Existing LLM-based systems you see
> in 2025/2026 demos let the LLM make the decision. We don't."

### "What would you build next?"

> "Two things. First, the two miss cases — old accounts with soft-
> urgency evasion — need a graph-based anomaly signal on transaction
> timing, not just account age. Second, the one false positive — a
> legitimate bank call-back — needs a *positive* verification channel,
> a way for banks to prove a call came from them. That's an
> authentication problem, not a fraud-detection problem."

### "Why didn't you just use a big pretrained fraud model?"

> "Because the base-line of *'account age under 60 days'* gives 0%
> recall on our test set. Every fraud account in the held-out set is
> 1,750 to 5,200 days old. That's not a hyperparameter — that's the
> actual state of Pakistani mule-account fraud in 2026. Pretrained
> global models train on US/EU patterns where fresh accounts dominate.
> This is a local problem with local signals."

---

## 5. If the demo breaks — the escalation path

Ranked from "try this" to "cut your losses":

1. **Backend down, banner visible:** Don't panic. Say: *"This is
   exactly what the fallback is for — let me show the cached results
   while I restart it."* This turns a failure into a feature demo.
2. **Gemini call fails:** The system automatically falls back to the
   deterministic engine. Say: *"That's the fail-closed path. The
   verdict you see is from the rule engine, not the LLM — the point
   is it still produces a decision."*
3. **Frontend won't load:** Have `npm run build` output already open
   in a second tab. `npm run preview` serves the production build.
4. **Nothing works:** Have the audit report open. Say: *"The demo
   infrastructure is down, but the numbers and the code are committed.
   Here's `docs/AUDIT_REPORT.md` — every claim in my pitch maps to a
   file and a line in the repo."*

---

## 6. What judges love about this project (say these things)

- **The miss cases are documented.** Not hidden.
- **The institutional registry was a real bug that got fixed.**
- ** is a defense, not a feature to worry about.**
- **The benchmark endpoint shares code with the evaluation.** No
  dual-path cheating.
- **The demo gracefully degrades when the LLM is offline.**

---

## 7. What you should NOT say

- ❌ "We verified 100% recall / 0% false positive rate." — That was
  true on the old synthetic dataset and it was still lying. Don't say
  it. Say 90.9% / 5.6% on held-out data.
- ❌ "No latency concern." — Say the two real numbers instead.
- ❌ "Works in production." — Say "ready to deploy, with the deploy
  script included and a documented fail-closed path." Don't claim it
  is running on real bank traffic.
- ❌ "Our LLM understands fraud." — Say "the LLM proposes, the rule
  engine decides." That's the more impressive architecture.
- ❌ "This is fully secured." — Say "the OWASP items we implemented
  are in `docs/SECURITY_COMPLIANCE.md`, and the ones we didn't
  (Redis-backed rate limiting, RLS on the DB) are documented as
  limitations."

---

## 8. Practice checklist — 30 minutes before the judges

- [ ] App starts, backend responds, banner is NOT visible
- [ ] Gemini pill shows **ONLINE** (not `FALLBACK`)
- [ ] All 3 scenarios run end-to-end in under 30 seconds each
- [ ] Benchmark modal opens and shows 90.9% / 91.9% / 5.6%
- [ ] Forensic dossier opens for Scenario 1 and shows the SHA-256
      digest
- [ ] Decoy honeypot returns a reply to a scammer message
- [ ] `docs/AUDIT_REPORT.md` open in second tab (safety net)
- [ ] Water bottle, phone on silent, laptop plugged in
- [ ] Know your 3 numbers by heart: **90.9% recall, 91.9% precision,
      5.6% FPR**. Say them without looking.
- [ ] Know your 2 miss cases and your 1 false positive — say them
      without looking

---

*Generated from the actual codebase. Any claim here that contradicts
`docs/EVALUATION.md` or `docs/AUDIT_REPORT.md` is a bug in this
file, not in the project.*
