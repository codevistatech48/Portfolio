import {
    X,
    Save,
    User,
    Users,
    Clock3,
    FileText,
    DollarSign,
    Activity,
} from "lucide-react";

import { useEffect, useState } from "react";
import API_URL from "../../../Config/api";

const PROJECT_WORKFLOW = [
    "accepted",
    "planning",
    "ui_design",
    "development",
    "testing",
    "deployment",
    "completed",
];

const REVISION_WORKFLOW = ["pending", "under_review", "approved", "merged"];

const LEGACY_REVISION_STAGE_MAP = {
    revision_development: "approved",
    revision_testing: "approved",
    revision_completed: "approved",
    ready_for_merge: "approved",
};

function formatStatus(status) {
    return String(status || "pending").replaceAll("_", " ");
}

export default function ProjectModal({ project, onClose, onUpdated, onStatusUpdated }) {
    const [activeTab, setActiveTab] = useState("overview");
    const [saving, setSaving] = useState(false);

    // Developer management states
    const [developers, setDevelopers] = useState([]);
    const [loadingDevelopers, setLoadingDevelopers] = useState(false);
    const [searchDeveloper, setSearchDeveloper] = useState("");
    const [activeRevision, setActiveRevision] = useState(null);
    const [updatingStage, setUpdatingStage] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        status: "",
        progress: 0,
        priority: "medium",
        budget: "",
        deadline: "",
        estimatedCompletion: "",
        adminNotes: "",
        assignedTeam: [],
    });

    // Load project initial values
    useEffect(() => {
        if (!project) return;

        setFormData({
            name: project.name || "",
            description: project.description || "",
            status: project.status || "planning",
            progress: project.progress || 0,
            priority: project.priority || "medium",
            budget: project.budget || "",
            deadline: project.deadline ? project.deadline.slice(0, 10) : "",
            estimatedCompletion: project.estimatedCompletion ? project.estimatedCompletion.slice(0, 10) : "",
            adminNotes: project.adminNotes || "",
            assignedTeam: project.assignedTeam || [],
        });
    }, [project]);

    useEffect(() => {
        const loadActiveRevision = async () => {
            const srsId = project?.srsRequest?._id || project?.srsRequest;

            if (project?.workflowMode !== "revision" || !srsId) {
                setActiveRevision(null);
                return;
            }

            try {
                const response = await fetch(`${API_URL}/api/srs/${srsId}/revisions`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                    credentials: "include",
                });
                const data = await response.json();

                if (!response.ok) throw new Error(data.message || "Unable to load revision.");

                const revisions = data.data?.revisions || data.revisions || [];
                setActiveRevision(revisions.find((revision) => !["merged", "rejected"].includes(revision.workflowStatus)) || null);
            } catch (err) {
                alert(err.message);
            }
        };

        loadActiveRevision();
    }, [project]);

    // Automatically fetch developers when the Team tab is active
    useEffect(() => {
        if (activeTab === "team") {
            loadDevelopers();
        }
    }, [activeTab]);

    const STATUS_PROGRESS = {
  planning: 5,
  ui_design: 20,
  development: 50,
  testing: 75,
  deployment: 90,
  completed: 100,
  cancelled: 0,
};

