import React, { useState, useEffect, useRef } from "react";
import Lenis from "lenis";
import { ArrowUpRight } from "lucide-react";
import { Preloader } from "./components/Preloader";
import { CymiseLogo } from "./components/CymiseLogo";

// Sub-page sections
import { MarqueeSection } from "./components/MarqueeSection";
import { AboutSection } from "./components/AboutSection";
import { AgitateSection } from "./components/AgitateSection";
import { ServicesSection } from "./components/ServicesSection";
import { ProcessSection } from "./components/ProcessSection";
import { AboutCymiseSection } from "./components/AboutCymiseSection";
import { ContactSection } from "./components/ContactSection";
import { FooterSection } from "./components/FooterSection";

function MainAppContent() {
  // DOM refs to animate conversion rate completely outside React render cycle (0 frame re-renders)
  const countTextRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Preloader and reveal state management
  const [heroActive, setHeroActive] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  
  // Non-rendering mutable refs for smooth cursor tracking
  const coords = useRef({ currentX: 0, currentY: 0, targetX: 0, targetY: 0 });
  const rafIdRef = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis once on mount
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const lenis = new Lenis({
      lerp: 0.08,             // Premium smooth deceleration
      wheelMultiplier: 1, 
      smoothWheel: !prefersReducedMotion,
    });

    lenisRef.current = lenis;

    // Immediately stop scroll if preloader is active on load
    lenis.stop();

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
      lenisRef.current = null;
    };
  }, []);

  // Sync scroll locking based on preloader exit
  useEffect(() => {
    if (lenisRef.current) {
      if (!heroActive) {
        lenisRef.current.stop();
      } else {
        lenisRef.current.start();
      }
    }
  }, [heroActive]);

  // Autoplay hero video once ready and active
  useEffect(() => {
    if (heroActive && videoRef.current) {
      videoRef.current.play().catch((e) => console.log("Video autoplay play thwarted or deferred:", e));
    }
  }, [heroActive]);

  // GPU-accelerated and lerp-interpolated parallax tracking on desktop mousemove (0 React re-renders)
  useEffect(() => {
    if (!heroActive) return;

    // Desktop check (> 768px viewports)
    if (window.innerWidth < 768) return;

    const heroContainer = document.getElementById("hero-root");
    if (!heroContainer) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = heroContainer.getBoundingClientRect();
      coords.current.targetX = (e.clientX - rect.left) / rect.width - 0.5;
      coords.current.targetY = (e.clientY - rect.top) / rect.height - 0.5;
    };

    const onMouseLeave = () => {
      coords.current.targetX = 0;
      coords.current.targetY = 0;
    };

    heroContainer.addEventListener("mousemove", onMouseMove);
    heroContainer.addEventListener("mouseleave", onMouseLeave);

    const LERP_FACTOR = 0.08; // smooth spring effect coefficient

    const tick = () => {
      coords.current.currentX += (coords.current.targetX - coords.current.currentX) * LERP_FACTOR;
      coords.current.currentY += (coords.current.targetY - coords.current.currentY) * LERP_FACTOR;

      const { currentX, currentY } = coords.current;

      const leftStyle = `translate3d(${currentX * -24}px, ${currentY * -24}px, 0) rotateY(${currentX * 15}deg) rotateX(${currentY * -15}deg)`;
      const rightStyle = `translate3d(${currentX * 24}px, ${currentY * 24}px, 0) rotateY(${currentX * -15}deg) rotateX(${currentY * 15}deg)`;

      if (leftCardRef.current) {
        leftCardRef.current.style.transform = leftStyle;
      }
      if (rightCardRef.current) {
        rightCardRef.current.style.transform = rightStyle;
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      heroContainer.removeEventListener("mousemove", onMouseMove);
      heroContainer.removeEventListener("mouseleave", onMouseLeave);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [heroActive]);

  // Lead Conversion rate ticker (triggers on preloader exit)
  useEffect(() => {
    if (!heroActive) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      if (countTextRef.current) countTextRef.current.textContent = "96%";
      if (progressBarRef.current) progressBarRef.current.style.width = "96%";
      return;
    }

    let countFrameId: number;
    const startValue = 82;
    const endValue = 96;
    const countDuration = 1500;
    let startTs: number | null = null;

    const animateCount = (now: number) => {
      if (startTs === null) startTs = now;
      const progress = Math.min(Math.max((now - startTs) / countDuration, 0), 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const currentValue = Math.floor(startValue + ease * (endValue - startValue));

      if (countTextRef.current) {
        countTextRef.current.textContent = `${currentValue}%`;
      }
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${currentValue}%`;
      }

      if (progress < 1) {
        countFrameId = requestAnimationFrame(animateCount);
      } else {
        if (countTextRef.current) countTextRef.current.textContent = `${endValue}%`;
        if (progressBarRef.current) progressBarRef.current.style.width = `${endValue}%`;
      }
    };

    countFrameId = requestAnimationFrame(animateCount);
    return () => cancelAnimationFrame(countFrameId);
  }, [heroActive]);

  // Static styling for glassmorphic cards
  const parallaxStyle = {
    transition: "transform 0.08s ease-out",
    willChange: "transform",
    backfaceVisibility: "hidden" as const,
    transformStyle: "preserve-3d" as const,
  };

  return (
    <div className="bg-black text-white font-sans selection:bg-cyan-500/30">
      {/* A. LUXURY INTRO PRELOADER */}
      <Preloader onComplete={() => setHeroActive(true)} isVideoReady={isVideoReady} />

      {/* Hero Section Container */}
      <div 
        id="hero-root"
        className={`relative w-full overflow-hidden flex flex-col justify-between select-none perspective-1000 bg-black bg-gradient-to-b from-slate-950 via-black to-slate-950 ${heroActive ? 'h-screen' : 'fixed inset-0'}`}
      >
        {/* 1. HTML5 Video Background Layer with fallbacks (WebM first, MP4 second) */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onCanPlayThrough={() => setIsVideoReady(true)}
          onLoadedData={() => setIsVideoReady(true)}
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-40 md:opacity-100 transition-opacity duration-1000"
        >
          <source src="/ambient-blob.webm" type="video/webm" />
          <source src="/ambient-blob.mp4" type="video/mp4" />
        </video>

        {/* Cinematic Scale, Focus, and Fade reveal animation wrapper */}
        <div className={`relative z-10 flex-grow flex flex-col justify-between min-h-screen w-full transition-all duration-1000 ease-out ${
          heroActive 
            ? "scale-100 blur-none opacity-100" 
            : "scale-95 blur-2xl opacity-0"
        }`}>
          {/* 2. Navigation Bar */}
          <nav id="navbar" className="relative z-50 w-full max-w-7xl mx-auto px-6 py-4 md:py-6 flex items-center justify-between">
            {/* Left Side: Brand Logo */}
            <CymiseLogo />

            {/* Center Links */}
            <div className="hidden md:flex items-center gap-10">
              {["Home", "Services", "Process", "About"].map((link) => {
                const handleLinkClick = (e: React.MouseEvent) => {
                  e.preventDefault();
                  const targetId = link === "Home" ? "hero-root" : link.toLowerCase();
                  const targetElement = document.getElementById(targetId);
                  
                  if (targetElement) {
                    if (lenisRef.current) {
                      lenisRef.current.scrollTo(targetElement);
                    } else {
                      targetElement.scrollIntoView({ behavior: "smooth" });
                    }
                  }
                };

                return (
                  <a 
                    key={link}
                    href={`#${link.toLowerCase()}`}
                    onClick={handleLinkClick}
                    className="text-gray-400 hover:text-cyan-400 text-sm font-medium tracking-wide transition-colors duration-300"
                  >
                    {link}
                  </a>
                );
              })}
            </div>

            {/* Right Action Button */}
            <div className="flex items-center">
              <button 
                onClick={() => {
                  const formEl = document.getElementById("lead-capture-form");
                  if (formEl) {
                    if (lenisRef.current) {
                      lenisRef.current.scrollTo(formEl);
                    } else {
                      formEl.scrollIntoView({ behavior: "smooth" });
                    }
                  }
                }}
                className="px-6 py-2 rounded-full font-semibold text-black bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 hover:opacity-90 active:scale-95 transition-all text-xs tracking-wider uppercase shadow-[0_4px_20px_0_rgba(6,182,212,0.25)] cursor-pointer"
              >
                Start
              </button>
            </div>
          </nav>

          {/* 3. Main Hero Content and Centered Text */}
          <main className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-6 pt-16 md:pt-24 select-none">
            {/* Headline */}
            <h1 className="font-display font-extrabold text-3xl xs:text-4xl sm:text-5xl md:text-7xl tracking-extratight text-white leading-[1.08] max-w-4xl mx-auto mb-6">
              <span className="md:hidden block">
                More Growth.<br />More Turnover.<br />More Clients.<br />Guaranteed.
              </span>
              <span className="hidden md:inline">
                More Growth, More Turnover, More Clients — Guaranteed.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-gray-100 font-medium text-base md:text-xl leading-relaxed max-w-2xl mx-auto mb-10 font-sans tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              You do what you do best, and we handle the marketing. Together, we'll take your business to the next level.
            </p>

            {/* Primary CTA */}
            <div className="mb-4 relative z-50 pointer-events-auto">
              <button 
                onClick={() => {
                  const formEl = document.getElementById('lead-capture-form');
                  if (formEl) {
                    if (lenisRef.current) {
                      lenisRef.current.scrollTo(formEl);
                    } else {
                      formEl.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
                className="px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-[#00E5FF] hover:shadow-[0_0_35px_rgba(0,229,255,0.4)] active:scale-95 transition-all duration-300 tracking-wide text-sm cursor-pointer shadow-lg shadow-white/5"
              >
                Request Lead Strategy
              </button>
            </div>

            {/* 4. Interactive Assets & Cards Layout */}
            <div className="relative w-full max-w-5xl mx-auto h-[180px] md:h-[220px] flex items-end justify-center z-45">
              {/* Left Glassmorphic Card (Hidden on Mobile) */}
              <div 
                ref={leftCardRef}
                style={parallaxStyle}
                className="hidden md:block absolute left-10 lg:left-16 bottom-16 md:bottom-20 z-40 w-72 pointer-events-auto transition-[transform]"
              >
                <div className="backdrop-blur-3xl bg-[#090D1A]/95 border border-white/20 rounded-2xl p-6 h-[170px] flex flex-col justify-between shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] transition-all duration-300 hover:border-[#00E5FF]/60 hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] group transform-gpu">
                  <div className="flex items-center justify-between">
                    <span className="text-[#00E5FF] text-xs font-mono tracking-widest font-black uppercase drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">Local Visibility</span>
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00E5FF]"></span>
                    </span>
                  </div>
                  
                  <p className="text-white text-xl font-bold font-display leading-tight tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] text-left">
                    Premium Web Assets & Core SEO
                  </p>

                  {/* Left Card Visual Bar */}
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#00E5FF] h-full rounded-full w-[100%] shadow-[0_0_8px_rgba(0,229,255,0.5)]" />
                  </div>
                </div>
              </div>

              {/* Right Glassmorphic Card (Hidden on Mobile) */}
              <div 
                ref={rightCardRef}
                style={parallaxStyle}
                className="hidden md:block absolute right-10 lg:right-16 bottom-16 md:bottom-20 z-40 w-72 pointer-events-auto transition-[transform]"
              >
                <div className="backdrop-blur-3xl bg-[#090D1A]/95 border border-white/20 rounded-2xl p-6 h-[170px] flex flex-col justify-between shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] transition-all duration-300 hover:border-[#00E5FF]/60 hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] group transform-gpu">
                  <div className="flex items-center justify-between">
                    <span className="text-[#00E5FF] text-xs font-mono tracking-widest font-black uppercase drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">Conversion Rate</span>
                    <ArrowUpRight className="w-5 h-5 text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.4)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                  </div>
                  
                  <div className="flex items-baseline gap-2 text-left">
                    <span ref={countTextRef} className="text-white text-4xl font-bold font-display tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">82%</span>
                    <span className="text-white text-xs font-mono font-bold flex items-center gap-0.5 bg-white/10 px-1.5 py-0.5 rounded border border-white/5">
                      <span>+14.2%</span>
                    </span>
                  </div>

                  {/* Progress Line */}
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div 
                      ref={progressBarRef}
                      className="bg-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.5)] h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `82%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Main Content Rendered after Hero Activation to enable accurate scrolling behavior */}
      {heroActive && (
        <div className="relative z-10 bg-black">
          <MarqueeSection />
          <AboutSection />
          <AgitateSection />
          <ServicesSection />
          <ProcessSection />
          <AboutCymiseSection />
          <ContactSection />
          <FooterSection />
        </div>
      )}
    </div>
  );
}

// Cleaned up App entry point (no consent wrappers required)
export default function App() {
  // Debugging safeguard: identifies elements causing horizontal-overflow
  useEffect(() => {
    const checkOverflow = () => {
      const docWidth = document.documentElement.clientWidth;
      const allElements = document.querySelectorAll("*");
      allElements.forEach((el: any) => {
        const rect = el.getBoundingClientRect();
        if (rect.width > docWidth && !el.classList?.contains("w-max") && el.id !== "preloader" && el.tagName !== "HTML" && el.tagName !== "BODY") {
          console.warn("[DEBUG] Element causing horizontal overflow:", el, `Width: ${rect.width}px`, `DocWidth: ${docWidth}px`);
        }
      });
    };
    
    window.addEventListener("resize", checkOverflow);
    const timer = setTimeout(checkOverflow, 2500);
    return () => {
      window.removeEventListener("resize", checkOverflow);
      clearTimeout(timer);
    };
  }, []);

  return <MainAppContent />;
}
