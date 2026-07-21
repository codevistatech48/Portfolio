import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download, Clock, Calendar, CheckCircle, AlertCircle, RefreshCw, User, GitMerge, XCircle, CheckSquare, Folder, GitPullRequest, Check, X, Rocket, Bug, Search } from "lucide-react";
import API_URL from "../../Config/api";
import { toast } from "react-toastify";

const STATE_COLORS = {
  completed: "bg-green-500/20 text-green-400 border-green-500/30",
  in_progress: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  pending: "bg-white/10 text-gray-500 border-white/10",
  rejected: "bg-red-500/20 text-red-400 border-red-500/30",
};

const TYPE_BADGE = {
  project: "bg-violet-500/15 text-violet-300 border-violet-500/20",
  revision: "bg-amber-500/15 text-amber-300 border-amber-500/20",
};

const STATUS_COLORS = {
  accepted: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  planning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  ui_design: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  development: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  testing: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  deployment: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  completed: "bg-green-500/20 text-green-400 border-green-500/30",
  active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  revision_under_review: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  revision_approved: "bg-green-500/20 text-green-400 border-green-500/30",
};

const MERGED_COLOR = "bg-purple-500/20 text-purple-400 border-purple-500/30";

const REVISION_STATUS_LABELS = {
  pending: "Pending",
  under_review: "Under Review",
  approved: "Approved",
  revision_development: "Approved",
  revision_testing: "Approved",
  revision_completed: "Approved",
  ready_for_merge: "Approved",
  merged: "Merged",
  rejected: "Rejected",
};

