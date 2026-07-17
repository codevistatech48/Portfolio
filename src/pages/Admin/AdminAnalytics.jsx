import { BarChart3, DollarSign, FileText, FolderKanban, RefreshCw, TrendingUp, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import API_URL from "../../Config/api";

const labels = [["users", "Users", Users], ["revenue", "Revenue", DollarSign], ["projects", "Projects", FolderKanban], ["srs", "SRS requests", FileText]];

function findValue(data, key) {
  const value = data?.[key] ?? data?.data?.[key];
  if (typeof value === "number" || typeof value === "string") return value;
  if (value && typeof value === "object") return value.total ?? value.count ?? value.value ?? "—";
  return "—";
}

export default function AdminAnalytics() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/admin/analytics`, { headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` }, credentials: "include" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to load analytics.");
      setData(result.data || result.analytics || result);
    } catch (requestError) { setError(requestError.message); } finally { setLoading(false); }
  }, []);
  useEffect(() => {
    // Load remote analytics when the page mounts and keep it current.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    const timer = window.setInterval(load, 30000);
    return () => window.clearInterval(timer);
  }, [load]);

  const monthlyRevenue = data.monthlyRevenue || data.revenue?.monthly || data.revenue?.monthlyRevenue || [];
  const maxRevenue = Math.max(...monthlyRevenue.map((item) => Number(item.value ?? item.amount ?? item.revenue ?? 0)), 1);

  return <div><div className="flex items-end justify-between"><div><p className="text-sm font-semibold uppercase tracking-[.2em] text-violet-400">Admin insights</p><h1 className="mt-2 text-3xl font-bold">Analytics</h1><p className="mt-2 text-slate-400">Monitor growth, revenue, users, projects, and SRS performance.</p></div><button onClick={load} disabled={loading} className="rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 disabled:opacity-50"><RefreshCw size={18} className={loading ? "animate-spin" : ""} /></button></div>{error && <p className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-red-200">{error}</p>}<div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{labels.map(([key, label, Icon]) => <article key={key} className="rounded-3xl border border-white/10 bg-[#151B30]/90 p-6"><Icon className="text-violet-300" size={23} /><p className="mt-5 text-sm text-slate-400">{label}</p><p className="mt-2 text-3xl font-bold">{loading ? "—" : findValue(data, key)}</p></article>)}</div><section className="mt-8 rounded-3xl border border-white/10 bg-[#151B30]/90 p-7"><div className="flex items-center gap-3"><TrendingUp className="text-violet-300" /><div><h2 className="text-xl font-semibold">Monthly revenue</h2><p className="mt-1 text-sm text-slate-400">Revenue trend returned by the analytics service.</p></div></div>{monthlyRevenue.length ? <div className="mt-8 flex h-64 items-end gap-3 overflow-x-auto border-b border-white/10 pb-0">{monthlyRevenue.map((item, index) => { const value = Number(item.value ?? item.amount ?? item.revenue ?? 0); return <div key={item.label || item.month || index} className="flex min-w-12 flex-1 flex-col items-center justify-end gap-2"><span className="text-xs text-slate-400">{value}</span><div className="w-full rounded-t-lg bg-gradient-to-t from-indigo-500 to-fuchsia-500" style={{ height: `${Math.max((value / maxRevenue) * 190, 8)}px` }} /><span className="text-xs text-slate-500">{item.label || item.month || index + 1}</span></div>; })}</div> : <div className="mt-8 rounded-2xl border border-dashed border-white/10 p-10 text-center text-slate-500">No monthly revenue data available.</div>}</section><section className="mt-8 rounded-3xl border border-white/10 bg-[#151B30]/90 p-7"><div className="flex items-center gap-3"><BarChart3 className="text-violet-300" /><h2 className="text-xl font-semibold">Additional metrics</h2></div><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Object.entries(data).filter(([key, value]) => !["users", "revenue", "projects", "srs", "monthlyRevenue"].includes(key) && ["string", "number", "boolean"].includes(typeof value)).map(([key, value]) => <div key={key} className="rounded-2xl bg-[#0D1225] p-5"><p className="text-sm text-slate-400">{key.replace(/([A-Z])/g, " $1")}</p><p className="mt-2 text-xl font-semibold">{String(value)}</p></div>)}</div></section></div>;
}
