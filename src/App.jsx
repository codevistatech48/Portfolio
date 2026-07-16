import { Navigate, Route, Routes } from "react-router-dom";
import Landing from "./pages/Dashboard/Landing";
import Dashboard from "./pages/Dashboard/Dashboard";
import Projects from "./pages/Dashboard/Projects";
import About from "./pages/Dashboard/About";
import Support from "./pages/Dashboard/Support";
import AuthPage from "./pages/view/auth/AuthPage";
import OtpVerification from "./pages/view/auth/Otp";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("userToken");

  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/signup" element={<AuthPage />} />
      <Route path="/otp" element={<OtpVerification />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/about" element={<About />} />
      <Route path="/support" element={<Support />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
