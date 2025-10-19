import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import AppImage from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AttendanceModal = ({ employee, onClose }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    checkInTime: employee?.checkInTime,
    checkOutTime: employee?.checkOutTime,
    breakDuration: employee?.breakDuration,
    location: employee?.location,
    notes: ''
  });

  const tabs = [
    { id: 'details', label: 'Details', icon: 'User' },
    { id: 'history', label: 'History', icon: 'Calendar' },
    { id: 'corrections', label: 'Corrections', icon: 'Edit' }
  ];

  const attendanceHistory = [
    { date: '2025-01-18', status: 'present', checkIn: '08:55 AM', checkOut: '05:30 PM', duration: '8h 5m' },
    { date: '2025-01-17', status: 'late', checkIn: '09:20 AM', checkOut: '06:00 PM', duration: '8h 10m' },
    { date: '2025-01-16', status: 'present', checkIn: '09:00 AM', checkOut: '05:45 PM', duration: '8h 15m' },
    { date: '2025-01-15', status: 'present', checkIn: '08:50 AM', checkOut: '05:30 PM', duration: '8h 10m' },
    { date: '2025-01-14', status: 'early_departure', checkIn: '09:05 AM', checkOut: '04:30 PM', duration: '6h 55m' }
  ];

  const getStatusBadge = (status) => {
    const configs = {
      present: { color: 'bg-success text-success-foreground', label: 'Present', icon: 'Check' },
      absent: { color: 'bg-error text-error-foreground', label: 'Absent', icon: 'X' },
      late: { color: 'bg-warning text-warning-foreground', label: 'Late', icon: 'Clock' },
      early_departure: { color: 'bg-orange-500 text-white', label: 'Early Out', icon: 'LogOut' }
    };
    
    const config = configs?.[status] || configs?.absent;
    
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={12} />
        <span>{config?.label}</span>
      </span>
    );
  };

  const handleSaveCorrection = () => {
    console.log('Saving attendance correction:', editData);
    setIsEditing(false);
    // Implement save logic
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <AppImage
              src={employee?.profileImage}
              alt={employee?.alt}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold text-foreground">{employee?.employeeName}</h2>
              <p className="text-sm text-muted-foreground">{employee?.employeeId} • {employee?.department}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {getStatusBadge(employee?.status)}
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors duration-150"
            >
              <Icon name="X" size={20} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors duration-150 ${
                activeTab === tab?.id
                  ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Today's Attendance */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Today's Attendance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Icon name="LogIn" size={18} className="text-success" />
                        <span className="font-medium text-foreground">Check In</span>
                      </div>
                      <span className="text-lg font-mono text-foreground">{employee?.checkInTime}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Icon name="LogOut" size={18} className="text-error" />
                        <span className="font-medium text-foreground">Check Out</span>
                      </div>
                      <span className="text-lg font-mono text-foreground">{employee?.checkOutTime}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Icon name="Clock" size={18} className="text-primary" />
                        <span className="font-medium text-foreground">Work Duration</span>
                      </div>
                      <span className="text-lg font-mono text-foreground">{employee?.workDuration}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Icon name="Coffee" size={18} className="text-warning" />
                        <span className="font-medium text-foreground">Break Duration</span>
                      </div>
                      <span className="text-lg font-mono text-foreground">{employee?.breakDuration}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location & Productivity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="MapPin" size={18} className="text-blue-500" />
                    <span className="font-medium text-foreground">Location</span>
                  </div>
                  <span className="text-lg text-foreground">{employee?.location}</span>
                </div>
                
                {employee?.productivity > 0 && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="TrendingUp" size={18} className="text-success" />
                      <span className="font-medium text-foreground">Productivity</span>
                    </div>
                    <span className="text-lg text-foreground">{employee?.productivity}%</span>
                  </div>
                )}
              </div>

              {employee?.reason && (
                <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Info" size={18} className="text-warning" />
                    <span className="font-medium text-foreground">Reason</span>
                  </div>
                  <p className="text-foreground">{employee?.reason}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Attendance History (Last 5 Days)</h3>
              <div className="space-y-3">
                {attendanceHistory?.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-foreground font-medium">
                        {new Date(record?.date)?.toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      {getStatusBadge(record?.status)}
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-muted-foreground font-mono">
                      <span>In: {record?.checkIn}</span>
                      <span>Out: {record?.checkOut}</span>
                      <span>Duration: {record?.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'corrections' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Attendance Corrections</h3>
                <Button
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? 'outline' : 'default'}
                >
                  {isEditing ? 'Cancel' : 'Make Correction'}
                </Button>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Check In Time</label>
                      <Input
                        type="time"
                        value={editData?.checkInTime?.replace(/[^\d:]/g, '') || ''}
                        onChange={(e) => setEditData({ ...editData, checkInTime: e?.target?.value })}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Check Out Time</label>
                      <Input
                        type="time"
                        value={editData?.checkOutTime?.replace(/[^\d:]/g, '') || ''}
                        onChange={(e) => setEditData({ ...editData, checkOutTime: e?.target?.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Correction Notes</label>
                    <textarea
                      rows={3}
                      value={editData?.notes}
                      onChange={(e) => setEditData({ ...editData, notes: e?.target?.value })}
                      placeholder="Explain the reason for this correction..."
                      className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveCorrection}>
                      Save Correction
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="Edit" size={48} className="mx-auto mb-3" />
                  <p>Click "Make Correction" to adjust attendance records</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceModal;