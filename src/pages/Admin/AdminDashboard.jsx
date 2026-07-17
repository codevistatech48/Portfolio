import { BarChart3, CheckCircle2, DollarSign, FileText, FolderKanban, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import API_URL from "../../Config/api";

const cards = [["totalUsers", "Total users", Users], ["projects", "Projects", FolderKanban], ["revenue", "Revenue", DollarSign], ["pendingSrs", "Pending SRS", FileText], ["completedProjects", "Completed projects", CheckCircle2], ["monthlyGrowth", "Monthly growth", TrendingUp]];

export default function AdminDashboard() {
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin/dashboard`, { headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` }, credentials: "include" });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Unable to load dashboard");
        const payload = result.data || result.dashboard || result.stats || result;
        setData(payload.metrics || payload.stats || payload.dashboard || payload);
        setError("");
      } catch (requestError) {
        setError(requestError.message);
      }
    };

    loadDashboard();
    const refreshTimer = window.setInterval(loadDashboard, 30000);
    return () => window.clearInterval(refreshTimer);
  }, []);
  return <div><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold uppercase tracking-[.2em] text-violet-400">Admin workspace</p><h1 className="mt-2 text-3xl font-bold sm:text-4xl">Dashboard</h1></div><BarChart3 className="text-violet-300" /></div>{error && <p className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-red-200">{error}</p>}<div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{cards.map(([key, label, Icon]) => <article key={key} className="rounded-3xl border border-white/10 bg-[#151B30]/90 p-6"><div className="flex justify-between"><div><p className="text-sm text-slate-400">{label}</p><p className="mt-3 text-3xl font-bold">{data[key] ?? "—"}</p></div><span className="rounded-2xl bg-violet-500/15 p-3 text-violet-300"><Icon size={22} /></span></div></article>)}</div><section className="mt-8 rounded-3xl border border-white/10 bg-[#151B30]/90 p-7"><h2 className="text-xl font-semibold">Recent activity</h2><p className="mt-2 text-slate-400">Manage users, projects, SRS requests, and platform operations from the sidebar.</p></section></div>;
}
