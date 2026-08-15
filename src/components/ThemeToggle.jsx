import { useTheme } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-9 w-16 items-center rounded-full border border-white/10 bg-white/5 p-1 transition-colors duration-400 hover:border-white/20"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {/* Sliding indicator */}
      <span
        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-400"
        style={{
          transform: theme === "dark" ? "translateX(0)" : "translateX(28px)",
        }}
      >
        {theme === "dark" ? (
          <Moon size={14} className="text-gray-800" />
        ) : (
          <Sun size={14} className="text-amber-500" />
        )}
      </span>
      
      {/* Background glow */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-violet-500/20 blur-md" />
    </button>
  );
}