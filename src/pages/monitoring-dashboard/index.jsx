import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import EmployeeStatusCard from './components/EmployeeStatusCard';
import ScreenshotGallery from './components/ScreenshotGallery';
import ActivityChart from './components/ActivityChart';
import MonitoringFilters from './components/MonitoringFilters';
import CameraMonitoringPanel from './components/CameraMonitoringPanel';
import ProductivityBenchmark from './components/ProductivityBenchmark';
import Icon from '../../components/AppIcon';

const MonitoringDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState({});

  const breadcrumbItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Monitoring Dashboard', path: '/monitoring-dashboard' }];


  const employees = [
  {
    id: 1,
    name: 'Sarah Johnson',
    department: 'Engineering',
    avatar: "https://images.unsplash.com/photo-1684262855358-88f296a2cfc2",
    avatarAlt: 'Professional headshot of woman with brown hair in white blazer smiling at camera',
    workMode: 'WFH',
    status: 'Active',
    productivityScore: 92,
    hoursWorked: 7.5,
    lastActivity: '2 min ago',
    currentTask: 'Code Review - Authentication Module',
    cameraEnabled: true,
    screenMonitoring: true
  },
  {
    id: 2,
    name: 'Michael Chen',
    department: 'Marketing',
    avatar: "https://images.unsplash.com/photo-1687256457585-3608dfa736c5",
    avatarAlt: 'Professional headshot of Asian man with short black hair in navy suit',
    workMode: 'Office',
    status: 'Active',
    productivityScore: 88,
    hoursWorked: 8.2,
    lastActivity: '5 min ago',
    currentTask: 'Campaign Analysis Report',
    cameraEnabled: false,
    screenMonitoring: true
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    department: 'Design',
    avatar: "https://images.unsplash.com/photo-1654110951517-0307aed76b75",
    avatarAlt: 'Professional headshot of Hispanic woman with long dark hair in black top',
    workMode: 'WFH',
    status: 'Idle',
    productivityScore: 76,
    hoursWorked: 6.8,
    lastActivity: '15 min ago',
    currentTask: 'UI Mockups - Mobile App',
    cameraEnabled: true,
    screenMonitoring: true
  },
  {
    id: 4,
    name: 'David Kim',
    department: 'Sales',
    avatar: "https://images.unsplash.com/photo-1722368378695-8a56b520fcf0",
    avatarAlt: 'Professional headshot of Korean man with glasses in dark suit',
    workMode: 'Client-site',
    status: 'Away',
    productivityScore: 85,
    hoursWorked: 5.5,
    lastActivity: '1 hour ago',
    currentTask: 'Client Presentation - Q4 Proposal',
    cameraEnabled: false,
    screenMonitoring: false
  },
  {
    id: 5,
    name: 'Lisa Thompson',
    department: 'HR',
    avatar: "https://images.unsplash.com/photo-1648466982925-65dac4ed0814",
    avatarAlt: 'Professional headshot of blonde woman in business attire with friendly smile',
    workMode: 'Office',
    status: 'Active',
    productivityScore: 94,
    hoursWorked: 7.8,
    lastActivity: '1 min ago',
    currentTask: 'Employee Performance Reviews',
    cameraEnabled: false,
    screenMonitoring: true
  },
  {
    id: 6,
    name: 'James Wilson',
    department: 'Engineering',
    avatar: "https://images.unsplash.com/photo-1734221649687-5d27081388d7",
    avatarAlt: 'Professional headshot of African American man with beard in casual shirt',
    workMode: 'WFH',
    status: 'Active',
    productivityScore: 89,
    hoursWorked: 8.0,
    lastActivity: '3 min ago',
    currentTask: 'Database Optimization',
    cameraEnabled: true,
    screenMonitoring: true
  }];


  const tabs = [
  { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
  { id: 'activity', label: 'Activity Tracking', icon: 'BarChart3' },
  { id: 'screenshots', label: 'Screenshots', icon: 'Camera' },
  { id: 'camera', label: 'Camera Monitoring', icon: 'Video' },
  { id: 'benchmarks', label: 'Benchmarks', icon: 'TrendingUp' }];


  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    // Apply filters to employee data
    console.log('Filters updated:', newFilters);
  };

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const selectedEmployee = employees?.find((emp) => emp?.workMode === 'WFH') || employees?.[0];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={handleSidebarToggle} />

      <main className={`pt-16 pb-20 lg:pb-8 transition-all duration-300 ${
      sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}`
      }>
        <div className="p-6">
          <BreadcrumbNavigation items={breadcrumbItems} />
          
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Monitoring Dashboard</h1>
              <p className="text-muted-foreground">
                Comprehensive employee productivity and activity oversight
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Monitoring Active</span>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <Icon name="RefreshCw" size={16} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Monitoring Filters */}
          <MonitoringFilters onFiltersChange={handleFiltersChange} />

          {/* Tab Navigation */}
          <div className="border-b border-border mb-6">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs?.map((tab) =>
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab?.id ?
                'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'}`
                }>

                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </button>
              )}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'overview' &&
            <>
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-foreground">24</p>
                        <p className="text-sm text-muted-foreground">Total Employees</p>
                      </div>
                      <Icon name="Users" size={24} className="text-primary" />
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-green-600">18</p>
                        <p className="text-sm text-muted-foreground">Currently Active</p>
                      </div>
                      <Icon name="Activity" size={24} className="text-green-600" />
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">87%</p>
                        <p className="text-sm text-muted-foreground">Avg Productivity</p>
                      </div>
                      <Icon name="TrendingUp" size={24} className="text-blue-600" />
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-orange-600">12</p>
                        <p className="text-sm text-muted-foreground">WFH Employees</p>
                      </div>
                      <Icon name="Home" size={24} className="text-orange-600" />
                    </div>
                  </div>
                </div>

                {/* Employee Status Cards */}
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">Employee Status</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {employees?.map((employee) =>
                  <EmployeeStatusCard key={employee?.id} employee={employee} />
                  )}
                  </div>
                </div>
              </>
            }

            {activeTab === 'activity' &&
            <ActivityChart />
            }

            {activeTab === 'screenshots' &&
            <ScreenshotGallery employee={selectedEmployee} />
            }

            {activeTab === 'camera' &&
            <CameraMonitoringPanel />
            }

            {activeTab === 'benchmarks' &&
            <ProductivityBenchmark />
            }
          </div>
        </div>
      </main>
    </div>);

};

export default MonitoringDashboard;