const PROJECT_WORKFLOW = ["accepted", "planning", "ui_design", "development", "testing", "deployment", "completed"];
const REVISION_WORKFLOW = ["pending", "under_review", "approved", "merged"];
const REVISION_STAGE_MAP = {
  revision_development: "approved",
  revision_testing: "approved",
  revision_completed: "approved",
  ready_for_merge: "approved",
};

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded bg-white/10 ${className}`} />;
}

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [revisions, setRevisions] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [activityFilter, setActivityFilter] = useState("all");
  const [activitySearch, setActivitySearch] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchProject = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("userToken");
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setIsAdmin(user.role === "admin");

        const [projectRes, revisionsRes] = await Promise.all([
          fetch(`${API_URL}/api/dashboard/projects/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/srs/${id}/revisions`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const [projectData, revisionsData] = await Promise.all([
          projectRes.json(),
          revisionsRes.json(),
        ]);

        if (!projectRes.ok) throw new Error(projectData.message || "Failed to load project");
        setProject(projectData.data);
        if (revisionsRes.ok) {
          setRevisions(revisionsData.data?.revisions || revisionsData.revisions || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const refreshData = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const [projectRes, revisionsRes, activityRes] = await Promise.all([
        fetch(`${API_URL}/api/dashboard/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/srs/${id}/revisions`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/dashboard/projects/${id}/activity?type=${activityFilter}${activitySearch ? `&search=${encodeURIComponent(activitySearch)}` : ""}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const [projectData, revisionsData, activityData] = await Promise.all([
        projectRes.json(),
        revisionsRes.json(),
        activityRes.json(),
      ]);

      if (projectRes.ok) setProject(projectData.data);
      if (revisionsRes.ok) {
        setRevisions(revisionsData.data?.revisions || revisionsData.revisions || []);
      }
      if (activityRes.ok) {
        setActivityLogs(activityData.logs || []);
      }
    } catch (err) {
      console.error("Refresh failed:", err);
    }
  };

  useEffect(() => {
    if (!id) return;
    const fetchActivity = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const res = await fetch(`${API_URL}/api/dashboard/projects/${id}/activity?type=${activityFilter}${activitySearch ? `&search=${encodeURIComponent(activitySearch)}` : ""}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setActivityLogs(data.logs || []);
      } catch (err) {
        console.error("Failed to fetch activity logs:", err);
      }
    };
    fetchActivity();
  }, [id, activityFilter, activitySearch]);

  const handleRevisionAction = async (revisionId, action, payload = {}) => {
    setActionLoading((prev) => ({ ...prev, [revisionId]: true }));
    try {
      const token = localStorage.getItem("userToken");
      const endpoints = {
        review: `${API_URL}/api/srs/revisions/${revisionId}/review`,
        status: `${API_URL}/api/srs/revisions/${revisionId}/status`,
        merge: `${API_URL}/api/srs/revisions/${revisionId}/merge`,
        assign: `${API_URL}/api/srs/revisions/${revisionId}/assign`,
      };

      const response = await fetch(endpoints[action], {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `Failed to ${action}`);

      toast.success(`Revision ${action} successful`);
      await refreshData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading((prev) => ({ ...prev, [revisionId]: false }));
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!confirm(`Change project status to ${newStatus}?`)) return;

    try {
      const token = localStorage.getItem("userToken");
      const response = await fetch(`${API_URL}/api/admin/projects/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update status");

      toast.success("Project status updated");
      await refreshData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error} />;
  if (!project) return <ErrorState message="Project not found" />;

  const statusColor = STATUS_COLORS[project.status] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  const clientName = project.srsRequest?.fullName || project.srsRequest?.email || "N/A";
  const activeRevision = revisions.find((r) => !["merged", "rejected"].includes(r.workflowStatus));
  const canChangeStatus = !activeRevision || ["merged", "rejected"].includes(activeRevision.workflowStatus);
  const isRevisionMode = project.workflowMode === "revision";
  const projectStageIndex = PROJECT_WORKFLOW.indexOf(project.status);
  const revisionStatus = REVISION_STAGE_MAP[activeRevision?.workflowStatus] || activeRevision?.workflowStatus;
  const revisionStageIndex = REVISION_WORKFLOW.indexOf(revisionStatus);

  const moveToNextRevisionStage = () => {
    if (!activeRevision || revisionStageIndex < 0 || revisionStageIndex === REVISION_WORKFLOW.length - 1) return;
    const nextStatus = REVISION_WORKFLOW[revisionStageIndex + 1];
    handleRevisionAction(activeRevision._id, "status", { status: nextStatus });
  };

  const moveToPreviousRevisionStage = () => {
    if (!activeRevision || revisionStageIndex <= 0) return;
    const previousStatus = REVISION_WORKFLOW[revisionStageIndex - 1];
    handleRevisionAction(activeRevision._id, "status", { status: previousStatus });
  };

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
                        headers: { Authorization: `Bearer ${token}` },
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

          {/* Status Card */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-[#0C1122] p-5">
              <p className="text-xs text-gray-500">Current Status</p>
              <p className={`mt-1 text-sm font-semibold ${statusColor.split(" ")[1]}`}>{project.status}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#0C1122] p-5">
              <p className="text-xs text-gray-500">Workflow Mode</p>
              <p className="mt-1 text-sm font-semibold text-violet-300">{project.workflowMode || "normal"}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#0C1122] p-5">
              <p className="text-xs text-gray-500">Paused Status</p>
              <p className="mt-1 text-sm font-semibold text-amber-300">{project.pausedStatus || "—"}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#0C1122] p-5">
              <p className="text-xs text-gray-500">Progress</p>
              <p className="mt-1 text-sm font-semibold text-violet-400">{project.progress}%</p>
            </div>
          </div>

          {/* Workflow Controls */}
          {isAdmin && (
            <div className="mt-6 rounded-2xl border border-white/10 bg-[#0C1122] p-6">
              <h3 className="text-lg font-semibold mb-4">{isRevisionMode ? "Revision Workflow" : "Project Workflow"}</h3>
              <div className="flex flex-wrap gap-2">
                {isRevisionMode ? (
                  <>
                    <button
                      onClick={moveToPreviousRevisionStage}
                      disabled={!activeRevision || revisionStageIndex <= 0 || actionLoading[activeRevision?._id]}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous Stage
                    </button>
                    <button
                      onClick={moveToNextRevisionStage}
                      disabled={!activeRevision || revisionStageIndex < 0 || revisionStageIndex === REVISION_WORKFLOW.length - 1 || actionLoading[activeRevision?._id]}
                      className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-300 transition hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next Stage
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleStatusChange(PROJECT_WORKFLOW[projectStageIndex - 1])}
                      disabled={projectStageIndex <= 0}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous Stage
                    </button>
                    <button
                      onClick={() => handleStatusChange(PROJECT_WORKFLOW[projectStageIndex + 1])}
                      disabled={projectStageIndex < 0 || projectStageIndex === PROJECT_WORKFLOW.length - 1}
                      className="rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-300 transition hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next Stage
                    </button>
                  </>
                )}
                {!isRevisionMode && ["planning", "ui_design", "development", "testing", "deployment", "completed", "cancelled"].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={!canChangeStatus || project.status === status}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          )}

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

        {/* Revision Management (Admin) */}
        {isAdmin && activeRevision && (
          <div className="mt-6 rounded-3xl border border-amber-500/20 bg-[#151B30]/90 p-8 backdrop-blur-xl">
            <h2 className="text-xl font-semibold mb-6 text-amber-300">Revision Management</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-[#0C1122] p-5">
                <p className="text-xs text-gray-500">Active Revision</p>
                <p className="mt-1 text-sm font-semibold text-white">#{activeRevision.revisionNumber}</p>
                <p className="text-xs text-gray-400 mt-1">{activeRevision.title || "Revision"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0C1122] p-5">
                <p className="text-xs text-gray-500">Revision Status</p>
                <p className="mt-1 text-sm font-semibold text-amber-300">{REVISION_STATUS_LABELS[activeRevision.workflowStatus] || activeRevision.workflowStatus}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0C1122] p-5">
                <p className="text-xs text-gray-500">Assigned Developer</p>
                <p className="mt-1 text-sm font-semibold text-violet-300">
                  {activeRevision.assignedDeveloper?.name || "Unassigned"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0C1122] p-5">
                <p className="text-xs text-gray-500">Workflow Mode</p>
                <p className="mt-1 text-sm font-semibold text-amber-300">{project.workflowMode}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 flex flex-wrap gap-3">
              {activeRevision.workflowStatus === "under_review" && (
                <>
                  <button
                    onClick={() => handleRevisionAction(activeRevision._id, "review", { workflowStatus: "approved" })}
                    disabled={actionLoading[activeRevision._id]}
                    className="inline-flex items-center gap-2 rounded-xl bg-green-500/20 border border-green-500/30 px-4 py-2.5 text-sm font-semibold text-green-300 transition hover:bg-green-500/30 disabled:opacity-50"
                  >
                    <CheckSquare size={16} />
                    Approve Revision
                  </button>
                  <button
                    onClick={() => handleRevisionAction(activeRevision._id, "review", { workflowStatus: "rejected" })}
                    disabled={actionLoading[activeRevision._id]}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-500/20 border border-red-500/30 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/30 disabled:opacity-50"
                  >
                    <XCircle size={16} />
                    Reject Revision
                  </button>
                </>
              )}
              {["approved", "revision_development", "revision_testing", "revision_completed", "ready_for_merge"].includes(activeRevision.workflowStatus) && (
                <button
                  onClick={() => handleRevisionAction(activeRevision._id, "status", { status: "merged" })}
                  disabled={actionLoading[activeRevision._id]}
                  className="inline-flex items-center gap-2 rounded-xl bg-purple-500/20 border border-purple-500/30 px-4 py-2.5 text-sm font-semibold text-purple-300 transition hover:bg-purple-500/30 disabled:opacity-50"
                >
                  <GitMerge size={16} />
                  Merge Revision
                </button>
              )}
            </div>
          </div>
        )}

        {/* Revision History */}
        {revisions.length > 0 && (
          <div className="mt-6 rounded-3xl border border-white/10 bg-[#151B30]/90 p-8 backdrop-blur-xl">
            <h2 className="text-xl font-semibold mb-6">Revision History</h2>
            <div className="space-y-3">
              {revisions.map((revision) => (
                <div key={revision._id} className="rounded-2xl border border-white/10 bg-[#0C1122] overflow-hidden">
                  <div className="flex items-center justify-between p-5">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold">Revision #{revision.revisionNumber}</h3>
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATE_COLORS[revision.workflowStatus] || STATE_COLORS.pending}`}>
                          {REVISION_STATUS_LABELS[revision.workflowStatus] || revision.workflowStatus}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-400">{revision.title || revision.changeSummary}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <span>By: {revision.createdBy?.name || "Unknown"}</span>
                        <span>Created: {new Date(revision.requestedAt).toLocaleDateString()}</span>
                        {revision.mergedAt && <span>Merged: {new Date(revision.mergedAt).toLocaleDateString()}</span>}
                        {revision.reviewedAt && <span>Reviewed: {new Date(revision.reviewedAt).toLocaleDateString()}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Timeline */}
        <div className="mt-6 rounded-3xl border border-white/10 bg-[#151B30]/90 p-8 backdrop-blur-xl">
          <h2 className="text-xl font-semibold mb-6">Activity Timeline</h2>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {["all", "project", "revision", "admin", "status", "developer"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActivityFilter(filter)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                    activityFilter === filter
                      ? "border-violet-500/30 bg-violet-500/15 text-violet-300"
                      : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {filter === "all" ? "All" : filter === "status" ? "Status Changes" : filter === "developer" ? "Developer Actions" : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>

            <div className="relative ml-auto">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search activities..."
                value={activitySearch}
                onChange={(e) => setActivitySearch(e.target.value)}
                className="rounded-lg border border-white/10 bg-white/5 pl-9 pr-4 py-1.5 text-sm text-white placeholder-gray-500 focus:border-violet-500/30 focus:outline-none"
              />
            </div>
          </div>

          {/* Activity List */}
          <div className="space-y-3">
            {activityLogs.length > 0 ? (
              activityLogs.map((log) => {
                const Icon = getActivityIcon(log.action);
                const iconColor = getActivityColor(log.action);
                const roleBadge = getRoleBadge(log.performerRole);

                return (
                  <div key={log.id} className="rounded-2xl border border-white/10 bg-[#0C1122] p-5 transition hover:bg-white/5">
                    <div className="flex items-start gap-4">
                      <div className={`rounded-full border p-2 ${iconColor}`}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-sm text-white">{formatActionTitle(log.action)}</h4>
                          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${roleBadge}`}>
                            {log.performerRole}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-400">{log.description}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          {log.actor && (
                            <span className="flex items-center gap-1">
                              <User size={12} />
                              {log.actor.name || "Unknown"}
                            </span>
                          )}
                          <span>{formatRelativeTime(log.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500 py-8">No activity logs found.</p>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-6 rounded-3xl border border-white/10 bg-[#151B30]/90 p-8 backdrop-blur-xl">
          <h2 className="text-xl font-semibold mb-6">Project Timeline</h2>
          <div className="relative">
            {project.timeline?.length > 0 ? (
              <div className="space-y-0">
                {project.timeline.map((item) => {
                  const Icon = item.type === "revision" ? RefreshCw : CheckCircle;

                  let colorClass = STATE_COLORS[item.state] || STATE_COLORS.pending;
                  if (item.state === "merged") colorClass = MERGED_COLOR;

                  const badgeClass = TYPE_BADGE[item.type] || TYPE_BADGE.project;

                  return (
                    <div key={item.id || item.key} className="relative flex gap-4 pb-6">
                      <div className={`absolute left-[15px] top-8 w-0.5 h-full ${item.completed ? "bg-green-500/50" : "bg-white/10"}`} />
                      <div className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${colorClass}`}>
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={`font-medium ${item.completed ? "text-green-400" : item.current ? "text-yellow-400" : "text-gray-500"}`}>
                            {item.title || item.label}
                          </p>
                          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${badgeClass}`}>
                            {item.type}
                          </span>
                        </div>
                        {item.timestamp && (
                          <p className="text-xs text-gray-600 mt-0.5">{new Date(item.timestamp).toLocaleDateString()}</p>
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

function getActivityIcon(action) {
  if (action.includes("project.created") || action.includes("project.")) return Folder;
  if (action.includes("revision.created") || action.includes("revision.")) return GitPullRequest;
  if (action.includes("approved") || action.includes("accepted")) return Check;
  if (action.includes("rejected")) return X;
  if (action.includes("merged")) return GitMerge;
  if (action.includes("developer.assigned") || action.includes("developer")) return User;
  if (action.includes("testing")) return Bug;
  if (action.includes("deployment")) return Rocket;
  return CheckCircle;
}

function getActivityColor(action) {
  if (action.includes("rejected")) return "bg-red-500/20 text-red-400 border-red-500/30";
  if (action.includes("merged")) return "bg-purple-500/20 text-purple-400 border-purple-500/30";
  if (action.includes("approved") || action.includes("completed")) return "bg-green-500/20 text-green-400 border-green-500/30";
  if (action.includes("developer.assigned")) return "bg-blue-500/20 text-blue-400 border-blue-500/30";
  if (action.includes("testing")) return "bg-orange-500/20 text-orange-400 border-orange-500/30";
  if (action.includes("deployment")) return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
  return "bg-violet-500/20 text-violet-400 border-violet-500/30";
}

function getRoleBadge(role) {
  const badges = {
    user: "bg-blue-500/15 text-blue-300 border-blue-500/20",
    admin: "bg-red-500/15 text-red-300 border-red-500/20",
    developer: "bg-green-500/15 text-green-300 border-green-500/20",
    system: "bg-gray-500/15 text-gray-300 border-gray-500/20",
  };
  return badges[role] || badges.system;
}

function formatActionTitle(action) {
  return action
    .split(".")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatRelativeTime(timestamp) {
  if (!timestamp) return "N/A";
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
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
