import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, LogIn, LogOut, Clock, AlertCircle } from 'lucide-react';
import attendanceService from '../services/attendanceService';

const AttendanceHistory = ({ employeeId }) => {
    const [attendanceList, setAttendanceList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [selectedStatus, setSelectedStatus] = useState('all');

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'present', label: 'Present' },
        { value: 'absent', label: 'Absent' },
        { value: 'late', label: 'Late' },
        { value: 'half_day', label: 'Half Day' },
    ];

    useEffect(() => {
        if (employeeId) {
            fetchAttendance();
        }
    }, [employeeId, selectedMonth, selectedStatus]);

    const fetchAttendance = async () => {
        setIsLoading(true);
        try {
            // Calculate start and end date for the selected month
            const startDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
            const endDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);

            const startStr = startDate.toISOString().split('T')[0];
            const endStr = endDate.toISOString().split('T')[0];

            // Note: attendanceService.getAttendanceHistory might need to be implemented or we use getByDateRange
            // Based on existing service, getByDateRange takes startDate, endDate, employeeId
            const rawData = await attendanceService.getByDateRange(startStr, endStr, employeeId);

            let data = [];
            if (Array.isArray(rawData)) {
                data = rawData;
            } else if (rawData?.data && Array.isArray(rawData.data)) {
                data = rawData.data;
            } else {
                console.warn('Unexpected attendance data format:', rawData);
                data = [];
            }

            let filteredData = data;
            if (selectedStatus !== 'all') {
                filteredData = data.filter(item => item.status?.toLowerCase() === selectedStatus);
            }

            setAttendanceList(filteredData);
        } catch (error) {
            console.error('Error fetching history:', error);
            setAttendanceList([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMonthChange = (e) => {
        const [year, month] = e.target.value.split('-');
        setSelectedMonth(new Date(year, month - 1));
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'present': return 'text-green-600 bg-green-50';
            case 'absent': return 'text-red-600 bg-red-50';
            case 'late': return 'text-orange-600 bg-orange-50';
            case 'half_day': return 'text-purple-600 bg-purple-50';
            default: return 'text-blue-600 bg-blue-50';
        }
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '--:--';
        // Assuming timeStr is HH:mm:ss or similar
        try {
            const [hours, minutes] = timeStr.split(':');
            const date = new Date();
            date.setHours(parseInt(hours), parseInt(minutes));
            return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        } catch (e) {
            return timeStr;
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'short' });
    };

    const calculateHours = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return '--';
        // Simplified calculation, assuming checkIn/checkOut are time strings on the same day
        // Ideally the API returns workHours
        return ''; // Placeholder if not available, or rely on API provided 'workHours'
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-white">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Attendance History</h2>
                <div className="flex gap-3">
                    {/* Month Selector */}
                    <div className="relative flex-1">
                        <input
                            type="month"
                            value={`${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}`}
                            onChange={handleMonthChange}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>

                    {/* Status Selector */}
                    <div className="relative flex-1">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                        >
                            {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>
            </div>

            <div className="max-h-[500px] overflow-y-auto p-4 bg-gray-50">
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : attendanceList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                        <AlertCircle size={48} className="mb-3 opacity-50" />
                        <p>No attendance records found</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {attendanceList.map((item, index) => (
                            <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-semibold text-gray-900">
                                        {formatDate(item.date)}
                                    </span>
                                    <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${getStatusColor(item.status || 'Present')}`}>
                                        {item.status || 'Present'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex flex-col items-center flex-1">
                                        <div className="flex items-center text-gray-500 mb-1">
                                            <LogIn size={14} className="text-green-500 mr-1" />
                                            <span className="text-xs">Check In</span>
                                        </div>
                                        <span className="font-semibold text-gray-900">{formatTime(item.checkInTime)}</span>
                                    </div>

                                    <div className="w-px h-8 bg-gray-100 mx-2"></div>

                                    <div className="flex flex-col items-center flex-1">
                                        <div className="flex items-center text-gray-500 mb-1">
                                            <LogOut size={14} className="text-orange-500 mr-1" />
                                            <span className="text-xs">Check Out</span>
                                        </div>
                                        <span className="font-semibold text-gray-900">{formatTime(item.checkOutTime)}</span>
                                    </div>

                                    <div className="w-px h-8 bg-gray-100 mx-2"></div>

                                    <div className="flex flex-col items-center flex-1">
                                        <div className="flex items-center text-gray-500 mb-1">
                                            <Clock size={14} className="text-blue-500 mr-1" />
                                            <span className="text-xs">Hrs</span>
                                        </div>
                                        <span className="font-semibold text-gray-900">{item.workHours ? `${item.workHours}h` : '--'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendanceHistory;
