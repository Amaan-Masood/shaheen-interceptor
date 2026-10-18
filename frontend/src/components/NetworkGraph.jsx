import React, { useState } from "react";
import { GitCommit, AlertOctagon, Smartphone, Shield, ArrowRight, Layers, Info, Crosshair, Zap } from "lucide-react";

export default function NetworkGraph({ topology, isClean }) {
  const [selectedNode, setSelectedNode] = useState(null);

  if (!topology || !topology.nodes || topology.nodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-[#64748B] font-mono text-xs">
        <GitCommit className="w-8 h-8 mb-2 animate-spin text-[#EF4444]" />
        <span>AWAITING TRANSACTION INTERCEPTION TO CONSTRUCT GRAPH...</span>
      </div>
    );
  }

  const { nodes, edges } = topology;

  // Compute node coordinates map
  const nodeMap = {};
  nodes.forEach((n, idx) => {
    const x = n.x !== undefined ? n.x : 120 + ((idx % 4) * 190);
    const y = n.y !== undefined ? n.y : 140 + (Math.floor(idx / 4) * 140);
    nodeMap[n.id] = { ...n, x, y };
  });

  return (
    <div className="relative w-full h-full bg-[#05070B] flex flex-col font-mono text-xs">
      {/* Top Controls & Tactical Telemetry Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#1E293B] bg-[#090D14] px-3.5 py-2 text-[10px] text-[#94A3B8]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-white font-bold">
            <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />
            3-HOP MONEY MULE TOPOLOGY (FIRESTORE)
          </span>
          <span className="text-[#38BDF8] font-bold">NODES: {nodes.length}</span>
          <span className="text-[#F59E0B] font-bold">EDGES: {edges.length}</span>
          <span className="text-[#64748B] hidden md:inline">RADAR: LAT 33.6844° N / LON 73.0479° E</span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[9.5px]">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-[#38BDF8] border border-[#38BDF8]" />
            <span>ORIGINATOR</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-[#EF4444] border border-[#EF4444] animate-pulse" />
            <span>MULE NODE</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-[#F59E0B] border border-[#F59E0B]" />
            <span>CRYPTO / ATM</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-[#10B981] border border-[#10B981]" />
            <span>INSTITUTION</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative flex-1 w-full h-[360px] md:h-[480px] bg-[#05070B] overflow-hidden">
        {/* Tactical Background Grid */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#334155 1px, transparent 1px)`,
            backgroundSize: "28px 28px"
          }}
        />

        <svg viewBox="0 0 840 440" className="w-full h-full select-none">
          <defs>
            {/* Glow Filter */}
            <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Arrow markers */}
            <marker
              id="arrow-red"
              viewBox="0 0 10 10"
              refX="19"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#EF4444" />
            </marker>
            <marker
              id="arrow-green"
              viewBox="0 0 10 10"
              refX="19"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#10B981" />
            </marker>
          </defs>

          {/* Tactical Crosshairs at Corners */}
          <text x="18" y="24" fill="#334155" fontSize="14" fontFamily="monospace">+</text>
          <text x="815" y="24" fill="#334155" fontSize="14" fontFamily="monospace">+</text>
          <text x="18" y="425" fill="#334155" fontSize="14" fontFamily="monospace">+</text>
          <text x="815" y="425" fill="#334155" fontSize="14" fontFamily="monospace">+</text>

          {/* Edges with Animated Flow Vectors */}
          {edges.map((edge, idx) => {
            const source = nodeMap[edge.source];
            const target = nodeMap[edge.target];
            if (!source || !target) return null;

            const isCleanEdge = isClean || edge.flag?.includes("INSTITUTIONAL");
            const strokeColor = isCleanEdge ? "#10B981" : "#EF4444";
            const midX = (source.x + target.x) / 2;
            const midY = (source.y + target.y) / 2 - 9;

            return (
              <g key={idx}>
                {/* Background Line */}
                <line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={strokeColor}
                  strokeWidth="2.5"
                  strokeOpacity="0.4"
                />
                {/* Flow Animated Line */}
                <line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={strokeColor}
                  strokeWidth="2"
                  className={isCleanEdge ? "" : "flow-animated"}
                  filter={isCleanEdge ? "url(#glow-green)" : "url(#glow-red)"}
                  markerEnd={isCleanEdge ? "url(#arrow-green)" : "url(#arrow-red)"}
                />
                {/* Edge Amount Badge */}
                <rect
                  x={midX - 42}
                  y={midY - 9}
                  width="84"
                  height="18"
                  fill="#05070B"
                  stroke={strokeColor}
                  strokeWidth="1.2"
                  className="opacity-95"
                />
                <text
                  x={midX}
                  y={midY + 4}
                  fill={strokeColor}
                  fontSize="9.5"
                  fontFamily="monospace"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {edge.amount}
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const isVictim = node.type === "VICTIM";
            const isMule = node.type?.includes("MULE") || node.type === "FEEDER";
            const isExit = node.type?.includes("EXIT") || node.type?.includes("CRYPTO");
            const isInst = node.type?.includes("INSTITUTION");

            let nodeColor = "#EF4444";
            if (isVictim) nodeColor = "#38BDF8";
            else if (isInst) nodeColor = "#10B981";
            else if (isExit) nodeColor = "#F59E0B";

            return (
              <g
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className="cursor-pointer group"
                transform={`translate(${node.x}, ${node.y})`}
              >
                {/* Outer Concentric Threat Pulse Rings for Mule Nodes */}
                {isMule && !isClean && (
                  <>
                    <circle
                      r="28"
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth="1.2"
                      className="animate-ping opacity-35"
                    />
                    <circle
                      r="20"
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                      className="opacity-60"
                    />
                  </>
                )}

                {/* Base Outer Ring */}
                <circle
                  r="16"
                  fill="#090D14"
                  stroke={isSelected ? "#FFFFFF" : nodeColor}
                  strokeWidth={isSelected ? "3" : "2"}
                  className="transition-all group-hover:scale-115 drop-shadow-md"
                />

                {/* Inner Node Core */}
                <circle
                  r="6.5"
                  fill={nodeColor}
                  filter={isClean ? "url(#glow-green)" : "url(#glow-red)"}
                />

                {/* Node Label Text */}
                <text
                  y="27"
                  fill="#FFFFFF"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                >
                  {node.label.length > 20 ? node.label.slice(0, 18) + "..." : node.label}
                </text>
                <text
                  y="38"
                  fill="#94A3B8"
                  fontSize="8"
                  fontFamily="monospace"
                  textAnchor="middle"
                  className="pointer-events-none font-medium"
                >
                  {node.bank || node.id}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Node Telemetry Inspector Floating Drawer */}
        {selectedNode && (
          <div className="absolute bottom-3 left-3 right-3 bg-[#090D14]/95 border border-[#EF4444] p-3 font-mono text-xs backdrop-blur-md shadow-[0_0_25px_rgba(0,0,0,0.8)] flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-[#EF4444] animate-pulse" />
                <span className="font-extrabold text-white uppercase text-sm">
                  {selectedNode.label}
                </span>
                <span className="text-[10px] bg-[#EF4444]/20 text-[#EF4444] px-1.5 py-0.2 border border-[#EF4444]/50 font-bold">
                  MULE RISK: {selectedNode.risk || 95}/100
                </span>
              </div>
              <div className="text-[11px] text-[#94A3B8] flex flex-wrap items-center gap-4">
                <span>ACCOUNT: <b className="text-white">{selectedNode.id}</b></span>
                <span>INSTITUTION: <b className="text-white">{selectedNode.bank || "N/A"}</b></span>
                <span>AGE: <b className="text-[#F59E0B]">{selectedNode.age || 4} DAYS</b></span>
                <span>KYC: <b className="text-[#38BDF8]">{selectedNode.kyc || "Tier 0"}</b></span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[11px]">
              {selectedNode.device && (
                <div className="flex items-center gap-1.5 bg-[#1F0E12] border border-[#EF4444]/50 px-2.5 py-1 text-[#EF4444]">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>SHARED FINGERPRINT: <b>{selectedNode.device}</b></span>
                </div>
              )}
              <button
                onClick={() => setSelectedNode(null)}
                className="bg-[#1E293B] hover:bg-[#334155] text-white px-3 py-1 font-bold cursor-pointer"
              >
                DISMISS
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
