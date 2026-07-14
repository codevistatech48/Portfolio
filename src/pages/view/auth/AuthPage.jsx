import { useState } from "react";
import {
  LogIn,
  UserPlus,
  Code2,
} from "lucide-react";

import Navbar from "../../../components/Navbar/navBar";
import LoginForm from "./LoginPage";
import RegisterForm from "./SignUp";

export default function AuthPage() {

  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#090D1C] text-white">

      {/* Navbar */}

      <Navbar />

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

          {/* Logo */}

          <div className="flex flex-col items-center">

          

            <h2 className="text-5xl font-bold">

              {isLogin ? "Welcome Back" : "Create Account"}

            </h2>

            <p className="mt-4 text-center text-lg text-gray-400">

              {isLogin
                ? "Sign in to manage your projects and quotes."
                : "Create your CodeVista account."}

            </p>

          </div>

          {/* Tabs */}

          <div className="mt-10 flex rounded-2xl bg-[#171E34] p-1">

            <button
              onClick={() => setIsLogin(true)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-4 transition
              ${
                isLogin
                  ? "bg-gradient-to-r from-indigo-500 to-fuchsia-600 font-semibold"
                  : "text-gray-400 hover:text-white"
              }`}
            >

              <LogIn size={18} />

              Sign In

            </button>

            <button
              onClick={() => setIsLogin(false)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-4 transition
              ${
                !isLogin
                  ? "bg-gradient-to-r from-indigo-500 to-fuchsia-600 font-semibold"
                  : "text-gray-400 hover:text-white"
              }`}
            >

              <UserPlus size={18} />

              Register

            </button>

          </div>

          {/* Form */}

          <div className="mt-8">

            {isLogin ? <LoginForm /> : <RegisterForm />}

          </div>

        </div>

      </div>

    </div>
  );
}
