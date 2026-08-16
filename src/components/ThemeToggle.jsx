import { useTheme } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const {
    theme,
    toggleTheme,
    canToggleTheme,
  } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      disabled={!canToggleTheme}
      className={`
        relative inline-flex h-9 w-16
        items-center rounded-full
        border
        p-1
        transition-all duration-300
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500/40

        ${
          canToggleTheme
            ? `
              cursor-pointer
              border-[var(--border)]
              bg-[var(--surface)]
              hover:border-blue-400/50
              hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]
            `
            : `
              cursor-not-allowed
              border-white/10
              bg-white/5
              opacity-70
            `
        }
      `}
      aria-label={
        canToggleTheme
          ? isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
          : "Theme switching is available after login"
      }
      title={
        canToggleTheme
          ? isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
          : "Theme switching is available after login"
      }
    >

      {/* Background glow */}
      <span
        className={`
          pointer-events-none
          absolute inset-0
          rounded-full
          bg-gradient-to-r
          from-blue-500/10
          to-violet-500/10
          transition-opacity duration-300
          ${
            canToggleTheme
              ? "opacity-100"
              : "opacity-0"
          }
        `}
      />

      {/* Sliding indicator */}
      <span
        className="
          relative z-10
          inline-flex h-7 w-7
          items-center justify-center
          rounded-full
          bg-white
          shadow-lg
          transition-transform duration-300
        "
        style={{
          transform: isDark
            ? "translateX(0)"
            : "translateX(28px)",
        }}
      >
        {isDark ? (
          <Moon
            size={14}
            className="text-gray-800"
          />
        ) : (
          <Sun
            size={14}
            className="text-amber-500"
          />
        )}
      </span>
    </button>
  );
}