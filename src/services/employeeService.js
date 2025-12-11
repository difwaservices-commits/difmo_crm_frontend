import api from '../utils/api';

export const employeeService = {
    // Get all employees with optional filters
    async getAll(filters = {}) {
        const response = await api.get('/employees', { params: filters });
        const data = response.data.data || response.data;
        // Ensure we always return an array
        return Array.isArray(data) ? data : [];
    },

    // Get single employee by ID
    async getById(id) {
        const response = await api.get(`/employees/${id}`);
        return response.data.data || response.data;
    },

    // Create new employee
    async create(employeeData) {
        const response = await api.post('/employees', employeeData);
        return response.data.data || response.data;
    },

    // Update employee
    async update(id, employeeData) {
        const response = await api.put(`/employees/${id}`, employeeData);
        return response.data.data || response.data;
    },

    // Delete employee
    async delete(id) {
        const response = await api.delete(`/employees/${id}`);
        return response.data;
    },

    // Get employee count
    async getCount(companyId) {
        const response = await api.get('/employees/stats/count', {
            params: { companyId }
        });
        return response.data.data || response.data;
    },

    // Search employees
    async search(searchTerm, filters = {}) {
        const response = await api.get('/employees', {
            params: { search: searchTerm, ...filters }
        });
        return response.data.data || response.data;
    }
};

export default employeeService;
