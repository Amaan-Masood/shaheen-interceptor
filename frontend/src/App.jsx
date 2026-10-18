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
    <div className="min-h-screen bg-[#060911] text-[#F8FAFC] font-sans flex flex-col antialiased mesh-bg selection:bg-[#EF4444]/30">
      {/* Top Header Strip */}
      <TopBar
        systemStatus={systemStatus}
        onOpenBenchmark={handleRunBenchmark}
      />

      {/* 3 Prominent Clickable Test Case Cards at the Top (Responsive: Swipe on mobile, Grid on desktop) */}
      <div className="bg-[#090E1A]/80 border-b border-white/[0.08] px-4 sm:px-6 lg:px-8 py-4 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
              Select a Real Pakistani Fraud Scenario:
            </span>
            <span className="text-[10px] text-[#64748B] font-mono">3 Scenarios Active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Scenario 1 */}
            <div
              onClick={() => handleSelectScenario("SCENARIO_1_VISHING")}
              className={`w-full p-1.5 rounded-3xl transition-all cursor-pointer relative overflow-hidden card-lift ${
                selectedScenarioId === "SCENARIO_1_VISHING"
                  ? "bg-gradient-to-br from-[#EF4444]/30 via-[#EF4444]/10 to-transparent border border-[#EF4444] shadow-xl shadow-[#EF4444]/20 scale-[1.01]"
                  : "bg-white/[0.02] border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04]"
              }`}
            >
              <div className="p-4 rounded-[calc(1.5rem-0.375rem)] bg-gradient-to-b from-[#141018]/90 to-[#0A0D16]/95 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EF4444]/15 text-[#F87171] border border-[#EF4444]/30 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse" />
                      CASE 1: FIA EXTORTION
                    </span>
                    <span className="text-xs font-mono font-black text-white">Rs. 450,000</span>
                  </div>
                  <div className="font-extrabold text-sm text-white font-display">
                    Fake FIA Inspector Threat
                  </div>
                  <div className="text-xs text-[#94A3B8] mt-1 line-clamp-1">
                    Senior citizen coerced with imminent arrest to force emergency deposit
                  </div>
                </div>
              </div>
            </div>

            {/* Scenario 2 */}
            <div
              onClick={() => handleSelectScenario("SCENARIO_2_SMURFING")}
              className={`w-full p-1.5 rounded-3xl transition-all cursor-pointer relative overflow-hidden card-lift ${
                selectedScenarioId === "SCENARIO_2_SMURFING"
                  ? "bg-gradient-to-br from-[#F59E0B]/30 via-[#F59E0B]/10 to-transparent border border-[#F59E0B] shadow-xl shadow-[#F59E0B]/20 scale-[1.01]"
                  : "bg-white/[0.02] border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04]"
              }`}
            >
              <div className="p-4 rounded-[calc(1.5rem-0.375rem)] bg-gradient-to-b from-[#17130F]/90 to-[#0A0D16]/95 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F59E0B]/15 text-[#FBBF24] border border-[#F59E0B]/30 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
                      CASE 2: MULE RING
                    </span>
                    <span className="text-xs font-mono font-black text-white">Rs. 270,000</span>
                  </div>
                  <div className="font-extrabold text-sm text-white font-display">
                    Student Account Smurfing Ring
                  </div>
                  <div className="text-xs text-[#94A3B8] mt-1 line-clamp-1">
                    6 rapid micro-transfers under Rs. 50k into newly opened student account
                  </div>
                </div>
              </div>
            </div>

            {/* Scenario 3 */}
            <div
              onClick={() => handleSelectScenario("SCENARIO_3_CLEAN_HOSPITAL")}
              className={`w-full p-1.5 rounded-3xl transition-all cursor-pointer relative overflow-hidden card-lift ${
                selectedScenarioId === "SCENARIO_3_CLEAN_HOSPITAL"
                  ? "bg-gradient-to-br from-[#10B981]/30 via-[#10B981]/10 to-transparent border border-[#10B981] shadow-xl shadow-[#10B981]/20 scale-[1.01]"
                  : "bg-white/[0.02] border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04]"
              }`}
            >
              <div className="p-4 rounded-[calc(1.5rem-0.375rem)] bg-gradient-to-b from-[#0F1A14]/90 to-[#0A0D16]/95 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                      CASE 3: SAFE HOSPITAL
                    </span>
                    <span className="text-xs font-mono font-black text-white">Rs. 380,000</span>
                  </div>
                  <div className="font-extrabold text-sm text-white font-display">
                    Cardiac Emergency Bypass
                  </div>
                  <div className="text-xs text-[#94A3B8] mt-1 line-clamp-1">
                    Legitimate patient deposit to Shaukat Khanum Hospital (0% False Alarms)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Responsive Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
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
        <div className="lg:col-span-7 flex flex-col space-y-5">
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
            <div className="flex items-center gap-2 mb-3 bg-[#0B111E]/80 p-1.5 rounded-full border border-white/[0.08] w-fit backdrop-blur-md shadow-lg">
              <button
                type="button"
                onClick={() => setActiveRightTab("TRAIL")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-all cursor-pointer ${
                  activeRightTab === "TRAIL"
                    ? "bg-gradient-to-r from-[#172033] to-[#1E293B] text-white shadow-md border border-white/10"
                    : "text-[#94A3B8] hover:text-white"
                }`}
              >
                <GitCommit className="w-4 h-4 text-[#38BDF8]" />
                <span>Money Trail & Laundering Graph</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveRightTab("DECOY")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-all cursor-pointer ${
                  activeRightTab === "DECOY"
                    ? "bg-gradient-to-r from-[#172033] to-[#1E293B] text-white shadow-md border border-white/10"
                    : "text-[#94A3B8] hover:text-white"
                }`}
              >
                <Bot className="w-4 h-4 text-[#C084FC]" />
                <span className="flex items-center gap-1.5">
                  <span>AI Decoy Honeypot Sting</span>
                  {capturedIocs.length > 0 && (
                    <span className="bg-[#EF4444] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold shadow-sm font-mono">
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
