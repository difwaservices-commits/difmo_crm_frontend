import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import MetricsCard from './components/MetricsCard';
import AttendanceChart from './components/AttendanceChart';
import ProductivityChart from './components/ProductivityChart';
import QuickActionCard from './components/QuickActionCard';
import RecentActivityFeed from './components/RecentActivityFeed';
import PendingApprovals from './components/PendingApprovals';
import UpcomingEvents from './components/UpcomingEvents';
import Icon from '../../components/AppIcon';
import useAuthStore from '../../store/useAuthStore';
import dashboardService from '../../services/dashboardService';

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [metrics, setMetrics] = useState({
    totalEmployees: 0,
    presentToday: 0,
    tasksCompleted: 0,
    avgProductivity: 0,
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  const fetchMetrics = async () => {
    if (!user?.company?.id) return;
    try {
      const data = await dashboardService.getMetrics(user.company.id);
      setMetrics(data);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [user]);

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
      onClick: () => window.location.href = '/employee-management?action=add'
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
    // Simulate data refresh
    setCurrentTime(new Date());
    console.log('Dashboard data refreshed');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={handleToggleSidebar} />
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
        } pt-16 pb-20 lg:pb-8`}>
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header Section */}
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

          {/* Metrics Cards */}
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

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            <AttendanceChart />
            <ProductivityChart />
          </div>

          {/* Quick Actions */}
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

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <RecentActivityFeed />
            </div>

            <div className="lg:col-span-1">
              <PendingApprovals />
            </div>

            <div className="lg:col-span-1">
              <UpcomingEvents />
            </div>
          </div>

          {/* Footer Stats */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-semibold text-foreground">98.5%</p>
                <p className="text-sm text-muted-foreground">System Uptime</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">24/7</p>
                <p className="text-sm text-muted-foreground">Support Available</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">15</p>
                <p className="text-sm text-muted-foreground">Active Departments</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">3.2s</p>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;