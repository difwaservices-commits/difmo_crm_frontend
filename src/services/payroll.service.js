import apiClient from "api/client";


const payrollService = {

  getEmployeePayrolls: async (employeeId) => {
    const res = await apiClient.get(`/payroll/employee/${employeeId}`);
    return res.data;
  },

  getPayrollById: async (id) => {
    const res = await apiClient.get(`/payroll/${id}`);
    return res.data;
  }

};

export default payrollService;