function handleChange(e) {
  const { name, value } = e.target;

  setFormData((prev) => {
    const updated = {
      ...prev,
      [name]: value,
    };

    if (name === "status") {
      updated.progress = STATUS_PROGRESS[value] ?? 0;
    }

    return updated;
  });
}

    // Developer assignment helper functions
    function addDeveloper(dev) {
        setFormData((prev) => ({
            ...prev,
            assignedTeam: [...prev.assignedTeam, dev],
        }));
    }

    function removeDeveloper(devId) {
        setFormData((prev) => ({
            ...prev,
            assignedTeam: prev.assignedTeam.filter((member) => member._id !== devId),
        }));
    }

    async function loadDevelopers() {
        try {
            setLoadingDevelopers(true);
            const response = await fetch(`${API_URL}/api/admin/users?role=developer`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                },
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setDevelopers(data.items || data.users || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingDevelopers(false);
        }
    }

    function addMilestone() {
        setFormData((prev) => ({
            ...prev,
            milestones: [
                ...(prev.milestones || []),
                {
                    title: "",
                    dueDate: "",
                    completed: false,
                },
            ],
        }));
    }

    function removeMilestone(index) {
        setFormData((prev) => ({
            ...prev,
            milestones: prev.milestones.filter((_, i) => i !== index),
        }));
    }

    function updateMilestone(index, field, value) {
        const milestones = [...formData.milestones];

        milestones[index] = {
            ...milestones[index],
            [field]: value,
        };

        setFormData((prev) => ({
            ...prev,
            milestones,
        }));
    }

    function updateTimeline(index, field, value) {
        const timeline = [...formData.timeline];

        timeline[index] = {
            ...timeline[index],
            [field]: value,
        };

        setFormData((prev) => ({
            ...prev,
            timeline,
        }));
    }

    async function saveProject() {
        try {
            setSaving(true);
            const projectData = { ...formData };
            delete projectData.status;
            const response = await fetch(`${API_URL}/api/admin/projects/${project._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                },
                credentials: "include",
                body: JSON.stringify(projectData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to update project.");
            }

            alert("Project Updated Successfully");
            onUpdated();
        } catch (err) {
            alert(err.message);
        } finally {
            setSaving(false);
        }
    }

    async function updateProjectStage(status) {
        try {
            setUpdatingStage(true);
            const response = await fetch(`${API_URL}/api/admin/projects/${project._id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                },
                credentials: "include",
                body: JSON.stringify({ status }),
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Unable to update project status.");

            setFormData((previous) => ({ ...previous, status }));
            onStatusUpdated?.();
        } catch (err) {
            alert(err.message);
        } finally {
            setUpdatingStage(false);
        }
    }

    async function updateRevisionStage(status) {
        if (!activeRevision?._id) return;

        try {
            setUpdatingStage(true);
            const response = await fetch(`${API_URL}/api/srs/revisions/${activeRevision._id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                },
                credentials: "include",
                body: JSON.stringify({ status }),
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Unable to update revision status.");

            setActiveRevision(data.data || data.revision || null);
            onStatusUpdated?.();
            if (status === "merged") onUpdated();
        } catch (err) {
            alert(err.message);
        } finally {
            setUpdatingStage(false);
        }
    }

    const tabs = [
        { id: "overview", label: "Overview", icon: User },
        { id: "team", label: "Team", icon: Users },
        { id: "timeline", label: "Timeline", icon: Clock3 },
        { id: "finance", label: "Finance", icon: DollarSign },
        { id: "srs", label: "SRS", icon: FileText },
        { id: "activity", label: "Activity", icon: Activity },
    ];

    const isRevisionMode = project?.workflowMode === "revision";
    const currentProjectStage = PROJECT_WORKFLOW.indexOf(formData.status);
    const currentRevisionStatus = LEGACY_REVISION_STAGE_MAP[activeRevision?.workflowStatus] || activeRevision?.workflowStatus;
    const currentRevisionStage = REVISION_WORKFLOW.indexOf(currentRevisionStatus);
    const currentStatus = isRevisionMode ? currentRevisionStatus : formData.status;
    const previousStage = isRevisionMode
        ? REVISION_WORKFLOW[currentRevisionStage - 1]
        : PROJECT_WORKFLOW[currentProjectStage - 1];
    const nextStage = isRevisionMode
        ? REVISION_WORKFLOW[currentRevisionStage + 1]
        : PROJECT_WORKFLOW[currentProjectStage + 1];

    function moveToPreviousStage() {
        if (!previousStage) return;
        if (isRevisionMode) updateRevisionStage(previousStage);
        else updateProjectStage(previousStage);
    }

    function moveToNextStage() {
        if (!nextStage) return;
        if (isRevisionMode) updateRevisionStage(nextStage);
        else updateProjectStage(nextStage);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="flex h-[92vh] w-[95vw] max-w-7xl overflow-hidden rounded-3xl border border-white/10 bg-[#0B1120] shadow-2xl">

                {/* Sidebar */}
                <div className="w-64 border-r border-white/10 bg-[#151B30]">
                    <div className="flex items-center justify-between border-b border-white/10 p-6">
                        <h2 className="text-xl font-bold text-white">Manage Project</h2>
                        <button onClick={onClose} className="rounded-lg p-2 hover:bg-white/10">
                            <X className="text-slate-300" size={20} />
                        </button>
                    </div>

                    <div className="space-y-2 p-4">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition ${activeTab === tab.id
                                        ? "bg-violet-600 text-white"
                                        : "text-slate-300 hover:bg-white/5"
                                        }`}
                                >
                                    <Icon size={18} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Box */}
                <div className="flex flex-1 flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/10 p-6">
                        <div>
                            <h1 className="text-2xl font-bold text-white">{formData.name || "Unnamed Project"}</h1>
                            <p className="mt-1 text-sm text-slate-400">Manage every aspect of this project.</p>
                        </div>

                        <button
                            onClick={saveProject}
                            disabled={saving}
                            className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-medium text-white transition hover:bg-violet-700 disabled:opacity-50"
                        >
                            <Save size={18} />
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>

                    {/* Dynamic Tab Layout Wrapper */}
                    <div className="flex-1 overflow-y-auto p-8">

                        {/* 1. Overview Tab */}
                        {activeTab === "overview" && (
                            <div className="space-y-8">
                                {/* Basic Information */}
                                <div className="rounded-2xl border border-white/10 bg-[#151B30] p-6">
                                    <h2 className="mb-6 text-xl font-semibold text-white">Project Information</h2>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-slate-300">Project Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full rounded-xl border border-white/10 bg-[#0B1120] px-4 py-3 text-white outline-none focus:border-violet-500"
                                            />
                                        </div>

                                        <div>
                                            <p className="mb-2 text-sm font-medium text-slate-300">Current Status</p>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <span className="rounded-full border border-violet-400/30 bg-violet-500/15 px-3 py-2 text-sm font-semibold capitalize text-violet-200">
                                                    {formatStatus(currentStatus)}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={moveToPreviousStage}
                                                    disabled={!previousStage || updatingStage}
                                                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                    Previous Stage
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={moveToNextStage}
                                                    disabled={!nextStage || updatingStage}
                                                    className="rounded-xl bg-violet-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                    Next Stage
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <label className="mb-2 block text-sm font-medium text-slate-300">Description</label>
                                        <textarea
                                            rows={5}
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-white/10 bg-[#0B1120] px-4 py-3 text-white outline-none focus:border-violet-500"
                                        />
                                    </div>
                                </div>

                                {/* Settings & Schedule */}
                                <div className="grid gap-6 lg:grid-cols-2">
                                    <div className="rounded-2xl border border-white/10 bg-[#151B30] p-6">
                                        <h2 className="mb-6 text-xl font-semibold text-white">Project Settings</h2>
                                        <div className="mb-6">
                                            <label className="mb-2 block text-sm text-slate-300">Priority</label>
                                            <select
                                                name="priority"
                                                value={formData.priority}
                                                onChange={handleChange}
                                                className="w-full rounded-xl border border-white/10 bg-[#0B1120] px-4 py-3 text-white"
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                                <option value="critical">Critical</option>
                                            </select>
                                        </div>

                                        <div>

                                            <div className="mb-3 flex items-center justify-between">

                                                <h3 className="text-sm font-medium text-slate-300">
                                                    Project Progress
                                                </h3>

                                                <span className="rounded-full bg-violet-600/20 px-3 py-1 text-sm font-semibold text-violet-300">
                                                    {formData.progress}%
                                                </span>

                                            </div>

                                            <div className="h-3 overflow-hidden rounded-full bg-[#0B1120]">

                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-700"
                                                    style={{
                                                        width: `${formData.progress}%`,
                                                    }}
                                                />

                                            </div>

                                            <div className="mt-4 flex justify-between text-xs text-slate-500">

                                                <span>Planning</span>
                                                <span>Development</span>
                                                <span>Testing</span>
                                                <span>Completed</span>

                                            </div>

                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-white/10 bg-[#151B30] p-6">
                                        <h2 className="mb-6 text-xl font-semibold text-white">Schedule</h2>
                                        <div className="mb-6">
                                            <label className="mb-2 block text-sm text-slate-300">Deadline</label>
                                            <input
                                                type="date"
                                                name="deadline"
                                                value={formData.deadline}
                                                onChange={handleChange}
                                                className="w-full rounded-xl border border-white/10 bg-[#0B1120] px-4 py-3 text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm text-slate-300">Estimated Completion</label>
                                            <input
                                                type="date"
                                                name="estimatedCompletion"
                                                value={formData.estimatedCompletion}
                                                onChange={handleChange}
                                                className="w-full rounded-xl border border-white/10 bg-[#0B1120] px-4 py-3 text-white"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Budget */}
                                <div className="rounded-2xl border border-white/10 bg-[#151B30] p-6">
                                    <h2 className="mb-6 text-xl font-semibold text-white">Budget</h2>
                                    <input
                                        type="number"
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleChange}
                                        placeholder="Enter Project Budget"
                                        className="w-full rounded-xl border border-white/10 bg-[#0B1120] px-4 py-3 text-white"
                                    />
                                </div>

                                {/* Admin Notes */}
                                <div className="rounded-2xl border border-white/10 bg-[#151B30] p-6">
                                    <h2 className="mb-6 text-xl font-semibold text-white">Admin Notes</h2>
                                    <textarea
                                        rows={7}
                                        name="adminNotes"
                                        value={formData.adminNotes}
                                        onChange={handleChange}
                                        placeholder="Private notes..."
                                        className="w-full rounded-xl border border-white/10 bg-[#0B1120] px-4 py-3 text-white outline-none focus:border-violet-500"
                                    />
                                </div>
                            </div>
                        )}

                        {/* 2. Team Tab */}
                        {activeTab === "team" && (
                            <div className="space-y-8">
                                <div className="rounded-2xl border border-white/10 bg-[#151B30] p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-semibold text-white">Assign Developers</h2>
                                        <span className="text-sm text-slate-400">{formData.assignedTeam.length} Assigned</span>
                                    </div>

                                    <input
                                        type="text"
                                        placeholder="Search Developer..."
                                        value={searchDeveloper}
                                        onChange={(e) => setSearchDeveloper(e.target.value)}
                                        className="w-full rounded-xl bg-[#0B1120] border border-white/10 px-4 py-3 text-white mb-6"
                                    />

                                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                                        {loadingDevelopers && <p className="text-slate-400">Loading Developers...</p>}

                                        {!loadingDevelopers &&
                                            developers
                                                .filter((dev) => dev.name?.toLowerCase().includes(searchDeveloper.toLowerCase()))
                                                .map((dev) => {
                                                    const assigned = formData.assignedTeam.some((member) => member._id === dev._id);

                                                    return (
                                                        <div key={dev._id} className="rounded-2xl border border-white/10 bg-[#0B1120] p-5">
                                                            <div className="flex items-center gap-4">
                                                                <img
                                                                    src={dev.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(dev.name)}`}
                                                                    className="h-14 w-14 rounded-full"
                                                                    alt=""
                                                                />
                                                                <div>
                                                                    <h3 className="font-semibold text-white">{dev.name}</h3>
                                                                    <p className="text-sm text-slate-400">{dev.email}</p>
                                                                    <span className="text-xs text-violet-400">{dev.role}</span>
                                                                </div>
                                                            </div>

                                                            <button
                                                                onClick={() => (assigned ? removeDeveloper(dev._id) : addDeveloper(dev))}
                                                                className={`mt-5 w-full rounded-xl py-3 font-medium transition ${assigned ? "bg-red-500 hover:bg-red-600" : "bg-violet-600 hover:bg-violet-700"
                                                                    } text-white`}
                                                            >
                                                                {assigned ? "Remove" : "Assign"}
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-[#151B30] p-6">
                                    <h2 className="text-xl font-semibold text-white mb-6">Assigned Team</h2>
                                    {formData.assignedTeam.length === 0 && <p className="text-slate-400">No developers assigned.</p>}

                                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                                        {formData.assignedTeam.map((member) => (
                                            <div key={member._id} className="flex items-center justify-between rounded-xl bg-[#0B1120] border border-white/10 p-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={member.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`}
                                                        className="h-12 w-12 rounded-full"
                                                        alt=""
                                                    />
                                                    <div>
                                                        <h4 className="text-white">{member.name}</h4>
                                                        <p className="text-sm text-slate-400">{member.email}</p>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => removeDeveloper(member._id)}
                                                    className="rounded-lg bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Placeholder Empty Fallbacks for other tabs */}
                        {activeTab === "timeline" && (

                            <div className="space-y-8">

                                {/* Timeline */}

                                <div className="rounded-2xl bg-[#151B30] border border-white/10 p-6">

                                    <div className="flex justify-between items-center mb-6">

                                        <h2 className="text-xl font-semibold text-white">

                                            Project Timeline

                                        </h2>

                                    </div>

                                    <div className="space-y-5">

                                        {formData.timeline?.map((item, index) => (

                                            <div
                                                key={index}
                                                className="rounded-xl border border-white/10 bg-[#0B1120] p-5"
                                            >

                                                <div className="grid lg:grid-cols-3 gap-4">

                                                    <div>

                                                        <label className="text-sm text-slate-400">

                                                            Stage

                                                        </label>

                                                        <select
                                                            value={item.stage}
                                                            onChange={(e) =>

                                                                updateTimeline(
                                                                    index,
                                                                    "stage",
                                                                    e.target.value
                                                                )

                                                            }
                                                            className="mt-2 w-full rounded-xl bg-[#151B30] border border-white/10 px-4 py-3 text-white"
                                                        >

                                                            <option value="accepted">Accepted</option>

                                                            <option value="planning">Planning</option>

                                                            <option value="ui_design">UI Design</option>

                                                            <option value="development">Development</option>

                                                            <option value="testing">Testing</option>

                                                            <option value="deployment">Deployment</option>

                                                            <option value="completed">Completed</option>

                                                        </select>

                                                    </div>

                                                    <div>

                                                        <label className="text-sm text-slate-400">

                                                            Status

                                                        </label>

                                                        <select
                                                            value={item.status}
                                                            onChange={(e) =>

                                                                updateTimeline(
                                                                    index,
                                                                    "status",
                                                                    e.target.value
                                                                )

                                                            }
                                                            className="mt-2 w-full rounded-xl bg-[#151B30] border border-white/10 px-4 py-3 text-white"
                                                        >

                                                            <option value="pending">

                                                                Pending

                                                            </option>

                                                            <option value="in_progress">

                                                                In Progress

                                                            </option>

                                                            <option value="completed">

                                                                Completed

                                                            </option>

                                                        </select>

                                                    </div>

                                                    <div>

                                                        <label className="text-sm text-slate-400">

                                                            Date

                                                        </label>

                                                        <input
                                                            type="date"
                                                            value={
                                                                item.date
                                                                    ? item.date.slice(0, 10)
                                                                    : ""
                                                            }
                                                            onChange={(e) =>

                                                                updateTimeline(
                                                                    index,
                                                                    "date",
                                                                    e.target.value
                                                                )

                                                            }
                                                            className="mt-2 w-full rounded-xl bg-[#151B30] border border-white/10 px-4 py-3 text-white"
                                                        />

                                                    </div>

                                                </div>

                                            </div>

                                        ))}

                                    </div>

                                </div>

                                {/* Milestones */}

                                <div className="rounded-2xl bg-[#151B30] border border-white/10 p-6">

                                    <div className="flex justify-between items-center mb-6">

                                        <h2 className="text-xl font-semibold text-white">

                                            Milestones

                                        </h2>

                                        <button
                                            onClick={addMilestone}
                                            className="rounded-xl bg-violet-600 px-5 py-2 text-white hover:bg-violet-700"
                                        >

                                            + Add Milestone

                                        </button>

                                    </div>

                                    <div className="space-y-5">

                                        {formData.milestones?.map((mile, index) => (

                                            <div
                                                key={index}
                                                className="rounded-xl bg-[#0B1120] border border-white/10 p-5"
                                            >

                                                <div className="grid lg:grid-cols-12 gap-4">

                                                    <div className="lg:col-span-5">

                                                        <label className="text-sm text-slate-400">

                                                            Milestone

                                                        </label>

                                                        <input
                                                            type="text"
                                                            value={mile.title}
                                                            onChange={(e) =>

                                                                updateMilestone(
                                                                    index,
                                                                    "title",
                                                                    e.target.value
                                                                )

                                                            }
                                                            className="mt-2 w-full rounded-xl bg-[#151B30] border border-white/10 px-4 py-3 text-white"
                                                        />

                                                    </div>

                                                    <div className="lg:col-span-3">

                                                        <label className="text-sm text-slate-400">

                                                            Due Date

                                                        </label>

                                                        <input
                                                            type="date"
                                                            value={
                                                                mile.dueDate
                                                                    ? mile.dueDate.slice(0, 10)
                                                                    : ""
                                                            }
                                                            onChange={(e) =>

                                                                updateMilestone(
                                                                    index,
                                                                    "dueDate",
                                                                    e.target.value
                                                                )

                                                            }
                                                            className="mt-2 w-full rounded-xl bg-[#151B30] border border-white/10 px-4 py-3 text-white"
                                                        />

                                                    </div>

                                                    <div className="lg:col-span-2 flex items-end">

                                                        <label className="flex items-center gap-2 text-white">

                                                            <input
                                                                type="checkbox"
                                                                checked={mile.completed}
                                                                onChange={(e) =>

                                                                    updateMilestone(
                                                                        index,
                                                                        "completed",
                                                                        e.target.checked
                                                                    )

                                                                }
                                                            />

                                                            Done

                                                        </label>

                                                    </div>

                                                    <div className="lg:col-span-2 flex items-end">

                                                        <button
                                                            onClick={() =>

                                                                removeMilestone(index)

                                                            }
                                                            className="w-full rounded-xl bg-red-500 py-3 text-white hover:bg-red-600"
                                                        >

                                                            Delete

                                                        </button>

                                                    </div>

                                                </div>

                                            </div>

                                        ))}

                                        {formData.milestones?.length === 0 && (

                                            <div className="rounded-xl border border-dashed border-white/10 p-10 text-center text-slate-400">

                                                No milestones added yet.

                                            </div>

                                        )}

                                    </div>

                                </div>

                                {/* Summary */}

                                <div className="grid md:grid-cols-3 gap-6">

                                    <div className="rounded-2xl bg-[#151B30] p-6 border border-white/10">

                                        <h3 className="text-slate-400">

                                            Total Milestones

                                        </h3>

                                        <p className="mt-3 text-4xl font-bold text-white">

                                            {formData.milestones?.length || 0}

                                        </p>

                                    </div>

                                    <div className="rounded-2xl bg-[#151B30] p-6 border border-white/10">

                                        <h3 className="text-slate-400">

                                            Completed

                                        </h3>

                                        <p className="mt-3 text-4xl font-bold text-green-400">

                                            {formData.milestones?.filter(
                                                m => m.completed
                                            ).length}

                                        </p>

                                    </div>

                                    <div className="rounded-2xl bg-[#151B30] p-6 border border-white/10">

                                        <h3 className="text-slate-400">

                                            Pending

                                        </h3>

                                        <p className="mt-3 text-4xl font-bold text-yellow-400">

                                            {formData.milestones?.filter(
                                                m => !m.completed
                                            ).length}

                                        </p>

                                    </div>

                                </div>

                            </div>

                        )}
                        {activeTab === "finance" && (

                            <div className="space-y-8">

                                {/* Budget Card */}

                                <div className="rounded-2xl border border-white/10 bg-[#151B30] p-6">

                                    <h2 className="mb-6 text-xl font-semibold text-white">
                                        Project Budget
                                    </h2>

                                    <label className="mb-2 block text-sm text-slate-400">
                                        Total Budget (₹)
                                    </label>

                                    <input
                                        type="number"
                                        name="budget"
                                        min={0}
                                        value={formData.budget}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-white/10 bg-[#0B1120] px-4 py-3 text-white"
                                    />

                                </div>

                                {/* Budget Analytics */}

                                <div className="grid gap-6 lg:grid-cols-4">

                                    <div className="rounded-2xl border border-white/10 bg-[#151B30] p-6">

                                        <p className="text-sm text-slate-400">
                                            Budget
                                        </p>

                                        <h2 className="mt-3 text-3xl font-bold text-white">
                                            ₹{Number(formData.budget || 0).toLocaleString()}
                                        </h2>

                                    </div>

                                    <div className="rounded-2xl border border-white/10 bg-[#151B30] p-6">

                                        <p className="text-sm text-slate-400">
                                            Progress
                                        </p>

                                        <h2 className="mt-3 text-3xl font-bold text-green-400">
                                            {formData.progress}%
                                        </h2>

                                    </div>

                                    <div className="rounded-2xl border border-white/10 bg-[#151B30] p-6">

                                        <p className="text-sm text-slate-400">
                                            Cost / Progress %
                                        </p>

                                        <h2 className="mt-3 text-3xl font-bold text-cyan-400">
                                            ₹
                                            {Math.round(
                                                (Number(formData.budget || 0) *
                                                    Number(formData.progress || 0)) /
                                                100
                                            ).toLocaleString()}
                                        </h2>

                                    </div>

                                    <div className="rounded-2xl border border-white/10 bg-[#151B30] p-6">

                                        <p className="text-sm text-slate-400">
                                            Remaining Estimate
                                        </p>

                                        <h2 className="mt-3 text-3xl font-bold text-yellow-400">
                                            ₹
                                            {Math.round(
                                                Number(formData.budget || 0) -
                                                (Number(formData.budget || 0) *
                                                    Number(formData.progress || 0)) /
                                                100
                                            ).toLocaleString()}
                                        </h2>

                                    </div>

                                </div>

                                {/* Progress Visualization */}

                                <div className="rounded-2xl border border-white/10 bg-[#151B30] p-6">

                                    <div className="mb-6 flex items-center justify-between">

                                        <h2 className="text-xl font-semibold text-white">
                                            Budget Utilization
                                        </h2>

                                        <span className="text-sm text-slate-400">
                                            {formData.progress}%
                                        </span>

                                    </div>

                                    <div className="h-5 overflow-hidden rounded-full bg-[#0B1120]">

                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-green-500 via-blue-500 to-violet-500 transition-all duration-500"
                                            style={{
                                                width: `${formData.progress}%`,
                                            }}
                                        />

                                    </div>

                                    <div className="mt-6 grid grid-cols-2 gap-6">

                                        <div>

                                            <p className="text-sm text-slate-400">
                                                Estimated Used
                                            </p>

                                            <h3 className="mt-2 text-2xl font-bold text-white">
                                                ₹
                                                {Math.round(
                                                    Number(formData.budget || 0) *
                                                    Number(formData.progress || 0) /
                                                    100
                                                ).toLocaleString()}
                                            </h3>

                                        </div>

                                        <div>

                                            <p className="text-sm text-slate-400">
                                                Estimated Remaining
                                            </p>

                                            <h3 className="mt-2 text-2xl font-bold text-white">
                                                ₹
                                                {Math.round(
                                                    Number(formData.budget || 0) -
                                                    Number(formData.budget || 0) *
                                                    Number(formData.progress || 0) /
                                                    100
                                                ).toLocaleString()}
                                            </h3>

                                        </div>

                                    </div>

                                </div>

                                {/* Financial Insights */}

                                <div className="rounded-2xl border border-white/10 bg-[#151B30] p-6">

                                    <h2 className="mb-5 text-xl font-semibold text-white">
                                        Financial Insights
                                    </h2>

                                    <div className="space-y-4">

                                        <div className="flex justify-between rounded-xl bg-[#0B1120] p-4">

                                            <span className="text-slate-400">
                                                Budget Status
                                            </span>

                                            <span className="font-medium text-green-400">
                                                Healthy
                                            </span>

                                        </div>

                                        <div className="flex justify-between rounded-xl bg-[#0B1120] p-4">

                                            <span className="text-slate-400">
                                                Project Completion
                                            </span>

                                            <span className="font-medium text-white">
                                                {formData.progress}%
                                            </span>

                                        </div>

                                        <div className="flex justify-between rounded-xl bg-[#0B1120] p-4">

                                            <span className="text-slate-400">
                                                Estimated Cost Efficiency
                                            </span>

                                            <span className="font-medium text-cyan-400">
                                                Excellent
                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        )}
                        {activeTab === "srs" && (

                            <div className="space-y-8">

                                {/* Client Information */}

                                <div className="rounded-2xl border border-white/10 bg-[#151B30] p-6">

                                    <h2 className="mb-6 text-xl font-semibold text-white">
                                        Client Information
                                    </h2>

                                    {project?.srsRequest ? (

                                        <div className="grid gap-6 md:grid-cols-2">

                                            <div>
                                                <p className="text-sm text-slate-400">Client Name</p>
                                                <h3 className="mt-2 text-lg font-semibold text-white">
                                                    {project.srsRequest.fullName}
                                                </h3>
                                            </div>

                                            <div>
                                                <p className="text-sm text-slate-400">Company</p>
                                                <h3 className="mt-2 text-lg text-white">
                                                    {project.srsRequest.company || "-"}
                                                </h3>
                                            </div>

                                            <div>
                                                <p className="text-sm text-slate-400">Email</p>
                                                <h3 className="mt-2 text-white">
                                                    {project.srsRequest.email}
                                                </h3>
                                            </div>

                                            <div>
                                                <p className="text-sm text-slate-400">Phone</p>
                                                <h3 className="mt-2 text-white">
                                                    {project.srsRequest.phone || "-"}
                                                </h3>
                                            </div>

                                        </div>

                                    ) : (

                                        <div className="rounded-xl border border-dashed border-white/10 p-10 text-center text-slate-400">
                                            No SRS linked with this project.
                                        </div>

                                    )}

                                </div>

                                {/* Project Details */}

                                {project?.srsRequest && (

                                    <div className="rounded-2xl border border-white/10 bg-[#151B30] p-6">

                                        <h2 className="mb-6 text-xl font-semibold text-white">
                                            Project Requirements
                                        </h2>

                                        <div className="grid gap-6 lg:grid-cols-2">

                                            <div>

                                                <p className="text-sm text-slate-400">Project Name</p>
                                                <p className="mt-2 text-white">
                                                    {project.srsRequest.projectName}
                                                </p>

                                            </div>

                                            <div>

                                                <p className="text-sm text-slate-400">Project Type</p>
                                                <p className="mt-2 text-white">
                                                    {project.srsRequest.projectType}
                                                </p>

                                            </div>

                                            <div className="lg:col-span-2">

                                                <p className="text-sm text-slate-400">Summary</p>

                                                <div className="mt-2 rounded-xl bg-[#0B1120] p-4 text-slate-200">
                                                    {project.srsRequest.summary}
                                                </div>

                                            </div>

                                            <div className="lg:col-span-2">

                                                <p className="text-sm text-slate-400">Features</p>

                                                <div className="mt-2 rounded-xl bg-[#0B1120] p-4 whitespace-pre-wrap text-slate-200">
                                                    {project.srsRequest.features}
                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                )}

                                {/* Technical Information */}

                                {project?.srsRequest && (

                                    <div className="grid gap-6 lg:grid-cols-2">

                                        <div className="rounded-2xl border border-white/10 bg-[#151B30] p-6">

                                            <h2 className="mb-5 text-lg font-semibold text-white">
                                                Technical Details
                                            </h2>

                                            <div className="space-y-5">

                                                <div>

                                                    <p className="text-sm text-slate-400">
                                                        Technology
                                                    </p>

                                                    <p className="mt-2 text-white whitespace-pre-wrap">
                                                        {project.srsRequest.technology || "-"}
                                                    </p>

                                                </div>

                                                <div>

                                                    <p className="text-sm text-slate-400">
                                                        Integrations
                                                    </p>

                                                    <p className="mt-2 text-white whitespace-pre-wrap">
                                                        {project.srsRequest.integrations || "-"}
                                                    </p>

                                                </div>

                                                <div>

                                                    <p className="text-sm text-slate-400">
                                                        User Roles
                                                    </p>

                                                    <p className="mt-2 text-white whitespace-pre-wrap">
                                                        {project.srsRequest.userRoles || "-"}
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                        <div className="rounded-2xl border border-white/10 bg-[#151B30] p-6">

                                            <h2 className="mb-5 text-lg font-semibold text-white">
                                                Timeline & Budget
                                            </h2>

                                            <div className="space-y-5">

                                                <div className="flex justify-between rounded-xl bg-[#0B1120] p-4">

                                                    <span className="text-slate-400">
                                                        Timeline
                                                    </span>

                                                    <span className="text-white">
                                                        {project.srsRequest.timeline || "-"}
                                                    </span>

                                                </div>

                                                <div className="flex justify-between rounded-xl bg-[#0B1120] p-4">

                                                    <span className="text-slate-400">
                                                        Budget
                                                    </span>

                                                    <span className="text-green-400">
                                                        {project.srsRequest.budget || "-"}
                                                    </span>

                                                </div>

                                                <div className="flex justify-between rounded-xl bg-[#0B1120] p-4">

                                                    <span className="text-slate-400">
                                                        Status
                                                    </span>

                                                    <span className="text-violet-400 capitalize">
                                                        {project.srsRequest.status}
                                                    </span>

                                                </div>

                                                <div className="flex justify-between rounded-xl bg-[#0B1120] p-4">

                                                    <span className="text-slate-400">
                                                        Revision
                                                    </span>

                                                    <span className="text-white">
                                                        {project.srsRequest.revisionCount}
                                                    </span>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                )}

                                {/* Notes */}

                                {project?.srsRequest?.notes && (

                                    <div className="rounded-2xl border border-white/10 bg-[#151B30] p-6">

                                        <h2 className="mb-4 text-xl font-semibold text-white">
                                            Additional Notes
                                        </h2>

                                        <div className="rounded-xl bg-[#0B1120] p-5 whitespace-pre-wrap text-slate-200">
                                            {project.srsRequest.notes}
                                        </div>

                                    </div>

                                )}

                            </div>

                        )}
                        {activeTab === "activity" && (

                            <div className="space-y-8">

                                {/* Project Summary */}

                                <div className="grid md:grid-cols-4 gap-6">

                                    <div className="rounded-2xl bg-[#151B30] border border-white/10 p-6">

                                        <p className="text-sm text-slate-400">
                                            Current Status
                                        </p>

                                        <h2 className="mt-3 text-2xl font-bold capitalize text-violet-400">
                                            {formData.status.replace("_", " ")}
                                        </h2>

                                    </div>

                                    <div className="rounded-2xl bg-[#151B30] border border-white/10 p-6">

                                        <p className="text-sm text-slate-400">
                                            Progress
                                        </p>

                                        <h2 className="mt-3 text-2xl font-bold text-green-400">
                                            {formData.progress}%
                                        </h2>

                                    </div>

                                    <div className="rounded-2xl bg-[#151B30] border border-white/10 p-6">

                                        <p className="text-sm text-slate-400">
                                            Milestones
                                        </p>

                                        <h2 className="mt-3 text-2xl font-bold text-cyan-400">
                                            {formData.milestones?.length || 0}
                                        </h2>

                                    </div>

                                    <div className="rounded-2xl bg-[#151B30] border border-white/10 p-6">

                                        <p className="text-sm text-slate-400">
                                            Timeline Stages
                                        </p>

                                        <h2 className="mt-3 text-2xl font-bold text-yellow-400">
                                            {formData.timeline?.length || 0}
                                        </h2>

                                    </div>

                                </div>

                                {/* Timeline History */}

                                <div className="rounded-2xl bg-[#151B30] border border-white/10 p-6">

                                    <h2 className="mb-8 text-xl font-semibold text-white">

                                        Project Activity

                                    </h2>

                                    {formData.timeline?.length === 0 ? (

                                        <div className="rounded-xl border border-dashed border-white/10 p-10 text-center text-slate-400">

                                            No activity found.

                                        </div>

                                    ) : (

                                        <div className="relative ml-5 border-l border-violet-500/30">

                                            {formData.timeline.map((item, index) => (

                                                <div
                                                    key={index}
                                                    className="relative mb-10 ml-8"
                                                >

                                                    <div className="absolute -left-[42px] top-1 h-5 w-5 rounded-full border-4 border-[#151B30] bg-violet-500" />

                                                    <div className="rounded-xl border border-white/10 bg-[#0B1120] p-5">

                                                        <div className="flex items-center justify-between">

                                                            <h3 className="font-semibold capitalize text-white">

                                                                {item.stage.replace("_", " ")}

                                                            </h3>

                                                            <span
                                                                className={`rounded-full px-3 py-1 text-xs font-medium

                                    ${item.status === "completed"
                                                                        ? "bg-green-500/20 text-green-400"

                                                                        : item.status === "in_progress"

                                                                            ? "bg-blue-500/20 text-blue-400"

                                                                            : "bg-yellow-500/20 text-yellow-400"
                                                                    }

                                    `}
                                                            >

                                                                {item.status.replace("_", " ")}

                                                            </span>

                                                        </div>

                                                        <p className="mt-3 text-sm text-slate-400">

                                                            {item.date
                                                                ? new Date(item.date).toLocaleString()
                                                                : "-"}

                                                        </p>

                                                    </div>

                                                </div>

                                            ))}

                                        </div>

                                    )}

                                </div>

                                {/* Milestone Completion */}

                                <div className="rounded-2xl bg-[#151B30] border border-white/10 p-6">

                                    <h2 className="mb-6 text-xl font-semibold text-white">

                                        Milestone Progress

                                    </h2>

                                    {formData.milestones?.length === 0 ? (

                                        <div className="rounded-xl border border-dashed border-white/10 p-10 text-center text-slate-400">

                                            No milestones available.

                                        </div>

                                    ) : (

                                        <div className="space-y-5">

                                            {formData.milestones.map((mile, index) => (

                                                <div
                                                    key={index}
                                                    className="rounded-xl border border-white/10 bg-[#0B1120] p-5"
                                                >

                                                    <div className="flex items-center justify-between">

                                                        <div>

                                                            <h3 className="font-semibold text-white">

                                                                {mile.title}

                                                            </h3>

                                                            <p className="mt-2 text-sm text-slate-400">

                                                                Due

                                                                {" "}

                                                                {mile.dueDate
                                                                    ? new Date(
                                                                        mile.dueDate
                                                                    ).toLocaleDateString()

                                                                    : "-"}

                                                            </p>

                                                        </div>

                                                        <span
                                                            className={`rounded-full px-4 py-2 text-sm font-medium

                                ${mile.completed

                                                                    ? "bg-green-500/20 text-green-400"

                                                                    : "bg-yellow-500/20 text-yellow-400"

                                                                }

                                `}
                                                        >

                                                            {mile.completed
                                                                ? "Completed"
                                                                : "Pending"}

                                                        </span>

                                                    </div>

                                                </div>

                                            ))}

                                        </div>

                                    )}

                                </div>

                                {/* System Information */}

                                <div className="rounded-2xl bg-[#151B30] border border-white/10 p-6">

                                    <h2 className="mb-6 text-xl font-semibold text-white">

                                        Project Metadata

                                    </h2>

                                    <div className="grid md:grid-cols-2 gap-6">

                                        <div className="rounded-xl bg-[#0B1120] p-5">

                                            <p className="text-sm text-slate-400">

                                                Created

                                            </p>

                                            <p className="mt-2 text-white">

                                                {project.createdAt
                                                    ? new Date(project.createdAt)
                                                        .toLocaleString()

                                                    : "-"}

                                            </p>

                                        </div>

                                        <div className="rounded-xl bg-[#0B1120] p-5">

                                            <p className="text-sm text-slate-400">

                                                Last Updated

                                            </p>

                                            <p className="mt-2 text-white">

                                                {project.updatedAt
                                                    ? new Date(project.updatedAt)
                                                        .toLocaleString()

                                                    : "-"}

                                            </p>

                                        </div>

                                        <div className="rounded-xl bg-[#0B1120] p-5">

                                            <p className="text-sm text-slate-400">

                                                Deadline

                                            </p>

                                            <p className="mt-2 text-white">

                                                {formData.deadline
                                                    ? new Date(formData.deadline)
                                                        .toLocaleDateString()

                                                    : "-"}

                                            </p>

                                        </div>

                                        <div className="rounded-xl bg-[#0B1120] p-5">

                                            <p className="text-sm text-slate-400">

                                                Estimated Completion

                                            </p>

                                            <p className="mt-2 text-white">

                                                {formData.estimatedCompletion
                                                    ? new Date(formData.estimatedCompletion)
                                                        .toLocaleDateString()

                                                    : "-"}

                                            </p>

                                        </div>

                                    </div>

                                </div>

                                {/* Admin Notes */}

                                <div className="rounded-2xl bg-[#151B30] border border-white/10 p-6">

                                    <h2 className="mb-5 text-xl font-semibold text-white">

                                        Admin Notes

                                    </h2>

                                    <div className="rounded-xl bg-[#0B1120] p-5 whitespace-pre-wrap text-slate-300">

                                        {formData.adminNotes || "No admin notes available."}

                                    </div>

                                </div>

                            </div>

                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
