import { useEffect, useState } from "react";
import { Globe, Mail, Save, Settings, Shield } from "lucide-react";
import API_URL from "../../Config/api";

const initialSettings = { companyName: "", email: "", phone: "", logo: "", website: "", address: "", twitter: "", linkedin: "", instagram: "", github: "" };

export default function AdminSettings() {
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin/settings`, { headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` }, credentials: "include" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to load settings.");
        setSettings((current) => ({ ...current, ...(data.settings || data.data || data) }));
      } catch (requestError) { setError(requestError.message); } finally { setLoading(false); }
    };
    load();
  }, []);

  const update = (event) => setSettings((current) => ({ ...current, [event.target.name]: event.target.value }));

  const save = async (event) => {
    event.preventDefault(); setSaving(true); setError(""); setMessage("");
    try {
      const response = await fetch(`${API_URL}/api/admin/settings`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("userToken")}` }, credentials: "include", body: JSON.stringify(settings) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to save settings.");
      setSettings((current) => ({ ...current, ...(data.settings || data.data || {}) }));
      const updatedSettings = { ...settings, ...(data.settings || data.data || {}) };
      localStorage.setItem("siteSettings", JSON.stringify(updatedSettings));
      window.dispatchEvent(new CustomEvent("site-settings-updated", { detail: updatedSettings }));
      setMessage("Settings saved successfully.");
    } catch (requestError) { setError(requestError.message); } finally { setSaving(false); }
  };

  if (loading) return <div className="py-20 text-center text-slate-400">Loading settings...</div>;

  const fields = [["companyName", "Company name", "CodeVista"], ["email", "Contact email", "hello@example.com"], ["phone", "Phone number", "+91 98765 43210"], ["website", "Website", "https://example.com"], ["logo", "Logo URL", "https://..."], ["address", "Company address", "Your business address"]];
  const social = [["twitter", "X / Twitter URL"], ["linkedin", "LinkedIn URL"], ["instagram", "Instagram URL"], ["github", "GitHub URL"]];

  return <div><div><p className="text-sm font-semibold uppercase tracking-[.2em] text-violet-400">Admin management</p><h1 className="mt-2 text-3xl font-bold">Settings</h1><p className="mt-2 text-slate-400">Manage the company information displayed across CodeVista.</p></div>{error && <p className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-red-200">{error}</p>}{message && <p className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-emerald-200">{message}</p>}<form onSubmit={save} className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_.8fr]"><section className="rounded-3xl border border-white/10 bg-[#151B30]/90 p-7"><div className="flex items-center gap-3"><Settings className="text-violet-300" /><div><h2 className="text-xl font-semibold">Company information</h2><p className="mt-1 text-sm text-slate-400">Keep your public details current.</p></div></div><div className="mt-7 grid gap-5 sm:grid-cols-2">{fields.map(([name, label, placeholder]) => <label key={name} className="text-sm font-medium text-slate-200">{label}<input name={name} value={settings[name] || ""} onChange={update} placeholder={placeholder} type={name === "email" ? "email" : "text"} className="mt-2 h-13 w-full rounded-xl border border-white/10 bg-[#0C1122] px-4 text-white outline-none placeholder:text-slate-500 focus:border-violet-400" /></label>)}</div></section><aside className="h-fit rounded-3xl border border-white/10 bg-[#151B30]/90 p-7"><div className="flex items-center gap-3"><Globe className="text-violet-300" /><h2 className="text-xl font-semibold">Social links</h2></div><div className="mt-7 space-y-5">{social.map(([name, label]) => <label key={name} className="block text-sm font-medium text-slate-200">{label}<input name={name} value={settings[name] || ""} onChange={update} placeholder="https://" className="mt-2 h-13 w-full rounded-xl border border-white/10 bg-[#0C1122] px-4 text-white outline-none placeholder:text-slate-500 focus:border-violet-400" /></label>)}</div><div className="mt-7 rounded-2xl border border-violet-400/20 bg-violet-500/10 p-4 text-sm leading-6 text-slate-300"><Shield size={17} className="mb-2 text-violet-300" />Only administrators can change these settings.</div></aside><div className="flex items-center justify-end gap-3 lg:col-span-2"><span className="mr-auto hidden items-center gap-2 text-sm text-slate-500 sm:flex"><Mail size={15} />Changes apply to the public site after saving.</span><button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-600 px-6 py-3.5 font-semibold disabled:cursor-not-allowed disabled:opacity-60"><Save size={18} />{saving ? "Saving..." : "Save settings"}</button></div></form></div>;
}
