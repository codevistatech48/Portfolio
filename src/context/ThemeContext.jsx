import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocation } from "react-router-dom";

const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {},
  canToggleTheme: false,
});


// =====================================================
// PUBLIC / UNSECURED ROUTES
// These pages are ALWAYS DARK
// =====================================================

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/about",
  "/support",
  "/projects",
  "/forgot-password",
  "/reset-password",
];

function isPublicRoute(pathname) {
  return PUBLIC_ROUTES.includes(pathname);
}


export function ThemeProvider({ children }) {
  const location = useLocation();

  const [theme, setTheme] = useState("dark");

  const isPublic = isPublicRoute(location.pathname);

  // User is allowed to change theme ONLY on secured routes
  const canToggleTheme = !isPublic;


  // =====================================================
  // APPLY THEME WHEN ROUTE CHANGES
  // =====================================================

  useEffect(() => {
    // ---------------------------------------------------
    // PUBLIC ROUTE
    // Always force DARK
    // ---------------------------------------------------

    if (isPublic) {
      setTheme("dark");

      document.documentElement.setAttribute(
        "data-theme",
        "dark"
      );

      return;
    }


    // ---------------------------------------------------
    // SECURED ROUTE
    // Load user's saved preference
    // ---------------------------------------------------

    const storedTheme =
      localStorage.getItem("codevisions-theme");

    const userTheme =
      storedTheme === "light"
        ? "light"
        : "dark";

    setTheme(userTheme);

    document.documentElement.setAttribute(
      "data-theme",
      userTheme
    );
  }, [location.pathname, isPublic]);


  // =====================================================
  // HANDLE LOGOUT / AUTH CHANGES
  // =====================================================

  useEffect(() => {
    const handleAuthChange = () => {
      // If user logs out, force dark immediately
      const token =
        localStorage.getItem("userToken");

      if (!token) {
        setTheme("dark");

        document.documentElement.setAttribute(
          "data-theme",
          "dark"
        );
      }
    };


    window.addEventListener(
      "auth-changed",
      handleAuthChange
    );

    window.addEventListener(
      "storage",
      handleAuthChange
    );


    return () => {
      window.removeEventListener(
        "auth-changed",
        handleAuthChange
      );

      window.removeEventListener(
        "storage",
        handleAuthChange
      );
    };
  }, []);


  // =====================================================
  // TOGGLE
  // =====================================================

  const toggleTheme = () => {

    // NEVER allow theme switching on public pages
    if (!canToggleTheme) {
      setTheme("dark");

      document.documentElement.setAttribute(
        "data-theme",
        "dark"
      );

      return;
    }


    setTheme((currentTheme) => {

      const nextTheme =
        currentTheme === "dark"
          ? "light"
          : "dark";


      localStorage.setItem(
        "codevisions-theme",
        nextTheme
      );


      document.documentElement.setAttribute(
        "data-theme",
        nextTheme
      );


      return nextTheme;
    });
  };


  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        canToggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}


export function useTheme() {
  return useContext(ThemeContext);
}