import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Mail, RefreshCw, ShieldCheck } from "lucide-react";
import API_URL from "../../../Config/api";

const OTP_LENGTH = 6;

export default function OtpVerification() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email || sessionStorage.getItem("pendingVerificationEmail");
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) navigate("/signup", { replace: true });
  }, [email, navigate]);

  useEffect(() => {
    if (!timer) return undefined;
    const interval = setInterval(() => setTimer((current) => current - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const nextOtp = [...otp];
    nextOtp[index] = value.slice(-1);
    setOtp(nextOtp);
    if (value && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const values = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH).split("");
    if (!values.length) return;
    setOtp([...values, ...Array(OTP_LENGTH - values.length).fill("")]);
    inputRefs.current[Math.min(values.length, OTP_LENGTH - 1)]?.focus();
  };

  const verifyOTP = async () => {
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) return setError("Enter the complete six-digit code.");
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/api/auth/verify-otp`, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ email, otp: code }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Verification failed");
      if (!data.token) throw new Error("Verification succeeded but no access token was returned");
      localStorage.setItem("userToken", data.token);
      sessionStorage.removeItem("pendingVerificationEmail");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to verify the code.");
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/api/auth/request-otp`, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ email }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to resend OTP");
      setOtp(Array(OTP_LENGTH).fill(""));
      setTimer(60);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message || "Unable to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  if (!email) return null;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090D1C] px-6 text-white">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
      <div className="absolute -left-44 top-10 h-[420px] w-[420px] rounded-full bg-violet-700/20 blur-[120px]" />
      <div className="absolute -right-44 bottom-0 h-[420px] w-[420px] rounded-full bg-fuchsia-700/20 blur-[120px]" />
      <section className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#151B30]/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-violet-500/15"><ShieldCheck className="text-violet-400" size={42} /></div>
        <h1 className="mt-6 text-center text-3xl font-bold">Verify your email</h1>
        <p className="mt-3 text-center text-slate-400">We sent a six-digit verification code to</p>
        <div className="mt-2 flex items-center justify-center gap-2 text-violet-300"><Mail size={17} /><span className="truncate">{email}</span></div>
        <div className="mt-10 flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>{otp.map((digit, index) => <input key={index} ref={(element) => { inputRefs.current[index] = element; }} inputMode="numeric" maxLength={1} value={digit} onChange={(event) => handleChange(event.target.value, index)} onKeyDown={(event) => { if (event.key === "Backspace" && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus(); }} aria-label={`OTP digit ${index + 1}`} className="h-14 w-10 rounded-xl border border-white/10 bg-[#0C1122] text-center text-xl font-bold outline-none focus:border-violet-500 sm:h-16 sm:w-12" />)}</div>
        {error && <p className="mt-5 text-center text-sm text-red-400">{error}</p>}
        <button onClick={verifyOTP} disabled={loading} className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-600 font-semibold transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Verifying..." : <>Verify OTP <ArrowRight size={18} /></>}</button>
        <div className="mt-7 text-center text-sm text-slate-400">{timer > 0 ? <>Resend code in <span className="font-semibold text-white">{timer}s</span></> : <button onClick={resendOTP} disabled={loading} className="inline-flex items-center gap-2 text-violet-300 transition hover:text-white disabled:opacity-60"><RefreshCw size={16} />Resend OTP</button>}</div>
      </section>
    </main>
  );
}
