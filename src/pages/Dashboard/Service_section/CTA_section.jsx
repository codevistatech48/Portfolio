import { useRef, useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export default function CTASection() {
  const sectionRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (window.innerWidth < 1024) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const glowStyle = {
    transform: `translate(${mousePos.x * 8}px, ${mousePos.y * 8}px)`,
    transition: "transform 0.4s ease-out",
  };

  return (
    <section id="contact" ref={sectionRef} className="relative bg-[#080C1B] py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Center electric-blue glow that follows cursor */}
        <div
          className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/15 blur-[120px]"
          style={glowStyle}
        />
        
        {/* Subtle purple accent */}
        <div className="absolute right-10 top-10 h-[300px] w-[300px] rounded-full bg-violet-600/10 blur-[100px]" />
        
        {/* Technical grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Concentric circles behind headline */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[420px] w-[420px] rounded-full border border-white/5" />
          <div className="absolute inset-8 rounded-full border border-white/5" />
          <div className="absolute inset-16 rounded-full border border-white/5" />
        </div>
      </div>

      <div className="relative max-w-[1450px] mx-auto px-6 sm:px-8 lg:px-10">
        <div className="relative mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="animate-on-scroll mb-8 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-5 py-2.5 text-sm font-medium text-blue-200">
            <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            LET'S BUILD SOMETHING
          </div>

          {/* Headline */}
          <h2 className="animate-on-scroll text-white font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
            Have an idea worth building?
          </h2>

          {/* Supporting text */}
          <p className="animate-on-scroll text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Let's turn your idea into a scalable digital product.
          </p>

          {/* CTA Buttons */}
        

          {/* Availability indicator */}
          <div className="animate-on-scroll mt-10 inline-flex items-center gap-2 text-sm text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Available for new projects
          </div>
        </div>
      </div>
    </section>
  );
}