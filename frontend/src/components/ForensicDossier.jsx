import React from "react";
import { ShieldCheck, ShieldAlert, Bot, FileText, AlertTriangle, ArrowUpRight, Lock, CheckCircle2, Shield, Activity, Fingerprint } from "lucide-react";

export default function ForensicDossier({ alert, onDeployDecoy, onGenerateSar, isClean }) {
  if (!alert) {
    return (
      <div className="bg-[#0A0E17] border border-white/[0.08] rounded-xl p-6 flex flex-col items-center justify-center text-center text-[#94A3B8] min-h-[180px]">
        <ShieldAlert className="w-8 h-8 mb-2.5 text-[#64748B] animate-pulse" />
        <span className="font-mono font-bold text-white text-xs uppercase tracking-wider">
          AWAITING TRANSACTION ANALYSIS
        </span>
        <span className="text-[11px] text-[#64748B] mt-1 max-w-sm font-sans">
          Select a scenario above and execute "ANALYZE & ENGAGE SBP INTERLOCK" to view multi-agent consensus.
        </span>
      </div>
    );
  }

  const score = alert.combined_risk_score !== undefined ? alert.combined_risk_score : (isClean ? 4 : 94);
  const isQuarantined = alert.verdict === "QUARANTINED" || score >= 70;
  const isFlagged = alert.verdict === "FLAGGED" || (score >= 35 && score < 70);

  const accentColor = isQuarantined ? "#F43F5E" : isFlagged ? "#F59E0B" : "#10B981";

  return (
    <div className="bg-[#0A0E17] border border-white/[0.08] rounded-xl p-4 sm:p-5 flex flex-col space-y-4 shadow-xl relative overflow-hidden">
      {/* Top Banner: Status Verdict & Tactical Risk Readout */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div className="flex items-start gap-3.5">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm"
            style={{
              backgroundColor: isQuarantined ? "#F43F5E" : isFlagged ? "#F59E0B" : "#10B981"
            }}
          >
            {isQuarantined ? (
              <ShieldAlert className="w-5 h-5 text-white" />
            ) : isFlagged ? (
              <AlertTriangle className="w-5 h-5 text-black" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-black" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border"
                style={{
                  backgroundColor: `${accentColor}15`,
                  color: accentColor,
                  borderColor: `${accentColor}40`
                }}
              >
                {isQuarantined ? "CRITICAL INTERVENTION" : isFlagged ? "STEP-UP AUTH" : "SETTLEMENT CLEARED"}
              </span>
              <span className="text-[10px] font-mono text-[#64748B]">
                ALERT REF: {alert.alert_id || "SHN-TX-99210"}
              </span>
            </div>

            <div className="text-base sm:text-lg font-black text-white font-mono tracking-tight uppercase">
              {isQuarantined
                ? "PRE-SETTLEMENT INTERLOCK ACTIVE — FUNDS FROZEN"
                : isFlagged
                ? "WARNING — STEP-UP BIOMETRIC VERIFICATION REQUIRED"
                : "VERIFIED SAFE INSTITUTION — CLEARANCE GRANTED"}
            </div>

            <div className="text-[11.5px] text-[#94A3B8] mt-0.5 font-sans leading-relaxed">
              {isQuarantined
                ? "Transaction interlocked at SBP Raast switch level. Funds halted in clearing escrow before reaching destination mule account."
                : isFlagged
                ? "Suspicious velocity pattern detected. Requiring step-up biometric verification prior to release."
                : "Institutional beneficiary verified against SBP Schedule-I whitelist. Transferred with zero false alarm friction."}
            </div>
          </div>
        </div>

        {/* Tactical Risk Score Readout */}
        <div className="flex items-center gap-3 bg-[#0D121D] px-3.5 py-2 rounded-lg border border-white/[0.06] shrink-0 font-mono">
          <div className="text-right">
            <div className="text-[9px] text-[#64748B] uppercase font-bold">PARALLEL VERDICT</div>
            <div className="text-xl font-black" style={{ color: accentColor }}>
              {score}% RISK
            </div>
          </div>
          <div className="border-l border-white/10 pl-3 text-[10px] text-[#94A3B8]">
            <div>Conf: <span className="text-[#10B981] font-bold">99.4%</span></div>
            <div>Latency: <span className="text-white font-bold">0.9 ms</span></div>
          </div>
        </div>
      </div>

      {/* Multi-Agent Consensus Evidence Blocks */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase text-[#94A3B8]">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>AUTONOMOUS AGENT FORENSIC CONSENSUS:</span>
          </span>
          <span className="text-[#64748B]">SLA: 0.9ms • 3 AGENTS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono">
          {isQuarantined ? (
            <>
              {/* Agent 1 */}
              <div className="p-2.5 rounded bg-[#150B10] border border-[#F43F5E]/30 space-y-1">
                <div className="text-[9.5px] font-black uppercase text-[#F43F5E] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F43F5E]" />
                  <span>AGENT 1: COERCION RADAR</span>
                </div>
                <div className="font-bold text-white text-[11px]">Govt Impersonation</div>
                <div className="text-[10px] text-[#94A3B8] font-sans leading-tight">
                  Acoustic urgency detected caller falsely claiming to be FIA Cyber Crime Inspector Tariq.
                </div>
              </div>

              {/* Agent 2 */}
              <div className="p-2.5 rounded bg-[#150B10] border border-[#F43F5E]/30 space-y-1">
                <div className="text-[9.5px] font-black uppercase text-[#F43F5E] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F43F5E]" />
                  <span>AGENT 2: MULE HUNTER</span>
                </div>
                <div className="font-bold text-white text-[11px]">Layering Account</div>
                <div className="text-[10px] text-[#94A3B8] font-sans leading-tight">
                  Beneficiary IBAN created 4 days prior; immediate rapid fan-out to 2 secondary mule accounts.
                </div>
              </div>

              {/* Agent 3 */}
              <div className="p-2.5 rounded bg-[#150B10] border border-[#F43F5E]/30 space-y-1">
                <div className="text-[9.5px] font-black uppercase text-[#F43F5E] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F43F5E]" />
                  <span>AGENT 3: STATUTORY ENGINE</span>
                </div>
                <div className="font-bold text-white text-[11px]">AMLA 2010 Interlock</div>
                <div className="text-[10px] text-[#94A3B8] font-sans leading-tight">
                  Mandatory pre-settlement freeze triggered under Section 7 AMLA 2010 / Section 21 PECA 2016.
                </div>
              </div>
            </>
          ) : isFlagged ? (
            <>
              {/* Agent 1 */}
              <div className="p-2.5 rounded bg-[#17120C] border border-[#F59E0B]/30 space-y-1">
                <div className="text-[9.5px] font-black uppercase text-[#F59E0B] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                  <span>AGENT 1: VELOCITY MONITOR</span>
                </div>
                <div className="font-bold text-white text-[11px]">High-Frequency Structuring</div>
                <div className="text-[10px] text-[#94A3B8] font-sans leading-tight">
                  6 consecutive transfers under Rs. 50,000 threshold within 10 minutes.
                </div>
              </div>

              {/* Agent 2 */}
              <div className="p-2.5 rounded bg-[#17120C] border border-[#F59E0B]/30 space-y-1">
                <div className="text-[9.5px] font-black uppercase text-[#F59E0B] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                  <span>AGENT 2: GRAPH DETECTOR</span>
                </div>
                <div className="font-bold text-white text-[11px]">Fan-In Student Ring</div>
                <div className="text-[10px] text-[#94A3B8] font-sans leading-tight">
                  Multiple accounts depositing into single newly opened digital student account.
                </div>
              </div>

              {/* Agent 3 */}
              <div className="p-2.5 rounded bg-[#17120C] border border-[#F59E0B]/30 space-y-1">
                <div className="text-[9.5px] font-black uppercase text-[#F59E0B] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                  <span>AGENT 3: ESCROW CHALLENGE</span>
                </div>
                <div className="font-bold text-white text-[11px]">Biometric Auth Hold</div>
                <div className="text-[10px] text-[#94A3B8] font-sans leading-tight">
                  Held in 15-minute escrow pending secondary app biometric confirmation.
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Agent 1 */}
              <div className="p-2.5 rounded bg-[#0C1712] border border-[#10B981]/30 space-y-1">
                <div className="text-[9.5px] font-black uppercase text-[#10B981] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  <span>AGENT 1: ENTITY VERIFIER</span>
                </div>
                <div className="font-bold text-white text-[11px]">Verified Corporate Hospital</div>
                <div className="text-[10px] text-[#94A3B8] font-sans leading-tight">
                  Beneficiary matches Shaukat Khanum Hospital Askari Bank official collection account.
                </div>
              </div>

              {/* Agent 2 */}
              <div className="p-2.5 rounded bg-[#0C1712] border border-[#10B981]/30 space-y-1">
                <div className="text-[9.5px] font-black uppercase text-[#10B981] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  <span>AGENT 2: ACOUSTIC SENTIMENT</span>
                </div>
                <div className="font-bold text-white text-[11px]">Calm Medical Admissions</div>
                <div className="text-[10px] text-[#94A3B8] font-sans leading-tight">
                  Zero extortion markers; confirmed genuine surgical deposit for cardiac ICU patient.
                </div>
              </div>

              {/* Agent 3 */}
              <div className="p-2.5 rounded bg-[#0C1712] border border-[#10B981]/30 space-y-1">
                <div className="text-[9.5px] font-black uppercase text-[#10B981] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  <span>AGENT 3: SETTLEMENT APPROVAL</span>
                </div>
                <div className="font-bold text-white text-[11px]">Instant 3-Sec Rail</div>
                <div className="text-[10px] text-[#94A3B8] font-sans leading-tight">
                  0% false positive benchmark pass. Approved directly to destination with zero hold.
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons: Deploy Decoy Honeypot & Generate SBP SAR Report */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 font-mono">
        <button
          type="button"
          onClick={onDeployDecoy}
          className="flex items-center justify-between px-3.5 py-2.5 rounded-md bg-[#161022] hover:bg-[#201533] border border-[#A855F7]/40 text-[#D8B4FE] text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-98"
        >
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-[#A855F7]" />
            <span>DEPLOY AI DECOY HONEYPOT</span>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={onGenerateSar}
          className="flex items-center justify-between px-3.5 py-2.5 rounded-md bg-[#0D121D] hover:bg-[#151D2E] border border-white/10 text-white text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-98"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#00F0FF]" />
            <span>EXPORT SBP SAR REPORT (FMU)</span>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#00F0FF]" />
        </button>
      </div>
    </div>
  );
}
