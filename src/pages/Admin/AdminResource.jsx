import { Check, ChevronLeft, ChevronRight, Copy, Inbox, RefreshCw, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import API_URL from "../../Config/api";

const names = (value) => value.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
const dates = /^(createdAt|updatedAt|reviewedAt|lastLogin|lastLoginAt|paidAt|publishedAt|deadline)$/i;
const statusOptions = ["pending", "approved", "accepted", "rejected", "expired", "completed"];

function resourceName(endpoint) { return endpoint.split("/").filter(Boolean).pop(); }

function extractItems(payload, endpoint) {
  const aliases = [resourceName(endpoint), "users", "items", "results", "requests", "srsRequests", "transactions", "invoices"];
  const visited = new Set();
  const findArray = (value) => {
    if (!value || typeof value !== "object" || visited.has(value)) return null;
    if (Array.isArray(value)) return value;
    visited.add(value);
    for (const alias of aliases) { const found = findArray(value[alias]); if (found) return found; }
    for (const child of Object.values(value)) { const found = findArray(child); if (found) return found; }
    return null;
  };
  return findArray(payload) || [];
}

function extractPagination(payload, fallback) {
  if (!payload || typeof payload !== "object") return fallback;
  if (payload.pagination) return { ...fallback, ...payload.pagination };
  if (payload.data && typeof payload.data === "object" && !Array.isArray(payload.data)) return extractPagination(payload.data, fallback);
  return { ...fallback, page: payload.page || fallback.page, limit: payload.limit || fallback.limit, pages: payload.pages || fallback.pages, total: payload.total ?? fallback.total };
}

function errorMessage(error) {
  if (error.status === 401) return "Your session has expired. Please sign in again.";
  if (error.status === 403) return "You do not have permission to perform this action.";
  if (error.status === 404) return "This admin resource was not found.";
  if (error.status >= 500) return "The server is unavailable. Please try again shortly.";
  if (error.message === "Failed to fetch") return "Network error. Check your connection and try again.";
  return error.message || "Something went wrong. Please try again.";
}

async function readResponse(response) {
  const raw = await response.text();
  const data = (() => {
    try { return raw ? JSON.parse(raw) : {}; } catch { throw Object.assign(new Error("The server returned an invalid response."), { status: response.status }); }
  })();
  if (!response.ok) throw Object.assign(new Error(data.message || "Request failed"), { status: response.status });
  return data;
}

function displayValue(value, key) {
  if (dates.test(key) && value) return new Date(value).toLocaleString();
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value && typeof value === "object") return value.name || value.title || value.email || value._id || value.id || JSON.stringify(value);
  return value ?? "—";
}

function StatusBadge({ value }) {
  if (!value) return "—";
  const tone = { active: "text-emerald-300 bg-emerald-400/10", approved: "text-emerald-300 bg-emerald-400/10", accepted: "text-emerald-300 bg-emerald-400/10", completed: "text-cyan-300 bg-cyan-400/10", pending: "text-amber-200 bg-amber-400/10", suspended: "text-red-300 bg-red-400/10", rejected: "text-red-300 bg-red-400/10", expired: "text-slate-300 bg-slate-400/10" }[String(value).toLowerCase()] || "text-slate-300 bg-white/10";
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>{names(String(value))}</span>;
}

