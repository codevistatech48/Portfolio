import { Code2, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import AuthButton from "./AuthButton";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-[#090B18]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 shadow-lg shadow-violet-600/25">
            <Code2 className="h-5 w-5 text-white" />
          </div>

          <h1 className="text-2xl font-bold text-white">
            Code<span className="text-violet-400">Vista</span>
          </h1>
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-8 text-sm font-medium text-gray-300 lg:flex">
          <Link
            className="rounded-lg bg-white/10 px-4 py-2 text-white transition hover:bg-white/20"
            to="/"
          >
            Home
          </Link>

          <Link className="transition hover:text-violet-400" to="/services">
            Categories
          </Link>

          <Link className="transition hover:text-violet-400" to="/projects">
            Projects
          </Link>

          <Link className="transition hover:text-violet-400" to="/srs">
            SRS Request
          </Link>

          <Link className="transition hover:text-violet-400" to="/about">
            About
          </Link>

          <Link className="transition hover:text-violet-400" to="/support">
            Support
          </Link>
        </div>

        {/* Buttons */}
        <div className="hidden items-center gap-4 lg:flex">
            <AuthButton />
          
          <button className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 font-semibold text-white shadow-xl shadow-violet-600/30 transition hover:scale-105">
            Get a Quote
          </button>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;