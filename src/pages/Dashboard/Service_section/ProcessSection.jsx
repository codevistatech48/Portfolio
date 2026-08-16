import { useRef, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  PenTool,
  Code2,
  Rocket,
  TrendingUp,
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";

import {
  Navigation,
  Pagination,
  Autoplay,
  Keyboard,
  A11y,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const AUTO_PLAY_INTERVAL = 1800;

const steps = [
  {
    id: "discover",
    number: "01",
    title: "Discover",
    description:
      "We align on users, outcomes, constraints, and the problem worth solving.",
    icon: Lightbulb,
    visual: (
      <div className="space-y-6">
        <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
            <Lightbulb size={24} className="text-blue-400" />
          </div>

          <div>
            <div className="text-sm font-semibold text-white">
              Research & Analysis
            </div>

            <div className="text-xs text-slate-400">
              User interviews, market research
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-1 text-2xl font-bold text-white">
              100+
            </div>

            <div className="text-xs text-slate-400">
              User interviews
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-1 text-2xl font-bold text-white">
              50+
            </div>

            <div className="text-xs text-slate-400">
              Competitor analyses
            </div>
          </div>
        </div>
      </div>
    ),
  },

  {
    id: "design",
    number: "02",
    title: "Design",
    description:
      "We turn the opportunity into a focused product plan and visual direction.",
    icon: PenTool,
    visual: (
      <div className="space-y-6">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-semibold text-white">
              Wireframe
            </div>

            <div className="text-xs text-slate-400">
              v2.0
            </div>
          </div>

          <div className="space-y-3">
            <div className="h-2 w-full rounded-full bg-blue-500/30" />
            <div className="h-2 w-4/5 rounded-full bg-violet-500/30" />
            <div className="h-2 w-3/5 rounded-full bg-cyan-500/30" />

            <div className="mt-4 flex gap-2">
              <div className="h-16 flex-1 rounded-lg border border-blue-400/20 bg-blue-500/10" />
              <div className="h-16 flex-1 rounded-lg border border-violet-400/20 bg-violet-500/10" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {["Figma", "Prototype", "User Test"].map((item) => (
            <div
              key={item}
              className="rounded-lg border border-white/10 bg-white/5 p-3 text-center"
            >
              <div className="text-xs text-slate-400">
                {item}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  {
    id: "build",
    number: "03",
    title: "Build",
    description:
      "Senior engineering brings the product to life with quality built in.",
    icon: Code2,
    visual: (
      <div className="space-y-6">
        <div className="rounded-xl border border-white/10 bg-[#0A0F1C] p-6 font-mono">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500/60" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
            <div className="h-3 w-3 rounded-full bg-green-500/60" />
          </div>

          <div className="space-y-2 text-sm">
            <div className="text-slate-400">
              $ npm run build
            </div>

            <div className="text-green-400">
              ✓ Compiled successfully
            </div>

            <div className="text-slate-400">
              $ npm run test
            </div>

            <div className="text-green-400">
              ✓ 47 tests passing
            </div>

            <div className="text-slate-400">
              $ git push production
            </div>

            <div className="text-blue-400">
              → Deploying to cloud...
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-2 text-xs text-slate-400">
              Code Quality
            </div>

            <div className="h-2 w-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-2 text-xs text-slate-400">
              Test Coverage
            </div>

            <div className="h-2 w-4/5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500" />
          </div>
        </div>
      </div>
    ),
  },

  {
    id: "launch",
    number: "04",
    title: "Launch",
    description:
      "We measure, learn, and improve the product after launch.",
    icon: Rocket,
    visual: (
      <div className="space-y-6">
        <div className="flex items-center justify-center p-8">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-blue-400/40">
              <Rocket
                size={40}
                className="text-blue-400"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-green-400/30 bg-green-500/10 p-4 text-center">
            <div className="text-lg font-bold text-green-300">
              ✓
            </div>

            <div className="mt-1 text-xs text-slate-300">
              Deployed
            </div>
          </div>

          <div className="rounded-xl border border-blue-400/30 bg-blue-500/10 p-4 text-center">
            <div className="text-lg font-bold text-blue-300">
              ✓
            </div>

            <div className="mt-1 text-xs text-slate-300">
              Monitored
            </div>
          </div>

          <div className="rounded-xl border border-violet-400/30 bg-violet-500/10 p-4 text-center">
            <div className="text-lg font-bold text-violet-300">
              ✓
            </div>

            <div className="mt-1 text-xs text-slate-300">
              Optimized
            </div>
          </div>
        </div>
      </div>
    ),
  },

  {
    id: "scale",
    number: "05",
    title: "Scale",
    description:
      "Continuous improvement and growth optimization for long-term success.",
    icon: TrendingUp,
    visual: (
      <div className="space-y-6">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="text-sm font-semibold text-white">
              Growth Metrics
            </div>

            <div className="text-xs text-green-400">
              +42.8% this quarter
            </div>
          </div>

          <div className="space-y-4">

            <div>
              <div className="mb-2 flex justify-between text-xs">
                <span className="text-slate-400">
                  Performance
                </span>

                <span className="text-white">
                  94%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-xs">
                <span className="text-slate-400">
                  Scalability
                </span>

                <span className="text-white">
                  89%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[89%] rounded-full bg-gradient-to-r from-violet-500 to-blue-500" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-xs">
                <span className="text-slate-400">
                  User Satisfaction
                </span>

                <span className="text-white">
                  98%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[98%] rounded-full bg-gradient-to-r from-cyan-500 to-violet-500" />
              </div>
            </div>

          </div>
        </div>
      </div>
    ),
  },
];

export default function ProcessSection() {
  const swiperRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  const handleStepClick = (index) => {
    if (!swiperRef.current) return;

    swiperRef.current.slideToLoop(index);
    setActiveStep(index);
  };

  const handleSlideChange = (swiper) => {
    setActiveStep(swiper.realIndex);
  };

  return (
    <section
      id="process"
      className="relative overflow-hidden bg-[#080C1B] py-20 sm:py-24 lg:py-28"
    >
      {/* Background Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(255,255,255,0.05) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,0.05) 1px,
              transparent 1px
            )
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-20 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[140px]" />

      <div className="relative mx-auto max-w-[1450px] px-5 sm:px-8 lg:px-10">

        {/* =========================
            HEADER
        ========================== */}

        <div className="mb-12 text-center sm:mb-14 lg:mb-16">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[5px] text-violet-400">
            OUR PROCESS
          </p>

          <h2 className="text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            How we turn ideas into products.
          </h2>
        </div>

        {/* =========================
            DESKTOP PROCESS NAVIGATION
        ========================== */}

        <div className="relative mb-10 hidden lg:block">

          {/* Timeline base */}
          <div className="absolute left-[10%] right-[10%] top-8 h-px bg-white/10" />

          {/* Timeline progress */}
          <div
            className="absolute left-[10%] top-8 h-px bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400 transition-all duration-500"
            style={{
              width: `${(activeStep / (steps.length - 1)) * 80}%`,
            }}
          />

          <div className="relative grid grid-cols-5">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const active = index === activeStep;
              const completed = index < activeStep;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => handleStepClick(index)}
                  aria-label={`Go to ${step.title} step`}
                  aria-selected={active}
                  role="tab"
                  className="group flex flex-col items-center text-center focus:outline-none"
                >

                  {/* Icon */}
                  <div
                    className={`
                      relative flex h-16 w-16 items-center justify-center
                      rounded-full border-2
                      transition-all duration-500
                      ${
                        active
                          ? "scale-110 border-blue-400/70 bg-blue-500/15 shadow-[0_0_35px_rgba(59,130,246,0.35)]"
                          : completed
                            ? "border-blue-400/30 bg-blue-500/10"
                            : "border-white/10 bg-white/[0.03] group-hover:border-blue-400/40"
                      }
                    `}
                  >
                    <Icon
                      size={24}
                      className={`
                        transition-all duration-300
                        ${
                          active || completed
                            ? "text-blue-400"
                            : "text-slate-500 group-hover:text-blue-400"
                        }
                      `}
                    />

                    {active && (
                      <span className="absolute inset-[-7px] rounded-full border border-blue-400/20 animate-pulse" />
                    )}
                  </div>

                  {/* Number */}
                  <span
                    className={`
                      mt-3 font-mono text-xs
                      ${
                        active
                          ? "text-blue-400"
                          : "text-slate-500"
                      }
                    `}
                  >
                    {step.number}
                  </span>

                  {/* Title */}
                  <span
                    className={`
                      mt-1 text-lg font-bold transition-colors duration-300
                      ${
                        active
                          ? "text-white"
                          : "text-slate-400 group-hover:text-white"
                      }
                    `}
                  >
                    {step.title}
                  </span>

                  {/* Description */}
                  <span className="mt-1 max-w-[220px] text-xs leading-relaxed text-slate-500">
                    {step.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================
            SWIPER
        ========================== */}

        <div className="relative">

          <Swiper
            modules={[
              Navigation,
              Pagination,
              Autoplay,
              Keyboard,
              A11y,
            ]}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={handleSlideChange}
            slidesPerView={1}
            spaceBetween={24}
            speed={650}
            loop={true}
            grabCursor={true}
            watchSlidesProgress={true}
            keyboard={{
              enabled: true,
              onlyInViewport: true,
            }}
            autoplay={{
              delay: AUTO_PLAY_INTERVAL,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
            }}
            navigation={{
              prevEl: ".process-prev",
              nextEl: ".process-next",
            }}
            className="process-swiper"
          >

            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <SwiperSlide key={step.id}>

                  <div
                    className="
                      min-h-[420px]
                      rounded-3xl
                      border border-white/10
                      bg-[#0D1526]/90
                      p-5
                      shadow-[0_20px_70px_rgba(0,0,0,0.35)]
                      backdrop-blur-xl
                      sm:p-8
                      lg:min-h-[430px]
                      lg:p-10
                    "
                  >

                    {/* Slide Header */}
                    <div className="mb-6 flex items-center gap-3">

                      <div
                        className="
                          flex h-12 w-12 shrink-0
                          items-center justify-center
                          rounded-xl
                          border border-blue-400/30
                          bg-blue-500/10
                        "
                      >
                        <Icon
                          size={24}
                          className="text-blue-400"
                        />
                      </div>

                      <div>
                        <div className="mb-1 font-mono text-xs text-blue-400">
                          {step.number}
                        </div>

                        <h3 className="text-2xl font-bold text-white sm:text-3xl">
                          {step.title}
                        </h3>
                      </div>

                      <div className="ml-auto hidden rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-500 sm:block">
                        {step.number} / 05
                      </div>
                    </div>

                    {/* Description */}
                    <p className="mb-6 max-w-4xl text-base leading-relaxed text-slate-300 sm:text-lg">
                      {step.description}
                    </p>

                    {/* Visual */}
                    <div>
                      {step.visual}
                    </div>

                  </div>

                </SwiperSlide>
              );
            })}

          </Swiper>

          {/* =========================
              PREVIOUS BUTTON
          ========================== */}

          <button
            type="button"
            className="
              process-prev
              absolute left-3 top-1/2 z-20
              hidden h-11 w-11
              -translate-y-1/2
              items-center justify-center
              rounded-full
              border border-white/10
              bg-[#0D1526]/90
              text-slate-300
              backdrop-blur-md
              transition-all duration-300
              hover:border-blue-400/50
              hover:bg-blue-500/10
              hover:text-white
              lg:flex
            "
            aria-label="Previous process step"
          >
            <ArrowLeft size={18} />
          </button>

          {/* =========================
              NEXT BUTTON
          ========================== */}

          <button
            type="button"
            className="
              process-next
              absolute right-3 top-1/2 z-20
              hidden h-11 w-11
              -translate-y-1/2
              items-center justify-center
              rounded-full
              border border-white/10
              bg-[#0D1526]/90
              text-slate-300
              backdrop-blur-md
              transition-all duration-300
              hover:border-blue-400/50
              hover:bg-blue-500/10
              hover:text-white
              lg:flex
            "
            aria-label="Next process step"
          >
            <ArrowRight size={18} />
          </button>

        </div>

        {/* =========================
            MOBILE NAVIGATION
        ========================== */}

        <div className="mt-6 flex justify-center gap-2 lg:hidden">

          {steps.map((step, index) => (
            <button
              key={step.id}
              type="button"
              onClick={() => handleStepClick(index)}
              aria-label={`Go to ${step.title}`}
              className={`
                h-1.5 rounded-full
                transition-all duration-300
                ${
                  index === activeStep
                    ? "w-8 bg-blue-400"
                    : "w-2 bg-white/20"
                }
              `}
            />
          ))}

        </div>

      </div>
    </section>
  );
}