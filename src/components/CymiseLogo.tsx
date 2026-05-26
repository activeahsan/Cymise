import React from "react";

export function CymiseLogo({ className = "" }: { className?: string }) {
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = "/";
  };

  return (
    <a 
      href="/" 
      onClick={handleLogoClick}
      className={`flex items-center gap-2.5 shrink-0 cursor-pointer ${className}`}
    >
      <img src="/logo-mark.png" alt="Cymise Logo Mark" className="h-10 w-10 md:h-12 md:w-12 object-contain shrink-0" />
      <span className="text-white font-sans font-bold tracking-wider text-2xl md:text-[28px] lowercase leading-none relative -top-[2px] md:-top-[3px]">cymise</span>
    </a>
  );
}
