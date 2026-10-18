import React, { useState, useEffect } from "react";
import { Shield, Activity, Clock, Lock, ArrowUpRight, Cpu, Radio, ShieldAlert } from "lucide-react";

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
    <header className="w-full bg-[#080B11] border-b border-white/[0.08] px-4 sm:px-6 lg:px-8 py-2.5 z-30 sticky top-0 shadow-xl backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Institutional National Defense Command Branding */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#0E131F] border border-[#F43F5E]/40 text-[#F43F5E] shadow-sm">
            <Shield className="w-4 h-4 text-[#F43F5E]" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-widest text-white font-mono uppercase">
                SHAHEEN // INTERCEPTOR
              </span>
              <span className="text-[9px] font-mono font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#F43F5E]/15 text-[#F43F5E] border border-[#F43F5E]/30 uppercase">
                BFSI DEFENSE
              </span>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 text-[10.5px] font-mono text-[#94A3B8] border-l border-white/10 pl-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
              </span>
              <span className="text-[#10B981] font-bold">SBP RAAST INTERLOCK: ACTIVE</span>
              <span className="text-[#64748B]">•</span>
              <span className="text-[#64748B]">PRE-SETTLEMENT ESCROW</span>
            </div>
          </div>
        </div>

        {/* Right: Operations Cockpit Telemetry & Empirical Audit Trigger */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Real-time Latency Budget SLA */}
          <div className="hidden md:flex items-center gap-1.5 bg-[#0E131F] border border-white/[0.08] px-2.5 py-1 rounded-md text-[11px] font-mono text-[#94A3B8]">
            <Radio className="w-3 h-3 text-[#00F0FF] animate-pulse" />
            <span className="text-[#64748B] font-semibold">BUDGET:</span>
            <span className="text-[#00F0FF] font-bold">&lt;850ms SLA</span>
          </div>

          {/* PKT Precision Telemetry Clock */}
          <div className="hidden sm:flex items-center gap-1.5 bg-[#0E131F] border border-white/[0.08] px-2.5 py-1 rounded-md text-[11px] font-mono text-[#94A3B8]">
            <Clock className="w-3 h-3 text-[#64748B]" />
            <span className="text-[#64748B]">PKT:</span>
            <span className="text-white font-bold tracking-wider">{timeStr || "LIVE"}</span>
          </div>

          {/* Active AI Engine Indicator */}
          <div className="flex items-center gap-1.5 bg-[#0E131F] border border-white/[0.08] px-2.5 py-1 rounded-md text-[11px] font-mono text-[#94A3B8]">
            <Cpu className="w-3 h-3 text-[#10B981]" />
            <span className="hidden xs:inline text-white font-medium">Gemini 2.5 Flash</span>
            <span className="xs:hidden text-white font-medium">Gemini</span>
          </div>

          {/* High-Contrast Benchmark Audit Trigger Button */}
          <button
            type="button"
            onClick={onOpenBenchmark}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#F43F5E] hover:bg-[#E11D48] text-white font-mono font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer shadow-sm hover:shadow-[#F43F5E]/20 active:scale-95"
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">BENCHMARK (90.9% RECALL)</span>
            <span className="sm:hidden">BENCHMARK</span>
            <ArrowUpRight className="w-3 h-3 opacity-80" />
          </button>
        </div>
      </div>
    </header>
  );
}
