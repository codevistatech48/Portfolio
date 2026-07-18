import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GitPullRequest,
  Search,
  Loader2,
  Calendar,
  User,
  FolderKanban,
  Eye,
} from "lucide-react";
import API_URL from "../../Config/api";

export default function RevisionRequests() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [revisions, setRevisions] = useState([]);
  const [search, setSearch] = useState("");

  async function fetchRevisions() {
    try {
      setLoading(true);

      const token = localStorage.getItem("userToken");

      const response = await fetch(`${API_URL}/api/admin/revisions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Fetched revisions:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch revisions");
      }

      setRevisions(data.data?.revisions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRevisions();
  }, []);

  const filtered = revisions.filter((revision) => {
    const keyword = search.toLowerCase();

    return (
      (revision.project?.name ||
        revision.originalSrs?.projectName ||
        "")
        .toLowerCase()
        .includes(keyword) ||

      (revision.createdBy?.name || "")
        .toLowerCase()
        .includes(keyword) ||

      (revision.workflowStatus ||
        revision.status ||
        "")
        .toLowerCase()
        .includes(keyword)
    );
  });

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Revision Requests
          </h1>

          <p className="mt-2 text-slate-400">
            Review all client requested revisions.
          </p>
        </div>

        <div className="rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white">
          {filtered.length} Requests
        </div>
      </div>

      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-3.5 text-slate-500"
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search revisions..."
          className="w-full rounded-xl border border-white/10 bg-[#0D1225] py-3 pl-11 pr-4 text-white outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full">
          <thead className="bg-[#10172d]">
            <tr>
              <th className="px-6 py-4 text-left">Project</th>
              <th className="px-6 py-4 text-left">User</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((revision) => {
              const projectName =
                revision.project?.name ||
                revision.originalSrs?.projectName ||
                "Untitled Project";

              const status =
                revision.workflowStatus ||
                revision.status ||
                "pending";

              return (
                <tr
                  key={revision._id}
                  className="border-t border-white/10"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <FolderKanban
                        className="text-violet-400"
                        size={18}
                      />

                      <div>
                        <div className="font-medium">
                          {projectName}
                        </div>

                        <div className="text-xs text-slate-500">
                          Revision #{revision.revisionNumber || "-"}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <User size={16} />

                      {revision.createdBy?.name || "Unknown User"}
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span className="rounded-full bg-violet-500/20 px-3 py-1 text-sm text-violet-300 capitalize">
                      {status.replace(/_/g, " ")}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />

                      {revision.requestedAt
                        ? new Date(
                            revision.requestedAt
                          ).toLocaleDateString()
                        : "-"}
                    </div>
                  </td>

                  <td className="px-6 py-5 text-center">
                    <button
                      onClick={() =>
                        navigate(
                          `/admin/revisions/${revision._id}`
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-white transition hover:bg-violet-700"
                    >
                      <Eye size={16} />
                      Review
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!loading && filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-white/10 py-20 text-center text-slate-400">
          <GitPullRequest
            className="mx-auto mb-4"
            size={42}
          />
          No revision requests found.
        </div>
      )}
    </div>
  );
}