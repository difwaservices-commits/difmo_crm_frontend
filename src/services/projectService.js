import api from '../utils/api';

const taskService = {
    getAll: async (projectId) => {
        const response = await api.get(`/projects/tasks?projectId=${projectId}`);
        return response.data.data || response.data;
    },
    getAllByCompany: async (companyId) => {
        const response = await api.get(`/projects/tasks/company?companyId=${companyId}`);
        return response.data.data || response.data;
    },
    create: async (data) => {
        const response = await api.post('/projects/tasks', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/projects/tasks/${id}`, data);
        return response.data;
    }
};

const projectService = {
    getAll: async (companyId) => {
        const response = await api.get(`/projects?companyId=${companyId}`);
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/projects', data);
        return response.data;
    },
    getClients: async (companyId) => {
        const response = await api.get(`/projects/clients?companyId=${companyId}`);
        return response.data;
    }
};

export { taskService, projectService };
