import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BarChart3, FolderKanban, Plus, Settings, Sparkles, FileText, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import API_URL from "../../Config/api";

const STATS_CONFIG = [
  { key: "totalSrsRequests", label: "Total SRS Requests", icon: FileText, color: "from-blue-500/20 to-blue-600/10" },
  { key: "pendingRequests", label: "Pending Requests", icon: Clock, color: "from-yellow-500/20 to-yellow-600/10" },
  { key: "acceptedProjects", label: "Accepted Projects", icon: CheckCircle, color: "from-green-500/20 to-green-600/10" },
  { key: "completedProjects", label: "Completed Projects", icon: CheckCircle, color: "from-emerald-500/20 to-emerald-600/10" },
  { key: "inProgressProjects", label: "In Progress Projects", icon: FolderKanban, color: "from-indigo-500/20 to-indigo-600/10" },
  { key: "rejectedRequests", label: "Rejected Requests", icon: XCircle, color: "from-red-500/20 to-red-600/10" },
];

function SkeletonCard() {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#151B30]/90 p-6 backdrop-blur-xl animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-4 w-32 rounded bg-white/10" />
          <div className="h-8 w-16 rounded bg-white/10" />
        </div>
        <div className="h-12 w-12 rounded-2xl bg-white/10" />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("userToken");

        // Fetch profile, stats, and activity in parallel
        const [profileRes, statsRes, activityRes] = await Promise.all([
          fetch(`${API_URL}/api/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/dashboard/stats`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/dashboard/activity`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const [profileData, statsData, activityData] = await Promise.all([
          profileRes.json(),
          statsRes.json(),
          activityRes.json(),
        ]);

        if (!profileRes.ok) throw new Error(profileData.message || "Failed to load profile");
        if (!statsRes.ok) throw new Error(statsData.message || "Failed to load stats");
        if (!activityRes.ok) throw new Error(activityData.message || "Failed to load activity");

        setUser(profileData.user || profileData);
        setStats(statsData.data);
        setActivity(activityData.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error} />;

  const joinedDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "N/A";

  return (
    <main className="min-h-screen bg-[#090D1C] text-white">
      <div className="pointer-events-none fixed inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
      <div className="pointer-events-none fixed -left-44 top-16 h-[420px] w-[420px] rounded-full bg-violet-700/20 blur-[120px]" />
      <div className="pointer-events-none fixed -right-44 bottom-0 h-[420px] w-[420px] rounded-full bg-fuchsia-700/20 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-12 pt-32 sm:px-8">
        {/* Welcome Section */}
        <section className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">Your workspace</p>
            <h1 className="text-4xl font-bold sm:text-5xl">Welcome back, {user?.name?.split(" ")[0] || "User"}.</h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <span>{user?.email}</span>
              <span className="hidden sm:inline">•</span>
              <span>Joined {joinedDate}</span>
              <span className="hidden sm:inline">•</span>
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs ${user?.emailVerified ? "border-green-500/30 bg-green-500/10 text-green-400" : "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"}`}>
                {user?.emailVerified ? "Verified" : "Unverified"}
              </span>
            </div>
          </div>
          <Link
            to="/srs"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-600 px-5 py-3 font-semibold shadow-[0_12px_30px_rgba(124,58,237,0.30)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(124,58,237,0.40)]"
          >
            <Plus size={19} />
            New Project Request
          </Link>
        </section>

        {/* Stats Cards */}
        <section className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {STATS_CONFIG.map((stat) => {
            const Icon = stat.icon;
            const value = stats?.[stat.key] ?? 0;

            return (
              <article key={stat.key} className={`rounded-3xl border border-white/10 bg-[#151B30]/90 p-6 backdrop-blur-xl bg-gradient-to-br ${stat.color}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                    <p className="mt-3 text-4xl font-bold">{value}</p>
                  </div>
                  <div className="rounded-2xl bg-violet-500/15 p-3 text-violet-300">
                    <Icon size={22} />
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* Recent Activity & Profile Summary */}
        <section className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Recent Activity */}
          <div className="rounded-3xl border border-white/10 bg-[#151B30]/90 p-7 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Recent activity</h2>
                <p className="mt-1 text-sm text-slate-400">Stay up to date with your workspace.</p>
              </div>
              <BarChart3 className="text-violet-400" />
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              {activity.length > 0 ? (
                <div className="space-y-4">
                  {activity.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-violet-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium capitalize">{item.action.replace(/_/g, " ")}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.entity} • {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <p className="font-medium">Your dashboard is ready</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">Create a project request to start collaborating with the CodeVista team.</p>
                </div>
              )}
            </div>
          </div>

          {/* Profile Summary */}
          <div className="rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 p-7">
            <Settings className="text-violet-300" />
            <h2 className="mt-5 text-xl font-semibold">Complete your profile</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">Add your details to help us tailor project recommendations.</p>
            <Link to="/profile" className="mt-6 inline-block text-sm font-semibold text-violet-300 transition hover:text-white">
              Go to profile →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function LoadingSkeleton() {
  return (
    <main className="min-h-screen bg-[#090D1C] text-white">
      <div className="pointer-events-none fixed inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-12 pt-32 sm:px-8">
        <div className="space-y-4">
          <SkeletonCard />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    </main>
  );
}

function ErrorState({ message }) {
  return (
    <main className="min-h-screen bg-[#090D1C] text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg text-red-400">{message}</p>
      </div>
    </main>
  );
}