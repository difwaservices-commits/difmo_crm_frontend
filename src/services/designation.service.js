import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';

const designationService = {
    getAll: async (companyId) => {
        const response = await apiClient.get(API_ENDPOINTS.DESIGNATIONS.BASE, {
            params: { companyId }
        });
        return response.data;
    },
    create: async (data) => {
        const response = await apiClient.post(API_ENDPOINTS.DESIGNATIONS.BASE, data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await apiClient.put(API_ENDPOINTS.DESIGNATIONS.BY_ID(id), data);
        return response.data;
    },
    delete: async (id) => {
        const response = await apiClient.delete(API_ENDPOINTS.DESIGNATIONS.BY_ID(id));
        return response.data;
    }
};

export default designationService;
