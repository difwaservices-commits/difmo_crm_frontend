import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import attendanceService from '../../../services/attendanceService';
import Icon from '../../../components/AppIcon';
import { formatTime12h } from '../../../utils/dateUtils';

const AttendanceHistoryModal = ({ isOpen, onClose, employee }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

    useEffect(() => {
        if (isOpen && employee) {
            fetchHistory();
        }
    }, [isOpen, employee, month]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            // Calculate start and end of selected month
            const [year, m] = month.split('-');
            const startDate = `${year}-${m}-01`;
            const endDate = new Date(year, m, 0).toISOString().split('T')[0]; // Last day of month

            const data = await attendanceService.getAll({
                employeeId: employee.employeeId || employee.id, // Handle both employee object structures
                startDate,
                endDate
            });

            // Handle array or object response
            const records = Array.isArray(data) ? data : data?.data || [];
            setHistory(records);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };



    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card w-full max-w-4xl rounded-lg shadow-lg border border-border animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">
                            {employee?.user ? `${employee.user.firstName} ${employee.user.lastName}` : (employee?.employeeName || employee?.name || 'Employee')}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Code: {employee?.employeeCode || 'N/A'} | Department: {employee?.department?.name || employee?.department || 'N/A'}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 border-b border-border flex items-center space-x-4">
                    <label className="text-sm font-medium text-foreground">Filter by Month:</label>
                    <input
                        type="month"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Icon name="Loader2" size={24} className="animate-spin text-primary" />
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            No records found for this month.
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-border">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Date</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Check In</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Check Out</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Work Hours</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Notes</th>
                                </tr>
                            </thead>
                            <tbody className="bg-card divide-y divide-border">
                                {history.map((record) => (
                                    <tr key={record.id} className="hover:bg-accent/50">
                                        <td className="px-4 py-3 text-sm text-foreground">{formatDate(record.date)}</td>
                                        <td className="px-4 py-3 text-sm font-mono text-foreground">{formatTime12h(record.checkInTime)}</td>
                                        <td className="px-4 py-3 text-sm font-mono text-foreground">{formatTime12h(record.checkOutTime)}</td>
                                        <td className="px-4 py-3 text-sm text-foreground">{record.workHours ? `${record.workHours}h` : '--'}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium 
                                                ${record.status === 'present' ? 'bg-green-100 text-green-700' :
                                                    record.status === 'late' ? 'bg-yellow-100 text-yellow-700' :
                                                        record.status === 'early_departure' ? 'bg-orange-100 text-orange-700' :
                                                            record.status === 'absent' ? 'bg-red-100 text-red-700' :
                                                                'bg-gray-100 text-gray-700'}`}>
                                                {record.status?.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground truncate max-w-xs" title={record.notes}>
                                            {record.notes || '--'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttendanceHistoryModal;
