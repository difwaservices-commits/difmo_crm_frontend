import api from '../utils/api';

const financeService = {
    getSummary: async (companyId) => {
        const response = await api.get(`/finance/summary?companyId=${companyId}`);
        return response.data;
    },
    getPayroll: async (companyId, month, year) => {
        const response = await api.get(`/finance/payroll?companyId=${companyId}&month=${month}&year=${year}`);
        return response.data;
    },
    getExpenses: async (companyId) => {
        const response = await api.get(`/finance/expenses?companyId=${companyId}`);
        return response.data;
    },
    createExpense: async (data) => {
        const response = await api.post('/finance/expenses', data);
        return response.data;
    }
};

export default financeService;
