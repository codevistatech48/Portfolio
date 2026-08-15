import { useState } from "react";
import { Globe, Server, Cpu, Database, Cloud, ArrowRight, Zap } from "lucide-react";

const technologies = [
  { name: "React", description: "Modern component-based frontend architecture." },
  { name: "Next.js", description: "Production-grade React framework with SSR and performance." },
  { name: "Node.js", description: "Scalable JavaScript runtime for backend services." },
  { name: "Python", description: "Backend services, automation and AI integrations." },
  { name: "Java", description: "Enterprise-grade backend systems and services." },
  { name: "MongoDB", description: "Flexible data storage for modern applications." },
  { name: "MySQL", description: "Reliable relational database management." },
  { name: "AI", description: "LLM integrations, agents and intelligent automation." },
  { name: "Cloud", description: "Deployment, infrastructure and scalability." },
];

const architectureNodes = [
  {
    id: "client",
    label: "Client",
    icon: Globe,
    description: "Where the user interacts with the product.",
    tech: ["Web", "Mobile", "Browser", "React"]
  },
  {
    id: "api",
    label: "API",
    icon: Server,
    description: "Secure communication layer connecting applications and services.",
    tech: ["REST", "Node.js", "Python"]
  },
  {
    id: "ai",
    label: "AI Engine",
    icon: Cpu,
    description: "Intelligent processing and automation layer.",
    tech: ["LLMs", "AI Agents", "RAG", "Automation"]
  },
  {
    id: "database",
    label: "Database",
    icon: Database,
    description: "Reliable data storage and retrieval.",
    tech: ["MongoDB", "MySQL", "Redis"]
  },
  {
    id: "cloud",
    label: "Cloud",
    icon: Cloud,
    description: "Deployment, infrastructure and scalability.",
    tech: ["Cloud", "CI/CD", "Monitoring"]
  }
];

