import {
  ArrowRight,
  Mail,
  Lock,
  Eye,
  UserPlus,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../../../Config/api";
import SocialLoginButtons from "./SocialLoginButtons";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSocialSuccess = (token) => {
    localStorage.setItem("userToken", token);
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/dashboard", { replace: true });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");

  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  try {
    setLoading(true);

    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email.trim(),
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    // Keep only the data needed to complete email verification.
    sessionStorage.setItem("pendingVerificationEmail", formData.email.trim());
    navigate("/otp", { state: { email: formData.email.trim() } });

  } catch (err) {
    setError(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-[#151B30]/90 p-8 backdrop-blur-xl"
    >
      {/* Social Login */}

      <SocialLoginButtons
        loading={loading}
        onError={(message) => {
          setLoading(false);
          setError(message);
        }}
        onStart={() => {
          setError("");
          setLoading(true);
        }}
        onSuccess={handleSocialSuccess}
      />

      {/* Divider */}

      <div className="my-8 flex items-center gap-4">
        <div className="flex-1 h-px bg-white/10"></div>

        <span className="text-sm text-gray-500">
          or continue with email
        </span>

        <div className="flex-1 h-px bg-white/10"></div>
      </div>
      {/* Name */}

      <div className="grid grid-cols-2 gap-4">

        <div>
          <label className="mb-3 block text-sm font-medium">
            First Name
          </label>

          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="John"
            required
            className="h-14 w-full rounded-xl border border-white/10 bg-[#0C1122] px-5 outline-none focus:border-violet-500"
          />
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium">
            Last Name
          </label>

          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Doe"
            required
            className="h-14 w-full rounded-xl border border-white/10 bg-[#0C1122] px-5 outline-none focus:border-violet-500"
          />
        </div>

      </div>

      {/* Email */}

      <div className="mt-8">

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
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            required
            className="h-14 w-full rounded-xl border border-white/10 bg-[#0C1122] pl-14 pr-4 outline-none focus:border-violet-500"
          />

        </div>

      </div>

      {/* Password */}

      <div className="mt-8">

        <label className="mb-3 block text-sm font-medium">
          Password
        </label>

        <div className="relative">

          <Lock
            size={18}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            className="h-14 w-full rounded-xl border border-white/10 bg-[#0C1122] pl-14 pr-14 outline-none focus:border-violet-500"
          />

          <Eye
            size={18}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
          />

        </div>

      </div>

      {/* Confirm Password */}

      <div className="mt-8">

        <label className="mb-3 block text-sm font-medium">
          Confirm Password
        </label>

        <div className="relative">

          <Lock
            size={18}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
            className="h-14 w-full rounded-xl border border-white/10 bg-[#0C1122] pl-14 pr-14 outline-none focus:border-violet-500"
          />

          <Eye
            size={18}
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
          />

        </div>

      </div>
      {/* Terms */}

      <div className="mt-8 flex items-start gap-3">
        <input
          id="terms"
          type="checkbox"
          required
          className="mt-1 h-5 w-5 accent-violet-600"
        />

        <label
          htmlFor="terms"
          className="text-sm leading-6 text-gray-400"
        >
          I agree to the{" "}
          <span className="cursor-pointer text-violet-400 hover:text-violet-300">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="cursor-pointer text-violet-400 hover:text-violet-300">
            Privacy Policy
          </span>
        </label>
      </div>

      {/* Error Message */}

      {error && (
        <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Submit Button */}

      <button
        type="submit"
        disabled={loading}
        className="
          group
          mt-8
          flex
          h-14
          w-full
          items-center
          justify-center
          gap-3
          rounded-xl
          bg-gradient-to-r
          from-indigo-500
          to-fuchsia-600
          text-lg
          font-semibold
          transition
          hover:scale-[1.02]
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        <UserPlus size={20} />

        {loading ? "Creating Account..." : "Create Account"}

        {!loading && (
          <ArrowRight
            size={20}
            className="transition group-hover:translate-x-1"
          />
        )}
      </button>

      {/* Footer */}

      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
        <Shield
          size={16}
          className="text-green-400"
        />

        256-bit SSL encrypted • Never shared
      </div>
    </form>
  );
}
