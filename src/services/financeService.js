import api from '../utils/api';

const financeService = {
    getSummary: async (companyId, month, year, currency) => {
        let url = `/finance/summary?companyId=${companyId}`;
        if (month) url += `&month=${month}`;
        if (year) url += `&year=${year}`;
        if (currency) url += `&currency=${currency}`;
        const response = await api.get(url);
        return response.data;
    },
    getPayroll: async (companyId, month, year) => {
        const response = await api.get(`/finance/payroll?companyId=${companyId}&month=${month}&year=${year}`);
        return response.data;
    },
    getExpenses: async (companyId, currency) => {
        let url = `/finance/expenses?companyId=${companyId}`;
        if (currency) url += `&currency=${currency}`;
        const response = await api.get(url);
        return response.data;
    },
    createExpense: async (data) => {
        const response = await api.post('/finance/expenses', data);
        return response.data;
    }
};

export default financeService;
