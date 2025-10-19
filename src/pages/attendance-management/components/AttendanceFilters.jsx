import React from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const AttendanceFilters = ({ filters, onFilterChange, attendanceData }) => {
  const departments = [...new Set(attendanceData?.map(emp => emp?.department)?.filter(Boolean))];
  const locations = [...new Set(attendanceData?.map(emp => emp?.location)?.filter(Boolean))];

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'this_week', label: 'This Week' },
    { value: 'last_week', label: 'Last Week' },
    { value: 'this_month', label: 'This Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'present', label: 'Present' },
    { value: 'absent', label: 'Absent' },
    { value: 'late', label: 'Late' },
    { value: 'early_departure', label: 'Early Departure' }
  ];

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    ...departments?.map(dept => ({ value: dept, label: dept }))
  ];

  const locationOptions = [
    { value: 'all', label: 'All Locations' },
    ...locations?.map(loc => ({ value: loc, label: loc }))
  ];

  const handleReset = () => {
    onFilterChange({
      dateRange: 'today',
      department: 'all',
      status: 'all',
      location: 'all',
      search: ''
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Filters</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="text-muted-foreground hover:text-foreground"
        >
          <Icon name="RotateCcw" size={14} className="mr-1" />
          Reset
        </Button>
      </div>
      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Search Employee
          </label>
          <div className="relative">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name or ID..."
              value={filters?.search || ''}
              onChange={(e) => onFilterChange({ search: e?.target?.value })}
              className="pl-10"
            />
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Date Range
          </label>
          <Select
            value={filters?.dateRange}
            onValueChange={(value) => onFilterChange({ dateRange: value })}
          >
            {dateRangeOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Custom Date Range */}
        {filters?.dateRange === 'custom' && (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                From Date
              </label>
              <Input
                type="date"
                value={filters?.fromDate || ''}
                onChange={(e) => onFilterChange({ fromDate: e?.target?.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                To Date
              </label>
              <Input
                type="date"
                value={filters?.toDate || ''}
                onChange={(e) => onFilterChange({ toDate: e?.target?.value })}
              />
            </div>
          </div>
        )}

        {/* Department */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Department
          </label>
          <Select
            value={filters?.department}
            onValueChange={(value) => onFilterChange({ department: value })}
          >
            {departmentOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Status */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Attendance Status
          </label>
          <Select
            value={filters?.status}
            onValueChange={(value) => onFilterChange({ status: value })}
          >
            {statusOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Location */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Work Location
          </label>
          <Select
            value={filters?.location}
            onValueChange={(value) => onFilterChange({ location: value })}
          >
            {locationOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Quick Filters */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">
            Quick Filters
          </label>
          <div className="space-y-2">
            <button
              onClick={() => onFilterChange({ status: 'late' })}
              className="w-full flex items-center justify-between px-3 py-2 text-sm bg-warning/10 text-warning border border-warning/20 rounded-lg hover:bg-warning/20 transition-colors duration-150"
            >
              <span>Late Arrivals</span>
              <Icon name="Clock" size={14} />
            </button>
            
            <button
              onClick={() => onFilterChange({ status: 'absent' })}
              className="w-full flex items-center justify-between px-3 py-2 text-sm bg-error/10 text-error border border-error/20 rounded-lg hover:bg-error/20 transition-colors duration-150"
            >
              <span>Absent Today</span>
              <Icon name="UserX" size={14} />
            </button>
            
            <button
              onClick={() => onFilterChange({ location: 'WFH' })}
              className="w-full flex items-center justify-between px-3 py-2 text-sm bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors duration-150"
            >
              <span>Work From Home</span>
              <Icon name="Home" size={14} />
            </button>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(filters?.department !== 'all' || filters?.status !== 'all' || filters?.location !== 'all' || filters?.search) && (
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Active Filters
            </label>
            <div className="flex flex-wrap gap-2">
              {filters?.department !== 'all' && (
                <span className="inline-flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                  <span>{filters?.department}</span>
                  <button onClick={() => onFilterChange({ department: 'all' })}>
                    <Icon name="X" size={12} />
                  </button>
                </span>
              )}
              {filters?.status !== 'all' && (
                <span className="inline-flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                  <span>{filters?.status}</span>
                  <button onClick={() => onFilterChange({ status: 'all' })}>
                    <Icon name="X" size={12} />
                  </button>
                </span>
              )}
              {filters?.location !== 'all' && (
                <span className="inline-flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                  <span>{filters?.location}</span>
                  <button onClick={() => onFilterChange({ location: 'all' })}>
                    <Icon name="X" size={12} />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceFilters;