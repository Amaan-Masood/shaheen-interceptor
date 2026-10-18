import React, { useState } from "react";
import { X, Copy, Check, Printer, ShieldAlert, FileText, Landmark, Fingerprint, AlertTriangle, ShieldCheck } from "lucide-react";

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
    const content = document.getElementById("printable-sar-doc");
    const printWindow = window.open("", "_blank");
    if (printWindow && content) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>SBP SAR Report - ${sarReport.report_id || "SAR-SHN-992104"}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 30px;
                color: #111;
                background: #fff;
                font-size: 13px;
                line-height: 1.5;
              }
              .header { border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
              .logo { font-size: 18px; font-weight: 900; text-transform: uppercase; }
              .sub { font-size: 11px; color: #555; }
              .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0; }
              .grid-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px; margin: 15px 0; }
              .card { border: 1px solid #cbd5e1; padding: 12px; background: #f8fafc; border-radius: 6px; }
              .tag { font-weight: bold; font-size: 10px; text-transform: uppercase; color: #dc2626; }
              .title { font-weight: bold; margin-bottom: 4px; font-size: 12px; }
              .narrative { background: #f1f5f9; padding: 14px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 12px; line-height: 1.6; }
              .seal { border-top: 1px solid #000; padding-top: 12px; margin-top: 25px; display: flex; justify-content: space-between; font-family: monospace; font-size: 10px; color: #333; }
              @media print { body { padding: 0; } @page { margin: 1.5cm; } }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <div class="sub">ISLAMIC REPUBLIC OF PAKISTAN</div>
                <div class="logo">FINANCIAL MONITORING UNIT (FMU) — STATE BANK OF PAKISTAN</div>
                <div class="sub">National AML/CFT Electronic Reporting Rail • Suspicious Activity Report (SAR / STR)</div>
              </div>
              <div style="text-align: right; font-size: 11px;">
                <div><strong>Ref:</strong> ${sarReport.report_id || "SAR-SHN-992104"}</div>
                <div><strong>Date:</strong> ${new Date().toISOString().slice(0, 10)}</div>
                <div style="color: #dc2626; font-weight: bold;">CONFIDENTIAL // SBP FMU</div>
              </div>
            </div>

            <div class="card" style="margin-bottom: 15px;">
              <div class="title" style="color: #0284c7;">1. TRANSACTION & INCIDENT PARAMETERS</div>
              <div class="grid-4">
                <div><span class="sub">AMOUNT:</span><br><strong>Rs. 450,000 PKR</strong></div>
                <div><span class="sub">PAYMENT RAIL:</span><br><strong>SBP Raast / 1Link IBFT</strong></div>
                <div><span class="sub">STATUS:</span><br><strong style="color: #dc2626;">QUARANTINED</strong></div>
                <div><span class="sub">PRIMARY TYPOLOGY:</span><br><strong>FIA Impersonation & Mule Ring</strong></div>
              </div>
            </div>

            <div class="grid-2">
              <div class="card">
                <div class="title">2A. VICTIM ORIGINATOR (REPORTING PARTY)</div>
                <div><strong>Haji Saleem</strong> (Senior Citizen, 68 yrs)</div>
                <div class="sub">IBAN: PK44SCBL00028193847101 &bull; Standard Chartered Bank</div>
                <div style="color: #16a34a; font-size: 11px; margin-top: 6px;">Biometric Tier 2 Verified &bull; Regular Medical Savings</div>
              </div>
              <div class="card" style="border-color: #fca5a5;">
                <div class="title" style="color: #dc2626;">2B. SUSPECTED MULE BENEFICIARY (SUBJECT OF STR)</div>
                <div><strong>Muhammad Bilal</strong></div>
                <div class="sub">IBAN: PK36MEZN00019283746501 &bull; Meezan Bank Limited</div>
                <div style="color: #dc2626; font-size: 11px; margin-top: 6px; font-weight: bold;">Account Age: 4 days only &bull; Tier 0 Digital Onboarding</div>
              </div>
            </div>

            <div style="margin-top: 15px;">
              <div class="title" style="color: #16a34a;">3. STATUTORY MULTI-AGENT FORENSIC CONSENSUS NARRATIVE</div>
              <div class="narrative">
                <p><strong>Agent 1 (Voice & Coercion Radar):</strong> Call intercept detected active governmental impersonation. Caller falsely identified as Inspector Tariq of the FIA Cyber Crime Wing Islamabad. Acoustic urgency analysis confirmed coercive threats of immediate police raid under Section 21 of the Prevention of Electronic Crimes Act (PECA 2016).</p>
                <p><strong>Agent 2 (Mule Graph Hunter):</strong> Graph analytics identified high-velocity fan-out layering. The destination account was created 4 days prior with zero standard commercial activity, acting as an intermediary node routed toward secondary mules and offshore crypto liquidation.</p>
                <p><strong>Agent 3 (Decoy Honeypot):</strong> Autonomous baiting engagement trapped secondary backup IBANs, confirming syndicate coordination and intent to evade AML interlocks.</p>
              </div>
            </div>

            <div class="seal">
              <div>CRYPTOGRAPHIC HASH: 9d650f03754dc84f02c637c4dfb3a4e698a497d175d6241a7328dc2ff545cb55</div>
              <div style="color: #16a34a; font-weight: bold;">DIGITALLY SIGNED & INTERLOCKED (AMLA 2010 SECTION 7)</div>
            </div>

            <script>
              window.onload = function() { window.print(); };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-[#0A0E17] border border-white/15 w-full max-w-4xl max-h-[92vh] flex flex-col font-mono text-xs shadow-2xl rounded-xl overflow-hidden">
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-[#080B11] border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 shrink-0 rounded bg-[#F43F5E]/20 border border-[#F43F5E]/40 flex items-center justify-center text-[#F43F5E]">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-white font-extrabold text-sm flex items-center gap-2 truncate">
                <span>SUSPICIOUS ACTIVITY REPORT (SAR / STR)</span>
                <span className="hidden md:inline-flex text-[9px] bg-[#F43F5E]/15 text-[#F43F5E] border border-[#F43F5E]/30 px-1.5 py-0.2 rounded font-bold">
                  SBP / FMU
                </span>
              </div>
              <div className="text-[10px] text-[#64748B] flex items-center gap-2">
                <span>Ref: {sarReport.report_id || "SAR-SHN-992104"}</span>
                <span>•</span>
                <span>Section 7 AMLA 2010</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            {/* View Switcher */}
            <div className="flex items-center gap-1 bg-[#0D121D] p-1 rounded border border-white/10 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setActiveTab("DOCUMENT")}
                className={`px-2 py-1 rounded transition-all cursor-pointer ${
                  activeTab === "DOCUMENT"
                    ? "bg-[#1E293B] text-white shadow-sm"
                    : "text-[#94A3B8] hover:text-white"
                }`}
              >
                DOCUMENT
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("RAW")}
                className={`px-2 py-1 rounded transition-all cursor-pointer ${
                  activeTab === "RAW"
                    ? "bg-[#1E293B] text-white shadow-sm"
                    : "text-[#94A3B8] hover:text-white"
                }`}
              >
                RAW EDI
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-[#0D121D] hover:bg-[#151D2E] text-white px-3 py-1.5 text-xs rounded transition-all cursor-pointer font-bold border border-white/10"
              title="Copy Report Markdown"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? "COPIED" : "COPY"}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-[#F43F5E] hover:bg-[#E11D48] text-white px-3.5 py-1.5 text-xs rounded transition-all cursor-pointer font-bold shadow-sm"
              title="Print / Save PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PRINT / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-[#94A3B8] hover:text-white p-1.5 rounded bg-[#0D121D] border border-white/10 hover:border-[#F43F5E] transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-16 sm:pb-20 bg-[#080B11] space-y-4">
          {activeTab === "DOCUMENT" ? (
            /* Official Formatted SBP Legal Document */
            <div id="printable-sar-doc" className="bg-[#0D121D] border border-white/10 rounded-lg p-5 sm:p-7 space-y-5 shadow-xl relative">
              {/* Government Crest & Letterhead */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-[#10B981]/15 border border-[#10B981]/40 flex items-center justify-center text-[#10B981]">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                      Islamic Republic of Pakistan
                    </div>
                    <div className="text-sm sm:text-base font-black text-white uppercase">
                      Financial Monitoring Unit (FMU) — State Bank of Pakistan
                    </div>
                    <div className="text-[10px] text-[#64748B]">
                      National AML/CFT Electronic Reporting Rail • Suspicious Activity Report (SAR)
                    </div>
                  </div>
                </div>

                <div className="text-right text-[10px] text-[#94A3B8]">
                  <div>Date: <strong className="text-white">{new Date().toISOString().slice(0, 10)}</strong></div>
                  <div>Classification: <strong className="text-[#F43F5E]">CONFIDENTIAL // LAW ENFORCEMENT</strong></div>
                </div>
              </div>

              {/* 1. Transaction & Incident Parameters */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
                  <span>1. Transaction & Incident Parameters</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded bg-[#080B11] border border-white/[0.04] text-[11px]">
                  <div>
                    <span className="text-[#64748B] block text-[9.5px]">AMOUNT INTERCEPTED:</span>
                    <strong className="text-white font-bold">Rs. 450,000 PKR</strong>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[9.5px]">PAYMENT CHANNEL:</span>
                    <strong className="text-white">SBP Raast / 1Link IBFT</strong>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[9.5px]">INTERLOCK DISPOSITION:</span>
                    <strong className="text-[#F43F5E]">QUARANTINED (PRE-SETTLEMENT)</strong>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[9.5px]">PRIMARY TYPOLOGY:</span>
                    <strong className="text-[#F59E0B]">FIA Impersonation & Mule Ring</strong>
                  </div>
                </div>
              </div>

              {/* 2. Subject Profiles & Account Footprints */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                  <span>2. Subject Profiles & Account Footprints</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Originator */}
                  <div className="p-3 rounded bg-[#080B11] border border-white/[0.04] space-y-1 text-xs">
                    <div className="text-[9.5px] text-[#64748B] font-bold uppercase">
                      VICTIM ORIGINATOR (REPORTING PARTY)
                    </div>
                    <div className="font-bold text-white text-xs">Haji Saleem (Senior Citizen, 68 yrs)</div>
                    <div className="text-[#00F0FF] text-[10.5px]">IBAN: PK44SCBL00028193847101</div>
                    <div className="text-[#94A3B8] text-[10.5px]">Institution: Standard Chartered Bank</div>
                    <div className="text-[10px] text-[#10B981] pt-1 border-t border-white/[0.04]">
                      Status: Biometric Verified Tier 2 • Account Age: 6.2 Years
                    </div>
                  </div>

                  {/* Beneficiary */}
                  <div className="p-3 rounded bg-[#180C11] border border-[#F43F5E]/30 space-y-1 text-xs">
                    <div className="text-[9.5px] text-[#F43F5E] font-bold uppercase">
                      SUSPECTED MULE BENEFICIARY (SUBJECT OF STR)
                    </div>
                    <div className="font-bold text-white text-xs">Muhammad Bilal</div>
                    <div className="text-[#F59E0B] text-[10.5px]">IBAN: PK36MEZN00019283746501</div>
                    <div className="text-[#94A3B8] text-[10.5px]">Institution: Meezan Bank Limited</div>
                    <div className="text-[10px] text-[#F43F5E] font-bold pt-1 border-t border-white/[0.04] flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-[#F43F5E]" />
                      <span>Account Age: 4 days only • Tier 0 Digital Onboarding</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Statutory Narrative & Multi-Agent Forensic Consensus */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  <span>3. Multi-Agent Forensic Consensus Narrative</span>
                </div>
                <div className="p-3.5 rounded bg-[#080B11] border border-white/[0.04] text-xs font-sans text-[#CBD5E1] space-y-2 leading-relaxed">
                  <p>
                    <strong>Agent 1 (Voice & Coercion Radar):</strong> Call intercept detected governmental impersonation. Caller falsely identified as Inspector Tariq of the FIA Cyber Crime Wing Islamabad. Acoustic urgency analysis confirmed coercive threats of immediate police raid under Section 21 of the Prevention of Electronic Crimes Act (PECA 2016).
                  </p>
                  <p>
                    <strong>Agent 2 (Mule Graph Hunter):</strong> Graph analytics identified high-velocity fan-out layering. The destination account was created 4 days prior with zero standard commercial activity, acting as an intermediary node routed toward secondary mules and offshore crypto liquidation.
                  </p>
                  <p>
                    <strong>Agent 3 (Decoy Honeypot):</strong> Autonomous baiting engagement trapped secondary backup IBANs, confirming syndicate coordination and intent to evade AML interlocks.
                  </p>
                </div>
              </div>

              {/* 4. Cryptographic Validation Seal */}
              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[9.5px] text-[#64748B]">
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>CRYPTOGRAPHIC HASH: 9d650f03754dc84f02c637c4dfb3a4e698a497d175d6241a7328dc2ff545cb55</span>
                </div>
                <div className="text-[#10B981] font-bold bg-[#10B981]/15 px-2 py-0.5 rounded border border-[#10B981]/30">
                  DIGITALLY SIGNED & INTERLOCKED
                </div>
              </div>
            </div>
          ) : (
            /* Raw SBP EDI Source View */
            <div className="bg-[#0D121D] border border-white/10 rounded-lg p-4">
              <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-[#CBD5E1] select-text">
                {markdownText}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 bg-[#080B11] border-t border-white/[0.08] flex items-center justify-between text-[10px] text-[#64748B]">
          <span>Statutory Declaration Pursuant to SBP BPRD Circular No. 04</span>
          <button
            type="button"
            onClick={onClose}
            className="bg-[#1E293B] hover:bg-[#334155] text-white px-3 py-1 rounded font-bold cursor-pointer border border-white/10"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
