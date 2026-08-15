import { useEffect, useState, useRef } from "react";

const stats = [
  {
    value: 50,
    suffix: "+",
    label: "Projects delivered",
    description: "Across diverse industries"
  },
  {
    value: 8,
    suffix: "+",
    label: "Technologies",
    description: "Modern tech stack"
  },
  {
    value: 6,
    suffix: "+",
    label: "Core solutions",
    description: "End-to-end services"
  },
  {
    value: 5,
    suffix: "+",
    label: "Years experience",
    description: "Engineering excellence"
  }
];

function CountUp({ end, duration = 800, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [hasAnimated, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function StatsSection() {
  return (
    <section id="stats" className="relative bg-[#080C1B] py-24 overflow-hidden">
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-white/10 bg-[#0D1526]/60 p-6 sm:p-8 text-center backdrop-blur-sm transition-all duration-300 hover:border-blue-400/30 hover:bg-[#0D1526]/80"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-blue-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative z-10">
                {/* Number */}
                <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2">
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </div>

                {/* Label */}
                <div className="text-base sm:text-lg font-semibold text-blue-300 mb-1">
                  {stat.label}
                </div>

                {/* Description */}
                <div className="text-xs sm:text-sm text-slate-400">
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}