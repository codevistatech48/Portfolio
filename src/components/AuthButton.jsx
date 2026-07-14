import { Link } from "react-router-dom";

function AuthButton() {
  const token = localStorage.getItem("userToken");

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    window.location.reload();
  };

  if (token) {
    return (
      <button
        onClick={handleLogout}
        className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-violet-400/30 hover:bg-white/10"
      >
        Logout
      </button>
    );
  }

  return (
    <Link
      to="/login"
      className="inline-block rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-violet-400/30 hover:bg-white/10"
    >
      Sign In
    </Link>
  );
}

export default AuthButton;