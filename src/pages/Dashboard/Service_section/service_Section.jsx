import { useState } from "react";
import { ArrowRight, BrainCircuit, Cloud, Code2, Globe, Layers3, Smartphone, Zap } from "lucide-react";

const services = [
  {
    id: "ai",
    title: "AI Engineering",
    icon: BrainCircuit,
    description: "Intelligent systems that learn, adapt, and automate complex workflows.",
    tech: ["LLM Integration", "AI Agents", "RAG", "AI Automation"],
    color: "violet"
  },
  {
    id: "web",
    title: "Web & SaaS Development",
    icon: Globe,
    description: "Scalable, high-performance web applications built with modern frameworks.",
    tech: ["React", "Next.js", "TypeScript", "Scalable APIs"],
    color: "blue"
  },
  {
    id: "mobile",
    title: "Mobile Development",
    icon: Smartphone,
    description: "Native and cross-platform mobile experiences that users love.",
    tech: ["iOS/Android", "React Native", "Flutter", "Mobile-first Design"],
    color: "cyan"
  },
  {
    id: "backend",
    title: "Backend & APIs",
    icon: Code2,
    description: "Robust, scalable backend systems and APIs that power your applications.",
    tech: ["Node.js", "Python", "REST APIs", "Databases"],
    color: "blue"
  },
  {
    id: "cloud",
    title: "Cloud & DevOps",
    icon: Cloud,
    description: "Infrastructure automation, CI/CD pipelines, and cloud architecture.",
    tech: ["Cloud Infrastructure", "CI/CD", "Monitoring", "Scalability"],
    color: "violet"
  },
  {
    id: "automation",
    title: "Automation",
    icon: Zap,
    description: "Streamline workflows and eliminate manual processes with intelligent automation.",
    tech: ["Process Automation", "Workflow Design", "Integration", "Testing"],
    color: "cyan"
  },
];

export default function ServicesSection() {
  const [selectedService, setSelectedService] = useState(services[0]);
  const [hoveredService, setHoveredService] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);

  const activeService = hoveredService || selectedService;

  return (
    <section id="services" className="relative bg-[#080C1B] py-32 overflow-hidden">
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
        <div className="mb-20">
          <p className="animate-on-scroll uppercase tracking-[6px] text-violet-400 text-sm font-semibold mb-5">
            WHAT WE BUILD
          </p>
          <h2 className="animate-on-scroll text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.08] max-w-3xl">
            From idea to intelligent product.
          </h2>
          <p className="animate-on-scroll mt-6 text-lg text-slate-400 max-w-2xl">
            We design and engineer digital products that combine exceptional user experience with scalable technology.
          </p>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Service List */}
          <div className="space-y-3">
            {services.map((service) => {
              const Icon = service.icon;
              const isActive = activeService?.id === service.id;
              const isExpanded = mobileExpanded === service.id;

              return (
                <div
                  key={service.id}
                  className="animate-on-scroll relative rounded-2xl border transition-all duration-300 overflow-hidden"
                  style={{
                    borderColor: isActive ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255, 255, 255, 0.08)',
                    backgroundColor: isActive ? 'rgba(59, 130, 246, 0.08)' : 'rgba(13, 21, 38, 0.6)',
                    backdropFilter: 'blur(12px)',
                  }}
                  onMouseEnter={() => setHoveredService(service)}
                  onMouseLeave={() => setHoveredService(null)}
                >
                  <button
                    onClick={() => {
                      setSelectedService(service);
                      setMobileExpanded(isExpanded ? null : service.id);
                    }}
                    className="w-full text-left p-6 flex items-start gap-4"
                  >
                    {/* Active Indicator */}
                    <div className="relative flex items-center justify-center w-12 h-12 rounded-xl border transition-all duration-300 flex-shrink-0"
                      style={{
                        borderColor: isActive ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255, 255, 255, 0.1)',
                        backgroundColor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                      }}
                    >
                      <Icon size={24} className={isActive ? 'text-blue-400' : 'text-slate-400'} />
                    </div>

                    {/* Service Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg font-bold mb-1 transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-200'}`}>
                        {service.title}
                      </h3>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {service.description}
                      </p>

                      {/* Expandable Tech List (Mobile) */}
                      <div className={`mt-4 space-y-2 transition-all duration-300 lg:hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                        {service.tech.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Arrow Indicator */}
                    <div className={`flex-shrink-0 transition-transform duration-300 ${isActive ? 'translate-x-1' : ''}`}>
                      <ArrowRight size={18} className={isActive ? 'text-blue-400' : 'text-slate-500'} />
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Right: Visualization Panel */}
          <div className="hidden lg:block">
            <div
              key={activeService?.id}
              className="sticky top-32 rounded-3xl border border-white/10 bg-[#0D1526]/80 p-10 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all duration-500"
              style={{
                boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 40px ${activeService?.color === 'violet' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(59, 130, 246, 0.15)'}`
              }}
            >
              {/* Service Icon */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl border border-blue-400/30 bg-blue-500/10">
                  {activeService && <activeService.icon size={28} className="text-blue-400" />}
                </div>
                <h3 className="text-2xl font-bold text-white">{activeService?.title}</h3>
              </div>

              {/* Service Description */}
              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                {activeService?.description}
              </p>

              {/* Tech Stack Grid */}
              <div className="grid grid-cols-2 gap-4">
                {activeService?.tech.map((item, idx) => (
                  <div
                    key={idx}
                    className="group relative rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:border-blue-400/40 hover:bg-blue-500/10"
                    style={{
                      animation: `fadeInUp 0.5s ease-out ${idx * 0.1}s both`
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-blue-400 group-hover:shadow-[0_0_8px_rgba(59,130,246,0.6)] transition-shadow duration-300" />
                      <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors duration-300">
                        {item}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button className="mt-8 inline-flex items-center gap-2 text-blue-300 hover:text-white transition-colors duration-300 group">
                Learn more about this service
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}