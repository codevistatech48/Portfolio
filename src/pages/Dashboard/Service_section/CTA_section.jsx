import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative bg-[#080C1B] py-24 overflow-hidden">

      {/* Background Grid */}
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

      <div className="relative max-w-[1500px] mx-auto px-8 lg:px-16">

        <div
          className="
            relative
            overflow-hidden
            rounded-[38px]
            px-8
            py-24
            text-center
            bg-gradient-to-r
            from-[#5A4BFF]
            via-[#7B3FF2]
            to-[#A400E6]
            shadow-[0_30px_80px_rgba(124,58,237,.35)]
          "
        >
          {/* Glow */}
          <div className="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-white/10 blur-[120px]" />

          <div className="relative z-10">

            <h2 className="text-white font-bold text-5xl md:text-6xl leading-tight">
              Ready to build something extraordinary?
            </h2>

            <p className="mt-8 text-white/85 text-xl max-w-3xl mx-auto leading-9">
              Share your brief and get a complete Software Requirement
              Specification (SRS) document along with an accurate project
              estimate within 48 hours — completely free.
            </p>

            <button
              className="
                group
                mt-12
                inline-flex
                items-center
                gap-3
                rounded-2xl
                bg-white
                px-12
                py-5
                text-xl
                font-semibold
                text-[#4F46E5]
                transition-all
                duration-300
                hover:scale-105
                hover:shadow-2xl
              "
            >
              Get your free quote

              <ArrowRight
                size={24}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}