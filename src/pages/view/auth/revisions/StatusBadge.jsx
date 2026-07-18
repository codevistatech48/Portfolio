import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  FolderKanban,
  User,
  Calendar,
  GitPullRequest,
  Loader2,
  AlertTriangle,
} from "lucide-react";

import API_URL from "../../../Config/api";

export default function RevisionReview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [revision, setRevision] = useState(null);
  const [diff, setDiff] = useState([]);
  const [timeline, setTimeline] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [reviewData, setReviewData] = useState({
    workflowStatus: "approved",
    estimatedCost: "",
    priority: "",
    developerId: "",
    reviewComment: "",
  });

  useEffect(() => {
    fetchRevision();
  }, [id]);

  async function fetchRevision() {
    setLoading(true);

    try {
      const token = localStorage.getItem("userToken");

      const res = await fetch(
        `${API_URL}/api/admin/revisions/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setRevision(data.revision);
      setDiff(data.diff || []);
      setTimeline(data.timeline || []);

      setReviewData((prev) => ({
        ...prev,
        estimatedCost:
          data.revision.estimatedCost || "",
        priority:
          data.revision.priority || "medium",
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-violet-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-10 text-center">
        <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-red-400" />

        <h2 className="text-xl font-bold text-white">
          Failed to load revision
        </h2>

        <p className="mt-2 text-slate-400">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex flex-wrap items-center justify-between gap-5">

        <div>

          <button
            onClick={() => navigate(-1)}
            className="mb-5 flex items-center gap-2 text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={18} />

            Back
          </button>

          <h1 className="text-4xl font-bold text-white">
            Revision Review
          </h1>

          <p className="mt-2 text-slate-400">
            Review and approve client revision
            request.
          </p>
        </div>

        <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 px-5 py-3">

          <div className="text-xs uppercase tracking-wider text-violet-300">
            Revision
          </div>

          <div className="mt-1 text-3xl font-bold text-white">
            #{revision.revisionNumber}
          </div>

        </div>

      </div>

      {/* INFO CARDS */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-white/10 bg-[#0D1225] p-6">

          <FolderKanban className="mb-3 text-violet-400" />

          <p className="text-sm text-slate-400">
            Project
          </p>

          <h2 className="mt-2 text-lg font-semibold text-white">
            {revision.project?.name || "Not Assigned"}
          </h2>

        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0D1225] p-6">

          <User className="mb-3 text-cyan-400" />

          <p className="text-sm text-slate-400">
            Requested By
          </p>

          <h2 className="mt-2 text-lg font-semibold text-white">
            {revision.createdBy?.name}
          </h2>

        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0D1225] p-6">

          <Calendar className="mb-3 text-green-400" />

          <p className="text-sm text-slate-400">
            Submitted
          </p>

          <h2 className="mt-2 text-lg font-semibold text-white">
            {new Date(
              revision.requestedAt
            ).toLocaleDateString()}
          </h2>

        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0D1225] p-6">

          <GitPullRequest className="mb-3 text-orange-400" />

          <p className="text-sm text-slate-400">
            Workflow
          </p>

          <span className="mt-3 inline-flex rounded-full bg-yellow-500/20 px-3 py-1 text-sm font-semibold capitalize text-yellow-300">

            {revision.workflowStatus}

          </span>

        </div>

      </div>

      {/* CHANGE SUMMARY */}

      <div className="rounded-2xl border border-white/10 bg-[#0D1225] p-8">

        <h2 className="mb-5 text-2xl font-semibold text-white">
          Change Summary
        </h2>

        <p className="leading-8 text-slate-300">
          {revision.changeSummary}
        </p>

      </div>

      {/* MAIN CONTENT */}

      <div className="grid gap-8 xl:grid-cols-3">

        {/* LEFT */}

        <div className="space-y-8 xl:col-span-2">

          <div className="rounded-2xl border border-white/10 bg-[#0D1225] p-8">

            <h2 className="mb-6 text-2xl font-semibold text-white">
              Requested Changes
            </h2>

            <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-white/10 text-slate-500">

              DiffViewer Component

            </div>

          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0D1225] p-8">

            <h2 className="mb-6 text-2xl font-semibold text-white">

              Activity Timeline

            </h2>

            <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-white/10 text-slate-500">

              Timeline Component

            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="space-y-8">

          <div className="rounded-2xl border border-white/10 bg-[#0D1225] p-8">

            <h2 className="mb-6 text-2xl font-semibold text-white">

              Review Request

            </h2>

            <div className="flex h-[500px] items-center justify-center rounded-xl border border-dashed border-white/10 text-slate-500">

              ReviewForm Component

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}