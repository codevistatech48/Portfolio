import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#080b18] px-6 py-16 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1450px]">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <img src={logo} alt={`${ "CodeVisions"} Logo`} className="h-10 w-10 object-contain" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white">
                <span className="text-violet-400">{"CodeVisions"}</span>
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-7 text-slate-400">
              Building scalable digital products with innovative solutions, modern technologies, and exceptional user experiences.
            </p>
          </div>

          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">Company</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link className="transition hover:text-violet-300" to="/about">About</Link></li>
              <li><a className="transition hover:text-violet-300" href="#">Services</a></li>
              <li><Link className="transition hover:text-violet-300" to="/projects">Portfolio</Link></li>
              <li><Link className="transition hover:text-violet-300" to="/support">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">Resources</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a className="transition hover:text-violet-300" href="#">Blog</a></li>
              <li><Link className="transition hover:text-violet-300" to="/support">FAQs</Link></li>
              <li><a className="transition hover:text-violet-300" href="#">Privacy Policy</a></li>
              <li><a className="transition hover:text-violet-300" href="#">Terms & Conditions</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">Contact</h3>
            <div className="space-y-3 text-sm leading-7 text-slate-400">
              <p>📧 {"codevistatech48@gmail.com"}</p>
              <p>📞 {"+91 8787041668"}</p>
              <p>📍 {"Greater Noida, Uttar Pradesh, India"}</p>
            </div>

            <div className="mt-6 flex gap-3">
              {[
                { label: "Web", href: "#" },
                { label: "Work", href: "#" },
                { label: "X", href: "#" },
                { label: "IG", href: "https://www.instagram.com/code.vistatech/" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-slate-200 transition hover:-translate-y-1 hover:border-violet-400/30 hover:bg-violet-500/15"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/5 pt-6 text-center text-sm text-slate-500">
          © 2026 CodeVisions. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
