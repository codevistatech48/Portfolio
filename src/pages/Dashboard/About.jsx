import { ArrowRight, CheckCircle2, Code2, Lightbulb, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer/footer";

const values = [
  { icon: Lightbulb, title: "Purposeful thinking", text: "We turn ambitious ideas into focused, useful digital experiences." },
  { icon: UsersRound, title: "True partnership", text: "We work closely with clients, communicate clearly, and build with their goals in mind." },
  { icon: Code2, title: "Built to last", text: "We choose modern, reliable technology that helps products scale with confidence." },
];

const approach = ["Understand the people and problem", "Design a clear product direction", "Build, test, and refine together"];

export default function About() {
  return (
    <main className="min-h-screen bg-[#080C1B] text-white">
      <section className="relative overflow-hidden px-6 pb-24 pt-36 sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
        <div className="pointer-events-none absolute left-1/2 top-10 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-violet-600/15 blur-[140px]" />
        <div className="relative mx-auto max-w-[1150px]">
          <header className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-violet-400">About CodeVista</p>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">Digital products with <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">real-world impact.</span></h1>
            <p className="mt-6 text-lg leading-8 text-slate-400">CodeVista is a technology partner for teams ready to turn complex challenges into simple, scalable digital experiences.</p>
          </header>

          <section className="mt-20 grid gap-8 lg:grid-cols-[1.05fr_.95fr]">
            <article className="rounded-[28px] border border-white/10 bg-[#12192E]/90 p-8 sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">Our mission</p>
              <h2 className="mt-4 text-3xl font-bold">Make technology feel like momentum.</h2>
              <p className="mt-5 leading-8 text-slate-400">From first concept to launch, we blend product thinking, thoughtful design, and dependable engineering to help organisations move forward with clarity.</p>
              <Link to="/projects" className="mt-8 inline-flex items-center gap-2 font-semibold text-violet-300 transition hover:text-white">Explore our work <ArrowRight size={18} /></Link>
            </article>
            <article className="rounded-[28px] border border-violet-400/20 bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 p-8 sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">How we work</p>
              <ol className="mt-7 space-y-6">{approach.map((item, index) => <li key={item} className="flex gap-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-400/15 text-sm font-bold text-violet-200">0{index + 1}</span><span className="pt-1 text-lg font-medium text-slate-100">{item}</span></li>)}</ol>
            </article>
          </section>

          <section className="mt-8 grid gap-6 md:grid-cols-3">{values.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-3xl border border-white/10 bg-[#12192E] p-7"><div className="inline-flex rounded-2xl bg-violet-500/15 p-3 text-violet-300"><Icon size={24} /></div><h2 className="mt-5 text-xl font-bold">{title}</h2><p className="mt-3 leading-7 text-slate-400">{text}</p></article>)}</section>

          <section className="mt-16 rounded-[28px] border border-white/10 bg-[#12192E] px-8 py-10 text-center sm:px-12"><CheckCircle2 className="mx-auto text-violet-400" size={30} /><h2 className="mt-4 text-3xl font-bold">Have a project in mind?</h2><p className="mx-auto mt-3 max-w-xl text-slate-400">Let’s create something useful, polished, and built for your next stage of growth.</p><Link to="/support" className="mt-7 inline-flex rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3.5 font-semibold shadow-[0_12px_30px_rgba(124,58,237,.30)] transition hover:-translate-y-0.5">Talk to our team</Link></section>
        </div>
      </section>
      <Footer />
    </main>
  );
}
