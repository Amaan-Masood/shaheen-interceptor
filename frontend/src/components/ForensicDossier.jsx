import React from "react";
import { ShieldAlert, ShieldCheck, AlertTriangle, FileText, Bot, Clock, Cpu, Server, Smartphone, Fingerprint } from "lucide-react";

export default function ForensicDossier({ alert, onDeployDecoy, onGenerateSar, isClean }) {
  if (!alert) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center text-[#64748B] font-mono text-xs">
        <ShieldAlert className="w-10 h-10 mb-3 text-[#334155] animate-pulse" />
        <span className="font-bold text-[#94A3B8] mb-1">NO ACTIVE TRANSACTION INTERCEPTION</span>
        <span>Click "INTERCEPT & ANALYZE TRANSACTION" in the simulator to run Agents 1, 2 & 3.</span>
      </div>
    );
  }

  const score = alert.combined_risk_score || 0;
  const isQuarantined = alert.verdict === "QUARANTINED";
  const isFlagged = alert.verdict === "FLAGGED";

  let statusBorder = "border-[#10B981]";
  let statusText = "CLEARED // LEGITIMATE TRANSFER";

  if (isQuarantined) {
    statusBorder = "border-[#EF4444]";
    statusText = "TRANSACTION QUARANTINED PRE-SETTLEMENT";
  } else if (isFlagged) {
    statusBorder = "border-[#F59E0B]";
    statusText = "FLAGGED // STEP-UP AUTH REQUIRED";
  }

  // Calculate needle angle for semi-circle gauge (0 to 180 degrees)
  // 0% = -90 deg (left), 100% = +90 deg (right)
  const gaugeAngle = -90 + (score / 100) * 180;

  return (
    <div className="flex flex-col h-full bg-[#05070B] border-l border-[#1E293B] overflow-y-auto font-mono text-xs">
      {/* Dossier Header */}
      <div className="p-3 border-b border-[#1E293B] bg-[#090D14] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#38BDF8]" />
          <span className="font-bold text-white uppercase tracking-wider">
            FORENSIC DOSSIER // COMPLIANCE
          </span>
        </div>
        <span className="text-[10px] text-[#64748B]">ID: {alert.alert_id}</span>
      </div>

      <div className="p-3.5 space-y-3.5">
        {/* Tachometer / Semi-Circular Radial Threat Meter */}
        <div className={`p-4 border ${statusBorder}/60 bg-[#090D14] relative overflow-hidden shadow-xl`}>
          <div className="flex items-center justify-between text-[10px] text-[#64748B] mb-1">
            <span className="uppercase font-bold tracking-wider">AI RISK RADIAL TACHOMETER</span>
            <div className="flex items-center gap-1.5 text-[#38BDF8] font-bold text-xs">
              <Clock className="w-3.5 h-3.5" />
              <span>{alert.latency_ms || 740} ms</span>
            </div>
          </div>

          {/* SVG Semi-Circle Tachometer Gauge */}
          <div className="relative w-44 h-24 mx-auto my-1 flex items-center justify-center">
            <svg viewBox="0 0 200 110" className="w-full h-full select-none overflow-visible">
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#EF4444" />
                </linearGradient>
              </defs>

              {/* Background Arc */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#1E293B"
                strokeWidth="14"
                strokeLinecap="round"
              />

              {/* Active Colored Arc */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * score) / 100}
                className="transition-all duration-1000 ease-out"
              />

              {/* Center Needle Base */}
              <circle cx="100" cy="100" r="7" fill="#FFFFFF" />
              <circle cx="100" cy="100" r="3" fill="#EF4444" />

              {/* Needle Indicator */}
              <g
                transform={`rotate(${gaugeAngle}, 100, 100)`}
                className="transition-transform duration-1000 ease-out"
              >
                <line
                  x1="100"
                  y1="100"
                  x2="100"
                  y2="30"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                  strokeLinecap="round"
                  filter="drop-shadow(0px 0px 4px rgba(255,255,255,0.8))"
                />
              </g>
            </svg>

            {/* Centered Digital Readout */}
            <div className="absolute bottom-0 text-center">
              <span className="text-3xl font-black text-white tracking-tighter">
                {score}
              </span>
              <span className="text-xs text-[#64748B] font-bold">/100</span>
            </div>
          </div>

          {/* Verdict Banner */}
          <div
            className={`py-2 px-3 border text-center font-black tracking-widest text-[11px] uppercase mt-2 ${
              isQuarantined
                ? "bg-[#1F0E12] border-[#EF4444] text-[#EF4444] shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse"
                : isFlagged
                ? "bg-[#181008] border-[#F59E0B] text-[#F59E0B]"
                : "bg-[#091510] border-[#10B981] text-[#10B981]"
            }`}
          >
            {statusText}
          </div>
        </div>

        {/* Multi-Agent Evidence Chain */}
        <div className="space-y-2.5">
          <span className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider block">
            VERIFIED EVIDENCE CHAIN (MULTI-AGENT CORRELATION)
          </span>

          {/* Agent 1 Voice Coercion */}
          <div className="p-3 bg-[#090D14] border border-[#1E293B] space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-white flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-[#EF4444]" />
                AGENT 1: COERCION DETECTOR
              </span>
              <span className={`px-1.5 py-0.2 font-bold ${alert.coercion_score >= 50 ? "bg-[#EF4444]/20 text-[#EF4444]" : "bg-[#10B981]/20 text-[#10B981]"}`}>
                {alert.coercion_score}/100
              </span>
            </div>
            {/* Meter Bar */}
            <div className="w-full h-1.5 bg-[#05070B] border border-[#1E293B]">
              <div
                className={`h-full ${alert.coercion_score >= 50 ? "bg-[#EF4444]" : "bg-[#10B981]"}`}
                style={{ width: `${alert.coercion_score}%` }}
              />
            </div>
            <div className="text-[10px] text-[#94A3B8] leading-relaxed">
              {alert.detected_tactics?.length > 0 ? (
                <ul className="list-disc pl-4 space-y-0.5 text-white">
                  {alert.detected_tactics.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              ) : (
                <span className="text-[#10B981]">No adversarial manipulation detected.</span>
              )}
            </div>
          </div>

          {/* Agent 2 Mule Graph Hunter */}
          <div className="p-3 bg-[#090D14] border border-[#1E293B] space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-[#F59E0B]" />
                AGENT 2: MULE GRAPH HUNTER
              </span>
              <span className={`px-1.5 py-0.2 font-bold ${alert.mule_risk_score >= 50 ? "bg-[#EF4444]/20 text-[#EF4444]" : "bg-[#10B981]/20 text-[#10B981]"}`}>
                {alert.mule_risk_score}/100
              </span>
            </div>
            {/* Meter Bar */}
            <div className="w-full h-1.5 bg-[#05070B] border border-[#1E293B]">
              <div
                className={`h-full ${alert.mule_risk_score >= 50 ? "bg-[#EF4444]" : "bg-[#10B981]"}`}
                style={{ width: `${alert.mule_risk_score}%` }}
              />
            </div>
            <div className="text-[10px] text-[#94A3B8] leading-relaxed">
              {alert.graph_anomalies?.length > 0 ? (
                <ul className="list-disc pl-4 space-y-0.5 text-white">
                  {alert.graph_anomalies.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              ) : (
                <span className="text-[#10B981]">Clean institutional receiver topology (Verified Tier 3).</span>
              )}
            </div>
          </div>

          {/* Device Telemetry */}
          <div className="p-3 bg-[#090D14] border border-[#1E293B] space-y-1 text-[10px]">
            <div className="flex items-center gap-1.5 text-white font-bold mb-1">
              <Smartphone className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>TELEMETRY FINGERPRINT</span>
            </div>
            <div className="flex justify-between text-[#94A3B8]">
              <span>DEVICE HASH:</span>
              <span className={alert.receiver?.device_hash?.includes("MULE") || alert.receiver?.device_hash?.includes("EMULATOR") ? "text-[#EF4444] font-bold" : "text-white"}>
                {alert.receiver?.device_hash || "DEV-MULE-8812"}
              </span>
            </div>
            <div className="flex justify-between text-[#94A3B8]">
              <span>ACCOUNT AGE:</span>
              <span className={alert.receiver?.account_age_days <= 10 ? "text-[#EF4444] font-bold" : "text-white"}>
                {alert.receiver?.account_age_days || 4} DAYS
              </span>
            </div>
            <div className="flex justify-between text-[#94A3B8]">
              <span>KYC ONBOARDING:</span>
              <span className="text-[#38BDF8]">{alert.receiver?.kyc_tier || "Tier 0"}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          {/* Deploy Active Decoy Button */}
          <button
            onClick={onDeployDecoy}
            className="w-full py-2.5 px-3 bg-[#1A0C2B] hover:bg-[#2A1444] border border-[#A855F7] text-[#E9D5FF] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:scale-[1.01]"
          >
            <Bot className="w-4 h-4 text-[#A855F7]" />
            <span>DEPLOY ACTIVE AI DECOY (TAB 2)</span>
          </button>

          {/* Freeze & Generate SAR Button */}
          <button
            onClick={onGenerateSar}
            className="w-full py-2.5 px-3 bg-[#1F0C10] hover:bg-[#32131A] border border-[#EF4444] text-white font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:scale-[1.01]"
          >
            <FileText className="w-4 h-4 text-[#EF4444]" />
            <span>FREEZE MULE & GENERATE SAR REPORT</span>
          </button>
        </div>
      </div>
    </div>
  );
}
