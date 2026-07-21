import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, CheckCircle, Clock, GitPullRequest, BarChart3 } from "lucide-react";
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
} from "recharts";

const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

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

export default function DeveloperAnalytics() {
  const [analytics, setAnalytics] = useState(null);
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
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const res = await fetch(`${API_URL}/api/analytics/developer/${user.id}?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load analytics");

      setAnalytics(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#090D1C] text-white p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090D1C] text-white">
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
    { label: "Assigned Projects", value: analytics?.assignedProjects || 0, icon: GitPullRequest, color: "text-violet-400" },
    { label: "Completed Tasks", value: analytics?.completedTasks || 0, icon: CheckCircle, color: "text-green-400" },
    { label: "Projects In Testing", value: analytics?.projectsInTesting || 0, icon: BarChart3, color: "text-orange-400" },
    { label: "Projects In Revision", value: analytics?.projectsInRevision || 0, icon: GitPullRequest, color: "text-amber-400" },
    { label: "Avg Completion Time", value: analytics?.avgCompletionTime || "N/A", icon: Clock, color: "text-yellow-400" },
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
            <h1 className="text-4xl font-bold">Developer Analytics</h1>
            <p className="mt-2 text-gray-400">Your performance and workload metrics</p>
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
          </div>
        </div>

        {/* Overview Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

        {/* Performance Chart Placeholder */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-[#151B30]/90 p-6 backdrop-blur-xl">
          <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
          <div className="flex h-64 items-center justify-center text-gray-500">
            <div className="text-center">
              <TrendingUp size={48} className="mx-auto mb-4 text-violet-400" />
              <p>Detailed performance metrics coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}