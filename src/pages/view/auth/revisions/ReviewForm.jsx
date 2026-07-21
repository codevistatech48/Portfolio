import { useState, useEffect } from "react";
import { 
  CheckCircle, 
  XCircle, 
  DollarSign, 
  AlertTriangle, 
  UserCog 
} from "lucide-react";

// State machine lookup table for step-by-step workflow progression
const NEXT_STATUS = {
  pending: "under_review",
  under_review: "approved",
  approved: "revision_development",
  revision_development: "revision_testing",
  revision_testing: "revision_completed",
  revision_completed: "ready_for_merge",
  ready_for_merge: "merged",
};

export default function ReviewForm({
  reviewData,
  setReviewData,
  developers,
  saving,
  onSubmit,
  workflowStatus,
}) {
  const isUnderReview = workflowStatus === "under_review";

  // Replaced hardcoded ternary configuration with state lookup table
  const [action, setAction] = useState(
    NEXT_STATUS[workflowStatus]
  );

  // Sync action state with external data changes
  useEffect(() => {
    setAction(NEXT_STATUS[workflowStatus]);
  }, [workflowStatus]);

  // Bubble form changes back up to parent state context
  useEffect(() => {
    setReviewData((prev) => ({
      ...prev,
      workflowStatus: action,
    }));
  }, [action, setReviewData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Construct request payload structurally matched to workflow state expectations
    const payload = isUnderReview
      ? { workflowStatus: action }
      : {
          workflowStatus: action,
          estimatedCost: Number(reviewData.estimatedCost) || 0,
          priority: reviewData.priority,
          developerId: reviewData.developerId,
          reviewComment: reviewData.reviewComment,
        };

    onSubmit(payload);
  };

  // Helper function to format the button label neatly based on the next state value
  const getButtonLabel = () => {
    const next = NEXT_STATUS[workflowStatus] || "";
    return next.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Action Selector Toggles */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Select Action
        </label>
        <div className="flex gap-4">
          {/* Replaced hardcoded toggle layout target action assignment with lookup function */}
          <button
            type="button"
            onClick={() => setAction(NEXT_STATUS[workflowStatus])}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition ${
              action === NEXT_STATUS[workflowStatus]
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                : "bg-[#151D35] text-slate-400 hover:bg-[#1b2542] hover:text-slate-200"
            }`}
          >
            <CheckCircle size={16} />
            Progress to {getButtonLabel()}
          </button>

          <button
            type="button"
            onClick={() => setAction("rejected")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition ${
              action === "rejected"
                ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                : "bg-[#151D35] text-slate-400 hover:bg-[#1b2542] hover:text-slate-200"
            }`}
          >
            <XCircle size={16} />
            Reject
          </button>
        </div>
      </div>

      {/* Primary Scope Options: Hidden if evaluating further advanced stage reviews */}
      {(!isUnderReview && action !== "rejected" && workflowStatus === "pending") && (
        <>
          {/* Estimated Cost */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
              <DollarSign size={16} />
              Estimated Cost ($)
            </label>
            <input
              type="number"
              required
              min="0"
              value={reviewData.estimatedCost}
              onChange={(e) =>
                setReviewData((prev) => ({
                  ...prev,
                  estimatedCost: e.target.value,
                }))
              }
              placeholder="e.g. 450"
              className="w-full rounded-xl border border-white/10 bg-[#151D35] px-4 py-3 text-white outline-none focus:border-violet-500"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
              <AlertTriangle size={16} />
              Priority Level
            </label>
            <select
              value={reviewData.priority}
              onChange={(e) =>
                setReviewData((prev) => ({
                  ...prev,
                  priority: e.target.value,
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-[#151D35] px-4 py-3 text-white outline-none focus:border-violet-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Assign Developer */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
              <UserCog size={16} />
              Assign Developer
            </label>
            <select
              required
              value={reviewData.developerId}
              onChange={(e) =>
                setReviewData((prev) => ({
                  ...prev,
                  developerId: e.target.value,
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-[#151D35] px-4 py-3 text-white outline-none focus:border-violet-500"
            >
              <option key="default-placeholder" value="">
                Select Developer
              </option>
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
              Review Comments / Instructions
            </label>
            <textarea
              rows={4}
              value={reviewData.reviewComment}
              onChange={(e) =>
                setReviewData((prev) => ({
                  ...prev,
                  reviewComment: e.target.value,
                }))
              }
              placeholder="Provide context regarding requirements prioritization or task assignments..."
              className="w-full rounded-xl border border-white/10 bg-[#151D35] p-4 text-white outline-none focus:border-violet-500 resize-none"
            />
          </div>
        </>
      )}

      {/* Submission Action Button */}
      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-xl bg-violet-600 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50"
      >
        {saving ? "Processing Decision..." : "Submit Review Action"}
      </button>
    </form>
  );
}