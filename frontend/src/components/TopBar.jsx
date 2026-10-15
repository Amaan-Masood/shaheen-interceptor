import React, { useState, useEffect } from "react";
import { Cpu, Database, Sparkles, Activity, Radio, Shield, Clock } from "lucide-react";

export default function TopBar({ systemStatus, onOpenBenchmark, activeScenarioTitle }) {
  const [timeStr, setTimeStr] = useState("");
  const [utcStr, setUtcStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        })
      );
      setUtcStr(
        now.toISOString().substring(11, 19) + "Z"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full bg-[#05070B] border-b border-[#1E293B] px-3.5 py-2 flex flex-wrap items-center justify-between gap-3 text-xs tracking-wider z-30 sticky top-0 backdrop-blur-md">
      {/* Brand & Emblem */}
      <div className="flex items-center gap-3">
        {/* Geometric Falcon Emblem SVG */}
        <div className="relative flex items-center justify-center w-9 h-9 bg-[#0B0F19] border border-[#EF4444]/70 shadow-[0_0_15px_rgba(239,68,68,0.4)] group">
          <svg viewBox="0 0 32 32" className="w-6 h-6 fill-none stroke-[#EF4444] stroke-[1.8] drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
            {/* Falcon Predator Head & Wings */}
            <path d="M 16 3 L 8 9 L 4 17 L 11 16 L 16 29 L 21 16 L 28 17 L 24 9 Z" fill="#13080A" />
            <path d="M 16 6 L 10 11 L 8 18 L 13 16 L 16 25 L 19 16 L 24 18 L 22 11 Z" fill="#EF4444" fillOpacity="0.2" />
            {/* Glowing Cyber Eye */}
            <circle cx="16" cy="12" r="1.5" fill="#EF4444" className="animate-ping" />
            <circle cx="16" cy="12" r="1.5" fill="#FFFFFF" />
          </svg>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#10B981] rounded-full animate-ping" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#10B981] rounded-full" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white text-sm tracking-widest uppercase flex items-center gap-1.5">
              <span>SHAHEEN INTERCEPTOR</span>
              <span className="text-[#EF4444] text-[10px] bg-[#EF4444]/20 border border-[#EF4444]/40 px-1.5 py-0.2 font-mono font-bold">
                PRO-DEFENSE v1.0
              </span>
            </span>
          </div>
          <div className="text-[10px] text-[#64748B] font-mono tracking-tight flex items-center gap-2 mt-0.5">
            <span className="text-[#EF4444] font-bold">CLASSIFIED // BFSI AIR-GAP</span>
            <span>•</span>
            <span className="text-[#38BDF8] truncate max-w-[280px]">
              {activeScenarioTitle || "ACTIVE RADAR MONITORING"}
            </span>
          </div>
        </div>
      </div>

      {/* Center Tactical Clocks (PKT & UTC Zulu) */}
      <div className="hidden xl:flex items-center gap-4 px-3 py-1 bg-[#090D14] border border-[#1E293B] text-[10px] font-mono">
        <div className="flex items-center gap-1.5 text-[#94A3B8]">
          <Clock className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>PKT:</span>
          <span className="text-white font-bold">{timeStr || "01:28:00"}</span>
        </div>
        <span className="text-[#334155]">|</span>
        <div className="flex items-center gap-1.5 text-[#94A3B8]">
          <span>ZULU:</span>
          <span className="text-[#F59E0B] font-bold">{utcStr || "20:28:00Z"}</span>
        </div>
        <span className="text-[#334155]">|</span>
        <div className="flex items-center gap-1 text-[#10B981]">
          <Radio className="w-3 h-3 animate-pulse" />
          <span>INTERCEPT SWITCH ACTIVE</span>
        </div>
      </div>

      {/* Infrastructure Telemetry Status Pills */}
      <div className="flex items-center flex-wrap gap-2">
        {/* Google Cloud Run */}
        <div className="flex items-center gap-1.5 bg-[#090D14] border border-[#1E293B] px-2.5 py-1 text-[10.5px] font-mono">
          <Cpu className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span className="text-[#64748B]">CLOUD RUN:</span>
          <span className="text-[#10B981] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
            ACTIVE
          </span>
        </div>

        {/* Cloud Firestore */}
        <div className="flex items-center gap-1.5 bg-[#090D14] border border-[#1E293B] px-2.5 py-1 text-[10.5px] font-mono">
          <Database className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span className="text-[#64748B]">FIRESTORE:</span>
          <span className={`font-bold flex items-center gap-1 ${systemStatus?.firestore_mode === "LIVE_FIRESTORE" ? "text-[#10B981]" : "text-[#F59E0B]"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${systemStatus?.firestore_mode === "LIVE_FIRESTORE" ? "bg-[#10B981]" : "bg-[#F59E0B]"} animate-pulse`}></span>
            {systemStatus?.firestore_mode === "LIVE_FIRESTORE" ? "LIVE" : "MIRROR"}
          </span>
        </div>

        {/* Gemini 2.5 Flash */}
        <div className="flex items-center gap-1.5 bg-[#090D14] border border-[#1E293B] px-2.5 py-1 text-[10.5px] font-mono">
          <Sparkles className="w-3.5 h-3.5 text-[#A855F7]" />
          <span className="text-[#64748B]">GEMINI 2.5:</span>
          <span className="text-[#10B981] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
            READY
          </span>
        </div>

        {/* Benchmark Trigger Button */}
        <button
          onClick={onOpenBenchmark}
          className="flex items-center gap-2 bg-[#EF4444] hover:bg-[#DC2626] text-white font-mono font-bold px-3 py-1.5 border border-[#EF4444] shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>RUN 20-CASE BENCHMARK</span>
        </button>
      </div>
    </header>
  );
}
