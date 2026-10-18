import React from "react";
import { ShieldCheck, ShieldAlert, Bot, FileText, AlertTriangle, Sparkles, ArrowUpRight, Lock, CheckCircle2, Shield, Eye } from "lucide-react";

export default function ForensicDossier({ alert, onDeployDecoy, onGenerateSar, isClean }) {
  if (!alert) {
    return (
      <div className="bezel-shell p-2 rounded-3xl">
        <div className="bezel-core p-8 rounded-[calc(1.5rem-0.25rem)] flex flex-col items-center justify-center text-center text-[#94A3B8] min-h-[220px]">
          <ShieldAlert className="w-10 h-10 mb-3 text-[#64748B] animate-pulse" />
          <span className="font-bold text-white text-sm">Awaiting Transaction Analysis</span>
          <span className="text-xs text-[#64748B] mt-1 max-w-sm">
            Select a scenario on the left and click "Analyze & Scan for Scam" to view the multi-agent AI verdict.
          </span>
        </div>
      </div>
    );
  }

  const score = alert.combined_risk_score !== undefined ? alert.combined_risk_score : (isClean ? 4 : 94);
  const isQuarantined = alert.verdict === "QUARANTINED" || score >= 70;
  const isFlagged = alert.verdict === "FLAGGED" || (score >= 35 && score < 70);

  // SVG Radial Gauge Calculations (radius = 42, circumference ~ 263.89)
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  // Sweep across 270 degrees (3/4 of circle)
  const arcTotal = circumference * 0.75;
  const strokeOffset = arcTotal - (score / 100) * arcTotal;

  const accentColor = isQuarantined ? "#EF4444" : isFlagged ? "#F59E0B" : "#10B981";
  const glowShadow = isQuarantined
    ? "shadow-[0_0_50px_rgba(239,68,68,0.18)] border-[#EF4444]/40"
    : isFlagged
    ? "shadow-[0_0_50px_rgba(245,158,11,0.18)] border-[#F59E0B]/40"
    : "shadow-[0_0_50px_rgba(16,185,129,0.18)] border-[#10B981]/40";

  return (
    <div className={`bezel-shell p-2 rounded-3xl transition-all relative overflow-hidden ${glowShadow}`}>
      {/* Ambient Radial Aura */}
      <div
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: accentColor }}
      />

      <div className="bezel-core p-5 sm:p-6 rounded-[calc(1.5rem-0.25rem)] relative z-10 flex flex-col space-y-5">
        {/* Top Header & Radial Gauge Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          {/* Verdict Status Title */}
          <div className="flex items-start gap-4">
            <div className="relative mt-1">
              {/* Radar ring animation */}
              <div
                className="absolute -inset-1 rounded-2xl blur-sm opacity-50 animate-pulse"
                style={{ backgroundColor: accentColor }}
              />
              <div
                className="relative w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl"
                style={{
                  background: isQuarantined
                    ? "linear-gradient(135deg, #EF4444, #B91C1C)"
                    : isFlagged
                    ? "linear-gradient(135deg, #F59E0B, #B45309)"
                    : "linear-gradient(135deg, #10B981, #047857)"
                }}
              >
                {isQuarantined ? (
                  <ShieldAlert className="w-6 h-6 text-white" />
                ) : isFlagged ? (
                  <AlertTriangle className="w-6 h-6 text-black" />
                ) : (
                  <ShieldCheck className="w-6 h-6 text-white" />
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-[10px] uppercase font-black tracking-widest px-2.5 py-0.5 rounded-full border shadow-inner"
                  style={{
                    backgroundColor: `${accentColor}18`,
                    color: accentColor,
                    borderColor: `${accentColor}40`
                  }}
                >
                  {isQuarantined ? "CRITICAL INTERVENTION" : isFlagged ? "STEP-UP AUTH" : "SAFE INSTITUTION"}
                </span>
                <span className="text-[11px] font-mono text-[#64748B]">
                  ID: {alert.alert_id || "SHN-TX-99210"}
                </span>
              </div>

              <div className="text-lg sm:text-xl font-black text-white font-display tracking-tight">
                {isQuarantined
                  ? "FRAUD DETECTED — PAYMENT BLOCKED"
                  : isFlagged
                  ? "WARNING — STEP-UP AUTH REQUIRED"
                  : "VERIFIED SAFE — PAYMENT APPROVED"}
              </div>

              <div className="text-xs text-[#94A3B8] mt-1 max-w-md leading-relaxed">
                {isQuarantined
                  ? "Funds successfully frozen pre-settlement via SBP Interlock before reaching mule ring."
                  : isFlagged
                  ? "Secondary biometric verification requested before Raast settlement execution."
                  : "Legitimate institutional transaction cleared with zero customer friction."}
              </div>
            </div>
          </div>

          {/* High-Tech Circular Radial Risk Dial */}
          <div className="flex items-center gap-3 self-center sm:self-auto bg-[#070B14]/90 p-3 rounded-2xl border border-white/[0.08] shadow-inner">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-20 h-20 -rotate-135" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#1E293B"
                  strokeWidth="8"
                  strokeDasharray={`${arcTotal} ${circumference}`}
                  strokeLinecap="round"
                />
                {/* Glowing Progress Arc */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke={accentColor}
                  strokeWidth="8"
                  strokeDasharray={`${arcTotal} ${circumference}`}
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                  style={{
                    filter: `drop-shadow(0 0 6px ${accentColor}80)`
                  }}
                />
              </svg>

              {/* Gauge Center Value */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black font-mono tracking-tight text-white leading-none">
                  {score}%
                </span>
                <span className="text-[8px] font-bold uppercase text-[#94A3B8] tracking-wider mt-0.5">
                  RISK
                </span>
              </div>
            </div>

            <div className="text-left hidden xs:block pr-1">
              <div className="text-[11px] font-bold text-white">AI Confidence</div>
              <div className="text-[10px] text-[#10B981] font-mono font-bold">99.4% Validated</div>
              <div className="text-[10px] text-[#64748B] mt-0.5 font-mono">Lat: 0.9 ms</div>
            </div>
          </div>
        </div>

        {/* Multi-Agent Evidence Grid */}
        <div className="bg-[#070B14]/80 rounded-2xl p-4 sm:p-5 border border-white/[0.06] space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-white">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#38BDF8]" />
              <span>Multi-Agent Forensic Evidence:</span>
            </span>
            <span className="text-[10px] font-mono text-[#64748B]">3 Agents Consensus</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1 text-xs">
            {isQuarantined ? (
              <>
                <div className="p-3 rounded-xl bg-[#170E12] border border-[#EF4444]/30 space-y-1">
                  <div className="text-[10px] font-black uppercase text-[#F87171] tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                    Coercion Agent
                  </div>
                  <div className="font-bold text-white text-[11.5px]">Govt Impersonation</div>
                  <div className="text-[11px] text-[#94A3B8] leading-tight">
                    Caller posed as FIA Cyber Crime Officer to induce panic.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#170E12] border border-[#EF4444]/30 space-y-1">
                  <div className="text-[10px] font-black uppercase text-[#F87171] tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                    Urgency Agent
                  </div>
                  <div className="font-bold text-white text-[11.5px]">Arrest & Raid Threat</div>
                  <div className="text-[11px] text-[#94A3B8] leading-tight">
                    Explicit intimidation ("Darwaza tod kar giraftari") forcing instant deposit.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#170E12] border border-[#EF4444]/30 space-y-1">
                  <div className="text-[10px] font-black uppercase text-[#F87171] tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                    Mule Graph Agent
                  </div>
                  <div className="font-bold text-white text-[11.5px]">New Mule Account</div>
                  <div className="text-[11px] text-[#94A3B8] leading-tight">
                    Beneficiary IBAN created 4 days ago with zero prior transaction history.
                  </div>
                </div>
              </>
            ) : isFlagged ? (
              <>
                <div className="p-3 rounded-xl bg-[#17120C] border border-[#F59E0B]/30 space-y-1">
                  <div className="text-[10px] font-black uppercase text-[#FBBF24] tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                    Velocity Agent
                  </div>
                  <div className="font-bold text-white text-[11.5px]">Rapid Micro-Transfers</div>
                  <div className="text-[11px] text-[#94A3B8] leading-tight">
                    6 consecutive transfers under Rs. 50k threshold within 10 minutes.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#17120C] border border-[#F59E0B]/30 space-y-1">
                  <div className="text-[10px] font-black uppercase text-[#FBBF24] tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                    Graph Agent
                  </div>
                  <div className="font-bold text-white text-[11.5px]">Fan-In Smurfing Ring</div>
                  <div className="text-[11px] text-[#94A3B8] leading-tight">
                    Multiple accounts depositing into single newly opened student account.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#17120C] border border-[#F59E0B]/30 space-y-1">
                  <div className="text-[10px] font-black uppercase text-[#FBBF24] tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                    Action Agent
                  </div>
                  <div className="font-bold text-white text-[11.5px]">Biometric Challenge</div>
                  <div className="text-[11px] text-[#94A3B8] leading-tight">
                    Held in 15-minute escrow pending secondary app biometric confirmation.
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="p-3 rounded-xl bg-[#0C1712] border border-[#10B981]/30 space-y-1">
                  <div className="text-[10px] font-black uppercase text-[#34D399] tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    Entity Verifier
                  </div>
                  <div className="font-bold text-white text-[11.5px]">Verified Corporate Hospital</div>
                  <div className="text-[11px] text-[#94A3B8] leading-tight">
                    Beneficiary is Shaukat Khanum Hospital verified corporate collection IBAN.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0C1712] border border-[#10B981]/30 space-y-1">
                  <div className="text-[10px] font-black uppercase text-[#34D399] tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    Acoustic Agent
                  </div>
                  <div className="font-bold text-white text-[11.5px]">Calm Medical Dialog</div>
                  <div className="text-[11px] text-[#94A3B8] leading-tight">
                    Zero coercion detected; genuine admission & bypass surgery deposit.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0C1712] border border-[#10B981]/30 space-y-1">
                  <div className="text-[10px] font-black uppercase text-[#34D399] tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    Settlement Agent
                  </div>
                  <div className="font-bold text-white text-[11.5px]">Instant 3-Sec Clearance</div>
                  <div className="text-[11px] text-[#94A3B8] leading-tight">
                    Zero false-alarm friction. Transferred directly to hospital Askari account.
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons: Button-in-Button Pattern */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Trap Scammer with AI Button */}
          <button
            type="button"
            onClick={onDeployDecoy}
            className="group relative flex items-center justify-between pl-5 pr-2 py-3 rounded-2xl bg-gradient-to-r from-[#7E22CE]/30 via-[#9333EA]/20 to-[#6B21A8]/30 hover:from-[#7E22CE]/40 hover:to-[#9333EA]/40 border border-[#A855F7]/40 text-white font-bold text-xs transition-all cursor-pointer shadow-lg hover:shadow-purple-500/10 active:scale-98"
          >
            <div className="flex items-center gap-2.5">
              <Bot className="w-4 h-4 text-[#C084FC]" />
              <span className="font-extrabold tracking-wide">Trap Scammer with AI</span>
            </div>
            <span className="w-8 h-8 rounded-xl bg-[#A855F7]/30 border border-[#A855F7]/40 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-[#A855F7] transition-all">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </button>

          {/* SBP Police Report Button */}
          <button
            type="button"
            onClick={onGenerateSar}
            className="group relative flex items-center justify-between pl-5 pr-2 py-3 rounded-2xl bg-gradient-to-r from-[#172033] to-[#1E293B] hover:from-[#1E293B] hover:to-[#334155] border border-white/10 text-white font-bold text-xs transition-all cursor-pointer shadow-lg hover:shadow-cyan-500/10 active:scale-98"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-[#38BDF8]" />
              <span className="font-extrabold tracking-wide">Generate SBP Police Report</span>
            </div>
            <span className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-[#38BDF8] group-hover:text-black transition-all">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
