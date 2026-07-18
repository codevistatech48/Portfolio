import { useEffect, useState } from "react";
import { BookOpen, CheckCircle2, Clock, Code2, Database, FileText, Layers3, Lightbulb, Plug, Send, Shield, Target, User, UsersRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../Config/api";
import { toast } from "react-toastify";
const benefits = [
  "Executive summary and project scope",
  "User stories and use cases",
  "System architecture and data model",
  "API and integration specification",
  "Security and compliance checklist",
  "Delivery milestones and cost estimate",
];

const initialForm = {
  fullName: "",
  company: "",
  email: "",
  phone: "",
  projectName: "",
  projectType: "",
  summary: "",
  goals: "",
  audience: "",
  features: "",
  userRoles: "",
  integrations: "",
  technology: "",
  timeline: "",
  budget: "",
  notes: "",
};

function SectionTitle({ icon: Icon, title, description }) {
  return <div className="mb-7 flex gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300"><Icon size={21} /></span><div><h2 className="text-xl font-semibold">{title}</h2>{description && <p className="mt-1 text-sm text-slate-400">{description}</p>}</div></div>;
}

function Field({ label, name, value, onChange, required, placeholder, type = "text" }) {
  return <label className="block text-sm font-medium text-slate-200">{label}<input type={type} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder} className="mt-2 h-14 w-full rounded-xl border border-white/10 bg-[#090D1C] px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400" /></label>;
}

