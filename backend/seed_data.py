"""
Shaheen Interceptor - BFSI Fraud, Vishing & Money Mule Defense Platform
Seed Dataset: Banking Scenarios, 3-Hop Graph Topologies & Benchmark Test Cases
"""

from typing import Dict, List, Any

# ============================================================================
# SCENARIO 1: Live FIA / Bank Impersonation Vishing Call (Critical Risk)
# ============================================================================
SCENARIO_1_VISHING: Dict[str, Any] = {
    "id": "SCENARIO_1_VISHING",
    "title": "FIA Cyber Crime & Bank Impersonation Vishing Scam",
    "category": "VISHING_SCAM",
    "severity": "CRITICAL",
    "amount": 450000.0,
    "currency": "PKR",
    "channel": "Raast Instant P2P",
    "timestamp": "2026-10-14T14:32:10Z",
    "sender": {
        "account_id": "ACC-HBL-99214",
        "iban": "PK45HABB00099214710293",
        "name": "Haji Abdul Rehman",
        "age": 68,
        "occupation": "Retired Federal Directorate Officer",
        "bank": "Habib Bank Limited (HBL)",
        "account_age_days": 4200,
        "kyc_tier": "Tier 2 (Full Biometric Verified)",
        "device_hash": "DEV-IPHONE12-F8-ISB-3912",
        "ip_address": "39.40.12.84 (Islamabad, PTCL Broadband)",
        "location": "Sector F-8/2, Islamabad, Pakistan",
        "average_monthly_turnover_pkr": 65000.0,
        "historical_risk_score": 4,
    },
    "receiver": {
        "account_id": "ACC-MEZN-837465",
        "iban": "PK36MEZN00019283746501",
        "name": "Muhammad Bilal",
        "bank": "Meezan Bank Limited",
        "account_age_days": 4,
        "kyc_tier": "Tier 0 (Unverified Digital Onboarding)",
        "device_hash": "DEV-MULE-8812",
        "ip_address": "103.255.4.19 (Proxy / Suspicious Cloud ASN)",
        "location": "Unknown / Ephemeral Location",
        "average_monthly_turnover_pkr": 0.0,
        "historical_risk_score": 94,
    },
    "transcript": """[CALL AUDIO CONNECTION ESTABLISHED - INCOMING CALL VIA SPOOFED CALLER ID +92-51-111-342-000]
Perpetrator (Inspector Tariq / FIA Cyber Crime Wing): Assalam-o-Alaikum Haji Abdul Rehman sahab. Main Inspector Tariq baat kar raha hoon Federal Investigation Agency (FIA) Cyber Crime Wing Headquarters Islamabad se.
Victim (Haji Abdul Rehman): Walaikum Assalam bhai... khairiat? Kya masla hai beta?
Perpetrator: Haji Sahab, yeh emergency call hai. State Bank of Pakistan aur FIA Joint Financial Task Force ne aapke CNIC 37405-1829301-1 par registered bank accounts par immediate arrest warrant aur account freeze order issue kiya hai.
Victim: Ya Allah reham karay! Main toh 30 saal se pension le raha hoon, main ne z जिंदगी mein koi galat kaam nahi kiya!
Perpetrator: Suniye ghaur se! Aapke CNIC par 3 ghair qanooni SIM cards issue huay hain jin se Lahore aur Karachi mein money laundering aur banned terror outfits ko funds transfer huay hain. Police raid team aapke F-8 address par nikal chuki hai.
Victim: Nahi nahi beta, mera is se koi taluq nahi hai! Main abhi bank manager ke paas chala jaata hoon...
Perpetrator: Bilkul nahi! Agar aapne call drop ki ya kisi family member ko bataya toh Section 21 PECA aur Anti-Terrorism Act ke tehat fori door tod kar giraftari hogi! Agar aap apna record clean sabit karna chahte hain, toh State Bank of Pakistan ke Emergency Verification Escrow Vault mein 450,000 rupees security deposit transfer karein. Yeh funds verification ke 15 minute baad automatically refund ho jaayenge.
Victim: 450,000 rupay? Lekin yeh meri saari jamapooji aur medical emergency ki bachat hai!
Perpetrator: Haji Sahab, jail mein zillat se behtar hai ke abhi 10 minute ke andar apna HBL mobile app kholein! Main line par hoon. Payee add karein: Title 'Muhammad Bilal', Account IBAN 'PK36MEZN00019283746501'. OTP kisi ko mat bataiye ga, seedha app mein enter karke authenticate karein. Foran transfer karein warna main police ko direct call karke darwaza todne ka order de doon ga!
Victim: Theek hai beta, mat kijiye raid... main kaanp raha hoon, main abhi HBL app se 450,000 rupees send kar raha hoon...""",
    "transcript_snippets": [
        "Main Inspector Tariq baat kar raha hoon Federal Investigation Agency (FIA) Cyber Crime Wing Headquarters Islamabad se.",
        "State Bank of Pakistan aur FIA Joint Financial Task Force ne aapke CNIC par immediate arrest warrant aur account freeze order issue kiya hai.",
        "Agar aapne call drop ki ya kisi family member ko bataya toh Section 21 PECA ke tehat fori door tod kar giraftari hogi!",
        "Emergency Verification Escrow Vault mein 450,000 rupees security deposit transfer karein.",
        "Abhi 10 minute ke andar apna HBL mobile app kholein... OTP kisi ko mat bataiye ga, seedha app mein enter karein!"
    ],
    "mule_graph": {
        "topology_name": "3-Hop Rapid Outbound Coerced Vishing Funnel",
        "nodes": [
            {
                "id": "ACC-HBL-99214",
                "label": "Victim: Haji Abdul Rehman",
                "role": "VICTIM",
                "bank": "HBL",
                "account_age_days": 4200,
                "kyc_tier": "Tier 2",
                "device_hash": "DEV-IPHONE12-F8-ISB-3912",
                "risk_score": 4,
                "status": "COMPROMISED_SENDER",
                "balance_pkr": 520000.0
            },
            {
                "id": "PK36MEZN00019283746501",
                "label": "Mule Hub 1: Muhammad Bilal",
                "role": "PRIMARY_MULE",
                "bank": "Meezan Bank",
                "account_age_days": 4,
                "kyc_tier": "Tier 0",
                "device_hash": "DEV-MULE-8812",
                "risk_score": 96,
                "status": "MULE_RECIPIENT",
                "balance_pkr": 1420.0
            },
            {
                "id": "PK78HABB00034827190001",
                "label": "Mule Layer 2A: Kashif Mehmood",
                "role": "SECONDARY_MULE",
                "bank": "Habib Metro",
                "account_age_days": 9,
                "kyc_tier": "Tier 1",
                "device_hash": "DEV-MULE-8812",
                "risk_score": 89,
                "status": "STRUCTURING_HOP",
                "balance_pkr": 3100.0
            },
            {
                "id": "PK12BAHL00098231200192",
                "label": "Mule Layer 2B: Hamza Tariq",
                "role": "SECONDARY_MULE",
                "bank": "Bank AL Habib",
                "account_age_days": 12,
                "kyc_tier": "Tier 1",
                "device_hash": "DEV-MULE-8812",
                "risk_score": 87,
                "status": "STRUCTURING_HOP",
                "balance_pkr": 2500.0
            },
            {
                "id": "CRYPTO-BINANCE-OTC-DESK-991",
                "label": "Cashout 3A: P2P USDT OTC Merchant",
                "role": "CRYPTO_CASHOUT",
                "bank": "Binance P2P Escrow",
                "account_age_days": 180,
                "kyc_tier": "Tier 3 Foreign",
                "device_hash": "DEV-OTC-DESK-991",
                "risk_score": 98,
                "status": "OFFSHORE_DRAIN",
                "balance_pkr": 8900000.0
            },
            {
                "id": "ATM-KHI-SADDAR-04",
                "label": "Cashout 3B: ATM Terminal Saddar Karachi",
                "role": "PHYSICAL_ATM",
                "bank": "1Link ATM Network",
                "account_age_days": 1500,
                "kyc_tier": "Terminal Device",
                "device_hash": "TERM-ATM-KHI-401",
                "risk_score": 92,
                "status": "CASH_DRAIN",
                "balance_pkr": 0.0
            }
        ],
        "edges": [
            {
                "id": "edge-v1-1",
                "source": "ACC-HBL-99214",
                "target": "PK36MEZN00019283746501",
                "amount": 450000.0,
                "currency": "PKR",
                "timestamp": "2026-10-14T14:32:10Z",
                "channel": "Raast Instant Transfer",
                "anomaly_flag": "HIGH_VALUE_FIRST_TIME_PAYEE_UNDER_COERCION"
            },
            {
                "id": "edge-v1-2",
                "source": "PK36MEZN00019283746501",
                "target": "PK78HABB00034827190001",
                "amount": 225000.0,
                "currency": "PKR",
                "timestamp": "2026-10-14T14:33:45Z",
                "channel": "1Link IBFT",
                "anomaly_flag": "RAPID_SPLIT_FANOUT_90SEC"
            },
            {
                "id": "edge-v1-3",
                "source": "PK36MEZN00019283746501",
                "target": "PK12BAHL00098231200192",
                "amount": 220000.0,
                "currency": "PKR",
                "timestamp": "2026-10-14T14:34:10Z",
                "channel": "Raast Instant Transfer",
                "anomaly_flag": "RAPID_SPLIT_FANOUT_120SEC"
            },
            {
                "id": "edge-v1-4",
                "source": "PK78HABB00034827190001",
                "target": "CRYPTO-BINANCE-OTC-DESK-991",
                "amount": 222000.0,
                "currency": "PKR",
                "timestamp": "2026-10-14T14:36:00Z",
                "channel": "P2P Crypto Buy Escrow",
                "anomaly_flag": "IMMEDIATE_OFFSHORE_CRYPTO_LIQUIDATION"
            },
            {
                "id": "edge-v1-5",
                "source": "PK12BAHL00098231200192",
                "target": "ATM-KHI-SADDAR-04",
                "amount": 218000.0,
                "currency": "PKR",
                "timestamp": "2026-10-14T14:37:20Z",
                "channel": "Debit Card ATM Cashout",
                "anomaly_flag": "PHYSICAL_CASH_EXTRACTION"
            }
        ]
    }
}