export default function TechnologySection() {
  const [selectedTech, setSelectedTech] = useState(null);
  const [activeNode, setActiveNode] = useState(0);

  const handleTechClick = (tech) => {
    setSelectedTech(selectedTech?.name === tech.name ? null : tech);
  };

  const handleNodeClick = (index) => {
    setActiveNode(index);
  };

  return (
    <section id="technology" className="relative bg-[#080C1B] py-24 overflow-hidden">
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
        <div className="mb-10 text-center">
          <p className="animate-on-scroll uppercase tracking-[6px] text-violet-400 text-sm font-semibold mb-4">
            TECHNOLOGY STACK
          </p>
          <h2 className="animate-on-scroll text-white text-4xl md:text-5xl font-bold leading-[1.08]">
            Built with modern technology.
          </h2>
        </div>

        {/* Technology Pills */}
        <div className="mb-14">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {technologies.map((tech) => {
              const isSelected = selectedTech?.name === tech.name;
              return (
                <button
                  key={tech.name}
                  onClick={() => handleTechClick(tech)}
                  className={`group inline-flex items-center gap-2 rounded-full border px-5 py-2.5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 ${
                    isSelected
                      ? "border-blue-400/60 bg-blue-500/15 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                      : "border-white/10 bg-white/5 text-slate-200 hover:border-blue-400/40 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Zap size={14} className={`transition-colors duration-300 ${isSelected ? "text-blue-400" : "text-blue-400/60 group-hover:text-blue-400"}`} />
                  <span className="text-sm font-semibold">{tech.name}</span>
                </button>
              );
            })}
          </div>

          {/* Selected tech info */}
          {selectedTech && (
            <div className="mt-4 flex justify-center animate-fadeIn">
              <div className="inline-flex items-center gap-3 rounded-xl border border-blue-400/30 bg-blue-500/10 px-5 py-3 backdrop-blur-sm">
                <Zap size={16} className="text-blue-400" />
                <span className="text-sm text-slate-200">{selectedTech.description}</span>
              </div>
            </div>
          )}
        </div>

        {/* Architecture Visualization */}
        <div className="rounded-3xl border border-white/10 bg-[#0D1526]/60 p-6 sm:p-8 backdrop-blur-xl">
          {/* Title */}
          <div className="mb-6 text-center">
            <h3 className="text-xl font-bold text-white mb-1">How We Build Software Systems</h3>
            <p className="text-sm text-slate-400">From user request to delivered response</p>
          </div>

          {/* Architecture Flow - Desktop */}
          <div className="hidden lg:flex items-center justify-between gap-4 mb-6">
            {architectureNodes.map((node, index) => {
              const Icon = node.icon;
              const isActive = index === activeNode;
              const isPast = index < activeNode;

              return (
                <div key={node.id} className="flex items-center flex-1">
                  {/* Node */}
                  <button
                    onClick={() => handleNodeClick(index)}
                    className="flex flex-col items-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-2xl"
                    aria-selected={isActive}
                    role="tab"
                  >
                    <div
                      className="relative flex items-center justify-center w-16 h-16 rounded-full border-2 transition-all duration-300"
                      style={{
                        borderColor: isActive ? 'rgba(59, 130, 246, 0.8)' : isPast ? 'rgba(59, 130, 246, 0.4)' : 'rgba(255, 255, 255, 0.15)',
                        backgroundColor: isActive ? 'rgba(59, 130, 246, 0.2)' : 'rgba(13, 21, 38, 0.8)',
                        boxShadow: isActive ? '0 0 30px rgba(59, 130, 246, 0.4)' : 'none',
                        transform: isActive ? 'scale(1.05)' : 'scale(1)',
                      }}
                    >
                      <Icon size={28} className={`transition-all duration-300 ${isActive ? 'text-blue-400' : isPast ? 'text-blue-400/60' : 'text-slate-400'}`} />
                    </div>
                    <span className={`text-xs font-semibold transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-400'}`}>
                      {node.label}
                    </span>
                  </button>

                  {/* Arrow between nodes */}
                  {index < architectureNodes.length - 1 && (
                    <div className="flex-1 flex items-center justify-center px-2">
                      <div className={`h-px w-full transition-all duration-300 ${isPast || isActive ? 'bg-blue-400/60 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-white/10'}`} />
                      <ArrowRight size={16} className={`ml-1 transition-all duration-300 ${isPast || isActive ? 'text-blue-400' : 'text-slate-600'}`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Architecture Flow - Mobile */}
          <div className="lg:hidden space-y-3 mb-6">
            {architectureNodes.map((node, index) => {
              const Icon = node.icon;
              const isActive = index === activeNode;

              return (
                <div key={node.id}>
                  <button
                    onClick={() => handleNodeClick(index)}
                    className="w-full flex items-center gap-4 p-3 rounded-xl border transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    style={{
                      borderColor: isActive ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255, 255, 255, 0.08)',
                      backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                    }}
                    aria-selected={isActive}
                    role="tab"
                  >
                    <div
                      className="flex items-center justify-center w-11 h-11 rounded-full border-2 transition-all duration-300 flex-shrink-0"
                      style={{
                        borderColor: isActive ? 'rgba(59, 130, 246, 0.8)' : 'rgba(255, 255, 255, 0.15)',
                        backgroundColor: isActive ? 'rgba(59, 130, 246, 0.2)' : 'rgba(13, 21, 38, 0.8)',
                        boxShadow: isActive ? '0 0 20px rgba(59, 130, 246, 0.3)' : 'none',
                      }}
                    >
                      <Icon size={20} className={isActive ? 'text-blue-400' : 'text-slate-400'} />
                    </div>
                    <span className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-slate-400'}`}>
                      {node.label}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Information Panel */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 animate-fadeIn" key={activeNode}>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = architectureNodes[activeNode].icon;
                  return <Icon size={20} className="text-blue-400" />;
                })()}
                <div>
                  <div className="text-sm font-bold text-white uppercase tracking-wide">
                    {architectureNodes[activeNode].label}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {architectureNodes[activeNode].description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {architectureNodes[activeNode].tech.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}