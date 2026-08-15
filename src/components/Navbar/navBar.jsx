import { Link, NavLink } from "react-router-dom";
import AuthButton from "../../components/AuthButton";
import ProfileMenu from "../../components/ProfileMenu";
import NotificationMenu from "../../components/NotificationMenu";
import ThemeToggle from "../../components/ThemeToggle";
import logo from "../../assets/logo.png";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

function Navbar() {
  const [token, setToken] = useState(() => localStorage.getItem("userToken"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const syncAuth = () => setToken(localStorage.getItem("userToken"));
    window.addEventListener("auth-changed", syncAuth);
    window.addEventListener("storage", syncAuth);
    return () => {
      window.removeEventListener("auth-changed", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-medium transition ${isActive
      ? "bg-white/10 text-white"
      : "text-slate-300 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <nav
      className="fixed left-0 right-0 top-0 z-[1000] w-full"
      style={{
        height: "var(--navbar-height)",
        paddingTop: "var(--navbar-offset)",
        isolation: "isolate",
      }}
    >
      <div
        className={`mx-auto flex h-full max-w-[1450px] items-center justify-between gap-4 px-6 sm:px-8 lg:px-10 transition-all duration-400 ${
          scrolled
            ? "rounded-full border border-white/10 bg-[#080b18]/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
            : "rounded-full border border-transparent bg-transparent"
        }`}
      >
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_10px_30px_rgba(124,58,237,0.22)]">
            <img src={logo} alt="CodeVista Logo" className="h-8 w-8 object-contain" />
          </div>
          <div className="leading-none">
            <h2 className="text-[1.6rem] font-bold tracking-tight text-white">
              <span className="text-violet-400">CodeVista</span>
            </h2>
          </div>
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="flex items-center justify-center rounded-xl p-2 text-white transition hover:bg-white/10 lg:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 rounded-full border border-white/6 bg-white/3 p-1 lg:flex">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          {token ? (
            <NavLink to="/my-projects" className={navLinkClass}>
              My Projects
            </NavLink>
          ) : (
            <NavLink to="/projects" className={navLinkClass}>
              Projects
            </NavLink>
          )}
          {token && (
            <NavLink to="/srs" className={navLinkClass}>
              SRS Request
            </NavLink>
          )}
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
          <NavLink to="/support" className={navLinkClass}>
            Support
          </NavLink>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div
            className="absolute left-0 right-0 z-[1100] w-full border-b border-white/5 bg-[#080b18]/95 px-6 pb-6 pt-4 backdrop-blur-xl lg:hidden"
            style={{ top: "calc(var(--navbar-height) + var(--navbar-offset))" }}
          >
            <div className="flex flex-col gap-2">
              <NavLink to="/" end className={navLinkClass} onClick={() => setMobileOpen(false)}>
                Home
              </NavLink>
              {token ? (
                <NavLink to="/my-projects" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                  My Projects
                </NavLink>
              ) : (
                <NavLink to="/projects" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                  Projects
                </NavLink>
              )}
              {token && (
                <NavLink to="/srs" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                  SRS Request
                </NavLink>
              )}
              <NavLink to="/about" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                About
              </NavLink>
              <NavLink to="/support" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                Support
              </NavLink>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggle />
          {token ? (
            <>
              <NotificationMenu />
              <ProfileMenu />
            </>
          ) : <AuthButton />}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;