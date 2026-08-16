import { useRef, useEffect, useState } from "react";
import { ArrowRight, ExternalLink, BrainCircuit, Cloud, Code2, LayoutDashboard, Zap } from "lucide-react";
import useMouseParallax from "../../../hooks/useMouseParallax";
import { Link } from "react-router-dom";

function Hero() {
  const tiltRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useMouseParallax({ intensity: 8, enabled: true, smoothing: 0.08 });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollParallax = (factor = 1) => ({
    transform: `translateY(${scrollY * factor}px)`,
    transition: "transform 0.1s ease-out",
  });

  return (
    <section id="home" className="relative overflow-hidden bg-[#05070D] px-6 pt-28 pb-24 text-white sm:px-8 lg:px-10">
      {/* Background Effects - decorative only, no stacking context on parent */}
      <div className="absolute inset-0 pointer-events-none">
        <div data-parallax="0.5" className="absolute -right-40 top-0 h-[34rem] w-[34rem] rounded-full bg-blue-600/10 blur-3xl" />
        <div data-parallax="0.3" className="absolute -left-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-violet-600/8 blur-3xl" />
        <div data-parallax="0.2" className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30" />
      </div>

      <div ref={heroRef} className="relative mx-auto grid max-w-[1450px] grid-cols-1 items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 xl:gap-16">
        {/* Left Content */}
        <div className="z-10 max-w-3xl" style={scrollParallax(-0.3)}>
          {/* Badge */}
          <div className="animate-on-scroll mb-8 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-5 py-3 text-sm font-medium text-blue-200">
            <span className="h-2 w-2 rounded-full bg-blue-300" />
            AI • SOFTWARE • INNOVATION
          </div>

          {/* Headline */}
          <h1 className="animate-on-scroll text-5xl font-extrabold leading-[1.03] tracking-tight sm:text-6xl lg:text-[5.5rem]">
            Software that moves
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-300 bg-clip-text text-transparent">
              your business forward.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="animate-on-scroll mt-8 max-w-2xl text-lg leading-8 text-slate-400 sm:text-xl">
            CodeVisions designs and builds secure, scalable digital products that turn ambitious ideas into high-performing experiences.
          </p>

          {/* CTA Buttons */}
     <div className="animate-on-scroll mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">

  {/* Start a Project → Login */}
  <Link
    to="/login"
    className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-7 py-4 text-base font-semibold text-white shadow-[0_18px_40px_rgba(59,130,246,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(59,130,246,0.50)]"
  >
    <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

    <span className="relative flex items-center gap-2">
      Start a project

      <ArrowRight
        size={18}
        className="transition-transform duration-300 group-hover:translate-x-1"
      />
    </span>
  </Link>

  {/* Explore Our Work → Projects */}
  <Link
    to="/projects"
    className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-base font-semibold text-white/90 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/35 hover:bg-white/10"
  >
    Explore our work

    <ExternalLink
      size={17}
      className="transition-transform duration-300 group-hover:translate-x-1"
    />
  </Link>

</div>
        </div>

        {/* Right Visual - Floating Panels */}
        <div className="relative flex min-h-[620px] items-center justify-center lg:min-h-[760px] [perspective:1800px]">
          {/* Orbiting rings - decorative, parallax applied to these only */}
          <div 
            data-parallax="0.2"
            className="absolute h-[34rem] w-[34rem] rounded-full border border-blue-400/10 shadow-[0_0_70px_rgba(59,130,246,0.08)] [transform:rotateX(72deg)] animate-[spin_30s_linear_infinite]"
          />
          <div 
            data-parallax="0.15"
            className="absolute h-[26rem] w-[26rem] rounded-full border border-violet-400/10 shadow-[0_0_70px_rgba(139,92,246,0.06)] [transform:rotateX(72deg)] animate-[spin_22s_linear_infinite]"
          />

          {/* Floating Panels Container */}
          <div ref={tiltRef} className="relative z-10 w-full max-w-[620px]">
            {/* Panel 1 - AI Analytics */}
            <div 
              data-parallax="1"
              className="absolute -left-4 top-8 w-64 rounded-2xl border border-white/10 bg-[#0D1425]/90 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-violet-500/40 hover:shadow-[0_25px_70px_rgba(124,58,237,0.2)]"
            >
              <div className="flex items-center gap-2 mb-3">
                <BrainCircuit size={18} className="text-violet-400" />
                <span className="text-xs font-semibold text-slate-200">AI Analytics</span>
              </div>
              <div className="space-y-2">
                <div className="h-2 rounded-full bg-blue-500/30 w-full transition-all duration-300 group-hover:w-full" />
                <div className="h-2 rounded-full bg-violet-500/30 w-4/5" />
                <div className="h-2 rounded-full bg-cyan-500/30 w-3/5" />
              </div>
            </div>

            {/* Panel 2 - Code Terminal */}
            <div 
              data-parallax="1.2"
              className="absolute -right-4 top-16 w-56 rounded-2xl border border-white/10 bg-[#0D1425]/90 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-cyan-500/40 hover:shadow-[0_25px_70px_rgba(34,211,238,0.15)]"
            >
              <div className="flex items-center gap-2 mb-3">
                <Code2 size={18} className="text-cyan-400" />
                <span className="text-xs font-semibold text-slate-200">Terminal</span>
              </div>
              <div className="font-mono text-xs text-slate-400 space-y-1">
                <div>$ npm run build</div>
                <div className="text-green-400">✓ Built in 2.4s</div>
              </div>
            </div>

            {/* Panel 3 - API Architecture */}
            <div 
              data-parallax="0.8"
              className="absolute left-8 bottom-24 w-60 rounded-2xl border border-white/10 bg-[#0D1425]/90 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/40 hover:shadow-[0_25px_70px_rgba(59,130,246,0.15)]"
            >
              <div className="flex items-center gap-2 mb-3">
                <LayoutDashboard size={18} className="text-blue-400" />
                <span className="text-xs font-semibold text-slate-200">API Gateway</span>
              </div>
              <div className="flex gap-2">
                <div className="h-12 w-12 rounded-lg bg-blue-500/10 border border-blue-400/20" />
                <div className="h-12 w-12 rounded-lg bg-violet-500/10 border border-violet-400/20" />
                <div className="h-12 w-12 rounded-lg bg-cyan-500/10 border border-cyan-400/20" />
              </div>
            </div>

            {/* Panel 4 - Cloud Stats */}
            <div 
              data-parallax="0.9"
              className="absolute right-8 bottom-32 w-52 rounded-2xl border border-white/10 bg-[#0D1425]/90 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-violet-500/40 hover:shadow-[0_25px_70px_rgba(124,58,237,0.15)]"
            >
              <div className="flex items-center gap-2 mb-3">
                <Cloud size={18} className="text-slate-300" />
                <span className="text-xs font-semibold text-slate-200">Cloud</span>
              </div>
              <div className="text-2xl font-bold text-white">99.9%</div>
              <div className="text-xs text-slate-400">Uptime SLA</div>
            </div>

            {/* Small Tech Badges */}
            <div 
              data-parallax="0.4"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-3"
            >
              <div className="rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-200 backdrop-blur-sm">
                AI
              </div>
              <div className="rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-xs font-semibold text-violet-200 backdrop-blur-sm">
                Cloud
              </div>
              <div className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-200 backdrop-blur-sm">
                API
              </div>
              <div className="rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-4 py-2 text-xs font-semibold text-fuchsia-200 backdrop-blur-sm">
                Automation
              </div>
            </div>

            {/* Center Glowing Sphere */}
            <div 
              data-parallax="0.4"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-gradient-to-br from-blue-600/20 to-violet-600/20 blur-3xl transition-all duration-300"
            />
            <div 
              data-parallax="0.4"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-48 rounded-full border border-blue-400/30 shadow-[0_0_80px_rgba(59,130,246,0.4)] transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;