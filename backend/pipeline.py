"""
Shaheen Interceptor - Unified Transaction Evaluation Pipeline (P0-2)
Contains the single canonical execution pathway for transaction analysis.
Both /api/analyze-transaction and benchmark evaluation call this exact function.
No separate or divergent evaluation logic allowed.
"""

import os
import uuid
import time
import asyncio
from datetime import datetime, timezone
from typing import Dict, Any, Optional

from config import (
    COERCION_WEIGHT,
    MULE_GRAPH_WEIGHT,
    VERDICT_QUARANTINE_SCORE,
    VERDICT_FLAGGED_SCORE,
    INSTITUTION_MAX_MULE_SCORE,
    INSTITUTION_MAX_COERCION_SCORE
)
from verified_registry import is_verified_institution, lookup_verified_institution
from agents import CoercionDetectorAgent, MuleGraphHunterAgent, CoercionAnalysisResult, MuleGraphAnalysisResult

# Module-level agent singletons
default_agent_1 = CoercionDetectorAgent()
default_agent_2 = MuleGraphHunterAgent()


async def evaluate_transaction(
    transcript: str,
    amount: float,
    sender: Dict[str, Any],
    receiver: Dict[str, Any],
    graph_data: Optional[Dict[str, Any]] = None,
    channel: str = "Raast Instant Transfer",
    currency: str = "PKR",
    scenario_id: Optional[str] = None,
    storage: Optional[Any] = None,
    agent_1: Optional[CoercionDetectorAgent] = None,
    agent_2: Optional[MuleGraphHunterAgent] = None,
    alert_id: Optional[str] = None
) -> Dict[str, Any]:
    """
    Canonical Multi-Agent Evaluation Pipeline.
    1. Runs Agent 1 (Coercion) and Agent 2 (Graph) concurrently.
    2. Performs Risk Fusion with Institutional Registry Gates.
    3. Derives pre-settlement verdict (QUARANTINED | FLAGGED | CLEARED).
    4. Measures real elapsed latency and identifies execution engine.
    5. Optionally persists to storage layer.
    """
    start_time = time.perf_counter()
    a1 = agent_1 or default_agent_1
    a2 = agent_2 or default_agent_2

    receiver_iban = str(receiver.get("iban", receiver.get("account_id", ""))).strip().replace(" ", "").upper()

    # 1. Execute Agent 1 and Agent 2 concurrently in threadpool
    loop = asyncio.get_running_loop()
    coercion_task = loop.run_in_executor(None, a1.analyze, transcript, amount, sender, receiver)
    graph_task = loop.run_in_executor(None, a2.analyze, receiver_iban, amount, graph_data or {}, receiver)

    coercion_result: CoercionAnalysisResult
    graph_result: MuleGraphAnalysisResult
    coercion_result, graph_result = await asyncio.gather(coercion_task, graph_task)

    # 2. Risk Fusion Engine
    c_score = coercion_result.coercion_score
    m_score = graph_result.mule_risk_score

    # Weighted composite: 55% coercion signals, 45% graph anomaly signals
    composite = round(COERCION_WEIGHT * c_score + MULE_GRAPH_WEIGHT * m_score)

    # High mule risk dominates in smurfing/structuring syndicates
    if m_score >= 50:
        composite = max(composite, m_score)

    # High coercion dominates in direct impersonation/vishing attacks
    if c_score >= 50:
        composite = max(composite, c_score)

    # Institutional clearance gate (P0-6):
    # Cleared ONLY when receiver IBAN is in server verified registry AND m_score < 20 AND c_score < 25
    is_verified_inst = is_verified_institution(receiver_iban)
    if is_verified_inst and m_score < INSTITUTION_MAX_MULE_SCORE and c_score < INSTITUTION_MAX_COERCION_SCORE:
        composite = min(composite, 5)

    combined_risk_score = min(100, max(0, composite))

    # 3. Determine Settlement Verdict
    if combined_risk_score >= VERDICT_QUARANTINE_SCORE:
        verdict = "QUARANTINED"
        action_summary = "CRITICAL RISK: Transfer halted pre-settlement. Active Decoy primed; beneficiary account quarantined."
    elif combined_risk_score >= VERDICT_FLAGGED_SCORE:
        verdict = "FLAGGED"
        action_summary = "MODERATE RISK: Step-up biometric authentication and out-of-band verification required."
    else:
        verdict = "CLEARED"
        action_summary = "LOW RISK: Legitimate payment. Instant core settlement permitted."

    latency_ms = round((time.perf_counter() - start_time) * 1000, 1)
    assigned_alert_id = alert_id or f"ALT-{uuid.uuid4().hex[:8].upper()}"
    timestamp = datetime.now(timezone.utc).isoformat()
    overall_engine = "gemini" if coercion_result.engine == "gemini" else "deterministic_fallback"

    alert_dossier = {
        "alert_id": assigned_alert_id,
        "scenario_id": scenario_id,
        "timestamp": timestamp,
        "amount": amount,
        "currency": currency,
        "channel": channel,
        "sender": sender,
        "receiver": receiver,
        "verdict": verdict,
        "combined_risk_score": combined_risk_score,
        "coercion_score": c_score,
        "mule_risk_score": m_score,
        "latency_ms": latency_ms,
        "engine": overall_engine,
        "action_summary": action_summary,
        "agent_1_coercion": coercion_result.model_dump(),
        "agent_2_graph": graph_result.model_dump(),
        "detected_tactics": coercion_result.detected_tactics,
        "highlighted_phrases": coercion_result.highlighted_phrases,
        "graph_anomalies": graph_result.graph_anomalies,
        "graph_topology": {
            "nodes": graph_result.nodes,
            "edges": graph_result.edges
        }
    }

    # Persist alert if storage provided
    if storage:
        try:
            storage.save_alert(assigned_alert_id, alert_dossier)
        except Exception as e:
            # Storage failure must not crash the pipeline
            pass

    return alert_dossier
