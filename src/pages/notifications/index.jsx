import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/ui/Header";
import Sidebar from "../../components/ui/Sidebar";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import BreadcrumbNavigation from "../../components/ui/BreadcrumbNavigation";
import notificationService from "../../services/notificationService";
import useAuthStore from "../../store/useAuthStore";

const breadcrumbItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Notifications & Email", path: "/notifications" },
];

const RECIPIENT_FILTERS = [
    { value: "all", label: "All Employees", icon: "Users" },
    { value: "country", label: "By Country / Region", icon: "Globe" },
    { value: "employees", label: "Select Employees", icon: "User" },
    { value: "custom", label: "Custom Emails", icon: "Mail" },
    { value: "clients", label: "Send to Clients", icon: "Briefcase" },
];

const TYPE_OPTIONS = [
    { value: "email", label: "Email Only", icon: "Mail" },
    { value: "push", label: "Push Notification", icon: "Bell" },
    { value: "both", label: "Email + Push", icon: "Zap" },
];

const STATUS_COLORS = {
    sent: "bg-success/10 text-success border-success/20",
    failed: "bg-error/10 text-error border-error/20",
    partial: "bg-warning/10 text-warning border-warning/20",
    pending: "bg-muted text-muted-foreground border-border",
};

// ─── Main Component ────────────────────────────────────────────────────────────
export default function NotificationsPage() {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const companyId = user?.company?.id || user?.companyId;

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState("compose"); // 'compose' | 'history'

    // Compose state
    const [form, setForm] = useState({
        title: "",
        message: "",
        type: "email",
        recipientFilter: "all",
        recipientCountry: "",
        recipientEmails: "",
        selectedEmployeeIds: [],
    });
    const [employees, setEmployees] = useState([]);
    const [employeeSearch, setEmployeeSearch] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [sendResult, setSendResult] = useState(null);

    // History state
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState({ total: 0, sent: 0, failed: 0 });
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyFilter, setHistoryFilter] = useState("all");

    useEffect(() => {
        if (!companyId) return;
        fetchEmployees();
    }, [companyId]);

    useEffect(() => {
        if (activeTab === "history" && companyId) {
            fetchHistory();
        }
    }, [activeTab, companyId]);

    const fetchEmployees = async () => {
        try {
            const data = await notificationService.getEmployees(companyId);
            setEmployees(Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching employees:", err);
        }
    };

    const fetchHistory = async () => {
        setHistoryLoading(true);
        try {
            const [histData, statsData] = await Promise.all([
                notificationService.getHistory(companyId),
                notificationService.getStats(companyId),
            ]);
            setHistory(Array.isArray(histData?.data) ? histData.data : Array.isArray(histData) ? histData : []);
            setStats(statsData?.data || statsData || { total: 0, sent: 0, failed: 0 });
        } catch (err) {
            console.error("Error fetching history:", err);
        } finally {
            setHistoryLoading(false);
        }
    };

    const filteredHistory = useMemo(() => {
        if (historyFilter === "all") return history;
        return history.filter((h) => h.status === historyFilter);
    }, [history, historyFilter]);

    const filteredEmployees = useMemo(() =>
        employees.filter(
            (e) =>
                (e.user?.name || "").toLowerCase().includes(employeeSearch.toLowerCase()) ||
                (e.user?.email || "").toLowerCase().includes(employeeSearch.toLowerCase())
        ),
        [employees, employeeSearch]
    );

    const toggleEmployee = (id) => {
        setForm((f) => ({
            ...f,
            selectedEmployeeIds: f.selectedEmployeeIds.includes(id)
                ? f.selectedEmployeeIds.filter((x) => x !== id)
                : [...f.selectedEmployeeIds, id],
        }));
    };

    const handleSend = async () => {
        if (!form.title.trim() || !form.message.trim()) {
            alert("Please fill in Title and Message.");
            return;
        }
        setIsSending(true);
        setSendResult(null);
        try {
            const payload = {
                title: form.title,
                message: form.message,
                type: form.type,
                recipientFilter: form.recipientFilter,
                recipientCountry: form.recipientCountry || undefined,
                recipientEmails: form.recipientEmails
                    ? form.recipientEmails.split(",").map((e) => e.trim()).filter(Boolean)
                    : [],
                recipientIds: form.recipientFilter === "employees" ? form.selectedEmployeeIds : [],
                companyId,
            };
            const result = await notificationService.send(payload);
            setSendResult({ success: true, data: result?.data || result });
            setForm((f) => ({ ...f, title: "", message: "" }));
        } catch (err) {
            setSendResult({ success: false, error: err.response?.data?.message || err.message });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />

            <main className={`transition-all duration-300 ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-60"} pt-16 pb-20 lg:pb-6`}>
                <div className="p-6 max-w-7xl mx-auto">
                    <BreadcrumbNavigation items={breadcrumbItems} />

                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <Icon name="Bell" size={28} className="mr-3 text-primary" />
                                Notifications & Email Center
                            </h1>
                            <p className="text-muted-foreground mt-1 ml-10">Broadcast messages to your team, employees, and clients</p>
                        </div>
                    </div>

                    {/* Tab Bar */}
                    <div className="flex space-x-1 bg-muted/40 rounded-xl p-1 mb-8 w-fit border border-border">
                        {[
                            { id: "compose", label: "Compose", icon: "PenLine" },
                            { id: "history", label: "History", icon: "History" },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.id
                                        ? "bg-card text-primary shadow border border-border"
                                        : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                <Icon name={tab.icon} size={16} />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* ── COMPOSE TAB ── */}
                    {activeTab === "compose" && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left: Form */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Send Result Banner */}
                                {sendResult && (
                                    <div className={`flex items-start p-4 rounded-xl border ${sendResult.success ? "bg-success/10 border-success/30 text-success" : "bg-error/10 border-error/30 text-error"}`}>
                                        <Icon name={sendResult.success ? "CheckCircle" : "AlertCircle"} size={20} className="mr-3 mt-0.5 flex-shrink-0" />
                                        <div>
                                            {sendResult.success ? (
                                                <div>
                                                    <p className="font-bold">Notification Sent Successfully!</p>
                                                    <p className="text-sm opacity-80">
                                                        ✉️ {sendResult.data?.successCount || 0} delivered &nbsp;·&nbsp;
                                                        ❌ {sendResult.data?.failureCount || 0} failed
                                                    </p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <p className="font-bold">Failed to Send</p>
                                                    <p className="text-sm opacity-80">{sendResult.error}</p>
                                                </div>
                                            )}
                                        </div>
                                        <button onClick={() => setSendResult(null)} className="ml-auto"><Icon name="X" size={16} /></button>
                                    </div>
                                )}

                                {/* Message Card */}
                                <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                                    <div className="p-5 border-b border-border bg-muted/20">
                                        <h3 className="font-bold flex items-center"><Icon name="PenLine" size={16} className="mr-2 text-primary" /> Compose Message</h3>
                                    </div>
                                    <div className="p-6 space-y-5">
                                        {/* Type selector */}
                                        <div>
                                            <label className="text-sm font-semibold text-foreground mb-2 block">Delivery Method</label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {TYPE_OPTIONS.map((opt) => (
                                                    <button
                                                        key={opt.value}
                                                        onClick={() => setForm((f) => ({ ...f, type: opt.value }))}
                                                        className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all text-sm font-semibold ${form.type === opt.value
                                                                ? "border-primary bg-primary/10 text-primary"
                                                                : "border-border bg-background text-muted-foreground hover:border-primary/40"
                                                            }`}
                                                    >
                                                        <Icon name={opt.icon} size={20} className="mb-1" />
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <div>
                                            <label className="text-sm font-semibold text-foreground mb-1.5 block">Subject / Title *</label>
                                            <input
                                                type="text"
                                                value={form.title}
                                                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                                                placeholder="E.g., Company Holiday Announcement"
                                                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                            />
                                        </div>

                                        {/* Message */}
                                        <div>
                                            <label className="text-sm font-semibold text-foreground mb-1.5 block">Message *</label>
                                            <textarea
                                                value={form.message}
                                                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                                                placeholder="Write your message here..."
                                                rows={6}
                                                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                                            />
                                            <p className="text-xs text-muted-foreground mt-1 text-right">{form.message.length} characters</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Send Button */}
                                <div className="flex justify-end">
                                    <Button
                                        onClick={handleSend}
                                        isLoading={isSending}
                                        iconName="Send"
                                        className="px-8"
                                    >
                                        Send Now
                                    </Button>
                                </div>
                            </div>

                            {/* Right: Recipients Panel */}
                            <div className="space-y-6">
                                <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                                    <div className="p-5 border-b border-border bg-muted/20">
                                        <h3 className="font-bold flex items-center"><Icon name="Users" size={16} className="mr-2 text-primary" /> Recipients</h3>
                                    </div>
                                    <div className="p-5 space-y-4">
                                        {RECIPIENT_FILTERS.map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => setForm((f) => ({ ...f, recipientFilter: opt.value, selectedEmployeeIds: [] }))}
                                                className={`w-full flex items-center p-3 rounded-xl border-2 transition-all text-sm font-semibold text-left ${form.recipientFilter === opt.value
                                                        ? "border-primary bg-primary/10 text-primary"
                                                        : "border-border bg-background text-muted-foreground hover:border-primary/40"
                                                    }`}
                                            >
                                                <Icon name={opt.icon} size={18} className="mr-3 flex-shrink-0" />
                                                {opt.label}
                                            </button>
                                        ))}

                                        {/* Country input */}
                                        {form.recipientFilter === "country" && (
                                            <div className="pt-2">
                                                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Country / Region</label>
                                                <input
                                                    type="text"
                                                    value={form.recipientCountry}
                                                    onChange={(e) => setForm((f) => ({ ...f, recipientCountry: e.target.value }))}
                                                    placeholder="E.g., India, Mumbai..."
                                                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                                />
                                                <p className="text-xs text-muted-foreground mt-1">Matches employee branch or address</p>
                                            </div>
                                        )}

                                        {/* Employee multi-select */}
                                        {form.recipientFilter === "employees" && (
                                            <div className="pt-2">
                                                <input
                                                    type="text"
                                                    placeholder="Search employees..."
                                                    value={employeeSearch}
                                                    onChange={(e) => setEmployeeSearch(e.target.value)}
                                                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 mb-2 transition-all"
                                                />
                                                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                                                    {filteredEmployees.map((emp) => (
                                                        <button
                                                            key={emp.id}
                                                            onClick={() => toggleEmployee(emp.id)}
                                                            className={`w-full flex items-center p-2.5 rounded-lg border transition-all text-sm text-left ${form.selectedEmployeeIds.includes(emp.id)
                                                                    ? "border-primary bg-primary/10 text-primary"
                                                                    : "border-transparent hover:bg-muted/40 text-foreground"
                                                                }`}
                                                        >
                                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs mr-2.5 flex-shrink-0">
                                                                {(emp.user?.name || "?")[0].toUpperCase()}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="font-semibold truncate">{emp.user?.name || "Unknown"}</div>
                                                                <div className="text-xs text-muted-foreground truncate">{emp.user?.email}</div>
                                                            </div>
                                                            {form.selectedEmployeeIds.includes(emp.id) && (
                                                                <Icon name="Check" size={14} className="ml-auto flex-shrink-0" />
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                                {form.selectedEmployeeIds.length > 0 && (
                                                    <p className="text-xs text-primary font-semibold mt-2">
                                                        {form.selectedEmployeeIds.length} employee{form.selectedEmployeeIds.length > 1 ? "s" : ""} selected
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* Custom emails */}
                                        {(form.recipientFilter === "custom" || form.recipientFilter === "clients") && (
                                            <div className="pt-2">
                                                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Email Addresses</label>
                                                <textarea
                                                    value={form.recipientEmails}
                                                    onChange={(e) => setForm((f) => ({ ...f, recipientEmails: e.target.value }))}
                                                    placeholder="email1@example.com, email2@example.com"
                                                    rows={3}
                                                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                                                />
                                                <p className="text-xs text-muted-foreground mt-1">Comma-separated email addresses</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── HISTORY TAB ── */}
                    {activeTab === "history" && (
                        <div className="space-y-6">
                            {/* Stats Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    { label: "Total Sent", value: stats.total, icon: "Send", color: "text-primary", bg: "bg-primary/10" },
                                    { label: "Successful", value: stats.sent, icon: "CheckCircle", color: "text-success", bg: "bg-success/10" },
                                    { label: "Failed", value: stats.failed, icon: "AlertCircle", color: "text-error", bg: "bg-error/10" },
                                ].map((stat) => (
                                    <div key={stat.label} className="bg-card border border-border rounded-xl p-5 flex items-center space-x-4 shadow-sm">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                                            <Icon name={stat.icon} size={22} className={stat.color} />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-black text-foreground">{stat.value}</div>
                                            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Filter Row */}
                            <div className="flex items-center space-x-3 flex-wrap gap-2">
                                <span className="text-sm font-semibold text-muted-foreground">Filter:</span>
                                {["all", "sent", "partial", "failed"].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setHistoryFilter(f)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize border transition-all ${historyFilter === f
                                                ? "bg-primary text-white border-primary"
                                                : "bg-background border-border text-muted-foreground hover:border-primary"
                                            }`}
                                    >
                                        {f === "all" ? "All" : f}
                                    </button>
                                ))}
                            </div>

                            {/* History Table */}
                            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-muted/50 border-b border-border">
                                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Title</th>
                                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Recipients</th>
                                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Type</th>
                                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Results</th>
                                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Sent By</th>
                                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {historyLoading ? (
                                                <tr>
                                                    <td colSpan="7" className="py-16 text-center">
                                                        <Icon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-3" />
                                                        <p className="text-muted-foreground">Loading history...</p>
                                                    </td>
                                                </tr>
                                            ) : filteredHistory.length === 0 ? (
                                                <tr>
                                                    <td colSpan="7" className="py-16 text-center">
                                                        <Icon name="Inbox" size={48} className="text-muted-foreground/20 mx-auto mb-4" />
                                                        <p className="text-foreground font-semibold">No notifications found</p>
                                                        <p className="text-muted-foreground text-sm mt-1">Send your first notification to see it here.</p>
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredHistory.map((notif) => (
                                                    <tr key={notif.id} className="hover:bg-muted/20 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="font-semibold text-foreground max-w-[200px] truncate">{notif.title}</div>
                                                            <div className="text-xs text-muted-foreground mt-0.5 max-w-[200px] truncate">{notif.message}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
                                                                <Icon name="Users" size={11} className="mr-1" />
                                                                {notif.recipientFilter}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center">
                                                                <Icon
                                                                    name={notif.type === "email" ? "Mail" : notif.type === "push" ? "Bell" : "Zap"}
                                                                    size={14}
                                                                    className="mr-1.5 text-primary"
                                                                />
                                                                <span className="text-sm capitalize">{notif.type}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase border ${STATUS_COLORS[notif.status] || STATUS_COLORS.pending}`}>
                                                                {notif.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm">
                                                                <span className="text-success font-bold">✓ {notif.successCount}</span>
                                                                {notif.failureCount > 0 && (
                                                                    <span className="text-error font-bold ml-2">✗ {notif.failureCount}</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-muted-foreground">
                                                            {notif.sentBy?.name || "System"}
                                                        </td>
                                                        <td className="px-6 py-4 text-xs text-muted-foreground whitespace-nowrap">
                                                            {new Date(notif.createdAt).toLocaleString()}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
