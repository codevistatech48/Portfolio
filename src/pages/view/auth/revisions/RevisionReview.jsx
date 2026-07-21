import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  AlertTriangle,
  FolderKanban,
  User,
  Calendar,
  GitPullRequest,
} from "lucide-react";

import API_URL from "../../../../Config/api";

import DiffViewer from "./DiffViewer";
import Timeline from "./Timeline";
import ReviewForm from "./ReviewForm";
import CommentsPanel from "../../../../components/CommentsPannel";

export default function RevisionReview() {
  const { revisionId } = useParams();
  console.log("Revision ID from params:", revisionId);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [revision, setRevision] = useState(null);
  const [diff, setDiff] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [developers, setDevelopers] = useState([]);

  // Updated initial state default value to "pending"
  const [reviewData, setReviewData] = useState({
    workflowStatus: "pending",
    estimatedCost: "",
    priority: "medium",
    developerId: "",
    reviewComment: "",
  });

  /*
  |--------------------------------------------------------------------------
  | Fetch Revision
  |--------------------------------------------------------------------------
  */
  const fetchRevision = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("userToken");

      const response = await fetch(
        `${API_URL}/api/admin/revisions/${revisionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log("Fetched revision data:", data);

      if (!response.ok) {
        throw new Error(data.message || "Unable to load revision.");
      }

      const targetRevision = data.revision || data.data?.revision || data.data;
      const targetDiff = data.diff || data.data?.diff || [];
      const targetTimeline = data.timeline || data.data?.timeline || [];

      if (!targetRevision) {
        throw new Error("Revision payload is missing required data objects.");
      }

      setRevision(targetRevision);
      setDiff(targetDiff);
      setTimeline(targetTimeline);

      // Updated fallback logic assignment to "pending"
      setReviewData((prev) => ({
        ...prev,
        workflowStatus: targetRevision.workflowStatus || "pending",
        estimatedCost: targetRevision.estimatedCost !== undefined ? targetRevision.estimatedCost : "",
        priority: targetRevision.priority || "medium",
        developerId: targetRevision.assignedDeveloper?._id || "",
        reviewComment: targetRevision.reviewComment || "",
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [revisionId]);

  /*
  |--------------------------------------------------------------------------
  | Fetch Developers
  |--------------------------------------------------------------------------
  */
  const fetchDevelopers = useCallback(async () => {
    try {
      const token = localStorage.getItem("userToken");

      const response = await fetch(
        `${API_URL}/api/admin/users?role=developer`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) return;

      const userList = data.users || data.data?.users || [];
      setDevelopers(userList);
    } catch (err) {
      console.error(err);
    }
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Load
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    fetchRevision();
    fetchDevelopers();
  }, [fetchRevision, fetchDevelopers]);

  /*
  |--------------------------------------------------------------------------
  | Submit Review
  |--------------------------------------------------------------------------
  */
 async function handleReview(payload) {
  try {
    setSaving(true);
    const token = localStorage.getItem("userToken");

    // First review request
    const isInitialReview = revision.workflowStatus === "pending";

    const endpoint = isInitialReview
      ? `${API_URL}/api/admin/revisions/${revisionId}/review`
      : `${API_URL}/api/admin/revisions/${revisionId}/workflow-status`;

    const body = isInitialReview
      ? payload
      : {
          status: payload.workflowStatus,
        };

    console.log("Endpoint:", endpoint);
    console.log("Body:", body);

    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update review status.");
    }

    await fetchRevision();
  } catch (err) {
    alert(err.message);
  } finally {
    setSaving(false);
  }
}

  /*
  |--------------------------------------------------------------------------
  | Add Comment
  |--------------------------------------------------------------------------
  */
  async function handleComment(message) {
    try {
      const token = localStorage.getItem("userToken");

      const response = await fetch(
        `${API_URL}/api/admin/revisions/${revisionId}/comments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to submit comment.");
      }

      await fetchRevision();
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-violet-500" />
      </div>
    );
  }

  if (error || !revision) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-10 text-center">
        <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-red-400" />
        <h2 className="text-2xl font-bold text-white">Failed to load revision</h2>
        <p className="mt-3 text-slate-400">{error || "Revision details are unavailable."}</p>
        <button
          onClick={fetchRevision}
          className="mt-6 rounded-xl bg-violet-600 px-6 py-3 text-white transition hover:bg-violet-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <h1 className="text-4xl font-bold text-white">Revision Review</h1>
          <p className="mt-2 text-slate-400">
            Review client requested changes before applying them to the project.
          </p>
        </div>

        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 px-6 py-4">
          <p className="text-xs uppercase tracking-wider text-violet-300">Revision Number</p>
          <h2 className="mt-2 text-3xl font-bold text-white">#{revision.revisionNumber}</h2>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-[#0D1225] p-6">
          <FolderKanban className="mb-4 text-violet-400" size={26} />
          <p className="text-sm text-slate-400">Project</p>
          <h3 className="mt-2 text-lg font-semibold text-white">
            {revision.project?.name || "Not Assigned"}
          </h3>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0D1225] p-6">
          <User className="mb-4 text-cyan-400" size={26} />
          <p className="text-sm text-slate-400">Requested By</p>
          <h3 className="mt-2 text-lg font-semibold text-white">
            {revision.createdBy?.name || "Unknown User"}
          </h3>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0D1225] p-6">
          <Calendar className="mb-4 text-green-400" size={26} />
          <p className="text-sm text-slate-400">Submitted</p>
          <h3 className="mt-2 text-lg font-semibold text-white">
            {revision.requestedAt ? new Date(revision.requestedAt).toLocaleDateString() : "N/A"}
          </h3>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0D1225] p-6">
          <GitPullRequest className="mb-4 text-orange-400" size={26} />
          <p className="text-sm text-slate-400">Status</p>
          <span
            className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm font-semibold capitalize
            ${
              revision.workflowStatus === "approved"
                ? "bg-green-500/20 text-green-300"
                : revision.workflowStatus === "rejected"
                ? "bg-red-500/20 text-red-300"
                : revision.workflowStatus === "under_review" || revision.workflowStatus === "pending"
                ? "bg-yellow-500/20 text-yellow-300"
                : "bg-violet-500/20 text-violet-300"
            }
            `}
          >
            {(revision.workflowStatus || "unknown").replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-2xl border border-white/10 bg-[#0D1225] p-8">
        <h2 className="mb-5 text-2xl font-bold text-white">Change Summary</h2>
        <p className="leading-8 text-slate-300">{revision.changeSummary || "No summary provided."}</p>
      </div>

      {/* Main Grid */}
      <div className="grid gap-8 xl:grid-cols-3">
        {/* Left column */}
        <div className="space-y-8 xl:col-span-2">
          {/* Diff Component */}
          <div className="rounded-2xl border border-white/10 bg-[#0D1225] p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">Requested Changes</h2>
            <DiffViewer diff={diff} />
          </div>

          {/* Timeline Component */}
          <div className="rounded-2xl border border-white/10 bg-[#0D1225] p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">Workflow Timeline</h2>
            <Timeline revision={revision} timeline={timeline} />
          </div>

          {/* Comments Component */}
          <CommentsPanel comments={revision.comments || []} saving={saving} onSend={handleComment} />
        </div>

        {/* Right column */}
        <div className="space-y-8">
          {/* Conditional Workflow Sidebar: Checks active workflow status states */}
          {["pending", "under_review"].includes(revision.workflowStatus) ? (
            <div className="sticky top-24 rounded-2xl border border-white/10 bg-[#0D1225] p-8">
              <h2 className="mb-6 text-2xl font-bold text-white">
                {revision.workflowStatus === "under_review" ? "Final Decision" : "Review Request"}
              </h2>
              <ReviewForm
                reviewData={reviewData}
                setReviewData={setReviewData}
                developers={developers}
                saving={saving}
                onSubmit={handleReview}
                workflowStatus={revision.workflowStatus}
              />
            </div>
          ) : (
            <div className="sticky top-24 rounded-2xl border border-white/10 bg-[#0D1225] p-8 text-center">
              <h2 className="mb-3 text-xl font-bold text-white">Review Concluded</h2>
              <p className="text-sm text-slate-400">
                This workflow history is complete. Current status is{" "}
                <span className="font-semibold capitalize text-violet-400">
                  {revision.workflowStatus.replace("_", " ")}
                </span>
                .
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#0D1225] p-6 md:flex-row">
        <div>
          <h3 className="text-lg font-semibold text-white">Revision Information</h3>
          <p className="mt-1 text-sm text-slate-400">
            Review all requested changes carefully before approving. Approved changes will update the linked project and SRS.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/admin/revisions")}
            className="rounded-xl border border-white/10 px-6 py-3 text-slate-300 transition hover:bg-white/5"
          >
            Back to Revisions
          </button>
          <button
            onClick={fetchRevision}
            className="rounded-xl bg-violet-600 px-6 py-3 font-medium text-white transition hover:bg-violet-700"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}