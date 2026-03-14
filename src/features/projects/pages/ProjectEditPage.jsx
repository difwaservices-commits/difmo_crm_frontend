import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../../api/client";
import { API_ENDPOINTS } from "../../../api/endpoints";
import Header from "../../../components/ui/Header";
import Sidebar from "../../../components/ui/Sidebar";
import BreadcrumbNavigation from "../../../components/ui/BreadcrumbNavigation";

const ProjectEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const [project, setProject] = useState({
        projectName: "",
        githubLink: "",
        clientName: "",
        clientEmail: "",
        contactInfo: "",
        deadline: "",
        phase: "",
        assigningDate: "",
        deploymentLink: "",
        totalPayment: "",
        paymentReceived: "",
        assignedPeople: "",
    });
    const [loading, setLoading] = useState(true);

    const fetchProject = async () => {
        try {
            const res = await apiClient.get(`${API_ENDPOINTS.PROJECTS.BASE}/${id}`);
            const data = res.data.data || res.data;

            const assignedPeople = data.assignedPeople
                ? (Array.isArray(data.assignedPeople) ? data.assignedPeople.join(", ") : data.assignedPeople.replace(/["{}]/g, "").split(",").join(", "))
                : "";

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProject({ ...project, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...project,
                assignedPeople: project.assignedPeople
                    .split(",")
                    .map((p) => p.trim()),
            };

            await apiClient.put(`${API_ENDPOINTS.PROJECTS.BASE}/${id}`, payload);
            alert("Project updated successfully!");
            navigate("/projects");
        } catch (err) {
            console.error("Error updating project:", err);
            alert("Failed to update project.");
        }
    };

    const breadcrumbItems = [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Projects", path: "/projects" },
        { label: "Edit Project", path: `/edit-project/${id}` }
    ];

    if (loading) return (
        <div className="min-h-screen bg-background text-foreground">
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

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
            <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pt-16 pb-20 lg:pb-6`}>
                <div className="p-6">
                    <BreadcrumbNavigation items={breadcrumbItems} />

                    <div className="max-w-4xl mx-auto mt-6">
                        <div className="bg-card rounded-2xl shadow-lg p-8 border border-border">
                            <h1 className="text-3xl font-bold mb-6 text-center text-foreground">Edit Project</h1>

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField
                                        label="Project Name"
                                        name="projectName"
                                        value={project.projectName}
                                        onChange={handleChange}
                                    />
                                    <InputField
                                        label="GitHub Link"
                                        name="githubLink"
                                        value={project.githubLink}
                                        onChange={handleChange}
                                    />
                                    <InputField
                                        label="Client Name"
                                        name="clientName"
                                        value={project.clientName}
                                        onChange={handleChange}
                                    />
                                    <InputField
                                        label="Contact Info"
                                        name="contactInfo"
                                        value={project.contactInfo}
                                        onChange={handleChange}
                                    />
                                    <InputField
                                        label="Email"
                                        name="clientEmail"
                                        value={project.clientEmail}
                                        onChange={handleChange}
                                    />
                                    <InputField
                                        label="Phase"
                                        name="phase"
                                        value={project.phase}
                                        onChange={handleChange}
                                    />
                                    <InputField
                                        label="Deadline"
                                        name="deadline"
                                        type="date"
                                        value={project.deadline}
                                        onChange={handleChange}
                                    />
                                    <InputField
                                        label="Assigning Date"
                                        name="assigningDate"
                                        type="date"
                                        value={project.assigningDate}
                                        onChange={handleChange}
                                    />
                                    <InputField
                                        label="Deployment Link"
                                        name="deploymentLink"
                                        value={project.deploymentLink}
                                        onChange={handleChange}
                                    />
                                    <InputField
                                        label="Total Payment"
                                        name="totalPayment"
                                        type="number"
                                        value={project.totalPayment}
                                        onChange={handleChange}
                                    />
                                    <InputField
                                        label="Payment Received"
                                        name="paymentReceived"
                                        type="number"
                                        value={project.paymentReceived}
                                        onChange={handleChange}
                                    />
                                    <InputField
                                        label="Assigned People"
                                        name="assignedPeople"
                                        value={project.assignedPeople}
                                        onChange={handleChange}
                                        placeholder="Comma separated team members"
                                    />
                                </div>

                                <div className="flex justify-center space-x-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/projects")}
                                        className="px-8 py-2 border border-border rounded-lg font-semibold hover:bg-muted transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-primary text-primary-foreground px-8 py-2 rounded-lg font-semibold hover:bg-primary/90 transition shadow"
                                    >
                                        Update Project
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const InputField = ({ label, name, value, onChange, type = "text", placeholder }) => (
    <div className="flex flex-col">
        <label className="text-sm font-medium text-muted-foreground mb-1">{label}</label>
        <input
            type={type}
            name={name}
            value={value || ""}
            placeholder={placeholder}
            onChange={onChange}
            className="p-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-ring text-foreground text-sm"
        />
    </div>
);

export default ProjectEdit;
