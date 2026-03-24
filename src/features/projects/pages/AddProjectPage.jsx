import React, { useState } from "react";
import Header from "../../../components/ui/Header";
import Sidebar from "../../../components/ui/Sidebar";
import { useNavigate } from "react-router-dom";
import { useProjectStore } from "features/projects";
import useAuthStore from "../../../store/useAuthStore";
import BreadcrumbNavigation from "../../../components/ui/BreadcrumbNavigation";
import { ImCross } from "react-icons/im";
import { IoMdAddCircle } from "react-icons/io"; // Added for the + icon


const AddProject = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createProject } = useProjectStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Added state to handle additional project names for the same client
  const [extraProjects, setExtraProjects] = useState([]);

  const [formData, setFormData] = useState({
    projectName: [],
    phase: "Planning",
    assigningDate: "",
    deadline: "",
    assignedPeople: "",

    clientName: "",
    clientEmail: "",
    contactInfo: "",
    clientDetails: {
      companyName: "",
      clientAddress: "",
      clientWebsite: ""
    },

    links: {
      github: "",
      deployment: "",
      figma: "",
      drive: "",
      documentation: ""
    },

    totalPayment: "",
    paymentReceived: "",

    tasks: [
      { taskName: "", assignedTo: "", status: "Pending" }
    ],

    notes: ""
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  // Functions for handling extra projects under Step 2
  const addExtraProjectField = () => {
    setExtraProjects([...extraProjects, ""]);
  };

  const handleExtraProjectChange = (index, value) => {
    const updated = [...extraProjects];
    updated[index] = value;
    setExtraProjects(updated);
  };

  const removeExtraProjectField = (index) => {
    const updated = extraProjects.filter((_, i) => i !== index);
    setExtraProjects(updated);
  };

  const handleTaskChange = (index, field, value) => {
    const updated = [...formData.tasks];
    updated[index][field] = value;
    setFormData({ ...formData, tasks: updated });
  };

  const addTask = () => {
    setFormData((prev) => ({
      ...prev,
      tasks: [...prev.tasks, { taskName: "", assignedTo: "", status: "Pending" }]
    }));
  };

  const removeTask = (index) => {
    const updated = [...formData.tasks];
    updated.splice(index, 1);
    setFormData({ ...formData, tasks: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // If your backend handles bulk creation, you can map through extraProjects here.
      // For now, this payload handles the primary project.
      const payload = {
        ...formData,
        additionalProjects: extraProjects, // Passing the list of other projects
        companyId: user?.company?.id,
        totalPayment: Number(formData.totalPayment),
        paymentReceived: Number(formData.paymentReceived),
        assignedPeople: formData.assignedPeople.split(",").map((p) => p.trim()),
      };

      await createProject(payload, user?.company?.id);
      alert("Project(s) Added Successfully!");
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
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pt-16 pb-20 lg:pb-6`}>
        <div className="p-6">
          <BreadcrumbNavigation items={breadcrumbItems} />

          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold">Step {step}: {
                step === 1 ? "Basic Information" :
                  step === 2 ? "Client & Team" :
                    step === 3 ? "Links & Finance" :
                      step === 4 ? "Project Tasks" : "Final Review & Notes"
              }</h1>
              <p className="text-muted-foreground mt-2">Fill in the details to create your CRM project</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-card p-8 rounded-xl border border-border shadow-sm">

              {/* STEP 1: PROJECT INFO & TIMELINE */}
              {/* STEP 1: PROJECT INFO & TIMELINE */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <SectionTitle title="Project Information" />

                  <div className="space-y-4">
                    <Grid2>
                      {/* Primary Project Field */}
                      <InputField
                        label="Project Name : 1 (Primary)"
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleChange}
                        placeholder="Enter project title"
                      />
                      <SelectField
                        label="Project Phase"
                        name="phase"
                        value={formData.phase}
                        onChange={handleChange}
                        options={["Planning", "Development", "Testing", "Deployment", "Completed"]}
                      />
                    </Grid2>

                    {/* Show Extra Projects here too so they don't disappear */}
                    {extraProjects.map((proj, index) => (
                      <Grid2 key={index} className="animate-in slide-in-from-top-2">
                        <div className="flex gap-2 items-end">
                          <div className="flex-1">
                            <InputField
                              label={`Project Name : ${index + 2}`}
                              value={proj}
                              onChange={(e) => handleExtraProjectChange(index, e.target.value)}
                              placeholder="Additional project title"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeExtraProjectField(index)}
                            className="p-2 mb-1 text-red-500 hover:bg-red-50 rounded-md"
                          >
                            <ImCross size={14} />
                          </button>
                        </div>
                        {/* Optional: Add individual phase if needed, or keep shared */}
                        <div className="hidden md:block"></div>
                      </Grid2>
                    ))}
                  </div>

                  <SectionTitle title="Timeline" />
                  <Grid2>
                    <InputField label="Assigning Date" type="date" name="assigningDate" value={formData.assigningDate} onChange={handleChange} />
                    <InputField label="Deadline" type="date" name="deadline" value={formData.deadline} onChange={handleChange} />
                  </Grid2>
                </div>
              )}

              {/* STEP 2: CLIENT DETAILS & TEAM - MODIFIED */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="flex justify-between items-center border-b pb-2">
                    <SectionTitle title="Client Details" />
                    <button
                      type="button"
                      onClick={addExtraProjectField}
                      className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-all"
                    >
                      <IoMdAddCircle size={22} />
                      Add Another Project for this Client
                    </button>
                  </div>

                  <Grid3>
                    <InputField label="Client Name" name="clientName" value={formData.clientName} onChange={handleChange} />
                    <InputField label="Client Email" name="clientEmail" value={formData.clientEmail} onChange={handleChange} />
                    <InputField label="Phone/Contact" name="contactInfo" value={formData.contactInfo} onChange={handleChange} />
                  </Grid3>

                  {/* Render extra project fields if any */}
                  {extraProjects.length > 0 && (
                    <div className="p-4 bg-muted/20 rounded-lg space-y-4">
                      <p className="text-xs font-bold text-muted-foreground uppercase">Additional Projects</p>
                      {extraProjects.map((proj, index) => (
                        <div key={index} className="flex gap-3 items-end animate-in slide-in-from-left-2">
                          <div className="flex-1">
                            <InputField
                              label={`Project Name : ${index + 2}`}
                              value={proj}
                              onChange={(e) => handleExtraProjectChange(index, e.target.value)}
                              placeholder="e.g. Mobile App Development"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeExtraProjectField(index)}
                            className="p-2 mb-1 text-red-500 hover:bg-red-50 rounded-md"
                          >
                            <ImCross size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <Grid2>
                    <InputField label="Company Name" value={formData.clientDetails.companyName} onChange={(e) => handleNestedChange("clientDetails", "companyName", e.target.value)} />
                    <InputField label="Client Website" value={formData.clientDetails.clientWebsite} onChange={(e) => handleNestedChange("clientDetails", "clientWebsite", e.target.value)} />
                  </Grid2>
                  <InputField label="Client Address" value={formData.clientDetails.clientAddress} onChange={(e) => handleNestedChange("clientDetails", "clientAddress", e.target.value)} />

                  <SectionTitle title="Team Assignment" />
                  <InputField label="Assigned People (Comma separated)" name="assignedPeople" value={formData.assignedPeople} onChange={handleChange} placeholder="e.g. Ram, Shyam" />
                </div>
              )}

              {/* STEP 3: LINKS & FINANCE */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <SectionTitle title="Project Links (Resources)" />
                  <Grid2>
                    <InputField label="GitHub Repository" value={formData.links.github} onChange={(e) => handleNestedChange("links", "github", e.target.value)} />
                    <InputField label="Live Deployment" value={formData.links.deployment} onChange={(e) => handleNestedChange("links", "deployment", e.target.value)} />
                    <InputField label="Figma Design" value={formData.links.figma} onChange={(e) => handleNestedChange("links", "figma", e.target.value)} />
                    <InputField label="Google Drive / Assets" value={formData.links.drive} onChange={(e) => handleNestedChange("links", "drive", e.target.value)} />
                  </Grid2>
                  <InputField label="Documentation Link" value={formData.links.documentation} onChange={(e) => handleNestedChange("links", "documentation", e.target.value)} />

                  <SectionTitle title="Finance" />
                  <Grid2>
                    <InputField label="Total Budget" type="number" name="totalPayment" value={formData.totalPayment} onChange={handleChange} />
                    <InputField label="Initial Payment Received" type="number" name="paymentReceived" value={formData.paymentReceived} onChange={handleChange} />
                  </Grid2>
                </div>
              )}

              {/* STEP 4: TASKS */}
              {step === 4 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <SectionTitle title="Tasks Management" />
                  {formData.tasks.map((task, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-muted/30 space-y-4">
                      <Grid3>
                        <InputField label="Task Name" value={task.taskName} onChange={(e) => handleTaskChange(index, "taskName", e.target.value)} />
                        <InputField label="Assign To" value={task.assignedTo} onChange={(e) => handleTaskChange(index, "assignedTo", e.target.value)} />
                        <div className="flex items-end gap-2">
                          <SelectField label="Status" value={task.status} onChange={(e) => handleTaskChange(index, "status", e.target.value)} options={["Pending", "In Progress", "Completed"]} />
                          <button type="button" onClick={() => removeTask(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-md">
                            <ImCross size={18} />
                          </button>
                        </div>
                      </Grid3>
                    </div>
                  ))}
                  <button type="button" onClick={addTask} className="text-primary font-medium hover:underline text-sm">
                    + Add New Task
                  </button>
                </div>
              )}

              {/* STEP 5: NOTES & SUBMIT */}
              {step === 5 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <SectionTitle title="Final Notes & Remarks" />
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full border border-input rounded-md p-4 bg-background focus:ring-2 focus:ring-primary outline-none min-h-[150px]"
                    rows="6"
                    placeholder="Enter any specific instructions or internal notes here..."
                  />
                  <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700">
                    <strong>Summary:</strong> You are about to create <strong>{formData.projectName || "a new project"}</strong> {extraProjects.length > 0 && `and ${extraProjects.length} additional projects`} for this client.
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-8 border-t">
                <button
                  type="button"
                  onClick={step === 1 ? () => navigate("/projects") : prevStep}
                  className="px-6 py-2 border rounded-lg hover:bg-accent transition-colors"
                >
                  {step === 1 ? "Cancel" : "Back"}
                </button>

                {step < 5 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-primary text-white px-8 py-2 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 text-white px-8 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Creating..." : "Finish & Create Project"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

// UI Components
const SectionTitle = ({ title }) => (
  <h2 className="text-lg font-bold text-foreground/80 uppercase tracking-wider mb-4">{title}</h2>
);

const Grid2 = ({ children }) => <div className="grid md:grid-cols-2 gap-6">{children}</div>;
const Grid3 = ({ children }) => <div className="grid md:grid-cols-3 gap-6">{children}</div>;

const InputField = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-muted-foreground">{label}</label>
    <input {...props} className="w-full border border-input rounded-md px-3 py-2 bg-background focus:border-primary outline-none transition-all" />
  </div>
);

const SelectField = ({ label, options, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-muted-foreground">{label}</label>
    <select {...props} className="w-full border border-input rounded-md px-3 py-2 bg-background focus:border-primary outline-none cursor-pointer">
      <option value="">Select {label}</option>
      {options.map((o, i) => <option key={i} value={o}>{o}</option>)}
    </select>
  </div>
);

export default AddProject;