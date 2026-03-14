import React, { useState } from "react";
import Header from "../../../components/ui/Header";
import Sidebar from "../../../components/ui/Sidebar";
import { useNavigate } from "react-router-dom";
import { useProjectStore } from "..";
import useAuthStore from "../../../store/useAuthStore";
import BreadcrumbNavigation from "../../../components/ui/BreadcrumbNavigation";

const AddProject = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createProject } = useProjectStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [formData, setFormData] = useState({
    projectName: "",
    githubLink: "",
    clientName: "",
    contactInfo: "",
    clientEmail: "",
    deadline: "",
    phase: "",
    assigningDate: "",
    deploymentLink: "",
    totalPayment: "",
    paymentReceived: "",
    assignedPeople: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        companyId: user?.company?.id,
        totalPayment: Number(formData.totalPayment),
        paymentReceived: Number(formData.paymentReceived),
        assignedPeople: formData.assignedPeople
          .split(",")
          .map((person) => person.trim()),
      };

      await createProject(payload, user?.company?.id);

      alert("Project Added Successfully!");
      navigate("/projects");
    } catch (error) {
      console.error(error);
      alert("Error adding project");
    }
    setLoading(false);
  };

  const breadcrumbItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Projects", path: "/projects" },
    { label: "Add Project", path: "/add-project" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pt-16 pb-20 lg:pb-6`}>
        <div className="p-6">
          <BreadcrumbNavigation items={breadcrumbItems} />
          
          <div className="max-w-4xl mx-auto">
             <div className="mb-8">
              <h1 className="text-3xl font-semibold text-foreground mb-2 text-center">Add New Project</h1>
              <p className="text-muted-foreground text-center">Fill in the details to create a new project for your company.</p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-card shadow-lg rounded-2xl p-8 space-y-6 border border-border"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Project Name"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  placeholder="Enter project name"
                />
                <InputField
                  label="GitHub Link"
                  name="githubLink"
                  value={formData.githubLink}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputField
                  label="Client Name"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  placeholder="Client name"
                />
                <InputField
                  label="Contact Info"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleChange}
                  placeholder="Phone"
                />
                <InputField
                  label="Client Email"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleChange}
                  placeholder="Email"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                />
                <SelectField
                  label="Phase"
                  name="phase"
                  value={formData.phase}
                  onChange={handleChange}
                  options={["Planning", "Development", "Testing", "Deployment", "Completed"]}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Assigning Date"
                  name="assigningDate"
                  type="date"
                  value={formData.assigningDate}
                  onChange={handleChange}
                />
                <InputField
                  label="Deployment Link"
                  name="deploymentLink"
                  value={formData.deploymentLink}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Total Payment"
                  name="totalPayment"
                  type="number"
                  value={formData.totalPayment}
                  onChange={handleChange}
                  placeholder="Total payment"
                />
                <InputField
                  label="Payment Received"
                  name="paymentReceived"
                  type="number"
                  value={formData.paymentReceived}
                  onChange={handleChange}
                  placeholder="Amount received"
                />
              </div>

              <div>
                <InputField
                  label="Assign People"
                  name="assignedPeople"
                  value={formData.assignedPeople}
                  onChange={handleChange}
                  placeholder="Enter team members, comma separated"
                />
              </div>

              <div className="pt-4 flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={() => navigate("/projects")}
                  className="px-8 py-2 border border-border rounded-lg font-semibold hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground px-8 py-2 rounded-lg font-semibold shadow hover:bg-primary/90 transition-colors"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, placeholder, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium text-muted-foreground mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      required
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-muted-foreground mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      required
    >
      <option value="">Select {label}</option>
      {options.map((opt, idx) => (
        <option key={idx} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default AddProject;
