import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';

const timeTrackingService = {
    startTimer: async (data) => {
        const response = await apiClient.post(`${API_ENDPOINTS.TIME_TRACKING.BASE}/start`, data);
        return response.data;
    },
    stopTimer: async (id, description) => {
        const response = await apiClient.put(`${API_ENDPOINTS.TIME_TRACKING.BASE}/stop/${id}`, { description });
        return response.data;
    },
    getAll: async (employeeId) => {
        const response = await apiClient.get(API_ENDPOINTS.TIME_TRACKING.BASE, {
            params: { employeeId }
        });
        return response.data;
    }
};

export default timeTrackingService;