export function SrsRequestForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
   event.preventDefault();
   if (submitting) return;

   try {
     setSubmitting(true);
     const token = localStorage.getItem("userToken");

     const response = await fetch(
       `${api}/api/auth/srs-requests`,
       {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,
         },
         body: JSON.stringify(form),
       }
     );

     const data = await response.json();

     if (!response.ok) {
       throw new Error(data.message || "Failed to submit request");
     }

     toast.success("SRS request submitted successfully!");
     navigate("/srs/status", { replace: true });
   } catch (error) {
     toast.error(error.message || "Failed to submit request");
   } finally {
     setSubmitting(false);
   }
 };

  return (
    <main className="min-h-screen bg-[#090D1C] text-white">
      <section className="relative overflow-hidden px-6 pb-24 pt-36 sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
        <div className="pointer-events-none absolute left-1/2 top-8 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-violet-600/15 blur-[140px]" />
        <div className="relative mx-auto max-w-[1200px]">
          <header className="mx-auto max-w-4xl text-center"><p className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-5 py-3 text-sm font-semibold text-violet-300"><FileText size={18} />Software Requirements Specification</p><h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-6xl">Request your <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">SRS document</span></h1><p className="mt-6 text-lg leading-8 text-slate-400">Submit your project brief and our solution architects will prepare a detailed specification covering features, architecture, data models, integrations, and delivery milestones.</p></header>

          <section className="mt-14 grid gap-5 md:grid-cols-3"><article className="rounded-2xl border border-white/10 bg-[#151B30]/90 p-6"><Clock className="mb-4 text-violet-300" size={28} /><h2 className="font-semibold">72-hour delivery</h2><p className="mt-2 text-sm text-slate-400">From project brief to complete document.</p></article><article className="rounded-2xl border border-white/10 bg-[#151B30]/90 p-6"><BookOpen className="mb-4 text-violet-300" size={28} /><h2 className="font-semibold">Detailed specification</h2><p className="mt-2 text-sm text-slate-400">A document built for product and engineering teams.</p></article><article className="rounded-2xl border border-white/10 bg-[#151B30]/90 p-6"><Shield className="mb-4 text-violet-300" size={28} /><h2 className="font-semibold">Confidential brief</h2><p className="mt-2 text-sm text-slate-400">Your project details are handled securely.</p></article></section>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.55fr_.8fr]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <section className="rounded-3xl border border-white/10 bg-[#151B30]/90 p-7 backdrop-blur-xl sm:p-8"><SectionTitle icon={User} title="Client information" description="Who should we contact about this request?" /><div className="grid gap-6 sm:grid-cols-2"><Field label="Full name" name="fullName" value={form.fullName} onChange={updateForm} required placeholder="Alex Johnson" /><Field label="Company / organisation" name="company" value={form.company} onChange={updateForm} required placeholder="Acme Corp" /><Field label="Email address" name="email" value={form.email} onChange={updateForm} required type="email" placeholder="alex@acme.com" /><Field label="Phone / WhatsApp" name="phone" value={form.phone} onChange={updateForm} placeholder="+91 98765 43210" /></div></section>

              <section className="rounded-3xl border border-white/10 bg-[#151B30]/90 p-7 backdrop-blur-xl sm:p-8"><SectionTitle icon={Layers3} title="Project overview" description="Give us the context needed to understand your product." /><div className="grid gap-6 sm:grid-cols-2"><Field label="Project name" name="projectName" value={form.projectName} onChange={updateForm} required placeholder="Customer portal" /><label className="block text-sm font-medium text-slate-200">Project type<select name="projectType" value={form.projectType} onChange={updateForm} required className="mt-2 h-14 w-full rounded-xl border border-white/10 bg-[#090D1C] px-4 text-white outline-none focus:border-violet-400"><option value="">Select a type</option><option>Web application</option><option>Mobile application</option><option>SaaS platform</option><option>E-commerce platform</option><option>AI product</option><option>Internal tool</option><option>Other</option></select></label></div><label className="mt-6 block text-sm font-medium text-slate-200">Project summary<textarea name="summary" value={form.summary} onChange={updateForm} required rows="5" placeholder="Describe the problem, your product idea, and the outcome you want to achieve." className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#090D1C] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-400" /></label><label className="mt-6 block text-sm font-medium text-slate-200">Business goals and success metrics<textarea name="goals" value={form.goals} onChange={updateForm} rows="4" placeholder="For example: reduce support time by 30%, onboard 1,000 customers, improve conversion rate." className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#090D1C] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-400" /></label><label className="mt-6 block text-sm font-medium text-slate-200">Target users and audience<textarea name="audience" value={form.audience} onChange={updateForm} rows="3" placeholder="Who will use the system? Include user types, roles, and their needs." className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#090D1C] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-400" /></label></section>

              <section className="rounded-3xl border border-white/10 bg-[#151B30]/90 p-7 backdrop-blur-xl sm:p-8"><SectionTitle icon={Code2} title="Product requirements" description="The details that shape features and technical decisions." /><label className="block text-sm font-medium text-slate-200">Key features and workflows<textarea name="features" value={form.features} onChange={updateForm} required rows="6" placeholder="List the main features, user journeys, and actions the system needs to support." className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#090D1C] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-400" /></label><div className="mt-6 grid gap-6 sm:grid-cols-2"><label className="block text-sm font-medium text-slate-200">User roles and permissions<textarea name="userRoles" value={form.userRoles} onChange={updateForm} rows="4" placeholder="For example: admin, manager, customer, support agent." className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#090D1C] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-400" /></label><label className="block text-sm font-medium text-slate-200">Third-party integrations<textarea name="integrations" value={form.integrations} onChange={updateForm} rows="4" placeholder="For example: Stripe, Google Maps, WhatsApp, ERP, CRM, analytics." className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#090D1C] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-400" /></label></div><label className="mt-6 block text-sm font-medium text-slate-200">Technical, security, or compliance requirements<textarea name="technology" value={form.technology} onChange={updateForm} rows="4" placeholder="Mention existing technologies, hosting preferences, performance, privacy, or compliance needs." className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#090D1C] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-400" /></label></section>

              <section className="rounded-3xl border border-white/10 bg-[#151B30]/90 p-7 backdrop-blur-xl sm:p-8"><SectionTitle icon={Target} title="Delivery expectations" description="Help us plan a practical SRS and project roadmap." /><div className="grid gap-6 sm:grid-cols-2"><Field label="Target timeline" name="timeline" value={form.timeline} onChange={updateForm} placeholder="For example: launch in 3 months" /><Field label="Estimated budget range" name="budget" value={form.budget} onChange={updateForm} placeholder="For example: ₹5–10 lakh" /></div><label className="mt-6 block text-sm font-medium text-slate-200">Additional notes, references, or links<textarea name="notes" value={form.notes} onChange={updateForm} rows="4" placeholder="Share competitors, documents, design links, or anything else that will help." className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#090D1C] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-400" /></label><label className="mt-6 flex items-start gap-3 text-sm leading-6 text-slate-400"><input type="checkbox" required className="mt-1 h-4 w-4 accent-violet-500" />I confirm that the information is accurate and I agree to be contacted about this SRS request.</label><button type="submit" disabled={submitting} className="mt-8 inline-flex h-14 items-center gap-3 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-600 px-6 font-semibold shadow-[0_12px_30px_rgba(124,58,237,.30)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70">{submitting ? "Submitting..." : <><Send size={19} />Submit SRS request</>}</button></section>
            </form>

            <aside className="h-fit rounded-3xl border border-white/10 bg-[#151B30]/90 p-7 backdrop-blur-xl lg:sticky lg:top-28"><h2 className="text-2xl font-bold">What you get</h2><ul className="mt-7 space-y-5">{benefits.map((benefit) => <li key={benefit} className="flex gap-3 text-slate-300"><CheckCircle2 className="mt-0.5 shrink-0 text-emerald-400" size={20} />{benefit}</li>)}</ul><div className="mt-8 border-t border-white/10 pt-7"><p className="flex items-center gap-2 font-semibold text-violet-200"><Lightbulb size={19} />A complete technical foundation</p><p className="mt-3 text-sm leading-6 text-slate-400">Your SRS gives stakeholders, designers, and developers one aligned plan before implementation begins.</p></div><div className="mt-7 grid grid-cols-3 gap-3 text-center text-violet-300"><span className="rounded-xl bg-violet-500/10 p-3"><UsersRound className="mx-auto" size={20} /></span><span className="rounded-xl bg-violet-500/10 p-3"><Database className="mx-auto" size={20} /></span><span className="rounded-xl bg-violet-500/10 p-3"><Plug className="mx-auto" size={20} /></span></div></aside>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function SrsRequest() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [hasExistingRequest, setHasExistingRequest] = useState(false);

  useEffect(() => {
    const checkExistingRequest = async () => {
      const token = localStorage.getItem("userToken");

      try {
        const response = await fetch(`${api}/api/auth/srs-requests/status`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          const request = data.request || data.srsRequest || data.data || data;
          const status = String(request?.status || "").toLowerCase();
          setHasExistingRequest(status === "pending");
        }
      } catch {
        // If the status endpoint is unavailable, allow the user to submit a request.
      } finally {
        setChecking(false);
      }
    };

    checkExistingRequest();
  }, []);

  useEffect(() => {
    if (hasExistingRequest) navigate("/srs/status", { replace: true });
  }, [hasExistingRequest, navigate]);

  if (checking) {
    return <main className="flex min-h-screen items-center justify-center bg-[#090D1C] pt-20 text-white"><p className="text-lg font-semibold">Checking your SRS requests...</p></main>;
  }

  if (hasExistingRequest) {
    return <main className="flex min-h-screen items-center justify-center bg-[#090D1C] pt-20 text-white"><p className="text-lg font-semibold">Opening your SRS request status...</p></main>;
  }

  return <SrsRequestForm />;
}
