import api from '../utils/api';

const dashboardService = {
    getMetrics: async (companyId) => {
        const response = await api.get(`/dashboard/metrics?companyId=${companyId}`);
        return response.data;
    }
};

export default dashboardService;
