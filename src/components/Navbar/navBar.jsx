import { Link, NavLink, useLocation } from "react-router-dom";
import AuthButton from "../../components/AuthButton";
import ProfileMenu from "../../components/ProfileMenu";
import NotificationMenu from "../../components/NotificationMenu";
import ThemeToggle from "../../components/ThemeToggle";
import logo from "../../assets/logo.png";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";

function Navbar() {
  const [token, setToken] = useState(() =>
    localStorage.getItem("userToken")
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Sync authentication
  useEffect(() => {
    const syncAuth = () => {
      setToken(localStorage.getItem("userToken"));
    };

    window.addEventListener("auth-changed", syncAuth);
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("auth-changed", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Automatically close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinkClass = ({ isActive }) => `
  rounded-xl px-4 py-2.5 text-sm font-medium
  transition-all duration-200

  ${isDark
      ? isActive
        ? "bg-white/10 text-white shadow-sm"
        : "text-slate-300 hover:bg-white/5 hover:text-white"
      : isActive
        ? "bg-blue-500/10 text-blue-700 shadow-sm"
        : "text-slate-600 hover:bg-blue-500/5 hover:text-blue-700"
    }
`;

  const mobileNavLinkClass = ({ isActive }) => `
  block w-full rounded-xl px-4 py-3 text-sm font-medium
  transition-all duration-200

  ${isDark
      ? isActive
        ? "bg-violet-500/15 text-violet-300"
        : "text-slate-300 hover:bg-white/5 hover:text-white"
      : isActive
        ? "bg-violet-500/10 text-violet-700"
        : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
    }
`;

  return (
    <nav
      className="fixed left-0 right-0 top-0 z-[1000] w-full"
      style={{
        height: "var(--navbar-height, 5.0rem)",
        // paddingTop: "var(--navbar-offset, 0.3rem)",
        isolation: "isolate",
      }}
    >
      <div
        className={`
    mx-auto flex h-full w-full max-w-[1450px]
    items-center justify-between
    gap-3 px-4 sm:px-6 lg:px-10
    rounded-2xl
    transition-all duration-300
    ${scrolled
            ? isDark
              ? `
            border border-white/10
            bg-[#080b18]/85
            shadow-[0_8px_32px_rgba(0,0,0,0.3)]
            backdrop-blur-xl
          `
              : `
            border border-blue-200/60
            bg-white/90
            shadow-[0_8px_32px_rgba(37,99,235,0.10)]
            backdrop-blur-xl
          `
            : `
          border border-transparent
          bg-transparent
        `
          }
  `}
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3"
        >
          <div
            className="
              flex h-9 w-9 shrink-0 items-center justify-center
              overflow-hidden rounded-xl
              border border-white/10 bg-white/5
              shadow-[0_10px_30px_rgba(124,58,237,0.22)]
              sm:h-10 sm:w-10 sm:rounded-2xl
            "
          >
            <img
              src={logo}
              alt="CodeVisions Logo"
              className="h-7 w-7 object-contain sm:h-8 sm:w-8"
            />
          </div>

          <h2
            className={`
    text-xl font-bold tracking-tight sm:text-2xl
    ${isDark ? "text-white" : "text-slate-900"}
  `}
          >
            <span className="text-violet-400">CodeVisions</span>
          </h2>
        </Link>

        {/* Desktop Navigation */}
        <div
          className={`
  hidden lg:flex
  items-center gap-1
  rounded-full border p-1
  ${isDark
              ? "border-white/10 bg-white/[0.03]"
              : "border-blue-100 bg-blue-50/60"
            }
`}
        >
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


          {token ? (
            <NavLink to="/srs" className={navLinkClass}>
              SRS Request
            </NavLink>
          ) : (
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
          )}
          {!token && (
            <NavLink to="/support" className={navLinkClass}>
            Support
          </NavLink>
          )}
          
        </div>


        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          {token && (
            <ThemeToggle />
          )}


          {token ? (
            <>
              <NotificationMenu />
              <ProfileMenu />
            </>
          ) : (
            <AuthButton />
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="
              flex h-10 w-10 items-center justify-center
              rounded-xl border border-white/10
              bg-white/5 text-white
              transition-all duration-200
              hover:bg-white/10
              active:scale-95
            "
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="
            absolute left-0 right-0
            mt-2 px-4
            lg:hidden
          "
        >
          <div
            className={`
  overflow-hidden rounded-2xl
  p-3
  shadow-[0_20px_50px_rgba(0,0,0,0.20)]
  backdrop-blur-2xl
  ${isDark
                ? "border border-white/10 bg-[#080b18]/95"
                : "border border-blue-100 bg-white/95"
              }
`}
          >
            <div className="flex flex-col gap-1">
              <NavLink
                to="/"
                end
                className={mobileNavLinkClass}
              >
                Home
              </NavLink>

              {token ? (
                <NavLink
                  to="/my-projects"
                  className={mobileNavLinkClass}
                >
                  My Projects
                </NavLink>
              ) : (
                <NavLink
                  to="/projects"
                  className={mobileNavLinkClass}
                >
                  Projects
                </NavLink>
              )}

              {token && (
                <NavLink
                  to="/srs"
                  className={mobileNavLinkClass}
                >
                  SRS Request
                </NavLink>
              )}

              <NavLink
                to="/about"
                className={mobileNavLinkClass}
              >
                About
              </NavLink>

              <NavLink
                to="/support"
                className={mobileNavLinkClass}
              >
                Support
              </NavLink>
            </div>

            {/* Mobile Account Actions */}
            <div className="mt-3 border-t border-white/10 pt-3">
              {token ? (
                <div className="flex items-center justify-between gap-3">
                  <NotificationMenu />
                  <ProfileMenu />
                </div>
              ) : (
                <AuthButton />
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;