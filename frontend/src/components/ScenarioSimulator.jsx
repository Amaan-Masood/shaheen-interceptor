import React from "react";
import { PhoneCall, ShieldAlert, Cpu, Lock, AlertTriangle, ArrowRight, CheckCircle2, Radio, Activity, Zap, Volume2 } from "lucide-react";

export default function ScenarioSimulator({
  currentScenario,
  onIntercept,
  isAnalyzing,
  currentAlert
}) {
  const current = currentScenario || {};
  const isClean = current.category === "CLEAN_URGENT";

  let transcriptLines = [];
  if (Array.isArray(current.transcript) && current.transcript.length > 0) {
    transcriptLines = current.transcript;
  } else if (Array.isArray(current.transcript_snippets) && current.transcript_snippets.length > 0) {
    transcriptLines = current.transcript_snippets;
  } else if (typeof current.transcript === "string" && current.transcript.trim()) {
    transcriptLines = [{ speaker: "PERPETRATOR", text: current.transcript, tag: "COERCION_STREAM" }];
  }

  // Psychological Coercion Triggers to highlight in transcript
  const highlightTriggers = (text) => {
    if (!text || isClean) return text;
    const triggers = [
      "FIA Cyber Crime",
      "FIA Headquarter",
      "Immediate Arrest",
      "darwaza tod",
      "giraftari",
      "police raid",
      "money laundering",
      "bank block",
      "Section 21",
      "arrest warrant",
      "emergency deposit",
      "do not tell",
      "kisi ko mat batana"
    ];

    // Simple regex highlight
    let result = text;
    triggers.forEach((trig) => {
      const regex = new RegExp(`(${trig})`, "gi");
      result = result.replace(regex, "🔴 $1");
    });
    return result;
  };

  // Mathematical Risk Vector Calculations
  const coercionScore = isClean ? 4 : (currentAlert?.coercion_score ?? 96);
  const graphIntolerance = isClean ? 2 : (currentAlert?.graph_risk_score ?? 91);
  const anomalyScore = isClean ? 6 : (currentAlert?.behavioral_score ?? 88);

  return (
    <div className="bg-[#0A0E17] border border-white/[0.08] rounded-xl p-3 sm:p-4 flex flex-col h-full space-y-3.5 shadow-xl">
      {/* Panel Tactical Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isClean ? "bg-[#10B981]" : "bg-[#F43F5E] animate-ping"}`} />
          <span className="font-mono text-xs font-bold text-white tracking-wider uppercase">
            [ WIRE_INTERCEPT // TX_INGRESS ]
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10.5px] font-mono text-[#94A3B8]">
          <span className="text-[#64748B]">GATEWAY:</span>
          <span className="text-[#00F0FF] font-bold">{current.channel || "SBP Raast Instant"}</span>
        </div>
      </div>

      {/* Transaction Forensic Voucher */}
      <div className="bg-[#0D121D] border border-white/[0.06] rounded-lg p-3 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#94A3B8]">
            INTER-BANK SETTLEMENT ATTEMPT
          </span>
          <span
            className={`text-[9px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
              isClean
                ? "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30"
                : "bg-[#F43F5E]/15 text-[#F43F5E] border-[#F43F5E]/30"
            }`}
          >
            {isClean ? "VERIFIED RECIPIENT" : "INTERCEPTED AT GATEWAY"}
          </span>
        </div>

        {/* Amount Display */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black font-mono text-white tracking-tight">
            Rs. {Number(current.amount || 0).toLocaleString()}
          </span>
          <span className="text-xs font-mono font-bold text-[#64748B]">PKR</span>
        </div>

        {/* Originator & Beneficiary Split Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/[0.04] text-xs font-mono">
          {/* Originator */}
          <div className="p-2 rounded bg-[#080B11] border border-white/[0.04] space-y-1">
            <div className="text-[9px] text-[#64748B] font-bold uppercase flex items-center justify-between">
              <span>ORIGINATOR</span>
              <span className="text-[#00F0FF]">{current.sender?.account?.slice(0, 10) || "ACC-MZN"}</span>
            </div>
            <div className="font-bold text-white text-[11px] truncate">{current.sender?.name || "Sender Account"}</div>
            <div className="text-[#94A3B8] text-[10px] truncate">{current.sender?.bank || "Meezan Bank Ltd"}</div>
            <div className="text-[9.5px] text-[#10B981] font-semibold pt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-2.5 h-2.5" />
              <span>{current.sender?.kyc_tier || "Biometric Tier 2"}</span>
            </div>
          </div>

          {/* Beneficiary */}
          <div
            className={`p-2 rounded border space-y-1 ${
              isClean
                ? "bg-[#080B11] border-white/[0.04]"
                : "bg-[#150B10] border-[#F43F5E]/30"
            }`}
          >
            <div className="text-[9px] text-[#64748B] font-bold uppercase flex items-center justify-between">
              <span>BENEFICIARY</span>
              {!isClean && (
                <span className="text-[9px] font-black text-[#F43F5E]">
                  Age: {current.receiver?.account_age_days || 4}d
                </span>
              )}
            </div>
            <div className="font-bold text-white text-[11px] truncate">{current.receiver?.name || "Recipient Account"}</div>
            <div className="text-[#94A3B8] text-[10px] truncate">{current.receiver?.bank || "Habib Bank Ltd"}</div>
            <div className="text-[9.5px] font-mono text-[#F59E0B] truncate pt-0.5">
              {current.receiver?.iban || "PK36MEZN00019283746501"}
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Vector Mathematical Risk Gauge */}
      <div className="bg-[#0D121D] border border-white/[0.06] rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase text-[#94A3B8]">
          <span>MULTI-VECTOR RISK TELEMETRY</span>
          <span className="text-[#64748B]">PARALLEL ENGINES</span>
        </div>

        <div className="space-y-1.5 text-[10.5px] font-mono">
          {/* Coercion Vector (40% Weight) */}
          <div>
            <div className="flex justify-between text-[#94A3B8] mb-0.5">
              <span>Acoustic & Psychological Coercion (40%)</span>
              <span className={`font-bold ${coercionScore > 50 ? "text-[#F43F5E]" : "text-[#10B981]"}`}>
                {coercionScore}%
              </span>
            </div>
            <div className="w-full bg-[#080B11] h-1.5 rounded-full overflow-hidden border border-white/[0.04]">
              <div
                className={`h-full transition-all duration-500 ${isClean ? "bg-[#10B981]" : "bg-[#F43F5E]"}`}
                style={{ width: `${coercionScore}%` }}
              />
            </div>
          </div>

          {/* Graph Intolerance Vector (35% Weight) */}
          <div>
            <div className="flex justify-between text-[#94A3B8] mb-0.5">
              <span>Mule Network Intolerance (35%)</span>
              <span className={`font-bold ${graphIntolerance > 50 ? "text-[#F59E0B]" : "text-[#10B981]"}`}>
                {graphIntolerance}%
              </span>
            </div>
            <div className="w-full bg-[#080B11] h-1.5 rounded-full overflow-hidden border border-white/[0.04]">
              <div
                className={`h-full transition-all duration-500 ${isClean ? "bg-[#10B981]" : "bg-[#F59E0B]"}`}
                style={{ width: `${graphIntolerance}%` }}
              />
            </div>
          </div>

          {/* Behavioral Anomaly Vector (25% Weight) */}
          <div>
            <div className="flex justify-between text-[#94A3B8] mb-0.5">
              <span>Behavioral Velocity Anomaly (25%)</span>
              <span className={`font-bold ${anomalyScore > 50 ? "text-[#00F0FF]" : "text-[#10B981]"}`}>
                {anomalyScore}%
              </span>
            </div>
            <div className="w-full bg-[#080B11] h-1.5 rounded-full overflow-hidden border border-white/[0.04]">
              <div
                className={`h-full transition-all duration-500 ${isClean ? "bg-[#10B981]" : "bg-[#00F0FF]"}`}
                style={{ width: `${anomalyScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cellular Wiretap & Transcription Timeline */}
      <div className="bg-[#0D121D] border border-white/[0.06] rounded-lg p-3 flex-1 flex flex-col space-y-2.5 min-h-[220px]">
        {/* Wiretap Telemetry Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] text-xs">
          <div className="flex items-center gap-2 font-mono font-bold text-white text-[11px]">
            <PhoneCall className={`w-3.5 h-3.5 ${isClean ? "text-[#10B981]" : "text-[#F43F5E] animate-pulse"}`} />
            <span>INTERCEPTED CALL TIMELINE</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Dynamic Equalizer Bars */}
            <div className="flex items-end gap-0.5 h-3">
              {[1, 2, 3, 4, 5, 6].map((barNum) => (
                <div
                  key={barNum}
                  className={`w-0.5 rounded-full ${isClean ? "bg-[#10B981]" : "bg-[#F43F5E]"} eq-bar-${barNum}`}
                />
              ))}
            </div>
            <span className="text-[10px] font-mono text-[#64748B]">
              {isClean ? "DIRECT TRUNK LINE" : "VOIP SPOOF DETECTED"}
            </span>
          </div>
        </div>

        {/* Scrollable Dialogue Bubbles */}
        <div className="space-y-2 overflow-y-auto flex-1 pr-1 max-h-[240px]">
          {transcriptLines.map((line, idx) => {
            const rawText = typeof line === "string" ? line : line?.text || "";
            const speaker = typeof line === "object" && line?.speaker ? line.speaker : "TRANSCRIPT";
            const tag = typeof line === "object" && line?.tag ? String(line.tag) : null;
            const isPerpetrator =
              speaker === "PERPETRATOR" ||
              (typeof speaker === "string" && (speaker.includes("SYNDICATE") || speaker.includes("Inspector")));

            return (
              <div
                key={idx}
                className={`p-2.5 rounded-md text-xs leading-relaxed transition-all ${
                  isPerpetrator
                    ? "bg-[#180C11] border border-[#F43F5E]/40 text-[#F1F5F9]"
                    : isClean
                    ? "bg-[#0C1712] border border-[#10B981]/30 text-[#E2E8F0]"
                    : "bg-[#080B11] border border-white/[0.04] text-[#CBD5E1]"
                }`}
              >
                <div className="flex items-center justify-between mb-1 font-mono">
                  <span
                    className={`text-[10px] font-bold ${
                      isPerpetrator ? "text-[#F43F5E]" : isClean ? "text-[#10B981]" : "text-[#00F0FF]"
                    }`}
                  >
                    {speaker === "PERPETRATOR" ? "Caller (Inspector Tariq // Impersonator)" : speaker}
                  </span>
                  {tag && (
                    <span
                      className={`text-[8.5px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        isClean || tag.includes("VERIFIED") || tag.includes("GENUINE")
                          ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30"
                          : "bg-[#F43F5E] text-white"
                      }`}
                    >
                      {tag.replace(/_/g, " ")}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#E2E8F0] font-sans">
                  {highlightTriggers(rawText)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Wiretap Acoustic Telemetry Strip */}
        <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[9.5px] font-mono text-[#64748B]">
          <span>CODEC: AMR-WB 12.65 kbps</span>
          <span>STRESS PITCH: {isClean ? "98 Hz (BASELINE)" : "142 Hz (+44 Hz AGITATION)"}</span>
          <span className={isClean ? "text-[#10B981]" : "text-[#F43F5E]"}>
            {isClean ? "CADENCE: NORMAL" : "CADENCE: COERCIVE"}
          </span>
        </div>
      </div>

      {/* Primary Action Button: Analyze & Engage Interlock */}
      <button
        type="button"
        onClick={() => onIntercept()}
        disabled={isAnalyzing}
        className={`w-full py-3 px-4 rounded-lg font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-md ${
          isAnalyzing
            ? "bg-[#1E293B] text-[#94A3B8] cursor-not-allowed"
            : isClean
            ? "bg-[#10B981] hover:bg-[#059669] text-black hover:scale-[1.01] active:scale-98"
            : "bg-[#F43F5E] hover:bg-[#E11D48] text-white hover:scale-[1.01] active:scale-98"
        }`}
      >
        {isAnalyzing ? (
          <>
            <Cpu className="w-4 h-4 animate-spin text-[#00F0FF]" />
            <span>RUNNING MULTI-AGENT INFERENCE...</span>
          </>
        ) : (
          <>
            <ShieldAlert className="w-4 h-4" />
            <span>ANALYZE & ENGAGE SBP INTERLOCK</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
}
