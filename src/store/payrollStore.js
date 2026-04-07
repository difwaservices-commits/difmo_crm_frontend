import apiClient from "api/client";
import financeService from "services/finance.service";
import { create } from "zustand";

export const usePayrollStore = create((set) => ({
  payrolls: [],
  selectedPayroll: null,
  loading: false,
  error: null,

  fetchEmployeePayrolls: async (filters) => {
    // Agar filters string hai (sirf ID), toh object bana do
    const params = typeof filters === 'string' ? { employeeId: filters } : filters;

    if (!params || Object.keys(params).length === 0) {
      console.warn("fetchEmployeePayrolls: Filters missing.");
      return;
    }

    set({ loading: true, error: null });

    try {
      // NestJS backend usually expects month/year as numbers
      const res = await apiClient.get("/finance/payroll", { params });

      // Aapka interceptor data wrap kar raha hai (logs ke according)
      const payrollData = res.data?.data || res.data || [];

      set({
        payrolls: Array.isArray(payrollData) ? payrollData : [payrollData],
        loading: false
      });
    } catch (error) {
      set({
        payrolls: [],
        error: error.response?.data?.message || "Failed to fetch payroll",
        loading: false
      });
    }
},
  

  fetchPayrollById: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await financeService.getPayrollById(id);
      set({
        selectedPayroll: data,
        loading: false
      });
    } catch (error) {
      set({ error: "Failed to fetch details", loading: false });
    }
  },

  clearSelectedPayroll: () => set({ selectedPayroll: null, error: null })
}));