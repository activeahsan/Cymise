import { useScroll, useTransform, motion } from "motion/react";
import React, { useRef, useState, useEffect } from "react";

const ROW1_IMAGES = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
  "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
  "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
  "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
  "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
  "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
];

const ROW2_IMAGES = [
  "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
  "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
  "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
  "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
  "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
  "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
  "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
  "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
  "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
  "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif",
];

export function MarqueeSection() {
  const container = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });

  const row1X = useTransform(scrollYProgress, [0, 1], [-150, 150]);
  const row2X = useTransform(scrollYProgress, [0, 1], [150, -150]);

  // Restrict to first 5 items on mobile to cut data size in half and ensure fluid scrolling
  const row1Display = isMobile ? ROW1_IMAGES.slice(0, 5) : ROW1_IMAGES;
  const row2Display = isMobile ? ROW2_IMAGES.slice(0, 5) : ROW2_IMAGES;

  return (
    <section 
      ref={container}
      className="bg-black pt-16 sm:pt-24 md:pt-40 pb-6 w-full overflow-hidden max-w-full relative isolate block"
    >
      <div className="flex flex-col gap-2.5 sm:gap-3 w-full max-w-full overflow-hidden">
        <motion.div 
          className="flex gap-2.5 sm:gap-3 w-max"
          style={{ x: row1X, willChange: "transform" }}
        >
          {[...row1Display, ...row1Display].map((src, i) => (
            <div 
              key={i} 
              className="relative aspect-[420/270] w-[220px] h-[141px] xs:w-[280px] xs:h-[180px] sm:w-[340px] sm:h-[218px] md:w-[420px] md:h-[270px] rounded-2xl shrink-0 overflow-hidden bg-white/[0.02] border border-white/5 shadow-md flex items-center justify-center"
            >
              {/* Soft shimmer skeleton container loader underneath to prevent pure blank black cards */}
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-850 to-neutral-900 animate-pulse opacity-50 z-0 pointer-events-none" />
              <img 
                src={src} 
                alt="project preview" 
                width={420}
                height={270}
                loading="eager"
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.88] contrast-[1.02] group-hover:brightness-100 transition-all duration-300 pointer-events-none select-none z-10"
              />
            </div>
          ))}
        </motion.div>
        
        <motion.div 
          className="flex gap-2.5 sm:gap-3 w-max"
          style={{ x: row2X, willChange: "transform" }}
        >
          {[...row2Display, ...row2Display].map((src, i) => (
            <div 
              key={i} 
              className="relative aspect-[420/270] w-[220px] h-[141px] xs:w-[280px] xs:h-[180px] sm:w-[340px] sm:h-[218px] md:w-[420px] md:h-[270px] rounded-2xl shrink-0 overflow-hidden bg-white/[0.02] border border-white/5 shadow-md flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-850 to-neutral-900 animate-pulse opacity-50 z-0 pointer-events-none" />
              <img 
                src={src} 
                alt="project preview" 
                width={420}
                height={270}
                loading="eager"
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.88] contrast-[1.02] group-hover:brightness-100 transition-all duration-300 pointer-events-none select-none z-10"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
