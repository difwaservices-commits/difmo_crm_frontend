import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/ui/Header";
import Sidebar from "../components/ui/Sidebar";
import Icon from "../components/AppIcon";
import Button from "../components/ui/Button";
import BreadcrumbNavigation from "../components/ui/BreadcrumbNavigation";
import { projectService } from "../services/projectService";
import useAuthStore from "../store/useAuthStore";

const AddProject = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [formData, setFormData] = useState({
    projectName: "",
    githubLink: "",
    clientName: "",
    contactInfo: "",
    clientEmail: "",
    deadline: "",
    phase: "Planning",
    assigningDate: new Date().toISOString().split('T')[0],
    deploymentLink: "",
    totalPayment: "",
    paymentReceived: "0",
    assignedPeople: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const companyId = user?.company?.id || user?.companyId;
    if (!companyId) {
      alert("Error: Company mapping not found. Please relogin.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        companyId,
        totalPayment: Number(formData.totalPayment),
        paymentReceived: Number(formData.paymentReceived),
        assignedPeople: formData.assignedPeople
          .split(",")
          .map((person) => person.trim())
          .filter(p => p !== ""),
      };

      await projectService.create(payload);

      alert("Project Added Successfully!");
      navigate("/projects");
    } catch (error) {
      console.error(error);
      alert("Error adding project: " + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Projects', path: '/projects' },
    { label: 'Add Project', path: '/add-project' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pt-16 pb-20 lg:pb-6`}>
        <div className="p-6 max-w-4xl mx-auto">
          <BreadcrumbNavigation items={breadcrumbItems} />

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground flex items-center">
              <Icon name="FolderPlus" size={28} className="mr-3 text-primary" />
              Add New Project
            </h1>
            <p className="text-muted-foreground mt-1 ml-10">Define the scope and details of your new initiative</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 space-y-8">
              {/* Section 1: Core Project Info */}
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2 mb-4">Project Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Project Name"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleChange}
                    placeholder="E.g., Cloud Portal Rebrand"
                    icon="Folder"
                    required
                  />
                  <InputField
                    label="GitHub Link"
                    name="githubLink"
                    value={formData.githubLink}
                    onChange={handleChange}
                    placeholder="https://github.com/company/repo"
                    icon="Github"
                  />
                </div>
              </section>

              {/* Section 2: Client Details */}
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2 mb-4">Client Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <InputField
                    label="Client Name"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    placeholder="Acme Corp"
                    icon="User"
                    required
                  />
                  <InputField
                    label="Client Email"
                    name="clientEmail"
                    value={formData.clientEmail}
                    onChange={handleChange}
                    placeholder="client@acme.com"
                    icon="Mail"
                    type="email"
                  />
                  <InputField
                    label="Phone/Contact"
                    name="contactInfo"
                    value={formData.contactInfo}
                    onChange={handleChange}
                    placeholder="+1 234 567 890"
                    icon="Phone"
                  />
                </div>
              </section>

              {/* Section 3: Timeline & Status */}
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2 mb-4">Timeline & Execution</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <InputField
                    label="Start Date"
                    name="assigningDate"
                    type="date"
                    value={formData.assigningDate}
                    onChange={handleChange}
                    icon="Calendar"
                    required
                  />
                  <InputField
                    label="Deadline"
                    name="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={handleChange}
                    icon="Calendar"
                    required
                  />
                  <SelectField
                    label="Status/Phase"
                    name="phase"
                    value={formData.phase}
                    onChange={handleChange}
                    options={["Planning", "Development", "Testing", "Deployment", "Completed"]}
                    icon="Activity"
                  />
                </div>
                <div className="mt-6">
                  <InputField
                    label="Deployment / Live Link"
                    name="deploymentLink"
                    value={formData.deploymentLink}
                    onChange={handleChange}
                    placeholder="https://app.company.com"
                    icon="ExternalLink"
                  />
                </div>
              </section>

              {/* Section 4: Budget */}
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2 mb-4">Financials (INR)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Total Project Value"
                    name="totalPayment"
                    type="number"
                    value={formData.totalPayment}
                    onChange={handleChange}
                    placeholder="50,000"
                    icon="DollarSign"
                    required
                  />
                  <InputField
                    label="Upfront/Received"
                    name="paymentReceived"
                    type="number"
                    value={formData.paymentReceived}
                    onChange={handleChange}
                    placeholder="10,000"
                    icon="CheckCircle"
                  />
                </div>
              </section>

              {/* Section 5: Team */}
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2 mb-4">Project Team</h3>
                <InputField
                  label="Team Members"
                  name="assignedPeople"
                  value={formData.assignedPeople}
                  onChange={handleChange}
                  placeholder="John Doe, Sarah Connor, Mike Smith (comma separated)"
                  icon="Users"
                />
              </section>
            </div>

            <div className="p-8 bg-muted/20 border-t border-border flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate("/projects")}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                iconName="Plus"
              >
                Create Project
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

// Input Component
const InputField = ({ label, name, value, onChange, placeholder, type = "text", icon, required }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-semibold text-foreground flex items-center">
      {icon && <Icon name={icon} size={14} className="mr-2 text-muted-foreground" />}
      {label} {required && <span className="text-error ml-0.5">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground/50"
      required={required}
    />
  </div>
);

// Select Component
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
      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none cursor-pointer shadow-sm"
      required
    >
      {options.map((opt, idx) => (
        <option key={idx} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default AddProject;

