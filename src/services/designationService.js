import api from '../utils/api';

const designationService = {
    getAll: async (companyId) => {
        const response = await api.get(`/designations?companyId=${companyId}`);
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/designations', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/designations/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/designations/${id}`);
        return response.data;
    }
};

export default designationService;
