import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Dashboard/Landing";
import AuthPage from "./pages/view/auth/AuthPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/signup" element={<AuthPage />} />
    </Routes>
  );
}

export default App;
