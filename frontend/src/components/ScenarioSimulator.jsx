import React from "react";
import { AlertTriangle, ShieldCheck, Zap, Radio, PhoneCall, ArrowRight, UserCheck, ShieldAlert, Cpu, Activity, Fingerprint } from "lucide-react";

export default function ScenarioSimulator({
  scenarios,
  selectedScenarioId,
  onSelectScenario,
  onIntercept,
  isAnalyzing,
  currentAlert
}) {
  const currentScenario = scenarios[selectedScenarioId] || scenarios.SCENARIO_1_VISHING || {};
  const isClean = currentScenario.category === "CLEAN_URGENT";

  const transcriptLines = Array.isArray(currentScenario.transcript)
    ? currentScenario.transcript
    : Array.isArray(currentScenario.transcript_snippets)
    ? currentScenario.transcript_snippets
    : typeof currentScenario.transcript === "string" && currentScenario.transcript.trim()
    ? [{ speaker: "PERPETRATOR", text: currentScenario.transcript, tag: "COERCION_STREAM" }]
    : [];

  return (
    <div className="flex flex-col h-full bg-[#05070B] border-r border-[#1E293B] overflow-y-auto">
      {/* Panel Header */}
      <div className="p-3 border-b border-[#1E293B] bg-[#090D14] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-[#EF4444] animate-pulse" />
          <span className="font-mono font-bold text-xs text-white uppercase tracking-wider">
            THREAT SIMULATOR // VOICE & TRANSACTION
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
          <span className="text-[10px] bg-[#1E293B] text-[#94A3B8] px-2 py-0.5 font-mono font-bold">
            FEED: ACTIVE
          </span>
        </div>
      </div>

      <div className="p-3.5 space-y-3.5">
        {/* Scenario Selection Tabs */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] font-mono font-bold text-[#64748B] tracking-wider uppercase">
              SELECT ATTACK VECTOR / TELEMETRY:
            </label>
            <span className="text-[9px] text-[#38BDF8]">3 PRESETS LOADED</span>
          </div>

          <div className="space-y-2">
            {/* Scenario 1 */}
            <div
              onClick={() => onSelectScenario("SCENARIO_1_VISHING")}
              className={`p-2.5 border cursor-pointer transition-all relative ${
                selectedScenarioId === "SCENARIO_1_VISHING"
                  ? "bg-[#160A0D] border-[#EF4444] shadow-[0_0_15px_rgba(239,68,68,0.3)] pulse-crimson"
                  : "bg-[#090D14] border-[#1E293B] hover:border-[#475569]"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9.5px] font-mono font-bold px-1.5 py-0.2 bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/50 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse" />
                  CRITICAL // APP VISHING
                </span>
                <span className="text-xs font-mono font-black text-white">Rs. 450,000</span>
              </div>
              <div className="text-xs font-bold text-white truncate">
                FIA & Bank Impersonation Coercion
              </div>
              <div className="text-[10px] text-[#94A3B8] mt-0.5 line-clamp-1">
                Perpetrator posing as FIA Inspector Tariq coercing senior citizen
              </div>
            </div>

            {/* Scenario 2 */}
            <div
              onClick={() => onSelectScenario("SCENARIO_2_SMURFING")}
              className={`p-2.5 border cursor-pointer transition-all relative ${
                selectedScenarioId === "SCENARIO_2_SMURFING"
                  ? "bg-[#181008] border-[#F59E0B] shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                  : "bg-[#090D14] border-[#1E293B] hover:border-[#475569]"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9.5px] font-mono font-bold px-1.5 py-0.2 bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/50 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
                  HIGH RISK // MULE SMURFING
                </span>
                <span className="text-xs font-mono font-black text-white">Rs. 270,000</span>
              </div>
              <div className="text-xs font-bold text-white truncate">
                Coordinated 6-Account Smurfing Ring
              </div>
              <div className="text-[10px] text-[#94A3B8] mt-0.5 line-clamp-1">
                Rapid micro-transfers under Rs. 50k threshold into student account
              </div>
            </div>

            {/* Scenario 3 */}
            <div
              onClick={() => onSelectScenario("SCENARIO_3_CLEAN_HOSPITAL")}
              className={`p-2.5 border cursor-pointer transition-all relative ${
                selectedScenarioId === "SCENARIO_3_CLEAN_HOSPITAL"
                  ? "bg-[#091510] border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  : "bg-[#090D14] border-[#1E293B] hover:border-[#475569]"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9.5px] font-mono font-bold px-1.5 py-0.2 bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/50 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  CLEAN BASELINE // 0% FPR
                </span>
                <span className="text-xs font-mono font-black text-white">Rs. 380,000</span>
              </div>
              <div className="text-xs font-bold text-white truncate">
                Legitimate Hospital Surgery Deposit
              </div>
              <div className="text-[10px] text-[#94A3B8] mt-0.5 line-clamp-1">
                Emergency cardiac bypass payment to Shaukat Khanum Hospital
              </div>
            </div>
          </div>
        </div>

        {/* Tactical Audio Spectrum Visualizer */}
        <div className="bg-[#090D14] border border-[#1E293B] p-2.5 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="flex items-center gap-1.5 text-white font-bold">
              <PhoneCall className={`w-3.5 h-3.5 ${isClean ? "text-[#10B981]" : "text-[#EF4444]"}`} />
              ACOUSTIC FREQUENCY SPECTRUM
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[#64748B]">RMS: -14.2 dBFS (SIMULATED)</span>
              <span className={`px-1.5 py-0.2 text-[9px] font-black ${isClean ? "bg-[#10B981]/20 text-[#10B981]" : "bg-[#EF4444]/20 text-[#EF4444]"}`}>
                {isClean ? "CLEARED" : "COERCION ANOMALY"}
              </span>
            </div>
          </div>

          {/* Equalizer Frequency Bars */}
          <div className="h-12 bg-[#05070B] border border-[#1E293B] flex items-end justify-between gap-1 px-3 py-1.5">
            {[...Array(28)].map((_, i) => {
              const animClass = `wave-bar-${(i % 4) + 1}`;
              const barHeight = 8 + ((i * 13) % 24);
              return (
                <div
                  key={i}
                  className={`w-1 rounded-none transition-all ${
                    isClean
                      ? "bg-[#10B981]"
                      : i % 2 === 0
                      ? "bg-[#EF4444]"
                      : "bg-[#F59E0B]"
                  } ${animClass}`}
                  style={{
                    height: `${barHeight}px`,
                    animationDelay: `${i * 0.04}s`
                  }}
                />
              );
            })}
          </div>

          {/* Frequency Marks */}
          <div className="flex justify-between text-[8px] text-[#475569] font-mono px-1">
            <span>60Hz</span>
            <span>250Hz</span>
            <span>1kHz</span>
            <span>4kHz</span>
            <span>16kHz</span>
          </div>
        </div>

        {/* Live Transcript Stream with High-Impact Red Highlighting */}
        <div className="bg-[#090D14] border border-[#1E293B] p-2.5 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-[#94A3B8] font-bold">CONVERSATIONAL TRANSCRIPT FEED</span>
            <span className="text-[#38BDF8] flex items-center gap-1">
              <Activity className="w-3 h-3 animate-spin" />
              AGENT 1 NLP LIVE
            </span>
          </div>

          <div className="max-h-56 overflow-y-auto space-y-2 pr-1 text-xs">
            {transcriptLines.map((line, idx) => {
              const isPerpetrator = line.speaker === "PERPETRATOR" || (typeof line.speaker === "string" && line.speaker.includes("SYNDICATE"));
              const isFlagged = Boolean(line.tag);

              return (
                <div
                  key={idx}
                  className={`p-2 border text-[11px] leading-relaxed transition-all ${
                    isFlagged
                      ? "bg-[#1D0C10] border-[#EF4444]/70 text-white shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                      : isClean
                      ? "bg-[#07130F] border-[#10B981]/30 text-[#CBD5E1]"
                      : "bg-[#05070B] border-[#1E293B] text-[#94A3B8]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 font-mono text-[9px]">
                    <span className={`font-black tracking-wider ${isPerpetrator ? "text-[#EF4444]" : "text-[#38BDF8]"}`}>
                      {line.speaker}
                    </span>
                    {line.tag && (
                      <span className="bg-[#EF4444] text-white font-black px-1.5 py-0.2 tracking-wider shadow-sm">
                        [{line.tag}]
                      </span>
                    )}
                  </div>
                  <div className={isFlagged ? "text-white font-medium" : ""}>
                    {line.text}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transaction Metadata Dossier */}
        <div className="bg-[#090D14] border border-[#1E293B] p-2.5 text-xs font-mono space-y-2">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-1.5">
            <span className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Fingerprint className="w-3 h-3 text-[#38BDF8]" />
              TRANSACTION TELEMETRY
            </span>
            <span className="text-[9px] text-[#F59E0B] font-bold">RAAST / 1LINK SWITCH</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-[#64748B] block text-[9px]">ORIGINATOR:</span>
              <span className="text-white font-bold truncate block">{currentScenario.sender.name}</span>
              <span className="text-[#94A3B8] text-[10px] block truncate">{currentScenario.sender.bank}</span>
            </div>
            <div>
              <span className="text-[#64748B] block text-[9px]">BENEFICIARY:</span>
              <span className="text-white font-bold truncate block">{currentScenario.receiver.name}</span>
              <span className="text-[#94A3B8] text-[10px] block truncate">{currentScenario.receiver.bank}</span>
            </div>
          </div>

          <div className="border-t border-[#1E293B] pt-2 grid grid-cols-2 gap-2 text-[10px]">
            <div>
              <span className="text-[#64748B] block">RECIPIENT IBAN:</span>
              <span className="text-[#F59E0B] font-bold truncate block">{currentScenario.receiver.iban}</span>
            </div>
            <div>
              <span className="text-[#64748B] block">DEVICE FINGERPRINT:</span>
              <span className={currentScenario.receiver.device_hash.includes("MULE") || currentScenario.receiver.device_hash.includes("EMULATOR") ? "text-[#EF4444] font-bold" : "text-[#10B981]"}>
                {currentScenario.receiver.device_hash}
              </span>
            </div>
          </div>
        </div>

        {/* Intercept Primary CTA */}
        <button
          onClick={() => onIntercept(selectedScenarioId)}
          disabled={isAnalyzing}
          className={`w-full py-3 px-4 font-mono font-bold text-xs tracking-wider flex items-center justify-center gap-2 border transition-all cursor-pointer relative overflow-hidden group ${
            isAnalyzing
              ? "bg-[#334155] border-[#475569] text-[#94A3B8] cursor-not-allowed"
              : isClean
              ? "bg-[#10B981] hover:bg-[#059669] text-black border-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.4)]"
              : "bg-[#EF4444] hover:bg-[#DC2626] text-white border-[#EF4444] shadow-[0_0_25px_rgba(239,68,68,0.6)]"
          }`}
        >
          {isAnalyzing ? (
            <>
              <Cpu className="w-4 h-4 animate-spin text-white" />
              <span>ORCHESTRATING MULTI-AGENT INFERENCE...</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-4 h-4" />
              <span>INTERCEPT & ANALYZE TRANSACTION</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
