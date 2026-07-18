import {
  ArrowRight,
  CheckCircle2,
  Edit3,
} from "lucide-react";

function formatValue(value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : "—";
  }

  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

export default function DiffViewer({ diff = [] }) {
  if (!diff.length) {
    return (
      <div className="flex h-60 items-center justify-center rounded-xl border border-dashed border-white/10 text-slate-500">
        No changes found.
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {diff.map((item, index) => (
        <div
          key={index}
          className="rounded-2xl border border-white/10 bg-[#11182F] overflow-hidden"
        >

          {/* Header */}

          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">

            <div className="flex items-center gap-3">

              <Edit3
                size={18}
                className="text-violet-400"
              />

              <h3 className="font-semibold text-white capitalize">
                {item.field}
              </h3>

            </div>

            <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-300">
              Changed
            </span>

          </div>

          {/* Values */}

          <div className="grid gap-6 p-6 lg:grid-cols-2">

            {/* OLD */}

            <div>

              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-red-400">
                Original Value
              </p>

              <div className="min-h-[90px] rounded-xl border border-red-500/20 bg-red-500/5 p-4">

                <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-7 text-slate-300">
                  {formatValue(item.oldValue)}
                </pre>

              </div>

            </div>

            {/* NEW */}

            <div>

              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-green-400">
                Requested Value
              </p>

              <div className="min-h-[90px] rounded-xl border border-green-500/20 bg-green-500/5 p-4">

                <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-7 text-slate-200">
                  {formatValue(item.newValue)}
                </pre>

              </div>

            </div>

          </div>

          {/* Bottom */}

          <div className="flex items-center justify-center gap-3 border-t border-white/10 py-4 text-violet-300">

            <ArrowRight size={18} />

            <CheckCircle2 size={18} />

            <span className="text-sm">
              Update will replace the original value after approval.
            </span>

          </div>

        </div>
      ))}

    </div>
  );
}