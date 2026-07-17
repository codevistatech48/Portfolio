/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import API_URL from "../Config/api";

export const defaultSiteSettings = { companyName: "CodeVista", email: "codevistatech48@gmail.com", phone: "+91 8787041668", logo: "", address: "Greater Noida, Uttar Pradesh, India", website: "", twitter: "", linkedin: "", instagram: "" };
const SiteSettingsContext = createContext(defaultSiteSettings);

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => { try { return { ...defaultSiteSettings, ...JSON.parse(localStorage.getItem("siteSettings") || "{}") }; } catch { return defaultSiteSettings; } });
  useEffect(() => {
    const apply = (next) => setSettings((current) => ({ ...current, ...next }));
    const onUpdate = (event) => apply(event.detail || {});
    window.addEventListener("site-settings-updated", onUpdate);
    const load = async () => { try { let response = await fetch(`${API_URL}/api/settings`); if (!response.ok && localStorage.getItem("userToken")) response = await fetch(`${API_URL}/api/admin/settings`, { headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` }, credentials: "include" }); if (!response.ok) return; const data = await response.json(); const next = data.settings || data.data || data; apply(next); localStorage.setItem("siteSettings", JSON.stringify(next)); } catch { /* Public settings are optional; cached defaults remain available. */ } };
    load(); return () => window.removeEventListener("site-settings-updated", onUpdate);
  }, []);
  const value = useMemo(() => settings, [settings]);
  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings() { return useContext(SiteSettingsContext); }
