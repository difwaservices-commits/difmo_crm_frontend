import api from '../utils/api';

export const accessControlService = {
    async getAllRoles(companyId) {
        const response = await api.get('/access-control/roles', { params: { companyId } });
        return response.data.data || response.data;
    },

    async getRoleById(id) {
        const response = await api.get(`/access-control/roles/${id}`);
        return response.data.data || response.data;
    },

    async createRole(roleData) {
        const response = await api.post('/access-control/roles', roleData);
        return response.data.data || response.data;
    },

    async updateRole(id, roleData) {
        const response = await api.put(`/access-control/roles/${id}`, roleData);
        return response.data.data || response.data;
    },

    async getAllPermissions() {
        const response = await api.get('/access-control/permissions');
        return response.data.data || response.data;
    },

    async seedPermissions() {
        const response = await api.post('/access-control/seed');
        return response.data;
    }
};

export default accessControlService;
