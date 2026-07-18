import { ChevronDown, LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../Config/api";
import { toast } from "react-toastify";

function getTokenClaims() {
  const token = localStorage.getItem("userToken");

  if (!token) return {};

  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return {};
  }
}

export default function ProfileMenu() {
  const navigate = useNavigate();
  const claims = getTokenClaims();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({
    name: claims.name || claims.username || "CodeVista member",
    email: claims.email || "",
    photoURL: "",
  });

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      try {
        const response = await fetch(`${API_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });

        if (!response.ok) return;

        const data = await response.json();
        const profile = data.user || data;
        setUser((currentUser) => ({ ...currentUser, ...profile }));
      } catch {
        // The menu still works with details available in the JWT.
      }
    };

    loadUser();
  }, []);

  const initials = (user.name || "CodeVista member")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  const logout = () => {
    localStorage.removeItem("userToken");
    window.dispatchEvent(new Event("auth-changed"));
    localStorage.removeItem("userProfile");
    toast.success("You have been logged out successfully.");
    navigate("/", { replace: true });
  };

  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1.5 pr-3 text-sm font-semibold transition hover:border-violet-400/30 hover:bg-white/10"
      >
        {user.photoURL || user.avatar ? (
          <img src={user.photoURL || user.avatar} alt="Your profile" className="h-8 w-8 rounded-xl object-cover" />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-600 text-xs font-bold">{initials || "CV"}</span>
        )}
        <span className="hidden max-w-28 truncate sm:block">{user.name}</span>
        <ChevronDown size={16} className={`transition ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div role="menu" className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#151B30] p-2 shadow-2xl">
          <div className="border-b border-white/10 px-3 py-3"><p className="truncate font-semibold">{user.name}</p><p className="mt-1 truncate text-sm text-slate-400">{user.email || "Signed in"}</p></div>
          <Link to="/profile" onClick={() => setIsOpen(false)} role="menuitem" className="mt-2 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"><User size={17} />View profile</Link>
          <button type="button" onClick={logout} role="menuitem" className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-300 transition hover:bg-red-400/10"><LogOut size={17} />Log out</button>
        </div>
      )}
    </div>
  );
}
