import { CheckCircle2, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SrsSuccess() {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    const redirectTimer = window.setTimeout(() => navigate("/dashboard", { replace: true }), 5000);
    const countdownTimer = window.setInterval(() => setSeconds((current) => Math.max(current - 1, 0)), 1000);

    return () => {
      window.clearTimeout(redirectTimer);
      window.clearInterval(countdownTimer);
    };
  }, [navigate]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090D1C] px-6 pt-20 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
      <div className="pointer-events-none absolute h-[30rem] w-[30rem] rounded-full bg-violet-600/20 blur-[130px]" />
      <section className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-[#151B30]/90 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-400/15 text-emerald-300"><CheckCircle2 size={44} /></div>
        <p className="mt-7 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">Request received</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Your SRS request is submitted.</h1>
        <p className="mt-5 leading-7 text-slate-400">Thank you for sharing your project brief. Our team will review it and contact you with the next steps.</p>
        <p className="mt-7 text-sm text-slate-500">Redirecting to your dashboard in {seconds} second{seconds === 1 ? "" : "s"}.</p>
        <Link to="/dashboard" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-600 px-6 py-3.5 font-semibold shadow-[0_12px_30px_rgba(124,58,237,.30)] transition hover:-translate-y-0.5"><LayoutDashboard size={19} />Go to dashboard now</Link>
      </section>
    </main>
  );
}
