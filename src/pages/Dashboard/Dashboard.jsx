import { BarChart3, Bell, FolderKanban, Plus, Settings, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const stats = [
  { label: "Active projects", value: "03", detail: "2 updates this week", icon: FolderKanban },
  { label: "Open requests", value: "05", detail: "We will respond shortly", icon: BarChart3 },
  { label: "Profile completion", value: "80%", detail: "Add your company details", icon: Sparkles },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("userToken");
    navigate("/", { replace: true });
  };

  return (
    <main className="min-h-screen bg-[#090D1C] text-white">
      <div className="pointer-events-none fixed inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
      <div className="pointer-events-none fixed -left-44 top-16 h-[420px] w-[420px] rounded-full bg-violet-700/20 blur-[120px]" />
      <div className="pointer-events-none fixed -right-44 bottom-0 h-[420px] w-[420px] rounded-full bg-fuchsia-700/20 blur-[120px]" />

      <header className="relative z-10 border-b border-white/5 bg-[#080b18]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.75rem] max-w-7xl items-center justify-between px-6 sm:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5"><img src={logo} alt="CodeVista Logo" className="h-9 w-9 object-contain" /></div>
            <span className="text-[1.7rem] font-bold tracking-tight">Code<span className="text-violet-400">Vista</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <button aria-label="Notifications" className="rounded-xl border border-white/10 bg-white/5 p-3 text-slate-300 transition hover:text-white"><Bell size={18} /></button>
            <button onClick={logout} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold transition hover:border-violet-400/30 hover:bg-white/10">Log out</button>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <section className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div><p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">Your workspace</p><h1 className="text-4xl font-bold sm:text-5xl">Welcome to CodeVista.</h1><p className="mt-4 max-w-xl text-lg text-slate-400">Track your projects, manage requests, and build your next great product with us.</p></div>
          <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-600 px-5 py-3 font-semibold shadow-[0_12px_30px_rgba(124,58,237,0.30)] transition hover:-translate-y-0.5"><Plus size={19} />New project request</button>
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-3">{stats.map(({ label, value, detail, icon: Icon }) => <article key={label} className="rounded-3xl border border-white/10 bg-[#151B30]/90 p-6 backdrop-blur-xl"><div className="flex items-start justify-between"><div><p className="text-sm text-slate-400">{label}</p><p className="mt-3 text-4xl font-bold">{value}</p></div><div className="rounded-2xl bg-violet-500/15 p-3 text-violet-300"><Icon size={22} /></div></div><p className="mt-5 text-sm text-slate-500">{detail}</p></article>)}</section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <article className="rounded-3xl border border-white/10 bg-[#151B30]/90 p-7 backdrop-blur-xl"><div className="flex items-center justify-between"><div><h2 className="text-xl font-semibold">Recent activity</h2><p className="mt-1 text-sm text-slate-400">Stay up to date with your workspace.</p></div><BarChart3 className="text-violet-400" /></div><div className="mt-8 border-t border-white/10 pt-6"><p className="font-medium">Your dashboard is ready</p><p className="mt-2 text-sm leading-6 text-slate-400">Create a project request to start collaborating with the CodeVista team.</p></div></article>
          <article className="rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 p-7"><Settings className="text-violet-300" /><h2 className="mt-5 text-xl font-semibold">Complete your profile</h2><p className="mt-2 text-sm leading-6 text-slate-300">Add your details to help us tailor project recommendations.</p><button className="mt-6 text-sm font-semibold text-violet-300 transition hover:text-white">Go to profile →</button></article>
        </section>
      </div>
    </main>
  );
}
