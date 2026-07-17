import { Activity, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import API_URL from "../../Config/api";

function extractLogs(payload) { return payload?.logs || payload?.activityLogs || payload?.data?.logs || payload?.data?.activityLogs || payload?.items || payload?.data || []; }

export default function AdminActivity() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => { try { setLoading(true); const response = await fetch(`${API_URL}/api/admin/activity-logs`, { headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` }, credentials: "include" }); const data = await response.json(); if (!response.ok) throw new Error(data.message || "Unable to load activity logs."); const result = extractLogs(data); setLogs(Array.isArray(result) ? result : []); } catch (requestError) { setError(requestError.message); } finally { setLoading(false); } }, []);
  useEffect(() => {
    // Load remote activity when the page mounts and keep it current.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    const timer = window.setInterval(load, 30000);
    return () => window.clearInterval(timer);
  }, [load]);
  return <div><div className="flex items-end justify-between"><div><p className="text-sm font-semibold uppercase tracking-[.2em] text-violet-400">Admin audit trail</p><h1 className="mt-2 text-3xl font-bold">Activity logs</h1><p className="mt-2 text-slate-400">Review important actions across the administration workspace.</p></div><button onClick={load} disabled={loading} className="rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 disabled:opacity-50"><RefreshCw size={18} className={loading ? "animate-spin" : ""} /></button></div>{error && <p className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-red-200">{error}</p>}<div className="mt-8 overflow-x-auto rounded-3xl border border-white/10 bg-[#151B30]/90">{loading ? <p className="p-10 text-center text-slate-400">Loading activity...</p> : logs.length ? <table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-white/10 text-slate-400"><tr><th className="px-5 py-4">Action</th><th className="px-5 py-4">Actor</th><th className="px-5 py-4">Resource</th><th className="px-5 py-4">Date</th><th className="px-5 py-4">Details</th></tr></thead><tbody>{logs.map((log, index) => <tr key={log._id || log.id || index} className="border-b border-white/5 last:border-0"><td className="px-5 py-4 font-semibold text-white">{log.action || log.event || "Activity"}</td><td className="px-5 py-4 text-slate-300">{log.actor?.name || log.user?.name || log.actorEmail || "System"}</td><td className="px-5 py-4 text-slate-400">{log.resource || log.entity || "—"}</td><td className="px-5 py-4 text-slate-400">{log.createdAt ? new Date(log.createdAt).toLocaleString() : "—"}</td><td className="max-w-xs truncate px-5 py-4 text-slate-400" title={JSON.stringify(log.details || log.metadata || "")}>{typeof log.details === "object" ? JSON.stringify(log.details || log.metadata || {}) : log.details || "—"}</td></tr>)}</tbody></table> : <div className="flex flex-col items-center p-12 text-center text-slate-500"><Activity size={32} /><p className="mt-3">No activity has been recorded yet.</p></div>}</div></div>;
}
