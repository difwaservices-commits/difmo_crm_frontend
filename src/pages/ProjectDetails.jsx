import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/ui/Header";
import Sidebar from "../components/ui/Sidebar";
import Icon from "../components/AppIcon";
import Button from "../components/ui/Button";
import BreadcrumbNavigation from "../components/ui/BreadcrumbNavigation";
import { projectService } from "../services/projectService";
import useLocale from "../hooks/useLocale";

const ProjectDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const { formatPrice, formatDate } = useLocale();

    const fetchProject = async () => {
        setIsLoading(true);
        try {
            const responseData = await projectService.getById(id);
            const data = responseData?.data || responseData;

            if (data) {
                const assignedPeople = Array.isArray(data.assignedPeople) ? data.assignedPeople :
                    (typeof data.assignedPeople === 'string' ?
                        data.assignedPeople.replace(/[{}"]/g, "").split(",").map(p => p.trim()) : []);
                setProject({ ...data, assignedPeople });
            }
        } catch (err) {
            console.error("Error fetching project:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchProject();
    }, [id]);

    const breadcrumbItems = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Projects', path: '/projects' },
        { label: 'Project Details', path: `/project-details/${id}` },
    ];

    if (isLoading) return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
            <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pt-16 flex items-center justify-center h-[70vh]`}>
                <div className="text-center">
                    <Icon name="Loader2" size={40} className="animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">Crunching project data...</p>
                </div>
            </main>
        </div>
    );

    if (!project) return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center flex-col p-6">
            <Icon name="AlertCircle" size={64} className="text-error mb-4" />
            <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
            <p className="text-muted-foreground mb-6 text-center max-w-md">We couldn't find the project you're looking for. It may have been deleted or moved.</p>
            <Button onClick={() => navigate("/projects")} variant="primary">Return to Projects</Button>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />

            <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pt-16 pb-20 lg:pb-6`}>
                <div className="p-6 max-w-6xl mx-auto">
                    <BreadcrumbNavigation items={breadcrumbItems} />

                    <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
                        <div>
                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 mb-3">
                                {project.phase}
                            </div>
                            <h1 className="text-4xl font-extrabold text-foreground tracking-tight">{project.projectName}</h1>
                            <p className="text-muted-foreground mt-2 flex items-center"><Icon name="User" size={16} className="mr-2" /> Client: <span className="font-semibold text-foreground ml-1">{project.clientName}</span></p>
                        </div>
                        <div className="flex space-x-3">
                            <Button variant="outline" onClick={() => navigate(`/edit-project/${id}`)} iconName="Edit">Edit Project</Button>
                            <Button variant="ghost" onClick={() => navigate("/projects")} iconName="ArrowLeft">All Projects</Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Key Metrics */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-border bg-muted/20">
                                    <h3 className="text-lg font-bold flex items-center"><Icon name="Info" size={18} className="mr-2 text-primary" /> Core Information</h3>
                                </div>
                                <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <DetailItem label="Client Email" value={project.clientEmail} icon="Mail" />
                                    <DetailItem label="Client Contact" value={project.contactInfo} icon="Phone" />
                                    <DetailItem label="Starting Date" value={formatDate(project.assigningDate)} icon="Calendar" />
                                    <DetailItem label="Completion Deadline" value={formatDate(project.deadline)} icon="Clock" valueClass="text-error font-bold" />

                                    <div className="sm:col-span-2 space-y-4 pt-4">
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center">
                                            <Icon name="ExternalLink" size={14} className="mr-2" /> Project Assets
                                        </h4>
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            {project.githubLink && (
                                                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex-1 p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-all group">
                                                    <div className="flex items-center gap-3">
                                                        <Icon name="Github" size={24} className="text-foreground group-hover:text-primary transition-colors" />
                                                        <div>
                                                            <div className="text-xs font-bold uppercase text-muted-foreground mb-0.5">Source Repository</div>
                                                            <div className="text-sm font-medium text-foreground truncate max-w-[200px]">{project.githubLink}</div>
                                                        </div>
                                                    </div>
                                                </a>
                                            )}
                                            {project.deploymentLink && (
                                                <a href={project.deploymentLink} target="_blank" rel="noopener noreferrer" className="flex-1 p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-all group">
                                                    <div className="flex items-center gap-3">
                                                        <Icon name="Activity" size={24} className="text-success group-hover:scale-110 transition-transform" />
                                                        <div>
                                                            <div className="text-xs font-bold uppercase text-muted-foreground mb-0.5">Live Environment</div>
                                                            <div className="text-sm font-medium text-foreground truncate max-w-[200px]">{project.deploymentLink}</div>
                                                        </div>
                                                    </div>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Sidebar Panels */}
                        <div className="space-y-8">
                            {/* Financial Summary */}
                            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-border bg-muted/20">
                                    <h3 className="text-lg font-bold flex items-center"><Icon name="DollarSign" size={18} className="mr-2 text-success" /> Financials</h3>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div>
                                        <div className="text-xs font-bold text-muted-foreground uppercase mb-1">Total Project Value</div>
                                        <div className="text-2xl font-black text-foreground">{formatPrice(project.totalPayment)}</div>
                                    </div>

                                    <div className="bg-muted/30 p-4 rounded-xl border border-border">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-bold text-muted-foreground uppercase">Payment Progress</span>
                                            <span className="text-xs font-black text-success">
                                                {Math.round((project.paymentReceived / project.totalPayment) * 100)}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden border border-border mb-3">
                                            <div
                                                className="bg-success h-full transition-all duration-1000"
                                                style={{ width: `${(project.paymentReceived / project.totalPayment) * 100}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Received:</span>
                                            <span className="font-bold text-foreground">{formatPrice(project.paymentReceived)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm mt-1">
                                            <span className="text-muted-foreground">Outstanding:</span>
                                            <span className="font-bold text-error">{formatPrice(project.totalPayment - project.paymentReceived)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Team */}
                            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-border bg-muted/20">
                                    <h3 className="text-lg font-bold flex items-center"><Icon name="Users" size={18} className="mr-2 text-primary" /> Active Team</h3>
                                </div>
                                <div className="p-6">
                                    <div className="flex flex-col gap-3">
                                        {project.assignedPeople.map((person, idx) => (
                                            <div key={idx} className="flex items-center p-3 rounded-xl bg-muted/30 border border-border hover:border-primary/30 transition-colors">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm mr-3">
                                                    {person[0]?.toUpperCase()}
                                                </div>
                                                <div className="font-medium text-foreground">{person}</div>
                                            </div>
                                        ))}
                                        {project.assignedPeople.length === 0 && (
                                            <p className="text-center text-muted-foreground italic py-4">No team members assigned yet.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const DetailItem = ({ label, value, icon, valueClass = "" }) => (
    <div className="flex items-start space-x-3">
        <div className="mt-1 text-muted-foreground">
            <Icon name={icon} size={20} />
        </div>
        <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
            <p className={`font-semibold text-foreground ${valueClass}`}>{value || "---"}</p>
        </div>
    </div>
);

export default ProjectDetails;

