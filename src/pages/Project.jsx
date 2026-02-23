import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "components/ui/Header";
import Sidebar from "components/ui/Sidebar";
import { FaTrash, FaEdit, FaEye, FaGithub } from "react-icons/fa";
import { MdEmail, MdContactPhone } from "react-icons/md";
import Filter from "components/Filter";


export default function Projects() {
  const [search, setSearch] = useState("");
  const [phase, setPhase] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const parsePeople = (str) => {
    if (!str) return [];

    return str
      .replace(/[{}"]/g, "")
      .split(",")
      .map((p) => p.trim());
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:5001/add-projects");

      const cleanData = res.data.data.map((p) => ({
        ...p,
        assignedPeople: parsePeople(p.assignedPeople),
      }));

      setProjects(cleanData);
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/add-projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  }

  const handleView = async (id) => {
    navigate(`/project-details/${id}`);
  }

  const handleEdit = async (id) => {
    navigate(`/edit-project/${id}`);
  }

  const filteredProjects = projects.filter((p) => {
    return (
      p.projectName.toLowerCase().includes(search.toLowerCase()) &&
      (phase === "" || p.phase === phase)
    );
  });

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 ml-64">
        <Header />

        <div className="p-8 bg-gray-50 min-h-screen mt-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Projects</h2>

            <button
              onClick={() => navigate("/add-project")}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              + Add Project
            </button>
          </div>

          {loading ? (
            <p>Loading projects...</p>
          ) : projects.length == 0 ? (<div className="text-center py-10 text-gray-500 font-semibold text-2xl">
            No Project
          </div>) : (
            <>
              <div className="overflow-x-auto bg-white rounded-xl shadow">

                <Filter
                  search={search}
                  setSearch={setSearch}
                  phase={phase}
                  setPhase={setPhase}
                />


                <table className="min-w-full">
                  <thead className="bg-gray-100 sticky">
                    <tr className="text-left text-sm font-semibold text-gray-700">
                      <th className="p-3 border text-blue-500">Project</th>
                      <th className="p-3 border text-blue-500">Client</th>
                      <th className="p-3 border text-blue-500">Deadline</th>
                      <th className="p-3 border text-blue-500">Phase</th>
                      <th className="p-3 border text-blue-500">Assigning Date</th>
                      <th className="p-3 border text-blue-500">Deployment</th>
                      <th className="p-3 border text-blue-500">Payment</th>
                      <th className="p-3 border text-blue-500">Team</th>
                      <th className="p-3 border text-blue-500">GitHub</th>
                      <th className="p-3 border text-blue-500">Email</th>
                      <th className="p-3 border text-blue-500">Contact</th>
                      <th className="p-3 border text-blue-500">Delete</th>
                      <th className="p-3 border text-blue-500">Edit</th>
                      <th className="p-3 border text-blue-500">View Details</th>
                    </tr>
                  </thead>

                  <tbody className="overflow-y-auto">
                    {filteredProjects.map((project) => (
                      <tr key={project.id} className="hover:bg-gray-50 text-sm">
                        <td className="p-3 border">{project.projectName}</td>

                        <td className="p-3 border">{project.clientName}</td>

                        <td className="p-3 border">{project.deadline}</td>

                        <td className="p-3 border">{project.phase}</td>

                        <td className="p-3 border">{project.assigningDate}</td>

                        <td className="p-3 border break-all">
                          {project.deploymentLink}
                        </td>

                        <td className="p-3 border">
                          ₹{project.paymentReceived} / ₹{project.totalPayment}
                        </td>

                        <td className="p-3 border">
                          {project.assignedPeople.join(", ")}
                        </td>

                        <td className="p-3 border break-all">
                          {project.githubLink ? (
                            <a
                              href={project.githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-700 hover:text-blue-600"
                            >
                              <FaGithub size={24} />
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>

                        <td className="p-3 border">
                          {project.clientEmail ? (
                            <a
                              href={`mailto:${project.clientEmail}`}
                              className="text-gray-700 hover:text-blue-600"
                            >
                              <MdEmail size={24} />
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>

                        <td className="p-3 border">
                          {project.contactInfo ? (
                            <a
                              href={`tel:${project.contactInfo}`}
                              className="text-gray-700 hover:text-blue-600"
                            >
                              <MdContactPhone size={24} />
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>

                        <td className="p-3 border text-red-500 text-xl">
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="font-bold px-3 py-1 rounded"
                          >
                            <FaTrash />
                          </button>
                        </td>

                        <td className="p-3 border text-blue-500 text-xl">
                          <button className="font-bold px-3 py-1 rounded" onClick={() => handleEdit(project.id)}>
                            <FaEdit />
                          </button>
                        </td>

                        <td className="p-3 border text-yellow-500 text-xl">
                          <button className="font-bold px-3 py-1 rounded" onClick={() => handleView(project.id)}>
                            <FaEye />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );

}
