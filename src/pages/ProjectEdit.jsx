import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "components/ui/Header";
import Sidebar from "components/ui/Sidebar";

const ProjectEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

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

    // Fetch existing project details
    const fetchProject = async () => {
        try {
            const res = await axios.get(`http://localhost:5001/add-projects/${id}`);
            const data = res.data.data;

            // Parse assignedPeople string to comma-separated
            const assignedPeople = data.assignedPeople
                ? data.assignedPeople.replace(/["{}]/g, "").split(",").join(", ")
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

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProject({ ...project, [name]: value });
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Convert assignedPeople back to array for backend
            const payload = {
                ...project,
                assignedPeople: project.assignedPeople
                    .split(",")
                    .map((p) => p.trim()),
            };

            await axios.put(`http://localhost:5001/add-projects/${id}`, payload);
            alert("Project updated successfully!");
            navigate("/projects");
        } catch (err) {
            console.error("Error updating project:", err);
            alert("Failed to update project.");
        }
    };

    if (loading) return (
        <div className="flex bg-gray-100 min-h-screen">
            <Sidebar />

            <div className="flex-1 ml-64">
                <Header />

                <div className="flex flex-col items-center justify-center h-[70vh]">
                    {/* Spinner */}
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

                    <p className="mt-4 text-gray-600 font-medium">
                        Loading project details...
                    </p>
                </div>
            </div>
        </div>
    );


    return (
        <div className="flex bg-gray-100 min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-64">
                <Header />

                <div className="max-w-4xl mx-auto p-6 mt-20 bg-white rounded-2xl shadow">
                    <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">Edit Project</h1>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                        <div className="flex justify-center mt-6">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                            >
                                Update Project
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Reusable input field component
const InputField = ({ label, name, value, onChange, type = "text", placeholder }) => (
    <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            className="p-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />
    </div>
);

export default ProjectEdit;
