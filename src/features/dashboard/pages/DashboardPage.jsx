
import React, { useState, useEffect } from 'react';
import Header from '../../../components/ui/Header';
import Sidebar from '../../../components/ui/Sidebar';
import BreadcrumbNavigation from '../../../components/ui/BreadcrumbNavigation';
import {
  MetricsCard,
  AttendanceChart,
  ProductivityChart,
  QuickActionCard,
  RecentActivityFeed,
  PendingApprovals,
  UpcomingEvents,
  useDashboardStore
} from 'features/dashboard';
import useAuthStore from '../../../store/useAuthStore';
import Icon from '../../../components/AppIcon';
import { useNavigate } from 'react-router-dom';

//  IMPORT EMPLOYEE MODAL
import { EmployeeModal } from 'features/employee';

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  //  MODAL STATE
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);

  const { user } = useAuthStore();
  const { metrics, loading, fetchMetrics, refreshDashboard } = useDashboardStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.company?.id) {
      fetchMetrics(user.company.id);
    }
  }, [user, fetchMetrics]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/dashboard' }
  ];

  const metricsData = [
    {
      title: 'Total Employees',
      value: (metrics?.totalEmployees ?? 0).toString(),
      change: '+12',
      changeType: 'positive',
      icon: 'Users',
      color: 'primary'
    },
    {
      title: 'Present Today',
      value: (metrics?.presentToday ?? 0).toString(),
      change: '+5.2%',
      changeType: 'positive',
      icon: 'UserCheck',
      color: 'success'
    },
    {
      title: 'Tasks Completed',
      value: (metrics?.tasksCompleted ?? 0).toString(),
      change: '+18%',
      changeType: 'positive',
      icon: 'CheckSquare',
      color: 'primary'
    },
    {
      title: 'Avg Productivity',
      value: `${metrics?.avgProductivity ?? 0}%`,
      change: '+3.1%',
      changeType: 'positive',
      icon: 'TrendingUp',
      color: 'success'
    }
  ];

  const quickActions = [
    {
      title: 'Add New Employee',
      description: 'Register new team member with complete profile',
      icon: 'UserPlus',
      color: 'primary',

      // ✅ NAVIGATION CHANGED → OPEN MODAL
      onClick: () => setIsEmployeeModalOpen(true)
    },
    {
      title: 'Create Announcement',
      description: 'Share important updates with all employees',
      icon: 'Megaphone',
      color: 'warning',
      onClick: () => window.location.href = '/announcements?action=create'
    },
    {
      title: 'Generate Reports',
      description: 'Export attendance, productivity and payroll data',
      icon: 'FileText',
      color: 'success',
      onClick: () => window.location.href = '/reports'
    },
    {
      title: 'Process Payroll',
      description: 'Calculate and generate monthly salary payments',
      icon: 'DollarSign',
      color: 'primary',
      badge: 'Due Soon',
      onClick: () => window.location.href = '/payroll?action=process'
    }
  ];

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleRefreshData = () => {
    if (user?.company?.id) {
      refreshDashboard(user.company.id);
    }
    setCurrentTime(new Date());
  };

  // ✅ SAVE HANDLER FOR MODAL
  const handleSaveEmployee = async (employeeData) => {
    console.log('Employee Saved:', employeeData);
    setIsEmployeeModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={handleToggleSidebar} />

      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pt-16 pb-20 lg:pb-8`}>
        <div className="p-6 max-w-7xl mx-auto">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <BreadcrumbNavigation items={breadcrumbItems} />
              <h1 className="text-3xl font-semibold text-foreground mb-2">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back! Here's what's happening with your team today.
              </p>
            </div>

            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {currentTime?.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-xs text-muted-foreground">
                  {currentTime?.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </p>
              </div>

              <button
                onClick={handleRefreshData}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-150"
              >
                <Icon name="RefreshCw" size={16} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricsData?.map((metric, index) => (
              <MetricsCard
                key={index}
                title={metric?.title}
                value={metric?.value}
                change={metric?.change}
                changeType={metric?.changeType}
                icon={metric?.icon}
                color={metric?.color}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            <AttendanceChart />
            <ProductivityChart />
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions?.map((action, index) => (
                <QuickActionCard
                  key={index}
                  title={action?.title}
                  description={action?.description}
                  icon={action?.icon}
                  color={action?.color}
                  badge={action?.badge}
                  onClick={action?.onClick}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RecentActivityFeed />
            <PendingApprovals />
            <UpcomingEvents />
          </div>

        </div>
      </main>

      {/* ✅ EMPLOYEE MODAL */}
      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        employee={null}
        mode="add"
        onSave={handleSaveEmployee}
      />

    </div>
  );
};

export default Dashboard;

