import { useRef, useEffect, useState } from "react";
import { ArrowRight, Lightbulb, PenTool, Code2, Rocket, TrendingUp } from "lucide-react";

const steps = [
  {
    id: "discover",
    number: "01",
    title: "Discover",
    description: "We align on users, outcomes, constraints, and the problem worth solving.",
    icon: Lightbulb,
    visual: (
      <div className="space-y-6">
        <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5">
          <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Lightbulb size={24} className="text-blue-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Research & Analysis</div>
            <div className="text-xs text-slate-400">User interviews, market research</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl border border-white/10 bg-white/5">
            <div className="text-2xl font-bold text-white mb-1">100+</div>
            <div className="text-xs text-slate-400">User interviews</div>
          </div>
          <div className="p-4 rounded-xl border border-white/10 bg-white/5">
            <div className="text-2xl font-bold text-white mb-1">50+</div>
            <div className="text-xs text-slate-400">Competitor analyses</div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "design",
    number: "02",
    title: "Design",
    description: "We turn the opportunity into a focused product plan and visual direction.",
    icon: PenTool,
    visual: (
      <div className="space-y-6">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-white">Wireframe</div>
            <div className="text-xs text-slate-400">v2.0</div>
          </div>
          <div className="space-y-3">
            <div className="h-2 rounded-full bg-blue-500/30 w-full" />
            <div className="h-2 rounded-full bg-violet-500/30 w-4/5" />
            <div className="h-2 rounded-full bg-cyan-500/30 w-3/5" />
            <div className="flex gap-2 mt-4">
              <div className="h-16 flex-1 rounded-lg border border-blue-400/20 bg-blue-500/10" />
              <div className="h-16 flex-1 rounded-lg border border-violet-400/20 bg-violet-500/10" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 rounded-lg border border-white/10 bg-white/5 text-center">
            <div className="text-xs text-slate-400">Figma</div>
          </div>
          <div className="p-3 rounded-lg border border-white/10 bg-white/5 text-center">
            <div className="text-xs text-slate-400">Prototype</div>
          </div>
          <div className="p-3 rounded-lg border border-white/10 bg-white/5 text-center">
            <div className="text-xs text-slate-400">User Test</div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "build",
    number: "03",
    title: "Build",
    description: "Senior engineering brings the product to life with quality built in.",
    icon: Code2,
    visual: (
      <div className="space-y-6">
        <div className="rounded-xl border border-white/10 bg-[#0A0F1C] p-6 font-mono">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-3 w-3 rounded-full bg-red-500/60" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
            <div className="h-3 w-3 rounded-full bg-green-500/60" />
          </div>
          <div className="space-y-2 text-sm">
            <div className="text-slate-400">$ npm run build</div>
            <div className="text-green-400">✓ Compiled successfully</div>
            <div className="text-slate-400">$ npm run test</div>
            <div className="text-green-400">✓ 47 tests passing</div>
            <div className="text-slate-400">$ git push production</div>
            <div className="text-blue-400">→ Deploying to cloud...</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl border border-white/10 bg-white/5">
            <div className="text-xs text-slate-400 mb-2">Code Quality</div>
            <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 w-full" />
          </div>
          <div className="p-4 rounded-xl border border-white/10 bg-white/5">
            <div className="text-xs text-slate-400 mb-2">Test Coverage</div>
            <div className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 w-4/5" />
          </div>
        </div>
      </div>
    )
  },
  {
    id: "launch",
    number: "04",
    title: "Launch",
    description: "We measure, learn, and improve the product after launch.",
    icon: Rocket,
    visual: (
      <div className="space-y-6">
        <div className="flex items-center justify-center p-8">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="relative h-24 w-24 rounded-full border-2 border-blue-400/40 flex items-center justify-center">
              <Rocket size={40} className="text-blue-400" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-xl border border-green-400/30 bg-green-500/10 text-center">
            <div className="text-lg font-bold text-green-300">✓</div>
            <div className="text-xs text-slate-300 mt-1">Deployed</div>
          </div>
          <div className="p-4 rounded-xl border border-blue-400/30 bg-blue-500/10 text-center">
            <div className="text-lg font-bold text-blue-300">✓</div>
            <div className="text-xs text-slate-300 mt-1">Monitored</div>
          </div>
          <div className="p-4 rounded-xl border border-violet-400/30 bg-violet-500/10 text-center">
            <div className="text-lg font-bold text-violet-300">✓</div>
            <div className="text-xs text-slate-300 mt-1">Optimized</div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "scale",
    number: "05",
    title: "Scale",
    description: "Continuous improvement and growth optimization for long-term success.",
    icon: TrendingUp,
    visual: (
      <div className="space-y-6">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm font-semibold text-white">Growth Metrics</div>
            <div className="text-xs text-green-400">+42.8% this quarter</div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-400">Performance</span>
                <span className="text-white">94%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-400">Scalability</span>
                <span className="text-white">89%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-[89%] rounded-full bg-gradient-to-r from-violet-500 to-blue-500" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-400">User Satisfaction</span>
                <span className="text-white">98%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-[98%] rounded-full bg-gradient-to-r from-cyan-500 to-violet-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
];

const AUTO_PLAY_INTERVAL = 7000;

export default function ProcessSection() {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef(null);
  const stepRefs = useRef([]);
  const autoPlayRef = useRef(null);
  const hoverRef = useRef(false);
  const userClickedRef = useRef(false);
  const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Check if section is visible
  const [isVisible, setIsVisible] = useState(true);
  const visibilityRef = useRef(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
          visibilityRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Auto-play effect
  useEffect(() => {
    if (prefersReducedMotion || !isVisible) {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
      return;
    }

    // Start auto-play
    autoPlayRef.current = setInterval(() => {
      setActiveStep((prev) => {
        const next = (prev + 1) % steps.length;
        return next;
      });
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(autoPlayRef.current);
  }, [isVisible, prefersReducedMotion]);

  // Reset timer on manual click
  const handleStepClick = (index) => {
    userClickedRef.current = true;
    setActiveStep(index);

    // Reset the auto-play timer
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = setInterval(() => {
        setActiveStep((prev) => {
          const next = (prev + 1) % steps.length;
          return next;
        });
      }, AUTO_PLAY_INTERVAL);
    }
  };

  // Hover pause on desktop
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      const handleMouseEnter = () => {
        hoverRef.current = true;
        if (autoPlayRef.current) {
          clearInterval(autoPlayRef.current);
          autoPlayRef.current = null;
        }
      };

      const handleMouseLeave = () => {
        hoverRef.current = false;
        // Only restart if user hasn't clicked
        if (!userClickedRef.current && isVisible && !prefersReducedMotion) {
          autoPlayRef.current = setInterval(() => {
            setActiveStep((prev) => {
              const next = (prev + 1) % steps.length;
              return next;
            });
          }, AUTO_PLAY_INTERVAL);
        }
      };

      sectionRef.current.addEventListener("mouseenter", handleMouseEnter);
      sectionRef.current.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        sectionRef.current.removeEventListener("mouseenter", handleMouseEnter);
        sectionRef.current.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [isVisible, prefersReducedMotion, userClickedRef]);

  // Progress value for the active step (0 to 1)
  const progress = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion || !isVisible || hoverRef.current) {
      progress.current = 0;
      return;
    }

    // Reset progress when step changes
    progress.current = 0;

    const interval = setInterval(() => {
      progress.current = Math.min(progress.current + 0.01, 1);
      if (progress.current >= 1) {
        clearInterval(interval);
      }
    }, AUTO_PLAY_INTERVAL / 100);

    return () => clearInterval(interval);
  }, [activeStep, isVisible, prefersReducedMotion, hoverRef]);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative bg-[#080C1B] py-32 overflow-hidden"
      onMouseEnter={() => (hoverRef.current = true)}
      onMouseLeave={() => (hoverRef.current = false)}
    >
      {/* Grid Background */}
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

      <div className="relative max-w-[1450px] mx-auto px-6 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="mb-20 text-center">
          <p className="animate-on-scroll uppercase tracking-[6px] text-violet-400 text-sm font-semibold mb-5">
            OUR PROCESS
          </p>
          <h2 className="animate-on-scroll text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.08]">
            How we turn ideas into products.
          </h2>
        </div>

        {/* Desktop: Horizontal Timeline */}
        <div className="hidden lg:block">
          {/* Timeline Line */}
          <div className="relative mb-16">
            <div className="absolute left-0 right-0 h-px bg-white/10" />
            <div 
              className="absolute left-0 h-px bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-500"
              style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Timeline Steps */}
          <div className="grid grid-cols-5 gap-8 mb-16">
            {steps.map((step, index) => {
              const staggerClass = `stagger-${index + 1}`;
              const Icon = step.icon;
              const isActive = index === activeStep;
              const isPast = index < activeStep;

              // Calculate progress for this step
              const stepProgress = isActive ? Math.min(progress.current, 1) : 0;

              return (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(index)}
                  aria-selected={isActive}
                  role="tab"
                  className="relative w-full text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-2xl"
                >
                  {/* Step Circle */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`animate-on-scroll ${staggerClass} group relative flex items-center justify-center w-16 h-16 rounded-full border-2 transition-all duration-500 cursor-pointer`}
                      style={{
                        borderColor: isActive ? 'rgba(59, 130, 246, 0.6)' : isPast ? 'rgba(59, 130, 246, 0.4)' : 'rgba(255, 255, 255, 0.1)',
                        backgroundColor: isActive ? 'rgba(59, 130, 246, 0.15)' : isPast ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                        boxShadow: isActive ? '0 0 30px rgba(59, 130, 246, 0.4)' : 'none',
                        transform: isActive ? 'scale(1.05)' : 'scale(1)',
                      }}
                    >
                      <Icon size={24} className={`transition-all duration-300 ${isActive || isPast ? 'text-blue-400' : 'text-slate-500'} group-hover:scale-110`} />
                      
                      {/* Hover glow effect */}
                      <div className="absolute inset-0 rounded-full bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors duration-300" />
                    </div>

                    {/* Step Info */}
                    <div className="mt-4 text-center">
                      <div className={`text-xs font-mono mb-2 transition-all duration-300 ${isActive ? 'text-blue-400' : 'text-slate-500'} group-hover:translate-y-[-2px]`}>
                        {step.number}
                      </div>
                      <h3 className={`text-lg font-bold mb-1 transition-all duration-300 ${isActive ? 'text-white' : 'text-slate-400'} group-hover:text-white`}>
                        {step.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed hidden xl:block group-hover:text-slate-400 transition-colors duration-300">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Progress indicator - thin line */}
                  <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-full h-0.5 transition-all duration-500 ${isActive ? 'bg-blue-400' : 'bg-transparent'}`}
                    style={{ width: `${stepProgress * 100}%` }}
                  />
                </button>
              );
            })}
          </div>

          {/* Visual Panel */}
          <div
            className="rounded-3xl border border-white/10 bg-[#0D1526]/80 p-10 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all duration-500"
            style={{
              boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(59, 130, 246, 0.15)`
            }}
          >
            {steps[activeStep] && (
              <div key={steps[activeStep].id} className="animate-fadeIn">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl border border-blue-400/30 bg-blue-500/10">
                    {(() => {
                      const IconComponent = steps[activeStep].icon;
                      return <IconComponent size={24} className="text-blue-400" />;
                    })()}
                  </div>
                  <div>
                    <div className="text-xs font-mono text-blue-400 mb-1">{steps[activeStep].number}</div>
                    <h3 className="text-2xl font-bold text-white">{steps[activeStep].title}</h3>
                  </div>
                </div>
                <p className="text-slate-300 text-lg leading-relaxed mb-6">
                  {steps[activeStep].description}
                </p>
                {steps[activeStep].visual}
              </div>
            )}
          </div>
        </div>

        {/* Mobile: Vertical Timeline */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === activeStep;

            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(index)}
                aria-selected={isActive}
                role="tab"
                className="relative pl-16 w-full text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-2xl"
              >
                {/* Timeline Line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-6 top-16 bottom-0 w-px bg-white/10" />
                )}

                {/* Step Circle */}
                <div className="absolute left-0 top-0">
                  <div
                    className="group relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-500 cursor-pointer"
                    style={{
                      borderColor: isActive ? 'rgba(59, 130, 246, 0.6)' : 'rgba(255, 255, 255, 0.1)',
                      backgroundColor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                      boxShadow: isActive ? '0 0 20px rgba(59, 130, 246, 0.3)' : 'none',
                      transform: isActive ? 'scale(1.05)' : 'scale(1)',
                    }}
                  >
                    <Icon size={20} className={`transition-all duration-300 ${isActive ? 'text-blue-400' : 'text-slate-500'} group-hover:scale-110`} />
                    
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 rounded-full bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors duration-300" />
                  </div>
                </div>

                {/* Step Content */}
                <div
                  className="rounded-2xl border border-white/10 bg-[#0D1526]/60 p-6 backdrop-blur-sm transition-all duration-500 hover:border-blue-400/20 hover:bg-[#0D1526]/80"
                  style={{
                    borderColor: isActive ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div className="text-xs font-mono text-blue-400 mb-2">{step.number}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">
                    {step.description}
                  </p>
                  {isActive && (
                    <div className="animate-fadeIn">
                      {step.visual}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}