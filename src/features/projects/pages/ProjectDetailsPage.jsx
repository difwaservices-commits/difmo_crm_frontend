import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../../api/client";
import { API_ENDPOINTS } from "../../../api/endpoints";
import Sidebar from "../../../components/ui/Sidebar";
import Header from "../../../components/ui/Header";
import BreadcrumbNavigation from "../../../components/ui/BreadcrumbNavigation";

const ProjectDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const fetchProject = async () => {
        try {
            const res = await apiClient.get(`${API_ENDPOINTS.PROJECTS.BASE}/${id}`);
            const data = res.data.data || res.data;
            // Parse assignedPeople if it's a string
            let assignedPeople = data.assignedPeople;
            if (typeof assignedPeople === 'string') {
                assignedPeople = assignedPeople.replace(/[{}"]/g, "").split(",").map(p => p.trim());
            }
            setProject({ ...data, assignedPeople });
        } catch (err) {
            console.error("Error fetching project:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProject();
    }, [id]);

    const breadcrumbItems = [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Projects", path: "/projects" },
        { label: "Project Details", path: `/project-details/${id}` }
    ];

    if (loading) return (
        <div className="min-h-screen bg-background">
            <Header />
            <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
            <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pt-16 pb-20 lg:pb-6`}>
                <div className="p-6 flex flex-col items-center justify-center h-[70vh]">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-muted-foreground font-medium">Loading project details...</p>
                </div>
            </main>
        </div>
    );

    if (!project) return <div className="p-10 text-center text-muted-foreground">No project found</div>;

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
            <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pt-16 pb-20 lg:pb-6`}>
                <div className="p-6">
                    <BreadcrumbNavigation items={breadcrumbItems} />

                    <div className="max-w-4xl mx-auto mt-6">
                        <div className="bg-card rounded-2xl shadow-lg p-8 border border-border">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h1 className="text-3xl font-bold text-foreground mb-2">{project.projectName}</h1>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        project.phase === 'Completed' ? 'bg-green-100 text-green-700' :
                                        project.phase === 'Development' ? 'bg-blue-100 text-blue-700' :
                                        'bg-muted text-muted-foreground'
                                    }`}>
                                        {project.phase}
                                    </span>
                                </div>
                                <button
                                    onClick={() => navigate(`/edit-project/${id}`)}
                                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition"
                                >
                                    Edit Project
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-foreground">
                                <Detail label="Client Name" value={project.clientName} />
                                <Detail label="Contact Info" value={project.contactInfo} />
                                <Detail label="Email" value={project.clientEmail} />
                                <Detail label="Deadline" value={project.deadline} />
                                <Detail label="Assigning Date" value={project.assigningDate} />
                                <Detail label="Total Payment" value={`₹${project.totalPayment}`} />
                                <Detail label="Payment Received" value={`₹${project.paymentReceived}`} />

                                <div className="md:col-span-2">
                                    <p className="text-sm text-muted-foreground font-medium mb-1">GitHub Link</p>
                                    <a
                                        href={project.githubLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline break-all"
                                    >
                                        {project.githubLink || "N/A"}
                                    </a>
                                </div>

                                <div className="md:col-span-2">
                                    <p className="text-sm text-muted-foreground font-medium mb-1">Deployment Link</p>
                                    <a
                                        href={project.deploymentLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline break-all"
                                    >
                                        {project.deploymentLink || "N/A"}
                                    </a>
                                </div>

                                <div className="md:col-span-2">
                                    <p className="text-sm text-muted-foreground font-medium mb-2">Team Members</p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.assignedPeople && project.assignedPeople.length > 0 ? (
                                            project.assignedPeople.map((person, idx) => (
                                                <span
                                                    key={idx}
                                                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                                                >
                                                    {person}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-muted-foreground italic text-sm">No members assigned</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 flex justify-center">
                                <button
                                    onClick={() => navigate("/projects")}
                                    className="px-6 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition"
                                >
                                    Back to Projects
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const Detail = ({ label, value }) => (
    <div className="bg-muted/30 p-4 rounded-lg border border-border">
        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">{label}</p>
        <p className="font-medium text-foreground">{value || "-"}</p>
    </div>
);

export default ProjectDetails;
