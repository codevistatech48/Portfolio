import "./hero.css";
import { ArrowRight, ExternalLink, Layers3, ShieldCheck, Sparkles } from "lucide-react";
import heroImage from "../../assets/landing.png";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-left">

        <div className="hero-badge">
          ● Now accepting projects for Q3 2026
        </div>

        <h1>
          We build software
          <br />
          <span>that scales with you</span>
        </h1>

        <p>
          CodeVista engineers end-to-end digital products —
          from e-commerce platforms to enterprise SaaS —
          with obsessive attention to performance,
          security, and craft.
        </p>

        <div className="hero-buttons">

          <button className="primary-btn">
            Start your project
            <ArrowRight size={20} />
          </button>

          <button className="secondary-btn">
            View our work
            <ExternalLink size={18} />
          </button>

        </div>

      </div>

      <div className="hero-right">

        <div className="hero-visual">
          <div className="hero-visual-ring hero-visual-ring-a" />
          <div className="hero-visual-ring hero-visual-ring-b" />

          <div className="hero-tilt-card">
            <div className="hero-tilt-header">
              <span className="hero-chip">
                <Sparkles size={14} />
                3D portfolio experience
              </span>
              <span className="hero-chip hero-chip-accent">
                <Layers3 size={14} />
                Premium delivery
              </span>
            </div>

            <div className="hero-image-wrap">
              <img src={heroImage} alt="CodeVista company portfolio preview" className="hero-image" />
              <div className="hero-image-glow" />
            </div>

            <div className="hero-tilt-footer">
              <div className="hero-mini-stat">
                <ShieldCheck size={16} />
                Secure build process
              </div>
              <div className="hero-mini-stat">
                <Sparkles size={16} />
                Motion-rich UI
              </div>
            </div>
          </div>

          <div className="floating-stat floating-stat-one">
            <h2>98%</h2>
            <p>Client satisfaction</p>
          </div>

          <div className="floating-stat floating-stat-two">
            <h2>4.9★</h2>
            <p>Average rating</p>
          </div>
        </div>
      </div>

    </section>
  );
}

export default Hero;