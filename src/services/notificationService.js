import api from '../utils/api';

const notificationService = {
    // Send a notification
    send: async (data) => {
        const response = await api.post('/notifications/send', data);
        return response.data;
    },

    // Get history
    getHistory: async (companyId) => {
        const response = await api.get(`/notifications/history?companyId=${companyId}`);
        return response.data;
    },

    // Get stats
    getStats: async (companyId) => {
        const response = await api.get(`/notifications/stats?companyId=${companyId}`);
        return response.data;
    },

    // Get employees for recipient picker
    getEmployees: async (companyId) => {
        const response = await api.get(`/notifications/employees?companyId=${companyId}`);
        return response.data;
    },

    // Register FCM token
    saveFcmToken: async (token, platform = 'web', deviceId = null) => {
        const response = await api.post('/notifications/fcm-token', { token, platform, deviceId });
        return response.data;
    },

    // Remove FCM token (e.g., on logout)
    removeFcmToken: async (token) => {
        const response = await api.delete('/notifications/fcm-token', { data: { token } });
        return response.data;
    },
};

export default notificationService;
