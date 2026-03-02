import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/ui/Header";
import Sidebar from "../components/ui/Sidebar";
import Icon from "../components/AppIcon";
import Button from "../components/ui/Button";
import BreadcrumbNavigation from "../components/ui/BreadcrumbNavigation";
import { projectService } from "../services/projectService";
import useAuthStore from "../store/useAuthStore";
import useLocale from "../hooks/useLocale";

export default function Projects() {
  const [search, setSearch] = useState("");
  const [phase, setPhase] = useState("All");
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { formatPrice, formatDate } = useLocale();

  const fetchProjects = async () => {
    const companyId = user?.company?.id || user?.companyId;
    if (!companyId) return;

    setIsLoading(true);
    try {
      const responseData = await projectService.getAll(companyId);
      const data = responseData?.data || responseData || [];

      const cleanData = (Array.isArray(data) ? data : []).map((p) => ({
        ...p,
        assignedPeople: Array.isArray(p.assignedPeople) ? p.assignedPeople :
          (typeof p.assignedPeople === 'string' ? p.assignedPeople.split(',').map(s => s.trim()) : [])
      }));

      setProjects(cleanData);
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch = p.projectName.toLowerCase().includes(search.toLowerCase()) ||
        p.clientName.toLowerCase().includes(search.toLowerCase());
      const matchPhase = phase === "All" || p.phase === phase;
      return matchSearch && matchPhase;
    });
  }, [projects, search, phase]);

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Projects', path: '/projects' },
  ];

  const getPhaseColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-success/10 text-success border-success/20';
      case 'Deployment': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Testing': return 'bg-warning/10 text-warning border-warning/20';
      case 'Development': return 'bg-primary/10 text-primary border-primary/20';
      case 'Planning': return 'bg-muted text-muted-foreground border-border';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pt-16 pb-20 lg:pb-6`}>
        <div className="p-6 max-w-7xl mx-auto">
          <BreadcrumbNavigation items={breadcrumbItems} />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Project Management</h1>
              <p className="text-muted-foreground mt-1">Track and manage your company's project portfolio</p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <Button onClick={() => navigate("/add-project")} iconName="Plus">New Project</Button>
            </div>
          </div>

          {/* Filters Area */}
          <div className="bg-card border border-border rounded-xl p-4 mb-8 shadow-sm flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Icon name="Search" size={18} />
              </div>
              <input
                type="text"
                placeholder="Search projects or clients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Phase:</span>
              <select
                value={phase}
                onChange={(e) => setPhase(e.target.value)}
                className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-auto shadow-sm"
              >
                <option value="All">All Phases</option>
                <option value="Planning">Planning</option>
                <option value="Development">Development</option>
                <option value="Testing">Testing</option>
                <option value="Deployment">Deployment</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center">
              <h3 className="font-semibold text-foreground">Active Projects</h3>
              <span className="text-sm text-muted-foreground">{filteredProjects.length} projects found</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Project Info</th>
                    <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Client Details</th>
                    <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Timeline</th>
                    <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Phase</th>
                    <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Payment Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Team</th>
                    <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoading ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-20 text-center">
                        <Icon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-3" />
                        <p className="text-muted-foreground font-medium">Fetching projects...</p>
                      </td>
                    </tr>
                  ) : filteredProjects.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-20 text-center">
                        <Icon name="FolderOpen" size={48} className="text-muted-foreground/20 mx-auto mb-4" />
                        <p className="text-foreground font-semibold text-lg">No Projects Found</p>
                        <p className="text-muted-foreground">Try adjusting your filters or add a new project.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredProjects.map((project) => (
                      <tr key={project.id} className="hover:bg-muted/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-bold text-foreground group-hover:text-primary transition-colors cursor-pointer" onClick={() => navigate(`/project-details/${project.id}`)}>
                            {project.projectName}
                          </div>
                          <div className="flex items-center mt-1 space-x-2">
                            {project.githubLink && (
                              <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                                <Icon name="Github" size={14} />
                              </a>
                            )}
                            {project.deploymentLink && (
                              <a href={project.deploymentLink} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                                <Icon name="ExternalLink" size={14} />
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-foreground">{project.clientName}</div>
                          <div className="text-xs text-muted-foreground flex flex-col space-y-0.5">
                            <span className="flex items-center"><Icon name="Mail" size={10} className="mr-1" /> {project.clientEmail || 'N/A'}</span>
                            <span className="flex items-center"><Icon name="Phone" size={10} className="mr-1" /> {project.contactInfo || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs">
                            <span className="text-muted-foreground">Start:</span>
                            <div className="font-medium text-foreground">{formatDate(project.assigningDate)}</div>
                          </div>
                          <div className="text-xs mt-1">
                            <span className="text-muted-foreground">Deadline:</span>
                            <div className="font-medium text-error">{formatDate(project.deadline)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getPhaseColor(project.phase)}`}>
                            {project.phase}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-foreground">
                            {formatPrice(project.paymentReceived)}
                          </div>
                          <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-0.5">
                            of {formatPrice(project.totalPayment)}
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5 mt-2 overflow-hidden border border-border">
                            <div
                              className="bg-success h-full transition-all duration-500"
                              style={{ width: `${Math.min(100, (project.paymentReceived / project.totalPayment) * 100)}%` }}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex -space-x-2">
                            {(project.assignedPeople || []).slice(0, 3).map((person, idx) => (
                              <div key={idx} title={person} className="w-8 h-8 rounded-full bg-primary/10 border-2 border-card flex items-center justify-center text-[10px] font-bold text-primary">
                                {person[0].toUpperCase()}
                              </div>
                            ))}
                            {project.assignedPeople?.length > 3 && (
                              <div className="w-8 h-8 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                                +{project.assignedPeople.length - 3}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button onClick={() => navigate(`/edit-project/${project.id}`)} className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors text-muted-foreground" title="Edit">
                              <Icon name="Edit" size={16} />
                            </button>
                            <button onClick={() => navigate(`/project-details/${project.id}`)} className="p-2 hover:bg-blue-500/10 hover:text-blue-500 rounded-lg transition-colors text-muted-foreground" title="View Details">
                              <Icon name="Eye" size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

