import React, { useState } from "react";
import { GitCommit, ArrowRight, Layers, ShieldCheck, AlertOctagon, ExternalLink, CheckCircle2, ChevronRight, Landmark, CreditCard, Ban, Shield, Sparkles } from "lucide-react";

export default function NetworkGraph({ topology, isClean }) {
  const [viewMode, setViewMode] = useState("FLOW"); // "FLOW" | "MAP"
  const [selectedNode, setSelectedNode] = useState(null);

  const nodes = Array.isArray(topology?.nodes) ? topology.nodes : [];
  const edges = Array.isArray(topology?.edges) ? topology.edges : [];

  // Compute normalized node coordinates for SVG viewBox="0 0 840 360"
  const nodeMap = {};
  nodes.forEach((n, idx) => {
    let x = n?.x !== undefined ? n.x : 100 + ((idx % 4) * 190);
    let y = n?.y !== undefined ? n.y : 130 + (Math.floor(idx / 4) * 120);

    // Compress and scale rightward nodes into the canvas safely
    if (x >= 700) x = 680;
    else if (x >= 500) x = 480;
    else if (x >= 300) x = 290;
    else x = 90;

    nodeMap[n?.id || idx] = { ...n, x, y };
  });

  return (
    <div className="bezel-shell p-2 rounded-3xl h-full flex flex-col">
      <div className="bezel-core p-4 sm:p-5 rounded-[calc(1.5rem-0.25rem)] flex-1 flex flex-col space-y-4 overflow-hidden">
        {/* Top Header & View Toggle */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#38BDF8]/15 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base text-white tracking-tight font-display">
                Money Trail — Where was the money going?
              </div>
              <div className="text-[11px] text-[#94A3B8]">
                {isClean ? "Direct institutional clearance" : "Multi-hop structuring and off-ramp detection"}
              </div>
            </div>
          </div>

          {/* View Switcher: Step Flow vs Node Map */}
          <div className="flex items-center gap-1 bg-[#090F1C] p-1 rounded-full text-xs border border-white/[0.08] shadow-inner">
            <button
              type="button"
              onClick={() => setViewMode("FLOW")}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                viewMode === "FLOW"
                  ? "bg-gradient-to-r from-[#1E293B] to-[#334155] text-white shadow-md"
                  : "text-[#94A3B8] hover:text-white"
              }`}
            >
              Step Flow
            </button>
            <button
              type="button"
              onClick={() => setViewMode("MAP")}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                viewMode === "MAP"
                  ? "bg-gradient-to-r from-[#1E293B] to-[#334155] text-white shadow-md"
                  : "text-[#94A3B8] hover:text-white"
              }`}
            >
              Network Map
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pr-1">
          {viewMode === "FLOW" ? (
            /* Luminous Step Flow */
            <div className="space-y-3 max-w-2xl mx-auto py-1">
              {isClean ? (
                /* Clean Hospital Direct Flow */
                <div className="rounded-2xl bg-[#0D1F17] border border-[#10B981]/40 p-5 space-y-4 shadow-xl relative overflow-hidden">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#34D399] font-black text-sm">
                      1
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider">Originator Account</div>
                      <div className="font-bold text-white text-sm">Farhan Siddiqui (Standard Chartered)</div>
                      <div className="text-xs text-[#94A3B8]">Verified Biometric Tier 2 • Regular Medical Savings</div>
                    </div>
                  </div>

                  <div className="pl-5 border-l-2 border-[#10B981]/50 ml-5 py-2">
                    <div className="bg-[#070D12] rounded-xl p-3 text-xs text-[#34D399] flex items-center justify-between border border-[#10B981]/25 shadow-inner">
                      <span className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-[#10B981]" />
                        <span>Raast Direct Transfer: <strong>Rs. 380,000</strong></span>
                      </span>
                      <span className="font-mono text-[10px] font-bold text-[#10B981] bg-[#10B981]/15 px-2.5 py-0.5 rounded-full border border-[#10B981]/30">
                        CLEARED (3 SEC)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-[#10B981] text-black font-black flex items-center justify-center shadow-lg shadow-[#10B981]/30">
                      <CheckCircle2 className="w-5 h-5 text-black" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] text-[#34D399] font-bold uppercase tracking-wider">Verified Healthcare Destination</div>
                      <div className="font-bold text-white text-sm">Shaukat Khanum Memorial Cancer Hospital</div>
                      <div className="text-xs text-[#94A3B8]">Tier 3 Corporate Entity • Askari Bank Official Collection Account</div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Multi-Hop Mule Scam Flow */
                <div className="space-y-2.5">
                  {/* Step 1: Victim Originator */}
                  <div className="rounded-2xl bg-[#0D1526] border border-white/[0.08] p-4 flex items-center gap-3.5 shadow-md">
                    <div className="w-10 h-10 rounded-2xl bg-[#38BDF8]/20 border border-[#38BDF8]/40 flex items-center justify-center text-[#38BDF8] font-black text-sm">
                      1
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider">Victim's Originating Account</div>
                      <div className="font-bold text-white text-sm">Haji Abdul Rehman (Retired Officer)</div>
                      <div className="text-xs text-[#94A3B8]">Attempted extortion deposit: Rs. 450,000 via Raast</div>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30">
                      Victim
                    </span>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex justify-center -my-1 text-[#EF4444]">
                    <ArrowRight className="w-4 h-4 rotate-90" />
                  </div>

                  {/* Step 2: Primary Mule Hub */}
                  <div className="rounded-2xl bg-[#1F0E14] border border-[#EF4444]/60 p-4 flex items-center gap-3.5 shadow-xl shadow-[#EF4444]/10">
                    <div className="w-10 h-10 rounded-2xl bg-[#EF4444] text-white flex items-center justify-center font-black text-sm shadow-md shadow-[#EF4444]/40">
                      2
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#F87171] uppercase font-bold tracking-wider">Primary Mule Hub</span>
                        <span className="text-[9px] bg-[#EF4444] text-white px-2 py-0.2 rounded-full font-black">
                          4 DAYS OLD
                        </span>
                      </div>
                      <div className="font-bold text-white text-sm">Muhammad Bilal (Habib Bank Ltd)</div>
                      <div className="text-xs text-[#FCA5A5]">First destination before rapid layering fan-out</div>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#EF4444]/25 text-[#F87171] border border-[#EF4444]/40">
                      Mule Layer 1
                    </span>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex justify-center -my-1 text-[#A855F7]">
                    <ArrowRight className="w-4 h-4 rotate-90" />
                  </div>

                  {/* Step 3: Structuring Fan-Out */}
                  <div className="rounded-2xl bg-[#170E24] border border-[#A855F7]/50 p-4 flex items-center gap-3.5 shadow-md">
                    <div className="w-10 h-10 rounded-2xl bg-[#A855F7]/25 border border-[#A855F7]/40 flex items-center justify-center text-[#C084FC] font-black text-sm">
                      3
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] text-[#C084FC] uppercase font-bold tracking-wider">Structuring Split (2 Secondary Accounts)</div>
                      <div className="font-bold text-white text-sm">Kashif Mehmood & Hamza Tariq</div>
                      <div className="text-xs text-[#94A3B8]">Rs. 225k & Rs. 220k split in 90 seconds to evade AML radar</div>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#A855F7]/20 text-[#C084FC] border border-[#A855F7]/30">
                      Mules Layer 2
                    </span>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex justify-center -my-1 text-[#F59E0B]">
                    <ArrowRight className="w-4 h-4 rotate-90" />
                  </div>

                  {/* Step 4: Final Cash-Out Points */}
                  <div className="rounded-2xl bg-[#1C140A] border border-[#F59E0B]/60 p-4 flex items-center gap-3.5 shadow-xl shadow-[#F59E0B]/10">
                    <div className="w-10 h-10 rounded-2xl bg-[#F59E0B] text-black flex items-center justify-center font-black text-sm shadow-md shadow-[#F59E0B]/30">
                      4
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] text-[#FBBF24] uppercase font-bold tracking-wider">Targeted Off-Ramp Liquidation</div>
                      <div className="font-bold text-white text-sm">Binance P2P Escrow & Cash Over Counter</div>
                      <div className="text-xs text-[#FDE68A]">Pre-settlement freeze prevented cash withdrawal from Rawalpindi ATM</div>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#F59E0B]/25 text-[#FBBF24] border border-[#F59E0B]/40">
                      Off-Ramp
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Interactive Network Map (SVG Canvas) */
            <div className="relative w-full h-[360px] rounded-2xl bg-[#070B14] border border-white/[0.08] overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 840 360" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="50%" stopColor="#EF4444" />
                    <stop offset="100%" stopColor="#F59E0B" />
                  </linearGradient>
                </defs>

                {/* Edges */}
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
                        stroke="#EF4444"
                        strokeWidth="2"
                        className="flow-animated"
                        opacity="0.8"
                      />
                    </g>
                  );
                })}

                {/* Nodes */}
                {nodes.map((node, idx) => {
                  const coords = nodeMap[node.id || idx];
                  const isSuspicious = node.risk_score && node.risk_score > 50;

                  return (
                    <g
                      key={idx}
                      transform={`translate(${coords.x}, ${coords.y})`}
                      className="cursor-pointer group"
                      onClick={() => setSelectedNode(node)}
                    >
                      {/* Pulse Circle */}
                      <circle
                        r="22"
                        fill={isSuspicious ? "rgba(239, 68, 68, 0.2)" : "rgba(56, 189, 248, 0.2)"}
                        className="animate-ping"
                      />
                      {/* Core Circle */}
                      <circle
                        r="16"
                        fill={isSuspicious ? "#EF4444" : "#1E293B"}
                        stroke={isSuspicious ? "#F87171" : "#38BDF8"}
                        strokeWidth="2"
                      />
                      <text
                        y="4"
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {node.id ? node.id.slice(0, 3) : idx + 1}
                      </text>
                      <text
                        y="28"
                        textAnchor="middle"
                        fill="#94A3B8"
                        fontSize="10"
                        fontWeight="600"
                      >
                        {node.label || node.id}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Node Inspector Drawer */}
              {selectedNode && (
                <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-xl bg-[#0B111E]/95 border border-white/20 backdrop-blur-md flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white text-sm">{selectedNode.label || selectedNode.id}</div>
                    <div className="text-[#94A3B8] text-[11px]">Type: {selectedNode.type || "Account"} • Bank: {selectedNode.bank || "Habib Bank Ltd"}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedNode(null)}
                    className="text-xs bg-[#1E293B] hover:bg-[#334155] text-white px-3 py-1 rounded-lg"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
