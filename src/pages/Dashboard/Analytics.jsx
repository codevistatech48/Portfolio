import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, Calendar, TrendingUp, Users, FolderOpen, GitPullRequest, CheckCircle, XCircle, Clock, BarChart3 } from "lucide-react";
import API_URL from "../../Config/api";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];

const PERIODS = [
  { value: "today", label: "Today" },
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "3m", label: "3 Months" },
  { value: "1y", label: "1 Year" },
];

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded bg-white/10 ${className}`} />;
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [charts, setCharts] = useState({});
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30d");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("userToken");

      const [overviewRes, ...chartRes] = await Promise.all([
        fetch(`${API_URL}/api/analytics/admin/overview?period=${period}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/analytics/admin/monthly-projects?period=${period}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/analytics/admin/project-status?period=${period}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/analytics/admin/revision-status?period=${period}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/analytics/admin/srs-trend?period=${period}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/analytics/admin/completion-trend?period=${period}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/analytics/admin/revision-approval?period=${period}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/analytics/admin/developer-workload?period=${period}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/analytics/admin/activity-heatmap?period=${period}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const [overviewData, monthlyProjects, projectStatus, revisionStatus, srsTrend, completionTrend, approvalVsRejection, developerWorkload, activityHeatmap] = await Promise.all([
        overviewRes.json(),
        chartRes[0].json(),
        chartRes[1].json(),
        chartRes[2].json(),
        chartRes[3].json(),
        chartRes[4].json(),
        chartRes[5].json(),
        chartRes[6].json(),
        chartRes[7].json(),
      ]);

      if (!overviewRes.ok) throw new Error(overviewData.message || "Failed to load analytics");

      setAnalytics(overviewData.data);
      setCharts({
        monthlyProjects: monthlyProjects.data || [],
        projectStatus: projectStatus.data || [],
        revisionStatus: revisionStatus.data || [],
        srsTrend: srsTrend.data || [],
        completionTrend: completionTrend.data || [],
        approvalVsRejection: approvalVsRejection.data || [],
        developerWorkload: developerWorkload.data || [],
        activityHeatmap: activityHeatmap.data || [],
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      const token = localStorage.getItem("userToken");
      const res = await fetch(`${API_URL}/api/analytics/export?format=${format}&period=${period}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `analytics_${period}.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`Analytics exported as ${format.toUpperCase()}`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#090D1C] text-white p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 11 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#090D1C] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-400">{error}</p>
          <Link to="/dashboard" className="mt-4 inline-flex items-center gap-2 text-violet-400 hover:text-violet-300">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const overviewCards = [
    { label: "Total Projects", value: analytics?.overview?.totalProjects || 0, icon: FolderOpen, color: "text-violet-400" },
    { label: "Active Projects", value: analytics?.overview?.activeProjects || 0, icon: TrendingUp, color: "text-blue-400" },
    { label: "Projects In Revision", value: analytics?.overview?.projectsInRevision || 0, icon: GitPullRequest, color: "text-amber-400" },
    { label: "Completed Projects", value: analytics?.overview?.completedProjects || 0, icon: CheckCircle, color: "text-green-400" },
    { label: "Pending SRS", value: analytics?.overview?.pendingSrs || 0, icon: Clock, color: "text-orange-400" },
    { label: "Active Developers", value: analytics?.overview?.activeDevelopers || 0, icon: Users, color: "text-cyan-400" },
    { label: "Completed Revisions", value: analytics?.overview?.completedRevisions || 0, icon: CheckCircle, color: "text-green-400" },
    { label: "Rejected Revisions", value: analytics?.overview?.rejectedRevisions || 0, icon: XCircle, color: "text-red-400" },
    { label: "Revision Approval Rate", value: analytics?.overview?.revisionApprovalRate || "0%", icon: BarChart3, color: "text-purple-400" },
    { label: "Avg Completion Time", value: analytics?.overview?.avgCompletionTime || "N/A", icon: Clock, color: "text-yellow-400" },
    { label: "Avg Revisions/Project", value: analytics?.overview?.avgRevisionCount || "0", icon: GitPullRequest, color: "text-pink-400" },
  ];

  return (
    <main className="min-h-screen bg-[#090D1C] text-white">
      <div className="pointer-events-none fixed inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
      <div className="pointer-events-none fixed -left-44 top-16 h-[420px] w-[420px] rounded-full bg-violet-700/20 blur-[120px]" />
      <div className="pointer-events-none fixed -right-44 bottom-0 h-[420px] w-[420px] rounded-full bg-fuchsia-700/20 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-12 pt-28 sm:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link to="/dashboard" className="mb-4 inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition">
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold">Analytics Dashboard</h1>
            <p className="mt-2 text-gray-400">Comprehensive insights and metrics</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Period Filter */}
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium focus:border-violet-500/30 focus:outline-none"
            >
              {PERIODS.map((p) => (
                <option key={p.value} value={p.value} className="bg-[#151B30]">
                  {p.label}
                </option>
              ))}
            </select>

            {/* Export Buttons */}
            <button
              onClick={() => handleExport("csv")}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/10"
            >
              <Download size={16} />
              Export CSV
            </button>
            <button
              onClick={() => handleExport("json")}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-600 px-4 py-2.5 text-sm font-semibold transition hover:scale-[1.02]"
            >
              <Download size={16} />
              Export JSON
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {overviewCards.map((card, index) => (
            <div key={index} className="rounded-2xl border border-white/10 bg-[#151B30]/90 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">{card.label}</p>
                  <p className={`mt-1 text-2xl font-bold ${card.color}`}>{card.value}</p>
                </div>
                <card.icon size={24} className={card.color} />
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Monthly Projects Created */}
          <div className="rounded-3xl border border-white/10 bg-[#151B30]/90 p-6 backdrop-blur-xl">
            <h3 className="text-lg font-semibold mb-4">Monthly Projects Created</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={charts.monthlyProjects}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#151B30", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Area type="monotone" dataKey="count" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Project Status Distribution */}
          <div className="rounded-3xl border border-white/10 bg-[#151B30]/90 p-6 backdrop-blur-xl">
            <h3 className="text-lg font-semibold mb-4">Project Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={charts.projectStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {charts.projectStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#151B30", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                  labelStyle={{ color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Revision Status Distribution */}
          <div className="rounded-3xl border border-white/10 bg-[#151B30]/90 p-6 backdrop-blur-xl">
            <h3 className="text-lg font-semibold mb-4">Revision Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={charts.revisionStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#151B30", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="value" fill="#3b82f6">
                  {charts.revisionStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* SRS Request Trend */}
          <div className="rounded-3xl border border-white/10 bg-[#151B30]/90 p-6 backdrop-blur-xl">
            <h3 className="text-lg font-semibold mb-4">SRS Request Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={charts.srsTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#151B30", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Project Completion Trend */}
          <div className="rounded-3xl border border-white/10 bg-[#151B30]/90 p-6 backdrop-blur-xl">
            <h3 className="text-lg font-semibold mb-4">Project Completion Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={charts.completionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#151B30", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Area type="monotone" dataKey="count" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Revision Approval vs Rejection */}
          <div className="rounded-3xl border border-white/10 bg-[#151B30]/90 p-6 backdrop-blur-xl">
            <h3 className="text-lg font-semibold mb-4">Revision Approval vs Rejection</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={charts.approvalVsRejection}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {charts.approvalVsRejection.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#10b981" : "#ef4444"} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#151B30", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                  labelStyle={{ color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Developer Workload */}
          <div className="rounded-3xl border border-white/10 bg-[#151B30]/90 p-6 backdrop-blur-xl lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Developer Workload</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={charts.developerWorkload}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#151B30", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Legend />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
                <Bar dataKey="inProgress" fill="#f59e0b" name="In Progress" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Activity Heatmap */}
          <div className="rounded-3xl border border-white/10 bg-[#151B30]/90 p-6 backdrop-blur-xl lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Activity Heatmap</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={charts.activityHeatmap}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#151B30", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Area type="monotone" dataKey="count" stroke="#ec4899" fill="#ec4899" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </main>
  );
}