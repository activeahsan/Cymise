import React from "react";
import { FadeIn } from "./ui/FadeIn";
import { Magnet } from "./ui/Magnet";
import { AnimatedText } from "./ui/AnimatedText";
import { ContactButton } from "./ui/ContactButton";

export function AboutSection() {
  return (
    <section id="problem" className="relative min-h-screen flex flex-col items-center justify-center bg-black px-5 sm:px-8 md:px-10 py-20 overflow-hidden">
      {/* Decorative 3D Images */}
      <FadeIn delay={0.1} x={0} y={15} duration={0.9} className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] w-[50px] sm:w-[160px] md:w-[210px] pointer-events-none select-none z-0 opacity-15 sm:opacity-95">
        <img 
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png" 
          alt="moon decoration" 
          className="w-full h-auto object-contain"
        />
      </FadeIn>
      
      <FadeIn delay={0.25} x={0} y={15} duration={0.9} className="absolute bottom-[1%] left-[1%] sm:left-[6%] md:left-[10%] w-[40px] sm:w-[140px] md:w-[180px] pointer-events-none select-none z-0 opacity-[0.08] sm:opacity-95">
        <img 
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png" 
          alt="3d object decoration" 
          className="w-full h-auto object-contain"
          referrerPolicy="no-referrer"
        />
      </FadeIn>

      <FadeIn delay={0.15} x={0} y={15} duration={0.9} className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] w-[50px] sm:w-[160px] md:w-[210px] pointer-events-none select-none z-0 opacity-15 sm:opacity-95">
        <img 
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png" 
          alt="lego decoration" 
          className="w-full h-auto object-contain"
        />
      </FadeIn>

      <FadeIn delay={0.3} x={0} y={15} duration={0.9} className="absolute bottom-[1%] right-[1%] sm:right-[6%] md:right-[10%] w-[60px] sm:w-[170px] md:w-[220px] pointer-events-none select-none z-0 opacity-[0.08] sm:opacity-95">
        <img 
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png" 
          alt="3d group decoration" 
          className="w-full h-auto object-contain"
          referrerPolicy="no-referrer"
        />
      </FadeIn>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <FadeIn delay={0} y={40}>
          <h2 className="font-display font-bold uppercase leading-tight tracking-tight text-[clamp(2.5rem,7vw,100px)] max-w-5xl mx-auto text-[#D7E2EA] mb-6">
            You didn't start your company to{" "}
            <span className="bg-gradient-to-r from-[#00E5FF] via-[#3B82F6] to-[#7B61FF] bg-clip-text text-transparent">
              struggle with marketing.
            </span>
          </h2>
        </FadeIn>

        <div className="mt-8 sm:mt-10 md:mt-12 w-full max-w-[680px]">
          <AnimatedText 
            text="You have a business to run and clients to serve. We recognize that business owners are busy and didn't become entrepreneurs to become marketing experts. That's why we handle all the heavy lifting for you — delivering high-performing local growth engines backed by a solid guarantee." 
            className="text-[#D7E2EA] font-medium leading-relaxed text-[clamp(1rem,2vw,1.35rem)] text-center opacity-80"
          />
        </div>

        <div className="mt-12 sm:mt-20 md:mt-24 pointer-events-auto relative z-20">
          <div onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="cursor-pointer inline-block">
            <Magnet>
              <ContactButton>Let's Take Care of Your Growth</ContactButton>
            </Magnet>
          </div>
        </div>
      </div>
    </section>
  );
}

