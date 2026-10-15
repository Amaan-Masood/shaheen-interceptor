import React, { useState } from "react";
import { X, Copy, Check, Printer, ShieldAlert, FileText, Download } from "lucide-react";

export default function SarModal({ isOpen, onClose, sarReport }) {
  const [copied, setCopied] = useState(false);

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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0A0D14] border border-[#EF4444] w-full max-w-4xl max-h-[92vh] flex flex-col font-mono text-xs shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="p-3.5 bg-[#07090E] border-b border-[#1E293B] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-[#EF4444]" />
            <div>
              <div className="text-white font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
                <span>SUSPICIOUS ACTIVITY REPORT (SAR)</span>
                <span className="text-[10px] bg-[#EF4444] text-white px-1.5 py-0.2 font-bold">
                  REGULATORY FILING SBP/FMU
                </span>
              </div>
              <div className="text-[10px] text-[#64748B]">
                Filing Ref: {sarReport.report_id || "SAR-SHN-992104"} • Section 7 AMLA 2010
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-[#1E293B] hover:bg-[#334155] text-white px-3 py-1.5 text-xs transition-all cursor-pointer font-bold border border-[#334155]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "COPIED!" : "COPY MARKDOWN"}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-[#EF4444] hover:bg-[#DC2626] text-white px-3 py-1.5 text-xs transition-all cursor-pointer font-bold"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PRINT / SAVE PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-[#94A3B8] hover:text-white p-1.5 bg-[#0F172A] border border-[#1E293B] hover:border-[#EF4444] transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Formatted Markdown Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#05070B] text-[#E2E8F0] space-y-4 leading-relaxed font-sans select-text">
          <div className="bg-[#0A0D14] border border-[#1E293B] p-6 shadow-inner whitespace-pre-wrap font-mono text-xs leading-relaxed text-[#CBD5E1]">
            {markdownText}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#07090E] border-t border-[#1E293B] flex items-center justify-between text-[10px] text-[#64748B] font-mono">
          <span>STATUTORY DECLARATION DIGEST: SHA256 VALIDATED CRYPTOGRAPHIC CHAIN</span>
          <button
            onClick={onClose}
            className="bg-[#1E293B] hover:bg-[#334155] text-white px-4 py-1.5 font-bold cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
