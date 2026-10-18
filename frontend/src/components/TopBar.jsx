import React, { useState, useEffect } from "react";
import { Cpu, Database, Sparkles, Activity, Radio } from "lucide-react";

/* TopBar — header strip. Carries brand, live PKT/UTC clock, and the
   infrastructure telemetry pills that show which engine is actually
   making decisions right now (Cloud Run / Firestore / Gemini).

   Deliberately quiet: no pulse animations on status dots, no neon
   shadows, no military taglines. The pills are informational, not
   performative — a judge glances here to verify the demo is wired to
   a real backend, not to admire the aesthetic. */

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
      setUtcStr(now.toISOString().substring(11, 19) + "Z");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full bg-[#0F172A] border-b border-[#1E293B] px-4 py-2.5 flex items-center justify-between gap-4 text-sm z-30 sticky top-0">
      {/* Brand */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[#111827] border border-[#334155]">
          <svg viewBox="0 0 32 32" className="w-5 h-5" aria-hidden="true">
            <path
              d="M 16 3 L 8 9 L 4 17 L 11 16 L 16 29 L 21 16 L 28 17 L 24 9 Z"
              fill="#DC2626"
              fillOpacity="0.85"
            />
            <circle cx="16" cy="12" r="1.6" fill="#FFFFFF" />
          </svg>
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold text-white tracking-wide">
            SHAHEEN INTERCEPTOR
          </div>
          <div className="text-[11px] text-[#64748B] tracking-tight">
            Pre-settlement fraud defense
          </div>
        </div>
      </div>

      {/* Live clocks */}
      <div className="hidden xl:flex items-center gap-4 px-3 py-1 bg-[#111827] border border-[#1E293B] rounded text-[11px] font-mono tabular">
        <div className="flex items-center gap-1.5 text-[#94A3B8]">
          <span>PKT</span>
          <span className="text-white font-medium">{timeStr || "—"}</span>
        </div>
        <span className="text-[#334155]">·</span>
        <div className="flex items-center gap-1.5 text-[#94A3B8]">
          <span>UTC</span>
          <span className="text-white font-medium">{utcStr || "—"}</span>
        </div>
      </div>

      {/* Infrastructure telemetry pills */}
      <div className="flex items-center gap-2 flex-wrap justify-end">
        {/* Cloud Run */}
        <StatusPill
          icon={<Cpu className="w-3.5 h-3.5" />}
          iconColor="#64748B"
          label="CLOUD RUN"
          value={systemStatus?.cloud_run_environment === "active" ? "ACTIVE" : "IDLE"}
          tone={systemStatus?.cloud_run_environment === "active" ? "ok" : "warn"}
        />

        {/* Firestore */}
        <StatusPill
          icon={<Database className="w-3.5 h-3.5" />}
          iconColor="#64748B"
          label="FIRESTORE"
          value={systemStatus?.firestore_connected ? "LIVE SYNC" : "MIRROR"}
          tone={systemStatus?.firestore_connected ? "ok" : "warn"}
        />

        {/* Gemini */}
        <StatusPill
          icon={<Sparkles className="w-3.5 h-3.5" />}
          iconColor="#64748B"
          label="GEMINI"
          value={systemStatus?.gemini_live ? "FLASH LATEST" : "FALLBACK"}
          tone={systemStatus?.gemini_live ? "ok" : "warn"}
        />

        {/* Benchmark trigger */}
        <button
          type="button"
          onClick={onOpenBenchmark}
          aria-label="Run held-out benchmark evaluation"
          className="flex items-center gap-2 bg-[#111827] hover:bg-[#171F2E] text-white font-medium px-3 py-1.5 rounded border border-[#334155] text-xs transition-colors cursor-pointer active:scale-[0.98]"
        >
          <Activity className="w-3.5 h-3.5 text-[#64748B]" aria-hidden="true" />
          <span>RUN HELD-OUT BENCHMARK</span>
        </button>
      </div>
    </header>
  );
}

/* Small status pill: single dot + label + value. Uses a slow 3s breathe
   animation only when tone is 'ok' (live). Falls back to a static dot
   when prefers-reduced-motion is set. No glow shadows. */
function StatusPill({ icon, iconColor, label, value, tone }) {
  const toneColors = {
    ok: { dot: "#10B981", text: "#10B981" },
    warn: { dot: "#F59E0B", text: "#F59E0B" },
    idle: { dot: "#64748B", text: "#64748B" }
  };
  const colors = toneColors[tone] || toneColors.idle;

  return (
    <div className="flex items-center gap-1.5 bg-[#111827] border border-[#1E293B] rounded px-2 py-1 text-[11px] font-mono">
      <span style={{ color: iconColor }}>{icon}</span>
      <span className="text-[#64748B]">{label}</span>
      <span
        className={`w-1.5 h-1.5 rounded-full ${tone === "ok" ? "live-dot" : ""}`}
        style={{ backgroundColor: colors.dot }}
        aria-hidden="true"
      />
      <span className="font-semibold" style={{ color: colors.text }}>
        {value}
      </span>
    </div>
  );
}
