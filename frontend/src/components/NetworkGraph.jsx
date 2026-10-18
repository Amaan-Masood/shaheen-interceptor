import React, { useState } from "react";
import { GitCommit, ArrowRight, Layers, ShieldCheck, AlertOctagon, ExternalLink, CheckCircle2, Shield, AlertTriangle, Radio } from "lucide-react";

export default function NetworkGraph({ topology, isClean }) {
  const [viewMode, setViewMode] = useState("FLOW"); // "FLOW" | "MAP"
  const [selectedNode, setSelectedNode] = useState(null);

  const nodes = Array.isArray(topology?.nodes) ? topology.nodes : [];
  const edges = Array.isArray(topology?.edges) ? topology.edges : [];

  // Compute node coordinates map for SVG viewBox="0 0 860 360"
  const nodeMap = {};
  const totalNodes = nodes.length;

  if (totalNodes <= 3) {
    // Linear pipeline layout for direct flows (e.g. Safe Hospital: Patient -> Hospital -> Vendor)
    const xCoords = totalNodes === 2 ? [240, 620] : [160, 430, 700];
    nodes.forEach((n, idx) => {
      nodeMap[n.id || idx] = {
        ...n,
        x: xCoords[idx] !== undefined ? xCoords[idx] : (160 + idx * 260),
        y: 180
      };
    });
  } else {
    // Multi-hop / branching layout
    nodes.forEach((n, idx) => {
      let x = n?.x;
      let y = n?.y;

      if (x === undefined || y === undefined) {
        const col = Math.min(Math.floor(idx / 2), 3);
        const row = idx % 2;
        x = 120 + col * 200;
        y = 120 + row * 120;
      } else {
        x = Math.max(100, Math.min(x, 740));
        y = Math.max(80, Math.min(y, 280));
      }

      nodeMap[n.id || idx] = { ...n, x, y };
    });
  }

  return (
    <div className="bg-[#0A0E17] border border-white/[0.08] rounded-xl p-3 sm:p-4 flex flex-col h-full space-y-3 shadow-xl">
      {/* Top Header & View Toggle */}
      <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#00F0FF]" />
          <div>
            <div className="font-mono text-xs font-bold text-white tracking-wider uppercase">
              [ MONEY_TRAIL // 3-HOP TOPOLOGY ]
            </div>
            <div className="text-[10px] font-mono text-[#64748B]">
              {isClean ? "Direct institutional clearance" : "Multi-hop structuring and off-ramp detection"}
            </div>
          </div>
        </div>

        {/* View Switcher: Step Flow vs Node Map */}
        <div className="flex items-center gap-1 bg-[#080B11] p-1 rounded-md text-xs font-mono border border-white/[0.06]">
          <button
            type="button"
            onClick={() => setViewMode("FLOW")}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer font-bold ${
              viewMode === "FLOW"
                ? "bg-[#1E293B] text-white shadow-sm"
                : "text-[#94A3B8] hover:text-white"
            }`}
          >
            STEP FLOW
          </button>
          <button
            type="button"
            onClick={() => setViewMode("MAP")}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer font-bold ${
              viewMode === "MAP"
                ? "bg-[#1E293B] text-white shadow-sm"
                : "text-[#94A3B8] hover:text-white"
            }`}
          >
            NETWORK MAP
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto pr-1">
        {viewMode === "FLOW" ? (
          /* Step Flow Narrative */
          <div className="space-y-2.5 max-w-2xl mx-auto py-1 font-mono text-xs">
            {isClean ? (
              /* Clean Hospital Direct Flow */
              <div className="rounded-lg bg-[#0C1712] border border-[#10B981]/40 p-4 space-y-3.5 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#10B981] font-bold text-xs">
                    1
                  </div>
                  <div className="flex-1">
                    <div className="text-[9.5px] text-[#64748B] font-bold uppercase">ORIGINATOR ACCOUNT</div>
                    <div className="font-bold text-white text-xs">Farhan Siddiqui (Standard Chartered Bank)</div>
                    <div className="text-[10.5px] text-[#94A3B8] font-sans">Verified Biometric Tier 2 • Regular Medical Savings Account</div>
                  </div>
                </div>

                <div className="pl-4 border-l-2 border-[#10B981]/50 ml-4 py-1">
                  <div className="bg-[#080B11] rounded p-2.5 text-[11px] text-[#10B981] flex items-center justify-between border border-[#10B981]/25">
                    <span className="flex items-center gap-2">
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>Raast Direct Transfer: <strong>Rs. 380,000</strong></span>
                    </span>
                    <span className="font-mono text-[9.5px] font-bold bg-[#10B981]/15 px-2 py-0.5 rounded border border-[#10B981]/30">
                      CLEARED (3 SEC)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#10B981] text-black font-black flex items-center justify-center shadow-md">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[9.5px] text-[#10B981] font-bold uppercase">VERIFIED HEALTHCARE DESTINATION</div>
                    <div className="font-bold text-white text-xs">Shaukat Khanum Memorial Cancer Hospital</div>
                    <div className="text-[10.5px] text-[#94A3B8] font-sans">Tier 3 Corporate Entity • Askari Bank Official Collection Account</div>
                  </div>
                </div>
              </div>
            ) : (
              /* Multi-Hop Mule Scam Flow */
              <div className="space-y-2">
                {/* Step 1: Victim Originator */}
                <div className="rounded-lg bg-[#0D121D] border border-white/[0.06] p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#00F0FF]/15 border border-[#00F0FF]/40 flex items-center justify-center text-[#00F0FF] font-bold text-xs">
                    1
                  </div>
                  <div className="flex-1">
                    <div className="text-[9px] text-[#64748B] uppercase font-bold">VICTIM ORIGINATOR</div>
                    <div className="font-bold text-white text-xs">Haji Saleem (Senior Citizen, 68 yrs)</div>
                    <div className="text-[10px] text-[#94A3B8] font-sans">Targeted via spoofed VoIP call impersonating FIA Cyber Crime</div>
                  </div>
                  <span className="text-[10px] font-bold text-white bg-[#080B11] px-2 py-1 rounded border border-white/10">
                    Rs. 450,000
                  </span>
                </div>

                {/* Step 2: SBP Pre-Settlement Interlock Freeze */}
                <div className="rounded-lg bg-[#180C11] border border-[#F43F5E]/60 p-3 flex items-center gap-3 shadow-md">
                  <div className="w-8 h-8 rounded-md bg-[#F43F5E] text-white flex items-center justify-center font-black text-xs shadow-md">
                    2
                  </div>
                  <div className="flex-1">
                    <div className="text-[9px] text-[#F43F5E] uppercase font-bold tracking-wider">
                      SHAHEEN PRE-SETTLEMENT INTERLOCK (FUNDS QUARANTINED)
                    </div>
                    <div className="font-bold text-white text-xs">Primary Mule: Muhammad Bilal (Meezan Bank)</div>
                    <div className="text-[10px] text-[#94A3B8] font-sans">Account opened 4 days ago with zero history. Trapped before settlement.</div>
                  </div>
                  <span className="text-[9.5px] font-bold px-2 py-0.5 rounded bg-[#F43F5E]/20 text-[#F43F5E] border border-[#F43F5E]/40">
                    FROZEN
                  </span>
                </div>

                {/* Step 3: Layering Destination */}
                <div className="rounded-lg bg-[#140F0A] border border-[#F59E0B]/30 p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#F59E0B]/20 border border-[#F59E0B]/40 flex items-center justify-center text-[#F59E0B] font-bold text-xs">
                    3
                  </div>
                  <div className="flex-1">
                    <div className="text-[9px] text-[#F59E0B] uppercase font-bold">PREVENTED LAYERING HOP</div>
                    <div className="font-bold text-white text-xs">Secondary Mules: Kashif Mehmood & Hamza Tariq</div>
                    <div className="text-[10px] text-[#94A3B8] font-sans">Rapid fan-out split into 2 x Rs. 225,000 intended transfers.</div>
                  </div>
                  <span className="text-[9.5px] font-bold px-2 py-0.5 rounded bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
                    BLOCKED
                  </span>
                </div>

                {/* Step 4: Final Cash-Out Points */}
                <div className="rounded-lg bg-[#140F0A] border border-[#F59E0B]/40 p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#F59E0B] text-black flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <div className="flex-1">
                    <div className="text-[9px] text-[#F59E0B] uppercase font-bold">TARGETED OFF-RAMP LIQUIDATION</div>
                    <div className="font-bold text-white text-xs">Binance P2P Escrow & ATM Cash Withdrawal</div>
                    <div className="text-[10px] text-[#94A3B8] font-sans">Pre-settlement freeze prevented cash withdrawal from Rawalpindi ATM.</div>
                  </div>
                  <span className="text-[9.5px] font-bold px-2 py-0.5 rounded bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30">
                    OFF-RAMP
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Interactive Network Map (Tactical SVG Canvas) */
          <div className="relative w-full h-[360px] rounded-lg bg-[#070A0F] border border-white/[0.08] overflow-hidden flex items-center justify-center">
            {/* Top Tactical HUD Banner */}
            <div className="absolute top-2 left-3 right-3 z-10 flex items-center justify-between text-[10px] font-mono pointer-events-none">
              <span className={`px-2 py-0.5 rounded border font-bold ${
                isClean
                  ? "bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40"
                  : "bg-[#F43F5E]/20 text-[#F43F5E] border-[#F43F5E]/40"
              }`}>
                {isClean
                  ? "SETTLEMENT AUTHORIZED // SBP CLEARANCE APPROVED"
                  : "PRE-SETTLEMENT INTERLOCK ACTIVE // FUNDS FROZEN AT SWITCH LEVEL"}
              </span>
              <span className="text-[#64748B]">NODES: {nodes.length} // EDGES: {edges.length}</span>
            </div>

            <svg viewBox="0 0 860 360" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="laserGradScam" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00F0FF" />
                  <stop offset="50%" stopColor="#F43F5E" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
                <linearGradient id="laserGradClean" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#34D399" />
                </linearGradient>
              </defs>

              {/* Edge Connections */}
              {edges.map((edge, idx) => {
                const source = nodeMap[edge.source];
                const target = nodeMap[edge.target];
                if (!source || !target) return null;

                return (
                  <g key={idx}>
                    <line
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={isClean ? "#10B981" : "#F43F5E"}
                      strokeWidth="2"
                      className="flow-animated"
                      opacity="0.8"
                    />
                  </g>
                );
              })}

              {/* Distinct Node Geometries */}
              {nodes.map((node, idx) => {
                const coords = nodeMap[node.id || idx];
                const isSuspicious = !isClean && node.risk_score && node.risk_score > 50;
                const isVictim = node.role === "VICTIM" || idx === 0;
                const isOffRamp = node.role === "CASH_OUT" || node.id?.includes("ATM") || node.id?.includes("BINANCE");

                return (
                  <g
                    key={idx}
                    transform={`translate(${coords.x}, ${coords.y})`}
                    className="cursor-pointer group"
                    onClick={() => setSelectedNode(node)}
                  >
                    {/* Node Shape Geometry */}
                    {isClean ? (
                      /* Clean Node: Green Circle */
                      <>
                        <circle r="18" fill="rgba(16, 185, 129, 0.2)" className="animate-ping" />
                        <circle r="15" fill="#10B981" stroke="#34D399" strokeWidth="2" />
                      </>
                    ) : isVictim ? (
                      /* Victim Node: Square Shield */
                      <>
                        <rect x="-18" y="-18" width="36" height="36" rx="4" fill="rgba(0, 240, 255, 0.2)" className="animate-ping" />
                        <rect x="-15" y="-15" width="30" height="30" rx="4" fill="#0E1726" stroke="#00F0FF" strokeWidth="2" />
                      </>
                    ) : isOffRamp ? (
                      /* Final Off-Ramp: Pulsing Diamond */
                      <>
                        <polygon points="0,-22 22,0 0,22 -22,0" fill="rgba(244, 63, 94, 0.2)" className="animate-ping" />
                        <polygon points="0,-16 16,0 0,16 -16,0" fill="#F43F5E" stroke="#FF6B8B" strokeWidth="2" />
                      </>
                    ) : (
                      /* Mule Account: Hexagon */
                      <>
                        <polygon points="0,-20 18,-10 18,10 0,20 -18,10 -18,-10" fill="rgba(245, 158, 11, 0.2)" className="animate-ping" />
                        <polygon points="0,-16 14,-8 14,8 0,16 -14,8 -14,-8" fill="#F59E0B" stroke="#FDE68A" strokeWidth="2" />
                      </>
                    )}

                    {/* Node ID / Code */}
                    <text
                      y="4"
                      textAnchor="middle"
                      fill={isClean || !isVictim ? "#000000" : "#00F0FF"}
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                      className="pointer-events-none select-none"
                    >
                      {node.id ? node.id.slice(0, 3) : idx + 1}
                    </text>

                    {/* Node Primary Label */}
                    <text
                      y="28"
                      textAnchor="middle"
                      fill={isClean ? "#34D399" : (isSuspicious ? "#F87171" : "#94A3B8")}
                      fontSize="9.5"
                      fontWeight="bold"
                      fontFamily="monospace"
                      className="pointer-events-none select-none"
                    >
                      {node.label && node.label.length > 24 ? node.label.slice(0, 22) + "…" : (node.label || node.id)}
                    </text>

                    {/* Bank / Role Subtitle */}
                    {node.bank && (
                      <text
                        y="40"
                        textAnchor="middle"
                        fill="#64748B"
                        fontSize="8.5"
                        fontFamily="monospace"
                        className="pointer-events-none select-none"
                      >
                        {node.bank}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Selected Node Forensic Inspector Drawer */}
            {selectedNode && (
              <div className="absolute bottom-2 left-2 right-2 p-3 rounded bg-[#0A0E17]/95 border border-white/20 backdrop-blur-md flex items-center justify-between text-xs font-mono">
                <div>
                  <div className="font-bold text-white text-xs">{selectedNode.label || selectedNode.id}</div>
                  <div className="text-[#94A3B8] text-[10px]">
                    Role: {selectedNode.role || selectedNode.type || "Account"} • Bank: {selectedNode.bank || "Habib Bank Ltd"} • Risk Score: {selectedNode.risk_score || selectedNode.risk || 0}%
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedNode(null)}
                  className="text-[10px] bg-[#1E293B] hover:bg-[#334155] text-white px-2.5 py-1 rounded cursor-pointer font-bold"
                >
                  CLOSE
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
