import React from "react";
import { FadeIn } from "./ui/FadeIn";
import { Activity, Droplets, ShieldOff } from "lucide-react";

const PAIN_POINTS = [
  {
    icon: <Activity className="w-8 h-8 md:w-10 md:h-10 text-cyan-400 mb-4 md:mb-6" />,
    title: "Ghost Town Traffic",
    desc: "Sitting on page 20 of Google while your competitors casually take all the high-intent local leads.",
  },
  {
    icon: <Droplets className="w-8 h-8 md:w-10 md:h-10 text-blue-400 mb-4 md:mb-6" />,
    title: "The Leaky Bucket",
    desc: "Paying for ads just for visitors to bounce immediately because your site loads slow or looks outdated.",
  },
  {
    icon: <ShieldOff className="w-8 h-8 md:w-10 md:h-10 text-indigo-400 mb-4 md:mb-6" />,
    title: "Wasted Authority",
    desc: "Being the absolute best local service provider in real life, but looking like an amateur online.",
  },
];

export function AgitateSection() {
  return (
    <section id="agitate" className="bg-black px-5 sm:px-8 md:px-10 py-16 sm:py-24 md:py-32 relative z-10">
      <div className="max-w-7xl mx-auto">
        <FadeIn delay={0}>
          <h2 className="text-[#D7E2EA] font-display font-bold uppercase text-[clamp(2rem,5vw,60px)] leading-tight tracking-tight mb-4 max-w-4xl">
            You run operations. We build{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#3B82F6] to-[#7B61FF]">
              the lead flow you deserve.
            </span>
          </h2>
        </FadeIn>

        <div className="mt-16 sm:mt-24 grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-14 md:gap-8 lg:gap-12">
          {PAIN_POINTS.map((point, index) => (
            <FadeIn delay={0.1 * (index + 1)} key={index} className="flex flex-col relative group">
              {/* Subtle accent border on hover */}
              <div className="absolute -inset-6 bg-white/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col">
                {point.icon}
                <h3 className="text-[#D7E2EA] font-display font-medium uppercase tracking-wide text-2xl mb-4">
                  {point.title}
                </h3>
                <p className="text-[#D7E2EA] font-light leading-relaxed text-lg sm:text-xl opacity-60">
                  {point.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