# ============================================================================
# SCENARIO 2: Coordinated Money Mule Smurfing Ring (High Risk)
# ============================================================================
SCENARIO_2_SMURFING: Dict[str, Any] = {
    "id": "SCENARIO_2_SMURFING",
    "title": "Coordinated Distributed Money Mule Smurfing Ring",
    "category": "MULE_SMURFING",
    "severity": "HIGH",
    "amount": 270000.0,
    "currency": "PKR",
    "channel": "Structured Multi-Channel Raast / Microfinance",
    "timestamp": "2026-10-14T16:15:00Z",
    "sender": {
        "account_id": "SYNDICATE-FEEDERS-CLUSTER",
        "iban": "MULTIPLE_STRUCTURED_FEEDERS",
        "name": "Distributed Smurfing Cluster (6 Accounts)",
        "bank": "Various (Easypaisa, JazzCash, SadaPay)",
        "account_age_days": 14,
        "kyc_tier": "Tier 1 Micro-Wallets",
        "device_hash": "DEV-EMULATOR-ANDR-902",
        "ip_address": "103.255.4.110 (Shared VPN/Datacenter Subnet)",
        "location": "Rawalpindi / Lahore Border",
        "historical_risk_score": 88,
    },
    "receiver": {
        "account_id": "ACC-UBL-8819234",
        "iban": "PK45UNIL00088192340182",
        "name": "Zeeshan Ali (Student Account)",
        "bank": "United Bank Limited (UBL)",
        "account_age_days": 18,
        "kyc_tier": "Tier 1 Student Freelancer",
        "device_hash": "DEV-EMULATOR-ANDR-902",
        "ip_address": "103.255.4.110 (Shared Device & Network)",
        "location": "Satellite Town, Rawalpindi",
        "historical_risk_score": 93,
    },
    "transcript": """[TELEGRAM ENCRYPTED SYNDICATE BACKCHANNEL LOGS - RETRIEVED VIA CYBER THREAT INTEL]
Syndicate Coordinator (TG: @Ghost_Broker_09): Team, wave 4 execution start. Today's target threshold is Rs. 50,000 STR radar. Keep all drops strictly between 44,000 and 46,000.
Feeder 01 (HBL Drop): Sent Rs. 45,000 via Raast to student account PK45UNIL00088192340182 (Zeeshan Ali).
Feeder 02 (Easypaisa Drop): Rs. 45,000 cleared to same IBAN. Transaction ID #EP-992182.
Feeder 03 (JazzCash Drop): Rs. 45,000 sent. No biometric prompt triggered.
Feeder 04 (SadaPay Drop): Rs. 45,000 sent from rented account #4.
Feeder 05 (Nayapay Drop): Rs. 45,000 sent. Device fingerprint identical to emulator instance #3.
Feeder 06 (U Microfinance): Final Rs. 45,000 dispatched. Total structured accumulation: Rs. 270,000 in Zeeshan account.
Syndicate Coordinator: Good job. Total in aggregator account is 270,000 PKR.
Syndicate Coordinator: Zeeshan, emulator session active on device DEV-EMULATOR-ANDR-902. Do not keep funds in UBL account for more than 4 minutes. Bank AI crawler will flag velocity. Immediately transfer Rs. 268,500 to Binance Merchant 'P2P_Escrow_Whale_01'. Buy USDT at 285.50 rate and move tokens to cold wallet!
Zeeshan Ali: Transfer initiated to Binance escrow. 268,500 leaving account now.""",
    "transcript_snippets": [
        "Today's target threshold is Rs. 50,000 STR radar. Keep all drops strictly between 44,000 and 46,000.",
        "Sent Rs. 45,000 via Raast to student account PK45UNIL00088192340182 (Zeeshan Ali).",
        "Total structured accumulation: Rs. 270,000 in Zeeshan account.",
        "Emulator session active on device DEV-EMULATOR-ANDR-902. Do not keep funds in UBL account for more than 4 minutes.",
        "Immediately transfer Rs. 268,500 to Binance Merchant 'P2P_Escrow_Whale_01'."
    ],
    "mule_graph": {
        "topology_name": "6-to-1 Fan-In Smurfing with Shared IMEI & Instant Crypto Drain",
        "nodes": [
            {"id": "FEEDER-01-MULE", "label": "Smurf 1 (HBL Drop)", "role": "FEEDER_MULE", "bank": "HBL", "account_age_days": 15, "kyc_tier": "Tier 1", "device_hash": "DEV-EMULATOR-ANDR-902", "risk_score": 88, "status": "FEEDER", "balance_pkr": 450.0},
            {"id": "FEEDER-02-MULE", "label": "Smurf 2 (Easypaisa)", "role": "FEEDER_MULE", "bank": "Easypaisa", "account_age_days": 12, "kyc_tier": "Tier 1", "device_hash": "DEV-EMULATOR-ANDR-902", "risk_score": 86, "status": "FEEDER", "balance_pkr": 620.0},
            {"id": "FEEDER-03-MULE", "label": "Smurf 3 (JazzCash)", "role": "FEEDER_MULE", "bank": "JazzCash", "account_age_days": 19, "kyc_tier": "Tier 1", "device_hash": "DEV-EMULATOR-ANDR-902", "risk_score": 85, "status": "FEEDER", "balance_pkr": 110.0},
            {"id": "FEEDER-04-MULE", "label": "Smurf 4 (SadaPay)", "role": "FEEDER_MULE", "bank": "SadaPay", "account_age_days": 8, "kyc_tier": "Tier 0", "device_hash": "DEV-EMULATOR-ANDR-902", "risk_score": 91, "status": "FEEDER", "balance_pkr": 250.0},
            {"id": "FEEDER-05-MULE", "label": "Smurf 5 (NayaPay)", "role": "FEEDER_MULE", "bank": "NayaPay", "account_age_days": 11, "kyc_tier": "Tier 1", "device_hash": "DEV-EMULATOR-ANDR-902", "risk_score": 84, "status": "FEEDER", "balance_pkr": 380.0},
            {"id": "FEEDER-06-MULE", "label": "Smurf 6 (U-Micro)", "role": "FEEDER_MULE", "bank": "U-Bank", "account_age_days": 16, "kyc_tier": "Tier 1", "device_hash": "DEV-EMULATOR-ANDR-902", "risk_score": 89, "status": "FEEDER", "balance_pkr": 90.0},
            {"id": "PK45UNIL00088192340182", "label": "Hub: Zeeshan Ali (Student)", "role": "AGGREGATOR_HUB", "bank": "UBL", "account_age_days": 18, "kyc_tier": "Tier 1 Student", "device_hash": "DEV-EMULATOR-ANDR-902", "risk_score": 95, "status": "AGGREGATION_HUB", "balance_pkr": 1500.0},
            {"id": "P2P-ESCROW-BINANCE-8821", "label": "Crypto Merchant Escrow", "role": "CRYPTO_LIQUIDATION", "bank": "Binance P2P", "account_age_days": 310, "kyc_tier": "Offshore Merchant", "device_hash": "DEV-ESCROW-WHALE-01", "risk_score": 97, "status": "OFFSHORE_DRAIN", "balance_pkr": 14500000.0}
        ],
        "edges": [
            {"id": "edge-smurf-1", "source": "FEEDER-01-MULE", "target": "PK45UNIL00088192340182", "amount": 45000.0, "currency": "PKR", "timestamp": "2026-10-14T16:02:11Z", "channel": "Raast P2P", "anomaly_flag": "STRUCTURED_UNDER_50K"},
            {"id": "edge-smurf-2", "source": "FEEDER-02-MULE", "target": "PK45UNIL00088192340182", "amount": 45000.0, "currency": "PKR", "timestamp": "2026-10-14T16:04:19Z", "channel": "Raast P2P", "anomaly_flag": "STRUCTURED_UNDER_50K"},
            {"id": "edge-smurf-3", "source": "FEEDER-03-MULE", "target": "PK45UNIL00088192340182", "amount": 45000.0, "currency": "PKR", "timestamp": "2026-10-14T16:06:40Z", "channel": "1Link IBFT", "anomaly_flag": "STRUCTURED_UNDER_50K"},
            {"id": "edge-smurf-4", "source": "FEEDER-04-MULE", "target": "PK45UNIL00088192340182", "amount": 45000.0, "currency": "PKR", "timestamp": "2026-10-14T16:08:12Z", "channel": "Raast P2P", "anomaly_flag": "STRUCTURED_UNDER_50K"},
            {"id": "edge-smurf-5", "source": "FEEDER-05-MULE", "target": "PK45UNIL00088192340182", "amount": 45000.0, "currency": "PKR", "timestamp": "2026-10-14T16:10:05Z", "channel": "Raast P2P", "anomaly_flag": "STRUCTURED_UNDER_50K"},
            {"id": "edge-smurf-6", "source": "FEEDER-06-MULE", "target": "PK45UNIL00088192340182", "amount": 45000.0, "currency": "PKR", "timestamp": "2026-10-14T16:11:58Z", "channel": "Raast P2P", "anomaly_flag": "STRUCTURED_UNDER_50K"},
            {"id": "edge-smurf-7", "source": "PK45UNIL00088192340182", "target": "P2P-ESCROW-BINANCE-8821", "amount": 268500.0, "currency": "PKR", "timestamp": "2026-10-14T16:15:30Z", "channel": "P2P Instant Crypto Buy", "anomaly_flag": "BURST_DRAIN_RATIO_99_PERCENT"}
        ]
    }
}

