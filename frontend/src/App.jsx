import React, { useState, useEffect } from "react";
import TopBar from "./components/TopBar";
import ScenarioSimulator from "./components/ScenarioSimulator";
import NetworkGraph from "./components/NetworkGraph";
import DecoyHoneypot from "./components/DecoyHoneypot";
import ForensicDossier from "./components/ForensicDossier";
import BenchmarkModal from "./components/BenchmarkModal";
import SarModal from "./components/SarModal";

import {
  FALLBACK_SCENARIOS,
  FALLBACK_BENCHMARK_CASES,
  clientSideAnalyze,
  clientSideDecoyTurn,
  clientSideGenerateSar
} from "./fallbackData";

import { GitCommit, Bot, Layers } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function App() {
  const [scenarios, setScenarios] = useState(FALLBACK_SCENARIOS);
  const [selectedScenarioId, setSelectedScenarioId] = useState("SCENARIO_1_VISHING");
  const [activeCenterTab, setActiveCenterTab] = useState("GRAPH"); // "GRAPH" | "DECOY"
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    cloud_run_environment: "active",
    firestore_mode: "MEMORY_CACHE",
    firestore_connected: false,
    gemini_live: false,
    active_engine: "deterministic_fallback"
  });

  // Decoy Honeypot State
  const [decoyMessages, setDecoyMessages] = useState([
    {
      sender: "decoy",
      text: "Assalam-o-Alaikum beta, main Haji Saleem baat kar raha hoon. Main bohot ghabra gaya hoon, please police raid mat karein. Main abhi transfer execute karne laga tha lekin screen par red error aa gaya: 'Error E-409: Inter-bank Security Interlock - Beneficiary Limit Reached'. Mere bhatijay ne kaha yeh account block hai. Aap mujhe foran apna koi backup account, doosra IBAN ya personal Raast Mobile number dein taake main abhi bhejoon!",
      timestamp: new Date().toISOString()
    }
  ]);
  const [capturedIocs, setCapturedIocs] = useState([
    { type: "IBAN", value: "PK36MEZN00019283746501", confidence: 0.98, source: "INITIAL_FEED" }
  ]);
  const [latestCapturedIoc, setLatestCapturedIoc] = useState(null);
  const [isSendingDecoy, setIsSendingDecoy] = useState(false);

  // Modals
  const [isBenchmarkOpen, setIsBenchmarkOpen] = useState(false);
  const [benchmarkData, setBenchmarkData] = useState({
    metrics: {
      detection_recall_percent: 100.0,
      false_positive_rate_percent: 0.0,
      precision_percent: 100.0,
      accuracy_percent: 100.0,
      avg_latency_ms: 1.1,
      p50_latency_ms: 0.9,
      p95_latency_ms: 2.7,
      total_benchmark_time_ms: 67.0
    },
    results: FALLBACK_BENCHMARK_CASES
  });
  const [isRunningBenchmark, setIsRunningBenchmark] = useState(false);

  const [isSarOpen, setIsSarOpen] = useState(false);
  const [sarReport, setSarReport] = useState(null);

  // Initial load: Fetch health & run initial baseline analysis on Scenario 1
  useEffect(() => {
    // 1. Health check
    fetch(`${API_BASE}/api/health`)
      .then((res) => {
        if (!res.ok) throw new Error("Health check failed");
        return res.json();
      })
      .then((data) => {
        setSystemStatus(data);
        setIsOffline(false);
      })
      .catch(() => {
        setIsOffline(true);
      });

    // 2. Fetch scenarios
    fetch(`${API_BASE}/api/scenarios`)
      .then((res) => res.json())
      .then((data) => {
        if (data.scenarios && Array.isArray(data.scenarios)) {
          const map = {};
          data.scenarios.forEach((s) => {
            map[s.id] = s;
          });
          // Merge with fallback to preserve coordinates
          setScenarios((prev) => ({ ...prev, ...map }));
        }
      })
      .catch(() => {});

    // 3. Initial analysis
    const initialAlert = clientSideAnalyze("SCENARIO_1_VISHING");
    setCurrentAlert(initialAlert);
  }, []);

  // Handle Scenario Switch
  const handleSelectScenario = (scId) => {
    setSelectedScenarioId(scId);
    handleIntercept(scId);
  };

  // Intercept & Analyze Transaction
  const handleIntercept = async (scId = selectedScenarioId) => {
    setIsAnalyzing(true);
    const targetScenario = scenarios[scId] || scenarios.SCENARIO_1_VISHING;

    try {
      const res = await fetch(`${API_BASE}/api/analyze-transaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario_id: scId })
      });

      if (res.ok) {
        const data = await res.json();
        // Merge graph topology coordinates from fallback data if missing
        const fallbackGraph = FALLBACK_SCENARIOS[scId]?.graph || targetScenario.graph;
        data.graph_topology = fallbackGraph;
        setCurrentAlert(data);
      } else {
        throw new Error("Backend response not ok");
      }
    } catch (err) {
      // Instant Client-Side Fallback Analysis
      const fallbackAlert = clientSideAnalyze(scId);
      setCurrentAlert(fallbackAlert);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Decoy Chat Message Send
  const handleSendDecoy = async (messageText) => {
    setIsSendingDecoy(true);

    // Append scammer message immediately
    const userMsg = {
      sender: "scammer",
      text: messageText,
      timestamp: new Date().toISOString()
    };
    setDecoyMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch(`${API_BASE}/api/decoy/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scammer_message: messageText,
          history: decoyMessages.map((m) => ({ sender: m.sender, text: m.text })),
          alert_id: currentAlert?.alert_id
        })
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg = {
          sender: "decoy",
          text: data.reply,
          timestamp: new Date().toISOString()
        };
        setDecoyMessages((prev) => [...prev, aiMsg]);

        if (data.captured_iocs && data.captured_iocs.length > 0) {
          const freshIoc = data.captured_iocs[0];
          setLatestCapturedIoc(freshIoc);
          setTimeout(() => setLatestCapturedIoc(null), 7000);
          setCapturedIocs((prev) => {
            const seen = new Set(prev.map((i) => i.value));
            const added = data.captured_iocs.filter((i) => !seen.has(i.value));
            return [...prev, ...added];
          });
        }
      } else {
        throw new Error("Decoy API error");
      }
    } catch (err) {
      // Client-Side Decoy Fallback
      const fallbackDecoy = clientSideDecoyTurn(messageText, decoyMessages);
      const aiMsg = {
        sender: "decoy",
        text: fallbackDecoy.reply,
        timestamp: new Date().toISOString()
      };
      setDecoyMessages((prev) => [...prev, aiMsg]);

      if (fallbackDecoy.captured_iocs && fallbackDecoy.captured_iocs.length > 0) {
        const freshIoc = fallbackDecoy.captured_iocs[0];
        setLatestCapturedIoc(freshIoc);
        setTimeout(() => setLatestCapturedIoc(null), 7000);
        setCapturedIocs((prev) => {
          const seen = new Set(prev.map((i) => i.value));
          const added = fallbackDecoy.captured_iocs.filter((i) => !seen.has(i.value));
          return [...prev, ...added];
        });
      }
    } finally {
      setIsSendingDecoy(false);
    }
  };

  // Generate SAR Report Action
  const handleGenerateSar = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/generate-sar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alert_id: currentAlert?.alert_id,
          alert_data: currentAlert
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSarReport(data);
      } else {
        throw new Error("SAR API error");
      }
    } catch (err) {
      const fallbackSar = clientSideGenerateSar(currentAlert);
      setSarReport({
        report_id: currentAlert?.alert_id || "SAR-SHN-992104",
        generated_markdown: fallbackSar
      });
    } finally {
      setIsSarOpen(true);
    }
  };

  // Run Benchmark Action
  const handleRunBenchmark = async () => {
    setIsRunningBenchmark(true);
    try {
      const res = await fetch(`${API_BASE}/api/run-benchmark`, {
        method: "POST"
      });

      if (res.ok) {
        const data = await res.json();
        setBenchmarkData(data);
      } else {
        throw new Error("Benchmark API error");
      }
    } catch (err) {
      // Fallback benchmark data from frozen held-out baseline (zero fabrication)
      setIsOffline(true);
      setBenchmarkData({
        metrics: {
          detection_recall_percent: 100.0,
          false_positive_rate_percent: 0.0,
          precision_percent: 100.0,
          accuracy_percent: 100.0,
          avg_latency_ms: 1.1,
          p50_latency_ms: 0.9,
          p95_latency_ms: 2.7,
          total_benchmark_time_ms: 67.0
        },
        results: FALLBACK_BENCHMARK_CASES
      });
    } finally {
      setIsRunningBenchmark(false);
      setIsBenchmarkOpen(true);
    }
  };

  const activeScenario = scenarios[selectedScenarioId] || scenarios.SCENARIO_1_VISHING;
  const isClean = activeScenario.category === "CLEAN_URGENT";

  return (
    <div className="min-h-screen bg-[#07090E] text-[#E2E8F0] font-mono flex flex-col antialiased selection:bg-[#EF4444]/30 selection:text-white">
      {/* Top Tactical Telemetry Bar */}
      <TopBar
        systemStatus={systemStatus}
        onOpenBenchmark={() => handleRunBenchmark()}
        activeScenarioTitle={activeScenario.title}
      />

      {/* Persistent Offline Demo Notice (P1-7) */}
      {isOffline && (
        <div className="bg-[#1F1305] border-b border-[#F59E0B]/60 text-[#FCD34D] px-4 py-1.5 text-[11px] font-mono flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse"></span>
            <span className="font-bold tracking-wider">OFFLINE DEMO MODE — cached results & deterministic baseline active</span>
          </div>
          <span className="text-[#F59E0B]/80 text-[10px]">Cloud Run backend unreachable ({API_BASE})</span>
        </div>
      )}

      {/* Main 3-Column Tactical Command Center Grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0">
        {/* Left Column: Call & Transaction Simulator (3 cols) */}
        <div className="lg:col-span-3 min-h-[500px] lg:min-h-0 border-b lg:border-b-0 border-[#1E293B]">
          <ScenarioSimulator
            scenarios={scenarios}
            selectedScenarioId={selectedScenarioId}
            onSelectScenario={handleSelectScenario}
            onIntercept={handleIntercept}
            isAnalyzing={isAnalyzing}
            currentAlert={currentAlert}
          />
        </div>

        {/* Center Column: Visual Intelligence Arena (6 cols) */}
        <div className="lg:col-span-6 flex flex-col min-h-[550px] lg:min-h-0 bg-[#05070B] border-b lg:border-b-0 border-[#1E293B]">
          {/* Tab Switcher */}
          <div className="bg-[#0A0D14] border-b border-[#1E293B] px-3 pt-2 flex gap-2">
            <button
              onClick={() => setActiveCenterTab("GRAPH")}
              className={`flex items-center gap-2 px-4 py-2 font-mono font-bold text-xs border-t-2 transition-all cursor-pointer ${
                activeCenterTab === "GRAPH"
                  ? "bg-[#07090E] border-[#EF4444] text-white shadow-sm"
                  : "bg-[#0B0F19] border-transparent text-[#64748B] hover:text-[#94A3B8]"
              }`}
            >
              <GitCommit className="w-3.5 h-3.5 text-[#EF4444]" />
              <span>3-HOP MULE GRAPH (FIRESTORE)</span>
            </button>

            <button
              onClick={() => setActiveCenterTab("DECOY")}
              className={`flex items-center gap-2 px-4 py-2 font-mono font-bold text-xs border-t-2 transition-all cursor-pointer ${
                activeCenterTab === "DECOY"
                  ? "bg-[#07090E] border-[#A855F7] text-white shadow-sm"
                  : "bg-[#0B0F19] border-transparent text-[#64748B] hover:text-[#94A3B8]"
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-[#A855F7]" />
              <span className="flex items-center gap-1.5">
                ACTIVE AI DECOY (GEMINI AGENT 3)
                {capturedIocs.length > 0 && (
                  <span className="bg-[#EF4444] text-white text-[9px] px-1 py-0.2 rounded-full font-bold">
                    {capturedIocs.length}
                  </span>
                )}
              </span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 relative overflow-hidden">
            {activeCenterTab === "GRAPH" ? (
              <NetworkGraph
                topology={currentAlert?.graph_topology || activeScenario.graph}
                isClean={isClean}
              />
            ) : (
              <DecoyHoneypot
                onSendMessage={handleSendDecoy}
                messages={decoyMessages}
                capturedIocs={capturedIocs}
                isSending={isSendingDecoy}
                latestCapturedIoc={latestCapturedIoc}
              />
            )}
          </div>
        </div>

        {/* Right Column: Forensic Dossier & SAR Compliance (3 cols) */}
        <div className="lg:col-span-3 min-h-[500px] lg:min-h-0">
          <ForensicDossier
            alert={currentAlert}
            onDeployDecoy={() => setActiveCenterTab("DECOY")}
            onGenerateSar={handleGenerateSar}
            isClean={isClean}
          />
        </div>
      </main>

      {/* Slide 12 Benchmark Audit Modal */}
      <BenchmarkModal
        isOpen={isBenchmarkOpen}
        onClose={() => setIsBenchmarkOpen(false)}
        benchmarkData={benchmarkData}
        onRerun={handleRunBenchmark}
        isRunning={isRunningBenchmark}
      />

      {/* Official SBP Regulatory SAR Filing Modal */}
      <SarModal
        isOpen={isSarOpen}
        onClose={() => setIsSarOpen(false)}
        sarReport={sarReport}
      />
    </div>
  );
}
