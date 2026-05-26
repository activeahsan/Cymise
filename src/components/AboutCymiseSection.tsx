import React from "react";
import { FadeIn } from "./ui/FadeIn";

export function AboutCymiseSection() {
  return (
    <section id="about" className="bg-black px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-30 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 md:gap-24 items-center">
        {/* Left Typography Column: Editorial/Modern Aesthetic */}
        <div className="md:w-1/2">
          <FadeIn delay={0}>
            <div className="mb-8">
              <span className="text-[#7B61FF] font-mono text-sm tracking-widest uppercase font-semibold">About Cymise</span>
            </div>
            <h2 className="text-[#D7E2EA] font-display font-black uppercase text-[clamp(2.5rem,6vw,80px)] leading-[1] tracking-tight mb-8">
              More client turnover. Fewer marketing headaches.
            </h2>
            <p className="text-[#D7E2EA]/70 font-light text-lg sm:text-xl leading-relaxed mb-8">
              You didn't start a local service business to spend your valuable weekends struggling with local SEO, website speeds, or paid ads. You became an entrepreneur to deliver excellent results to your clients. That is why Cymise handles 100% of your digital marketing and client acquisition pipelines.
            </p>
            <p className="text-[#D7E2EA]/70 font-light text-lg sm:text-xl leading-relaxed">
              We back our work with an ironclad guarantee: we deliver more traffic, more leads, and more high-value clients to your doorstep, or we keep working for free. Together, we'll take your business to the next level.
            </p>
          </FadeIn>
        </div>

        {/* Right Column: Premium Grayscale to Saturated Color Hover Image Container */}
        <div className="md:w-1/2 w-full flex justify-center mt-10 md:mt-0 select-none group">
          <FadeIn delay={0.2} className="w-full relative">
            {/* Soft background ambient gradient glow behind image */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#7B61FF]/10 to-[#00E5FF]/10 rounded-[40px] blur-2xl opacity-40 group-hover:opacity-80 transition-opacity duration-700 pointer-events-none" />
            
            <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-white/5 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
              <img 
                src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200&h=900" 
                alt="Cymise Digital Infrastructure" 
                className="w-full h-full object-cover filter grayscale contrast-[1.15] brightness-90 hover:grayscale-0 hover:scale-105 hover:brightness-100 transition-all duration-[800ms] ease-out cursor-pointer"
                referrerPolicy="no-referrer"
              />
              {/* Subtle inner overlay frame */}
              <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-3xl transition-colors duration-700 group-hover:border-[#7B61FF]/30" />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
