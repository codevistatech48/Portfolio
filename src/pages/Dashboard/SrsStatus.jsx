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

const revisionStatusConfig = {
  pending: { icon: Clock3, title: "Revision Under Review", message: "Your revision request has been submitted successfully. Our team is reviewing the requested changes.", color: "text-amber-300", background: "bg-amber-400/10" },
  under_review: { icon: RefreshCw, title: "Revision Under Review", message: "Our team is reviewing your requested changes.", color: "text-blue-300", background: "bg-blue-400/10" },
  approved: { icon: CheckCircle2, title: "Revision Approved", message: "Your revision has been approved and development will begin shortly.", color: "text-emerald-300", background: "bg-emerald-400/10" },
  development: { icon: RefreshCw, title: "Development In Progress", message: "Our developers are implementing your requested changes.", color: "text-violet-300", background: "bg-violet-500/10" },
  testing: { icon: RefreshCw, title: "Testing In Progress", message: "Your revision is currently being tested by our QA team.", color: "text-cyan-300", background: "bg-cyan-500/10" },
  completed: { icon: CheckCircle2, title: "Revision Completed", message: "Your requested changes have been completed successfully.", color: "text-green-300", background: "bg-green-500/10" },
  rejected: { icon: XCircle, title: "Revision Rejected", message: "Unfortunately your revision request could not be approved.", color: "text-red-300", background: "bg-red-500/10" },
};

export default function SrsStatus() {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadStatus = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        // Fetch SRS Base Status
        const response = await fetch(`${api}/api/auth/srs-requests/status`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include"
        });
        
        if (response.ok) {
          const data = await response.json();
          if (mounted) setRequest(data.request || data.srsRequest || data.data || data);
        }
      } catch (err) {
        console.error("Error fetching SRS status:", err);
      }

      try {
        // Fetch Latest Revision Status
        const revisionResponse = await fetch(`${api}/api/revisions/latest`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });

        if (revisionResponse.ok) {
          const revisionData = await revisionResponse.json();
          if (mounted) {
            setRevision(revisionData.data || revisionData.revision || revisionData);
          }
        }
      } catch (err) {
        console.error("Error fetching revision status:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadStatus();
    const poll = window.setInterval(loadStatus, 15000);
    
    return () => {
      mounted = false;
      window.clearInterval(poll);
    };
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090D1C] pt-20 text-white">
        <RefreshCw className="animate-spin text-violet-300" />
      </main>
    );
  }

  const status = String(request?.status || "pending").toLowerCase();
  const config = statusConfig[status] || statusConfig.pending;

  const revisionStatus = String(revision?.workflowStatus || revision?.status || "").toLowerCase();
  const revisionConfig = revisionStatusConfig[revisionStatus];

  const Icon = config.icon;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090D1C] px-6 pt-20 text-white">
      <div 
        className="pointer-events-none absolute inset-0 opacity-20" 
        style={{ 
          backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)", 
          backgroundSize: "64px 64px" 
        }} 
      />
      
      <section className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-[#151B30]/90 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12">
        <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-3xl ${config.background} ${config.color}`}>
          {status === "pending" ? <RefreshCw size={42} className="animate-spin" /> : <Icon size={44} />}
        </div>
        
        <p className="mt-7 flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">
          <FileText size={17} />
          SRS request status
        </p>
        
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{config.title}</h1>
        <p className="mt-5 leading-7 text-slate-400">{config.message}</p>
        
        {request?.createdAt && (
          <p className="mt-6 text-sm text-slate-500">
            Submitted {new Date(request.createdAt).toLocaleString()}
          </p>
        )}

        {/* Display Revision Sub-Status if a revision exists */}
        {revision && revisionConfig && (
          <div className={`mt-6 p-4 rounded-xl border border-white/5 text-left ${revisionConfig.background}`}>
            <div className="flex items-center gap-2 font-semibold text-sm">
              <revisionConfig.icon size={16} className={revisionConfig.color} />
              <span className={revisionConfig.color}>{revisionConfig.title}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{revisionConfig.message}</p>
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {["expired", "rejected"].includes(status) ? (
            <Link to="/srs/new" className="rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-600 px-6 py-3.5 font-semibold">
              Submit a new request
            </Link>
          ) : (
            <Link to="/dashboard" className="rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 font-semibold transition hover:bg-white/10">
              Go to dashboard
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}