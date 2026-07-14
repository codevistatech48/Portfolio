import "./Navbar.css";
import { Link } from "react-router-dom";
import AuthButton from "../../components/AuthButton";
import logo from "../../assets/logo.png";

function Navbar() {
  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="logo">
          <div className="footer-brand">
                    <img
                      src={logo}
                      alt="CodeVista Logo"
                      className="footer-logo-img"
                    />
        
                    <h2 className="nav-logo">CodeVista</h2>
                  </div>
      </Link>

      {/* Navigation */}
      <div className="links">
        <Link className="active" to="/">
          Home
        </Link>

        <Link to="/services">Categories</Link>

        <Link to="/projects">Projects</Link>

        <Link to="/srs">SRS Request</Link>

        <Link to="/about">About</Link>

        <Link to="/support">Support</Link>
      </div>

      {/* Right Buttons */}
      <div className="buttons">
        <AuthButton />

        <button className="quote-btn">
          Get a Quote
        </button>
      </div>
    </nav>
  );
}

export default Navbar;