# ============================================================================
# SCENARIO 3: Legitimate Hospital Emergency Surgery Transfer (Clean Baseline)
# ============================================================================
SCENARIO_3_CLEAN_HOSPITAL: Dict[str, Any] = {
    "id": "SCENARIO_3_CLEAN_HOSPITAL",
    "title": "Emergency Hospital Cardiac Surgery Payment (Clean Baseline Test)",
    "category": "CLEAN_URGENT",
    "severity": "BENIGN",
    "amount": 380000.0,
    "currency": "PKR",
    "channel": "1Link Real-Time IBFT",
    "timestamp": "2026-10-14T18:45:00Z",
    "sender": {
        "account_id": "ACC-SCB-44102",
        "iban": "PK89SCBL00044102981023",
        "name": "Farhan Siddiqui",
        "age": 41,
        "occupation": "Senior Software Architect",
        "bank": "Standard Chartered Bank (SCB)",
        "account_age_days": 1850,
        "kyc_tier": "Tier 2 (Full Biometric Verified)",
        "device_hash": "DEV-FARHAN-PIXEL8-KHI-192",
        "ip_address": "175.107.82.41 (Karachi, Nayatel Fiber)",
        "location": "Clifton Block 5, Karachi, Pakistan",
        "average_monthly_turnover_pkr": 420000.0,
        "historical_risk_score": 2,
    },
    "receiver": {
        "account_id": "ACC-AKBL-HOSP-21948",
        "iban": "PK15AKBL00021948291001",
        "name": "Shaukat Khanum Memorial Cancer Hospital & Research Centre",
        "bank": "Askari Bank Limited",
        "account_age_days": 3200,
        "kyc_tier": "Tier 3 (Institutional Corporate Entity / Verified NGO)",
        "device_hash": "CORP-BILLING-PORTAL-SKM-01",
        "ip_address": "111.68.99.12 (Hospital Dedicated Static IP)",
        "location": "7A Block R-3, Johar Town, Lahore, Pakistan",
        "average_monthly_turnover_pkr": 185000000.0,
        "historical_risk_score": 1,
    },
    "transcript": """[TELEPHONE CALL RECORDING - HOSPITAL BILLING HELPDESK]
Hospital Billing Officer (Sister Noreen, SKM Admissions): Emergency Billing Desk, Shaukat Khanum Memorial Hospital Lahore. Assalam-o-Alaikum, Noreen speaking.
Customer (Farhan Siddiqui): Walaikum Assalam sister. Main Farhan Siddiqui baat kar raha hoon. Mere walid Mohammad Siddiqui sahab (MRN #SKM-99218) emergency cardiac ICU ward 3 mein admit huay hain. Head doctor Dr. Jahangir ne kaha hai ke emergency coronary bypass operation ke liye 380,000 rupees ka advance security deposit billing counter par submit karwana hai.
Hospital Billing Officer: Ji Farhan sahab, bilkul. Hum ne admission record mein doctor ki emergency surgery recommendation dekh li hai. Aap online Askari Bank ke official collection account par 380,000 rupees IBFT ya Raast se transfer kar sakte hain. Title verify kar lijiye ga: 'Shaukat Khanum Memorial Cancer Hospital'.
Customer: Ji main SCB mobile app khol raha hoon. IBAN PK15AKBL00021948291001 add kar liya hai. Account title exact match kar raha hai: 'Shaukat Khanum Memorial Cancer Hospital'. Main 380,000 enter karke transfer execute kar raha hoon.
Hospital Billing Officer: Theek hai Farhan sahab. Jaise hi transfer confirm hota hai, aap receipt WhatsApp billing number par send kar dein ya counter par transaction ID bata dein. Main OT nursing team ko advance clearance notify kar rahi hoon taake doctor sahab surgery start karein.
Customer: Bohat shukriya sister! Transfer successfully sent ho gaya hai, reference number #SCB-IBFT-9921098. Dua kijiye ga walid sahab ke liye.
Hospital Billing Officer: Ameen Farhan sahab, Allah Ta'ala aapke walid ko mukammal shifa aur tandurusti ata farmaaye. Procedure team already scrub in ho rahi hai.""",
    "transcript_snippets": [
        "Mere walid Mohammad Siddiqui sahab (MRN #SKM-99218) emergency cardiac ICU ward 3 mein admit huay hain.",
        "Emergency coronary bypass operation ke liye 380,000 rupees ka advance security deposit billing counter par submit karwana hai.",
        "Aap online Askari Bank ke official collection account par 380,000 rupees IBFT ya Raast se transfer kar sakte hain.",
        "Title verify kar lijiye ga: 'Shaukat Khanum Memorial Cancer Hospital'.",
        "Procedure team already scrub in ho rahi hai. Allah Ta'ala aapke walid ko shifa ata farmaaye."
    ],
    "mule_graph": {
        "topology_name": "Clean Legitimate Institutional Healthcare Payment",
        "nodes": [
            {
                "id": "ACC-SCB-44102",
                "label": "Sender: Farhan Siddiqui",
                "role": "LEGITIMATE_CUSTOMER",
                "bank": "Standard Chartered",
                "account_age_days": 1850,
                "kyc_tier": "Tier 2",
                "device_hash": "DEV-FARHAN-PIXEL8-KHI-192",
                "risk_score": 2,
                "status": "HEALTHY_ACCOUNT",
                "balance_pkr": 1280000.0
            },
            {
                "id": "PK15AKBL00021948291001",
                "label": "Receiver: Shaukat Khanum Hospital",
                "role": "VERIFIED_INSTITUTION",
                "bank": "Askari Bank",
                "account_age_days": 3200,
                "kyc_tier": "Tier 3 Corporate Verified",
                "device_hash": "CORP-BILLING-PORTAL-SKM-01",
                "risk_score": 1,
                "status": "ESTABLISHED_INSTITUTION",
                "balance_pkr": 42500000.0
            },
            {
                "id": "CORP-SUPPLIER-MED-991",
                "label": "Hospital Medical Supplies Supplier",
                "role": "COMMERCIAL_VENDOR",
                "bank": "Habib Bank",
                "account_age_days": 2100,
                "kyc_tier": "Tier 3 Corporate",
                "device_hash": "CORP-ERP-MED-09",
                "risk_score": 3,
                "status": "ESTABLISHED_VENDOR",
                "balance_pkr": 8400000.0
            }
        ],
        "edges": [
            {
                "id": "edge-clean-1",
                "source": "ACC-SCB-44102",
                "target": "PK15AKBL00021948291001",
                "amount": 380000.0,
                "currency": "PKR",
                "timestamp": "2026-10-14T18:45:00Z",
                "channel": "1Link IBFT",
                "anomaly_flag": "NONE_LEGITIMATE_MEDICAL_INSTITUTION"
            },
            {
                "id": "edge-clean-2",
                "source": "PK15AKBL00021948291001",
                "target": "CORP-SUPPLIER-MED-991",
                "amount": 1200000.0,
                "currency": "PKR",
                "timestamp": "2026-10-14T19:00:00Z",
                "channel": "Corporate Clearing RTGS",
                "anomaly_flag": "NONE_REGULAR_VENDOR_DISBURSEMENT"
            }
        ]
    }
}

