import React from "react";
import { ArrowUpRight } from "lucide-react";

export function FooterSection() {
  return (
    <footer className="bg-black text-white pt-20 pb-12 px-6 w-full relative z-40 border-t border-white/5 overflow-hidden">
      {/* Large Premium Wordmark Branding Block */}
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center pt-8 pb-14 select-none mb-12">
        <h2 className="font-display font-medium uppercase tracking-[0.25em] text-[#D7E2EA] text-[clamp(2.5rem,10vw,120px)] leading-none text-center">
          CYMISE
        </h2>
        <span className="mt-3 font-mono text-xs sm:text-sm text-gray-450 font-light block text-center tracking-wide">
          "sigh-mize"
        </span>
      </div>

      {/* Moved Segment below CYMISE Wordmark - Now highly readable and crisp */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-16 pt-12 border-t border-white/10">
        <div className="flex flex-col gap-4 max-w-sm">
          <h3 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
            Ready for guaranteed growth?
          </h3>
          <p className="text-gray-300 font-light text-sm leading-relaxed">
            You do what you do best, and we handle the marketing. Let's secure your local lead flow together.
          </p>
        </div>
        
        <div className="flex flex-col gap-2">
          {/* Enhanced font weight and light tint for pristine contrast readability */}
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#7B61FF] font-medium">Get in touch</span>
          <div className="flex flex-col gap-1">
            <a 
              href="mailto:ahsanzulfiqar655@gmail.com" 
              className="group inline-flex items-center gap-1.5 text-white hover:text-[#7B61FF] transition-colors text-lg font-bold font-sans"
            >
              ahsanzulfiqar655@gmail.com
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
      
      {/* Bottom Legal bar simplified */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-gray-400">
        <p>© 2025 Cymise. All rights reserved.</p>
        <p className="text-gray-500">Designed for ultimate local growth & speed.</p>
      </div>
    </footer>
  );
}
