import { Link, NavLink } from "react-router-dom";
import AuthButton from "../../components/AuthButton";
import logo from "../../assets/logo.png";

function Navbar() {
  const token = localStorage.getItem("userToken");
  const navLinkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-white/10 text-white"
        : "text-slate-300 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-white/5 bg-[#080b18]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.75rem] max-w-[1450px] items-center justify-between gap-4 px-6 sm:px-8 lg:px-10">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_10px_30px_rgba(124,58,237,0.22)]">
            <img src={logo} alt="CodeVista Logo" className="h-9 w-9 object-contain" />
          </div>
          <div className="leading-none">
            <h2 className="text-[1.7rem] font-bold tracking-tight text-white">
              Code<span className="text-violet-400">Vista</span>
            </h2>
          </div>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-white/6 bg-white/3 p-1 lg:flex">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/projects" className={navLinkClass}>
            Projects
          </NavLink>
          {token && <NavLink to="/srs" className={navLinkClass}>
            SRS Request
          </NavLink>}
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
          <NavLink to="/support" className={navLinkClass}>
            Support
          </NavLink>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <AuthButton />
          <button className="hidden rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(124,58,237,0.30)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(124,58,237,0.40)] sm:inline-flex">
            Get a Quote
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
