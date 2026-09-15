/**
 * ChatAdmin - AI Assistant control dashboard (/admin/chat)
 */
import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaRobot, FaSignOutAlt, FaDownload, FaUsers, FaEnvelopeOpenText,
  FaCalendarCheck, FaUserTie, FaComments, FaChartBar, FaCog,
  FaQuestionCircle, FaHandsHelping,
  FaSearch, FaFilter, FaEdit, FaTrash, FaEye, FaTimes,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import {
  adminLogin, adminGet, adminPut,
  adminCsvUrl, searchLeads, getLeadWithHistory,
  updateLead, deleteLead, bulkDeleteLeads, addLeadNote,
} from "../components/chatbot/chatApi";

const TOKEN_KEY = "bc_admin_token";

const TABS = [
  { id: "overview", label: "Overview", icon: FaChartBar },
  { id: "leads", label: "Leads", icon: FaEnvelopeOpenText },
  { id: "meetings", label: "Meetings", icon: FaCalendarCheck },
  { id: "applications", label: "Applications", icon: FaUserTie },
  { id: "handoffs", label: "Handoffs", icon: FaHandsHelping },
  { id: "sessions", label: "Chat History", icon: FaComments },
  { id: "popular", label: "Popular Questions", icon: FaQuestionCircle },
  { id: "settings", label: "Settings", icon: FaCog },
];


/* ================= FORMATTING HELPERS ================= */
function formatDate(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch (e) { return String(iso); }
}

function formatPhone(phone) {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length <= 10) return cleaned;
  return `+${cleaned.slice(0, cleaned.length - 10)} (${cleaned.slice(-10, -7)}) ${cleaned.slice(-7, -4)} ${cleaned.slice(-4)}`;
}

function formatCurrency(val) {
  if (!val) return "";
  const num = parseFloat(String(val).replace(/[^0-9.]/g, ""));
  if (isNaN(num)) return String(val);
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(num);
}
const COLUMNS = {
  leads: [
    ["status", "Status"], ["createdAt", "Received"], ["name", "Name"],
    ["email", "Email"], ["phone", "Phone"], ["company", "Company"],
    ["country", "Country"], ["service", "Service"], ["budget", "Budget"],
    ["requirements", "Requirements"], ["lang", "Lang"], ["leadSource", "Source"],
  ],
  meetings: [
    ["status", "Status"], ["createdAt", "Requested"], ["name", "Name"],
    ["email", "Email"], ["phone", "Phone"], ["date", "Date"],
    ["time", "Time"], ["timezone", "Time zone"], ["purpose", "Purpose"],
  ],
  applications: [
    ["status", "Status"], ["createdAt", "Applied"], ["name", "Name"],
    ["email", "Email"], ["phone", "Phone"], ["role", "Role"],
    ["experience", "Experience"], ["portfolio", "Portfolio"],
  ],
  handoffs: [
    ["status", "Status"], ["createdAt", "At"], ["name", "Name"],
    ["email", "Email"], ["message", "Message"],
  ],
  sessions: [
    ["updatedAt", "Last activity"], ["sessionId", "Session"], ["page", "Page"],
    ["lang", "Lang"], ["device", "Device"], ["messageCount", "Msgs"],
    ["durationSec", "Duration (s)"],
  ],
};

const STATUS_OPTIONS = ["new", "contacted", "qualified", "closed", "updated"];

const fmt = (iso) => {
  try { return new Date(iso).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }); }
  catch (e) { return String(iso || ""); }
};

