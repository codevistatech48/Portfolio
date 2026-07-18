import {
  RefreshCw,
  Search,
  Filter,
  FolderKanban,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import API_URL from "../../Config/api";

import ProjectStats from  "../../components/Admin/Projects/ProjectStats";
import ProjectCard from "../../components/Admin/Projects/ProjectCard";
import ProjectModal from "../../components/Admin/Projects/ ProjectModal";

const getItems = (data) =>
  data.projects ||
  data.data?.projects ||
  data.items ||
  data.data ||
  [];

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedProject, setSelectedProject] = useState(null);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/admin/projects`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load projects.");
      }

      setProjects(getItems(data));

      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();

    const interval = setInterval(loadProjects, 30000);

    return () => clearInterval(interval);
  }, [loadProjects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        (project.name || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (project.projectName || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (project.clientName || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, statusFilter]);

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <p className="text-sm uppercase tracking-[0.3em] text-violet-400">
            CodeVista Admin
          </p>

          <h1 className="mt-2 text-4xl font-bold text-white">
            Project Management
          </h1>

          <p className="mt-2 text-slate-400">
            Manage projects, teams, deadlines and progress.
          </p>

        </div>

        <button
          onClick={loadProjects}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-white transition hover:bg-violet-700 disabled:opacity-50"
        >
          <RefreshCw
            size={18}
            className={loading ? "animate-spin" : ""}
          />

          Refresh

        </button>

      </div>

      {/* Statistics */}

      <ProjectStats projects={projects} />

      {/* Search & Filters */}

      <div className="rounded-2xl border border-white/10 bg-[#151B30]/90 p-5">

        <div className="grid gap-4 md:grid-cols-3">

          {/* Search */}

          <div className="relative">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              placeholder="Search project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0B1120] py-3 pl-11 pr-4 text-white outline-none focus:border-violet-500"
            />

          </div>

          {/* Status */}

          <div className="relative">

            <Filter
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0B1120] py-3 pl-11 pr-4 text-white outline-none"
            >
              <option value="all">All Projects</option>
              <option value="planning">Planning</option>
              <option value="ui_design">UI Design</option>
              <option value="development">Development</option>
              <option value="testing">Testing</option>
              <option value="deployment">Deployment</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

          </div>

          {/* Count */}

          <div className="flex items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-300">

            Showing {filteredProjects.length} Projects

          </div>

        </div>

      </div>

      {/* Error */}

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      {/* Loading */}

      {loading && !projects.length && (
        <div className="py-24 text-center">

          <RefreshCw
            className="mx-auto animate-spin text-violet-400"
            size={36}
          />

          <p className="mt-4 text-slate-400">
            Loading projects...
          </p>

        </div>
      )}

      {/* Empty */}

      {!loading && filteredProjects.length === 0 && (
        <div className="rounded-3xl border border-dashed border-white/10 py-24 text-center">

          <FolderKanban
            size={60}
            className="mx-auto text-slate-500"
          />

          <h2 className="mt-5 text-2xl font-semibold text-white">
            No Projects Found
          </h2>

          <p className="mt-2 text-slate-400">
            Try changing the filters.
          </p>

        </div>
      )}

      {/* Grid */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {filteredProjects.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            onManage={() => setSelectedProject(project)}
            onRefresh={loadProjects}
          />
        ))}

      </div>

      {/* Modal */}

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onUpdated={() => {
            loadProjects();
            setSelectedProject(null);
          }}
        />
      )}

    </div>
  );
}