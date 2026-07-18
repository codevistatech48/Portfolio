import { ArrowLeft, Mail, Shield, Send } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../../../Config/api";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }

      const message =
        data.message ||
        "If an account with that email exists, a password reset link has been sent.";
      setSuccess(message);
      toast.success(message);
    } catch (err) {
      const message = err.message || "Something went wrong";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#090D1C] text-white">
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Glow */}
      <div className="absolute -left-44 top-10 h-[420px] w-[420px] rounded-full bg-violet-700/20 blur-[120px]" />
      <div className="absolute -right-44 bottom-0 h-[420px] w-[420px] rounded-full bg-fuchsia-700/20 blur-[120px]" />

      <div className="relative z-10 flex justify-center px-6 pt-32 pb-20">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="flex flex-col items-center">
            <h2 className="text-5xl font-bold">Forgot Password</h2>
            <p className="mt-4 text-center text-lg text-gray-400">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          {/* Form */}
          <div className="mt-10">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-white/10 bg-[#151B30]/90 p-8 backdrop-blur-xl"
            >
              {/* Email */}
              <label className="mb-3 block text-sm font-medium">
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@gmail.com"
                  required
                  className="h-14 w-full rounded-xl border border-white/10 bg-[#0C1122] pl-14 pr-4 outline-none focus:border-violet-500"
                />
              </div>

              {/* Error */}
              {error && (
                <p className="mt-4 text-center text-red-500">{error}</p>
              )}

              {/* Success */}
              {success && (
                <div className="mt-6 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-center text-sm text-green-400">
                  {success}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group mt-8 flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-600 text-lg font-semibold transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={20} />

                {loading ? "Sending..." : "Send Reset Link"}

                {!loading && (
                  <ArrowLeft
                    size={20}
                    className="rotate-180 transition group-hover:translate-x-1"
                  />
                )}
              </button>

              {/* Back to Login */}
              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300"
                >
                  <ArrowLeft size={16} />
                  Back to Sign In
                </Link>
              </div>

              {/* Footer */}
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                <Shield size={16} className="text-green-400" />
                256-bit SSL encrypted • Never shared
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}