# Dictionary lookup for interactive scenarios
SCENARIOS: Dict[str, Dict[str, Any]] = {
    "SCENARIO_1_VISHING": SCENARIO_1_VISHING,
    "SCENARIO_2_SMURFING": SCENARIO_2_SMURFING,
    "SCENARIO_3_CLEAN_HOSPITAL": SCENARIO_3_CLEAN_HOSPITAL,
}


# ============================================================================
# BENCHMARK DATASET: 20 Synthetic Test Cases (15 Scams + 5 Clean Baselines)
# Used for Automated Performance Evaluation (Slide 12: Recall, FPR, Latency)
# ============================================================================
BENCHMARK_DATASET: List[Dict[str, Any]] = [
    # Case 1: FIA Police Arrest & PECA Warrant Threat
    {
        "id": "BM-01",
        "name": "FIA Cyber Crime Arrest & Freeze Coercion",
        "type": "FRAUD",
        "subtype": "VISHING",
        "expected_verdict": "QUARANTINED",
        "amount": 600000.0,
        "currency": "PKR",
        "sender": {"name": "Rashid Mehmood (Age 71)", "account_age_days": 3500, "kyc_tier": "Tier 2"},
        "receiver": {"name": "Tariq Aziz", "iban": "PK21MEZN00918273645019", "account_age_days": 3, "kyc_tier": "Tier 0"},
        "transcript": "Inspector Tariq here from FIA Cyber Crime Wing. Your CNIC is involved in hawala money laundering. Section 21 arrest warrant issued. Transfer Rs. 600,000 to state verification IBAN PK21MEZN00918273645019 within 10 minutes or police will breach your premises.",
        "graph_context": {"account_age_days": 3, "kyc_tier": "Tier 0", "fan_in": 1, "shared_device": True}
    },
    # Case 2: State Bank / BISP Fake Grant Verification
    {
        "id": "BM-02",
        "name": "State Bank BISP Grant Verification Scam",
        "type": "FRAUD",
        "subtype": "VISHING",
        "expected_verdict": "QUARANTINED",
        "amount": 85000.0,
        "currency": "PKR",
        "sender": {"name": "Kausar Parveen (Housewife)", "account_age_days": 1200, "kyc_tier": "Tier 1"},
        "receiver": {"name": "Kamran Khan", "iban": "PK92HABB00881920394812", "account_age_days": 5, "kyc_tier": "Tier 0"},
        "transcript": "Assalam-o-Alaikum, State Bank of Pakistan BISP Directorate. Congratulations your Rs. 150,000 grant is approved. To activate tax clearance ledger transfer refundable processing fee of Rs. 85,000 immediately.",
        "graph_context": {"account_age_days": 5, "kyc_tier": "Tier 0", "fan_in": 4, "shared_device": True}
    },
    # Case 3: PTA SIM Card Biometric Deactivation Threat
    {
        "id": "BM-03",
        "name": "PTA SIM Biometric Block Urgent Threat",
        "type": "FRAUD",
        "subtype": "VISHING",
        "expected_verdict": "QUARANTINED",
        "amount": 120000.0,
        "currency": "PKR",
        "sender": {"name": "Tariq Anwar", "account_age_days": 1800, "kyc_tier": "Tier 2"},
        "receiver": {"name": "Waqas Shabbir", "iban": "PK55BAHL00019283746519", "account_age_days": 6, "kyc_tier": "Tier 0"},
        "transcript": "This is Pakistan Telecommunication Authority automated alert. All 5 SIMs on your identity will be blocked within 30 minutes due to biometric irregularity. Send Rs. 120,000 security bond to biometric officer account or face nationwide telecom blacklist.",
        "graph_context": {"account_age_days": 6, "kyc_tier": "Tier 0", "fan_in": 3, "shared_device": False}
    },
    # Case 4: Army Officer Impersonator Vehicle Auction Advance
    {
        "id": "BM-04",
        "name": "Military Officer Impersonator Vehicle Auction Scam",
        "type": "FRAUD",
        "subtype": "IMPERSONATION",
        "expected_verdict": "QUARANTINED",
        "amount": 250000.0,
        "currency": "PKR",
        "sender": {"name": "Usman Ghani", "account_age_days": 890, "kyc_tier": "Tier 2"},
        "receiver": {"name": "Major Asad (Mule)", "iban": "PK33UNIL00029384756102", "account_age_days": 8, "kyc_tier": "Tier 0"},
        "transcript": "Major Asad speaking from GHQ Logistics Rawalpindi. Toyota Fortuner army auction allotment confirmed for you. Transfer earnest token Rs. 250,000 right now before 3:00 PM tender deadline or vehicle will be allocated to next bidder.",
        "graph_context": {"account_age_days": 8, "kyc_tier": "Tier 0", "fan_in": 2, "shared_device": True}
    },
    # Case 5: Telegram Video Task Crypto Smurfing Mule
    {
        "id": "BM-05",
        "name": "Telegram Task Scam Money Mule Structuring",
        "type": "FRAUD",
        "subtype": "SMURFING",
        "expected_verdict": "QUARANTINED",
        "amount": 48000.0,
        "currency": "PKR",
        "sender": {"name": "Task Victim Ring 01", "account_age_days": 40, "kyc_tier": "Tier 1"},
        "receiver": {"name": "Student Mule Aggregator", "iban": "PK77JSBL00039281726354", "account_age_days": 11, "kyc_tier": "Tier 1"},
        "transcript": "Telegram Admin: Complete YouTube like task #4. Deposit Rs. 48,000 into crypto commission account to unlock VIP tier 5 payout of Rs. 95,000 within 5 minutes. Hurry crypto block closes in 4 minutes.",
        "graph_context": {"account_age_days": 11, "kyc_tier": "Tier 1", "fan_in": 8, "shared_device": True}
    },
    # Case 6: WAPDA Electricity Disconnection Emergency Vishing
    {
        "id": "BM-06",
        "name": "WAPDA Bill Disconnection Emergency Vishing",
        "type": "FRAUD",
        "subtype": "VISHING",
        "expected_verdict": "QUARANTINED",
        "amount": 75000.0,
        "currency": "PKR",
        "sender": {"name": "Saeed Akhtar (Elderly Merchant)", "account_age_days": 2100, "kyc_tier": "Tier 2"},
        "receiver": {"name": "WAPDA Sub-Officer (Mule)", "iban": "PK19BAFL00091827364502", "account_age_days": 7, "kyc_tier": "Tier 0"},
        "transcript": "LESCO WAPDA Emergency Team. Your commercial meter connection will be severed in 15 minutes due to overdue fuel price adjustment arrears. Pay Rs. 75,000 on Raast ID immediately to prevent grid cutoff.",
        "graph_context": {"account_age_days": 7, "kyc_tier": "Tier 0", "fan_in": 5, "shared_device": True}
    },
    # Case 7: WhatsApp Virtual Kidnapping Extortion Threat
    {
        "id": "BM-07",
        "name": "Virtual Kidnapping Urgent Extortion Scam",
        "type": "FRAUD",
        "subtype": "VISHING",
        "expected_verdict": "QUARANTINED",
        "amount": 300000.0,
        "currency": "PKR",
        "sender": {"name": "Mrs. Nasreen Akhtar", "account_age_days": 1600, "kyc_tier": "Tier 2"},
        "receiver": {"name": "Zubair Hashmi", "iban": "PK66MCIB00019283746591", "account_age_days": 2, "kyc_tier": "Tier 0"},
        "transcript": "Listen to me woman, we have captured your son from university. He is tied in our trunk! If you call police or hang up the phone he is dead. Transfer Rs. 300,000 to this Raast account right now or his fingers will be delivered to your door!",
        "graph_context": {"account_age_days": 2, "kyc_tier": "Tier 0", "fan_in": 1, "shared_device": False}
    },
    # Case 8: Overseas Son in Jail Police Imposter Bail Scam
    {
        "id": "BM-08",
        "name": "Overseas Son Police Custody Bail Imposter",
        "type": "FRAUD",
        "subtype": "VISHING",
        "expected_verdict": "QUARANTINED",
        "amount": 500000.0,
        "currency": "PKR",
        "sender": {"name": "Chaudhry Riaz (Father)", "account_age_days": 4000, "kyc_tier": "Tier 2"},
        "receiver": {"name": "Embassy Agent (Mule)", "iban": "PK44FAYS00039281726351", "account_age_days": 9, "kyc_tier": "Tier 0"},
        "transcript": "Chaudhry sahab, Dubai Police custody officer speaking. Your son Hamza has been arrested in a traffic accident case. He is in Al-Barsha jail. Transfer 500,000 PKR consular bail bond within 20 minutes before magistrate remand hearing.",
        "graph_context": {"account_age_days": 9, "kyc_tier": "Tier 0", "fan_in": 3, "shared_device": True}
    },
    # Case 9: Credit Card Reward Points Expiry OTP Harvesting
    {
        "id": "BM-09",
        "name": "Credit Card Reward Points Expiry OTP Harvesting",
        "type": "FRAUD",
        "subtype": "CREDENTIAL_HARVESTING",
        "expected_verdict": "QUARANTINED",
        "amount": 95000.0,
        "currency": "PKR",
        "sender": {"name": "Babar Azam Siddiqui", "account_age_days": 1100, "kyc_tier": "Tier 2"},
        "receiver": {"name": "Points Redemption Gateway", "iban": "PK88SNBL00029384756192", "account_age_days": 13, "kyc_tier": "Tier 1"},
        "transcript": "Bank Security Department: Your 45,000 reward points worth Rs. 95,000 expire at midnight. We are processing auto-credit into your account. Tell me the 6 digit authorization passcode sent on your phone to complete verification.",
        "graph_context": {"account_age_days": 13, "kyc_tier": "Tier 1", "fan_in": 6, "shared_device": True}
    },
    # Case 10: Customs Anti-Narcotics Parcel Seizure Blackmail
    {
        "id": "BM-10",
        "name": "Customs Narcotics Parcel Seizure Extortion",
        "type": "FRAUD",
        "subtype": "VISHING",
        "expected_verdict": "QUARANTINED",
        "amount": 750000.0,
        "currency": "PKR",
        "sender": {"name": "Dr. Sohail Qureshi", "account_age_days": 2900, "kyc_tier": "Tier 2"},
        "receiver": {"name": "Anti-Narcotics Vault", "iban": "PK01BIPL00019283746599", "account_age_days": 4, "kyc_tier": "Tier 0"},
        "transcript": "Anti-Narcotics Force & DHL Customs Joint Team. A contraband international package containing 400g ketamine with your passport details has been intercepted at Karachi cargo. Non-bailable FIR #892 registered. Deposit 750,000 PKR non-involvement escrow clearance immediately.",
        "graph_context": {"account_age_days": 4, "kyc_tier": "Tier 0", "fan_in": 2, "shared_device": True}
    },
    # Case 11: Student Freelance Account Rental Mule Ring Structuring
    {
        "id": "BM-11",
        "name": "Student Freelance Account Smurfing Ring",
        "type": "FRAUD",
        "subtype": "SMURFING",
        "expected_verdict": "QUARANTINED",
        "amount": 180000.0,
        "currency": "PKR",
        "sender": {"name": "Smurf Syndicate Feeders", "account_age_days": 15, "kyc_tier": "Tier 1"},
        "receiver": {"name": "Student Account Mule", "iban": "PK29DIBP00091827364512", "account_age_days": 20, "kyc_tier": "Tier 1"},
        "transcript": "Telegram Syndicate: Rent your UBL and DIB accounts for 20,000 monthly commission. Four incoming payments of Rs. 45,000 structured to bypass anti-money laundering monitoring, drain immediately to Tether USDT on Binance.",
        "graph_context": {"account_age_days": 20, "kyc_tier": "Tier 1", "fan_in": 7, "shared_device": True}
    },
    # Case 12: Circular Wash-Trading Mule Cluster
    {
        "id": "BM-12",
        "name": "Rapid Circular Wash-Trading Mule Cluster",
        "type": "FRAUD",
        "subtype": "MULE_NETWORK",
        "expected_verdict": "QUARANTINED",
        "amount": 220000.0,
        "currency": "PKR",
        "sender": {"name": "Cluster Node Alpha", "account_age_days": 25, "kyc_tier": "Tier 1"},
        "receiver": {"name": "Cluster Node Beta", "iban": "PK45SONE00019283746501", "account_age_days": 22, "kyc_tier": "Tier 1"},
        "transcript": "Automated API Bot: Routing transaction batch #991 through circular topology A -> B -> C -> A to obscure beneficial ownership before terminal crypto cashout.",
        "graph_context": {"account_age_days": 22, "kyc_tier": "Tier 1", "fan_in": 5, "circular_flow": True, "shared_device": True}
    },
    # Case 13: High-Velocity Fan-In / Instant ATM Cash Drain
    {
        "id": "BM-13",
        "name": "High-Velocity Fan-In with Instant Physical ATM Drain",
        "type": "FRAUD",
        "subtype": "MULE_NETWORK",
        "expected_verdict": "QUARANTINED",
        "amount": 400000.0,
        "currency": "PKR",
        "sender": {"name": "Multiple Coerced Victims", "account_age_days": 1500, "kyc_tier": "Tier 2"},
        "receiver": {"name": "Rapid Cashout Mule", "iban": "PK90ALFH00019283746588", "account_age_days": 8, "kyc_tier": "Tier 0"},
        "transcript": "Mule Coordinator: Account PK90ALFH00019283746588 funded with 400k. Card puller is stationed at Saddar ATM terminal right now. Pull maximum cash limit before freeze flag lands.",
        "graph_context": {"account_age_days": 8, "kyc_tier": "Tier 0", "fan_in": 9, "drain_velocity_mins": 3.5, "shared_device": True}
    },
    # Case 14: Bank IT Helpdesk Screen-Sharing AnyDesk APK Coercion
    {
        "id": "BM-14",
        "name": "Bank IT Helpdesk Screen-Sharing Malware Coercion",
        "type": "FRAUD",
        "subtype": "COERCION",
        "expected_verdict": "QUARANTINED",
        "amount": 320000.0,
        "currency": "PKR",
        "sender": {"name": "Salma Khatoon (Teacher)", "account_age_days": 2200, "kyc_tier": "Tier 2"},
        "receiver": {"name": "IT Security Server (Mule)", "iban": "PK11FWBL00088192039481", "account_age_days": 10, "kyc_tier": "Tier 0"},
        "transcript": "Bank IT Security Helpline: Ma'am a cyber malware is draining your account right now. Install our security patch app from link or open AnyDesk screen share immediately. Keep screen on while we move your balance to safe clearing account.",
        "graph_context": {"account_age_days": 10, "kyc_tier": "Tier 0", "fan_in": 3, "shared_device": True}
    },
    # Case 15: Predatory Digital Loan App Blackmail Transfer
    {
        "id": "BM-15",
        "name": "Predatory Digital Loan App Extortion Transfer",
        "type": "FRAUD",
        "subtype": "EXTORTION",
        "expected_verdict": "QUARANTINED",
        "amount": 150000.0,
        "currency": "PKR",
        "sender": {"name": "Junaid Khan (Clerk)", "account_age_days": 900, "kyc_tier": "Tier 2"},
        "receiver": {"name": "Loan App Recovery Mule", "iban": "PK50SBLP00091827364501", "account_age_days": 14, "kyc_tier": "Tier 1"},
        "transcript": "Easy Loan Recovery Agent: Listen Junaid, you have 1 hour. We have copied all your phone contacts, gallery photos, and family numbers. If Rs. 150,000 penalty is not paid to this wallet by 4 PM, your morphed photos will be sent to your employer and relatives.",
        "graph_context": {"account_age_days": 14, "kyc_tier": "Tier 1", "fan_in": 6, "shared_device": True}
    },

    # ------------------------------------------------------------------------
    # 5 Legitimate Urgent Banking Cases (Clean Baselines - Proof of 0% FPR)
    # ------------------------------------------------------------------------
    # Case 16: Urgent University Semester Fee Deadline Payment
    {
        "id": "BM-16",
        "name": "Urgent University Semester Fee Payment",
        "type": "CLEAN",
        "subtype": "EDUCATION",
        "expected_verdict": "CLEARED",
        "amount": 220000.0,
        "currency": "PKR",
        "sender": {"name": "Mansoor Tariq (Parent)", "account_age_days": 2400, "kyc_tier": "Tier 2"},
        "receiver": {"name": "National University of Sciences and Technology (NUST)", "iban": "PK35HABB00021948291005", "account_age_days": 3800, "kyc_tier": "Tier 3 Corporate"},
        "transcript": "Father: Mansoor here, paying my son Bilal Mansoor's 5th semester tuition fee (Challan #NUST-2026-FEE-88192). Today is the absolute last deadline before late penalty and registration drop. Transferring Rs. 220,000 to official NUST Askari/HBL challan account.",
        "graph_context": {"account_age_days": 3800, "kyc_tier": "Tier 3 Corporate", "fan_in": 1200, "shared_device": False, "is_verified_institution": True}
    },
    # Case 17: Emergency Hospital ICU Surgery Deposit
    {
        "id": "BM-17",
        "name": "Emergency Hospital ICU Surgery Deposit",
        "type": "CLEAN",
        "subtype": "HEALTHCARE",
        "expected_verdict": "CLEARED",
        "amount": 400000.0,
        "currency": "PKR",
        "sender": {"name": "Hamid Raza (Brother)", "account_age_days": 3100, "kyc_tier": "Tier 2"},
        "receiver": {"name": "Shifa International Hospital Emergency Admissions", "iban": "PK20AKBL00039281726359", "account_age_days": 4100, "kyc_tier": "Tier 3 Corporate"},
        "transcript": "Caller: Hospital admissions counter, emergency trauma center. Patient Zain Raza brought in road accident. Immediate surgical stabilization deposit required: Rs. 400,000 to Shifa International Askari Bank title account. Receipt presented at counter.",
        "graph_context": {"account_age_days": 4100, "kyc_tier": "Tier 3 Corporate", "fan_in": 450, "shared_device": False, "is_verified_institution": True}
    },
    # Case 18: Real Estate Registrar Token Earnest Money
    {
        "id": "BM-18",
        "name": "Real Estate Sub-Registrar Token Earnest Money",
        "type": "CLEAN",
        "subtype": "REAL_ESTATE",
        "expected_verdict": "CLEARED",
        "amount": 500000.0,
        "currency": "PKR",
        "sender": {"name": "Naveed Afzal (Buyer)", "account_age_days": 1900, "kyc_tier": "Tier 2"},
        "receiver": {"name": "Malik property sellers & builders verified title", "iban": "PK50MEZN00019283746599", "account_age_days": 1800, "kyc_tier": "Tier 2"},
        "transcript": "Buyer: Naveed Afzal at Sub-Registrar office F-8 Islamabad with deed writers. Transferring earnest money token Rs. 500,000 for Plot 14, Street 12, Park View Enclave as per registered agreement to sell witnessed by stamp vendor.",
        "graph_context": {"account_age_days": 1800, "kyc_tier": "Tier 2", "fan_in": 8, "shared_device": False}
    },
    # Case 19: Port Container Demurrage Clearing Commercial Payment
    {
        "id": "BM-19",
        "name": "Port Demurrage & Customs Clearance Commercial Payment",
        "type": "CLEAN",
        "subtype": "COMMERCIAL",
        "expected_verdict": "CLEARED",
        "amount": 450000.0,
        "currency": "PKR",
        "sender": {"name": "Apex Impex Trading Corp", "account_age_days": 2700, "kyc_tier": "Tier 3 Corporate"},
        "receiver": {"name": "Karachi International Container Terminal (KICT)", "iban": "PK12SCBL00049281726350", "account_age_days": 4500, "kyc_tier": "Tier 3 Corporate"},
        "transcript": "Commercial Logistics Manager: Urgent payment of Rs. 450,000 for container clearance bill #KICT-DEM-99214 to avoid additional 24-hour port demurrage surcharge. Paid to Karachi International Container Terminal official collection account.",
        "graph_context": {"account_age_days": 4500, "kyc_tier": "Tier 3 Corporate", "fan_in": 3200, "shared_device": False, "is_verified_institution": True}
    },
    # Case 20: Family Wedding Catering Hall Final Balance Settlement
    {
        "id": "BM-20",
        "name": "Wedding Marquee Event Balance Settlement",
        "type": "CLEAN",
        "subtype": "PERSONAL_COMMERCIAL",
        "expected_verdict": "CLEARED",
        "amount": 350000.0,
        "currency": "PKR",
        "sender": {"name": "Zubair Hashmi (Groom's Brother)", "account_age_days": 1400, "kyc_tier": "Tier 2"},
        "receiver": {"name": "Grand Ambassador Marquee Events", "iban": "PK98BAFL00039281726350", "account_age_days": 1300, "kyc_tier": "Tier 2"},
        "transcript": "Zubair here: Paying final settlement balance of Rs. 350,000 for wedding reception hall booking for tonight 300 guests catering. Agreement receipt #GAM-8819 issued by banquet event manager.",
        "graph_context": {"account_age_days": 1300, "kyc_tier": "Tier 2", "fan_in": 40, "shared_device": False}
    }
]