/* ================= LOGIN GATE ================= */
function LoginGate({ onLogin }) {
  const { isDarkMode } = useTheme();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await adminLogin(u, p);
      if (res && res.ok) {
        localStorage.setItem(TOKEN_KEY, res.data.token);
        onLogin(res.data.token);
      } else {
        setError(res?.data?.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? "bg-[#050508]" : "bg-gray-50"}`}>
      <div className={`w-full max-w-md p-8 rounded-3xl shadow-2xl border ${isDarkMode ? "bg-[#0a0f2e] border-white/10" : "bg-white border-gray-200"}`}>
        <div className="flex items-center gap-3 mb-6">
          <FaRobot size={26} className="text-cyan-500" />
          <h1 className={`text-2xl font-black ${isDarkMode ? "text-white" : "text-gray-900"}`}>BluConnet Admin</h1>
        </div>
        {error && <p className="mb-4 text-[13px] text-red-400 bg-red-500/10 p-3 rounded-xl">{error}</p>}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-[12.5px] font-semibold mb-1">Email / Username</label>
            <input autoFocus type="text" value={u} onChange={(e) => setU(e.target.value)} placeholder="bluconnetnews"
              className={`w-full px-3 py-2.5 rounded-xl border text-[13px] ${isDarkMode ? "bg-[#050508] border-white/10 text-white" : "bg-gray-50 border-gray-300 text-gray-900"}`} />
          </div>
          <div>
            <label className="block text-[12.5px] font-semibold mb-1">Password</label>
            <input type="password" value={p} onChange={(e) => setP(e.target.value)} placeholder="••••••••"
              className={`w-full px-3 py-2.5 rounded-xl border text-[13px] ${isDarkMode ? "bg-[#050508] border-white/10 text-white" : "bg-gray-50 border-gray-300 text-gray-900"}`} />
          </div>
          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
            className="w-full py-2.5 rounded-xl text-[13px] font-bold text-white bg-gradient-to-r from-emerald-500 to-cyan-600 hover:opacity-95 transition shadow disabled:opacity-60">
            {loading ? "Signing in…" : "Sign In"}
          </motion.button>
        </form>
        <button onClick={() => { window.location.href = "/"; }} className="mt-6 text-[12px] text-gray-500 hover:underline">← Back to Website</button>
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */
function StatCard({ label, value, icon, isDark }) {
  return (
    <div className={`p-4 rounded-2xl border text-center ${isDark ? "bg-[#0f1535]/80 border-white/10" : "bg-white border-gray-200"}`}>
      <div className="flex justify-center mb-2 text-cyan-500">{icon}</div>
      <div className={`text-2xl font-black ${isDark ? "text-white" : "text-gray-900"}`}>{value ?? "—"}</div>
      <div className={`text-[11.5px] ${isDark ? "text-gray-400" : "text-gray-500"}`}>{label}</div>
    </div>
  );
}

function QuickTile({ icon, label, sub, isDark }) {
  return (
    <div className={`p-4 rounded-2xl border flex items-center gap-3 ${isDark ? "bg-[#0f1535]/80 border-white/10" : "bg-white border-gray-200"}`}>
      <div className="text-cyan-500">{icon}</div>
      <div>
        <div className={`font-bold text-[13px] ${isDark ? "text-white" : "text-gray-900"}`}>{label}</div>
        <div className={`text-[11px] ${isDark ? "text-gray-400" : "text-gray-500"}`}>{sub}</div>
      </div>
    </div>
  );
}

function TabNav({ tabs, active, setTab, isDark }) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1">
      {tabs.map((t) => (
        <button key={t.id} onClick={() => setTab(t.id)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12.5px] font-semibold whitespace-nowrap transition-colors ${
            active === t.id
              ? "bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow"
              : isDark ? "text-gray-400 hover:bg-white/5" : "text-gray-600 hover:bg-gray-100"
          }`}>
          <t.icon size={12} />
          {t.label}
        </button>
      ))}
    </div>
  );
}

