import React from "react";
import { FadeIn } from "./ui/FadeIn";

const PROCESSES = [
  {
    step: "01",
    title: "The Diagnostics",
    desc: "We analyze why your current setup is leaking leads, identifying the exact gaps in your local SEO, UX, and conversion funnels.",
  },
  {
    step: "02",
    title: "Strategic Overhaul",
    desc: "We design a high-converting infrastructure tailored to your market. No generic templates—just intelligent design built to sell.",
  },
  {
    step: "03",
    title: "Performance Build",
    desc: "Deploying lightning-fast code and rigorous local SEO architecture so you rank at the top when customers are ready to buy.",
  },
  {
    step: "04",
    title: "The Growth Engine",
    desc: "We launch your new digital system. Then, we continuously monitor, refine, and optimize to ensure maximum local market capture.",
  }
];

export function ProcessSection() {
  return (
    <section id="process" className="bg-black px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24">
        {/* Left Side Sticky Header */}
        <div className="md:w-[40%] flex flex-col items-start relative">
          <div className="sticky top-32">
            <FadeIn delay={0}>
              <h2 className="text-[#D7E2EA] font-display font-black uppercase text-[clamp(2.5rem,8vw,100px)] leading-[1.1] tracking-tight mb-6">
                How It<br/>Works
              </h2>
            </FadeIn>
            <FadeIn delay={0.2} y={20}>
              <p className="text-[#D7E2EA]/60 text-lg sm:text-xl font-light max-w-sm">
                A streamlined, data-driven approach designed to get your local business ranking higher and converting better.
              </p>
            </FadeIn>
          </div>
        </div>

        {/* Right Side Process Steps */}
        <div className="md:w-[60%] flex flex-col gap-16 md:gap-24">
          {PROCESSES.map((item, index) => (
            <FadeIn delay={0.15 + index * 0.15} key={index} className="flex flex-col gap-6 relative group">
              {/* Number with decorative line */}
              <div className="flex items-center gap-6">
                <span className="text-white/30 font-display font-black text-6xl sm:text-8xl leading-none group-hover:text-[#7B61FF] transition-colors duration-500">
                  {item.step}
                </span>
                <div className="flex-grow h-px bg-white/10 group-hover:bg-[#7B61FF]/50 transition-colors duration-500"></div>
              </div>
              
              <div className="flex flex-col gap-4">
                <h3 className="text-[#D7E2EA] font-display font-bold text-2xl sm:text-3xl uppercase tracking-wide group-hover:text-white transition-colors">
                  {item.title}
                </h3>
                <p className="text-[#D7E2EA]/70 font-light text-lg sm:text-xl max-w-xl leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
