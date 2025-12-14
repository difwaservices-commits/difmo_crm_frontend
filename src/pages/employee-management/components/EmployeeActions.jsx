import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const EmployeeActions = ({
  selectedEmployees,
  onAddEmployee,
  onBulkAction,
  onImportEmployees,
  onExportEmployees
}) => {
  const [bulkAction, setBulkAction] = useState('');
  const [showBulkActions, setShowBulkActions] = useState(false);

  const bulkActionOptions = [
    { value: '', label: 'Select bulk action...' },
    { value: 'activate', label: 'Activate Selected' },
    { value: 'deactivate', label: 'Deactivate Selected' },
    { value: 'export', label: 'Export Selected' },
    { value: 'delete', label: 'Delete Selected' },
    { value: 'assign-manager', label: 'Assign Manager' },
    { value: 'change-department', label: 'Change Department' },
    { value: 'bulk-check-in', label: 'Bulk Check-in' },
    { value: 'send-notification', label: 'Send Notification' }
  ];

  const handleBulkAction = () => {
    if (bulkAction && selectedEmployees?.length > 0) {
      onBulkAction(bulkAction, selectedEmployees);
      setBulkAction('');
      setShowBulkActions(false);
    }
  };

  const handleFileImport = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      onImportEmployees(file);
      event.target.value = ''; // Reset file input
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Primary Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="default"
            onClick={onAddEmployee}
            iconName="Plus"
            iconPosition="left"
            className="w-full sm:w-auto"
          >
            Add Employee
          </Button>

          <div className="flex gap-2">
            {/* Import Button */}
            <div className="relative">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileImport}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="import-file"
              />
              <Button
                variant="outline"
                iconName="Upload"
                iconPosition="left"
                className="w-full sm:w-auto"
              >
                Import CSV
              </Button>
            </div>

            {/* Export Button */}
            <Button
              variant="outline"
              onClick={onExportEmployees}
              iconName="Download"
              iconPosition="left"
              className="w-full sm:w-auto"
            >
              Export
            </Button>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {selectedEmployees?.length > 0 && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="CheckSquare" size={16} />
              <span>{selectedEmployees?.length} selected</span>
            </div>
          )}

          {selectedEmployees?.length > 0 && (
            <div className="flex items-center space-x-2">
              <Select
                options={bulkActionOptions}
                value={bulkAction}
                onChange={setBulkAction}
                placeholder="Bulk actions..."
                className="w-48"
              />
              <Button
                variant="outline"
                onClick={handleBulkAction}
                disabled={!bulkAction}
                iconName="Play"
                iconPosition="left"
                size="sm"
              >
                Apply
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <p className="text-2xl font-semibold text-foreground">247</p>
          <p className="text-sm text-muted-foreground">Total Employees</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-success">234</p>
          <p className="text-sm text-muted-foreground">Active</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-warning">8</p>
          <p className="text-sm text-muted-foreground">Pending</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-error">5</p>
          <p className="text-sm text-muted-foreground">Inactive</p>
        </div>
      </div>
      {/* Help Text */}
      {selectedEmployees?.length === 0 && (
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <Icon name="Info" size={14} className="inline mr-1" />
            Select employees from the table below to perform bulk actions like activation, deactivation, or export.
          </p>
        </div>
      )}
    </div>
  );
};

export default EmployeeActions;