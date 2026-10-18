import React, { useState } from "react";
import { Bot, Send, ShieldAlert, Sparkles, User, CheckCheck, CheckCircle2, Shield, AlertOctagon, Copy, Check, Radio, Terminal, Fingerprint } from "lucide-react";

export default function DecoyHoneypot({ onSendMessage, messages, capturedIocs, isSending, latestCapturedIoc }) {
  const [inputText, setInputText] = useState("");
  const [copiedIoc, setCopiedIoc] = useState({});

  const quickPrompts = [
    "Send the money fast to my backup account PK78HABB00034827190001 or police will raid your house!",
    "App error is your fault! Transfer immediately to Raast Mobile ID 03001234567!",
    "Use our secondary clearing vault IBAN PK12BAHL00098231200192 before account is frozen!"
  ];

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim() || isSending) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  const copyToClipboard = (key, text) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedIoc((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedIoc((prev) => ({ ...prev, [key]: false }));
    }, 2000);
  };

  // Compile active IOC list
  const iocList = Array.isArray(capturedIocs) && capturedIocs.length > 0 ? capturedIocs : [
    { type: "MULE_IBAN", value: "PK36MEZN00019283746501", confidence: 0.984, source: "INITIAL_CALL_FEED", status: "TRAPPED" },
    { type: "RAAST_PHONE_ID", value: "0300-9281745", confidence: 0.952, source: "DECOY_ENGAGEMENT", status: "TRAPPED" }
  ];

  return (
    <div className="bg-[#0A0E17] border border-white/[0.08] rounded-xl p-3 sm:p-4 flex flex-col h-full space-y-3 shadow-xl">
      {/* Header: Counter-Intelligence Terminal Status */}
      <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#F59E0B]" />
          <div>
            <div className="font-mono text-xs font-bold text-white tracking-wider uppercase flex items-center gap-2">
              <span>[ COUNTER_INTEL // AI_DECOY_HONEYPOT ]</span>
              <span className="text-[9px] bg-[#F59E0B]/20 text-[#F59E0B] px-1.5 py-0.2 rounded font-bold border border-[#F59E0B]/40">
                ACTIVE BAIT
              </span>
            </div>
            <div className="text-[10px] font-mono text-[#64748B]">
              Autonomous baiting feigns confusion to extract secondary syndicate IBANs & accounts
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#10B981] bg-[#080B11] px-2 py-0.5 rounded border border-white/[0.06]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
          </span>
          <span className="font-bold">AGENT ONLINE</span>
        </div>
      </div>

      {/* Split View Upper: Live Bait Conversation */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-[#080B11] rounded-lg border border-white/[0.04] min-h-[180px] max-h-[220px]">
        {messages.map((msg, idx) => {
          const isDecoy = msg.sender === "decoy";
          return (
            <div
              key={idx}
              className={`flex flex-col ${isDecoy ? "items-start" : "items-end"}`}
            >
              <div className="flex items-center gap-1.5 mb-0.5 text-[10px] font-mono">
                {isDecoy ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                    <span className="text-[#F59E0B] font-bold">SHAHEEN DECOY // "Haji Saleem" (Elderly Victim)</span>
                  </>
                ) : (
                  <>
                    <span className="text-[#F43F5E] font-bold">SCAMMER // Perpetrator Feed</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F43F5E]" />
                  </>
                )}
              </div>

              <div
                className={`max-w-[90%] p-2.5 rounded-md text-xs leading-relaxed font-sans ${
                  isDecoy
                    ? "bg-[#18110A] border border-[#F59E0B]/30 text-[#FEF3C7]"
                    : "bg-[#180C11] border border-[#F43F5E]/30 text-white"
                }`}
              >
                <div>{msg.text}</div>
                <div className="flex justify-end items-center gap-1 mt-1 text-[9.5px] font-mono text-[#64748B]">
                  <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <CheckCheck className="w-3 h-3 text-[#00F0FF]" />
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing State */}
        {isSending && (
          <div className="flex items-center gap-2 p-2 rounded bg-[#18110A] border border-[#F59E0B]/30 text-xs font-mono text-[#F59E0B] w-fit">
            <span className="text-[10px]">Haji Saleem is composing bait response</span>
            <div className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-[#F59E0B] dot-typing-1" />
              <span className="w-1 h-1 rounded-full bg-[#F59E0B] dot-typing-2" />
              <span className="w-1 h-1 rounded-full bg-[#F59E0B] dot-typing-3" />
            </div>
          </div>
        )}
      </div>

      {/* Split View Lower: Real-time Captured IOC Ledger */}
      <div className="bg-[#0D121D] border border-white/[0.06] rounded-lg p-2.5 space-y-2">
        <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase text-[#94A3B8]">
          <span className="flex items-center gap-1.5">
            <Fingerprint className="w-3.5 h-3.5 text-[#10B981]" />
            <span>CAPTURED IOC LEDGER // LIVE EVIDENCE PINS:</span>
          </span>
          <span className="text-[#10B981]">AUTOMATIC SBP REPO FILING</span>
        </div>

        <div className="space-y-1.5 font-mono text-xs">
          {iocList.map((ioc, i) => {
            const key = `ioc-${i}`;
            const conf = Math.round((ioc.confidence || 0.98) * 100);
            return (
              <div
                key={i}
                className="p-2 rounded bg-[#080B11] border border-white/[0.04] flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 shrink-0">
                    {ioc.type || "MULE_IBAN"}
                  </span>
                  <span className="text-white font-bold text-[11px] truncate">{ioc.value}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[9px] text-[#64748B]">CONFIDENCE: {conf}%</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(key, ioc.value)}
                    className="p-1 rounded bg-[#1E293B] hover:bg-[#334155] text-white cursor-pointer transition-all"
                    title="Copy IOC value"
                  >
                    {copiedIoc[key] ? (
                      <Check className="w-3 h-3 text-[#10B981]" />
                    ) : (
                      <Copy className="w-3 h-3 text-[#94A3B8]" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 1-Click Interactive Test Triggers for Presentation */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-mono text-[#64748B] uppercase font-bold flex items-center justify-between">
          <span>SIMULATE SCAMMER DEMAND (1-CLICK TEST):</span>
          <span className="text-[#00F0FF]">LIVE DEMO SHORTCUTS</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSendMessage(prompt)}
              disabled={isSending}
              className="text-[10px] font-mono bg-[#0D121D] hover:bg-[#151D2E] text-white px-2.5 py-1 rounded border border-white/10 whitespace-nowrap cursor-pointer transition-all shrink-0 font-medium"
            >
              {i === 0 ? "Bait Backup IBAN (PK78HABB...)" : i === 1 ? "Bait Raast Mobile (0300...)" : "Bait Secondary Vault"}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Message Input Form */}
      <form onSubmit={handleSend} className="flex gap-2 pt-0.5">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type custom scammer demand to test autonomous AI honeypot..."
          disabled={isSending}
          className="flex-1 bg-[#080B11] border border-white/15 rounded-md px-3 py-2 text-xs text-white font-mono placeholder-[#64748B] focus:outline-none focus:border-[#F59E0B] transition-colors"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isSending}
          className="bg-[#F59E0B] hover:bg-[#D97706] disabled:bg-[#1E293B] disabled:cursor-not-allowed text-black px-4 py-2 rounded-md font-mono font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <Send className="w-3.5 h-3.5" />
          <span>BAIT</span>
        </button>
      </form>
    </div>
  );
}
