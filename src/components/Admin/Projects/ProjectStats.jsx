import {
  FolderKanban,
  Clock3,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function ProjectStats({ projects = [] }) {
  const total = projects.length;

  const active = projects.filter((p) =>
    ["planning", "ui_design", "development", "testing", "deployment"].includes(
      p.status
    )
  ).length;

  const completed = projects.filter(
    (p) => p.status === "completed"
  ).length;

  const delayed = projects.filter((p) => {
    if (!p.deadline) return false;

    return (
      new Date(p.deadline) < new Date() &&
      p.status !== "completed"
    );
  }).length;

  const cards = [
    {
      title: "Total Projects",
      value: total,
      icon: FolderKanban,
      color: "from-violet-500 to-indigo-500",
    },
    {
      title: "Active",
      value: active,
      icon: Clock3,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Completed",
      value: completed,
      icon: CheckCircle2,
      color: "from-emerald-500 to-green-500",
    },
    {
      title: "Delayed",
      value: delayed,
      icon: AlertTriangle,
      color: "from-red-500 to-orange-500",
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-3xl border border-white/10 bg-[#151B30]/90 p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-400">
                  {card.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-white">
                  {card.value}
                </h2>

              </div>

              <div
                className={`rounded-2xl bg-gradient-to-r ${card.color} p-4`}
              >
                <Icon
                  className="text-white"
                  size={24}
                />
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}