export default function AdminResource({ title, endpoint, searchable = false }) {
  const [items, setItems] = useState([]);
  const [payload, setPayload] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [pagination, setPagination] = useState({ page: 1, limit: 20, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState("");
  const isUsers = endpoint.endsWith("/users");
  const isSrs = endpoint.endsWith("/srs");

  useEffect(() => {
    const timer = window.setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 450);
    return () => window.clearTimeout(timer);
  }, [search]);

  const load = useCallback(async ({ notify = false } = {}) => {
    const token = localStorage.getItem("userToken");
    if (!token) { setError("You must be signed in to access admin data."); setLoading(false); return; }
    setLoading(true); setError("");
    try {
      const params = new URLSearchParams({ page, limit, sortBy, order });
      if (searchable) params.set("search", debouncedSearch);
      const response = await fetch(`${API_URL}${endpoint}?${params}`, { headers: { Authorization: `Bearer ${token}` }, credentials: "include" });
      const data = await readResponse(response);
      setPayload(data); setItems(extractItems(data, endpoint)); setPagination(extractPagination(data, { page, limit, pages: 1, total: 0 }));
      if (notify) setSuccess("Data refreshed successfully.");
    } catch (requestError) { setError(errorMessage(requestError)); } finally { setLoading(false); }
  }, [debouncedSearch, endpoint, limit, order, page, searchable, sortBy]);

  useEffect(() => {
    // Data loading is intentionally started by the route effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load({ notify: true });
    const refreshTimer = window.setInterval(() => load(), 30000);
    return () => window.clearInterval(refreshTimer);
  }, [load]);

  useEffect(() => { if (!success) return undefined; const timer = window.setTimeout(() => setSuccess(""), 3000); return () => window.clearTimeout(timer); }, [success]);

  const request = async (id, method, path, body, message) => {
    const token = localStorage.getItem("userToken");
    if (!token) { setError("You must be signed in to perform this action."); return; }
    setBusy(`${method}-${id}`); setError("");
    try {
      const response = await fetch(`${API_URL}${path}`, { method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, credentials: "include", body: body ? JSON.stringify(body) : undefined });
      await readResponse(response); setSuccess(message); load();
    } catch (requestError) { setError(errorMessage(requestError)); } finally { setBusy(""); }
  };

  const updateStatus = (id, status) => request(id, "PATCH", isUsers ? `${endpoint}/${id}/status` : `${endpoint}/${id}`, { status }, "Status updated successfully.");
  const remove = (id) => { if (window.confirm("Delete this item? This action cannot be undone.")) request(id, "DELETE", `${endpoint}/${id}`, null, "Deleted successfully."); };
  const copyEmail = async (value) => { await navigator.clipboard?.writeText(value); setCopied(value); window.setTimeout(() => setCopied(""), 1500); };
  const columns = useMemo(() => items[0] ? Object.keys(items[0]).filter((key) => !["__v", "passwordHash"].includes(key)).slice(0, 7) : [], [items]);
  const objectData = payload?.data && !Array.isArray(payload.data) ? payload.data : payload;
  const summaryEntries = objectData && typeof objectData === "object" && !Array.isArray(objectData) ? Object.entries(objectData).filter(([key]) => !["success", "message", "data", "pagination"].includes(key)) : [];

  return <div>
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold uppercase tracking-[.2em] text-violet-400">Admin management</p><h1 className="mt-2 text-3xl font-bold">{title}</h1></div><button disabled={loading} onClick={() => load({ notify: true })} className="inline-flex items-center gap-2 self-start rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"><RefreshCw size={16} className={loading ? "animate-spin" : ""} />{loading ? "Refreshing..." : "Refresh"}</button></div>
    {searchable && <div className="relative mt-7 max-w-md"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${title.toLowerCase()}...`} className="h-12 w-full rounded-xl border border-white/10 bg-[#151B30] pl-11 pr-4 text-white outline-none focus:border-violet-400" /></div>}
    <div className="mt-6 flex flex-wrap items-center gap-3"><label className="text-sm text-slate-400">Sort<select value={sortBy} onChange={(event) => { setSortBy(event.target.value); setPage(1); }} className="ml-2 rounded-lg border border-white/10 bg-[#151B30] px-3 py-2 text-white"><option value="createdAt">Created date</option><option value="name">Name</option><option value="status">Status</option><option value="updatedAt">Updated date</option></select></label><select value={order} onChange={(event) => { setOrder(event.target.value); setPage(1); }} className="rounded-lg border border-white/10 bg-[#151B30] px-3 py-2 text-white"><option value="desc">Descending</option><option value="asc">Ascending</option></select></div>
    {error && <p className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-red-200">{error}</p>}{success && <p className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-emerald-200"><Check size={17} />{success}</p>}
    <div className="mt-7 overflow-x-auto rounded-3xl border border-white/10 bg-[#151B30]/90">{loading && !items.length ? <div className="p-10 text-center text-slate-400">Loading {title.toLowerCase()}...</div> : items.length ? <table className="w-full min-w-[860px] text-left text-sm"><thead className="border-b border-white/10 text-slate-400"><tr>{columns.map((column) => <th key={column} className="px-5 py-4 font-medium">{names(column)}</th>)}<th className="px-5 py-4">Actions</th></tr></thead><tbody>{items.map((item, index) => { const id = item._id || item.id || index; return <tr key={id} className="border-b border-white/5 last:border-0">{columns.map((column) => <td key={column} title={String(item[column] ?? "")} className="max-w-xs truncate px-5 py-4 text-slate-200">{column.toLowerCase().includes("email") ? <button type="button" onClick={() => copyEmail(item[column])} className="inline-flex items-center gap-2 text-violet-200 hover:text-white">{displayValue(item[column], column)}{copied === item[column] ? <Check size={14} /> : <Copy size={14} />}</button> : column.toLowerCase() === "status" ? <StatusBadge value={item[column]} /> : typeof item[column] === "string" && /^https?:\/\//.test(item[column]) ? <a href={item[column]} target="_blank" rel="noreferrer" className="text-violet-300 underline">Open link</a> : displayValue(item[column], column)}</td>)}<td className="flex items-center gap-2 px-5 py-4">{isUsers && item._id && <button disabled={busy === `PATCH-${item._id}`} type="button" onClick={() => updateStatus(item._id, item.status === "active" ? "suspended" : "active")} className="rounded-lg bg-violet-500/15 px-3 py-2 text-xs font-semibold text-violet-200 disabled:opacity-50">{busy === `PATCH-${item._id}` ? "Saving..." : item.status === "active" ? "Suspend" : "Activate"}</button>}{isSrs && item._id && <select disabled={busy === `PATCH-${item._id}`} value={item.status || ""} onChange={(event) => updateStatus(item._id, event.target.value)} className="rounded-lg border border-white/10 bg-[#0D1225] px-2 py-2 text-xs text-slate-200 disabled:opacity-50"><option value="" disabled>Status</option>{statusOptions.map((status) => <option key={status} value={status}>{names(status)}</option>)}</select>}{item._id && <button disabled={busy === `DELETE-${item._id}`} onClick={() => remove(item._id)} className="rounded-lg p-2 text-red-300 hover:bg-red-400/10 disabled:opacity-50" aria-label="Delete"><Trash2 size={17} /></button>}</td></tr>; })}</tbody></table> : summaryEntries.length ? <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">{summaryEntries.map(([key, value]) => <article key={key} className="rounded-2xl border border-white/10 bg-[#0D1225] p-5"><p className="text-sm text-slate-400">{names(key)}</p><p className="mt-2 break-words text-xl font-semibold text-white">{displayValue(value, key)}</p></article>)}</div> : <div className="flex flex-col items-center p-12 text-center text-slate-400"><Inbox size={32} /><p className="mt-3">No {title.toLowerCase()} found.</p><button onClick={() => load({ notify: true })} className="mt-4 rounded-xl border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/10">Reload</button></div>}</div>
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400"><span>{pagination.total ?? 0} total records</span><div className="flex items-center gap-2"><label>Rows<select value={limit} onChange={(event) => { setLimit(Number(event.target.value)); setPage(1); }} className="ml-2 rounded-lg border border-white/10 bg-[#151B30] px-2 py-1.5 text-white"><option value="10">10</option><option value="20">20</option><option value="50">50</option></select></label><button disabled={page <= 1 || loading} onClick={() => setPage((current) => current - 1)} className="rounded-lg border border-white/10 p-2 disabled:opacity-40"><ChevronLeft size={16} /></button><span>Page {page} of {pagination.pages || 1}</span><button disabled={page >= (pagination.pages || 1) || loading} onClick={() => setPage((current) => current + 1)} className="rounded-lg border border-white/10 p-2 disabled:opacity-40"><ChevronRight size={16} /></button></div></div>
  </div>;
}
