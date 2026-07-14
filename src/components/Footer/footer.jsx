import "./footer.css";
import logo from "../../assets/logo.png";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Company Info */}
        <div className="footer-col">

          <div className="footer-brand">
            <img
              src={logo}
              alt="CodeVista Logo"
              className="footer-logo-img"
            />

            <h2 className="footer-logo">CodeVista</h2>
          </div>

          <p>
            Building scalable digital products with innovative solutions,
            modern technologies, and exceptional user experiences.
          </p>
        </div>

        {/* Company */}
        <div className="footer-col">
          <h3>Company</h3>

          <ul>
            <li><a href="#">About</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Portfolio</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div className="footer-col">
          <h3>Resources</h3>

          <ul>
            <li><a href="#">Blog</a></li>
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h3>Contact</h3>

          <p>📧 codevistatech48@gmail.com</p>
          <p>📞 +91 8787041668</p>
          <p>📍 Greater Noida, Uttar Pradesh, India</p>

          <div className="social-icons">

            <a href="#" target="_blank" rel="noreferrer">
              🌐
            </a>

            <a href="#" target="_blank" rel="noreferrer">
              💼
            </a>

            <a href="#" target="_blank" rel="noreferrer">
              🐦
            </a>

            <a
              href="https://www.instagram.com/code.vistatech/"
              target="_blank"
              rel="noreferrer"
            >
              📷
            </a>

          </div>
        </div>

      </div>

      <hr />

      <div className="footer-bottom">
        <p>© 2026 CodeVista. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;