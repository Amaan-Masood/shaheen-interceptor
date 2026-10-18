import React, { useState } from "react";
import { X, Copy, Check, Printer, ShieldAlert, FileText, Download, ShieldCheck, Landmark, Lock, CheckCircle2, AlertTriangle, Fingerprint } from "lucide-react";

export default function SarModal({ isOpen, onClose, sarReport }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("DOCUMENT"); // "DOCUMENT" | "RAW"

  if (!isOpen || !sarReport) return null;

  const markdownText = sarReport.generated_markdown || sarReport.markdown || "";

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-5">
      <div className="bg-[#090E1A]/95 border border-white/15 w-full max-w-4xl max-h-[92vh] flex flex-col font-sans text-xs shadow-2xl rounded-3xl overflow-hidden backdrop-blur-2xl">
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-[#070B14] border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EF4444]/20 border border-[#EF4444]/40 flex items-center justify-center text-[#EF4444]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-extrabold text-sm sm:text-base flex items-center gap-2 font-display">
                <span>SUSPICIOUS ACTIVITY REPORT (SAR / STR)</span>
                <span className="text-[10px] bg-[#EF4444]/20 text-[#F87171] border border-[#EF4444]/40 px-2 py-0.5 rounded-full font-bold">
                  REGULATORY FILING SBP / FMU
                </span>
              </div>
              <div className="text-[11px] text-[#94A3B8] font-mono">
                Filing Ref: {sarReport.report_id || "SAR-SHN-992104"} • Section 7 AMLA 2010
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher */}
            <div className="hidden sm:flex items-center gap-1 bg-[#121B2E] p-1 rounded-full border border-white/10 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab("DOCUMENT")}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  activeTab === "DOCUMENT"
                    ? "bg-[#1E293B] text-white shadow-sm border border-white/10"
                    : "text-[#94A3B8] hover:text-white"
                }`}
              >
                Official Document
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("RAW")}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  activeTab === "RAW"
                    ? "bg-[#1E293B] text-white shadow-sm border border-white/10"
                    : "text-[#94A3B8] hover:text-white"
                }`}
              >
                Raw SBP EDI
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-[#121B2E] hover:bg-[#1E293B] text-white px-3 py-1.5 text-xs rounded-full transition-all cursor-pointer font-bold border border-white/10"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? "COPIED" : "COPY MARKDOWN"}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-[#EF4444] hover:bg-[#DC2626] text-white px-3.5 py-1.5 text-xs rounded-full transition-all cursor-pointer font-bold shadow-md shadow-[#EF4444]/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PRINT / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-[#94A3B8] hover:text-white p-1.5 rounded-full bg-[#121B2E] border border-white/10 hover:border-[#EF4444] transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#060911] space-y-4">
          {activeTab === "DOCUMENT" ? (
            /* Official Formatted SBP Legal Document */
            <div className="bg-[#0B111E] border border-white/15 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
              {/* Government Crest & Letterhead */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-white/15 gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/40 flex items-center justify-center text-[#10B981]">
                    <Landmark className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#94A3B8]">
                      Islamic Republic of Pakistan
                    </div>
                    <div className="text-base sm:text-lg font-black text-white font-display">
                      Financial Monitoring Unit (FMU) — State Bank of Pakistan
                    </div>
                    <div className="text-[11px] text-[#64748B]">
                      National AML/CFT Electronic Reporting Rail • Suspicious Activity Report (SAR)
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right font-mono">
                  <span className="text-[10px] bg-[#EF4444]/20 text-[#F87171] border border-[#EF4444]/40 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider block sm:inline-block">
                    STATUS: QUARANTINED PRE-SETTLEMENT
                  </span>
                  <div className="text-[10px] text-[#64748B] mt-1">
                    Filing Timestamp: {new Date().toISOString()}
                  </div>
                </div>
              </div>

              {/* 1. Transaction at a Glance Table */}
              <div className="space-y-2">
                <div className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                  <span>1. Transaction Telemetry at a Glance</span>
                </div>
                <div className="rounded-xl border border-white/10 overflow-hidden bg-[#070B14]">
                  <table className="w-full text-left border-collapse text-xs">
                    <tbody className="divide-y divide-white/5 font-mono">
                      <tr className="bg-white/[0.02]">
                        <td className="p-3 text-[#94A3B8] font-bold w-1/3">Attempted Transaction Amount</td>
                        <td className="p-3 font-bold text-white text-sm text-[#F87171]">PKR 450,000.00</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-[#94A3B8] font-bold">Settlement Channel Rail</td>
                        <td className="p-3 text-white">SBP Raast Instant Settlement Network</td>
                      </tr>
                      <tr className="bg-white/[0.02]">
                        <td className="p-3 text-[#94A3B8] font-bold">Interception Latency</td>
                        <td className="p-3 text-[#38BDF8] font-bold">0.9 ms (Sub-Second Pre-Clearing Interlock)</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-[#94A3B8] font-bold">Composite Multi-Agent Risk Rating</td>
                        <td className="p-3 text-[#EF4444] font-black">97 / 100 (Critical Fraud Consensus)</td>
                      </tr>
                      <tr className="bg-white/[0.02]">
                        <td className="p-3 text-[#94A3B8] font-bold">Intervention Action</td>
                        <td className="p-3 text-[#10B981] font-bold">Funds Frozen at Source Before Inter-Bank Release</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. Subject Details & Dual Profiles */}
              <div className="space-y-2">
                <div className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                  <span>2. Subject Profiles & Account Footprints</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Originator */}
                  <div className="p-4 rounded-xl bg-[#070B14] border border-white/10 space-y-2">
                    <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                      ORIGINATOR (SUSPECTED VICTIM)
                    </div>
                    <div className="font-bold text-white text-sm">Haji Abdul Rehman</div>
                    <div className="font-mono text-[11px] text-[#94A3B8]">IBAN: PK45HABB00099214710293</div>
                    <div className="text-[11px] text-[#94A3B8]">Institution: Habib Bank Limited (HBL)</div>
                    <div className="text-[11px] text-[#10B981] font-medium flex items-center gap-1 pt-1 border-t border-white/5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>Account Age: 4,200 days • Tier 2 Biometric Verified</span>
                    </div>
                  </div>

                  {/* Beneficiary */}
                  <div className="p-4 rounded-xl bg-[#1B0F15] border border-[#EF4444]/40 space-y-2">
                    <div className="text-[10px] font-bold text-[#F87171] uppercase tracking-wider">
                      BENEFICIARY (CONFIRMED MULE ACCOUNT)
                    </div>
                    <div className="font-bold text-white text-sm">Muhammad Bilal</div>
                    <div className="font-mono text-[11px] text-[#FBBF24]">IBAN: PK36MEZN00019283746501</div>
                    <div className="text-[11px] text-[#94A3B8]">Institution: Meezan Bank Limited</div>
                    <div className="text-[11px] text-[#EF4444] font-bold flex items-center gap-1 pt-1 border-t border-white/5">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />
                      <span>Account Age: 4 days only • Tier 0 Digital Onboarding</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Statutory Narrative & Forensic Consensus */}
              <div className="space-y-2">
                <div className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7]" />
                  <span>3. Multi-Agent Forensic Consensus & Evidence Narrative</span>
                </div>
                <div className="p-4 rounded-xl bg-[#070B14] border border-white/10 text-xs text-[#CBD5E1] space-y-2.5 leading-relaxed">
                  <p>
                    <strong>Agent 1 (Voice & Coercion Detector):</strong> The call intercept detected active governmental impersonation. The caller falsely presented himself as Inspector Tariq of the FIA Cyber Crime Wing Islamabad. Acoustic urgency analysis confirmed coercive threats of immediate police raid under Section 21 of the Prevention of Electronic Crimes Act (PECA 2016).
                  </p>
                  <p>
                    <strong>Agent 2 (Mule Graph Hunter):</strong> Graph analytics identified high-velocity fan-out layering. The destination account was created 4 days prior with zero standard commercial activity, acting as an intermediary node routed toward secondary mules (Kashif Mehmood & Hamza Tariq) and offshore crypto liquidation.
                  </p>
                  <p>
                    <strong>Agent 3 (Decoy Honeypot):</strong> Autonomous baiting engagement trapped secondary backup IBANs, confirming syndicate coordination and intent to evade AML interlocks.
                  </p>
                </div>
              </div>

              {/* 4. Cryptographic Validation Seal */}
              <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[10px] text-[#64748B] font-mono">
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-[#10B981]" />
                  <span>CRYPTOGRAPHIC HASH: 9d650f03754dc84f02c637c4dfb3a4e698a497d175d6241a7328dc2ff545cb55</span>
                </div>
                <div className="text-white font-bold bg-[#10B981]/15 text-[#34D399] px-2.5 py-1 rounded-md border border-[#10B981]/30">
                  DIGITALLY SIGNED & INTERLOCKED
                </div>
              </div>
            </div>
          ) : (
            /* Raw Markdown / SBP EDI Source View */
            <div className="bg-[#0A0D14] border border-white/10 rounded-2xl p-5 shadow-inner">
              <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-[#CBD5E1] select-text">
                {markdownText}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#070B14] border-t border-white/[0.08] flex items-center justify-between text-[11px] text-[#64748B]">
          <span className="font-mono">Statutory Declaration Pursuant to SBP BPRD Circular No. 04</span>
          <button
            type="button"
            onClick={onClose}
            className="bg-[#172033] hover:bg-[#1E293B] text-white px-4 py-1.5 rounded-full font-bold cursor-pointer border border-white/10"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
