import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Clock, AlertTriangle, Send, FileText, Calendar, DollarSign, Timer } from "lucide-react";
import api from "../../Config/api";
import { toast } from "react-toastify";

const REVISION_FIELDS = [
    { name: "projectName", label: "Project Name" },
    { name: "summary", label: "Project Summary", type: "textarea", rows: 5 },
    { name: "goals", label: "Business Goals", type: "textarea", rows: 4 },
    { name: "audience", label: "Target Users", type: "textarea", rows: 3 },
    { name: "features", label: "Key Features", type: "textarea", rows: 6 },
    { name: "userRoles", label: "User Roles", type: "textarea", rows: 4 },
    { name: "integrations", label: "Integrations", type: "textarea", rows: 4 },
    { name: "technology", label: "Technology Requirements", type: "textarea", rows: 4 },
    { name: "timeline", label: "Target Timeline" },
    { name: "budget", label: "Budget Range" },
    { name: "notes", label: "Additional Notes", type: "textarea", rows: 4 },
];

export default function SrsRevisionRequest() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [project, setProject] = useState(null);
    const [originalSrs, setOriginalSrs] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [form, setForm] = useState({
        projectName: "",
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
        changeSummary: "",
    });

    useEffect(() => {
        loadProjectData();
    }, [projectId]);

    // Timer countdown effect
    useEffect(() => {
        if (!originalSrs?.freeRevisionUntil) return;

        const interval = setInterval(() => {
            const now = new Date();
            const freeUntil = new Date(originalSrs.freeRevisionUntil);
            const diff = freeUntil - now;

            if (diff <= 0) {
                setTimeRemaining({ expired: true });
                setShowWarning(true);
                clearInterval(interval);
            } else {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                setTimeRemaining({ days, hours, minutes, seconds, expired: false });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [originalSrs?.freeRevisionUntil]);

    const loadProjectData = async () => {
        try {
            const token = localStorage.getItem("userToken");
            const response = await fetch(`${api}/api/dashboard/projects/${projectId}`, {
                headers: { Authorization: `Bearer ${token}` },
                credentials: "include",
            });

            if (!response.ok) throw new Error("Failed to load project");

            const data = await response.json();
            const projectData = data.data || data.project || data;
            const srs = projectData.srsRequest || {};
            console.log("SRS:", srs);
            setProject(projectData);
            setOriginalSrs(projectData.srsRequest || {});

            // Pre-fill form with original SRS data
            setForm({
                projectName: srs.projectName || projectData.name || "",
                summary: srs.summary || "",
                goals: srs.goals || "",
                audience: srs.audience || "",
                features: srs.features || "",
                userRoles: srs.userRoles || "",
                integrations: srs.integrations || "",
                technology: srs.technology || "",
                timeline: srs.timeline || "",
                budget: srs.budget || "",
                notes: srs.notes || "",
                changeSummary: "",
            });

            // Check if still in free revision period
            if (projectData.srs?.freeRevisionUntil) {
                const freeUntil = new Date(projectData.srs.freeRevisionUntil);
                const now = new Date();
                if (now > freeUntil) {
                    setShowWarning(true);
                }
            }
        } catch (error) {
            toast.error("Failed to load project data");
            navigate("/dashboard");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.changeSummary.trim()) {
            toast.error("Please describe the changes you are requesting");
            return;
        }

        if (showWarning) {
            const confirmed = window.confirm(
                "Your complimentary revision period has expired.\n\n" +
                "Additional charges may apply depending on the scope of requested changes.\n\n" +
                "Our team will review your request and notify you before any extra charges are applied.\n\n" +
                "Do you want to continue?"
            );
            if (!confirmed) return;
        }

        try {
            setSubmitting(true);
            const token = localStorage.getItem("userToken");

            const response = await fetch(
                `${api}/api/srs/${originalSrs.id}/revisions`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        requestedChanges: form,
                        changeSummary: form.changeSummary,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to submit revision request");
            }

            toast.success("Revision request submitted successfully!");
            navigate(`/projects/${projectId}`);
        } catch (error) {
            toast.error(error.message || "Failed to submit revision request");
        } finally {
            setSubmitting(false);
        }
    };

    const updateForm = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#090D1C] text-white">
                <p className="text-lg">Loading project data...</p>
            </main>
        );
    }

    const approvedDate = originalSrs?.approvedAt ? new Date(originalSrs.approvedAt) : null;
    const freeRevisionUntil = originalSrs?.freeRevisionUntil ? new Date(originalSrs.freeRevisionUntil) : null;
    const isFreeRevision = freeRevisionUntil && new Date() <= freeRevisionUntil;

    return (
        <main className="min-h-screen bg-[#090D1C] text-white">
            <div className="pointer-events-none fixed inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
            <div className="pointer-events-none fixed -left-44 top-16 h-[420px] w-[420px] rounded-full bg-violet-700/20 blur-[120px]" />
            <div className="pointer-events-none fixed -right-44 bottom-0 h-[420px] w-[420px] rounded-full bg-fuchsia-700/20 blur-[120px]" />

            <div className="relative z-10 mx-auto max-w-4xl px-6 pb-24 pt-32 sm:px-8">
                <Link to={`/projects/${projectId}`} className="mb-6 inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300">
                    <ArrowLeft size={16} />
                    Back to Project
                </Link>

                <header className="mb-10">
                    <h1 className="text-4xl font-bold">Request SRS Revision</h1>
                    <p className="mt-3 text-lg text-slate-400">
                        Submit changes to your approved SRS document
                    </p>
                </header>

                {/* Revision Status with Timer */}
                <div className={`mb-8 rounded-2xl border p-6 ${isFreeRevision ? "border-green-500/30 bg-green-500/10" : "border-yellow-500/30 bg-yellow-500/10"}`}>
                    <div className="flex items-start gap-4">
                        {isFreeRevision ? (
                            <Clock className="mt-1 text-green-400" size={24} />
                        ) : (
                            <AlertTriangle className="mt-1 text-yellow-400" size={24} />
                        )}
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold">
                                {isFreeRevision ? "Free Revision Period Active" : "Free Revision Period Expired"}
                            </h3>
                            {approvedDate && (
                                <p className="mt-2 text-sm text-slate-300">
                                    Approved on: {approvedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                                </p>
                            )}
                            {freeRevisionUntil && (
                                <p className="mt-1 text-sm text-slate-300">
                                    Free revisions until: {freeRevisionUntil.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                                </p>
                            )}

                            {/* Countdown Timer */}
                            {timeRemaining && !timeRemaining.expired && (
                                <div className="mt-4 flex items-center gap-3">
                                    <Timer size={20} className="text-green-400" />
                                    <div className="flex gap-2">
                                        <div className="rounded-lg bg-green-500/20 px-3 py-2 text-center">
                                            <div className="text-xl font-bold text-green-400">{timeRemaining.days}</div>
                                            <div className="text-xs text-slate-400">Days</div>
                                        </div>
                                        <div className="rounded-lg bg-green-500/20 px-3 py-2 text-center">
                                            <div className="text-xl font-bold text-green-400">{timeRemaining.hours}</div>
                                            <div className="text-xs text-slate-400">Hours</div>
                                        </div>
                                        <div className="rounded-lg bg-green-500/20 px-3 py-2 text-center">
                                            <div className="text-xl font-bold text-green-400">{timeRemaining.minutes}</div>
                                            <div className="text-xs text-slate-400">Mins</div>
                                        </div>
                                        <div className="rounded-lg bg-green-500/20 px-3 py-2 text-center">
                                            <div className="text-xl font-bold text-green-400">{timeRemaining.seconds}</div>
                                            <div className="text-xs text-slate-400">Secs</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isFreeRevision ? (
                                <p className="mt-3 text-sm text-green-300">
                                    This revision is within your complimentary revision period. No additional charges apply.
                                </p>
                            ) : (
                                <p className="mt-3 text-sm text-yellow-300">
                                    Your complimentary revision period has expired. Additional charges may apply depending on the scope of requested changes. Our team will review your request and notify you before any extra charges are applied.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Change Summary */}
                    <section className="rounded-3xl border border-white/10 bg-[#151B30]/90 p-7 backdrop-blur-xl">
                        <h2 className="text-xl font-semibold">Describe Your Changes</h2>
                        <p className="mt-2 text-sm text-slate-400">
                            Please provide a summary of the changes you are requesting
                        </p>
                        <textarea
                            required
                            rows={4}
                            value={form.changeSummary}
                            onChange={(e) => updateForm("changeSummary", e.target.value)}
                            placeholder="Example: I need to add a payment gateway integration and change the user role permissions..."
                            className="mt-4 w-full rounded-xl border border-white/10 bg-[#090D1C] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400"
                        />
                    </section>

                    {/* Editable Fields */}
                    <section className="rounded-3xl border border-white/10 bg-[#151B30]/90 p-7 backdrop-blur-xl">
                        <h2 className="text-xl font-semibold mb-6">Modify SRS Details</h2>
                        <div className="space-y-6">
                            {REVISION_FIELDS.map((field) => (
                                <div key={field.name}>
                                    <label className="block text-sm font-medium text-slate-200">
                                        {field.label}
                                    </label>
                                    {field.type === "textarea" ? (
                                        <textarea
                                            rows={field.rows || 4}
                                            value={form[field.name]}
                                            onChange={(e) => updateForm(field.name, e.target.value)}
                                            className="mt-2 w-full rounded-xl border border-white/10 bg-[#090D1C] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400"
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            value={form[field.name]}
                                            onChange={(e) => updateForm(field.name, e.target.value)}
                                            className="mt-2 h-14 w-full rounded-xl border border-white/10 bg-[#090D1C] px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="group flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-600 text-lg font-semibold transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Send size={20} />
                        {submitting ? "Submitting Revision..." : "Submit Revision Request"}
                    </button>
                </form>
            </div>
        </main>
    );
}