import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "components/ui/Sidebar";
import Header from "components/ui/Header";

const ProjectDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProject = async () => {
        try {
            const res = await axios.get(`http://localhost:5001/add-projects/${id}`);
            // Parse assignedPeople from backend string to array
            const assignedPeople = res.data.data.assignedPeople
                ? res.data.data.assignedPeople.replace(/[{}"]/g, "").split(",")
                : [];
            setProject({ ...res.data.data, assignedPeople });
        } catch (err) {
            console.error("Error fetching project:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProject();
    }, [id]);

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

    if (!project) return <div className="p-10 text-center text-gray-600">No project found</div>;

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-64">
                <Header />

                <div className="flex justify-center mt-24 p-6">
                    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-10">
                        <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">
                            Project Details
                        </h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                            <Detail label="Project Name" value={project.projectName} />
                            <Detail label="Client Name" value={project.clientName} />
                            <Detail label="Contact Info" value={project.contactInfo} />
                            <Detail label="Email" value={project.clientEmail} />
                            <Detail label="Phase" value={project.phase} />
                            <Detail label="Deadline" value={project.deadline} />
                            <Detail label="Assigning Date" value={project.assigningDate} />
                            <Detail label="Payment Received" value={`₹${project.paymentReceived}`} />
                            <Detail label="Total Payment" value={`₹${project.totalPayment}`} />

                            <div className="md:col-span-2">
                                <p className="text-sm text-gray-500 font-medium mb-1">GitHub Link</p>
                                <a
                                    href={project.githubLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline break-all"
                                >
                                    {project.githubLink}
                                </a>
                            </div>

                            <div className="md:col-span-2">
                                <p className="text-sm text-gray-500 font-medium mb-1">Deployment Link</p>
                                <a
                                    href={project.deploymentLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline break-all"
                                >
                                    {project.deploymentLink}
                                </a>
                            </div>

                            <div className="md:col-span-2">
                                <p className="text-sm text-gray-500 font-medium mb-2">Team Members</p>
                                <div className="flex flex-wrap gap-2">
                                    {project.assignedPeople.map((person, idx) => (
                                        <span
                                            key={idx}
                                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                        >
                                            {person.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={() => navigate("/projects")}
                                className="bg-blue-500 px-6 py-2 rounded transition text-white"
                            >
                                Back to Projects
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Detail = ({ label, value }) => (
    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <p className="font-semibold text-gray-800">{value || "-"}</p>
    </div>
);

export default ProjectDetails;
