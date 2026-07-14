import {
  ShoppingCart,
  Globe,
  Layers3,
  User,
  Building2,
  Code2,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    title: "E-commerce",
    description:
      "High-converting online stores with secure payments, inventory management, and optimized checkout experiences.",
    icon: ShoppingCart,
    iconColor: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    title: "Business Websites",
    description:
      "Professional websites that build trust, improve credibility, and convert visitors into customers.",
    icon: Globe,
    iconColor: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    title: "SaaS / Web Apps",
    description:
      "Scalable platforms, dashboards, CRM systems, and subscription-based applications built for growth.",
    icon: Layers3,
    iconColor: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    title: "Portfolio Websites",
    description:
      "Modern portfolios for freelancers, agencies, creators, and professionals that stand out.",
    icon: User,
    iconColor: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    title: "Industry Solutions",
    description:
      "Custom software for healthcare, logistics, education, real estate, manufacturing, and more.",
    icon: Building2,
    iconColor: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    title: "Custom Software",
    description:
      "Tailored software engineered from scratch to automate workflows and solve unique business challenges.",
    icon: Code2,
    iconColor: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
];

export default function ServicesSection() {
  return (
    <section className="relative bg-[#080C1B] py-32 overflow-hidden">

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

      <div className="relative max-w-[1450px] mx-auto px-8 lg:px-20">

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-20">

          <div>
            <p className="uppercase tracking-[6px] text-violet-400 text-sm font-semibold mb-5">
              WHAT WE BUILD
            </p>

            <h2 className="text-white text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08]">
              Six service verticals.
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                One seamless team.
              </span>
            </h2>
          </div>

          <button className="mt-10 lg:mt-0 flex items-center gap-2 text-gray-400 hover:text-white transition text-lg">
            See all services
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={index}
                className="
                group
                bg-[#12192E]
                border
                border-[#263353]
                rounded-[28px]
                p-9
                min-h-[280px]
                transition-all
                duration-500
                hover:-translate-y-2
                hover:border-violet-500/40
                hover:shadow-[0_20px_60px_rgba(124,58,237,.18)]
                "
              >
                <div
                  className={`w-16 h-16 rounded-2xl ${service.bg} flex items-center justify-center mb-8`}
                >
                  <Icon
                    size={30}
                    className={service.iconColor}
                  />
                </div>

                <h3 className="text-white text-[34px] font-bold mb-5 leading-none">
                  {service.title}
                </h3>

                <p className="text-gray-400 text-lg leading-8">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}