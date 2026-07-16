import { useState } from "react";
import { ExternalLink, Filter, X } from "lucide-react";
import Navbar from "../../components/Navbar/navBar";
import analyticsPreview from "../../assets/analytics-dashboard-preview.png";
import landingPreview from "../../assets/proctify.png";
import aiIntPreview from "../../assets/ai.webp";
import BusTrack from "../../assets/bus.webp";
import AiCarrier from "../../assets/aiCarrieguide.png"

const projects = [
  {
    name: "AI Interview Simulator",
    category: "AI",
    summary: "Practice interviews with instant AI-driven feedback and guidance.",
    description: "An AI-powered interview preparation platform that simulates realistic interview sessions, evaluates responses, and helps candidates improve their confidence and communication.",
    stack: ["Next JS", "AI", "Hugging Face" ,"Tailwind CSS", "MongoDB"],
    image: aiIntPreview,
    demoUrl: "https://ai-interview-simulator-pi.vercel.app/",
  },
  {
    name: "Bus Live Tracking System",
    category: "Tracking",
    summary: "Real-time bus locations, routes, and arrival updates.",
    description: "A live public-transport tracking system that lets commuters monitor buses in real time, view routes, and make better travel decisions.",
    stack: ["React", "Maps API"," Python","Flask" ,"Tailwind CSS", "MySql", "MongoDB" ],
    image: BusTrack,
    demoUrl: "https://live-tracking-frontend.vercel.app/",
  },
  {
    name: "AI Career Guide",
    category: "AI",
    summary: "Personalised career direction based on skills and goals.",
    description: "An AI career guidance platform that helps students and professionals identify suitable career paths, understand skill gaps, and plan their next steps.",
    stack: ["React", "AI", "Spring Boot","MongoDB"],
    image: AiCarrier,
    demoUrl: "https://example.com",
  },
  {
    name: "Proctify",
    category: "Education",
    summary: "AI-based online exam proctoring application.",
    description: "An intelligent exam monitoring platform that uses AI to help maintain exam integrity by detecting suspicious activity during online assessments.",
    stack: ["Next JS", "Computer Vision", "Python","MOngoDB", "Tailwind CSS" ],
    image: landingPreview,
    demoUrl: "https://proctify-five.vercel.app/",
  },
  {
    name: "Nagarvani",
    category: "Civic Tech",
    summary: "AI-powered civic issue reporting for safer communities.",
    description: "A civic complaint platform where residents can report damaged roads, broken poles, and other public issues. AI helps recognise the problem and routes the complaint for action.",
    stack: ["React", "AI Vision","Flask", "Tailwind CSS", "MongoDB"],
    image: analyticsPreview,
    demoUrl: "https://example.com",
  },
];

const filters = ["All", "AI", "Tracking", "Education", "Civic Tech"];

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const visibleProjects = projects.filter((project) => activeFilter === "All" || project.category === activeFilter);

  return (
    <main className="min-h-screen bg-[#080C1B] text-white">
      <Navbar />
      <section className="relative overflow-hidden px-6 pb-24 pt-36 sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
        <div className="pointer-events-none absolute left-1/2 top-24 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/15 blur-[130px]" />
        <div className="relative mx-auto max-w-[1450px]">
          <header className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-violet-400">Selected work</p>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">Products built to <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">move businesses forward.</span></h1>
            <p className="mt-6 text-lg leading-8 text-slate-400">Explore a selection of digital products designed for real teams, real customers, and measurable growth.</p>
          </header>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <Filter size={20} className="mr-1 text-slate-400" />
            {filters.map((filter) => <button key={filter} onClick={() => setActiveFilter(filter)} className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${activeFilter === filter ? "border-violet-400/60 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-[0_10px_30px_rgba(124,58,237,.35)]" : "border-[#263353] bg-[#12192E] text-slate-400 hover:border-violet-400/40 hover:text-white"}`}>{filter}</button>)}
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {visibleProjects.map((project) => <button key={project.name} onClick={() => setSelectedProject(project)} className="group overflow-hidden rounded-[28px] border border-[#263353] bg-[#12192E] text-left transition duration-500 hover:-translate-y-2 hover:border-violet-400/60 hover:shadow-[0_24px_70px_rgba(124,58,237,.20)]">
              <div className="relative h-64 overflow-hidden bg-[#0b1120]">
                <img src={project.image} alt={`${project.name} project preview`} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12192E] via-transparent to-violet-500/20 opacity-80" />
                <span className="absolute right-5 top-5 rounded-full border border-violet-400/40 bg-[#11182f]/90 px-4 py-2 text-sm font-semibold text-violet-300 backdrop-blur">{project.category}</span>
                <span className="absolute inset-0 flex items-center justify-center gap-2 bg-violet-700/60 text-lg font-semibold opacity-0 backdrop-blur-[2px] transition group-hover:opacity-100"><ExternalLink size={20} />View case study</span>
              </div>
              <div className="p-7"><h2 className="text-2xl font-bold">{project.name}</h2><p className="mt-3 min-h-14 text-base leading-6 text-slate-400">{project.summary}</p><div className="mt-6 flex flex-wrap gap-2">{project.stack.map((item) => <span key={item} className="rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1.5 text-sm font-medium text-indigo-300">{item}</span>)}</div></div>
            </button>)}
          </div>
        </div>
      </section>

      {selectedProject && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#050711]/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="project-title" onClick={() => setSelectedProject(null)}>
        <article className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[28px] border border-white/10 bg-[#12192E] shadow-2xl" onClick={(event) => event.stopPropagation()}>
          <div className="relative h-72 sm:h-96"><img src={selectedProject.image} alt={`${selectedProject.name} preview`} className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#12192E] to-transparent" /><button onClick={() => setSelectedProject(null)} aria-label="Close project details" className="absolute right-5 top-5 rounded-full border border-white/10 bg-[#090D1C]/80 p-3 transition hover:bg-white/10"><X size={20} /></button></div>
          <div className="p-7 sm:p-10"><span className="rounded-full bg-violet-500/15 px-3 py-1.5 text-sm font-semibold text-violet-300">{selectedProject.category}</span><h2 id="project-title" className="mt-4 text-3xl font-bold">{selectedProject.name}</h2><p className="mt-4 max-w-2xl text-lg leading-8 text-slate-400">{selectedProject.description}</p><div className="mt-7 flex flex-wrap gap-2">{selectedProject.stack.map((item) => <span key={item} className="rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1.5 text-sm font-medium text-indigo-300">{item}</span>)}</div><a href={selectedProject.demoUrl} target="_blank" rel="noreferrer" className="mt-9 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3.5 font-semibold shadow-[0_12px_30px_rgba(124,58,237,.30)] transition hover:-translate-y-0.5">View live demo <ExternalLink size={18} /></a></div>
        </article>
      </div>}
    </main>
  );
}
