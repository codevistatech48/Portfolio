import { ChevronDown, CircleHelp, Mail, MessageSquareText, Phone } from "lucide-react";
import { useState } from "react";
import Footer from "../../components/Footer/footer";
import API_URL from "../../Config/api";
const supportEmail = "codevistatech48@gmail.com";
const supportPhone = "+91 8787041668";

const faqs = [
  ["How can I start a project with CodeVista?", "Send us a message with a short outline of your idea. Our team will get back to you to understand the scope and discuss the next steps."],
  ["What services do you offer?", "We help with product strategy, web application development, AI-powered features, dashboards, and modern user experiences."],
  ["How soon will I receive a response?", "We aim to reply to all support and project enquiries within one business day."],
];

export default function Support() {
  const [openFaq, setOpenFaq] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (submitted) setSubmitted(false);
    if (error) setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSubmitted(false);

    try {
      const endpoint = `${API_URL}/api/auth/feedback`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(data?.message || `Unable to send your message right now. (${response.status})`);
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setError(err.message || "Unable to send your message right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#080C1B] text-white">
      <section className="relative overflow-hidden px-6 pb-24 pt-36 sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
        <div className="pointer-events-none absolute right-0 top-10 h-[28rem] w-[28rem] rounded-full bg-fuchsia-600/15 blur-[140px]" />
        <div className="relative mx-auto max-w-[1150px]">
          <header className="mx-auto max-w-3xl text-center"><p className="text-sm font-semibold uppercase tracking-[0.28em] text-violet-400">Support centre</p><h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">How can we <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">help you?</span></h1><p className="mt-6 text-lg leading-8 text-slate-400">Whether you have a project idea, a question, or need help, our team is ready to listen.</p></header>

          <div className="mt-16 grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
            <div className="space-y-6"><article className="rounded-[28px] border border-white/10 bg-[#12192E] p-8"><CircleHelp className="text-violet-300" size={30} /><h2 className="mt-5 text-2xl font-bold">Contact our team</h2><p className="mt-3 leading-7 text-slate-400">Prefer to reach out directly? Use any of the channels below.</p><div className="mt-7 space-y-5"><a href={`mailto:${supportEmail}`} className="flex items-center gap-4 text-slate-300 transition hover:text-violet-300"><Mail className="text-violet-400" size={20} />{supportEmail}</a><a href={`tel:${supportPhone}`} className="flex items-center gap-4 text-slate-300 transition hover:text-violet-300"><Phone className="text-violet-400" size={20} />{supportPhone}</a></div></article><article className="rounded-[28px] border border-violet-400/20 bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 p-8"><MessageSquareText className="text-violet-300" size={30} /><h2 className="mt-5 text-xl font-bold">Fast, friendly support</h2><p className="mt-3 leading-7 text-slate-300">Tell us what you need and we’ll point you in the right direction.</p></article></div>
            <form onSubmit={handleSubmit} className="rounded-[28px] border border-white/10 bg-[#12192E] p-8 sm:p-10"><h2 className="text-2xl font-bold">Send a message</h2><p className="mt-2 text-slate-400">We’ll reply to the email address you provide.</p>{submitted && <p className="mt-5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">Thanks — your message has been received.</p>}{error && <p className="mt-5 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</p>}<div className="mt-7 grid gap-5 sm:grid-cols-2"><label className="text-sm font-medium text-slate-300">Name<input required name="name" value={formData.name} onChange={handleChange} className="mt-2 w-full rounded-xl border border-white/10 bg-[#090D1C] px-4 py-3 text-white outline-none transition focus:border-violet-400" placeholder="Your name" /></label><label className="text-sm font-medium text-slate-300">Email<input required type="email" name="email" value={formData.email} onChange={handleChange} className="mt-2 w-full rounded-xl border border-white/10 bg-[#090D1C] px-4 py-3 text-white outline-none transition focus:border-violet-400" placeholder="you@example.com" /></label></div><label className="mt-5 block text-sm font-medium text-slate-300">What can we help with?<textarea required name="message" rows="6" value={formData.message} onChange={handleChange} className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#090D1C] px-4 py-3 text-white outline-none transition focus:border-violet-400" placeholder="Tell us a little about your question or project..." /></label><button disabled={isSubmitting} className="mt-6 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3.5 font-semibold shadow-[0_12px_30px_rgba(124,58,237,.30)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70">{isSubmitting ? "Sending..." : "Send message"}</button></form>
          </div>

          <section className="mt-16"><h2 className="text-center text-3xl font-bold">Frequently asked questions</h2><div className="mx-auto mt-8 max-w-3xl space-y-3">{faqs.map(([question, answer], index) => <article key={question} className="overflow-hidden rounded-2xl border border-white/10 bg-[#12192E]"><button onClick={() => setOpenFaq(openFaq === index ? -1 : index)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-semibold"><span>{question}</span><ChevronDown className={`shrink-0 text-violet-300 transition ${openFaq === index ? "rotate-180" : ""}`} size={20} /></button>{openFaq === index && <p className="border-t border-white/10 px-6 py-5 leading-7 text-slate-400">{answer}</p>}</article>)}</div></section>
        </div>
      </section>
      <Footer />
    </main>
  );
}
