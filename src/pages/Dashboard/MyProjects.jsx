import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, FolderOpen, Clock, Calendar, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import API_URL from "../../Config/api";

const STATUS_COLORS = {
  planning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  ui_design: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  development: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  testing: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  deployment: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  completed: "bg-green-500/20 text-green-400 border-green-500/30",
  active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

function SkeletonCard() {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#151B30]/90 p-6 backdrop-blur-xl animate-pulse">
      <div className="space-y-3">
        <div className="h-6 w-3/4 rounded bg-white/10" />
        <div className="h-4 w-1/2 rounded bg-white/10" />
        <div className="h-2 w-full rounded bg-white/10" />
      </div>
    </div>
  );
}

export default function MyProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("userToken");
        const res = await fetch(`${API_URL}/api/dashboard/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load projects");
        setProjects(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error} />;

  return (
    <main className="min-h-screen bg-[#090D1C] text-white">
      <div className="pointer-events-none fixed inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
      <div className="pointer-events-none fixed -left-44 top-16 h-[420px] w-[420px] rounded-full bg-violet-700/20 blur-[120px]" />
      <div className="pointer-events-none fixed -right-44 bottom-0 h-[420px] w-[420px] rounded-full bg-fuchsia-700/20 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-12 pt-28 sm:px-8">
        <Link to="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <h1 className="text-4xl font-bold">My Projects</h1>
        <p className="mt-2 text-gray-400">Track and manage your accepted projects.</p>

        {projects.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => {
              const statusColor = STATUS_COLORS[project.status] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
              return (
                <div key={project.id} className="rounded-3xl border border-white/10 bg-[#151B30]/90 p-6 backdrop-blur-xl transition hover:border-violet-400/30">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{project.projectName}</h3>
                      <p className="mt-1 text-sm text-gray-400 line-clamp-2">{project.description || "No description provided."}</p>
                    </div>
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium uppercase tracking-wider whitespace-nowrap ${statusColor}`}>
                      {project.status}
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Progress</span>
                      <span className="text-xs font-semibold text-violet-400">{project.progress}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-600 transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    {project.srsRequest && (
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    )}
                    {project.estimatedCompletion && (
                      <span className="inline-flex items-center gap-1">
                        <Clock size={12} />
                        Due {new Date(project.estimatedCompletion).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      to={`/projects/${project.id}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-600 px-4 py-2.5 text-sm font-semibold transition hover:scale-[1.02]"
                    >
                      View Details
                    </Link>

                    {project.srsRequest?.id && (
                      <button
                        onClick={() => navigate(`/projects/${project.id}/revision`)}
                        className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm font-semibold text-amber-300 hover:bg-amber-500/20"
                      >
                        ✏️ Request Changes
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

function EmptyState() {
  return (
    <div className="mt-16 rounded-3xl border border-white/10 bg-[#151B30]/90 p-12 text-center backdrop-blur-xl">
      <FolderOpen className="mx-auto mb-4 text-gray-500" size={48} />
      <h3 className="text-xl font-semibold">No accepted projects yet.</h3>
      <p className="mt-2 text-sm text-gray-400">When an admin accepts your SRS request, it will appear here as a project.</p>
      <Link to="/srs" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-600 px-5 py-3 text-sm font-semibold transition hover:scale-[1.02]">
        Submit SRS Request
      </Link>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <main className="min-h-screen bg-[#090D1C] text-white">
      <div className="pointer-events-none fixed inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-12 pt-28 sm:px-8">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}

function ErrorState({ message }) {
  return (
    <main className="min-h-screen bg-[#090D1C] text-white flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="mx-auto mb-4 text-red-400" size={48} />
        <p className="text-lg text-red-400">{message}</p>
        <Link to="/dashboard" className="mt-4 inline-flex items-center gap-2 text-violet-400 hover:text-violet-300">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
