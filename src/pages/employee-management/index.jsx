import React, { useState, useMemo } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import EmployeeTable from './components/EmployeeTable';
import EmployeeFilters from './components/EmployeeFilters';
import EmployeeActions from './components/EmployeeActions';
import EmployeeModal from './components/EmployeeModal';

const EmployeeManagement = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [filters, setFilters] = useState({
    department: '',
    branch: '',
    employmentType: '',
    status: ''
  });
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'view', // 'view', 'edit', 'add'
    employee: null
  });

  // Mock employee data
  const mockEmployees = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    phone: "+1 (555) 123-4567",
    department: "engineering",
    role: "Senior Software Engineer",
    status: "active",
    hireDate: "2022-03-15",
    manager: "Michael Chen",
    branch: "headquarters",
    employmentType: "full-time",
    salary: "95000",
    avatar: "https://images.unsplash.com/photo-1734456611474-13245d164868",
    avatarAlt: "Professional headshot of woman with brown hair in business attire smiling at camera",
    address: "123 Main St, San Francisco, CA 94105",
    emergencyContact: "John Johnson",
    emergencyPhone: "+1 (555) 987-6543",
    skills: ["React", "Node.js", "Python"]
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@company.com",
    phone: "+1 (555) 234-5678",
    department: "engineering",
    role: "Engineering Manager",
    status: "active",
    hireDate: "2021-01-10",
    manager: "Emily Davis",
    branch: "headquarters",
    employmentType: "full-time",
    salary: "125000",
    avatar: "https://images.unsplash.com/photo-1637080423110-6736ee5705ed",
    avatarAlt: "Professional headshot of Asian man with glasses in dark suit jacket",
    address: "456 Oak Ave, San Francisco, CA 94102",
    emergencyContact: "Lisa Chen",
    emergencyPhone: "+1 (555) 876-5432",
    skills: ["Leadership", "Java", "System Design"]
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily.davis@company.com",
    phone: "+1 (555) 345-6789",
    department: "marketing",
    role: "Marketing Director",
    status: "active",
    hireDate: "2020-08-22",
    manager: "David Wilson",
    branch: "new-york",
    employmentType: "full-time",
    salary: "110000",
    avatar: "https://images.unsplash.com/photo-1684262855358-88f296a2cfc2",
    avatarAlt: "Professional headshot of blonde woman in white blazer smiling confidently",
    address: "789 Broadway, New York, NY 10003",
    emergencyContact: "Robert Davis",
    emergencyPhone: "+1 (555) 765-4321",
    skills: ["Digital Marketing", "Strategy", "Analytics"]
  },
  {
    id: 4,
    name: "David Wilson",
    email: "david.wilson@company.com",
    phone: "+1 (555) 456-7890",
    department: "sales",
    role: "Sales Representative",
    status: "pending",
    hireDate: "2023-10-01",
    manager: "Lisa Anderson",
    branch: "san-francisco",
    employmentType: "full-time",
    salary: "75000",
    avatar: "https://images.unsplash.com/photo-1598226863630-2826f1d31532",
    avatarAlt: "Professional headshot of man with beard in navy blue shirt outdoors",
    address: "321 Pine St, San Francisco, CA 94108",
    emergencyContact: "Mary Wilson",
    emergencyPhone: "+1 (555) 654-3210",
    skills: ["Sales", "CRM", "Negotiation"]
  },
  {
    id: 5,
    name: "Lisa Anderson",
    email: "lisa.anderson@company.com",
    phone: "+1 (555) 567-8901",
    department: "hr",
    role: "HR Manager",
    status: "active",
    hireDate: "2021-06-15",
    manager: "Sarah Johnson",
    branch: "headquarters",
    employmentType: "full-time",
    salary: "85000",
    avatar: "https://images.unsplash.com/photo-1714644886339-6c3c3265bd2b",
    avatarAlt: "Professional headshot of woman with dark hair in black blazer smiling warmly",
    address: "654 Market St, San Francisco, CA 94104",
    emergencyContact: "Tom Anderson",
    emergencyPhone: "+1 (555) 543-2109",
    skills: ["HR Management", "Recruitment", "Employee Relations"]
  },
  {
    id: 6,
    name: "James Rodriguez",
    email: "james.rodriguez@company.com",
    phone: "+1 (555) 678-9012",
    department: "finance",
    role: "Financial Analyst",
    status: "inactive",
    hireDate: "2022-11-30",
    manager: "Emily Davis",
    branch: "london",
    employmentType: "contract",
    salary: "70000",
    avatar: "https://images.unsplash.com/photo-1663720527180-4c60a78fe3b7",
    avatarAlt: "Professional headshot of Hispanic man with short dark hair in gray suit",
    address: "987 Financial District, London, UK",
    emergencyContact: "Maria Rodriguez",
    emergencyPhone: "+44 20 7123 4567",
    skills: ["Financial Analysis", "Excel", "Reporting"]
  },
  {
    id: 7,
    name: "Anna Thompson",
    email: "anna.thompson@company.com",
    phone: "+1 (555) 789-0123",
    department: "design",
    role: "UX Designer",
    status: "active",
    hireDate: "2023-02-14",
    manager: "Michael Chen",
    branch: "remote",
    employmentType: "part-time",
    salary: "60000",
    avatar: "https://images.unsplash.com/photo-1713606466620-902532aad7a6",
    avatarAlt: "Professional headshot of woman with red hair in casual blue top smiling",
    address: "Remote Worker - Austin, TX",
    emergencyContact: "Steve Thompson",
    emergencyPhone: "+1 (555) 432-1098",
    skills: ["UI/UX Design", "Figma", "User Research"]
  },
  {
    id: 8,
    name: "Robert Kim",
    email: "robert.kim@company.com",
    phone: "+1 (555) 890-1234",
    department: "operations",
    role: "Operations Coordinator",
    status: "active",
    hireDate: "2022-07-08",
    manager: "Lisa Anderson",
    branch: "singapore",
    employmentType: "full-time",
    salary: "65000",
    avatar: "https://images.unsplash.com/photo-1558356811-8e77884f44d3",
    avatarAlt: "Professional headshot of Asian man in white dress shirt with friendly smile",
    address: "123 Business Park, Singapore 018956",
    emergencyContact: "Jenny Kim",
    emergencyPhone: "+65 9123 4567",
    skills: ["Operations", "Process Improvement", "Logistics"]
  }];


  // Filter and sort employees
  const filteredAndSortedEmployees = useMemo(() => {
    let filtered = mockEmployees?.filter((employee) => {
      const matchesSearch = searchTerm === '' ||
      employee?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      employee?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      employee?.id?.toString()?.includes(searchTerm);

      const matchesDepartment = !filters?.department || employee?.department === filters?.department;
      const matchesBranch = !filters?.branch || employee?.branch === filters?.branch;
      const matchesEmploymentType = !filters?.employmentType || employee?.employmentType === filters?.employmentType;
      const matchesStatus = !filters?.status || employee?.status === filters?.status;

      return matchesSearch && matchesDepartment && matchesBranch && matchesEmploymentType && matchesStatus;
    });

    // Sort employees
    filtered?.sort((a, b) => {
      let aValue = a?.[sortConfig?.key];
      let bValue = b?.[sortConfig?.key];

      if (sortConfig?.key === 'hireDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) return sortConfig?.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig?.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [searchTerm, filters, sortConfig]);

  const breadcrumbItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Employee Management', path: '/employee-management' }];


  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectEmployee = (employeeId) => {
    setSelectedEmployees((prev) =>
    prev?.includes(employeeId) ?
    prev?.filter((id) => id !== employeeId) :
    [...prev, employeeId]
    );
  };

  const handleSelectAll = () => {
    setSelectedEmployees((prev) =>
    prev?.length === filteredAndSortedEmployees?.length ?
    [] :
    filteredAndSortedEmployees?.map((emp) => emp?.id)
    );
  };

  const handleFilterChange = (filterKey, value) => {
    setFilters((prev) => ({ ...prev, [filterKey]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      department: '',
      branch: '',
      employmentType: '',
      status: ''
    });
    setSearchTerm('');
  };

  const handleAddEmployee = () => {
    setModalState({
      isOpen: true,
      mode: 'add',
      employee: null
    });
  };

  const handleEditEmployee = (employee) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      employee
    });
  };

  const handleViewEmployee = (employee) => {
    setModalState({
      isOpen: true,
      mode: 'view',
      employee
    });
  };

  const handleDeleteEmployee = (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      console.log('Deleting employee:', employeeId);
      // In a real app, this would make an API call
    }
  };

  const handleBulkAction = (action, employeeIds) => {
    console.log('Bulk action:', action, 'for employees:', employeeIds);
    // In a real app, this would make an API call
    setSelectedEmployees([]);
  };

  const handleImportEmployees = (file) => {
    console.log('Importing employees from file:', file?.name);
    // In a real app, this would process the CSV file
  };

  const handleExportEmployees = () => {
    console.log('Exporting employees');
    // In a real app, this would generate and download a CSV file
  };

  const handleSaveEmployee = async (employeeData) => {
    console.log('Saving employee:', employeeData);
    // In a real app, this would make an API call
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      mode: 'view',
      employee: null
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className={`transition-all duration-300 ${
      sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pt-16 pb-20 lg:pb-6`
      }>
        <div className="p-6">
          <BreadcrumbNavigation items={breadcrumbItems} />
          
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-foreground mb-2">Employee Management</h1>
            <p className="text-muted-foreground">
              Manage your workforce, track employee information, and handle HR operations efficiently.
            </p>
          </div>

          <EmployeeActions
            selectedEmployees={selectedEmployees}
            onAddEmployee={handleAddEmployee}
            onBulkAction={handleBulkAction}
            onImportEmployees={handleImportEmployees}
            onExportEmployees={handleExportEmployees} />


          <EmployeeFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            resultCount={filteredAndSortedEmployees?.length} />


          <EmployeeTable
            employees={filteredAndSortedEmployees}
            selectedEmployees={selectedEmployees}
            onSelectEmployee={handleSelectEmployee}
            onSelectAll={handleSelectAll}
            onEditEmployee={handleEditEmployee}
            onViewEmployee={handleViewEmployee}
            onDeleteEmployee={handleDeleteEmployee}
            sortConfig={sortConfig}
            onSort={handleSort} />


          <EmployeeModal
            isOpen={modalState?.isOpen}
            onClose={handleCloseModal}
            employee={modalState?.employee}
            mode={modalState?.mode}
            onSave={handleSaveEmployee} />

        </div>
      </main>
    </div>);

};

export default EmployeeManagement;