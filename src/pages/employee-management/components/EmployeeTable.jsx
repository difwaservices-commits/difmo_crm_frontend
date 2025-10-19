import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const EmployeeTable = ({ 
  employees, 
  selectedEmployees, 
  onSelectEmployee, 
  onSelectAll, 
  onEditEmployee, 
  onViewEmployee, 
  onDeleteEmployee,
  sortConfig,
  onSort 
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  const getSortIcon = (column) => {
    if (sortConfig?.key !== column) return 'ArrowUpDown';
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-success/10 text-success border-success/20', label: 'Active' },
      inactive: { color: 'bg-error/10 text-error border-error/20', label: 'Inactive' },
      pending: { color: 'bg-warning/10 text-warning border-warning/20', label: 'Pending' },
      terminated: { color: 'bg-muted text-muted-foreground border-border', label: 'Terminated' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.active;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedEmployees?.length === employees?.length && employees?.length > 0}
                  onChange={onSelectAll}
                  className="rounded border-border text-primary focus:ring-primary"
                />
              </th>
              {[
                { key: 'name', label: 'Employee' },
                { key: 'department', label: 'Department' },
                { key: 'role', label: 'Role' },
                { key: 'status', label: 'Status' },
                { key: 'hireDate', label: 'Hire Date' },
                { key: 'manager', label: 'Manager' }
              ]?.map((column) => (
                <th key={column?.key} className="px-4 py-3 text-left">
                  <button
                    onClick={() => onSort(column?.key)}
                    className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span>{column?.label}</span>
                    <Icon name={getSortIcon(column?.key)} size={14} />
                  </button>
                </th>
              ))}
              <th className="w-24 px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {employees?.map((employee) => (
              <tr
                key={employee?.id}
                className="hover:bg-muted/30 transition-colors"
                onMouseEnter={() => setHoveredRow(employee?.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedEmployees?.includes(employee?.id)}
                    onChange={() => onSelectEmployee(employee?.id)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={employee?.avatar}
                        alt={employee?.avatarAlt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{employee?.name}</p>
                      <p className="text-xs text-muted-foreground">{employee?.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-foreground">{employee?.department}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-foreground">{employee?.role}</span>
                </td>
                <td className="px-4 py-4">
                  {getStatusBadge(employee?.status)}
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-muted-foreground">{formatDate(employee?.hireDate)}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-foreground">{employee?.manager}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewEmployee(employee)}
                      className="h-8 w-8"
                    >
                      <Icon name="Eye" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditEmployee(employee)}
                      className="h-8 w-8"
                    >
                      <Icon name="Edit" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteEmployee(employee?.id)}
                      className="h-8 w-8 text-error hover:text-error"
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4 p-4">
        {employees?.map((employee) => (
          <div key={employee?.id} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedEmployees?.includes(employee?.id)}
                  onChange={() => onSelectEmployee(employee?.id)}
                  className="rounded border-border text-primary focus:ring-primary mt-1"
                />
                <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={employee?.avatar}
                    alt={employee?.avatarAlt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{employee?.name}</p>
                  <p className="text-xs text-muted-foreground">{employee?.email}</p>
                </div>
              </div>
              {getStatusBadge(employee?.status)}
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div>
                <p className="text-muted-foreground">Department</p>
                <p className="text-foreground font-medium">{employee?.department}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Role</p>
                <p className="text-foreground font-medium">{employee?.role}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Hire Date</p>
                <p className="text-foreground font-medium">{formatDate(employee?.hireDate)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Manager</p>
                <p className="text-foreground font-medium">{employee?.manager}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewEmployee(employee)}
                iconName="Eye"
                iconPosition="left"
              >
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditEmployee(employee)}
                iconName="Edit"
                iconPosition="left"
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeleteEmployee(employee?.id)}
                iconName="Trash2"
                iconPosition="left"
                className="text-error hover:text-error"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
      {employees?.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No employees found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;