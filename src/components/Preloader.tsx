import React, { useState, useEffect, useRef } from "react";
import { CymiseLogo } from "./CymiseLogo";

// Only track critical above-the-fold and section media for immediate display
const CRITICAL_ASSETS = [
  "/logo-mark.png",
  "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png",
  "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png",
  "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png",
  "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png",
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200&h=900",
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85"
];

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
  const [loadedCount, setLoadedCount] = useState(0);

  const totalCount = CRITICAL_ASSETS.length;

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
  const loadedCountRef = useRef(loadedCount);

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

  useEffect(() => {
    loadedCountRef.current = loadedCount;
  }, [loadedCount]);

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

  // Fail-safe timeout (increased to 8500ms for stable content loads on slow mobile)
  useEffect(() => {
    const maxTimeout = prefersReducedMotion ? 300 : 8500;
    const failSafeTimer = setTimeout(() => {
      setTimePassed(true);
    }, maxTimeout);

    return () => clearTimeout(failSafeTimer);
  }, [prefersReducedMotion]);

  // Real-time asset tracker & downloader with decoding support & safety timeouts
  useEffect(() => {
    let active = true;
    const timeoutsMap = new Map<string, any>();

    const onAssetCompeted = (src: string) => {
      if (!active) return;
      if (timeoutsMap.has(src)) {
        clearTimeout(timeoutsMap.get(src));
        timeoutsMap.delete(src);
      }
      setLoadedCount((prev) => prev + 1);
    };

    CRITICAL_ASSETS.forEach((src) => {
      const img = new Image();

      // Individual item failsafe timeout to prevent any loader blockages
      const handleId = setTimeout(() => {
        if ((import.meta as any).env?.DEV) {
          console.warn(`[DEBUG Preloader] Preload timed out for asset: ${src}`);
        }
        onAssetCompeted(src);
      }, 3500);
      timeoutsMap.set(src, handleId);

      img.onload = () => {
        if (typeof img.decode === "function") {
          img.decode()
            .then(() => onAssetCompeted(src))
            .catch(() => onAssetCompeted(src));
        } else {
          onAssetCompeted(src);
        }
      };

      img.onerror = () => {
        if ((import.meta as any).env?.DEV) {
          console.error(`[DEBUG Preloader] Preload failed for asset: ${src}`);
        }
        onAssetCompeted(src);
      };

      img.src = src;
    });

    // Font loading support
    const fontsPromise = (document as any).fonts 
      ? (document as any).fonts.ready 
      : Promise.resolve();

    fontsPromise.then(() => {
      if (active) setAssetsLoaded(true);
    });

    return () => {
      active = false;
      timeoutsMap.forEach((tid) => clearTimeout(tid));
    };
  }, []);

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

        const assetsAllDone = loadedCountRef.current >= totalCount;
        // Wait for fonts, page layout, critical assets, min delay OR fail-safe timeout
        const ready = (assetsAllDone && windowLoadedRef.current && minTimeElapsedRef.current) || timePassedRef.current;

        if (ready) {
          const next = prev + Math.floor(Math.random() * 8) + 5;
          return Math.min(next, 100);
        } else {
          // Progress follows ratio of assets actually loaded, capped strictly below 95%
          const ratioPercent = Math.floor((loadedCountRef.current / totalCount) * 90);
          const currentCap = Math.max(15, ratioPercent);

          if (prev < currentCap) {
            return prev + Math.floor(Math.random() * 2) + 1;
          } else {
            return prev;
          }
        }
      });
    }, 45);

    return () => clearInterval(interval);
  }, [prefersReducedMotion, totalCount]);

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
