import React, { useState, useEffect, useRef } from "react";
import { CymiseLogo } from "./CymiseLogo";

// Only track our extremely light, local asset for critical painting
const CRITICAL_ASSETS = ["/logo-mark.png"];

interface PreloaderProps {
  onComplete: () => void;
  isVideoReady: boolean;
}

export function Preloader({ onComplete, isVideoReady }: PreloaderProps) {
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [isLoaderVisible, setIsLoaderVisible] = useState(true);
  const [isTextExiting, setIsTextExiting] = useState(false);
  const [isLoaderFading, setIsLoaderFading] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [timePassed, setTimePassed] = useState(false);

  // Measure prefers-reduced-motion to skip heavy delays if requested
  const prefersReducedMotion = typeof window !== "undefined" 
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches 
    : false;

  // Sync state values with refs to absolutely avoid closure bugs in the ticker interval
  const isVideoReadyRef = useRef(isVideoReady);
  const assetsLoadedRef = useRef(assetsLoaded);
  const timePassedRef = useRef(timePassed);

  useEffect(() => {
    isVideoReadyRef.current = isVideoReady;
  }, [isVideoReady]);

  useEffect(() => {
    assetsLoadedRef.current = assetsLoaded;
  }, [assetsLoaded]);

  useEffect(() => {
    timePassedRef.current = timePassed;
  }, [timePassed]);

  // Absolute fail-safe timeout (meets User constraints: Desktop: ~2800ms, Mobile: ~1800ms)
  useEffect(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const maxTimeout = prefersReducedMotion ? 300 : (isMobile ? 1800 : 2800);
    const failSafeTimer = setTimeout(() => {
      setTimePassed(true);
    }, maxTimeout);

    return () => clearTimeout(failSafeTimer);
  }, [prefersReducedMotion]);

  // Asset loading with tight 2.5s absolute timeout
  useEffect(() => {
    let active = true;
    const loadAssets = async () => {
      // Async image caching
      const promises = CRITICAL_ASSETS.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve(true);
          img.onerror = () => resolve(true);
        });
      });

      // Quick font loading support
      const fontsPromise = (document as any).fonts 
        ? (document as any).fonts.ready 
        : Promise.resolve();

      // Maximum fast budget of 2500ms
      const timeoutPromise = new Promise((resolve) => setTimeout(resolve, prefersReducedMotion ? 300 : 2500));

      await Promise.race([
        Promise.all([Promise.all(promises), fontsPromise]),
        timeoutPromise
      ]);

      if (active) {
        setAssetsLoaded(true);
      }
    };

    loadAssets();
    return () => { active = false; };
  }, [prefersReducedMotion]);

  // Organic fast progress ticker using stable interval with Ref reads
  useEffect(() => {
    if (prefersReducedMotion) {
      setLoaderProgress(100);
      return;
    }

    const interval = setInterval(() => {
      setLoaderProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }

        const ready = (isVideoReadyRef.current && assetsLoadedRef.current) || timePassedRef.current;

        if (ready) {
          // Increment much faster if everything has fetched or client has timed out / reduced motion
          const next = prev + Math.floor(Math.random() * 8) + 5;
          return Math.min(next, 100);
        } else {
          if (prev < 85) {
            return prev + Math.floor(Math.random() * 4) + 2;
          } else if (prev < 96) {
            // Slower crawl to give video an extra chunk of time
            return prev + 1;
          } else {
            // Wait at 96% until either assets/video are ready or the absolute fail-safe timeout triggers
            return prev;
          }
        }
      });
    }, 45);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  // Transition exit timeline once progress reaches 100%
  useEffect(() => {
    if (loaderProgress === 100) {
      let timeouts: number[] = [];
      const t1 = window.setTimeout(() => {
        setIsTextExiting(true);

        const t2 = window.setTimeout(() => {
          setIsLoaderFading(true);
          onComplete();

          const t3 = window.setTimeout(() => {
            setIsLoaderVisible(false);
          }, 800);
          timeouts.push(t3);
        }, prefersReducedMotion ? 50 : 200);
        timeouts.push(t2);
      }, prefersReducedMotion ? 100 : 300); // Quick completion beat
      timeouts.push(t1);

      return () => timeouts.forEach(clearTimeout);
    }
  }, [loaderProgress, onComplete, prefersReducedMotion]);

  const getLoaderLabel = (progress: number) => {
    if (progress <= 25) return "ANALYSIS";
    if (progress <= 50) return "ARCHITECTURE";
    if (progress <= 75) return "OPTIMIZATION";
    if (progress <= 99) return "CONVERSION";
    return "CYMISE.";
  };

  if (!isLoaderVisible) return null;

  return (
    <div
      id="preloader"
      className={`fixed inset-0 bg-black z-50 flex flex-col items-center justify-center select-none antialiased transition-transform duration-800 ease-[cubic-bezier(0.85,0,0.15,1)] ${
        isLoaderFading ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div
        className={`flex flex-col items-center justify-center text-center transition-all duration-500 ease-out ${
          isTextExiting ? "scale-[1.3] opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <div className="text-[14vw] md:text-[10vw] font-light tracking-tighter text-white/95 leading-none font-sans">
          {String(loaderProgress).padStart(3, "0")}
        </div>

        <div className="mt-6 min-h-[5rem] flex items-center justify-center overflow-visible">
          {loaderProgress === 100 ? (
            <div className="animate-logo-reveal">
              <CymiseLogo />
            </div>
          ) : (
            <span
              className={`text-xs uppercase tracking-[0.55em] font-medium transition-all duration-300 font-sans ${
                loaderProgress === 100
                  ? "text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.7)] font-semibold"
                  : "text-gray-500"
              }`}
            >
              {getLoaderLabel(loaderProgress)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
