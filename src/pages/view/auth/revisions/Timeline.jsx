import {
  CheckCircle2,
  Circle,
  Clock3,
  XCircle,
  GitMerge,
} from "lucide-react";

const WORKFLOW = [
  {
    key: "pending",
    label: "Revision Submitted",
  },
  {
    key: "under_review",
    label: "Under Review",
  },
  {
    key: "approved",
    label: "Approved",
  },
  {
    key: "merged",
    label: "Merged",
  },
];

const STATUS_ORDER = {
  pending: 0,
  submitted: 0,
  under_review: 1,
  approved: 2,
  revision_development: 2,
  revision_testing: 2,
  revision_completed: 2,
  ready_for_merge: 2,
  merged: 3,
  rejected: 1,
};

export default function Timeline({
  revision,
  timeline = [],
}) {
  const current =
    STATUS_ORDER[
      revision.workflowStatus
    ] ?? 0;

  const isRejected =
    revision.workflowStatus === "rejected";

  return (
    <div className="space-y-8">

      {WORKFLOW.map((step, index) => {
        const finished = index < current;
        const active = index === current;

        const event = timeline.find((t) =>
          t.title
            ?.toLowerCase()
            .replace(/\s/g, "_")
            .includes(step.key)
        );

        return (
          <div
            key={step.key}
            className="relative flex gap-5"
          >
            {/* Vertical Line */}

            {index !== WORKFLOW.length - 1 && (
              <div
                className={`absolute left-[17px] top-10 h-full w-[2px]
                ${
                  finished
                    ? "bg-green-500"
                    : isRejected
                    ? "bg-red-500/30"
                    : "bg-white/10"
                }`}
              />
            )}

            {/* Icon */}

            <div
              className={`z-10 flex h-9 w-9 items-center justify-center rounded-full border
              ${
                isRejected
                  ? "border-red-500 bg-red-500/20 text-red-400"
                  : finished && step.key === "merged"
                  ? "border-purple-500 bg-purple-500 text-white"
                  : finished
                  ? "border-green-500 bg-green-500 text-white"
                  : active
                  ? "border-yellow-400 bg-yellow-500/20 text-yellow-300"
                  : "border-white/10 bg-[#151D35] text-slate-500"
              }`}
            >
              {isRejected ? (
                <XCircle size={18} />
              ) : finished && step.key === "merged" ? (
                <GitMerge size={18} />
              ) : finished ? (
                <CheckCircle2 size={18} />
              ) : active ? (
                <Clock3 size={18} />
              ) : (
                <Circle size={14} />
              )}
            </div>

            {/* Content */}

            <div className="pb-10">

              <h3
                className={`font-semibold
                ${
                  isRejected
                    ? "text-red-400"
                    : finished || active
                    ? "text-white"
                    : "text-slate-500"
                }`}
              >
                {step.label}
              </h3>

              {event?.date && (
                <p className="mt-1 text-sm text-slate-400">
                  {new Date(
                    event.date
                  ).toLocaleString()}
                </p>
              )}

              {event?.user?.name && (
                <p className="mt-1 text-sm text-violet-300">
                  {event.user.name}
                </p>
              )}

            </div>
          </div>
        );
      })}
    </div>
  );
}
