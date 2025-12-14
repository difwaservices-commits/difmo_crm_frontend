import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const EmployeeModal = ({
  isOpen,
  onClose,
  employee,
  mode, // 'view', 'edit', 'add'
  onSave
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    role: '',
    employmentType: '',
    status: 'active',
    hireDate: '',
    manager: '',
    branch: '',
    salary: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    skills: [],
    avatar: ''
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (employee && mode !== 'add') {
      setFormData({
        firstName: employee?.name?.split(' ')?.[0] || '',
        lastName: employee?.name?.split(' ')?.slice(1)?.join(' ') || '',
        email: employee?.email || '',
        phone: employee?.phone || '',
        department: employee?.departmentId || '',
        role: employee?.role || '',
        employmentType: employee?.employmentType || '',
        status: employee?.status || 'active',
        hireDate: employee?.hireDate || '',
        manager: employee?.manager || '',
        branch: employee?.branch || '',
        salary: employee?.salary || '',
        address: employee?.address || '',
        emergencyContact: employee?.emergencyContact || '',
        emergencyPhone: employee?.emergencyPhone || '',
        skills: employee?.skills || [],
        avatar: employee?.avatar || ''
      });
    } else if (mode === 'add') {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: '',
        role: '',
        employmentType: 'full-time',
        status: 'active',
        hireDate: new Date()?.toISOString()?.split('T')?.[0],
        manager: '',
        branch: '',
        salary: '',
        address: '',
        emergencyContact: '',
        emergencyPhone: '',
        skills: [],
        avatar: ''
      });
    }
  }, [employee, mode]);

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await api.get('/departments');
        let departmentsData = [];
        if (Array.isArray(response.data)) {
          departmentsData = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          departmentsData = response.data.data;
        }
        setDepartments(departmentsData.map(dept => ({ value: dept.id, label: dept.name })));
      } catch (error) {
        console.error('Failed to fetch departments:', error);
      }
    };
    fetchDepartments();
  }, []);

  const employmentTypeOptions = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'intern', label: 'Intern' },
    { value: 'consultant', label: 'Consultant' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' }
  ];

  const branchOptions = [
    { value: 'headquarters', label: 'Headquarters' },
    { value: 'new-york', label: 'New York Office' },
    { value: 'san-francisco', label: 'San Francisco Office' },
    { value: 'london', label: 'London Office' },
    { value: 'singapore', label: 'Singapore Office' },
    { value: 'remote', label: 'Remote' }
  ];

  const managerOptions = [
    { value: 'sarah-johnson', label: 'Sarah Johnson' },
    { value: 'michael-chen', label: 'Michael Chen' },
    { value: 'emily-davis', label: 'Emily Davis' },
    { value: 'david-wilson', label: 'David Wilson' },
    { value: 'lisa-anderson', label: 'Lisa Anderson' }
  ];

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: 'User' },
    { id: 'employment', label: 'Employment', icon: 'Briefcase' },
    { id: 'contact', label: 'Contact', icon: 'Phone' },
    { id: 'documents', label: 'Documents', icon: 'FileText' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!formData?.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!formData?.email?.trim()) newErrors.email = 'Email is required';
    if (!formData?.department) newErrors.department = 'Department is required';
    if (!formData?.role?.trim()) newErrors.role = 'Role is required';
    if (!formData?.hireDate) newErrors.hireDate = 'Hire date is required';

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const employeeData = {
        ...formData,
        name: `${formData?.firstName} ${formData?.lastName}`?.trim(),
        id: employee?.id || Date.now()
      };

      await onSave(employeeData);
      onClose();
    } catch (error) {
      console.error('Error saving employee:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const isReadOnly = mode === 'view';
  const modalTitle = mode === 'add' ? 'Add New Employee' : mode === 'edit' ? 'Edit Employee' : 'Employee Details';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name="User" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{modalTitle}</h2>
              {employee && (
                <p className="text-sm text-muted-foreground">ID: {employee?.id}</p>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 text-sm font-medium transition-colors ${activeTab === tab?.id
                  ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={formData?.avatar || employee?.avatar}
                    alt={`${formData?.firstName} ${formData?.lastName} profile picture`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {!isReadOnly && (
                  <div>
                    <Button variant="outline" size="sm" iconName="Upload">
                      Change Photo
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG or GIF. Max size 2MB.
                    </p>
                  </div>
                )}
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={formData?.firstName}
                  onChange={(e) => handleInputChange('firstName', e?.target?.value)}
                  error={errors?.firstName}
                  required
                  disabled={isReadOnly}
                />
                <Input
                  label="Last Name"
                  value={formData?.lastName}
                  onChange={(e) => handleInputChange('lastName', e?.target?.value)}
                  error={errors?.lastName}
                  required
                  disabled={isReadOnly}
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={formData?.email}
                  onChange={(e) => handleInputChange('email', e?.target?.value)}
                  error={errors?.email}
                  required
                  disabled={isReadOnly}
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  value={formData?.phone}
                  onChange={(e) => handleInputChange('phone', e?.target?.value)}
                  disabled={isReadOnly}
                />
              </div>
            </div>
          )}

          {activeTab === 'employment' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Department"
                  options={departments}
                  value={formData?.department}
                  onChange={(value) => handleInputChange('department', value)}
                  error={errors?.department}
                  required
                  disabled={isReadOnly}
                />
                <Input
                  label="Job Role"
                  value={formData?.role}
                  onChange={(e) => handleInputChange('role', e?.target?.value)}
                  error={errors?.role}
                  required
                  disabled={isReadOnly}
                />
                <Select
                  label="Employment Type"
                  options={employmentTypeOptions}
                  value={formData?.employmentType}
                  onChange={(value) => handleInputChange('employmentType', value)}
                  disabled={isReadOnly}
                />
                <Select
                  label="Status"
                  options={statusOptions}
                  value={formData?.status}
                  onChange={(value) => handleInputChange('status', value)}
                  disabled={isReadOnly}
                />
                <Input
                  label="Hire Date"
                  type="date"
                  value={formData?.hireDate}
                  onChange={(e) => handleInputChange('hireDate', e?.target?.value)}
                  error={errors?.hireDate}
                  required
                  disabled={isReadOnly}
                />
                <Select
                  label="Manager"
                  options={managerOptions}
                  value={formData?.manager}
                  onChange={(value) => handleInputChange('manager', value)}
                  disabled={isReadOnly}
                />
                <Select
                  label="Branch"
                  options={branchOptions}
                  value={formData?.branch}
                  onChange={(value) => handleInputChange('branch', value)}
                  disabled={isReadOnly}
                />
                <Input
                  label="Salary"
                  type="number"
                  value={formData?.salary}
                  onChange={(e) => handleInputChange('salary', e?.target?.value)}
                  disabled={isReadOnly}
                  placeholder="Annual salary in USD"
                />
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <Input
                  label="Address"
                  value={formData?.address}
                  onChange={(e) => handleInputChange('address', e?.target?.value)}
                  disabled={isReadOnly}
                  placeholder="Full address"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Emergency Contact Name"
                    value={formData?.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e?.target?.value)}
                    disabled={isReadOnly}
                  />
                  <Input
                    label="Emergency Contact Phone"
                    type="tel"
                    value={formData?.emergencyPhone}
                    onChange={(e) => handleInputChange('emergencyPhone', e?.target?.value)}
                    disabled={isReadOnly}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Document Management</h3>
                <p className="text-muted-foreground mb-4">
                  Upload and manage employee documents like contracts, certifications, and ID proofs.
                </p>
                {!isReadOnly && (
                  <Button variant="outline" iconName="Upload">
                    Upload Documents
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            {isReadOnly ? 'Close' : 'Cancel'}
          </Button>
          {!isReadOnly && (
            <Button
              variant="default"
              onClick={handleSave}
              loading={isLoading}
              iconName="Save"
              iconPosition="left"
            >
              {mode === 'add' ? 'Add Employee' : 'Save Changes'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;