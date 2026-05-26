import { useScroll, useTransform, motion } from "motion/react";
import React, { useRef } from "react";

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
  
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });

  const row1X = useTransform(scrollYProgress, [0, 1], [-150, 150]);
  const row2X = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section 
      ref={container}
      className="bg-black pt-24 sm:pt-32 md:pt-40 pb-10 w-full overflow-hidden max-w-full relative isolate block"
    >
      <div className="flex flex-col gap-3 w-full max-w-full overflow-hidden">
        <motion.div 
          className="flex gap-3 w-max"
          style={{ x: row1X, willChange: "transform" }}
        >
          {[...ROW1_IMAGES, ...ROW1_IMAGES].map((src, i) => (
            <img 
              key={i} 
              src={src} 
              alt="project preview" 
              width={420}
              height={270}
              loading="eager"
              className="w-[420px] h-[270px] rounded-2xl object-cover shrink-0 bg-neutral-900/40 border border-white/5"
            />
          ))}
        </motion.div>
        
        <motion.div 
          className="flex gap-3 w-max"
          style={{ x: row2X, willChange: "transform" }}
        >
          {[...ROW2_IMAGES, ...ROW2_IMAGES].map((src, i) => (
            <img 
              key={i} 
              src={src} 
              alt="project preview" 
              width={420}
              height={270}
              loading="eager"
              className="w-[420px] h-[270px] rounded-2xl object-cover shrink-0 bg-neutral-900/40 border border-white/5"
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
