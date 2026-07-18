import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Landing from "./pages/Dashboard/Landing";
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Dashboard/Profile";
import Projects from "./pages/Dashboard/Projects";
import MyProjects from "./pages/Dashboard/MyProjects";
import ProjectDetails from "./pages/Dashboard/ProjectDetails";
import About from "./pages/Dashboard/About";
import Support from "./pages/Dashboard/Support";
import SrsRequest from "./pages/Dashboard/SrsRequest";
import SrsSuccess from "./pages/Dashboard/SrsSuccess";
import SrsStatus from "./pages/Dashboard/SrsStatus";
import { SrsRequestForm } from "./pages/Dashboard/SrsRequest";
import SrsRevisionRequest from "./pages/Dashboard/SrsRevisionRequest";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminSettings from "./pages/Admin/AdminSettings";
import AdminAnalytics from "./pages/Admin/AdminAnalytics";
import AdminActivity from "./pages/Admin/AdminActivity";
import AdminSrs from "./pages/Admin/AdminSrs";
import AdminProjects from "./pages/Admin/AdminProjects";
import AdminVisualResource from "./pages/Admin/AdminVisualResource";
import RevisionReview from "./pages/view/auth/revisions/RevisionReview";
import AdminUsers from "./pages/Admin/AdminUsers";
import API_URL from "./Config/api";
import AuthPage from "./pages/view/auth/AuthPage";
import ForgotPassword from "./pages/view/auth/ForgotPassword";
import ResetPassword from "./pages/view/auth/ResetPassword";
import RevisionRequests from "./pages/Admin/RevisionRequests";
import OtpVerification from "./pages/view/auth/Otp";
import MainLayout from "./components/MainLayout";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("userToken");

  return token ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const token = localStorage.getItem("userToken");

  return token ? <Navigate to="/dashboard" replace /> : children;
}

function HomeRoute() {
  const token = localStorage.getItem("userToken");

  return token ? <Navigate to="/dashboard" replace /> : <Landing />;
}

function DashboardEntry() {
  const [role, setRole] = useState(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const loadRole = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
          credentials: "include",
        });
        const data = await response.json();
        setRole((data.user || data).role || "user");
      } catch {
        setRole("user");
      } finally {
        setCheckingRole(false);
      }
    };

    loadRole();
  }, []);

  if (checkingRole) {
    return <div className="flex min-h-screen items-center justify-center bg-[#090D1C] text-white">Loading workspace...</div>;
  }

  return role === "admin" ? <Navigate to="/admin" replace /> : <Dashboard />;
}

function ProjectsRoute() {
  const token = localStorage.getItem("userToken");
  return token ? <MyProjects /> : <Projects />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><AuthPage /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><AuthPage /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
      <Route path="/otp" element={<PublicRoute><OtpVerification /></PublicRoute>} />
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="srs" element={<AdminSrs />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="payments" element={<AdminVisualResource title="Payments" endpoint="/api/admin/payments" kind="payments" />} />
        <Route path="invoices" element={<AdminVisualResource title="Invoices" endpoint="/api/admin/invoices" kind="invoices" />} />
        <Route path="revenue" element={<AdminVisualResource title="Revenue" endpoint="/api/admin/revenue" kind="revenue" />} />
        <Route path="revisions" element={<RevisionRequests />} />
        <Route
          path="revisions/:revisionId"
          element={<RevisionReview />}
        />
        <Route path="portfolio" element={<AdminVisualResource title="Portfolio" endpoint="/api/admin/portfolio" kind="portfolio" />} />
        <Route path="blogs" element={<AdminVisualResource title="Blogs" endpoint="/api/admin/blogs" kind="blogs" />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="notifications" element={<AdminVisualResource title="Notifications" endpoint="/api/admin/notifications" kind="notifications" />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="activity" element={<AdminActivity />} />
      </Route>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/projects" element={<ProjectsRoute />} />
        <Route path="/about" element={<About />} />
        <Route path="/support" element={<Support />} />
        <Route
          path="/srs"
          element={
            <ProtectedRoute>
              <SrsRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/srs/success"
          element={
            <ProtectedRoute>
              <SrsSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/srs/status"
          element={
            <ProtectedRoute>
              <SrsStatus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/srs/new"
          element={
            <ProtectedRoute>
              <SrsRequestForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:projectId/revision"
          element={
            <ProtectedRoute>
              <SrsRevisionRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardEntry />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-projects"
          element={
            <ProtectedRoute>
              <MyProjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <ProjectDetails />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
