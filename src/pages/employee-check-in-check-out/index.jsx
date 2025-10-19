import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import CheckInOutWidget from './components/CheckInOutWidget';
import AttendanceStatus from './components/AttendanceStatus';
import BreakTracker from './components/BreakTracker';
import AttendanceHistory from './components/AttendanceHistory';
import AttendanceSummary from './components/AttendanceSummary';
import LocationVerification from './components/LocationVerification';


const EmployeeCheckInCheckOut = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendanceStatus, setAttendanceStatus] = useState({
    isCheckedIn: false,
    checkInTime: null,
    currentSessionDuration: '0h 0m',
    totalWorkToday: '0h 0m',
    breakTime: '0h 0m',
    isOnBreak: false,
    location: null,
    workMode: 'office'
  });
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    address: 'Detecting location...',
    verified: false
  });

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (attendanceStatus?.isCheckedIn && attendanceStatus?.checkInTime) {
        updateSessionDuration();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [attendanceStatus?.checkInTime]);

  // Get user location
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator?.geolocation) {
      navigator?.geolocation?.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position?.coords;
          setLocation({
            latitude,
            longitude,
            address: `${latitude?.toFixed(6)}, ${longitude?.toFixed(6)}`,
            verified: true
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocation({
            latitude: null,
            longitude: null,
            address: 'Location access denied',
            verified: false
          });
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setLocation({
        latitude: null,
        longitude: null,
        address: 'Location not supported',
        verified: false
      });
    }
  };

  const updateSessionDuration = () => {
    if (attendanceStatus?.checkInTime) {
      const now = new Date();
      const checkIn = new Date(attendanceStatus?.checkInTime);
      const diff = now - checkIn;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor(diff % (1000 * 60 * 60) / (1000 * 60));

      setAttendanceStatus((prev) => ({
        ...prev,
        currentSessionDuration: `${hours}h ${minutes}m`
      }));
    }
  };

  const handleCheckIn = (workMode, notes) => {
    const now = new Date();
    setAttendanceStatus((prev) => ({
      ...prev,
      isCheckedIn: true,
      checkInTime: now,
      workMode,
      location: location?.address,
      notes
    }));

    console.log('Checked in at:', now, 'Mode:', workMode, 'Location:', location);
  };

  const handleCheckOut = (notes) => {
    const now = new Date();
    const sessionDuration = attendanceStatus?.currentSessionDuration;

    setAttendanceStatus((prev) => ({
      ...prev,
      isCheckedIn: false,
      checkInTime: null,
      totalWorkToday: sessionDuration,
      currentSessionDuration: '0h 0m',
      checkOutNotes: notes
    }));

    console.log('Checked out at:', now, 'Total work today:', sessionDuration);
  };

  const handleBreakToggle = () => {
    setAttendanceStatus((prev) => ({
      ...prev,
      isOnBreak: !prev?.isOnBreak
    }));
  };

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const breadcrumbItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Check-in/Check-out', path: '/employee-check-in-check-out' }];


  // Mock employee data
  const employeeData = {
    name: 'John Doe',
    employeeId: 'EMP001',
    department: 'Engineering',
    shift: '9:00 AM - 6:00 PM',
    profileImage: "https://images.unsplash.com/photo-1663720527180-4c60a78fe3b7",
    alt: 'Professional headshot of John Doe, a software engineer with dark hair wearing a light blue shirt'
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={handleToggleSidebar} />
      <main className={`transition-all duration-300 ${
      sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pt-16 pb-20 lg:pb-8`
      }>
        <div className="p-6 max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <BreadcrumbNavigation items={breadcrumbItems} />
              <h1 className="text-3xl font-semibold text-foreground mb-2">Check-in/Check-out</h1>
              <p className="text-muted-foreground">
                Log your daily attendance with location verification and work status updates
              </p>
            </div>
            
            {/* Current Time Display */}
            <div className="mt-4 lg:mt-0 text-center lg:text-right">
              <div className="text-3xl font-mono font-semibold text-foreground">
                {currentTime?.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true
                })}
              </div>
              <div className="text-sm text-muted-foreground">
                {currentTime?.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Main Actions */}
            <div className="xl:col-span-2 space-y-6">
              {/* Check-in/Check-out Widget */}
              <CheckInOutWidget
                attendanceStatus={attendanceStatus}
                location={location}
                onCheckIn={handleCheckIn}
                onCheckOut={handleCheckOut}
                employeeData={employeeData} />


              {/* Current Status & Break Tracker */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AttendanceStatus
                  attendanceStatus={attendanceStatus}
                  currentTime={currentTime} />

                
                <BreakTracker
                  attendanceStatus={attendanceStatus}
                  onBreakToggle={handleBreakToggle} />

              </div>

              {/* Location Verification */}
              <LocationVerification
                location={location}
                onRefreshLocation={getCurrentLocation}
                workMode={attendanceStatus?.workMode} />


              {/* Attendance History */}
              <AttendanceHistory />
            </div>

            {/* Right Column - Summary & Stats */}
            <div className="xl:col-span-1">
              <AttendanceSummary
                attendanceStatus={attendanceStatus}
                employeeData={employeeData} />

            </div>
          </div>
        </div>
      </main>
    </div>);

};

export default EmployeeCheckInCheckOut;