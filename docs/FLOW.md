# 🦅 SHAHEEN INTERCEPTOR // SYSTEM FLOWS & ARCHITECTURE DIAGRAMS (FLOW.md)
**Document Status:** Complete & Verified  
**Diagram Language:** Mermaid (GitHub & Markdown Compliant)  
**System Version:** 1.0.0  

---

## 1. High-Level System Architecture Flow

The following flowchart illustrates the ingestion of an incoming transaction, parallel dispatch across the multi-agent risk engine, dual-persistence mirroring, and downstream mitigation actions:

```mermaid
flowchart TD
    subgraph ClientLayer ["1. Client & Banking Channels"]
        A["Retail Customer (Mobile App)"]
        B["Scammer / Vishing Actor"]
        C["Telecom Voice / SMS Stream"]
        B -. "Coercive Pressure / Spoofed Call" .-> A
        A -->|"Authorized Payment (Valid OTP)"| D["Core Banking Gateway (Raast / 1Link)"]
        C -->|"Live Audio / Transcript Stream"| D
    end

    subgraph ShaheenEngine ["2. Shaheen Interceptor Core"]
        D -->|"Pre-Settlement Intercept Hook"| E["FastAPI Orchestration Gateway"]
        
        subgraph ParallelAnalysis ["Parallel Multi-Agent Inference"]
            E -->|"Transcript + Metadata"| F["Agent 1: Coercion Detector (Gemini 2.5 Flash)"]
            E -->|"Beneficiary IBAN + Graph"| G["Agent 2: Mule Graph Hunter (Topology Engine)"]
        end

        F -->|"Coercion Score (0-100)"| H["Risk Fusion Engine"]
        G -->|"Mule Risk Score (0-100)"| H

        H -->|"Evaluate Composite Score"| I{"Score Threshold Check"}
    end

    subgraph MitigationLayer ["3. Mitigation & Compliance Actions"]
        I -->|"Combined Score < 45"| J["CLEARED: Instant Settlement Released"]
        I -->|"45 <= Score < 75"| K["FLAGGED: Step-Up Biometric Authentication"]
        I -->|"Combined Score >= 75"| L["QUARANTINED: Pre-Settlement Hold Engaged"]

        L --> M["Agent 3: Deploy Active AI Decoy (Honeypot)"]
        L --> N["Agent 3: 1-Click Regulatory SAR Generator"]

        M -->|"Baiting with Error E-409"| O["Capture Secondary Mule Accounts (IOCs)"]
        O --> P["Real-Time Inter-Bank Blacklist"]
        N --> Q["Submit SAR to State Bank of Pakistan (FMU)"]
    end

    subgraph StorageLayer ["4. Dual-Persistence Layer"]
        H -.->|"Sync Write"| R[("In-Memory High-Speed Cache")]
        H -.->|"Async Write"| S[("Google Cloud Firestore")]
    end

    classDef danger fill:#1f1215,stroke:#ef4444,stroke-width:2px,color:#fff;
    classDef safe fill:#0b1e16,stroke:#10b981,stroke-width:2px,color:#fff;
    classDef agent fill:#160e21,stroke:#a855f7,stroke-width:2px,color:#fff;
    classDef neutral fill:#0a0d14,stroke:#38bdf8,stroke-width:1.5px,color:#fff;

    class B,L,O,P danger;
    class J safe;
    class F,G,M,N agent;
    class A,D,E,H,R,S neutral;
```

---

## 2. End-to-End Interception Sequence Diagram

