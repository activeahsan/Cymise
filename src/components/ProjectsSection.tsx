import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "motion/react";
import { FadeIn } from "./ui/FadeIn";
import { LiveProjectButton } from "./ui/LiveProjectButton";

const PROJECTS = [
  {
    num: "01",
    cat: "Client",
    name: "Nextlevel Studio",
    images: {
      left1: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85",
      left2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85",
      right: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85"
    }
  },
  {
    num: "02",
    cat: "Personal",
    name: "Aura Brand Identity",
    images: {
      left1: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85",
      left2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85",
      right: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85"
    }
  },
  {
    num: "03",
    cat: "Client",
    name: "Solaris Digital",
    images: {
      left1: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85",
      left2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85",
      right: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85"
    }
  }
];

export function ProjectsSection() {
  return (
    <section id="projects" className="bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] relative z-20 px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 -mt-10 sm:-mt-12 md:-mt-14 pb-40">
      <div className="max-w-6xl mx-auto">
        <FadeIn delay={0}>
          <h2 className="text-center font-display font-black uppercase leading-none tracking-tight text-[clamp(3rem,12vw,160px)] bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent mb-16 sm:mb-20 md:mb-28">
            Project
          </h2>
        </FadeIn>

        <div className="flex flex-col relative w-full lg:px-10">
          {PROJECTS.map((project, index) => (
            <StickyCard key={index} index={index} project={project} totalCards={PROJECTS.length} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StickyCard({ index, project, totalCards }: { index: number; project: typeof PROJECTS[0]; totalCards: number; key?: React.Key }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0.1]);

  return (
    <div ref={containerRef} className="h-[85vh] w-full flex items-start justify-center">
      <motion.div 
        style={{ 
          scale,
          opacity,
          top: `calc(6rem + ${index * 28}px)`,
          willChange: "transform, opacity"
        }}
        className="sticky w-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8 flex flex-col gap-6 md:gap-8 shadow-2xl overflow-hidden"
      >
        {/* Top Content Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-10">
            <span className="text-[#D7E2EA] font-display font-black text-[clamp(2.5rem,6vw,90px)] leading-none shrink-0">
              {project.num}
            </span>
            <div className="flex flex-col gap-1 sm:gap-2">
              <span className="text-[#D7E2EA]/60 font-mono tracking-widest uppercase text-xs sm:text-sm">
                {project.cat}
              </span>
              <h3 className="text-[#D7E2EA] font-display font-bold text-2xl sm:text-3xl md:text-5xl tracking-tight">
                {project.name}
              </h3>
            </div>
          </div>
          
          <div className="md:ml-auto">
            <LiveProjectButton />
          </div>
        </div>

        {/* Bottom Image Grid */}
        <div className="flex gap-3 sm:gap-4 flex-grow w-full h-full">
          {/* Left Column (40%) */}
          <div className="flex flex-col gap-3 sm:gap-4 w-[40%]">
            <div className="h-[clamp(130px,16vw,230px)] rounded-[30px] sm:rounded-[40px] md:rounded-[50px] overflow-hidden shrink-0 translate-z-0">
              <img src={project.images.left1} alt={`${project.name} view 1`} className="w-full h-full object-cover select-none" loading="lazy" />
            </div>
            <div className="h-[clamp(160px,22vw,340px)] rounded-[30px] sm:rounded-[40px] md:rounded-[50px] overflow-hidden flex-grow translate-z-0">
              <img src={project.images.left2} alt={`${project.name} view 2`} className="w-full h-full object-cover select-none" loading="lazy" />
            </div>
          </div>
          {/* Right Column (60%) */}
          <div className="w-[60%] rounded-[30px] sm:rounded-[40px] md:rounded-[50px] overflow-hidden translate-z-0">
            <img src={project.images.right} alt={`${project.name} main view`} className="w-full h-full object-cover select-none" loading="lazy" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
