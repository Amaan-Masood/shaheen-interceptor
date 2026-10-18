import React, { useState } from "react";
import { Bot, Send, ShieldAlert, Sparkles, User, CheckCheck, CheckCircle2, Shield, AlertOctagon, Copy, Check } from "lucide-react";

export default function DecoyHoneypot({ onSendMessage, messages, capturedIocs, isSending, latestCapturedIoc }) {
  const [inputText, setInputText] = useState("");
  const [copiedIoc, setCopiedIoc] = useState(false);

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

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedIoc(true);
    setTimeout(() => setCopiedIoc(false), 2000);
  };

  const activeIoc = latestCapturedIoc ? latestCapturedIoc.value : (capturedIocs[0]?.value || null);

  return (
    <div className="bezel-shell p-2 rounded-3xl h-full flex flex-col">
      <div className="bezel-core p-4 sm:p-5 rounded-[calc(1.5rem-0.25rem)] flex-1 flex flex-col space-y-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#A855F7]/20 border border-[#A855F7]/40 flex items-center justify-center text-[#C084FC] shadow-inner">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2 font-display">
                <span>Scammer Trap — AI Decoy ("Haji Saleem")</span>
                <span className="text-[10px] bg-gradient-to-r from-[#A855F7]/20 to-[#9333EA]/20 text-[#C084FC] px-2 py-0.5 rounded-full font-bold border border-[#A855F7]/40 shadow-inner">
                  COVERT HONEYPOT
                </span>
              </div>
              <div className="text-xs text-[#94A3B8]">
                AI acts as confused elderly victim (68 yrs) to bait secondary IBANs & Raast phone numbers
              </div>
            </div>
          </div>

          <div className="text-xs text-[#10B981] font-bold flex items-center gap-2 bg-[#10B981]/10 px-3 py-1 rounded-full border border-[#10B981]/20 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
            </span>
            <span className="hidden sm:inline">Baiting Active</span>
          </div>
        </div>

        {/* Captured IOC Notification Banner */}
        {activeIoc && (
          <div className="rounded-2xl bg-gradient-to-r from-[#0E1E18] via-[#091712] to-[#0E1E18] border border-[#10B981]/40 p-3.5 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3 text-xs">
              <div className="w-8 h-8 rounded-xl bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#10B981] shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-[#34D399] block sm:inline">Scammer Secondary Account Trapped: </span>
                <span className="font-mono font-bold text-white bg-[#070D12] px-2.5 py-0.5 rounded-md border border-[#10B981]/40 shadow-inner inline-flex items-center gap-2 mt-1 sm:mt-0">
                  {activeIoc}
                  <button
                    type="button"
                    onClick={() => copyToClipboard(activeIoc)}
                    className="text-[#94A3B8] hover:text-white cursor-pointer"
                    title="Copy IBAN"
                  >
                    {copiedIoc ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </span>
              </div>
            </div>
            <span className="text-[10.5px] text-[#10B981] font-bold bg-[#10B981]/20 px-2.5 py-1 rounded-full border border-[#10B981]/30 whitespace-nowrap">
              Auto-Submitted to SBP
            </span>
          </div>
        )}

        {/* Chat Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#070B14]/80 rounded-2xl border border-white/[0.06]">
          {messages.map((msg, idx) => {
            const isDecoy = msg.sender === "decoy";
            return (
              <div
                key={idx}
                className={`flex flex-col ${isDecoy ? "items-start" : "items-end"}`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-[11px] text-[#94A3B8]">
                  {isDecoy ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-[#C084FC]" />
                      <span className="text-[#C084FC] font-bold">Shaheen AI Decoy (Haji Saleem)</span>
                    </>
                  ) : (
                    <>
                      <span className="text-[#F87171] font-bold">Scammer / Perpetrator</span>
                      <User className="w-3.5 h-3.5 text-[#F87171]" />
                    </>
                  )}
                </div>

                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-md ${
                    isDecoy
                      ? "bg-[#181024] border border-[#A855F7]/35 text-[#F3E8FF] rounded-tl-sm shadow-[#A855F7]/10"
                      : "bg-[#241117] border border-[#EF4444]/35 text-white rounded-tr-sm shadow-[#EF4444]/10"
                  }`}
                >
                  <div>{msg.text}</div>
                  <div className="flex justify-end items-center gap-1 mt-1 text-[10px] opacity-60">
                    <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <CheckCheck className="w-3 h-3 text-[#38BDF8]" />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator when AI is drafting reply */}
          {isSending && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#181024] border border-[#A855F7]/30 text-xs text-[#C084FC] w-fit">
              <span className="font-semibold text-[11px]">Haji Saleem is drafting response</span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C084FC] dot-typing-1" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#C084FC] dot-typing-2" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#C084FC] dot-typing-3" />
              </div>
            </div>
          )}
        </div>

        {/* 1-Click Interactive Shortcut Chips for Presenting */}
        <div className="pt-2">
          <div className="text-[11px] font-semibold text-[#94A3B8] mb-2 flex items-center justify-between">
            <span>Simulate scammer demand (1-Click Test):</span>
            <span className="text-[10px] text-[#38BDF8] font-bold">Instant Bait Demo</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onSendMessage(prompt)}
                disabled={isSending}
                className="text-[11px] bg-[#121B2E] hover:bg-[#1E293B] text-white px-3.5 py-1.5 rounded-full border border-white/10 whitespace-nowrap cursor-pointer transition-all hover:scale-102 active:scale-98 shadow-sm shrink-0 font-medium"
              >
                {i === 0 ? "Bait Backup IBAN (PK78HABB...)" : i === 1 ? "Bait Raast Phone ID (0300...)" : "Bait Secondary Vault"}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Message Input */}
        <form onSubmit={handleSend} className="flex gap-2 pt-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Or type custom scammer demand to test AI honeypot..."
            disabled={isSending}
            className="flex-1 bg-[#090F1C] border border-white/15 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#A855F7] transition-colors shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="bg-gradient-to-r from-[#A855F7] to-[#7E22CE] hover:from-[#9333EA] hover:to-[#6B21A8] disabled:bg-[#1E293B] disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:shadow-purple-500/20 active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
