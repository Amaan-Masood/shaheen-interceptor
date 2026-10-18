import React from "react";
import { PhoneCall, ShieldAlert, Cpu, Lock, AlertTriangle, ArrowRight, CheckCircle2, ShieldCheck, UserCheck, Radio } from "lucide-react";

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

  return (
    <div className="bezel-shell p-2 rounded-3xl h-full flex flex-col">
      <div className="bezel-core p-4 sm:p-5 rounded-[calc(1.5rem-0.25rem)] flex-1 flex flex-col space-y-4 overflow-hidden">
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <span className={`flex h-2.5 w-2.5 rounded-full ${isClean ? "bg-[#10B981]" : "bg-[#EF4444]"}`}>
                {!isClean && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EF4444] opacity-75"></span>
                )}
              </span>
            </div>
            <span className="font-extrabold text-sm sm:text-base text-white tracking-tight font-display">
              1. Live Transaction & Voice Wiretap
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono text-[#94A3B8] bg-[#0E1626] px-2.5 py-1 rounded-full border border-white/5 shadow-inner">
            <Lock className="w-3 h-3 text-[#38BDF8]" />
            <span>Rail: {current.channel || "SBP Raast Instant"}</span>
          </div>
        </div>

        {/* Transaction Summary Card (Cyber Banking Voucher) */}
        <div className="relative rounded-2xl bg-gradient-to-b from-[#121B2E] to-[#0A0F1D] border border-white/[0.08] p-4 sm:p-5 shadow-xl overflow-hidden group">
          {/* Iridescent Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#EF4444] to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase font-extrabold tracking-wider text-[#94A3B8]">
              Inter-Bank Transfer Attempt
            </span>
            <span
              className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border shadow-inner ${
                isClean
                  ? "bg-[#10B981]/15 text-[#34D399] border-[#10B981]/30"
                  : "bg-[#EF4444]/15 text-[#F87171] border-[#EF4444]/30"
              }`}
            >
              {isClean ? "Verified Institution" : "High-Risk First-Time Payee"}
            </span>
          </div>

          {/* Amount Display */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
              Rs. {Number(current.amount || 0).toLocaleString()}
            </span>
            <span className="text-xs font-mono font-bold text-[#64748B]">PKR</span>
          </div>

          {/* Dual Originator & Beneficiary Chips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-white/[0.06] text-xs">
            {/* Originator */}
            <div className="p-3 rounded-xl bg-[#070B14]/80 border border-white/5 space-y-1">
              <div className="flex items-center justify-between text-[10px] text-[#64748B] font-bold uppercase">
                <span>ORIGINATOR</span>
                <span className="text-[#38BDF8] font-mono">{current.sender?.account?.slice(0, 10) || "ACC-MZN"}</span>
              </div>
              <div className="font-bold text-white text-xs truncate">{current.sender?.name || "Sender Account"}</div>
              <div className="text-[#94A3B8] text-[11px] truncate">{current.sender?.bank || "Meezan Bank Ltd"}</div>
              <div className="text-[10px] text-[#10B981] font-semibold flex items-center gap-1 pt-0.5">
                <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
                <span>{current.sender?.kyc_tier || "Biometric Tier 2"}</span>
              </div>
            </div>

            {/* Beneficiary */}
            <div
              className={`p-3 rounded-xl border space-y-1 ${
                isClean
                  ? "bg-[#070B14]/80 border-white/5"
                  : "bg-[#1B0F14]/90 border-[#EF4444]/35 shadow-inner"
              }`}
            >
              <div className="flex items-center justify-between text-[10px] text-[#64748B] font-bold uppercase">
                <span>BENEFICIARY</span>
                {!isClean && (
                  <span className="text-[9px] font-black text-[#EF4444] bg-[#EF4444]/20 px-1.5 py-0.2 rounded border border-[#EF4444]/30">
                    Age: {current.receiver?.account_age_days || 4} days
                  </span>
                )}
              </div>
              <div className="font-bold text-white text-xs truncate">{current.receiver?.name || "Recipient Account"}</div>
              <div className="text-[#94A3B8] text-[11px] truncate">{current.receiver?.bank || "Habib Bank Ltd"}</div>
              <div className="text-[10px] font-mono font-medium truncate text-[#F59E0B] pt-0.5">
                {current.receiver?.iban || "PK36MEZN00019283746501"}
              </div>
            </div>
          </div>
        </div>

        {/* Live Audio Intercept Box (Cellular Wiretap Simulation) */}
        <div className="rounded-2xl bg-[#090F1C]/90 border border-white/[0.08] p-4 flex-1 flex flex-col space-y-3 min-h-0">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-white/[0.06]">
            <div className="flex items-center gap-2 font-bold text-white">
              <PhoneCall className={`w-4 h-4 ${isClean ? "text-[#10B981]" : "text-[#EF4444] animate-bounce"}`} />
              <span className="font-display">Intercepted Phone Audio Call</span>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Dynamic Equalizer Wave */}
              <div className="flex items-end gap-1 h-3.5">
                {[1, 2, 3, 4, 5, 6].map((barNum) => (
                  <div
                    key={barNum}
                    className={`w-1 rounded-full ${isClean ? "bg-[#10B981]" : "bg-[#EF4444]"} eq-bar-${barNum}`}
                  />
                ))}
              </div>
              <span className="text-[10.5px] font-mono text-[#64748B]">
                {isClean ? "Hospital Official Desk" : "Caller ID Spoofed"}
              </span>
            </div>
          </div>

          {/* Transcript Dialogue Scrollview */}
          <div className="space-y-2.5 overflow-y-auto flex-1 pr-1 max-h-56">
            {transcriptLines.map((line, idx) => {
              const text = typeof line === "string" ? line : line?.text || "";
              const speaker = typeof line === "object" && line?.speaker ? line.speaker : "TRANSCRIPT";
              const tag = typeof line === "object" && line?.tag ? String(line.tag) : null;
              const isPerpetrator =
                speaker === "PERPETRATOR" ||
                (typeof speaker === "string" && (speaker.includes("SYNDICATE") || speaker.includes("Inspector")));

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl text-xs leading-relaxed transition-all shadow-sm ${
                    isPerpetrator
                      ? "bg-[#1D1016] border border-[#EF4444]/40 text-[#F1F5F9]"
                      : isClean
                      ? "bg-[#0E1B16] border border-[#10B981]/30 text-[#E2E8F0]"
                      : "bg-[#070B14] border border-white/5 text-[#CBD5E1]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 font-medium">
                    <span
                      className={`text-[10.5px] font-bold ${
                        isPerpetrator ? "text-[#F87171]" : isClean ? "text-[#34D399]" : "text-[#38BDF8]"
                      }`}
                    >
                      {speaker === "PERPETRATOR" ? "Caller (Inspector Tariq — Scammer)" : speaker}
                    </span>
                    {tag && (
                      <span className="text-[9px] font-bold bg-[#EF4444] text-white px-2 py-0.5 rounded-full shadow-sm tracking-wider uppercase">
                        {tag.replace(/_/g, " ")}
                      </span>
                    )}
                  </div>
                  <div className="text-[11.5px] text-[#E2E8F0]">{text}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={() => onIntercept()}
          disabled={isAnalyzing}
          className={`group relative w-full py-3.5 px-5 rounded-2xl font-extrabold text-sm tracking-wide flex items-center justify-center gap-3 transition-all cursor-pointer shadow-xl ${
            isAnalyzing
              ? "bg-[#1E293B] text-[#94A3B8] cursor-not-allowed"
              : isClean
              ? "bg-gradient-to-r from-[#10B981] via-[#059669] to-[#047857] text-white shadow-[#10B981]/25 hover:shadow-[#10B981]/40 hover:scale-[1.01] active:scale-98 shimmer-active"
              : "bg-gradient-to-r from-[#EF4444] via-[#DC2626] to-[#B91C1C] text-white shadow-[#EF4444]/25 hover:shadow-[#EF4444]/40 hover:scale-[1.01] active:scale-98 shimmer-active"
          }`}
        >
          {isAnalyzing ? (
            <>
              <Cpu className="w-4 h-4 animate-spin text-[#38BDF8]" />
              <span>Analyzing with Gemini 2.5 Multi-Agent Engine...</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-4 h-4 text-white" />
              <span>Analyze & Scan for Scam</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
