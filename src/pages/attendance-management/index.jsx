import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import AttendanceTable from './components/AttendanceTable';
import AttendanceFilters from './components/AttendanceFilters';
import AttendanceAnalytics from './components/AttendanceAnalytics';
import AttendanceActions from './components/AttendanceActions';
import PolicyViolationAlerts from './components/PolicyViolationAlerts';
import Icon from '../../components/AppIcon';

const AttendanceManagement = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    dateRange: 'today',
    department: 'all',
    status: 'all',
    location: 'all'
  });
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, attendanceData]);

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      // Mock attendance data
      const mockData = [
      {
        id: 1,
        employeeId: 'EMP001',
        employeeName: 'Sarah Johnson',
        department: 'Engineering',
        checkInTime: '09:00 AM',
        checkOutTime: '06:00 PM',
        workDuration: '8h 30m',
        breakDuration: '30m',
        status: 'present',
        location: 'Office',
        date: '2025-01-19',
        profileImage: "https://images.unsplash.com/photo-1702089050621-62646a2b748f",
        alt: 'Professional headshot of Sarah Johnson, a software engineer with shoulder-length brown hair wearing a navy blazer',
        overtime: '30m',
        productivity: 92
      },
      {
        id: 2,
        employeeId: 'EMP002',
        employeeName: 'Michael Chen',
        department: 'Marketing',
        checkInTime: '09:15 AM',
        checkOutTime: '05:45 PM',
        workDuration: '8h 0m',
        breakDuration: '30m',
        status: 'late',
        location: 'WFH',
        date: '2025-01-19',
        profileImage: "https://images.unsplash.com/photo-1698072556534-40ec6e337311",
        alt: 'Professional portrait of Michael Chen, a marketing specialist wearing glasses and a light blue shirt',
        overtime: '0m',
        productivity: 88
      },
      {
        id: 3,
        employeeId: 'EMP003',
        employeeName: 'Emily Davis',
        department: 'HR',
        checkInTime: '--',
        checkOutTime: '--',
        workDuration: '--',
        breakDuration: '--',
        status: 'absent',
        location: '--',
        date: '2025-01-19',
        profileImage: "https://images.unsplash.com/photo-1688597628916-d3230d8ac41e",
        alt: 'Professional photo of Emily Davis, an HR manager with blonde hair wearing a white blouse and black blazer',
        overtime: '--',
        productivity: 0,
        reason: 'Sick Leave (Approved)'
      },
      {
        id: 4,
        employeeId: 'EMP004',
        employeeName: 'David Wilson',
        department: 'Sales',
        checkInTime: '08:45 AM',
        checkOutTime: '04:30 PM',
        workDuration: '7h 15m',
        breakDuration: '30m',
        status: 'early_departure',
        location: 'Client Site',
        date: '2025-01-19',
        profileImage: "https://images.unsplash.com/photo-1714974528889-d51109fb6ae9",
        alt: 'Business portrait of David Wilson, a sales representative with dark hair wearing a gray suit and tie',
        overtime: '0m',
        productivity: 85,
        reason: 'Client Meeting'
      }];

      setAttendanceData(mockData);
      setFilteredData(mockData);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...attendanceData];

    // Apply department filter
    if (filters?.department !== 'all') {
      filtered = filtered?.filter((emp) => emp?.department === filters?.department);
    }

    // Apply status filter
    if (filters?.status !== 'all') {
      filtered = filtered?.filter((emp) => emp?.status === filters?.status);
    }

    // Apply location filter
    if (filters?.location !== 'all') {
      filtered = filtered?.filter((emp) => emp?.location === filters?.location);
    }

    setFilteredData(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleBulkAction = (action) => {
    if (selectedEmployees?.length === 0) {
      alert('Please select employees first');
      return;
    }

    console.log(`Performing ${action} on employees:`, selectedEmployees);
    // Implement bulk actions
    setSelectedEmployees([]);
  };

  const handleExportReport = (format) => {
    console.log(`Exporting report in ${format} format`);
    // Implement export functionality
  };

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const breadcrumbItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Attendance Management', path: '/attendance-management' }];


  const attendanceStats = {
    totalEmployees: attendanceData?.length || 0,
    presentToday: attendanceData?.filter((emp) => emp?.status === 'present')?.length || 0,
    absentToday: attendanceData?.filter((emp) => emp?.status === 'absent')?.length || 0,
    lateArrivals: attendanceData?.filter((emp) => emp?.status === 'late')?.length || 0,
    earlyDepartures: attendanceData?.filter((emp) => emp?.status === 'early_departure')?.length || 0,
    avgProductivity: attendanceData?.reduce((acc, emp) => acc + (emp?.productivity || 0), 0) / (attendanceData?.length || 1)
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={handleToggleSidebar} />
      <main className={`transition-all duration-300 ${
      sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pt-16 pb-20 lg:pb-8`
      }>
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <BreadcrumbNavigation items={breadcrumbItems} />
              <h1 className="text-3xl font-semibold text-foreground mb-2">Attendance Management</h1>
              <p className="text-muted-foreground">
                Comprehensive workforce attendance oversight and policy management
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-150 ${
                showAnalytics ?
                'bg-primary text-primary-foreground' :
                'bg-card border border-border text-foreground hover:bg-accent'}`
                }>

                <Icon name="BarChart3" size={16} />
                <span className="hidden sm:inline">Analytics</span>
              </button>
              
              <button
                onClick={fetchAttendanceData}
                className="flex items-center space-x-2 px-4 py-2 bg-card border border-border text-foreground rounded-lg hover:bg-accent transition-colors duration-150">

                <Icon name="RefreshCw" size={16} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Icon name="Users" size={20} className="text-primary" />
                <div>
                  <p className="text-2xl font-semibold text-foreground">{attendanceStats?.totalEmployees}</p>
                  <p className="text-xs text-muted-foreground">Total Employees</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Icon name="UserCheck" size={20} className="text-success" />
                <div>
                  <p className="text-2xl font-semibold text-success">{attendanceStats?.presentToday}</p>
                  <p className="text-xs text-muted-foreground">Present</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Icon name="UserX" size={20} className="text-error" />
                <div>
                  <p className="text-2xl font-semibold text-error">{attendanceStats?.absentToday}</p>
                  <p className="text-xs text-muted-foreground">Absent</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={20} className="text-warning" />
                <div>
                  <p className="text-2xl font-semibold text-warning">{attendanceStats?.lateArrivals}</p>
                  <p className="text-xs text-muted-foreground">Late</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Icon name="LogOut" size={20} className="text-orange-500" />
                <div>
                  <p className="text-2xl font-semibold text-orange-500">{attendanceStats?.earlyDepartures}</p>
                  <p className="text-xs text-muted-foreground">Early Out</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Icon name="TrendingUp" size={20} className="text-blue-500" />
                <div>
                  <p className="text-2xl font-semibold text-blue-500">{Math.round(attendanceStats?.avgProductivity)}%</p>
                  <p className="text-xs text-muted-foreground">Avg Productivity</p>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Panel */}
          {showAnalytics &&
          <div className="mb-6">
              <AttendanceAnalytics attendanceData={filteredData} />
            </div>
          }

          {/* Policy Violation Alerts */}
          <PolicyViolationAlerts />

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Filters Panel */}
            <div className="xl:col-span-1">
              <AttendanceFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                attendanceData={attendanceData} />

            </div>

            {/* Main Content */}
            <div className="xl:col-span-3 space-y-6">
              {/* Bulk Actions */}
              <AttendanceActions
                selectedEmployees={selectedEmployees}
                onBulkAction={handleBulkAction}
                onExportReport={handleExportReport}
                totalRecords={filteredData?.length} />


              {/* Attendance Table */}
              <AttendanceTable
                attendanceData={filteredData}
                loading={loading}
                selectedEmployees={selectedEmployees}
                onSelectionChange={setSelectedEmployees} />

            </div>
          </div>
        </div>
      </main>
    </div>);

};

export default AttendanceManagement;