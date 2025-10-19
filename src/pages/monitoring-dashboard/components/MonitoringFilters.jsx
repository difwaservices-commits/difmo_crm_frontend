import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const MonitoringFilters = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState({
    department: '',
    workMode: '',
    dateRange: 'today',
    productivityThreshold: 70,
    status: ''
  });

  const departmentOptions = [
    { value: '', label: 'All Departments' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' },
    { value: 'design', label: 'Design' }
  ];

  const workModeOptions = [
    { value: '', label: 'All Work Modes' },
    { value: 'WFH', label: 'Work From Home' },
    { value: 'Office', label: 'Office' },
    { value: 'Client-site', label: 'Client Site' }
  ];

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'Active', label: 'Active' },
    { value: 'Idle', label: 'Idle' },
    { value: 'Away', label: 'Away' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  const resetFilters = () => {
    const defaultFilters = {
      department: '',
      workMode: '',
      dateRange: 'today',
      productivityThreshold: 70,
      status: ''
    };
    setFilters(defaultFilters);
    if (onFiltersChange) {
      onFiltersChange(defaultFilters);
    }
  };

  const exportData = () => {
    // Mock export functionality
    console.log('Exporting monitoring data with filters:', filters);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Monitoring Filters</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            iconName="RotateCcw"
            iconPosition="left"
          >
            Reset
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={exportData}
            iconName="Download"
            iconPosition="left"
          >
            Export
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Select
          label="Department"
          options={departmentOptions}
          value={filters?.department}
          onChange={(value) => handleFilterChange('department', value)}
          className="w-full"
        />

        <Select
          label="Work Mode"
          options={workModeOptions}
          value={filters?.workMode}
          onChange={(value) => handleFilterChange('workMode', value)}
          className="w-full"
        />

        <Select
          label="Date Range"
          options={dateRangeOptions}
          value={filters?.dateRange}
          onChange={(value) => handleFilterChange('dateRange', value)}
          className="w-full"
        />

        <Select
          label="Status"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => handleFilterChange('status', value)}
          className="w-full"
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Min Productivity: {filters?.productivityThreshold}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={filters?.productivityThreshold}
            onChange={(e) => handleFilterChange('productivityThreshold', parseInt(e?.target?.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
      {filters?.dateRange === 'custom' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
          <Input
            label="Start Date"
            type="date"
            className="w-full"
          />
          <Input
            label="End Date"
            type="date"
            className="w-full"
          />
        </div>
      )}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span>Showing results for: <span className="font-medium text-foreground">Today</span></span>
          <span>•</span>
          <span>Total Employees: <span className="font-medium text-foreground">24</span></span>
          <span>•</span>
          <span>Active Now: <span className="font-medium text-green-600">18</span></span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Clock" size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Last updated: 2 minutes ago</span>
        </div>
      </div>
    </div>
  );
};

export default MonitoringFilters;