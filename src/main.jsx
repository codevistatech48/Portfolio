import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { SiteSettingsProvider } from "./components/SiteSettingsProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <SiteSettingsProvider><App /></SiteSettingsProvider>
  </BrowserRouter>
);
