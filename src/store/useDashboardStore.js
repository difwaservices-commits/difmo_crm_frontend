import { create } from 'zustand';
import dashboardService from '../services/dashboard.service';

const useDashboardStore = create((set, get) => ({
    metrics: {
        totalEmployees: 0,
        presentToday: 0,
        tasksCompleted: 0,
        avgProductivity: 0,
    },
    loading: false,
    error: null,

    fetchMetrics: async (companyId) => {
        if (!companyId) return;
        set({ loading: true, error: null });
        try {
            const data = await dashboardService.getMetrics(companyId);
            set({ metrics: data.data || data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    refreshDashboard: async (companyId) => {
        await get().fetchMetrics(companyId);
    }
}));

export default useDashboardStore;
