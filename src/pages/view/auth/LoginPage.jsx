import { ArrowRight, Mail, Lock, Eye, Shield } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../../../Config/api";

function GitHubIcon({ size = 20 }) {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      height={size}
      width={size}
      viewBox="0 0 24 24"
    >
      <path d="M12 2C6.477 2 2 6.59 2 12.253c0 4.53 2.865 8.37 6.839 9.727.5.096.682-.222.682-.494 0-.244-.009-.89-.013-1.747-2.782.619-3.369-1.38-3.369-1.38-.455-1.184-1.11-1.5-1.11-1.5-.908-.638.069-.625.069-.625 1.004.072 1.532 1.057 1.532 1.057.892 1.57 2.341 1.116 2.91.853.091-.665.349-1.117.635-1.374-2.221-.259-4.556-1.139-4.556-5.068 0-1.12.39-2.036 1.029-2.754-.103-.26-.446-1.306.098-2.722 0 0 .84-.276 2.75 1.052A9.347 9.347 0 0 1 12 6.884a9.35 9.35 0 0 1 2.504.347c1.909-1.328 2.748-1.052 2.748-1.052.545 1.416.202 2.462.099 2.722.64.718 1.028 1.634 1.028 2.754 0 3.939-2.339 4.806-4.567 5.06.359.32.678.95.678 1.915 0 1.383-.012 2.498-.012 2.838 0 .275.18.595.688.493C19.138 20.619 22 16.781 22 12.253 22 6.59 17.523 2 12 2Z" />
    </svg>
  );
}

export default function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          className="flex h-14 items-center justify-center gap-3 rounded-xl border border-white/10 transition hover:border-violet-500"
        >
          <div className="h-4 w-4 rounded-full bg-red-500"></div>
          Google
        </button>

        <button
          type="button"
          className="flex h-14 items-center justify-center gap-3 rounded-xl border border-white/10 transition hover:border-violet-500"
        >
          <GitHubIcon />
          GitHub
        </button>
      </div>

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
