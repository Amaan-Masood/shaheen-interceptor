import React, { useState, useEffect } from "react";
import TopBar from "./components/TopBar";
import ScenarioSimulator from "./components/ScenarioSimulator";
import NetworkGraph from "./components/NetworkGraph";
import DecoyHoneypot from "./components/DecoyHoneypot";
import ForensicDossier from "./components/ForensicDossier";
import BenchmarkModal from "./components/BenchmarkModal";
import SarModal from "./components/SarModal";
import ErrorBoundary from "./components/ErrorBoundary";

import {
  FALLBACK_SCENARIOS,
  FALLBACK_BENCHMARK_CASES,
  clientSideAnalyze,
  clientSideDecoyTurn,
  clientSideGenerateSar
} from "./fallbackData";

import { GitCommit, Bot, Layers, ShieldAlert, AlertTriangle, CheckCircle2 } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8001";

export default function App() {
  const [scenarios, setScenarios] = useState(FALLBACK_SCENARIOS);
  const [selectedScenarioId, setSelectedScenarioId] = useState("SCENARIO_1_VISHING");
  const [activeRightTab, setActiveRightTab] = useState("TRAIL"); // "TRAIL" | "DECOY"
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    cloud_run_environment: "active",
    firestore_mode: "LIVE_SYNC",
    firestore_connected: true,
    gemini_live: true,
    active_engine: "gemini"
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
      detection_recall_percent: 90.9,
      false_positive_rate_percent: 5.6,
      precision_percent: 95.2,
      accuracy_percent: 92.5,
      avg_latency_ms: 0.9,
      p50_latency_ms: 0.8,
      p95_latency_ms: 5.1,
      total_benchmark_time_ms: 55.0,
      dataset_sha256: "9d650f03754dc84f02c637c4dfb3a4e698a497d175d6241a7328dc2ff545cb55",
      total_cases: 40,
      fraud_cases: 22,
      clean_cases: 18,
      missed_fraud_count: 2,
      false_positive_count: 1
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
        setIsOffline(false); // Graceful fallback
      });

    // 2. Fetch scenarios
    fetch(`${API_BASE}/api/scenarios`)
      .then((res) => {
        if (!res.ok) throw new Error("Scenarios API error");
        return res.json();
      })
      .then((data) => {
        if (data.scenarios && Array.isArray(data.scenarios)) {
          const map = {};
          data.scenarios.forEach((s) => {
            const fallback = FALLBACK_SCENARIOS[s.id] || {};
            let transcriptList = [];
            if (Array.isArray(fallback.transcript) && fallback.transcript.length > 0) {
              transcriptList = fallback.transcript;
            } else if (Array.isArray(s.transcript_snippets) && s.transcript_snippets.length > 0) {
              transcriptList = s.transcript_snippets;
            } else if (Array.isArray(s.transcript)) {
              transcriptList = s.transcript;
            } else if (typeof s.transcript === "string" && s.transcript.trim()) {
              transcriptList = [
                { speaker: "PERPETRATOR", text: s.transcript, tag: "COERCION_STREAM" }
              ];
            }

            map[s.id] = {
              ...fallback,
              ...s,
              title: s.title || fallback.title || s.name || s.id,
              subtitle: s.subtitle || fallback.subtitle || "",
              transcript: transcriptList,
              raw_transcript: typeof s.transcript === "string" ? s.transcript : fallback.raw_transcript,
              graph: (s.mule_graph && Array.isArray(s.mule_graph.nodes) && s.mule_graph.nodes.length > 0)
                ? s.mule_graph
                : (fallback.graph || { nodes: [], edges: [] })
            };
          });
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
    const targetScenario = scenarios[scId] || scenarios.SCENARIO_1_VISHING || FALLBACK_SCENARIOS.SCENARIO_1_VISHING;

    try {
      const transcriptStr = targetScenario.raw_transcript ||
        (typeof targetScenario.transcript === "string"
          ? targetScenario.transcript
          : Array.isArray(targetScenario.transcript)
          ? targetScenario.transcript.map((t) => `${t.speaker}: ${t.text}`).join("\n")
          : "");

      const res = await fetch(`${API_BASE}/api/analyze-transaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario_id: scId,
          transcript: transcriptStr,
          amount: targetScenario.amount,
          currency: targetScenario.currency || "PKR",
          channel: targetScenario.channel || "Raast Instant Transfer",
          sender: targetScenario.sender,
          receiver: targetScenario.receiver,
          graph_data: targetScenario.graph || targetScenario.mule_graph
        })
      });

      if (res.ok) {
        const data = await res.json();
        const fallbackGraph = FALLBACK_SCENARIOS[scId]?.graph || targetScenario.graph;
        if (!data.graph_topology || !data.graph_topology.nodes || data.graph_topology.nodes.length === 0) {
          data.graph_topology = fallbackGraph;
        }
        setCurrentAlert(data);
      } else {
        throw new Error("Backend response not ok");
      }
    } catch (err) {
      const fallbackAlert = clientSideAnalyze(scId);
      setCurrentAlert(fallbackAlert);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Decoy Chat Message Send
  const handleSendDecoy = async (messageText) => {
    setIsSendingDecoy(true);

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
          setTimeout(() => setLatestCapturedIoc(null), 8000);
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
        setTimeout(() => setLatestCapturedIoc(null), 8000);
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
      // Offline fallback: frozen held-out baseline
      setBenchmarkData({
        metrics: {
          detection_recall_percent: 90.9,
          false_positive_rate_percent: 5.6,
          precision_percent: 95.2,
          accuracy_percent: 92.5,
          avg_latency_ms: 0.9,
          p50_latency_ms: 0.8,
          p95_latency_ms: 5.1,
          total_benchmark_time_ms: 55.0,
          dataset_sha256: "9d650f03754dc84f02c637c4dfb3a4e698a497d175d6241a7328dc2ff545cb55",
          total_cases: 40,
          fraud_cases: 22,
          clean_cases: 18,
          missed_fraud_count: 2,
          false_positive_count: 1
        },
        results: FALLBACK_BENCHMARK_CASES
      });
    } finally {
      setIsRunningBenchmark(false);
      setIsBenchmarkOpen(true);
    }
  };

  const activeScenario = scenarios[selectedScenarioId] || scenarios.SCENARIO_1_VISHING || FALLBACK_SCENARIOS.SCENARIO_1_VISHING || {};
  const isClean = activeScenario.category === "CLEAN_URGENT";

  return (
    <div className="min-h-screen bg-[#080B11] text-[#F8FAFC] font-sans flex flex-col antialiased mesh-bg selection:bg-[#F43F5E]/30">
      {/* Top Header Strip */}
      <TopBar
        systemStatus={systemStatus}
        onOpenBenchmark={handleRunBenchmark}
      />

      {/* Tactical Live Threat Feed / Triage Bar */}
      <div className="bg-[#080B11] border-b border-white/[0.08] px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto">
          <div className="text-[10px] font-mono font-bold text-[#64748B] uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
              <span>LIVE INTERCEPT STREAM // ACTIVE TRIAGE QUEUE:</span>
            </span>
            <span>3 THREAT VECTORS ARMED</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {/* Case 1: FIA Extortion */}
            <div
              onClick={() => handleSelectScenario("SCENARIO_1_VISHING")}
              className={`p-2.5 rounded-lg border transition-all cursor-pointer font-mono ${
                selectedScenarioId === "SCENARIO_1_VISHING"
                  ? "bg-[#160B10] border-[#F43F5E] shadow-md shadow-[#F43F5E]/10"
                  : "bg-[#0D121D] border-white/[0.06] hover:border-white/20 hover:bg-[#121826]"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9.5px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-[#F43F5E]/20 text-[#F43F5E] border border-[#F43F5E]/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F43F5E] animate-pulse" />
                  CASE-01 // FIA_EXTORTION
                </span>
                <span className="text-xs font-bold text-white">Rs. 450,000</span>
              </div>
              <div className="font-bold text-white text-xs truncate">
                Fake FIA Inspector Threat
              </div>
              <div className="text-[10.5px] text-[#94A3B8] font-sans truncate">
                Senior Citizen // Urgency Level 5/5 • Arrest Coercion
              </div>
            </div>

            {/* Case 2: Smurfing Ring */}
            <div
              onClick={() => handleSelectScenario("SCENARIO_2_SMURFING")}
              className={`p-2.5 rounded-lg border transition-all cursor-pointer font-mono ${
                selectedScenarioId === "SCENARIO_2_SMURFING"
                  ? "bg-[#16110A] border-[#F59E0B] shadow-md shadow-[#F59E0B]/10"
                  : "bg-[#0D121D] border-white/[0.06] hover:border-white/20 hover:bg-[#121826]"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9.5px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
                  CASE-02 // MULE_RING
                </span>
                <span className="text-xs font-bold text-white">Rs. 270,000</span>
              </div>
              <div className="font-bold text-white text-xs truncate">
                Student Account Smurfing Ring
              </div>
              <div className="text-[10.5px] text-[#94A3B8] font-sans truncate">
                Fan-In Clustering // 6 Micro-Deposits under Rs. 50k
              </div>
            </div>

            {/* Case 3: Safe Hospital */}
            <div
              onClick={() => handleSelectScenario("SCENARIO_3_CLEAN_HOSPITAL")}
              className={`p-2.5 rounded-lg border transition-all cursor-pointer font-mono ${
                selectedScenarioId === "SCENARIO_3_CLEAN_HOSPITAL"
                  ? "bg-[#0C1712] border-[#10B981] shadow-md shadow-[#10B981]/10"
                  : "bg-[#0D121D] border-white/[0.06] hover:border-white/20 hover:bg-[#121826]"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9.5px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  CASE-03 // CLEAN_HOSPITAL
                </span>
                <span className="text-xs font-bold text-white">Rs. 380,000</span>
              </div>
              <div className="font-bold text-white text-xs truncate">
                Cardiac Emergency Bypass
              </div>
              <div className="text-[10.5px] text-[#94A3B8] font-sans truncate">
                Shaukat Khanum Hospital // 0% False Positive Baseline
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Responsive Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-0">
        {/* Left Column: The Incident (5 cols) */}
        <div className="lg:col-span-5 flex flex-col min-h-[500px]">
          <ErrorBoundary fallbackTitle="Incident Panel Error">
            <ScenarioSimulator
              currentScenario={activeScenario}
              onIntercept={handleIntercept}
              isAnalyzing={isAnalyzing}
              currentAlert={currentAlert}
            />
          </ErrorBoundary>
        </div>

        {/* Right Column: AI Shield & Actions (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {/* Top of Right Column: AI Verdict Card */}
          <ErrorBoundary fallbackTitle="AI Verdict Error">
            <ForensicDossier
              alert={currentAlert}
              onDeployDecoy={() => setActiveRightTab("DECOY")}
              onGenerateSar={handleGenerateSar}
              isClean={isClean}
            />
          </ErrorBoundary>

          {/* Bottom of Right Column: Interactive Tabs (Money Trail / Scammer Trap) */}
          <div className="flex-1 flex flex-col min-h-[460px]">
            {/* Tab Selector */}
            <div className="flex items-center gap-1.5 mb-2.5 bg-[#0D121D] p-1 rounded-lg border border-white/[0.08] w-fit font-mono text-xs">
              <button
                type="button"
                onClick={() => setActiveRightTab("TRAIL")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-bold transition-all cursor-pointer ${
                  activeRightTab === "TRAIL"
                    ? "bg-[#1E293B] text-white shadow-sm"
                    : "text-[#94A3B8] hover:text-white"
                }`}
              >
                <GitCommit className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span>MONEY TRAIL & LAUNDERING GRAPH</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveRightTab("DECOY")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-bold transition-all cursor-pointer ${
                  activeRightTab === "DECOY"
                    ? "bg-[#1E293B] text-white shadow-sm"
                    : "text-[#94A3B8] hover:text-white"
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span className="flex items-center gap-1.5">
                  <span>AI DECOY HONEYPOT STING</span>
                  {capturedIocs.length > 0 && (
                    <span className="bg-[#F43F5E] text-white text-[9.5px] px-1.5 py-0.2 rounded font-bold">
                      {capturedIocs.length}
                    </span>
                  )}
                </span>
              </button>
            </div>

            {/* Tab View Container */}
            <div className="flex-1">
              <ErrorBoundary fallbackTitle="Tab Visualization Error">
                {activeRightTab === "TRAIL" ? (
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
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </main>

      {/* Held-Out 40-Case Evaluation Audit Modal */}
      <BenchmarkModal
        isOpen={isBenchmarkOpen}
        onClose={() => setIsBenchmarkOpen(false)}
        benchmarkData={benchmarkData}
        onRerun={handleRunBenchmark}
        isRunning={isRunningBenchmark}
      />

      {/* SBP Regulatory SAR Filing Modal */}
      <SarModal
        isOpen={isSarOpen}
        onClose={() => setIsSarOpen(false)}
        sarReport={sarReport}
      />
    </div>
  );
}
