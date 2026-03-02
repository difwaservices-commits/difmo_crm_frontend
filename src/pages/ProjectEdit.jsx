import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/ui/Header";
import Sidebar from "../components/ui/Sidebar";
import Icon from "../components/AppIcon";
import Button from "../components/ui/Button";
import BreadcrumbNavigation from "../components/ui/BreadcrumbNavigation";
import { projectService } from "../services/projectService";

const ProjectEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const [formData, setFormData] = useState({
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
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchProject = async () => {
        setIsLoading(true);
        try {
            const responseData = await projectService.getById(id);
            const data = responseData?.data || responseData;

            if (data) {
                // Formatting dates for HTML inputs
                const formatDateS = (d) => d ? new Date(d).toISOString().split('T')[0] : "";

                // Parse assignedPeople to string
                const assignedPeople = Array.isArray(data.assignedPeople) ? data.assignedPeople.join(", ") :
                    (typeof data.assignedPeople === 'string' ? data.assignedPeople.replace(/[{}"]/g, "") : "");

                setFormData({
                    ...data,
                    assignedPeople,
                    assigningDate: formatDateS(data.assigningDate),
                    deadline: formatDateS(data.deadline)
                });
            }
        } catch (err) {
            console.error("Error fetching project:", err);
            alert("Failed to load project details.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchProject();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const payload = {
                ...formData,
                totalPayment: Number(formData.totalPayment),
                paymentReceived: Number(formData.paymentReceived),
                assignedPeople: formData.assignedPeople
                    .split(",")
                    .map((p) => p.trim())
                    .filter(p => p !== ""),
            };

            await projectService.update(id, payload);
            alert("Project updated successfully!");
            navigate("/projects");
        } catch (err) {
            console.error("Error updating project:", err);
            alert("Failed to update project: " + (err.response?.data?.message || err.message));
        } finally {
            setIsSaving(false);
        }
    };

    const breadcrumbItems = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Projects', path: '/projects' },
        { label: 'Edit Project', path: `/edit-project/${id}` },
    ];

    if (isLoading) return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
            <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pt-16 flex items-center justify-center h-[70vh]`}>
                <div className="text-center">
                    <Icon name="Loader2" size={40} className="animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">Loading project details...</p>
                </div>
            </main>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />

            <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pt-16 pb-20 lg:pb-6`}>
                <div className="p-6 max-w-4xl mx-auto">
                    <BreadcrumbNavigation items={breadcrumbItems} />

                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground flex items-center">
                                <Icon name="Edit" size={28} className="mr-3 text-warning" />
                                Edit Project
                            </h1>
                            <p className="text-muted-foreground mt-1 ml-10">Modify project parameters and details</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-8 space-y-8">
                            {/* General Section */}
                            <section>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2 mb-4">Project Overview</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField
                                        label="Project Name"
                                        name="projectName"
                                        value={formData.projectName}
                                        onChange={handleChange}
                                        icon="Folder"
                                        required
                                    />
                                    <InputField
                                        label="GitHub Link"
                                        name="githubLink"
                                        value={formData.githubLink}
                                        onChange={handleChange}
                                        icon="Github"
                                    />
                                </div>
                            </section>

                            {/* Client Section */}
                            <section>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2 mb-4">Client Contact</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <InputField
                                        label="Client Name"
                                        name="clientName"
                                        value={formData.clientName}
                                        onChange={handleChange}
                                        icon="User"
                                        required
                                    />
                                    <InputField
                                        label="Client Email"
                                        name="clientEmail"
                                        value={formData.clientEmail}
                                        onChange={handleChange}
                                        icon="Mail"
                                        type="email"
                                    />
                                    <InputField
                                        label="Contact Info"
                                        name="contactInfo"
                                        value={formData.contactInfo}
                                        onChange={handleChange}
                                        icon="Phone"
                                    />
                                </div>
                            </section>

                            {/* Execution Section */}
                            <section>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2 mb-4">Timeline & Deployment</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <InputField
                                        label="Assigning Date"
                                        name="assigningDate"
                                        type="date"
                                        value={formData.assigningDate}
                                        onChange={handleChange}
                                        icon="Calendar"
                                    />
                                    <InputField
                                        label="Deadline"
                                        name="deadline"
                                        type="date"
                                        value={formData.deadline}
                                        onChange={handleChange}
                                        icon="Clock"
                                    />
                                    <SelectField
                                        label="Phase / Status"
                                        name="phase"
                                        value={formData.phase}
                                        onChange={handleChange}
                                        options={["Planning", "Development", "Testing", "Deployment", "Completed"]}
                                        icon="Activity"
                                    />
                                </div>
                                <div className="mt-6">
                                    <InputField
                                        label="Deployment Link"
                                        name="deploymentLink"
                                        value={formData.deploymentLink}
                                        onChange={handleChange}
                                        icon="ExternalLink"
                                    />
                                </div>
                            </section>

                            {/* Payment Section */}
                            <section>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2 mb-4">Financial Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField
                                        label="Total Cost"
                                        name="totalPayment"
                                        type="number"
                                        value={formData.totalPayment}
                                        onChange={handleChange}
                                        icon="DollarSign"
                                    />
                                    <InputField
                                        label="Received to Date"
                                        name="paymentReceived"
                                        type="number"
                                        value={formData.paymentReceived}
                                        onChange={handleChange}
                                        icon="CheckCircle"
                                    />
                                </div>
                            </section>

                            {/* Team Section */}
                            <section>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2 mb-4">Team Management</h3>
                                <InputField
                                    label="Assigned Team Members"
                                    name="assignedPeople"
                                    value={formData.assignedPeople}
                                    onChange={handleChange}
                                    placeholder="Comma separated names"
                                    icon="Users"
                                />
                            </section>
                        </div>

                        <div className="p-8 bg-muted/20 border-t border-border flex flex-col sm:flex-row gap-4 justify-end">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => navigate("/projects")}
                                disabled={isSaving}
                            >
                                Cancel Changes
                            </Button>
                            <Button
                                type="submit"
                                isLoading={isSaving}
                                iconName="Save"
                            >
                                Update Project
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

const InputField = ({ label, name, value, onChange, type = "text", placeholder, icon, required }) => (
    <div className="space-y-1.5">
        <label className="text-sm font-semibold text-foreground flex items-center">
            {icon && <Icon name={icon} size={14} className="mr-2 text-muted-foreground" />}
            {label} {required && <span className="text-error mb-0.5">*</span>}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
            required={required}
        />
    </div>
);

const SelectField = ({ label, name, value, onChange, options, icon }) => (
    <div className="space-y-1.5">
        <label className="text-sm font-semibold text-foreground flex items-center">
            {icon && <Icon name={icon} size={14} className="mr-2 text-muted-foreground" />}
            {label}
        </label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm cursor-pointer"
        >
            {options.map((opt, idx) => (
                <option key={idx} value={opt}>{opt}</option>
            ))}
        </select>
    </div>
);

export default ProjectEdit;

