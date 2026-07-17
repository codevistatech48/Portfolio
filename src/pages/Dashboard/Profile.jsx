import { useEffect, useState } from "react";
import {
  Building2,
  Calendar,
  Code2,
  FileText,
  Globe,
  Link2,
  Mail,
  MapPin,
  Pencil,
  Save,
  Shield,
  User,
  X,
} from "lucide-react";
import API_URL from "../../Config/api";

const emptyForm = {
  name: "",
  company: "",
  location: "",
  bio: "",
  github: "",
  linkedin: "",
  website: "",
};

const getFormValues = (user) => ({
  name: user.name || "",
  company: user.company || "",
  location: user.location || "",
  bio: user.bio || "",
  github: user.github || "",
  linkedin: user.linkedin || "",
  website: user.website || "",
});

function Field({ icon: Icon, label, name, value, onChange, editing, type = "text" }) {
  return (
    <label className="block">
      <span className="mb-2 block font-medium text-slate-200">{label}</span>
      <div className="relative">
        <Icon size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input type={type} name={name} value={value} onChange={onChange} disabled={!editing} className="w-full rounded-xl border border-white/10 bg-[#0C1122] py-3 pl-10 pr-3 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15 disabled:cursor-not-allowed disabled:bg-white/5 disabled:text-slate-300" />
      </div>
    </label>
  );
}

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageError, setImageError] = useState(false);

  const fetchProfile = async () => {
    const token = localStorage.getItem("userToken");

    try {
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Unable to load your profile.");
      }

      const profile = data.user || data;
      setUser(profile);
      setForm(getFormValues(profile));
      setImageError(false);
    } catch (requestError) {
      setError(requestError.message || "Unable to load your profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // The request updates state only after the profile API responds.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const cancelEdit = () => {
    setForm(getFormValues(user || {}));
    setEditing(false);
  };

  const saveProfile = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    try {
      setSaving(true);
      setError("");
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Unable to update your profile.");
      }

      const updatedUser = data.user || data;
      setUser(updatedUser);
      setForm(getFormValues(updatedUser));
      setEditing(false);
    } catch (requestError) {
      setError(requestError.message || "Unable to update your profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-[#090D1C] pt-20 text-white"><p className="text-lg font-semibold">Loading profile...</p></main>;
  }

  if (!user) {
    return <main className="flex min-h-screen items-center justify-center bg-[#090D1C] px-6 pt-20"><p className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-red-200">{error || "Unable to load your profile."}</p></main>;
  }

  const initials = (user.name || "CodeVista member").split(" ").filter(Boolean).slice(0, 2).map((name) => name[0]).join("").toUpperCase();
  const profileImage = user.photoURL || user.avatar;

  return (
    <>
      <main className="relative min-h-screen overflow-hidden bg-[#090D1C] px-6 pb-12 pt-28 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
        <div className="pointer-events-none absolute -left-44 top-10 h-[420px] w-[420px] rounded-full bg-violet-700/20 blur-[120px]" />
        <div className="pointer-events-none absolute -right-44 bottom-0 h-[420px] w-[420px] rounded-full bg-fuchsia-700/20 blur-[120px]" />
        <div className="relative mx-auto max-w-6xl">
          {error && <p className="mb-6 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-red-200">{error}</p>}

          <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#151B30]/90 shadow-2xl backdrop-blur-xl">
            <div className="h-44 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600" />
            <div className="px-6 pb-8 sm:px-10 sm:pb-10">
              <div className="flex flex-col items-center gap-6 -mt-20 md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col items-center gap-6 md:flex-row md:items-end">
                  {profileImage && !imageError ? <img src={profileImage} onError={() => setImageError(true)} alt={`${user.name}'s profile`} className="h-40 w-40 rounded-full border-8 border-[#151B30] object-cover shadow-xl" /> : <div className="flex h-40 w-40 items-center justify-center rounded-full border-8 border-[#151B30] bg-gradient-to-br from-indigo-500 to-fuchsia-600 text-5xl font-bold text-white shadow-xl">{initials || "CV"}</div>}
                  <div className="pb-3 text-center md:text-left"><h1 className="text-4xl font-bold">{user.name}</h1><p className="mt-2 flex items-center justify-center gap-2 text-slate-400 md:justify-start"><Mail size={18} />{user.email}</p>{user.location && <p className="mt-2 flex items-center justify-center gap-2 text-slate-400 md:justify-start"><MapPin size={18} />{user.location}</p>}{user.company && <p className="mt-2 flex items-center justify-center gap-2 text-slate-400 md:justify-start"><Building2 size={18} />{user.company}</p>}</div>
                </div>
                {!editing ? <button onClick={() => setEditing(true)} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-600 px-6 py-3 font-medium text-white shadow-[0_12px_30px_rgba(124,58,237,.30)] transition hover:-translate-y-0.5"><Pencil size={18} />Edit profile</button> : <div className="flex gap-3"><button onClick={saveProfile} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-white transition hover:bg-green-700 disabled:opacity-60"><Save size={18} />{saving ? "Saving..." : "Save"}</button><button onClick={cancelEdit} disabled={saving} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-slate-200 transition hover:bg-white/10 disabled:opacity-60"><X size={18} />Cancel</button></div>}
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-6 md:grid-cols-3"><div className="rounded-2xl border border-white/10 bg-[#151B30]/90 p-6 backdrop-blur-xl"><Shield className="mb-4 text-violet-300" size={32} /><h2 className="text-lg font-semibold">Email status</h2><p className="mt-2 text-slate-400">{user.emailVerified ? "Verified" : "Not verified"}</p></div><div className="rounded-2xl border border-white/10 bg-[#151B30]/90 p-6 backdrop-blur-xl"><Calendar className="mb-4 text-violet-300" size={32} /><h2 className="text-lg font-semibold">Member since</h2><p className="mt-2 text-slate-400">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</p></div><div className="rounded-2xl border border-white/10 bg-[#151B30]/90 p-6 backdrop-blur-xl"><User className="mb-4 text-violet-300" size={32} /><h2 className="text-lg font-semibold">Login provider</h2><p className="mt-2 text-slate-400">{user.primaryAuthProvider || user.authProvider || "local"}</p></div></section>

          <section className="mt-8 rounded-2xl border border-white/10 bg-[#151B30]/90 p-6 backdrop-blur-xl sm:p-8"><h2 className="text-2xl font-bold">Profile information</h2><div className="mt-8 grid gap-6 md:grid-cols-2"><Field icon={User} label="Full name" name="name" value={form.name} onChange={handleChange} editing={editing} /><Field icon={Building2} label="Company" name="company" value={form.company} onChange={handleChange} editing={editing} /><Field icon={MapPin} label="Location" name="location" value={form.location} onChange={handleChange} editing={editing} /><Field icon={Globe} label="Website" name="website" value={form.website} onChange={handleChange} editing={editing} type="url" /><Field icon={Code2} label="GitHub" name="github" value={form.github} onChange={handleChange} editing={editing} type="url" /><Field icon={Link2} label="LinkedIn" name="linkedin" value={form.linkedin} onChange={handleChange} editing={editing} type="url" /></div><label className="mt-8 block"><span className="mb-2 block font-medium text-slate-200">Bio</span><div className="relative"><FileText size={18} className="pointer-events-none absolute left-3 top-4 text-slate-500" /><textarea rows={5} name="bio" value={form.bio} onChange={handleChange} disabled={!editing} placeholder="Tell everyone about yourself..." className="w-full resize-none rounded-xl border border-white/10 bg-[#0C1122] py-3 pl-10 pr-3 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15 disabled:cursor-not-allowed disabled:bg-white/5 disabled:text-slate-300" /></div></label><div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-slate-500">Last login: {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "-"}</p>{editing && <button onClick={saveProfile} disabled={saving} className="rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-600 px-8 py-3 text-white transition hover:-translate-y-0.5 disabled:opacity-60">{saving ? "Saving..." : "Save changes"}</button>}</div></section>
        </div>
      </main>
    </>
  );
}
