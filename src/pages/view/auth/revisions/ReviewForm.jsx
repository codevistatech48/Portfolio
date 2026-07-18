import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  DollarSign,
  UserCog,
  Flag,
  Send,
} from "lucide-react";

export default function ReviewForm({
  reviewData,
  setReviewData,
  developers = [],
  saving,
  onSubmit,
}) {
  const [action, setAction] = useState("approved");

  const handleSubmit = () => {
    onSubmit({
      ...reviewData,
      workflowStatus: action,
    });
  };

  return (
    <div className="space-y-6">

      {/* Estimated Cost */}

      <div>
        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
          <DollarSign size={16} />
          Estimated Cost (₹)
        </label>

        <input
          type="number"
          min="0"
          value={reviewData.estimatedCost}
          onChange={(e) =>
            setReviewData((prev) => ({
              ...prev,
              estimatedCost: e.target.value,
            }))
          }
          className="w-full rounded-xl border border-white/10 bg-[#151D35] px-4 py-3 text-white outline-none transition focus:border-violet-500"
        />
      </div>

      {/* Priority */}

      <div>
        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
          <Flag size={16} />
          Priority
        </label>

        <select
          value={reviewData.priority}
          onChange={(e) =>
            setReviewData((prev) => ({
              ...prev,
              priority: e.target.value,
            }))
          }
          className="w-full rounded-xl border border-white/10 bg-[#151D35] px-4 py-3 text-white outline-none"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      {/* Assign Developer */}

      <div>
        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
          <UserCog size={16} />
          Assign Developer
        </label>

        <select
          value={reviewData.developerId}
          onChange={(e) =>
            setReviewData((prev) => ({
              ...prev,
              developerId: e.target.value,
            }))
          }
          className="w-full rounded-xl border border-white/10 bg-[#151D35] px-4 py-3 text-white outline-none"
        >
          <option value="">Select Developer</option>

          {developers.map((dev) => (
            <option key={dev._id} value={dev._id}>
              {dev.name}
            </option>
          ))}
        </select>
      </div>

      {/* Review Comment */}

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Review Comment
        </label>

        <textarea
          rows={6}
          value={reviewData.reviewComment}
          onChange={(e) =>
            setReviewData((prev) => ({
              ...prev,
              reviewComment: e.target.value,
            }))
          }
          placeholder="Write review..."
          className="w-full rounded-xl border border-white/10 bg-[#151D35] px-4 py-3 text-white outline-none transition focus:border-violet-500"
        />
      </div>

      {/* Status */}

      <div>
        <label className="mb-3 block text-sm font-medium text-slate-300">
          Decision
        </label>

        <div className="grid grid-cols-2 gap-4">

          <button
            type="button"
            onClick={() => setAction("approved")}
            className={`rounded-xl border px-4 py-3 transition ${
              action === "approved"
                ? "border-green-500 bg-green-500/20 text-green-300"
                : "border-white/10 bg-[#151D35] text-slate-300"
            }`}
          >
            <CheckCircle2
              className="mx-auto mb-2"
              size={22}
            />
            Approve
          </button>

          <button
            type="button"
            onClick={() => setAction("rejected")}
            className={`rounded-xl border px-4 py-3 transition ${
              action === "rejected"
                ? "border-red-500 bg-red-500/20 text-red-300"
                : "border-white/10 bg-[#151D35] text-slate-300"
            }`}
          >
            <XCircle
              className="mx-auto mb-2"
              size={22}
            />
            Reject
          </button>

        </div>
      </div>

      {/* Submit */}

      <button
        disabled={saving}
        onClick={handleSubmit}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-4 font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50"
      >
        <Send size={18} />

        {saving
          ? "Saving..."
          : "Submit Review"}
      </button>

    </div>
  );
}