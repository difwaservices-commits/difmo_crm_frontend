import React, { useState, useEffect } from 'react';
import { Clock, MapPin, CheckCircle, XCircle, LogOut } from 'lucide-react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import attendanceService from '../../services/attendanceService';
import employeeService from '../../services/employeeService';
import useAuthStore from '../../store/useAuthStore';
import AttendanceHistory from '../../components/AttendanceHistory';
import { useNavigate } from 'react-router-dom';

const QuickAttendance = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [notes, setNotes] = useState('');
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  // Time state
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchEmployeeAndAttendance();
    }
  }, [user, isAuthenticated]);

  const fetchEmployeeAndAttendance = async () => {
    if (!isAuthenticated || !user?.id) return;
    try {
      setLoading(true);
      // Get employee record for current user
      const employees = await employeeService.getAll({ userId: user.id });
      if (employees && employees.length > 0) {
        const emp = employees[0];
        setEmployee(emp);

        // Get today's attendance
        const attendance = await attendanceService.getTodayAttendance(emp.id);
        setTodayAttendance(attendance);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getGeolocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            reject(error);
          }
        );
      }
    });
  };

  const handleCheckIn = async () => {
    if (!employee) {
      alert('Employee record not found');
      return;
    }

    try {
      setLoading(true);
      const coords = await getGeolocation();

      await attendanceService.checkIn(
        employee.id,
        locationName || 'Unknown Location',
        notes,
        coords.latitude,
        coords.longitude
      );

      alert('Checked in successfully!');
      await fetchEmployeeAndAttendance();
      setLocationName('');
      setNotes('');
    } catch (err) {
      console.error('Error checking in:', err);
      if (err.code === 1) { // Permission denied
        alert('Please allow location access to check in.');
      } else {
        alert('Failed to check in. ' + (err.message || ''));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!todayAttendance) {
      alert('No check-in record found for today');
      return;
    }

    try {
      setLoading(true);
      const coords = await getGeolocation();

      await attendanceService.checkOut(
        todayAttendance.id,
        notes,
        coords.latitude,
        coords.longitude
      );

      alert('Checked out successfully!');
      await fetchEmployeeAndAttendance();
      setNotes('');
    } catch (err) {
      console.error('Error checking out:', err);
      if (err.code === 1) {
        alert('Please allow location access to check out.');
      } else {
        alert('Failed to check out. ' + (err.message || ''));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-like Header */}
      <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-8 w-8" />
          <div>
            <h1 className="text-lg font-bold text-gray-900">Difmo CRM</h1>
            <p className="text-xs text-gray-500">Employee Portal</p>
          </div>
        </div>
        <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-600 transition-colors">
          <LogOut size={20} />
        </button>
      </div>

      <main className="p-4 max-w-md mx-auto space-y-6 pb-24">
        {/* Welcome Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hello, {user?.name || 'Employee'}!</h2>
          <p className="text-gray-500">Mark your attendance for today</p>
        </div>

        {/* Clock Card */}
        <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-10 -mb-10"></div>

          <div className="relative z-10 flex flex-col items-center justify-center py-4">
            <Clock className="w-8 h-8 mb-3 opacity-80" />
            <h3 className="text-5xl font-bold mb-1">
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).split(' ')[0]}
              <span className="text-xl ml-1">{currentTime.toLocaleTimeString('en-US', { hour12: true }).split(' ')[1]}</span>
            </h3>
            <p className="text-blue-100">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Action Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          {todayAttendance ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Check In Time</p>
                  <p className="font-bold text-gray-900 flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    {todayAttendance.checkInTime}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md">
                    PRESENT
                  </span>
                </div>
              </div>

              {!todayAttendance.checkOutTime ? (
                <>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Leaving for..."
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      rows={2}
                    />
                  </div>
                  <button
                    onClick={handleCheckOut}
                    disabled={loading}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? 'Processing...' : (
                      <>
                        <LogOut size={20} />
                        Check Out
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Check Out Time</p>
                    <p className="font-bold text-gray-900 flex items-center gap-2">
                      <CheckCircle size={16} className="text-orange-500" />
                      {todayAttendance.checkOutTime}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Work Hours</p>
                    <p className="font-bold text-gray-900">{todayAttendance.workHours} hrs</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="Office, Home, etc."
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any notes for today..."
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  rows={2}
                />
              </div>

              <button
                onClick={handleCheckIn}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Processing...' : (
                  <>
                    <CheckCircle size={20} />
                    Check In
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* History Section */}
        {employee && <AttendanceHistory employeeId={employee.id} />}

      </main>
    </div>
  );
};

export default QuickAttendance;