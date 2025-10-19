import React from 'react';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const AnalyticsFilters = ({ 
  selectedPeriod, 
  selectedDepartment, 
  onPeriodChange, 
  onDepartmentChange 
}) => {
  const periodOptions = [
    { value: 'daily', label: 'Daily View' },
    { value: 'weekly', label: 'Weekly View' },
    { value: 'monthly', label: 'Monthly View' },
    { value: 'quarterly', label: 'Quarterly View' }
  ];

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'sales', label: 'Sales' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' }
  ];

  const handleDateRangeSelect = () => {
    // Open date range picker
    console.log('Opening date range picker...');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6 card-shadow">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={18} className="text-primary" />
          <span className="font-medium text-foreground">Analytics Filters</span>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          {/* Period Selection */}
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Time Period
            </label>
            <Select
              value={selectedPeriod}
              onValueChange={onPeriodChange}
              options={periodOptions}
              placeholder="Select period"
              className="min-w-[140px]"
            />
          </div>

          {/* Department Selection */}
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Department
            </label>
            <Select
              value={selectedDepartment}
              onValueChange={onDepartmentChange}
              options={departmentOptions}
              placeholder="Select department"
              className="min-w-[160px]"
            />
          </div>

          {/* Custom Date Range */}
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Date Range
            </label>
            <button
              onClick={handleDateRangeSelect}
              className="flex items-center space-x-2 px-3 py-2 border border-border rounded-md hover:bg-muted/50 transition-colors duration-150 min-w-[120px]"
            >
              <Icon name="Calendar" size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground">Custom</span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-end space-x-2">
            <button
              className="flex items-center space-x-2 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-150"
              onClick={() => {
                onPeriodChange('monthly');
                onDepartmentChange('all');
              }}
            >
              <Icon name="RotateCcw" size={16} />
              <span className="text-sm">Reset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsFilters;