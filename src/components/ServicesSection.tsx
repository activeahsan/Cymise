import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FadeIn } from "./ui/FadeIn";
import { 
  Laptop, Gauge, Zap, Sparkles, MapPin, Search, TrendingUp, CheckCircle,
  Cpu, MessageSquare, Clock, Send, Palette, Layers, Sparkle, Eye,
  Sliders, ArrowRight, ShieldCheck, RefreshCw, BarChart3, AlertCircle
} from "lucide-react";

// Types and Configs
interface Service {
  num: string;
  title: string;
  shortDesc: string;
  accent: string; // Tailwind gradient text / border keywords
  glowColor: string; // Hex glow color
}

const SERVICES: Service[] = [
  {
    num: "01",
    title: "Web Design",
    shortDesc: "We build modern, lightning-fast websites that load instantly and look premium — permanently fixing your leaky bucket.",
    accent: "from-[#00E5FF] to-[#3B82F6]",
    glowColor: "rgba(0, 229, 255, 0.15)",
  },
  {
    num: "02",
    title: "Local SEO",
    shortDesc: "Command search rankings in your specific area. We turn ghost town traffic into a steady stream of qualified local leads.",
    accent: "from-[#3B82F6] to-[#7B61FF]",
    glowColor: "rgba(123, 97, 255, 0.15)",
  },
  {
    num: "03",
    title: "System Automation",
    shortDesc: "Streamline your customer intake and lead generation. We build digital infrastructures that work for you 24/7.",
    accent: "from-[#7B61FF] to-[#00E5FF]",
    glowColor: "rgba(123, 97, 255, 0.15)",
  },
  {
    num: "04",
    title: "Brand Identity",
    shortDesc: "Matching your online presence to your real-world expertise. Stop looking like an amateur and start building absolute local authority.",
    accent: "from-[#00E5FF] via-[#3B82F6] to-[#7B61FF]",
    glowColor: "rgba(0, 229, 255, 0.15)",
  },
  {
    num: "05",
    title: "Conversion Optimization",
    shortDesc: "Data-driven enhancements to user flows and calls-to-action, ensuring every visitor has a frictionless path to choosing you.",
    accent: "from-[#7B61FF] via-[#3B82F6] to-[#00E5FF]",
    glowColor: "rgba(123, 97, 255, 0.15)",
  },
];

// Lifted and static-memoized header to avoid any re-rendering when interactive states are updated
const StaticHeader = React.memo(() => {
  return (
    <div className="mb-16 sm:mb-20 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
      <div className="max-w-3xl">
        <FadeIn delay={0}>
          <span className="text-[#7B61FF] font-mono text-sm tracking-widest uppercase mb-3 block">Digital Core</span>
          <h2 className="text-[#D7E2EA] font-display font-black uppercase text-[clamp(2.5rem,5.5vw,75px)] leading-[0.95] tracking-tight mb-6">
            Cymise builds digital systems that help local businesses win
          </h2>
          <p className="text-[#D7E2EA]/60 font-light text-lg sm:text-xl leading-relaxed max-w-2xl">
            We combine premium design, local listings optimization, and automatic sales-funnel pipelines to secure the local growth you deserve.
          </p>
          <div className="mt-5 flex items-center gap-2.5 text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold select-none">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <span>Select a service below to explore the growth sandbox</span>
          </div>
        </FadeIn>
      </div>
      
      <div className="hidden lg:block">
        <FadeIn delay={0.2} x={40}>
          <div className="flex gap-2 bg-[#121212] border border-[#222] p-1.5 rounded-full items-center">
            <span className="text-xs font-mono text-white/50 px-4">Interactive Sandbox Console</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse mr-2" />
          </div>
        </FadeIn>
      </div>
    </div>
  );
});

StaticHeader.displayName = "StaticHeader";

