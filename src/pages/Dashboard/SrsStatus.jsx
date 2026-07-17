import { CheckCircle2, Clock3, FileText, RefreshCw, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../Config/api";

const statusConfig = {
  pending: { icon: Clock3, title: "Waiting for approval", message: "Your SRS request has been received and is currently being reviewed by our team.", color: "text-amber-300", background: "bg-amber-400/10" },
  approved: { icon: CheckCircle2, title: "SRS request approved", message: "Your request has been accepted. Our team will begin preparing your requirements document.", color: "text-emerald-300", background: "bg-emerald-400/10" },
  accepted: { icon: CheckCircle2, title: "SRS request accepted", message: "Your request has been accepted. Our team will begin preparing your requirements document.", color: "text-emerald-300", background: "bg-emerald-400/10" },
  expired: { icon: XCircle, title: "SRS request expired", message: "This request is no longer active. You can submit a new project brief whenever you are ready.", color: "text-slate-300", background: "bg-slate-400/10" },
  rejected: { icon: XCircle, title: "SRS request was not approved", message: "Please review your project details and submit a new request if you would like to continue.", color: "text-red-300", background: "bg-red-400/10" },
};

export default function SrsStatus() {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadStatus = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const response = await fetch(`${api}/api/auth/srs-requests/status`, { headers: { Authorization: `Bearer ${token}` }, credentials: "include" });
        if (!response.ok) return;
        const data = await response.json();
        if (mounted) setRequest(data.request || data.srsRequest || data.data || data);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadStatus();
    const poll = window.setInterval(loadStatus, 15000);
    return () => { mounted = false; window.clearInterval(poll); };
  }, []);

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-[#090D1C] pt-20 text-white"><RefreshCw className="animate-spin text-violet-300" /></main>;

  const status = String(request?.status || "pending").toLowerCase();
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090D1C] px-6 pt-20 text-white"><div className="pointer-events-none absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "64px 64px" }} /><section className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-[#151B30]/90 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12"><div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-3xl ${config.background} ${config.color}`}>{status === "pending" ? <RefreshCw size={42} className="animate-spin" /> : <Icon size={44} />}</div><p className="mt-7 flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-violet-300"><FileText size={17} />SRS request status</p><h1 className="mt-3 text-3xl font-bold sm:text-4xl">{config.title}</h1><p className="mt-5 leading-7 text-slate-400">{config.message}</p>{request?.createdAt && <p className="mt-6 text-sm text-slate-500">Submitted {new Date(request.createdAt).toLocaleString()}</p>}<div className="mt-8 flex flex-wrap justify-center gap-3">{["expired", "rejected"].includes(status) ? <Link to="/srs/new" className="rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-600 px-6 py-3.5 font-semibold">Submit a new request</Link> : <Link to="/dashboard" className="rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 font-semibold transition hover:bg-white/10">Go to dashboard</Link>}</div></section></main>;
}