function DataTable({ columns, rows, isDark, onRowClick }) {
  const td = `px-3 py-2 border-b ${isDark ? "border-white/5" : "border-gray-100"}`;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[12.5px]">
        <thead>
          <tr className={isDark ? "text-gray-400" : "text-gray-500"}>
            {columns.map(([k, label]) => (
              <th key={k} className="text-left px-3 py-2 font-semibold">{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id || i}
              onClick={() => onRowClick?.(r)}
              className={`transition-colors ${onRowClick ? "cursor-pointer" : ""} ${isDark ? "hover:bg-white/[0.03]" : "hover:bg-gray-50"}`}>
              {columns.map(([k]) => (
                <td key={k} className={td}>
                  {k === "createdAt" || k === "updatedAt"
                    ? fmt(r[k])
                    : String(r[k] ?? "").slice(0, 60)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


function BasicInfo({ label, value, isDark }) {
  return (
    <div className={`p-3 rounded-xl border ${isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"}`}>
      <p className={`text-[10px] font-bold uppercase tracking-wide ${isDark ? "text-gray-500" : "text-gray-400"}`}>{label}</p>
      <p className={`text-sm font-semibold break-all ${isDark ? "text-white" : "text-gray-900"}`}>{value || "—"}</p>
    </div>
  );
}

/* ================= LEADS TABLE ================= */
const LeadsTable = ({ rows, isDark, selectedRows, toggleRowSelection, handleStatusChange, handleViewLead, handleEditLead, handleDeleteLead, setEditingLead, setEditForm, fmt }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-[12px]">
      <thead>
        <tr className={`text-left ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          <th className="p-2"><input type="checkbox" onChange={(e) => {
            // toggle all
          }} className="w-3.5 h-3.5 rounded accent-cyan-500" /></th>
          <th className="p-2">Status</th>
          <th className="p-2">Date</th>
          <th className="p-2">Name</th>
          <th className="p-2">Email</th>
          <th className="p-2">Phone</th>
          <th className="p-2">Country</th>
          <th className="p-2">Service</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id} className={`border-t ${isDark ? "border-white/5" : "border-gray-100"}`}>
            <td className="p-2"><input type="checkbox" checked={selectedRows.has(row.id)} onChange={() => toggleRowSelection(row.id)} className="w-3.5 h-3.5 rounded accent-cyan-500" /></td>
            <td className="p-2">
              <select value={row.status || "new"} onChange={(e) => handleStatusChange(row.id, e.target.value)}
                className={`px-2 py-1 rounded-lg text-[11px] font-semibold ${row.status === "new" ? "bg-blue-500/20 text-blue-400" : row.status === "contacted" ? "bg-yellow-500/20 text-yellow-400" : row.status === "qualified" ? "bg-green-500/20 text-green-400" : row.status === "closed" ? "bg-gray-500/20 text-gray-400" : "bg-purple-500/20 text-purple-400"}`}>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="closed">Closed</option>
                <option value="updated">Updated</option>
              </select>
            </td>
            <td className="p-2 whitespace-nowrap">{fmt(row.createdAt)}</td>
            <td className="p-2 font-medium">{row.name}</td>
            <td className="p-2">{row.email}</td>
            <td className="p-2">{row.phone}</td>
            <td className="p-2">{row.country}</td>
            <td className="p-2">{row.service || "-"}</td>
            <td className="p-2">
              <div className="flex items-center gap-1">
                <button onClick={() => handleViewLead(row.id)} className={`p-1.5 rounded-lg ${isDark ? "hover:bg-white/10" : "hover:bg-gray-200"}`} title="View Details"><FaEye size={11} /></button>
                <button onClick={() => { setEditingLead(row); setEditForm(row); }} className={`p-1.5 rounded-lg ${isDark ? "hover:bg-white/10" : "hover:bg-gray-200"}`} title="Edit"><FaEdit size={11} /></button>
                <button onClick={() => handleDeleteLead(row.id)} className={`p-1.5 rounded-lg text-red-400 ${isDark ? "hover:bg-white/10" : "hover:bg-gray-200"}`} title="Delete"><FaTrash size={11} /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);



/* ================= MAIN PANEL ================= */
const ChatAdmin = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [tab, setTab] = useState("overview");
  const [dash, setDash] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState({ webhookUrl: "", crmWebhookUrl: "", emailNotify: true });
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [openSession, setOpenSession] = useState(null);
  // CRM enhanced features
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [editingLead, setEditingLead] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [leadDetail, setLeadDetail] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const isDark = isDarkMode;
  const cardCls = `rounded-2xl border shadow-sm ${isDark ? "bg-[#0f1535]/80 border-white/10" : "bg-white border-gray-200"}`;
  const inputCls = `w-full px-3 py-2.5 rounded-xl border text-[13px] focus:outline-none focus:ring-2 focus:ring-cyan-500 ${isDark ? "bg-[#050508] border-white/10 text-white" : "bg-gray-50 border-gray-300 text-gray-900"}`;

  const loadTab = useCallback(async (t) => {
    if (t === "overview" || t === "popular") {
      setLoading(true);
      try {
        const res = await adminGet("/admin/dashboard");
        if (res?.ok) setDash(res.data);
        else setError(res?.data?.message || "Failed to load dashboard");
      } catch (e) { setError("Network error loading dashboard"); }
      finally { setLoading(false); }
      return;
    }
    if (t === "settings") {
      setLoading(true);
      try {
        const res = await adminGet("/admin/settings");
        if (res?.ok) setSettings(res.data);
      } catch (e) { /* ignore */ }
      finally { setLoading(false); }
      return;
    }
    const col = COLUMNS[t];
    if (!col) { setRows([]); return; }
    setLoading(true);
    try {
      const res = await adminGet(`/admin/${t}`);
      setRows(res?.data || []);
    } catch (e) { setError("Failed to load data"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (token) loadTab(tab); }, [token, tab, loadTab]);

  /* ---------------- CRM Enhanced Functions ---------------- */
  const handleSearch = useCallback(async () => {
    if (tab !== "leads") return;
    setLoading(true);
    try {
      const params = {};
      if (searchQuery) params.q = searchQuery;
      if (statusFilter) params.status = statusFilter;
      if (countryFilter) params.country = countryFilter;
      if (serviceFilter) params.service = serviceFilter;
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;
      const res = await searchLeads(params);
      setRows(res?.data || []);
    } catch (e) { setError("Search failed"); }
    finally { setLoading(false); }
  }, [tab, searchQuery, statusFilter, countryFilter, serviceFilter, dateFrom, dateTo]);

  const handleEditLead = useCallback(async () => {
    if (!editingLead) return;
    try {
      await updateLead(editingLead.id, editForm);
      setEditingLead(null);
      setEditForm({});
      loadTab(tab);
    } catch (e) { setError("Failed to update lead"); }
  }, [editingLead, editForm, tab, loadTab]);

  const handleDeleteLead = useCallback(async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await deleteLead(id);
      loadTab(tab);
    } catch (e) { setError("Failed to delete lead"); }
  }, [tab, loadTab]);

  const handleBulkDelete = useCallback(async () => {
    if (!selectedRows.size) return;
    if (!window.confirm(`Delete ${selectedRows.size} selected leads?`)) return;
    try {
      await bulkDeleteLeads(Array.from(selectedRows));
      setSelectedRows(new Set());
      loadTab(tab);
    } catch (e) { setError("Failed to delete leads"); }
  }, [selectedRows, tab, loadTab]);

  const handleViewLead = useCallback(async (id) => {
    try {
      const res = await getLeadWithHistory(id);
      setLeadDetail(res?.data || null);
    } catch (e) { setError("Failed to load lead details"); }
  }, []);

  const handleAddNote = useCallback(async (id) => {
    if (!noteText.trim()) return;
    try {
      await addLeadNote(id, noteText);
      setNoteText("");
      handleViewLead(id);
    } catch (e) { setError("Failed to add note"); }
  }, [noteText, handleViewLead]);

  const handleStatusChange = useCallback(async (id, status) => {
    try {
      await updateLead(id, { status });
      loadTab(tab);
    } catch (e) { setError("Failed to update status"); }
  }, [tab, loadTab]);

  const toggleRowSelection = useCallback((id) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter("");
    setCountryFilter("");
    setServiceFilter("");
    setDateFrom("");
    setDateTo("");
  }, []);

  /* ---------------- existing functions ---------------- */
  const saveSettings = async () => {
    setSettingsSaved(false);
    try {
      await adminPut("/admin/settings", settings);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2500);
    } catch (e) { setError("Failed to save settings"); }
  };

  const loadTranscript = useCallback(async (row) => {
    try {
      const res = await adminGet(`/admin/collection?collection=sessions`);
      const session = (res?.data || []).find((s) => s.sessionId === row.sessionId);
      setOpenSession(session || row);
    } catch (e) { setOpenSession(row); }
  }, []);

  useEffect(() => {
    if (openSession && !openSession.messages && token) loadTranscript(openSession);
  }, [openSession, token, loadTranscript]);

  if (!token) return <LoginGate onLogin={setToken} />;

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className={`flex-1 min-h-screen ${isDark ? "bg-[#050508] text-gray-300" : "bg-gray-50 text-gray-700"}`}>
      <header className={`shrink-0 px-4 py-3 border-b flex items-center justify-between ${isDark ? "border-white/10 bg-[#0a0f2e]" : "border-gray-200 bg-white"}`}>
        <div className="flex items-center gap-3"><FaRobot size={20} className="text-cyan-500" /><span className="font-black">BluConnet AI Admin</span></div>
        <button onClick={() => { localStorage.removeItem(TOKEN_KEY); setToken(null); }}
          className={`p-1.5 rounded-xl ${isDark ? "hover:bg-white/10" : "hover:bg-gray-100"}`} aria-label="Logout">
          <FaSignOutAlt size={14} />
        </button>
      </header>

      <div className="px-4 py-4">
        <h2 className={`text-[22px] font-black ${isDark ? "text-white" : "text-gray-900"}`}>AI Assistant Dashboard</h2>
        {error && <p className="mt-2 text-red-400 text-[13px]">{error}</p>}
      </div>

      <div className="px-4 mb-2">
        <TabNav tabs={TABS} active={tab} setTab={setTab} isDark={isDark} />
      </div>

      <div className="px-4 pb-6 space-y-6">
        {tab === "overview" && dash && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Live Visitors" value={dash.stats?.liveVisitors} icon={<FaUsers size={20} />} isDark={isDark} />
              <StatCard label="Total Leads" value={dash.stats?.totalLeads} icon={<FaEnvelopeOpenText size={20} />} isDark={isDark} />
              <StatCard label="Meetings" value={dash.stats?.totalMeetings} icon={<FaCalendarCheck size={20} />} isDark={isDark} />
              <StatCard label="Applications" value={dash.stats?.totalApplications} icon={<FaUserTie size={20} />} isDark={isDark} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <QuickTile icon={<FaComments size={20} />} label={`${dash.stats?.totalSessions || 0} Chat Sessions`} sub="Total conversations" isDark={isDark} />
              <QuickTile icon={<FaHandsHelping size={20} />} label={`${dash.stats?.totalHandoffs || 0} Handoffs`} sub="Escalated to team" isDark={isDark} />
            </div>
            <div className={`${cardCls} p-4 space-y-3`}>
              <h3 className="font-bold text-[15px]">Intents Detected</h3>
              {dash.intents?.length ? (
                <div className="flex flex-wrap gap-2">
                  {dash.intents.map((intent, i) => (
                    <span key={i} className={`px-3 py-1 rounded-full text-[11px] font-semibold ${isDark ? "bg-white/10 text-white" : "bg-gray-100 text-gray-700"}`}>
                      {intent}
                    </span>
                  ))}
                </div>
              ) : <p className="text-[12.5px] opacity-60">No intents yet.</p>}
            </div>
          </div>
        )}

        {tab === "sessions" && (
          <div className={`${cardCls} p-4 space-y-4`}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[15px]">Chat History</h3>
              <a href={adminCsvUrl("sessions", token)} className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold ${isDark ? "bg-white/10 hover:bg-white/20" : "bg-gray-100 hover:bg-gray-200"}`}>
                <FaDownload className="inline mr-1" size={11} /> Export CSV
              </a>
            </div>
            {loading && <p className="text-[13px]">Loading…</p>}
            {!loading && !rows.length && <p className="text-[12.5px] opacity-60">No sessions yet.</p>}
            {!loading && rows.length > 0 && (
              <DataTable columns={COLUMNS.sessions} rows={rows} isDark={isDark} onRowClick={(r) => setOpenSession(r)} />
            )}
          </div>
        )}

        {tab === "leads" && (
          <div className={`${cardCls} p-4 space-y-4`}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-bold text-[15px]">{TABS.find((t) => t.id === tab)?.label}</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowFilters(!showFilters)} className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold ${isDark ? "bg-white/10 hover:bg-white/20" : "bg-gray-100 hover:bg-gray-200"}`}>
                  <FaFilter className="inline mr-1" size={11} /> Filters
                </button>
                <a href={adminCsvUrl("leads", token)} className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold ${isDark ? "bg-white/10 hover:bg-white/20" : "bg-gray-100 hover:bg-gray-200"}`}>
                  <FaDownload className="inline mr-1" size={11} /> Export CSV
                </a>
              </div>
            </div>

            {/* Search & Filters */}
            <div className={`space-y-3 p-3 rounded-xl ${isDark ? "bg-white/5" : "bg-gray-50"}`}>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-3 top-2.5 text-gray-400" size={12} />
                  <input type="text" placeholder="Search by name, email, phone, company..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border text-[13px] focus:outline-none focus:ring-2 focus:ring-cyan-500 ${isDark ? "bg-[#050508] border-white/10 text-white" : "bg-white border-gray-300 text-gray-900"}`} />
                </div>
                <button onClick={handleSearch} className="px-4 py-2 rounded-xl text-[12px] font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90">
                  Search
                </button>
                <button onClick={clearFilters} className={`px-3 py-2 rounded-xl text-[12px] font-semibold ${isDark ? "bg-white/10 hover:bg-white/20" : "bg-gray-200 hover:bg-gray-300"}`}>
                  <FaTimes size={11} />
                </button>
              </div>

              {showFilters && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`px-3 py-2 rounded-xl border text-[12px] ${isDark ? "bg-[#050508] border-white/10 text-white" : "bg-white border-gray-300"}`}>
                    <option value="">All Status</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="closed">Closed</option>
                    <option value="updated">Updated</option>
                  </select>
                  <input type="text" placeholder="Country" value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} className={`px-3 py-2 rounded-xl border text-[12px] ${isDark ? "bg-[#050508] border-white/10 text-white" : "bg-white border-gray-300"}`} />
                  <input type="text" placeholder="Service" value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} className={`px-3 py-2 rounded-xl border text-[12px] ${isDark ? "bg-[#050508] border-white/10 text-white" : "bg-white border-gray-300"}`} />
                  <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={`px-3 py-2 rounded-xl border text-[12px] ${isDark ? "bg-[#050508] border-white/10 text-white" : "bg-white border-gray-300"}`} />
                  <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className={`px-3 py-2 rounded-xl border text-[12px] ${isDark ? "bg-[#050508] border-white/10 text-white" : "bg-white border-gray-300"}`} />
                </div>
              )}
            </div>

            {/* Bulk Actions */}
            {selectedRows.size > 0 && (
              <div className={`flex items-center gap-2 p-2 rounded-xl ${isDark ? "bg-red-500/10" : "bg-red-50"}`}>
                <span className="text-[12px] font-semibold">{selectedRows.size} selected</span>
                <button onClick={handleBulkDelete} className="px-3 py-1 rounded-lg text-[11px] font-semibold text-white bg-red-500 hover:bg-red-600">
                  <FaTrash className="inline mr-1" size={10} /> Delete Selected
                </button>
              </div>
            )}

            {loading && <p className="text-[13px]">Loading…</p>}
            {!loading && !rows.length && <p className="text-[12.5px] opacity-60">No leads found.</p>}
            {!loading && rows.length > 0 && (
              <LeadsTable rows={rows} isDark={isDark} selectedRows={selectedRows} toggleRowSelection={toggleRowSelection}
                handleStatusChange={handleStatusChange} handleViewLead={handleViewLead} handleEditLead={handleEditLead}
                handleDeleteLead={handleDeleteLead} setEditingLead={setEditingLead} setEditForm={setEditForm} fmt={fmt} />
            )}
          </div>
        )}

        {(tab === "meetings" || tab === "applications" || tab === "handoffs") && (
          <div className={`${cardCls} p-4 space-y-4`}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[15px]">{TABS.find((t) => t.id === tab)?.label}</h3>
              <a href={adminCsvUrl(tab, token)} className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold ${isDark ? "bg-white/10 hover:bg-white/20" : "bg-gray-100 hover:bg-gray-200"}`}>
                <FaDownload className="inline mr-1" size={11} /> Export CSV
              </a>
            </div>
            {loading && <p className="text-[13px]">Loading…</p>}
            {!loading && !rows.length && <p className="text-[12.5px] opacity-60">No data yet.</p>}
            {!loading && rows.length > 0 && (
              <DataTable columns={COLUMNS[tab]} rows={rows} isDark={isDark} />
            )}
          </div>
        )}

        {tab === "popular" && (
          <div className={`${cardCls} p-4 space-y-3`}>
            <h3 className="font-bold text-[15px]">Popular Questions</h3>
            {loading && <p className="text-[13px]">Loading…</p>}
            {!loading && (!dash?.popular?.length) && <p className="text-[12.5px] opacity-60">No data yet.</p>}
            {!loading && dash?.popular?.map((q, i) => (
              <div key={i} className={`p-3 rounded-xl border ${isDark ? "border-white/5" : "border-gray-100"}`}>
                <div className={`font-medium text-[12.5px] ${isDark ? "text-white" : "text-gray-900"}`}>{q.question}</div>
                <div className={`text-[11px] mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{q.count} × asked</div>
              </div>
            ))}
          </div>
        )}

        {tab === "settings" && (
          <motion.form key="settings-form" onSubmit={(e) => { e.preventDefault(); saveSettings(); }}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`${cardCls} p-6 space-y-5`}>
            <h2 className="font-black text-base">Integration Settings</h2>
            <div className="space-y-2">
              <label className="block text-[12.5px] font-semibold">Outgoing Webhook URL</label>
              <input type={settings.webhookUrl ? "url" : "text"} value={settings.webhookUrl || ""} onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })}
                placeholder="https://hooks.slack.com/… or Zapier webhook" className={inputCls} />
              <p className={`text-[10.5px] ${isDark ? "text-gray-500" : "text-gray-400"}`}>Fired for every new lead, meeting, application or handoff.</p>
            </div>
            <div className="space-y-2">
              <label className="block text-[12.5px] font-semibold">CRM Webhook URL</label>
              <input type={settings.crmWebhookUrl ? "url" : "text"} value={settings.crmWebhookUrl || ""} onChange={(e) => setSettings({ ...settings, crmWebhookUrl: e.target.value })}
                placeholder="https://hooks.zapier.com/crm/… (optional)" className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="emailNotify" checked={settings.emailNotify} onChange={(e) => setSettings({ ...settings, emailNotify: e.target.checked })} className="w-4 h-4 rounded accent-cyan-500" />
              <label htmlFor="emailNotify" className="text-[12.5px] font-semibold">Send email notifications (SMTP)</label>
            </div>
            <button type="submit" className="px-5 py-2.5 rounded-xl text-[13px] font-bold text-white bg-gradient-to-r from-emerald-500 to-cyan-600 hover:opacity-90 transition shadow">
              {settingsSaved ? "✅ Saved!" : "Save Settings"}
            </button>
          </motion.form>
        )}

        {/* transcript viewer */}
        {openSession && openSession.messages && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`${cardCls} p-5 space-y-4`}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[14px]">Chat Transcript — {openSession.sessionId?.slice(-8)}</h3>
              <button onClick={() => setOpenSession(null)} className={`p-1.5 rounded-xl ${isDark ? "hover:bg-white/10" : "hover:bg-gray-100"}`} aria-label="Close transcript">
                <FaSignOutAlt size={13} />
              </button>
            </div>
            <div className={`space-y-3 pr-1 text-[12.5px] ${isDark ? "text-gray-200" : "text-gray-700"}`}>
              {openSession.messages.map((m, i) => (
                <div key={i} className="flex gap-2.5">
                  <span className={`shrink-0 text-[10px] font-bold uppercase ${m.role === "bot" ? "text-cyan-500" : isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {m.role === "bot" ? "AI" : "You"}
                  </span>
                  <span className="min-w-0 flex-1">{m.text || <i className="opacity-50">(attachment)</i>}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Lead Detail Modal */}
        {leadDetail && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setLeadDetail(null)}>
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-4 md:inset-8 z-50 overflow-auto"
              role="dialog"
              aria-modal="true"
            >
              <div className={`${cardCls} max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
                {/* Header */}
                <div className={`${cardCls} p-6 border-b ${isDark ? "bg-[#1a2847]" : "bg-gray-50"}`}>
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-[20px]">Lead Details</h2>
                    <button onClick={() => setLeadDetail(null)} className={`p-2 rounded-xl transition ${isDark ? "hover:bg-white/10" : "hover:bg-gray-200"}`}>
                      <FaTimes size={18} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-[11px] text-slate-400 font-medium">Lead ID: {leadDetail.id?.slice(-12)}</span>
                  </div>
                </div>

                {/* Lead Info */}
                <div className="p-6 space-y-6">
                  {/* Basic Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <BasicInfo label="Name" value={leadDetail.name || "-"} isDark={isDark} />
                    <BasicInfo label="Email" value={leadDetail.email || "-"} isDark={isDark} />
                    <BasicInfo label="Phone" value={leadDetail.phone || "-"} isDark={isDark} />
                    <BasicInfo label="Status" value={leadDetail.status?.charAt(0).toUpperCase() + (leadDetail.status || "").slice(1) || "-"} isDark={isDark} />
                    <BasicInfo label="Company" value={leadDetail.company || "-"} isDark={isDark} />
                    <BasicInfo label="Country" value={leadDetail.country || "-"} isDark={isDark} />
                    {leadDetail.service && <BasicInfo label="Service Interested" value={leadDetail.service} isDark={isDark} />}
                    {leadDetail.budget && <BasicInfo label="Budget" value={leadDetail.budget} isDark={isDark} />}
                    {leadDetail.meetingDate && <BasicInfo label="Meeting Date" value={leadDetail.meetingDate} isDark={isDark} />}
                    {leadDetail.meetingTime && <BasicInfo label="Meeting Time" value={leadDetail.meetingTime} isDark={isDark} />}
                    {leadDetail.timezone && <BasicInfo label="Time Zone" value={leadDetail.timezone} isDark={isDark} />}
                    <BasicInfo label="Source" value={leadDetail.leadSource || "AI Chat"} isDark={isDark} />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {editingLead && (
          <EditLeadModal open={!!editingLead} lead={editingLead}
            onClose={() => setEditingLead(null)}
            onSave={async (f) => { await updateLead(f.id, f); setEditingLead(null); loadTab(tab); }} />
        )}
      </div>
    </motion.main>
  );
}
function EditLeadModal({ open, lead, onClose, onSave }) {
  const { isDarkMode } = useTheme();
  const isDark = isDarkMode;
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    setEditing({ ...lead });
  }, [open, lead]);

  useEffect(() => { if (open) window.scrollTo(0, 0); }, [open]);

  if (!open || !lead) return null;

  const handleSave = async () => {
    await onSave(editing);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={`w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border ${isDark ? "bg-[#0a0f2e] border-white/10" : "bg-white border-gray-200"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="font-black">Edit Lead</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500">
            <FaTimes size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {[
            ["name", "Name"],
            ["email", "Email"],
            ["phone", "Phone"],
            ["company", "Company"],
            ["country", "Country"],
            ["budget", "Budget"],
            ["service", "Service Interested"],
          ].map(([key, label]) => (
            <div key={key} className="space-y-1.5">
              <label className="text-xs font-semibold opacity-70">{label}</label>
              <input
                type={key === "email" ? "email" : key === "phone" ? "tel" : "text"}
                value={editing[key] || ""}
                onChange={(e) => setEditing({ ...editing, [key]: e.target.value })}
                className={`w-full rounded-xl px-4 py-2.5 text-sm border focus:outline-none focus:ring-2 focus:ring-cyan-500 ${isDark ? "bg-white/5 text-white border-white/10" : "bg-gray-50 text-gray-900 border-gray-200"}`}
              />
            </div>
          ))}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold opacity-70">Requirements</label>
            <textarea
              value={editing.requirements || ""}
              onChange={(e) => setEditing({ ...editing, requirements: e.target.value })}
              rows={4}
              className={`w-full rounded-xl px-4 py-2.5 text-sm border focus:outline-none focus:ring-2 focus:ring-cyan-500 ${isDark ? "bg-white/5 text-white border-white/10" : "bg-gray-50 text-gray-900 border-gray-200"}`}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold opacity-70">Status</label>
            <select
              value={editing.status || "new"}
              onChange={(e) => setEditing({ ...editing, status: e.target.value })}
              className={`w-full rounded-xl px-4 py-2.5 text-sm border focus:outline-none focus:ring-2 focus:ring-cyan-500 ${isDark ? "bg-white/5 text-white border-white/10" : "bg-gray-50 text-gray-900 border-gray-200"}`}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="closed">Closed</option>
              <option value="updated">Updated</option>
            </select>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold opacity-70">Notes</label>
            <textarea
              value={editing.notes || ""}
              onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
              rows={3}
              className={`w-full rounded-xl px-4 py-2.5 text-sm border focus:outline-none focus:ring-2 focus:ring-cyan-500 ${isDark ? "bg-white/5 text-white border-white/10" : "bg-gray-50 text-gray-900 border-gray-200"}`}
            />
          </div>

          {/* Meeting Details */}
          {editing.meetingDate && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold opacity-70">Meeting Date</label>
                  <input
                    type="date"
                    value={editing.meetingDate || ""}
                    onChange={(e) => setEditing({ ...editing, meetingDate: e.target.value })}
                    className={`w-full rounded-xl px-4 py-2.5 text-sm border focus:outline-none focus:ring-2 focus:ring-cyan-500 ${isDark ? "bg-white/5 text-white border-white/10" : "bg-gray-50 text-gray-900 border-gray-200"}`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold opacity-70">Meeting Time</label>
                  <input
                    type="time"
                    value={editing.meetingTime || ""}
                    onChange={(e) => setEditing({ ...editing, meetingTime: e.target.value })}
                    className={`w-full rounded-xl px-4 py-2.5 text-sm border focus:outline-none focus:ring-2 focus:ring-cyan-500 ${isDark ? "bg-white/5 text-white border-white/10" : "bg-gray-50 text-gray-900 border-gray-200"}`}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold opacity-70">Time Zone</label>
                <input
                  type="text"
                  value={editing.timezone || ""}
                  onChange={(e) => setEditing({ ...editing, timezone: e.target.value })}
                  className={`w-full rounded-xl px-4 py-2.5 text-sm border focus:outline-none focus:ring-2 focus:ring-cyan-500 ${isDark ? "bg-white/5 text-white border-white/10" : "bg-gray-50 text-gray-900 border-gray-200"}`}
                />
              </div>
            </>
          )}
        </div>

        <div className="p-6 border-t flex justify-end gap-3">
          <button onClick={onClose} className={`px-5 py-2.5 rounded-xl text-sm font-semibold ${isDark ? "text-gray-300 hover:bg-white/10" : "text-gray-600 hover:bg-gray-100"} transition`}>
            Cancel
          </button>
          <button onClick={handleSave} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-cyan-600 hover:opacity-90 transition shadow">
            Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ChatAdmin;