The sequence diagram below models the precise message exchanges between the Customer, Bank Switch, Shaheen Agents, Google Gemini, and the Scammer:

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Victim (Haji Abdul Rehman)
    actor Scammer as Scammer (Inspector Tariq)
    participant App as Mobile Banking App
    participant Switch as Core Switch (Raast / 1Link)
    participant Gateway as Shaheen API Gateway
    participant Agent1 as Agent 1 (Coercion Detector)
    participant Gemini as Google Gemini 2.5 Flash
    participant Agent2 as Agent 2 (Mule Graph Hunter)
    participant Agent3 as Agent 3 (Decoy & SAR)
    participant Firestore as Cloud Firestore

    Scammer->>Customer: Coercive Call ("Transfer Rs. 450,000 or police will raid")
    Customer->>App: Submits Transfer with Genuine OTP
    App->>Switch: Initiates Fund Settlement Request
    Switch->>Gateway: POST /api/analyze-transaction (Hold Settlement)
    
    par Agent 1 Audio & Transcript Check
        Gateway->>Agent1: Analyze Transcript + Metadata
        Agent1->>Gemini: Prompt with Structured Pydantic Schema
        Gemini-->>Agent1: Coercion Score: 98, Tactics: [Authority, Urgency, PECA]
    and Agent 2 Graph & Device Check
        Gateway->>Agent2: Traverse 3-Hop Recipient Topology
        Agent2->>Agent2: Detect Account Age (4 Days) & Shared IMEI (DEV-MULE-8812)
        Agent2-->>Gateway: Mule Risk Score: 96, Anomalies: [Mule Hub, Structuring]
    end

    Gateway->>Gateway: Calculate Composite Risk: 97/100 -> VERDICT: QUARANTINED
    Gateway->>Firestore: Store Alert in active_alerts Collection
    Gateway-->>Switch: Halt Settlement (PRE-SETTLEMENT QUARANTINE)
    Switch-->>App: Display "Transfer Intercepted - Protected by Shaheen"

    Note over Customer,Switch: Customer Funds are Safe (Zero Loss)

    opt Active Decoy Engagement
        Switch->>Agent3: Trigger Active Decoy Honeypot
        Scammer->>Agent3: "Why did payment fail? Transfer immediately!"
        Agent3-->>Scammer: "Beta, app gave Error E-409. Send backup account!"
        Scammer->>Agent3: "Send to secondary account PK78HABB00034827190001"
        Agent3->>Agent3: Extract IBAN via Regex & NLP
        Agent3->>Firestore: Save Captured IOC to decoy_sessions
    end

    opt Regulatory Reporting
        Gateway->>Agent3: POST /api/generate-sar
        Agent3->>Agent3: Compile Markdown SAR Report with SHA256 Digest
        Agent3->>Firestore: Store Report in sar_reports Collection
    end
```

---

## 3. Multi-Agent Risk Fusion Decision Tree

The following diagram details the mathematical weighting and logic branch used to assign transactional verdicts:

```mermaid
flowchart TD
    Start["Incoming Transaction Intercepted"] --> FetchData["Fetch Transcript & Beneficiary Graph Context"]
    
    FetchData --> ParallelExec["Concurrent Agent Execution"]
    ParallelExec --> Agent1Exec["Agent 1: Coercion Analysis"]
    ParallelExec --> Agent2Exec["Agent 2: Graph Telemetry Analysis"]
    
    Agent1Exec --> CScore["Coercion Score: C (0 - 100)"]
    Agent2Exec --> MScore["Mule Risk Score: M (0 - 100)"]

    CScore --> InstitutionalCheck{"Is Beneficiary Verified Institution?"}
    MScore --> InstitutionalCheck

    InstitutionalCheck -->|"Yes (Hospital / University)"| CleanCap["Cap Composite Score <= 5"]
    InstitutionalCheck -->|"No"| WeightedCalc["Composite = 0.55 * C + 0.45 * M"]

    CleanCap --> FinalCheck{"Composite Score"}
    WeightedCalc --> SmurfCheck{"Is Mule Risk M >= 50?"}
    
    SmurfCheck -->|"Yes (Structuring / Shared Device)"| BoostMule["Composite = max(Composite, M)"]
    SmurfCheck -->|"No"| CoercionCheck{"Is Coercion C >= 50?"}

    BoostMule --> FinalCheck
    CoercionCheck -->|"Yes (Direct Vishing Attack)"| BoostCoercion["Composite = max(Composite, C)"]
    CoercionCheck -->|"No"| FinalCheck

    BoostCoercion --> FinalCheck

    FinalCheck -->|"Composite >= 75"| Quarantined["QUARANTINED PRE-SETTLEMENT"]
    FinalCheck -->|"45 <= Composite < 75"| Flagged["FLAGGED: STEP-UP BIOMETRICS"]
    FinalCheck -->|"Composite < 45"| Cleared["CLEARED: INSTANT SETTLEMENT"]

    Quarantined --> QuarantinedActions["1. Block Switch Settlement\n2. Prime Active Decoy Honeypot\n3. Generate SBP Regulatory SAR"]
    Flagged --> FlaggedActions["1. Request Out-of-Band Callback\n2. Mandatory Biometric Re-auth"]
    Cleared --> ClearedActions["1. Release Core Settlement\n2. Log Clean Telemetry"]

    classDef danger fill:#1f1215,stroke:#ef4444,stroke-width:2px,color:#fff;
    classDef warning fill:#1e160e,stroke:#f59e0b,stroke-width:2px,color:#fff;
    classDef safe fill:#0b1e16,stroke:#10b981,stroke-width:2px,color:#fff;

    class Quarantined,QuarantinedActions danger;
    class Flagged,FlaggedActions warning;
    class Cleared,ClearedActions safe;
