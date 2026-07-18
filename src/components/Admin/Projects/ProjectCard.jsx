import {
  CalendarDays,
  DollarSign,
  FolderKanban,
  Trash2,
  Users,
  Settings,
  Flag,
} from "lucide-react";

import API_URL from "../../../Config/api";

const statusColors = {
  planning: "bg-yellow-500/20 text-yellow-300",

  ui_design: "bg-pink-500/20 text-pink-300",

  development: "bg-blue-500/20 text-blue-300",

  testing: "bg-orange-500/20 text-orange-300",

  deployment: "bg-cyan-500/20 text-cyan-300",

  completed: "bg-green-500/20 text-green-300",

  cancelled: "bg-red-500/20 text-red-300",
};

const priorityColors = {
  low: "text-green-300",

  medium: "text-yellow-300",

  high: "text-orange-300",

  critical: "text-red-400",
};

export default function ProjectCard({
  project,
  onManage,
  onRefresh,
}) {
  async function removeProject() {
    if (!window.confirm("Delete this project?")) return;

    try {
      const response = await fetch(
        `${API_URL}/api/admin/projects/${project._id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "userToken"
            )}`,
          },

          credentials: "include",
        }
      );

      if (!response.ok)
        throw new Error("Unable to delete.");

      onRefresh();
    } catch (err) {
      alert(err.message);
    }
  }

  const progress = Math.min(
    Math.max(Number(project.progress || 0), 0),
    100
  );

  return (
    <div className="group rounded-3xl border border-white/10 bg-[#151B30]/90 p-6 shadow-xl transition hover:-translate-y-1 hover:border-violet-500/40">

      <div className="flex items-start justify-between">

        <div className="rounded-xl bg-violet-500/15 p-3">

          <FolderKanban
            size={24}
            className="text-violet-300"
          />

        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            statusColors[project.status] ||
            "bg-white/10 text-slate-300"
          }`}
        >
          {project.status || "planning"}
        </span>

      </div>

      <h2 className="mt-5 text-xl font-bold text-white">
        {project.name ||
          project.projectName ||
          "Untitled Project"}
      </h2>

      <p className="mt-3 line-clamp-2 text-sm text-slate-400">
        {project.description || "No description."}
      </p>

      <div className="mt-6 space-y-3">

        <div className="flex items-center gap-2 text-sm text-slate-400">

          <Users
            size={16}
            className="text-violet-300"
          />

          {Array.isArray(project.team)
            ? `${project.team.length} Members`
            : project.team || "No Team"}

        </div>

        <div className="flex items-center gap-2 text-sm text-slate-400">

          <CalendarDays
            size={16}
            className="text-violet-300"
          />

          {project.deadline
            ? new Date(
                project.deadline
              ).toLocaleDateString()
            : "No Deadline"}

        </div>

        <div className="flex items-center gap-2 text-sm text-slate-400">

          <DollarSign
            size={16}
            className="text-violet-300"
          />

          ₹ {project.budget || 0}

        </div>

        <div className="flex items-center gap-2 text-sm">

          <Flag
            size={16}
            className={
              priorityColors[
                project.priority || "medium"
              ]
            }
          />

          <span
            className={
              priorityColors[
                project.priority || "medium"
              ]
            }
          >
            {(project.priority || "Medium").toUpperCase()}
          </span>

        </div>

      </div>

      <div className="mt-6">

        <div className="mb-2 flex justify-between text-xs text-slate-400">

          <span>Progress</span>

          <span>{progress}%</span>

        </div>

        <div className="h-2 overflow-hidden rounded-full bg-white/10">

          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

      </div>

      <div className="mt-8 flex gap-3">

        <button
          onClick={onManage}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 font-medium text-white transition hover:bg-violet-700"
        >
          <Settings size={18} />

          Manage

        </button>

        <button
          onClick={removeProject}
          className="rounded-xl border border-red-500/30 px-4 text-red-300 transition hover:bg-red-500/10"
        >
          <Trash2 size={18} />
        </button>

      </div>

    </div>
  );
}