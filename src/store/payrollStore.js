import payrollService from "services/payroll.service";
import { create } from "zustand";


export const usePayrollStore = create((set) => ({

  payrolls: [],
  selectedPayroll: null,
  loading: false,

  fetchPayrolls: async (employeeId) => {
    set({ loading: true });

    try {
      const data = await payrollService.getEmployeePayrolls(employeeId);

      set({
        payrolls: data,
        loading: false
      });

    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },

  fetchPayrollById: async (id) => {

    try {
      const data = await payrollService.getPayrollById(id);

      set({
        selectedPayroll: data
      });

    } catch (error) {
      console.error(error);
    }
  }

}));