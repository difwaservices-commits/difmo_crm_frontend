import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import AppImage from '../../../components/AppImage';
import AttendanceModal from './AttendanceModal';

const AttendanceTable = ({ 
  attendanceData, 
  loading, 
  selectedEmployees, 
  onSelectionChange 
}) => {
  const [sortField, setSortField] = useState('employeeName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedEmployees?.length === attendanceData?.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(attendanceData?.map(emp => emp?.id));
    }
  };

  const handleSelectEmployee = (id) => {
    if (selectedEmployees?.includes(id)) {
      onSelectionChange(selectedEmployees?.filter(empId => empId !== id));
    } else {
      onSelectionChange([...selectedEmployees, id]);
    }
  };

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const getStatusBadge = (status, reason) => {
    const statusConfig = {
      present: { color: 'bg-success text-success-foreground', label: 'Present', icon: 'Check' },
      absent: { color: 'bg-error text-error-foreground', label: 'Absent', icon: 'X' },
      late: { color: 'bg-warning text-warning-foreground', label: 'Late', icon: 'Clock' },
      early_departure: { color: 'bg-orange-500 text-white', label: 'Early Out', icon: 'LogOut' }
    };

    const config = statusConfig?.[status] || statusConfig?.absent;

    return (
      <div className="flex flex-col items-start">
        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
          <Icon name={config?.icon} size={12} />
          <span>{config?.label}</span>
        </span>
        {reason && (
          <span className="text-xs text-muted-foreground mt-1">{reason}</span>
        )}
      </div>
    );
  };

  const getProductivityBadge = (productivity) => {
    if (productivity >= 90) return 'bg-success text-success-foreground';
    if (productivity >= 75) return 'bg-warning text-warning-foreground';
    if (productivity >= 60) return 'bg-orange-500 text-white';
    return 'bg-error text-error-foreground';
  };

  const sortedData = [...(attendanceData || [])]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];
    
    if (typeof aValue === 'string') {
      aValue = aValue?.toLowerCase();
      bValue = bValue?.toLowerCase();
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const SortableHeader = ({ field, children }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-accent transition-colors duration-150"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <Icon 
          name={sortField === field && sortDirection === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
          size={14}
          className={sortField === field ? 'text-primary' : 'text-muted-foreground/50'}
        />
      </div>
    </th>
  );

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <Icon name="Loader2" size={20} className="animate-spin text-primary" />
            <span className="text-muted-foreground">Loading attendance data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedEmployees?.length === attendanceData?.length && attendanceData?.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
                  />
                </th>
                <SortableHeader field="employeeName">Employee</SortableHeader>
                <SortableHeader field="department">Department</SortableHeader>
                <SortableHeader field="checkInTime">Check In</SortableHeader>
                <SortableHeader field="checkOutTime">Check Out</SortableHeader>
                <SortableHeader field="workDuration">Work Duration</SortableHeader>
                <SortableHeader field="status">Status</SortableHeader>
                <SortableHeader field="location">Location</SortableHeader>
                <SortableHeader field="productivity">Productivity</SortableHeader>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {sortedData?.map((employee) => (
                <tr 
                  key={employee?.id} 
                  className="hover:bg-accent/50 transition-colors duration-150 cursor-pointer"
                  onClick={() => handleEmployeeClick(employee)}
                >
                  <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e?.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedEmployees?.includes(employee?.id)}
                      onChange={() => handleSelectEmployee(employee?.id)}
                      className="rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <AppImage
                          src={employee?.profileImage}
                          alt={employee?.alt}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-foreground">{employee?.employeeName}</div>
                        <div className="text-sm text-muted-foreground">{employee?.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground">{employee?.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground font-mono">
                      {employee?.checkInTime}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground font-mono">
                      {employee?.checkOutTime}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground font-mono">
                      {employee?.workDuration}
                    </div>
                    {employee?.overtime !== '0m' && employee?.overtime !== '--' && (
                      <div className="text-xs text-orange-500">+{employee?.overtime} OT</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(employee?.status, employee?.reason)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <Icon 
                        name={employee?.location === 'Office' ? 'Building' : employee?.location === 'WFH' ? 'Home' : 'MapPin'} 
                        size={14} 
                        className="text-muted-foreground" 
                      />
                      <span className="text-sm text-foreground">{employee?.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {employee?.productivity > 0 && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProductivityBadge(employee?.productivity)}`}>
                        {employee?.productivity}%
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e?.stopPropagation()}>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEmployeeClick(employee)}
                        className="text-primary hover:text-primary/80 transition-colors duration-150"
                        title="View Details"
                      >
                        <Icon name="Eye" size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e?.stopPropagation();
                          console.log('Edit attendance for:', employee?.employeeName);
                        }}
                        className="text-muted-foreground hover:text-foreground transition-colors duration-150"
                        title="Edit Attendance"
                      >
                        <Icon name="Edit" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {attendanceData?.length === 0 && (
            <div className="text-center py-12">
              <Icon name="Users" size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No attendance records found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or check back later.</p>
            </div>
          )}
        </div>
      </div>
      {/* Attendance Modal */}
      {showModal && (
        <AttendanceModal
          employee={selectedEmployee}
          onClose={() => {
            setShowModal(false);
            setSelectedEmployee(null);
          }}
        />
      )}
    </>
  );
};

export default AttendanceTable;