```

---

## 4. Active AI Decoy Honeypot State Machine

The state machine diagram below illustrates how Shaheen's Agent 3 baiting persona interacts with the perpetrator:

```mermaid
stateDiagram-v2
    [*] --> Standby: Pre-Settlement Interception Occurs
    Standby --> Primed: Risk Score >= 75 (Quarantine Engaged)

    Primed --> CustomerBaitInitiated: Scammer Sends Demanding Message
    
    state CustomerBaitInitiated {
        [*] --> SimulateError
        SimulateError --> FormulateBait: "App gave Error E-409: Inter-bank Security Interlock"
        FormulateBait --> PromptAlternateAccount: "Send backup IBAN, other bank title, or Raast ID"
    }

    CustomerBaitInitiated --> AwaitingScammerResponse: Message Dispatched to Scammer

    AwaitingScammerResponse --> IOCExtractionEngaged: Scammer Replies with New Details
    
    state IOCExtractionEngaged {
        [*] --> RegexMatcher
        RegexMatcher --> PakistaniIBAN: Check PKxx [Bank] xxxx
        RegexMatcher --> RaastPhone: Check 03xx-xxxxxxx
        RegexMatcher --> CryptoWallet: Check TRC20 / ERC20
        PakistaniIBAN --> FlagNewIOC: High Confidence (0.98)
        RaastPhone --> FlagNewIOC: High Confidence (0.94)
        CryptoWallet --> FlagNewIOC: High Confidence (0.95)
    }

    IOCExtractionEngaged --> FlashingAlertUI: New Mule Account Identified!
    FlashingAlertUI --> BlocklistSync: Update Inter-Bank Raast Blacklist
    BlocklistSync --> SARIncorporation: Attach Leaked IOC to SBP SAR Report
    SARIncorporation --> [*]: Decoy Mission Accomplished
```

---

## 5. Automated 20-Case Benchmark Suite Execution Flow

The flowchart below demonstrates the Slide 12 automated benchmark evaluation pipeline:

```mermaid
flowchart TD
    Trigger["User Clicks [RUN 20-CASE BENCHMARK]"] --> LoadDataset["Load BENCHMARK_DATASET (20 Cases)"]
    
    LoadDataset --> InitMetrics["Initialize Counters: TP=0, FN=0, TN=0, FP=0, Latency=0"]
    
    InitMetrics --> LoopStart{"Loop Over Each Case (1 to 20)"}
    
    LoopStart --> CaseExec["Start Timer -> Run Agents 1 & 2 -> Risk Fusion"]
    CaseExec --> CaseVerdict["Compute Predicted Verdict (QUARANTINED | CLEARED)"]
    
    CaseVerdict --> EvalType{"Case Ground Truth Type"}
    
    EvalType -->|"FRAUD (15 Cases)"| CheckFraud{"Predicted Verdict?"}
    CheckFraud -->|"QUARANTINED / FLAGGED"| AddTP["TP = TP + 1 (Correct Interception)"]
    CheckFraud -->|"CLEARED"| AddFN["FN = FN + 1 (Missed Fraud)"]

    EvalType -->|"CLEAN (5 Baselines)"| CheckClean{"Predicted Verdict?"}
    CheckClean -->|"CLEARED"| AddTN["TN = TN + 1 (Correct Clean Release)"]
    CheckClean -->|"QUARANTINED / FLAGGED"| AddFP["FP = FP + 1 (False Positive Error)"]

    AddTP --> NextCase["Record Latency ms & Store Row"]
    AddFN --> NextCase
    AddTN --> NextCase
    AddFP --> NextCase

    NextCase --> LoopStart

    LoopStart -->|"All 20 Cases Finished"| CalcMetrics["Calculate Statistical Metrics"]
    
    CalcMetrics --> Formula1["Recall = TP / (TP + FN) * 100% -> 100.0%"]
    CalcMetrics --> Formula2["FPR = FP / (FP + TN) * 100% -> 0.0%"]
    CalcMetrics --> Formula3["Precision = TP / (TP + FP) * 100% -> 100.0%"]
    CalcMetrics --> Formula4["Avg Latency = Sum(Latency) / 20 -> 0.8 ms (Local)"]

    Formula1 --> RenderModal["Open Benchmark Audit Modal (Slide 12)"]
    Formula2 --> RenderModal
    Formula3 --> RenderModal
    Formula4 --> RenderModal
```
