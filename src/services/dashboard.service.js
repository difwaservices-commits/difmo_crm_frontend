import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';

const dashboardService = {
    getMetrics: async (companyId) => {
        const response = await apiClient.get(`${API_ENDPOINTS.DASHBOARD.STATS}/metrics`, {
            params: { companyId }
        });
        return response.data;
    }
};

export default dashboardService;
