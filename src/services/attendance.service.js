import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';

export const attendanceService = {
    // Check in
    async checkIn(employeeId, location = '', notes = '', latitude = null, longitude = null) {
        const response = await apiClient.post(API_ENDPOINTS.ATTENDANCE.CHECK_IN, {
            employeeId,
            location,
            notes,
            latitude,
            longitude
        });
        return response.data.data || response.data;
    },

    // Bulk Check-in
    async bulkCheckIn(employeeIds, notes = '') {
        const response = await apiClient.post(API_ENDPOINTS.ATTENDANCE.BULK_CHECK_IN, {
            employeeIds,
            notes
        });
        return response.data.data || response.data;
    },

    // Check out
    async checkOut(attendanceId, notes = '', latitude = null, longitude = null) {
        const response = await apiClient.post(API_ENDPOINTS.ATTENDANCE.CHECK_OUT, {
            attendanceId,
            notes,
            latitude,
            longitude
        });
        return response.data.data || response.data;
    },

    // Get all attendance records with filters
    async getAll(filters = {}) {
        const response = await apiClient.get(API_ENDPOINTS.ATTENDANCE.BASE, { params: filters });
        const data = response.data.data || response.data;
        return Array.isArray(data) ? data : [];
    },

    // Get attendance by ID
    async getById(id) {
        const response = await apiClient.get(`${API_ENDPOINTS.ATTENDANCE.BASE}/${id}`);
        return response.data.data || response.data;
    },

    // Get today's attendance for an employee
    async getTodayAttendance(employeeId) {
        const response = await apiClient.get(API_ENDPOINTS.ATTENDANCE.TODAY(employeeId));
        if (response.data && response.data.data !== undefined) {
            return response.data.data;
        }
        return response.data;
    },

    // Get attendance analytics
    async getAnalytics(filters = {}) {
        const response = await apiClient.get(API_ENDPOINTS.ATTENDANCE.ANALYTICS, { params: filters });
        return response.data.data || response.data;
    },

    // Create manual attendance record
    async create(attendanceData) {
        const response = await apiClient.post(API_ENDPOINTS.ATTENDANCE.BASE, attendanceData);
        return response.data.data || response.data;
    },

    // Get attendance for date range
    async getByDateRange(startDate, endDate, employeeId = null) {
        const params = { startDate, endDate };
        if (employeeId) {
            params.employeeId = employeeId;
        }
        const response = await apiClient.get(API_ENDPOINTS.ATTENDANCE.BASE, { params });
        const data = response.data.data || response.data;
        return Array.isArray(data) ? data : [];
    }
};

export default attendanceService;
