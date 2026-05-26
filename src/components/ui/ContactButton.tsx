import React from "react";

export function ContactButton({
  children = "Contact Me",
  onClick,
  className = "",
}: {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base text-white font-semibold uppercase tracking-widest relative overflow-hidden transition-all duration-300 hover:opacity-90 active:scale-95 hover:shadow-[0_0_30px_rgba(123,97,255,0.4)] ${className}`}
      style={{
        background: "linear-gradient(135deg, #00E5FF 0%, #3B82F6 50%, #7B61FF 100%)",
        boxShadow: "0px 4px 20px rgba(123, 97, 255, 0.35)",
      }}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}
