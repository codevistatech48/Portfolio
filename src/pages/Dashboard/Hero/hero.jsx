import { useEffect, useRef } from "react";
import { ArrowRight, ExternalLink, Layers3, ShieldCheck, Sparkles } from "lucide-react";
import heroImage from "../../../assets/landing.png";
import { initScrollAnimations, animateLayout } from "../../../utils/animator";

function Hero() {
  const tiltRef = useRef(null);

  useEffect(() => {
    // initialize scroll-based animations for elements with `.animate-on-scroll`
    initScrollAnimations(document);

    // small layout entrance animation for the 3D card
    if (tiltRef.current) animateLayout(tiltRef.current);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#080b18] px-6 pt-28 pb-24 text-white sm:px-8 lg:px-10">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -right-40 top-0 h-[34rem] w-[34rem] rounded-full bg-violet-600/15 blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20" />
      </div>

      <div className="relative mx-auto grid max-w-[1450px] grid-cols-1 items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 xl:gap-16">
        <div className="z-10 max-w-3xl">
          <div
            className="animate-on-scroll mb-8 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-5 py-3 text-sm font-medium text-violet-200 shadow-[0_0_0_1px_rgba(124,58,237,0.05)]"
            data-anim="fade-up"
            data-delay="80"
          >
            <span className="h-2 w-2 rounded-full bg-violet-300" />
            Now accepting projects for Q3 2026
          </div>

          <h1
            className="animate-on-scroll text-5xl font-extrabold leading-[1.03] tracking-tight sm:text-6xl lg:text-[5rem]"
            data-anim="fade-left"
            data-delay="160"
          >
            We build software
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
              that scales with you
            </span>
          </h1>

          <p
            className="animate-on-scroll mt-8 max-w-2xl text-lg leading-8 text-slate-400 sm:text-xl"
            data-anim="fade-up"
            data-delay="260"
          >
            CodeVista engineers end-to-end digital products — from e-commerce platforms to enterprise SaaS — with obsessive attention to performance, security, and craft.
          </p>

          <div
            className="animate-on-scroll mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
            data-anim="fade-up"
            data-delay="360"
          >
            <button className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-7 py-4 text-base font-semibold text-white shadow-[0_18px_40px_rgba(124,58,237,0.30)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(124,58,237,0.40)]">
              Start your project
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>

            <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-base font-semibold text-white/90 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-violet-400/35 hover:bg-white/10">
              View our work
              <ExternalLink size={17} />
            </button>
          </div>
        </div>

        <div className="relative flex min-h-[620px] items-center justify-center lg:min-h-[760px] [perspective:1800px]">
          <div className="absolute h-[34rem] w-[34rem] rounded-full border border-violet-400/10 shadow-[0_0_70px_rgba(124,58,237,0.08)] [transform:rotateX(72deg)] animate-[spin_30s_linear_infinite]" />
          <div className="absolute h-[26rem] w-[26rem] rounded-full border border-fuchsia-400/10 shadow-[0_0_70px_rgba(217,70,239,0.06)] [transform:rotateX(72deg)] animate-[spin_22s_linear_infinite]" />

          <div
            ref={tiltRef}
            className="animate-on-scroll relative z-10 w-full max-w-[620px] rounded-[2.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(18,24,40,0.97),rgba(8,11,24,0.94))] p-5 shadow-[0_40px_120px_rgba(0,0,0,0.45),0_0_100px_rgba(124,58,237,0.12)] backdrop-blur-md transition-transform duration-500 [transform-style:preserve-3d]"
            data-anim="fade-scale"
            data-delay="420"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200">
                <Sparkles size={14} />
                3D portfolio experience
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/15 px-4 py-2 text-xs font-semibold text-violet-100">
                <Layers3 size={14} />
                Premium delivery
              </span>
            </div>

            <div className="relative mt-5 overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#0b1120]">
              <img
                src={heroImage}
                alt="CodeVista company portfolio preview"
                className="h-[420px] w-full object-cover object-center opacity-95"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.45),transparent_70%)] blur-2xl" />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_35%,rgba(0,0,0,0.10))]" />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-200">
                <ShieldCheck size={16} className="shrink-0 text-violet-300" />
                Secure build process
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-200">
                <Sparkles size={16} className="shrink-0 text-fuchsia-300" />
                Motion-rich UI
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="animate-on-scroll rounded-[1.4rem] border border-white/10 bg-slate-900/80 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.30)] backdrop-blur-md" data-anim="fade-up" data-delay="520">
                <h2 className="text-4xl font-bold text-white">98%</h2>
                <p className="mt-2 text-sm text-slate-400">Client satisfaction</p>
              </div>

              <div className="animate-on-scroll rounded-[1.4rem] border border-white/10 bg-slate-900/80 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.30)] backdrop-blur-md" data-anim="fade-up" data-delay="640">
                <h2 className="text-4xl font-bold text-white">4.9★</h2>
                <p className="mt-2 text-sm text-slate-400">Average rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;