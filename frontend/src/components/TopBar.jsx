import React, { useState, useEffect } from "react";
import { Shield, Sparkles, Activity, Clock, Lock, ArrowUpRight, CheckCircle2 } from "lucide-react";

export default function TopBar({ systemStatus, onOpenBenchmark }) {
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Karachi",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full bg-[#080D19]/80 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-6 lg:px-8 py-3 z-30 sticky top-0 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3.5">
          {/* Logo Squircle with specular highlight */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#EF4444] to-[#F59E0B] rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1E1015] via-[#2A1118] to-[#120B0F] border border-[#EF4444]/40 text-white shadow-inner">
              <Shield className="w-5 h-5 text-[#EF4444]" />
            </div>
          </div>

          <div>
            <div className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2 font-display">
              <span>SHAHEEN</span>
              <span className="text-[10px] uppercase font-extrabold tracking-widest px-2 py-0.5 rounded-full bg-[#EF4444]/15 text-[#F87171] border border-[#EF4444]/30">
                SCAM SHIELD
              </span>
              <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] text-[#94A3B8] font-medium border-l border-white/10 pl-2.5">
                <Lock className="w-3 h-3 text-[#10B981]" />
                <span>SBP Raast Pre-Settlement Interlock</span>
              </span>
            </div>
            <div className="text-xs text-[#94A3B8] flex items-center gap-2">
              <span>National Multi-Agent Scam & Money Mule Defense Platform</span>
            </div>
          </div>
        </div>

        {/* Right Controls: Telemetry Clock, AI Engine & Benchmark */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Live PKT Clock */}
          <div className="hidden lg:flex items-center gap-2 bg-[#0E1626]/80 border border-white/[0.08] rounded-full px-3.5 py-1.5 text-xs text-[#94A3B8] shadow-inner">
            <Clock className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="text-[11px] text-[#64748B] font-semibold">PKT:</span>
            <span className="font-mono font-bold text-white tracking-wider">{timeStr || "LIVE"}</span>
          </div>

          {/* Engine Status Pill */}
          <div className="flex items-center gap-2 bg-[#0E1626]/80 border border-white/[0.08] rounded-full px-3.5 py-1.5 text-xs text-[#E2E8F0] shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
            </span>
            <span className="text-[#94A3B8] font-medium hidden sm:inline">Engine:</span>
            <span className="font-semibold text-white flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="hidden xs:inline">{systemStatus?.gemini_live ? "Gemini 2.5 Flash" : "Multi-Agent"}</span>
              <span className="xs:hidden">Gemini</span>
            </span>
          </div>

          {/* Benchmark Audit Button with Button-in-Button pattern */}
          <button
            type="button"
            onClick={onOpenBenchmark}
            className="group flex items-center gap-2 pl-3.5 pr-1.5 py-1.5 rounded-full bg-gradient-to-r from-[#172033] to-[#1E293B] hover:from-[#1E293B] hover:to-[#334155] text-white font-bold text-xs border border-white/15 transition-all cursor-pointer shadow-lg hover:shadow-cyan-500/10 active:scale-95"
          >
            <Activity className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="hidden sm:inline">40-Case Audit</span>
            <span className="sm:hidden">Audit</span>
            <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-[#38BDF8] group-hover:text-black transition-all">
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
