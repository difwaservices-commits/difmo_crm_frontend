import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import TaskFilters from './components/TaskFilters';
import TaskTable from './components/TaskTable';
import TaskAnalytics from './components/TaskAnalytics';
import TaskModal from './components/TaskModal';
import TaskDetailPanel from './components/TaskDetailPanel';

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for tasks
  const mockTasks = [
  {
    id: 1,
    title: "Implement User Authentication System",
    description: "Design and develop a secure user authentication system with JWT tokens, password hashing, and role-based access control for the new web application.",
    assignee: {
      id: 1,
      name: "Sarah Johnson",
      department: "Engineering",
      avatar: "https://images.unsplash.com/photo-1587403655231-b1734312903f",
      avatarAlt: "Professional woman with brown hair in white blouse smiling at camera"
    },
    priority: "high",
    status: "in-progress",
    dueDate: "2024-12-25",
    progress: 65,
    estimatedHours: 40,
    actualHours: 26,
    tags: ["authentication", "security", "backend"],
    createdAt: "2024-12-15T09:00:00Z",
    updatedAt: "2024-12-19T14:30:00Z",
    attachments: [
    {
      id: 1,
      name: "auth_requirements.pdf",
      size: 2048000,
      type: "application/pdf",
      url: "/assets/files/auth_requirements.pdf"
    }]

  },
  {
    id: 2,
    title: "Design Marketing Campaign Landing Page",
    description: "Create responsive landing page designs for the Q1 marketing campaign including mobile optimization and A/B testing variations.",
    assignee: {
      id: 2,
      name: "Michael Chen",
      department: "Marketing",
      avatar: "https://images.unsplash.com/photo-1676989880361-091e12efc056",
      avatarAlt: "Asian man with glasses in dark suit jacket smiling professionally"
    },
    priority: "medium",
    status: "pending",
    dueDate: "2024-12-30",
    progress: 0,
    estimatedHours: 24,
    actualHours: 0,
    tags: ["design", "marketing", "landing-page"],
    createdAt: "2024-12-18T10:15:00Z",
    updatedAt: "2024-12-18T10:15:00Z",
    attachments: []
  },
  {
    id: 3,
    title: "Database Performance Optimization",
    description: "Analyze and optimize database queries to improve application performance. Focus on slow queries and implement proper indexing strategies.",
    assignee: {
      id: 3,
      name: "Emily Rodriguez",
      department: "Engineering",
      avatar: "https://images.unsplash.com/photo-1672867209978-1183d00d4714",
      avatarAlt: "Hispanic woman with long dark hair in professional navy blazer"
    },
    priority: "high",
    status: "overdue",
    dueDate: "2024-12-18",
    progress: 30,
    estimatedHours: 32,
    actualHours: 12,
    tags: ["database", "performance", "optimization"],
    createdAt: "2024-12-10T08:00:00Z",
    updatedAt: "2024-12-17T16:45:00Z",
    attachments: [
    {
      id: 2,
      name: "performance_analysis.xlsx",
      size: 1536000,
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      url: "/assets/files/performance_analysis.xlsx"
    }]

  },
  {
    id: 4,
    title: "Customer Support Chatbot Integration",
    description: "Integrate AI-powered chatbot for customer support to handle common inquiries and reduce response time for customer service team.",
    assignee: {
      id: 4,
      name: "David Kim",
      department: "Engineering",
      avatar: "https://images.unsplash.com/photo-1687256457585-3608dfa736c5",
      avatarAlt: "Professional headshot of Asian man with short hair in business attire"
    },
    priority: "medium",
    status: "completed",
    dueDate: "2024-12-20",
    progress: 100,
    estimatedHours: 48,
    actualHours: 52,
    tags: ["ai", "chatbot", "customer-support"],
    createdAt: "2024-11-25T09:30:00Z",
    updatedAt: "2024-12-19T11:20:00Z",
    attachments: []
  },
  {
    id: 5,
    title: "Sales Report Dashboard Development",
    description: "Build comprehensive sales analytics dashboard with real-time data visualization, filtering capabilities, and export functionality for management team.",
    assignee: {
      id: 5,
      name: "Lisa Thompson",
      department: "Sales",
      avatar: "https://images.unsplash.com/photo-1684262855358-88f296a2cfc2",
      avatarAlt: "Professional blonde woman in light blue shirt smiling confidently"
    },
    priority: "low",
    status: "in-progress",
    dueDate: "2025-01-15",
    progress: 45,
    estimatedHours: 60,
    actualHours: 27,
    tags: ["dashboard", "analytics", "sales"],
    createdAt: "2024-12-05T14:00:00Z",
    updatedAt: "2024-12-19T09:15:00Z",
    attachments: [
    {
      id: 3,
      name: "dashboard_mockups.png",
      size: 3072000,
      type: "image/png",
      url: "/assets/images/dashboard_mockups.png"
    }]

  },
  {
    id: 6,
    title: "Mobile App Security Audit",
    description: "Conduct comprehensive security audit of mobile application including penetration testing, vulnerability assessment, and compliance review.",
    assignee: {
      id: 6,
      name: "James Wilson",
      department: "Engineering",
      avatar: "https://images.unsplash.com/photo-1724328486793-3ffbe395a1b6",
      avatarAlt: "Professional man with beard in dark suit jacket looking confident"
    },
    priority: "high",
    status: "pending",
    dueDate: "2024-12-28",
    progress: 0,
    estimatedHours: 80,
    actualHours: 0,
    tags: ["security", "audit", "mobile"],
    createdAt: "2024-12-16T11:45:00Z",
    updatedAt: "2024-12-16T11:45:00Z",
    attachments: []
  }];


  // Mock employees data
  const mockEmployees = [
  { id: 1, name: "Sarah Johnson", department: "Engineering" },
  { id: 2, name: "Michael Chen", department: "Marketing" },
  { id: 3, name: "Emily Rodriguez", department: "Engineering" },
  { id: 4, name: "David Kim", department: "Engineering" },
  { id: 5, name: "Lisa Thompson", department: "Sales" },
  { id: 6, name: "James Wilson", department: "Engineering" },
  { id: 7, name: "Anna Martinez", department: "HR" },
  { id: 8, name: "Robert Brown", department: "Finance" }];


  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setTasks(mockTasks);
      setFilteredTasks(mockTasks);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const breadcrumbItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Task Management', path: '/task-management' }];


  const handleFiltersChange = (filters) => {
    let filtered = [...tasks];

    // Search filter
    if (filters?.search) {
      filtered = filtered?.filter((task) =>
      task?.title?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
      task?.description?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
      task?.assignee?.name?.toLowerCase()?.includes(filters?.search?.toLowerCase())
      );
    }

    // Priority filter
    if (filters?.priority) {
      filtered = filtered?.filter((task) => task?.priority === filters?.priority);
    }

    // Status filter
    if (filters?.status) {
      filtered = filtered?.filter((task) => task?.status === filters?.status);
    }

    // Department filter
    if (filters?.department) {
      filtered = filtered?.filter((task) =>
      task?.assignee?.department?.toLowerCase() === filters?.department?.toLowerCase()
      );
    }

    // Date range filter
    if (filters?.dateRange) {
      const now = new Date();
      filtered = filtered?.filter((task) => {
        const dueDate = new Date(task.dueDate);
        switch (filters?.dateRange) {
          case 'today':
            return dueDate?.toDateString() === now?.toDateString();
          case 'week':
            const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            return dueDate >= now && dueDate <= weekFromNow;
          case 'month':
            const monthFromNow = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
            return dueDate >= now && dueDate <= monthFromNow;
          case 'overdue':
            return task?.status !== 'completed' && dueDate < now;
          default:
            return true;
        }
      });
    }

    setFilteredTasks(filtered);
  };

  const handleTaskSelect = (taskIds) => {
    setSelectedTasks(taskIds);
  };

  const handleBulkAction = (action, value) => {
    const updatedTasks = tasks?.map((task) => {
      if (selectedTasks?.includes(task?.id)) {
        switch (action) {
          case 'priority':
            return { ...task, priority: value };
          case 'status':
            return { ...task, status: value, progress: value === 'completed' ? 100 : task?.progress };
          case 'delete':
            return null;
          default:
            return task;
        }
      }
      return task;
    })?.filter(Boolean);

    setTasks(updatedTasks);
    setFilteredTasks(updatedTasks);
    setSelectedTasks([]);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleTaskSave = (taskData) => {
    if (editingTask) {
      // Update existing task
      const updatedTasks = tasks?.map((task) =>
      task?.id === editingTask?.id ? { ...taskData, id: editingTask?.id } : task
      );
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
      setEditingTask(null);
    } else {
      // Add new task
      const assignee = mockEmployees?.find((emp) => emp?.id === parseInt(taskData?.assigneeId));
      const newTask = {
        ...taskData,
        id: Date.now(),
        assignee: {
          ...assignee,
          avatar: "https://images.unsplash.com/photo-1584183323859-7deffecfe07c",
          avatarAlt: "Professional headshot of person with short hair in business attire"
        },
        progress: 0,
        actualHours: 0,
        createdAt: new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString()
      };

      const updatedTasks = [newTask, ...tasks];
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
    }
    setIsTaskModalOpen(false);
  };

  const handleTaskUpdate = (updatedTask) => {
    const updatedTasks = tasks?.map((task) =>
    task?.id === updatedTask?.id ? updatedTask : task
    );
    setTasks(updatedTasks);
    setFilteredTasks(updatedTasks);
    setSelectedTask(updatedTask);
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-16 lg:pl-60">
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Icon name="Loader2" size={32} className="text-primary animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading tasks...</p>
            </div>
          </div>
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-background pt-16 lg:pl-60 pb-16 lg:pb-0">
      <div className="p-6">
        <BreadcrumbNavigation items={breadcrumbItems} />
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Task Management</h1>
            <p className="text-muted-foreground mt-1">
              Assign, track, and monitor project tasks with comprehensive analytics
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Button
              variant="outline"
              onClick={() => setShowAnalytics(!showAnalytics)}
              iconName={showAnalytics ? "Table" : "BarChart3"}
              iconPosition="left">

              {showAnalytics ? 'Show Table' : 'Show Analytics'}
            </Button>
            <Button
              onClick={handleCreateTask}
              iconName="Plus"
              iconPosition="left">

              Create Task
            </Button>
          </div>
        </div>

        {/* Filters */}
        <TaskFilters
          onFiltersChange={handleFiltersChange}
          totalTasks={tasks?.length}
          filteredTasks={filteredTasks?.length} />


        {/* Main Content */}
        {showAnalytics ?
        <TaskAnalytics tasks={filteredTasks} /> :

        <TaskTable
          tasks={filteredTasks}
          onTaskSelect={handleTaskSelect}
          onBulkAction={handleBulkAction}
          selectedTasks={selectedTasks}
          onTaskClick={handleTaskClick} />

        }

        {/* Task Modal */}
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false);
            setEditingTask(null);
          }}
          onSave={handleTaskSave}
          task={editingTask}
          employees={mockEmployees} />


        {/* Task Detail Panel */}
        {selectedTask &&
        <TaskDetailPanel
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleTaskUpdate}
          onDelete={(task) => {
            const updatedTasks = tasks?.filter((t) => t?.id !== task?.id);
            setTasks(updatedTasks);
            setFilteredTasks(updatedTasks);
            setSelectedTask(null);
          }} />

        }
      </div>
    </div>);

};

export default TaskManagement;