export function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const handleTabClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    setActiveIndex(index);
  };

  // States for individual interactive sandboxes:
  // 1. Web Design state - set default metric to elite cymise load speed 1.2s instead of 0.2s
  const [speedVal, setSpeedVal] = useState<number>(1.2); 
  
  // Helper mappings for Web Design realistic scale interpolations
  // 1.2s is the absolute best (pct = 1.0), 4.8s is standard template / slowest (pct = 0.0)
  const speedPct = Math.max(0, Math.min(1, (4.8 - speedVal) / (4.8 - 1.2)));
  const lighthouseScore = Math.round(40 + speedPct * 58); // range 40 to 98
  const bounceRate = Math.round(72 - speedPct * 54);      // range 72% down to 18%

  // Metric color helpers
  const lighthouseColorClass = lighthouseScore >= 90 ? "text-emerald-400" : lighthouseScore >= 65 ? "text-amber-400" : "text-red-500";
  const bounceColorClass = bounceRate <= 30 ? "text-emerald-400" : bounceRate <= 50 ? "text-amber-400" : "text-red-500";
  
  let conversionText = "Critical ⚠️";
  let conversionColorClass = "text-red-500";
  if (speedVal <= 1.8) {
    conversionText = "Elite ⚡";
    conversionColorClass = "text-[#7B61FF]";
  } else if (speedVal <= 3.2) {
    conversionText = "Stable";
    conversionColorClass = "text-amber-400";
  }

  // 2. Local SEO state
  const [seoCategory, setSeoCategory] = useState<string>("plumbing");
  const [rankings, setRankings] = useState<Array<{ name: string; score: string; reviews: number; isCymise?: boolean }>>([]);
  
  // 3. System Automation State
  const [pipelineState, setPipelineState] = useState<"idle" | "triggered" | "qualifying" | "notifying" | "booked" | "complete">("idle");
  const [pipelineStep, setPipelineStep] = useState<number>(0);

  // 4. Brand Identity State
  const [brandPreset, setBrandPreset] = useState<"nordic" | "neon" | "sunset">("nordic");

  // 5. Conversion Optimization State
  const [splitView, setSplitView] = useState<"original" | "optimized">("optimized");

  // SEO ranking simulator updates: Hardcode the Cymise Powered asset to ALWAYS occupy definitive #1 top spot!
  useEffect(() => {
    const list = [
      {
        name: `Elite ${seoCategory.charAt(0).toUpperCase() + seoCategory.slice(1)} Services`,
        score: "5.0 ⭐⭐⭐⭐⭐",
        reviews: 214,
        isCymise: true,
      },
      {
        name: `${seoCategory.charAt(0).toUpperCase() + seoCategory.slice(1)} Pro Team (Competitor A)`,
        score: "4.1 ⭐",
        reviews: 14,
      },
      {
        name: `Budget ${seoCategory.charAt(0).toUpperCase() + seoCategory.slice(1)} Group`,
        score: "3.8 ⭐",
        reviews: 29,
      },
    ];
    setRankings(list);
  }, [seoCategory]);

  // Handle pipeline simulation: Fix the sequential timing chains by mapping clean sequential state dependencies
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (pipelineState === "triggered") {
      setPipelineStep(1);
      timer = setTimeout(() => {
        setPipelineState("qualifying");
      }, 1500);
    } else if (pipelineState === "qualifying") {
      setPipelineStep(2);
      timer = setTimeout(() => {
        setPipelineState("notifying");
      }, 1500);
    } else if (pipelineState === "notifying") {
      setPipelineStep(3);
      timer = setTimeout(() => {
        setPipelineState("booked");
      }, 1500);
    } else if (pipelineState === "booked") {
      setPipelineStep(4);
      timer = setTimeout(() => {
        setPipelineState("complete");
      }, 1500);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [pipelineState]);

  const triggerPipeline = () => {
    setPipelineState("triggered");
    setPipelineStep(0);
  };

  const sandboxNode = (
<div className="relative border border-[#2E313D] rounded-3xl bg-[#08080A] shadow-2xl overflow-hidden min-h-[480px] sm:min-h-[520px] md:min-h-[580px] flex flex-col">
              
              {/* Console Top bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A1C23] bg-[#0A0B0E]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FC5F57]" />
                  <div className="w-3 h-3 rounded-full bg-[#FDBC2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                  <span className="ml-3 font-mono text-xs text-white/40 select-none">cymise_systems_console</span>
                </div>
                
                <span className="font-mono text-[10px] text-[#7B61FF] px-2.5 py-1 bg-[#7B61FF]/10 rounded-full border border-[#7B61FF]/25">
                  SYSTEM ACTIVE
                </span>
              </div>

              {/* Sandbox Panel Canvas area with hardware acceleration */}
              <div className="p-6 md:p-8 flex-grow flex flex-col justify-center relative transform-gpu">
                
                <AnimatePresence mode="wait">
                  
                  {/* SANDBOX 01: WEB DESIGN */}
                  {activeIndex === 0 && (
                    <motion.div
                      key="webdesign"
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -15 }}
                      transition={{ duration: 0.35 }}
                      className="w-full h-full flex flex-col gap-6 transform-gpu"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-[#7B61FF] font-mono text-xs uppercase mb-1">
                          <Laptop className="w-4 h-4" />
                          <span>Speed Performance Sandbox</span>
                        </div>
                        <h4 className="text-xl font-display font-semibold uppercase tracking-wide">
                          Fixing the Load Speed Leak
                        </h4>
                      </div>

                      {/* Laptop Frame */}
                      <div className="bg-[#12141C] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-inner">
                        <div className="flex justify-between items-center bg-[#07080B] rounded-lg px-4 py-2 text-xs font-mono text-white/50 border border-white/5">
                          <span>🌐 local-service-plumber.com</span>
                          <span className={`transition-all duration-300 ${speedVal <= 1.8 ? "text-[#7B61FF]" : "text-amber-500"}`}>
                            Loaded in: {speedVal.toFixed(1)}s
                          </span>
                        </div>

                        {/* Interactive Speed Index Slider */}
                        <div className="space-y-4">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-white/40">Drag to change loading times:</span>
                            <span className="font-bold text-white uppercase bg-white/5 px-2 py-0.5 rounded transition-all duration-200">
                              {speedVal === 1.2 ? "Cymise Architecture (1.2s)" : `${speedVal.toFixed(1)}s (${speedVal === 4.8 ? "Competitor Stack" : "Alternative Site"})`}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <Gauge className="w-5 h-5 text-white/40" />
                            <input 
                              type="range"
                              min="1.2"
                              max="4.8"
                              step="0.1"
                              value={speedVal}
                              onChange={(e) => setSpeedVal(parseFloat(e.target.value))}
                              className="flex-grow accent-[#7B61FF] h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                            />
                            <Zap className="w-5 h-5 text-[#7B61FF] animate-pulse" />
                          </div>
                        </div>

                        {/* Lighthouse Performance Score card */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                          
                          {/* Circle Gauge Metrics */}
                          <div className="bg-[#090A0D] p-3 rounded-xl border border-white/5 flex flex-col items-center">
                            <span className="text-[10px] text-white/30 uppercase tracking-widest font-mono">Lighthouse Score</span>
                            <div className={`mt-2 text-2xl font-bold font-mono transition-colors duration-300 ${lighthouseColorClass}`}>
                              {lighthouseScore}
                            </div>
                          </div>

                          <div className="bg-[#090A0D] p-3 rounded-xl border border-white/5 flex flex-col items-center">
                            <span className="text-[10px] text-white/30 uppercase tracking-widest font-mono">Bounce Rate</span>
                            <div className={`mt-2 text-2xl font-bold font-mono flex items-baseline gap-1 transition-colors duration-300 ${bounceColorClass}`}>
                              {bounceRate}%
                            </div>
                          </div>

                          <div className="col-span-2 md:col-span-1 bg-[#090A0D] p-3 rounded-xl border border-white/5 flex flex-col items-center justify-center">
                            <span className="text-[10px] text-white/30 uppercase tracking-widest font-mono">Conversion Index</span>
                            <div className="mt-1 font-mono text-center">
                              <span className={`text-xl font-bold transition-colors duration-300 ${conversionColorClass}`}>
                                {conversionText}
                              </span>
                            </div>
                          </div>

                        </div>

                      </div>

                      {/* Strategic Copy Highlight explaining simulation */}
                      <p className="text-xs font-mono text-white/40 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-[#7B61FF] shrink-0 mt-0.5" />
                        <span>
                          <strong>Conversion Proof:</strong> Every 0.1s added of load lag increases mobile customer drop-offs by 7%. With a 1.2s core optimized build, Cymise eliminates bounce triggers instantly to maximize lead intakes.
                        </span>
                      </p>
                    </motion.div>
                  )}


                  {/* SANDBOX 02: LOCAL SEO */}
                  {activeIndex === 1 && (
                    <motion.div
                      key="localseo"
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -15 }}
                      transition={{ duration: 0.35 }}
                      className="w-full h-full flex flex-col gap-6 transform-gpu"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-blue-400 font-mono text-xs uppercase mb-1">
                          <MapPin className="w-4 h-4" />
                          <span>Google Local Pack Simulator</span>
                        </div>
                        <h4 className="text-xl font-display font-semibold uppercase tracking-wide">
                          Dominating Area-Dominant Intent
                        </h4>
                      </div>

                      {/* Interactive Category Selector Tabs */}
                      <div className="flex gap-2 p-1 bg-white/[0.03] border border-white/5 rounded-xl self-start">
                        {["plumbing", "roofing", "hvac"].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setSeoCategory(cat)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200 ${
                              seoCategory === cat 
                                ? "bg-blue-600 text-white font-semibold" 
                                : "text-white/40 hover:text-white"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      {/* Local Search Mockup UI */}
                      <div className="bg-[#12141C] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-inner">
                        <div className="flex gap-2 items-center bg-[#07080B] border border-white/5 rounded-lg px-4 py-2.5 text-xs font-mono text-white/70">
                          <Search className="w-3.5 h-3.5 text-blue-400" />
                          <span>{seoCategory} services near me...</span>
                        </div>

                        {/* Results Simulation - Hardcoded Cymise Powered is always definitive #1 top spot */}
                        <div className="flex flex-col gap-2.5">
                          {rankings.map((rank, idx) => (
                            <div 
                              key={idx}
                              className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all duration-300 ${
                                rank.isCymise 
                                  ? "bg-gradient-to-r from-blue-950/40 via-blue-900/10 to-transparent border-blue-500/40 shadow-lg shadow-blue-500/5 scale-[1.01]" 
                                  : "bg-[#090A0D] border-white/5 opacity-40 hover:opacity-60"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                                  rank.isCymise ? "bg-blue-500 text-white" : "bg-white/10 text-white/50"
                                }`}>
                                  {rank.isCymise ? "#1" : idx === 1 ? "#2" : "#3"}
                                </div>
                                <div className="space-y-0.5">
                                  <h5 className={`font-semibold text-sm ${rank.isCymise ? "text-white" : "text-white/80"}`}>
                                    {rank.name}
                                  </h5>
                                  <div className="flex items-center gap-2 text-xs text-white/40">
                                    <span className="text-amber-400">{rank.score}</span>
                                    <span>•</span>
                                    <span>({rank.reviews} reviews)</span>
                                  </div>
                                </div>
                              </div>

                              {rank.isCymise && (
                                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider bg-blue-500/15 border border-blue-500/30 text-blue-400 px-2.5 py-1 rounded">
                                  CYMISE POWERED 🚀
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <p className="text-xs font-mono text-white/40 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5 flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <span>
                          <strong>SEO Strategy:</strong> We map target nodes specific to high-intent local services. Securing slot #1 on Google Local Pack drives over 65% of local service clicks, pushing competitors deep and driving callers straight to you.
                        </span>
                      </p>
                    </motion.div>
                  )}


                  {/* SANDBOX 03: SYSTEM AUTOMATION */}
                  {activeIndex === 2 && (
                    <motion.div
                      key="automation"
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -15 }}
                      transition={{ duration: 0.35 }}
                      className="w-full h-full flex flex-col gap-6 transform-gpu"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs uppercase mb-1">
                          <Cpu className="w-4 h-4" />
                          <span>Lead Engine Automation Simulator</span>
                        </div>
                        <h4 className="text-xl font-display font-semibold uppercase tracking-wide">
                          Building a 24/7 Digital Intake
                        </h4>
                      </div>

                      {/* Interactive Automation Trigger Button */}
                      <button
                        onClick={triggerPipeline}
                        disabled={pipelineState !== "idle" && pipelineState !== "complete"}
                        className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-950 disabled:text-indigo-400/45 text-white font-mono font-semibold uppercase text-xs tracking-wider px-4 py-2.5 rounded-xl border border-indigo-500/30 transition-all self-start flex items-center gap-2 transform-gpu hover:scale-105 active:scale-95 duration-150 cursor-pointer"
                      >
                        {pipelineState === "idle" || pipelineState === "complete" ? (
                          <>
                            <Zap className="w-4 h-4 animate-bounce" />
                            <span>Simulate Incoming Lead</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Simulation Running...</span>
                          </>
                        )}
                      </button>

                      {/* Pipeline Node Layout */}
                      <div className="bg-[#12141C] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-inner relative overflow-hidden">
                        
                        {/* Simulation Screen Overlay Logs */}
                        <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-white/5">
                          <span className="text-white/40">Real-time Lead Progression:</span>
                          <span className="text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-500/10">
                            {pipelineState.toUpperCase()}
                          </span>
                        </div>

                        {/* Node Flow Visual grid representing form filed, ai qualifier, instant SMS auto-sent, CRM site sync */}
                        <div className="grid grid-cols-2 gap-3.5 relative">
                          
                          {/* Step 1 Node */}
                          <div className={`p-3.5 rounded-xl border transition-all duration-300 ${
                            pipelineStep >= 1 ? "bg-indigo-950/25 border-indigo-500 text-white" : "bg-[#090A0D] border-white/5 text-white/30"
                          }`}>
                            <div className="flex items-center gap-2.5 mb-1">
                              <MessageSquare className="w-4 h-4 text-indigo-400" />
                              <span className="font-semibold text-xs uppercase tracking-wider">Form Filed</span>
                            </div>
                            <p className="text-[11px] leading-relaxed opacity-60">Customer fills out project request on website.</p>
                          </div>

                          {/* Step 2 Node */}
                          <div className={`p-3.5 rounded-xl border transition-all duration-300 ${
                            pipelineStep >= 2 ? "bg-indigo-950/25 border-indigo-500 text-white" : "bg-[#090A0D] border-white/5 text-white/30"
                          }`}>
                            <div className="flex items-center gap-2.5 mb-1">
                              <Cpu className="w-4 h-4 text-indigo-400" />
                              <span className="font-semibold text-xs uppercase tracking-wider">AI Qualifier</span>
                            </div>
                            <p className="text-[11px] leading-relaxed opacity-60">System qualifies project details instantly.</p>
                          </div>

                          {/* Step 3 Node */}
                          <div className={`p-3.5 rounded-xl border transition-all duration-300 ${
                            pipelineStep >= 3 ? "bg-indigo-950/25 border-indigo-500 text-white" : "bg-[#090A0D] border-white/5 text-white/30"
                          }`}>
                            <div className="flex items-center gap-2.5 mb-1">
                              <Send className="w-4 h-4 text-indigo-400" />
                              <span className="font-semibold text-xs uppercase tracking-wider">Instant SMS Auto-sent</span>
                            </div>
                            <p className="text-[11px] leading-relaxed opacity-60">Fires personalized SMS lead engagement in 30s.</p>
                          </div>

                          {/* Step 4 Node */}
                          <div className={`p-3.5 rounded-xl border transition-all duration-300 ${
                            pipelineStep >= 4 ? "bg-[#101F1B] border-emerald-500 text-white" : "bg-[#090A0D] border-white/5 text-white/30"
                          }`}>
                            <div className="flex items-center gap-2.5 mb-1">
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                              <span className="font-semibold text-xs uppercase tracking-wider">CRM Site Sync</span>
                            </div>
                            <p className="text-[11px] leading-relaxed opacity-60">Syncs directly to client schedule & bookings database.</p>
                          </div>

                        </div>

                        {/* Conversational Live Dialog Display */}
                        {pipelineState !== "idle" && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#090A0D] border border-white/5 p-3 rounded-xl flex flex-col gap-1 font-mono text-[11px] text-white/80"
                          >
                            <div className="text-white/30 uppercase text-[9px] mb-1">Live SMS Flow Debugger</div>
                            <p><span className="text-indigo-400 font-bold">Inbound (0.2s):</span> "Hi, I need repair work on a leaking pipe by tomorrow morning."</p>
                            
                            {pipelineStep >= 2 && (
                              <p className="animate-pulse"><span className="text-emerald-400 font-bold">Autobot (30s):</span> "Hi Dave! We have an emergency slot available tomorrow at 8:30 AM. Reply BOOK to secure."</p>
                            )}
                            {pipelineStep >= 4 && (
                              <p><span className="text-cyan-400 font-bold">Dave (42s):</span> "BOOK. Thank you!"</p>
                            )}
                            {pipelineState === "complete" && (
                              <motion.p 
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-emerald-400 font-bold mt-1.5 flex items-center gap-1.5"
                              >
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                                <span>[SUCCESS] LEAD AUTO-QUALIFIED & SYNCED TO AGENT CRM DB.</span>
                              </motion.p>
                            )}
                          </motion.div>
                        )}

                      </div>

                      <p className="text-xs font-mono text-white/40 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5 flex items-start gap-2">
                        <Clock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <span>
                          <strong>Intake Automation:</strong> Slow lead contacts are dead leads. By integrating instant qualifying responder scripts and appointment calendars, we keep service providers booked up 24/7.
                        </span>
                      </p>
                    </motion.div>
                  )}


                  {/* SANDBOX 04: BRAND IDENTITY */}
                  {activeIndex === 3 && (
                    <motion.div
                      key="branding"
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -15 }}
                      transition={{ duration: 0.35 }}
                      className="w-full h-full flex flex-col gap-6 transform-gpu"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px] sm:text-xs uppercase mb-1">
                          <Palette className="w-4 h-4 text-slate-400" />
                          <span>Brand Authority Transformer</span>
                        </div>
                        <h4 className="text-lg sm:text-xl font-display font-semibold uppercase tracking-wide">
                          Matching Real-World Absolute Authority
                        </h4>
                      </div>

                      {/* Interactive Brand Preset Toggles */}
                      <div className="flex gap-2 p-1 bg-white/[0.03] border border-white/5 rounded-xl self-start">
                        {["nordic", "neon", "sunset"].map((preset) => (
                          <button
                            key={preset}
                            onClick={() => setBrandPreset(preset as any)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                              brandPreset === preset 
                                ? preset === "nordic"
                                  ? "bg-[#4B5563] text-white font-semibold"
                                  : preset === "neon"
                                  ? "bg-[#E4FB04] text-black font-bold"
                                  : "bg-[#EA580C] text-white font-semibold"
                                : "text-white/40 hover:text-white"
                            }`}
                          >
                            {preset}
                          </button>
                        ))}
                      </div>

                      {/* Brand Design Output mockup */}
                      <div className="bg-[#12141C] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-inner">
                        <div className={`transition-all duration-500 rounded-xl p-4 sm:p-6 border ${
                          brandPreset === "nordic" 
                            ? "bg-[#0D1117] border-slate-800 text-[#F0F6FC] font-sans" 
                            : brandPreset === "neon"
                            ? "bg-[#000000] border-zinc-800/50 text-[#FFFFFF] font-mono"
                            : "bg-[#181014] border-amber-950/40 text-[#FEF6E4] font-serif"
                        }`}>
                          
                          {/* Simulated logo & typography layout representation */}
                          <div className="flex items-center justify-between border-b pb-4 mb-4 border-white/10">
                            <div className="flex items-center gap-2">
                              {brandPreset === "nordic" && <Layers className="w-5 h-5 text-[#1F6FEB]" />}
                              {brandPreset === "neon" && <Sparkle className="w-5 h-5 text-[#00E5FF] animate-spin" />}
                              {brandPreset === "sunset" && <Sparkles className="w-5 h-5 text-[#FFB84C]" />}
                              
                              <span className={`text-sm sm:text-base font-bold tracking-tight uppercase ${
                                brandPreset === "nordic" ? "font-display text-[#F0F6FC]" : brandPreset === "neon" ? "font-mono text-[#00E5FF]" : "font-serif tracking-widest text-[#FFB84C]"
                              }`}>
                                {brandPreset === "nordic" ? "Solstice Builders" : brandPreset === "neon" ? "NeonCore Electric" : "Arcadian Landscaping"}
                              </span>
                            </div>
                            <span className="hidden sm:block text-[10px] uppercase opacity-40">System Core V1</span>
                          </div>

                          <h5 className={`text-lg sm:text-xl font-semibold mb-3 leading-tight ${
                            brandPreset === "nordic" ? "tracking-tight text-[#E5E7EB]" : brandPreset === "neon" ? "uppercase text-[#D500F9]" : "italic text-[#FEF6E4]"
                          }`}>
                            {brandPreset === "nordic" && "High-performing architectural craft and execution."}
                            {brandPreset === "neon" && "[SYSTEM_CHECK: 24/7 ULTIMATE POWER OUTFLOWS]"}
                            {brandPreset === "sunset" && "Sovereignty of premium landscapes, gardens, & curated estates."}
                          </h5>

                          {/* Matching Palette Chips */}
                          <div className="mt-6 pt-5 border-t border-white/10 hidden sm:block">
                            <span className="text-[11px] uppercase text-white font-mono tracking-wider block mb-3 font-semibold">
                              Color Scheme Palette:
                            </span>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                              {brandPreset === "nordic" && (
                                <>
                                  <div className="flex items-center gap-3 bg-black/40 border border-white/5 p-2.5 rounded-xl">
                                    <div className="w-8 h-8 rounded-lg bg-[#0D1117] border border-white/15 shrink-0" />
                                    <div className="flex flex-col min-w-0 leading-tight">
                                      <span className="text-[9px] font-mono text-white/50 uppercase tracking-wider truncate">Deep Sea Zinc</span>
                                      <span className="text-[11px] font-mono text-white font-bold mt-0.5">#0D1117</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 bg-black/40 border border-white/5 p-2.5 rounded-xl">
                                    <div className="w-8 h-8 rounded-lg bg-[#F0F6FC] border border-white/15 shrink-0" />
                                    <div className="flex flex-col min-w-0 leading-tight">
                                      <span className="text-[9px] font-mono text-white/50 uppercase tracking-wider truncate">Arctic White</span>
                                      <span className="text-[11px] font-mono text-white font-bold mt-0.5">#F0F6FC</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 bg-black/40 border border-white/5 p-2.5 rounded-xl">
                                    <div className="w-8 h-8 rounded-lg bg-[#1F6FEB] border border-white/15 shrink-0" />
                                    <div className="flex flex-col min-w-0 leading-tight">
                                      <span className="text-[9px] font-mono text-white/50 uppercase tracking-wider truncate">Deep Teal</span>
                                      <span className="text-[11px] font-mono text-white font-bold mt-0.5">#1F6FEB</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 bg-black/40 border border-white/5 p-2.5 rounded-xl">
                                    <div className="w-8 h-8 rounded-lg bg-[#E5E7EB] border border-white/15 shrink-0" />
                                    <div className="flex flex-col min-w-0 leading-tight">
                                      <span className="text-[9px] font-mono text-white/50 uppercase tracking-wider truncate">Frost Gray</span>
                                      <span className="text-[11px] font-mono text-white font-bold mt-0.5">#E5E7EB</span>
                                    </div>
                                  </div>
                                </>
                              )}
                              {brandPreset === "neon" && (
                                <>
                                  <div className="flex items-center gap-3 bg-black/40 border border-white/5 p-2.5 rounded-xl">
                                    <div className="w-8 h-8 rounded-lg bg-[#000000] border border-white/15 shrink-0" />
                                    <div className="flex flex-col min-w-0 leading-tight">
                                      <span className="text-[9px] font-mono text-white/50 uppercase tracking-wider truncate">Pure Black</span>
                                      <span className="text-[11px] font-mono text-white font-bold mt-0.5">#000000</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 bg-black/40 border border-white/5 p-2.5 rounded-xl">
                                    <div className="w-8 h-8 rounded-lg bg-[#FFFFFF] border border-white/15 shrink-0" />
                                    <div className="flex flex-col min-w-0 leading-tight">
                                      <span className="text-[9px] font-mono text-white/50 uppercase tracking-wider truncate">Vibrant White</span>
                                      <span className="text-[11px] font-mono text-white font-bold mt-0.5">#FFFFFF</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 bg-black/40 border border-white/5 p-2.5 rounded-xl">
                                    <div className="w-8 h-8 rounded-lg bg-[#00E5FF] border border-white/15 shrink-0" />
                                    <div className="flex flex-col min-w-0 leading-tight">
                                      <span className="text-[9px] font-mono text-white/50 uppercase tracking-wider truncate">Electric Cyan</span>
                                      <span className="text-[11px] font-mono text-white font-bold mt-0.5">#00E5FF</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 bg-black/40 border border-white/5 p-2.5 rounded-xl">
                                    <div className="w-8 h-8 rounded-lg bg-[#D500F9] border border-white/15 shrink-0" />
                                    <div className="flex flex-col min-w-0 leading-tight">
                                      <span className="text-[9px] font-mono text-white/50 uppercase tracking-wider truncate">Plasma Purple</span>
                                      <span className="text-[11px] font-mono text-white font-bold mt-0.5">#D500F9</span>
                                    </div>
                                  </div>
                                </>
                              )}
                              {brandPreset === "sunset" && (
                                <>
                                  <div className="flex items-center gap-3 bg-black/40 border border-white/5 p-2.5 rounded-xl">
                                    <div className="w-8 h-8 rounded-lg bg-[#181014] border border-white/15 shrink-0" />
                                    <div className="flex flex-col min-w-0 leading-tight">
                                      <span className="text-[9px] font-mono text-white/50 uppercase tracking-wider truncate">Warm Charcoal</span>
                                      <span className="text-[11px] font-mono text-white font-bold mt-0.5">#181014</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 bg-black/40 border border-white/5 p-2.5 rounded-xl">
                                    <div className="w-8 h-8 rounded-lg bg-[#FEF6E4] border border-white/15 shrink-0" />
                                    <div className="flex flex-col min-w-0 leading-tight">
                                      <span className="text-[9px] font-mono text-white/50 uppercase tracking-wider truncate">Warm Cream</span>
                                      <span className="text-[11px] font-mono text-white font-bold mt-0.5">#FEF6E4</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 bg-black/40 border border-white/5 p-2.5 rounded-xl">
                                    <div className="w-8 h-8 rounded-lg bg-[#FFB84C] border border-white/15 shrink-0" />
                                    <div className="flex flex-col min-w-0 leading-tight">
                                      <span className="text-[9px] font-mono text-white/50 uppercase tracking-wider truncate">Amber Gold</span>
                                      <span className="text-[11px] font-mono text-white font-bold mt-0.5">#FFB84C</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 bg-black/40 border border-white/5 p-2.5 rounded-xl">
                                    <div className="w-8 h-8 rounded-lg bg-[#A23F8A] border border-white/15 shrink-0" />
                                    <div className="flex flex-col min-w-0 leading-tight">
                                      <span className="text-[9px] font-mono text-white/50 uppercase tracking-wider truncate">Mauve Deep</span>
                                      <span className="text-[11px] font-mono text-white font-bold mt-0.5">#A23F8A</span>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs font-mono text-white/40 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5 flex items-start gap-2">
                        <Eye className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                        <span>
                          <strong>Authority Styling:</strong> Unpolished sites look like amateur risks to discerning local buyers. We elevate your digital design assets so your brand commands premium pricing and repels discount shoppers.
                        </span>
                      </p>
                    </motion.div>
                  )}


                  {/* SANDBOX 05: CONVERSION OPTIMIZATION */}
                  {activeIndex === 4 && (
                    <motion.div
                      key="conversion"
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -15 }}
                      transition={{ duration: 0.35 }}
                      className="w-full h-full flex flex-col gap-6 transform-gpu"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase mb-1">
                          <Sliders className="w-4 h-4" />
                          <span>Conversion Optimizer Studio</span>
                        </div>
                        <h4 className="text-xl font-display font-semibold uppercase tracking-wide">
                          Frictionless Conversion Mechanics
                        </h4>
                      </div>

                      {/* Interactive original vs optimized toggle tab */}
                      <div className="flex gap-2 p-1 bg-white/[0.03] border border-white/5 rounded-xl self-start">
                        {["original", "optimized"].map((view) => (
                          <button
                            key={view}
                            onClick={() => setSplitView(view as any)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200 ${
                              splitView === view 
                                ? "bg-amber-600 text-white font-semibold" 
                                : "text-white/40 hover:text-white"
                            }`}
                          >
                            {view === "original" ? "Generic Template Stack" : "Cymise High-Converting Hub"}
                          </button>
                        ))}
                      </div>

                      {/* Stack structure output */}
                      <div className="bg-[#12141C] border border-white/10 rounded-2xl p-4 shadow-inner">
                        <div className="flex items-center justify-between text-xs font-mono pb-2 mb-3 border-b border-white/5">
                          <span>User Flow Comparison:</span>
                          <span className={`px-2 py-0.5 rounded font-bold ${splitView === "optimized" ? "text-emerald-400 bg-emerald-950/20" : "text-red-400 bg-red-950/20"}`}>
                            {splitView === "optimized" ? "A/B TEST: WINNER (+400%)" : "LOOSE LEADS (-75%)"}
                          </span>
                        </div>

                        {splitView === "original" ? (
                          <div className="flex flex-col gap-2.5 opacity-60">
                            <div className="p-3 bg-red-950/10 border border-red-500/20 rounded-xl">
                              <span className="font-mono text-xs font-bold text-red-400">🚨 Friction: Standard Clunky Form</span>
                              <p className="text-xs text-white/60 mt-0.5">14 custom required fields. Desktop-only layout. Visitors leave due to fatigue.</p>
                            </div>
                            <div className="p-3 bg-red-950/10 border border-red-500/20 rounded-xl">
                              <span className="font-mono text-xs font-bold text-red-400">🚨 Friction: Hidden CTA Placements</span>
                              <p className="text-xs text-white/60 mt-0.5">Call actions hidden deep in footer. No touch target optimization on mobile.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2.5">
                            <div className="p-3 bg-emerald-950/10 border border-emerald-500/20 rounded-xl flex items-start gap-2.5">
                              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-mono text-xs font-bold text-emerald-400">✅ Solution: Single-Touch Booking Hubs</span>
                                <p className="text-xs text-white/75 mt-0.5">Intelligent micro-conditional inputs requiring only target details.</p>
                              </div>
                            </div>
                            <div className="p-3 bg-emerald-950/10 border border-emerald-500/20 rounded-xl flex items-start gap-2.5">
                              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-mono text-xs font-bold text-emerald-400">✅ Solution: High Intensity CTA Ribbons</span>
                                <p className="text-xs text-white/75 mt-0.5">Floating actions optimized dynamically for one-handed cellular taps.</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-xs font-mono">
                          <span className="text-white/40">Simulated Conversion Rate:</span>
                          <span className={`text-base font-bold ${splitView === "optimized" ? "text-emerald-400" : "text-red-400"}`}>
                            {splitView === "optimized" ? "8.4% Average" : "1.2% Average"}
                          </span>
                        </div>

                      </div>

                      <p className="text-xs font-mono text-white/40 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5 flex items-start gap-2">
                        <BarChart3 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>
                          <strong>Optimization Flow:</strong> Stop throwing marketing money away at leaky structures. Our conversion systems streamline user click-flows to transform raw traffic into secured service appointments.
                        </span>
                      </p>
                    </motion.div>
                  )}


                </AnimatePresence>

              </div>

              {/* Console Status Footer */}
              <div className="bg-[#0A0B0E] border-t border-[#1A1C23] px-6 py-3.5 flex items-center justify-between text-[10px] font-mono text-white/40">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  <span>ACTIVE_SANDBOX: SECTION_0{activeIndex !== null ? activeIndex + 1 : 1}</span>
                </span>
                
                <span>RENDERER_AGENT: EXPERT</span>
              </div>

            </div>
  );

  return (
    <section id="services" className="bg-black text-white px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-10 overflow-hidden">
      {/* Background ambient light matching active slide */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none opacity-20 transition-all duration-1000 transform-gpu"
        style={{
          background: SERVICES[activeIndex].glowColor,
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Completely static memoized header component to prevent any flashing/re-rendering upon dynamic state tab updates */}
        <StaticHeader />

        {/* Desktop Split Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
          
          {/* Left Column: Interactive Tab Triggers */}
          <div className="lg:col-span-5 flex flex-col gap-4 transform-gpu">
            {SERVICES.map((service, index) => {
              const isActive = activeIndex === index;
              return (
                <div key={index} className="flex flex-col w-full">
                  <button
                    type="button"
                    id={`service-card-${index}`}
                    onClick={(e) => handleTabClick(e, index)}
                    className={`text-left relative cursor-pointer p-5 sm:p-8 rounded-3xl transition-all duration-300 select-none group border w-full block focus:outline-none focus:ring-1 focus:ring-cyan-500/20 ${
                      isActive 
                        ? "bg-[#14151C] border-[#2E313D] shadow-2xl" 
                        : "bg-[#0F0F12]/50 border-white/5 hover:bg-[#121215] hover:border-white/10"
                    }`}
                  >
                    {/* Card Background Glow Highlight */}
                    {isActive && (
                      <motion.div 
                        layoutId="activeCardBackground"
                        className="absolute inset-0 bg-gradient-to-tr from-cyan-950/20 via-blue-950/10 to-indigo-950/20 rounded-3xl -z-10 focus:outline-none"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}

                    <div className="flex items-start gap-4 sm:gap-6">
                      {/* Interactive Animated Gradient Dot */}
                      <div className="flex flex-col items-center">
                        <span className={`font-display font-black text-xl sm:text-2xl tracking-tight transition-colors duration-300 ${
                          isActive ? `text-transparent bg-clip-text bg-gradient-to-r ${service.accent}` : "text-white/20"
                        }`}>
                          {service.num}
                        </span>
                        
                        {isActive && (
                          <motion.div 
                            layoutId="activeIndicatorBar"
                            className={`w-1 h-8 rounded-full bg-gradient-to-b ${service.accent} mt-2`}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className={`font-display font-bold uppercase text-lg sm:text-xl tracking-wide mb-2 transition-colors duration-300 ${
                          isActive ? "text-white" : "text-white/70 group-hover:text-white"
                        }`}>
                          {service.title}
                        </h3>
                        <p className={`font-light leading-relaxed text-sm sm:text-base transition-opacity duration-300 ${
                          isActive ? "text-white/80" : "text-white/40 group-hover:text-white/60"
                        }`}>
                          {service.shortDesc}
                        </p>

                        {/* CTA view trigger shown inline on mobile & hover on desktop */}
                        <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#7B61FF] group-hover:translate-x-1 duration-300">
                          <span>{isActive ? "Viewing Sandbox" : "Click to view sandbox"}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </button>
                  {/* Accordion Sandbox for Mobile */}
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="block lg:hidden mt-4 mb-2 overflow-hidden"
                      >
                        {sandboxNode}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

                    {/* Right Column: Live Interactive Sandbox Console */}
          <div className="hidden lg:block lg:col-span-7 sticky top-32 transform-gpu">
            {sandboxNode}
          </div>

        </div>
      </div>
    </section>
  );
}
