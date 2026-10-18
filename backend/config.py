"""
Shaheen Interceptor - Core Configuration & Configurable Detection Thresholds
All financial thresholds, latency targets, and multi-agent weights are defined as constants here.
No magic numbers in detection logic.
"""

# AML / Structuring Thresholds (Illustrative/configurable, aligned with SBP/FATF guidance)
AML_STRUCTURING_THRESHOLD_PKR = 50000.0   # Illustrative micro-structuring boundary
STRUCTURING_LOWER_RATIO = 0.70            # Transactions between 70% and 100% of threshold
STRUCTURING_MIN_COUNT = 3                 # Minimum micro-transactions to flag coordinated smurfing

# Account Tenure Risk Boundaries (Days)
EPHEMERAL_ACCOUNT_AGE_DAYS = 14           # Critical high-risk newly opened account
RECENT_ACCOUNT_AGE_DAYS = 60              # Moderate-risk onboarding window

# Mule Graph Topology Thresholds
HIGH_FAN_IN_THRESHOLD = 4                 # 4+ incoming funding streams
HIGH_FAN_OUT_THRESHOLD = 3                # 3+ rapid outflow distribution nodes
RAPID_DRAIN_RATIO_THRESHOLD = 0.80        # Outbound volume >= 80% of inbound within rapid window
RAPID_DRAIN_WINDOW_SECONDS = 300          # 5 minutes rapid drain window

# Multi-Agent Risk Fusion Weights
COERCION_WEIGHT = 0.55                    # Weight of Agent 1 conversational coercion telemetry
MULE_GRAPH_WEIGHT = 0.45                  # Weight of Agent 2 recipient topology telemetry

# Settlement Verdict Thresholds
VERDICT_QUARANTINE_SCORE = 75             # Score >= 75 halts settlement pre-clearing
VERDICT_FLAGGED_SCORE = 45                # Score between 45 and 74 triggers biometric step-up

# Institutional Clearance Safety Gates
INSTITUTION_MAX_MULE_SCORE = 20           # Must be < 20 to qualify for institutional bypass
INSTITUTION_MAX_COERCION_SCORE = 25       # Must be < 25 to ensure coerced institutional transfers are caught
