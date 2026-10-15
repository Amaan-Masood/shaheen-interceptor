import React, { useState } from "react";
import { Bot, Send, ShieldAlert, Sparkles, Terminal, CheckCircle2, User, RefreshCw, Zap, Shield, Key } from "lucide-react";

export default function DecoyHoneypot({ onSendMessage, messages, capturedIocs, isSending, latestCapturedIoc }) {
  const [inputText, setInputText] = useState("");

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

  const handleQuickInject = (prompt) => {
    if (isSending) return;
    onSendMessage(prompt);
  };

  return (
    <div className="flex flex-col h-full bg-[#05070B] font-mono text-xs">
      {/* Honeypot Status Header */}
      <div className="flex items-center justify-between border-b border-[#1E293B] bg-[#090D14] px-3.5 py-2 text-[10px] text-[#94A3B8]">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-[#A855F7] animate-pulse" />
          <span className="text-white font-bold">
            AGENT 3: ACTIVE AI DECOY // ENCRYPTED TERMINAL
          </span>
          <span className="bg-[#A855F7]/20 text-[#A855F7] px-1.5 py-0.2 border border-[#A855F7]/40 font-bold">
            TARGET: "HAJI SALEEM" (68 YRS)
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="text-[#38BDF8] flex items-center gap-1">
            <Key className="w-3 h-3" />
            AES-256-GCM
          </span>
          <span className="text-[#334155]">|</span>
          <span className="text-[#10B981] flex items-center gap-1 font-bold">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            BAITING ACTIVE
          </span>
        </div>
      </div>

      {/* Flashing Extracted IOC Banner */}
      {latestCapturedIoc && (
        <div className="bg-[#EF4444] text-white px-4 py-2.5 flex items-center justify-between animate-bounce shadow-[0_0_25px_rgba(239,68,68,0.9)] border-b border-white/30">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-white animate-spin" />
            <span className="font-extrabold tracking-wider text-xs">
              🚨 NEW MULE IOC EXTRACTED & REAL-TIME BLOCKLISTED:
            </span>
            <span className="bg-black text-[#F59E0B] px-2.5 py-0.5 font-black text-xs tracking-widest border border-white/50 shadow-inner">
              {latestCapturedIoc.value}
            </span>
          </div>
          <span className="text-[10px] bg-black/60 px-2 py-0.5 font-bold uppercase tracking-wider">
            CONFIDENCE: {Math.round(latestCapturedIoc.confidence * 100)}%
          </span>
        </div>
      )}

      {/* Main Chat Stream */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#05070B] crt-overlay">
        {messages.map((msg, idx) => {
          const isDecoy = msg.sender === "decoy";
          return (
            <div
              key={idx}
              className={`flex flex-col ${isDecoy ? "items-start" : "items-end"}`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-[10px] text-[#64748B]">
                {isDecoy ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#A855F7]" />
                    <span className="text-[#A855F7] font-bold">SHAHEEN AI DECOY (HAJI SALEEM)</span>
                  </>
                ) : (
                  <>
                    <span className="text-[#EF4444] font-bold">SCAMMER / VISHING OPERATOR</span>
                    <User className="w-3.5 h-3.5 text-[#EF4444]" />
                  </>
                )}
                <span>• {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : "NOW"}</span>
              </div>

              <div
                className={`max-w-[85%] p-3 border text-xs leading-relaxed ${
                  isDecoy
                    ? "bg-[#140B1E] border-[#A855F7]/50 text-[#E9D5FF] shadow-[0_0_12px_rgba(168,85,247,0.2)]"
                    : "bg-[#1A0A0E] border-[#EF4444]/60 text-white shadow-[0_0_12px_rgba(239,68,68,0.25)]"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-center gap-2 text-[#A855F7] text-xs p-2 bg-[#12081B] border border-[#A855F7]/30">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>AI Decoy formulating anxious persona response and baiting for secondary account...</span>
          </div>
        )}
      </div>

      {/* Captured IOC Ledger Drawer */}
      <div className="border-t border-[#1E293B] bg-[#090D14] px-3.5 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[#10B981]" />
          <span className="text-[10px] text-[#94A3B8] font-bold">CAPTURED MULE IOCS ({capturedIocs.length}):</span>
          <div className="flex flex-wrap gap-1.5">
            {capturedIocs.map((ioc, i) => (
              <span
                key={i}
                className="bg-[#05070B] text-[#38BDF8] border border-[#38BDF8]/40 px-2 py-0.5 text-[10px] font-bold"
              >
                {ioc.type}: {ioc.value}
              </span>
            ))}
            {capturedIocs.length === 0 && (
              <span className="text-[#64748B] text-[10px] italic">Awaiting scammer to send backup IBAN/phone...</span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Inject Prompts */}
      <div className="bg-[#05070B] border-t border-[#1E293B] p-2 flex flex-wrap gap-1.5 items-center">
        <span className="text-[9px] text-[#64748B] uppercase font-bold flex items-center gap-1">
          <Zap className="w-3 h-3 text-[#F59E0B]" />
          QUICK INJECT:
        </span>
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleQuickInject(prompt)}
            disabled={isSending}
            className="text-[9.5px] bg-[#090D14] hover:bg-[#1E293B] text-[#94A3B8] hover:text-white border border-[#1E293B] hover:border-[#F59E0B] px-2 py-1 truncate max-w-[280px] transition-all cursor-pointer text-left"
          >
            "{prompt.slice(0, 38)}..."
          </button>
        ))}
      </div>

      {/* Input Field Form */}
      <form onSubmit={handleSend} className="p-2.5 bg-[#090D14] border-t border-[#1E293B] flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type message as scammer (or paste an IBAN/Raast ID to test extraction)..."
          className="flex-1 bg-[#05070B] border border-[#1E293B] focus:border-[#EF4444] px-3 py-2 text-xs text-white outline-none font-mono placeholder:text-[#475569]"
        />
        <button
          type="submit"
          disabled={isSending || !inputText.trim()}
          className="bg-[#EF4444] hover:bg-[#DC2626] disabled:bg-[#334155] text-white font-mono font-bold px-4 py-2 text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_12px_rgba(239,68,68,0.4)]"
        >
          <Send className="w-3.5 h-3.5" />
          <span>SEND</span>
        </button>
      </form>
    </div>
  );
}
