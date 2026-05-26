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
  const [windowLoaded, setWindowLoaded] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  // Measure prefers-reduced-motion to skip heavy delays if requested
  const prefersReducedMotion = typeof window !== "undefined" 
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches 
    : false;

  // Sync state values with refs to absolutely avoid closure bugs in the ticker interval
  const isVideoReadyRef = useRef(isVideoReady);
  const assetsLoadedRef = useRef(assetsLoaded);
  const timePassedRef = useRef(timePassed);
  const windowLoadedRef = useRef(windowLoaded);
  const minTimeElapsedRef = useRef(minTimeElapsed);

  useEffect(() => {
    isVideoReadyRef.current = isVideoReady;
  }, [isVideoReady]);

  useEffect(() => {
    assetsLoadedRef.current = assetsLoaded;
  }, [assetsLoaded]);

  useEffect(() => {
    timePassedRef.current = timePassed;
  }, [timePassed]);

  useEffect(() => {
    windowLoadedRef.current = windowLoaded;
  }, [windowLoaded]);

  useEffect(() => {
    minTimeElapsedRef.current = minTimeElapsed;
  }, [minTimeElapsed]);

  // Window load event listener
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (document.readyState === "complete") {
        setWindowLoaded(true);
      } else {
        const handleLoad = () => {
          setWindowLoaded(true);
        };
        window.addEventListener("load", handleLoad);
        return () => window.removeEventListener("load", handleLoad);
      }
    }
  }, []);

  // Minimum Delay of 1000ms
  useEffect(() => {
    const minDelayTimer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, prefersReducedMotion ? 100 : 1000);

    return () => clearTimeout(minDelayTimer);
  }, [prefersReducedMotion]);

  // Fail-safe timeout (increased to 5500ms for stable content loads on mobile)
  useEffect(() => {
    const maxTimeout = prefersReducedMotion ? 300 : 5500;
    const failSafeTimer = setTimeout(() => {
      setTimePassed(true);
    }, maxTimeout);

    return () => clearTimeout(failSafeTimer);
  }, [prefersReducedMotion]);

  // Asset loading with tight 3.5s absolute timeout
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

      // Maximum fast budget of 3500ms
      const timeoutPromise = new Promise((resolve) => setTimeout(resolve, prefersReducedMotion ? 300 : 3500));

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

        // Wait for fonts ready (assetsLoadedRef), page layout drawn (windowLoadedRef), video payload buffered (isVideoReadyRef), and min flicker delay elapsed (minTimeElapsedRef)
        const ready = (assetsLoadedRef.current && windowLoadedRef.current && minTimeElapsedRef.current) || timePassedRef.current;

        if (ready) {
          // Increment much faster if everything has fetched or client has timed out / reduced motion
          const next = prev + Math.floor(Math.random() * 8) + 5;
          return Math.min(next, 100);
        } else {
          if (prev < 82) {
            return prev + Math.floor(Math.random() * 4) + 2;
          } else if (prev < 95) {
            // Slower crawl to give video/window extra slice of time to fire complete states
            return prev + 1;
          } else {
            // Hold at 95% until conditions pass layout readiness check or fail-safe triggers
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
