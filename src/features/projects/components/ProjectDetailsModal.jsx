import React, { useEffect, useState } from "react";
import { X, Briefcase, Calendar, DollarSign, Github, ExternalLink, Mail, User, Clock, Loader2, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import apiClient from "../../../api/client";
import { API_ENDPOINTS } from "../../../api/endpoints";
import { employeeService } from "../../../services/employee.service";

const ProjectDetailsModal = ({ projectId, onClose }) => {
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [employeeMap, setEmployeeMap] = useState({});
    const [invoices, setInvoices] = useState([]);

    const fetchProjectData = async () => {
        try {
            setLoading(true);
            const [projectRes, employees] = await Promise.all([
                apiClient.get(`${API_ENDPOINTS.PROJECTS.BASE}/${projectId}`),
                employeeService.getAll()
            ]);
            
            const data = projectRes.data.data || projectRes.data;
            
            // Map employee IDs to names
            const map = {};
            employees.forEach(emp => {
                map[emp.id] = `${emp.user?.firstName || "Unknown"} ${emp.user?.lastName || ""}`.trim();
            });
            setEmployeeMap(map);

            let assignedPeople = data.assignedPeople;
            if (typeof assignedPeople === 'string') {
                assignedPeople = assignedPeople.replace(/[{}"]/g, "").split(",").map(p => p.trim());
            } else if (!Array.isArray(assignedPeople)) {
                assignedPeople = [];
            }
            
            const enrichedProject = { ...data, assignedPeople };
            setProject(enrichedProject);

            // Fetch Invoices for this project
            // Since invoices are linked to clients, we fetch the client details which includes invoices relation
            if (data.clientId) {
                const clientRes = await apiClient.get(`${API_ENDPOINTS.PROJECTS.CLIENTS}/${data.clientId}`);
                const clientData = clientRes.data.data || clientRes.data;
                
                if (clientData.invoices && Array.isArray(clientData.invoices)) {
                    // Filter invoices by projectId OR projectName (for backward compatibility)
                    const projectInvoices = clientData.invoices.filter(inv => 
                        inv.projectId === projectId || 
                        inv.projectName === data.projectName || 
                        inv.projectName === data.name
                    );
                    setInvoices(projectInvoices);
                }
            }
        } catch (err) {
            console.error("Error fetching project details:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (projectId) {
            fetchProjectData();
        }
    }, [projectId]);

    if (!projectId) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-none transition-all duration-300">
            <div className="bg-white w-full max-w-5xl max-h-[95vh] rounded-none shadow-none border border-slate-200 flex flex-col animate-in fade-in duration-200">
                {/* Dashboard Style Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-none">
                            <Briefcase size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 leading-none">
                                {loading ? "Loading Project..." : project?.projectName || "Project Details"}
                            </h2>
                            <p className="text-[11px] text-slate-500 mt-1 uppercase tracking-widest font-medium">Project Management Interface</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all rounded-none"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto p-0 custom-scrollbar bg-slate-50/30">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-96">
                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Retrieving Project Data...</p>
                        </div>
                    ) : project ? (
                        <div className="p-6 space-y-6">
                            {/* Summary Metrics Row */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <MetricCard 
                                    icon={<DollarSign size={16} className="text-blue-600" />} 
                                    label="Project Budget" 
                                    value={`₹${(project.totalPayment || project.budget || 0).toLocaleString()}`} 
                                />
                                <MetricCard 
                                    icon={<Clock size={16} className="text-purple-600" />} 
                                    label="Project Deadline" 
                                    value={project.deadline ? new Date(project.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'} 
                                />
                                <MetricCard 
                                    icon={<ExternalLink size={16} className="text-emerald-600" />} 
                                    label="Current Phase" 
                                    value={project.phase || "Planning"} 
                                />
                                <MetricCard 
                                    icon={<Activity size={16} className="text-orange-600" />} 
                                    label="Project Status" 
                                    value={project.status || "Active"} 
                                />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Left Column: Description & Team */}
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Description Section */}
                                    <div className="bg-white border border-slate-200 p-6">
                                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Technical Description</h3>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            {project.description || "No technical specifications provided for this project unit."}
                                        </p>
                                    </div>

                                    {/* Team Manifest */}
                                    <div className="bg-white border border-slate-200 p-6">
                                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Assigned Project Personnel</h3>
                                        <div className="flex flex-wrap gap-3">
                                            {project.assignedPeople?.length > 0 ? (
                                                project.assignedPeople.map((person, i) => {
                                                    const resolvedName = employeeMap[person] || person;
                                                    return (
                                                        <div key={i} className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2 hover:bg-slate-100 transition-colors cursor-default">
                                                            <div className="w-5 h-5 bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                                                                {resolvedName.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-tight">
                                                                {resolvedName}
                                                            </span>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="flex items-center gap-2 text-slate-400 italic py-2">
                                                    <AlertCircle size={14} />
                                                    <span className="text-xs">No personnel assigned to this project yet.</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Invoice History Section */}
                                    <div className="bg-white border border-slate-200 overflow-hidden">
                                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Project Invoice History</h3>
                                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5">{invoices.length} Records</span>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="bg-white border-b border-slate-100">
                                                        <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Invoice #</th>
                                                        <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date Issued</th>
                                                        <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                                                        <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                    {invoices.length > 0 ? (
                                                        invoices.map((inv) => (
                                                            <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                                                                <td className="px-6 py-3">
                                                                    <span className="text-xs font-bold text-blue-600 font-mono tracking-tight">{inv.invoiceNumber}</span>
                                                                </td>
                                                                <td className="px-6 py-3 text-[11px] text-slate-600">
                                                                    {new Date(inv.issuedAt).toLocaleDateString('en-IN')}
                                                                </td>
                                                                <td className="px-6 py-3 text-xs font-bold text-slate-900">
                                                                    ₹{Number(inv.amount).toLocaleString()}
                                                                </td>
                                                                <td className="px-6 py-3">
                                                                    <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${
                                                                        inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                                                                    }`}>
                                                                        {inv.status}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="4" className="px-6 py-8 text-center text-xs text-slate-400 italic">
                                                                No financial records found for this project unit.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Client & Recovery */}
                                <div className="space-y-6">
                                    {/* Client Entity Card */}
                                    <div className="bg-slate-900 p-6 text-white border border-slate-900">
                                        <div className="flex items-center gap-2 mb-6 opacity-60">
                                            <User size={14} />
                                            <h3 className="text-[10px] font-bold uppercase tracking-widest">Client Identity</h3>
                                        </div>
                                        <div className="space-y-6">
                                            <div>
                                                <p className="text-xl font-bold tracking-tight">{project.clientName || 'Private Client'}</p>
                                                <div className="flex items-center gap-2 mt-2 text-blue-400 hover:text-blue-300 transition-colors">
                                                    <Mail size={12} />
                                                    <span className="text-[11px] font-medium truncate">{project.clientEmail}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="pt-4 border-t border-white/10 space-y-3">
                                                <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-bold text-white/40">
                                                    <span>Quick Links</span>
                                                </div>
                                                <LinkSection icon={<Github size={14} />} label="Repository" url={project.githubLink} />
                                                <LinkSection icon={<ExternalLink size={14} />} label="Live Demo" url={project.deploymentLink} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Financial Recovery Gauge */}
                                    <div className="bg-white p-6 border border-slate-200">
                                        <div className="flex justify-between items-end mb-4">
                                            <div>
                                                <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Payment Recovery</h3>
                                                <p className="text-[9px] text-slate-400 uppercase mt-1">Status: {Number(project.paymentReceived) >= Number(project.totalPayment) ? 'Recovered' : 'Calculated Inbound'}</p>
                                            </div>
                                            <span className="text-xs font-bold text-emerald-600">
                                                {project.totalPayment > 0 ? Math.round((project.paymentReceived / project.totalPayment) * 100) : 0}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-2 overflow-hidden">
                                            <div 
                                                className="bg-emerald-500 h-full transition-all duration-1000 ease-out" 
                                                style={{ width: `${project.totalPayment > 0 ? (project.paymentReceived / project.totalPayment) * 100 : 0}%` }}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-50">
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Received</p>
                                                <p className="text-sm font-bold text-slate-900">₹{project.paymentReceived?.toLocaleString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Outstanding</p>
                                                <p className="text-sm font-bold text-rose-600">₹{(project.totalPayment - project.paymentReceived)?.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-24 text-center">
                             <AlertCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Project Not Found in Database</p>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 text-[11px] font-bold text-slate-600 uppercase tracking-wider bg-white border border-slate-200 hover:bg-slate-100 transition-all active:scale-95"
                    >
                        Close Portal
                    </button>
                    {project && (
                        <a 
                            href={`/edit-project/${project.id}`}
                            className="px-6 py-2 text-[11px] font-bold text-white uppercase tracking-wider bg-blue-600 border border-blue-600 hover:bg-blue-700 transition-all active:scale-95 shadow-sm"
                        >
                            Modify Parameters
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

// Internal Components
const MetricCard = ({ icon, label, value }) => (
    <div className="bg-white border border-slate-200 p-4 flex items-center gap-4">
        <div className="w-8 h-8 bg-slate-50 flex items-center justify-center">
            {icon}
        </div>
        <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
            <p className="text-sm font-bold text-slate-900 tracking-tight">{value || "N/A"}</p>
        </div>
    </div>
);

const MetricCard2 = ({ icon, label, value }) => {
    return (
        <div className="p-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
                <div className="text-slate-400 group-hover:text-slate-900 transition-colors">
                    {icon}
                </div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
            </div>
            <p className="text-lg font-black text-slate-900 font-mono italic tracking-tighter">{value || "N/A"}</p>
        </div>
    );
};

const LinkSection = ({ icon, label, url }) => (
    <div className="flex items-center justify-between group">
        <div className="flex items-center gap-3">
            <div className="text-white/20 group-hover:text-blue-400 transition-all">
                {icon}
            </div>
            <span className="text-[11px] font-medium text-white/50">{label}</span>
        </div>
        {url ? (
            <a href={url} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-blue-400 hover:underline flex items-center gap-1 uppercase tracking-widest">
                Link <ExternalLink size={10} />
            </a>
        ) : (
            <span className="text-[10px] font-bold text-white/10 uppercase italic">N/A</span>
        )}
    </div>
);

// Added Activity icon to imports since it was missing but used in MetricCard
const Activity = ({ size, className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
);

export default ProjectDetailsModal;
