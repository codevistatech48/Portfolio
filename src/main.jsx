import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

import { ThemeProvider } from "./context/ThemeContext";

// Global scroll reveal observer
if (
  typeof window !== "undefined" &&
  "IntersectionObserver" in window
) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  const observeElements = () => {
    document
      .querySelectorAll(".animate-on-scroll")
      .forEach((el) => {
        if (!el.classList.contains("is-visible")) {
          observer.observe(el);
        }
      });
  };

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      observeElements
    );
  } else {
    observeElements();
  }

  const routeObserver = new MutationObserver(() => {
    observeElements();
  });

  routeObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <BrowserRouter>
    <ThemeProvider>
      <App />

      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </ThemeProvider>
  </BrowserRouter>
);