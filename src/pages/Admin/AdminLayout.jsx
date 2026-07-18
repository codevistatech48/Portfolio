import { useEffect, useState } from "react";
import { Link, Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import API_URL from "../../Config/api";
import NotificationMenu from "../../components/NotificationMenu";

import {
  LayoutDashboard,
  Users,
  FileText,
  GitPullRequest,
  FolderKanban,
  CreditCard,
  Image,
  Newspaper,
  BarChart3,
  Bell,
  Settings,
  Activity,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const links = [
  ["Dashboard", "/admin", LayoutDashboard],
  ["Users", "/admin/users", Users],
  ["SRS Requests", "/admin/srs", FileText],

  // NEW
  ["Revision Requests", "/admin/revisions", GitPullRequest],

  ["Projects", "/admin/projects", FolderKanban],
  ["Payments", "/admin/payments", CreditCard],
  ["Invoices", "/admin/invoices", CreditCard],
  ["Revenue", "/admin/revenue", BarChart3],
  ["Portfolio", "/admin/portfolio", Image],
  ["Blogs", "/admin/blogs", Newspaper],
  ["Analytics", "/admin/analytics", BarChart3],
  ["Notifications", "/admin/notifications", Bell],
  ["Settings", "/admin/settings", Settings],
  ["Activity Logs", "/admin/activity", Activity],
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) { setLoading(false); return; }
      try {
        const response = await fetch(`${API_URL}/api/auth/profile`, { headers: { Authorization: `Bearer ${token}` }, credentials: "include" });
        if (!response.ok) throw new Error("Unauthorized");
        const data = await response.json();
        setUser(data.user || data);
      } catch { setUser(null); } finally { setLoading(false); }
    };
    loadUser();
  }, []);

  const logout = () => { localStorage.removeItem("userToken"); window.dispatchEvent(new Event("auth-changed")); navigate("/login", { replace: true }); };
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-[#090D1C] text-white">Loading admin workspace...</div>;
  if (!user || user.role !== "admin") return <Navigate to="/dashboard" replace />;

  return <div className="min-h-screen bg-[#090D1C] text-white"><aside className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10 bg-[#0D1225] p-5 transition-transform lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}><div className="flex items-center justify-between"><Link to="/admin" className="text-2xl font-bold">Code<span className="text-violet-400">Vista</span><span className="ml-2 text-xs font-medium text-slate-500">ADMIN</span></Link><button onClick={() => setMobileOpen(false)} className="lg:hidden"><X /></button></div><nav className="mt-10 space-y-1">{links.map(([label, path, Icon]) => <NavLink key={path} to={path} end={path === "/admin"} onClick={() => setMobileOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${isActive ? "bg-violet-500/15 text-violet-200" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><Icon size={18} />{label}</NavLink>)}</nav><button onClick={logout} className="mt-10 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-300 transition hover:bg-red-400/10"><LogOut size={18} />Log out</button></aside><div className="lg:pl-72"><header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-white/10 bg-[#090D1C]/90 px-6 backdrop-blur-xl lg:px-10"><button onClick={() => setMobileOpen(true)} className="lg:hidden"><Menu /></button><div className="hidden text-sm text-slate-400 sm:block">Admin / <span className="text-white">Workspace</span></div><div className="flex items-center gap-3"><NotificationMenu endpoint="/api/admin/notifications" readAllEndpoint="/api/admin/notifications/read-all" /><div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-600 text-sm font-bold"><img src={user.photoURL || user.avatar} alt="Admin profile" className="h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} />{user.name?.[0]?.toUpperCase() || "A"}</div><span className="hidden text-sm font-semibold sm:block">{user.name || "Administrator"}</span></div></header><main className="p-6 lg:p-10"><Outlet /></main></div></div>;
}
