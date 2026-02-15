import api from '../utils/api';

const timeTrackingService = {
    startTimer: async (data) => {
        const response = await api.post('/time-tracking/start', data);
        return response.data;
    },
    stopTimer: async (id, description) => {
        const response = await api.put(`/time-tracking/stop/${id}`, { description });
        return response.data;
    },
    getAll: async (employeeId) => {
        const response = await api.get(`/time-tracking?employeeId=${employeeId}`);
        return response.data;
    }
};

export default timeTrackingService;
