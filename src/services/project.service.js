import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';

const taskService = {
    getAll: async (projectId) => {
        const response = await apiClient.get(`${API_ENDPOINTS.PROJECTS.BASE}/tasks`, {
            params: { projectId }
        });
        return response.data.data || response.data;
    },
    getAllByCompany: async (companyId) => {
        const response = await apiClient.get(`${API_ENDPOINTS.PROJECTS.BASE}/tasks/company`, {
            params: { companyId }
        });
        return response.data.data || response.data;
    },
    create: async (data) => {
        const response = await apiClient.post(`${API_ENDPOINTS.PROJECTS.BASE}/tasks`, data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await apiClient.put(`${API_ENDPOINTS.PROJECTS.BASE}/tasks/${id}`, data);
        return response.data;
    }
};

const projectService = {
    getAll: async (companyId) => {
        const response = await apiClient.get(API_ENDPOINTS.PROJECTS.BASE, {
            params: { companyId }
        });
        return response.data;
    },
    create: async (data) => {
        const response = await apiClient.post(API_ENDPOINTS.PROJECTS.BASE, data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await apiClient.put(`${API_ENDPOINTS.PROJECTS.BASE}/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await apiClient.delete(`${API_ENDPOINTS.PROJECTS.BASE}/${id}`);
        return response.data;
    },
    getClients: async (companyId) => {
        const response = await apiClient.get(`${API_ENDPOINTS.PROJECTS.BASE}/clients`, {
            params: { companyId }
        });
        return response.data;
    }
};

export { taskService, projectService };
