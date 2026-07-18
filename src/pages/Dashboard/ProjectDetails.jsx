import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download, Clock, Calendar, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import API_URL from "../../Config/api";
import { toast } from "react-toastify";

const STAGE_ICONS = {
  accepted: CheckCircle,
  planning: Clock,
  ui_design: Clock,
  development: Clock,
  testing: Clock,
  deployment: Clock,
  completed: CheckCircle,
};
const STAGE_LABELS = {
  accepted: "Accepted",
  planning: "Planning",
  ui_design: "UI Design",
  development: "Development",
  testing: "Testing",
  deployment: "Deployment",
  completed: "Completed",
};

const STAGES = [
  "accepted",
  "planning",
  "ui_design",
  "development",
  "testing",
  "deployment",
  "completed",
];

function generateTimeline(currentStatus, oldTimeline = []) {
  const currentIndex = STAGES.indexOf(currentStatus);

  return STAGES.map((stage, index) => {
    const existing = oldTimeline.find(t => t.stage === stage);

    return {
      stage,

      status:
        index < currentIndex
          ? "completed"
          : index === currentIndex
            ? "in_progress"
            : "pending",

      date:
        index <= currentIndex
          ? existing?.date || new Date()
          : existing?.date || null,
    };
  });
}

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

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded bg-white/10 ${className}`} />;
}

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchProject = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("userToken");
        const res = await fetch(`${API_URL}/api/dashboard/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load project");
        setProject(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error} />;
  if (!project) return <ErrorState message="Project not found" />;

  const statusColor = STATUS_COLORS[project.status] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  const clientName = project.srsRequest?.fullName || project.srsRequest?.email || "N/A";

  return (
    <main className="min-h-screen bg-[#090D1C] text-white">
      <div className="pointer-events-none fixed inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
      <div className="pointer-events-none fixed -left-44 top-16 h-[420px] w-[420px] rounded-full bg-violet-700/20 blur-[120px]" />
      <div className="pointer-events-none fixed -right-44 bottom-0 h-[420px] w-[420px] rounded-full bg-fuchsia-700/20 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-12 pt-28 sm:px-8">
        {/* Back Button */}
        <Link to="/projects" className="mb-6 inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition">
          <ArrowLeft size={16} />
          Back to Projects
        </Link>

        {/* Header Section */}
        <div className="rounded-3xl border border-white/10 bg-[#151B30]/90 p-8 backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-bold">{project.projectName}</h1>
                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wider ${statusColor}`}>
                  {project.status}
                </span>
              </div>
              <p className="mt-2 text-gray-400">{clientName} • {project.srsRequest?.email || ""}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={async () => {
                  try {
                    const token = localStorage.getItem("userToken");

                    const response = await fetch(
                      `${API_URL}/api/auth/srs-requests/${project.srsRequest._id || project.srsRequest.id}/download`,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );

                    if (!response.ok) {
                      const err = await response.json();
                      throw new Error(err.message || "Failed to download SRS");
                    }

                    const blob = await response.blob();

                    const url = window.URL.createObjectURL(blob);

                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `${project.projectName}_SRS.pdf`;

                    document.body.appendChild(link);
                    link.click();

                    link.remove();
                    window.URL.revokeObjectURL(url);
                  } catch (err) {
                    alert(err.message);
                  }
                }}
                disabled={!project.srsRequest?.id}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-600 px-5 py-3 text-sm font-semibold transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={16} />
                Download SRS PDF
              </button>

              {(project.status === "accepted" || project.status === "approved" || project.status === "active" || project.status === "completed") && (
                <Link
                  to={`/projects/${project._id || project.id}/revision`}
                  className="inline-flex items-center gap-2 rounded-xl border border-violet-400/30 bg-violet-500/10 px-5 py-3 text-sm font-semibold text-violet-300 transition hover:bg-violet-500/20 hover:text-white"
                >
                  <RefreshCw size={16} />
                  Request Changes
                </Link>
              )}
            </div>
          </div>

          {/* Progress Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Progress</span>
              <span className="text-sm font-semibold text-violet-400">{project.progress}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-600 transition-all duration-500"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          {/* Project Info Grid */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InfoCard icon={Calendar} label="Start Date" value={project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "N/A"} />
            <InfoCard icon={Calendar} label="Est. Completion" value={project.estimatedCompletion ? new Date(project.estimatedCompletion).toLocaleDateString() : "TBD"} />
            <InfoCard icon={CheckCircle} label="Priority" value={project.priority?.charAt(0).toUpperCase() + project.priority?.slice(1) || "Medium"} />
            <InfoCard icon={Clock} label="Last Updated" value={project.lastUpdated ? new Date(project.lastUpdated).toLocaleDateString() : "N/A"} />
          </div>
        </div>

        {/* Description & Tech Stack */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-[#151B30]/90 p-8 backdrop-blur-xl">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-400 leading-relaxed">{project.description || "No description provided."}</p>
            {project.adminNotes && (
              <>
                <h3 className="text-lg font-semibold mt-6 mb-2">Admin Notes</h3>
                <p className="text-gray-400 leading-relaxed">{project.adminNotes}</p>
              </>
            )}
          </div>
          <div className="rounded-3xl border border-white/10 bg-[#151B30]/90 p-8 backdrop-blur-xl">
            <h2 className="text-xl font-semibold mb-4">Technology Stack</h2>
            {project.technologyStack?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {project.technologyStack.map((tech, i) => (
                  <span key={i} className="rounded-lg bg-violet-500/15 px-3 py-1.5 text-sm text-violet-300 border border-violet-500/20">
                    {tech}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No technologies listed.</p>
            )}

            <h2 className="text-xl font-semibold mt-8 mb-4">Team</h2>
            {project.assignedTeam?.length > 0 ? (
              <div className="space-y-3">
                {project.assignedTeam.map((member, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-violet-500/30 flex items-center justify-center text-sm font-medium">
                      {member.name?.charAt(0) || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No team assigned yet.</p>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-6 rounded-3xl border border-white/10 bg-[#151B30]/90 p-8 backdrop-blur-xl">
          <h2 className="text-xl font-semibold mb-6">Project Timeline</h2>
          <div className="relative">
            {project.timeline?.length > 0 ? (
              <div className="space-y-0">
                {project.timeline.map((stage, index) => {
                  const Icon = STAGE_ICONS[stage.stage] || Clock;

                  const isCompleted = stage.status === "completed";

                  const isCurrent = stage.status === "in_progress";

                  const isPending = stage.status === "pending";

                  const isLast = index === project.timeline.length - 1;

                  return (
                    <div key={stage.stage} className="relative flex gap-4 pb-6">
                      {!isLast && (
                        <div className={`absolute left-[15px] top-8 w-0.5 h-full ${isCompleted ? "bg-green-500/50" : "bg-white/10"}`} />
                      )}
                      <div
                        className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full

                        ${isCompleted
                            ? "bg-green-500/20 text-green-400"

                            : isCurrent
                              ? "bg-violet-500/20 text-violet-400 ring-2 ring-violet-500"

                              : "bg-white/10 text-gray-500"
                          }

                      `}
                      >
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 pt-1">
                        <p className={`font-medium ${isCompleted ? "text-green-400" : "text-gray-500"}`}>
                          {STAGE_LABELS[stage.stage] || stage.stage}
                        </p>
                        {stage.date && (
                          <p className="text-xs text-gray-600 mt-0.5">{new Date(stage.date).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">No timeline data available.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0C1122] p-5">
      <div className="flex items-center gap-2 mb-1">
        <Icon size={14} className="text-violet-400" />
        <p className="text-xs text-gray-500">{label}</p>
      </div>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <main className="min-h-screen bg-[#090D1C] text-white p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
        <Skeleton className="h-80" />
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
        <Link to="/projects" className="mt-4 inline-flex items-center gap-2 text-violet-400 hover:text-violet-300">
          <ArrowLeft size={16} />
          Back to Projects
        </Link>
      </div>
    </main>
  );
}