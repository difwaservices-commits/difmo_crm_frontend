import api from '../utils/api';

export const attendanceService = {
    // Check in
    async checkIn(employeeId, location = '', notes = '') {
        const response = await api.post('/attendance/check-in', {
            employeeId,
            location,
            notes
        });
        return response.data.data || response.data;
    },

    // Check out
    async checkOut(attendanceId, notes = '') {
        console.log('[AttendanceService] Checking out:', { attendanceId, notes });
        const response = await api.post('/attendance/check-out', {
            attendanceId,
            notes
        });
        return response.data.data || response.data;
    },

    // Get all attendance records with filters
    async getAll(filters = {}) {
        const response = await api.get('/attendance', { params: filters });
        return response.data.data || response.data;
    },

    // Get attendance by ID
    async getById(id) {
        const response = await api.get(`/attendance/${id}`);
        return response.data.data || response.data;
    },

    // Get today's attendance for an employee
    async getTodayAttendance(employeeId) {
        const response = await api.get(`/attendance/today/${employeeId}`);
        return response.data.data || response.data;
    },

    // Get attendance analytics
    async getAnalytics(filters = {}) {
        const response = await api.get('/attendance/analytics', { params: filters });
        return response.data.data || response.data;
    },

    // Create manual attendance record
    async create(attendanceData) {
        const response = await api.post('/attendance', attendanceData);
        return response.data.data || response.data;
    },

    // Get attendance for date range
    async getByDateRange(startDate, endDate, employeeId = null) {
        const params = { startDate, endDate };
        if (employeeId) {
            params.employeeId = employeeId;
        }
        const response = await api.get('/attendance', { params });
        return response.data.data || response.data;
    }
};

export default attendanceService;
