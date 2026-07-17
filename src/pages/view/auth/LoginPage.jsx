import { ArrowRight, Mail, Lock, Eye, Shield } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../../../Config/api";
import SocialLoginButtons from "./SocialLoginButtons";

export default function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);

const handleSocialSuccess = (token) => {
  localStorage.setItem("userToken", token);
  window.dispatchEvent(new Event("auth-changed"));
  navigate("/dashboard", { replace: true });
};

 const handleSocialError = (message) => {
  setSocialLoading(false);
  setError(message);
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

    try {
      const response = await fetch(`${API_URL}/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (!data.token) {
        throw new Error("Login succeeded but no access token was returned");
      }

      localStorage.setItem("userToken", data.token);
      window.dispatchEvent(new Event("auth-changed"));
      navigate("/dashboard", { replace: true });

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-[#151B30]/90 p-8 backdrop-blur-xl"
    >
      {/* Social Login */}

      <SocialLoginButtons
        loading={socialLoading}
        onError={handleSocialError}
        onStart={() => {
          setError("");
          setSocialLoading(true);
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
          value={formData.email}
          onChange={handleChange}
          placeholder="you@gmail.com"
          required
          className="h-14 w-full rounded-xl border border-white/10 bg-[#0C1122] pl-14 pr-4 outline-none focus:border-violet-500"
        />
      </div>

      {/* Password */}

      <div className="mt-8 flex items-center justify-between">
        <label className="text-sm font-medium">
          Password
        </label>

        <button
          type="button"
          className="text-sm text-violet-400 hover:text-violet-300"
        >
          Forgot password?
        </button>
      </div>

      <div className="relative mt-3">
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

      {/* Error */}

      {error && (
        <p className="mt-4 text-center text-red-500">
          {error}
        </p>
      )}

      {/* Submit */}

      <button
        type="submit"
        className="group mt-8 flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-600 text-lg font-semibold transition hover:scale-[1.02]"
      >
        <Shield size={20} />

        Sign In Securely

        <ArrowRight
          size={20}
          className="transition group-hover:translate-x-1"
        />
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
