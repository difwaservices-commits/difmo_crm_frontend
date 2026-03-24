import React, { useEffect } from "react";

import useAuthStore from "../../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { usePayrollStore } from "store/payrollStore";

const EmployeePayrollPage = () => {

    const navigate = useNavigate();
    const { user } = useAuthStore();

    const { payrolls, fetchPayrolls } = usePayrollStore();

    useEffect(() => {

        if (user?.employeeId) {
            fetchPayrolls(user.employeeId);
        }

    }, [user]);

    return (
        <div className="p-6">

          <div className="bg-white px-8 py-6 flex items-center justify-between border-b border-gray-100 shadow-sm">
  <div>
    <h2 className="text-xl font-bold text-gray-800 tracking-tight">
      My Payroll
    </h2>
    <p className="text-sm text-gray-500">View your latest statements and tax info</p>
  </div>
  
  <button className="text-sm font-semibold px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all shadow-md active:scale-95">
    View Payroll
  </button>
</div>

            <div className="bg-white shadow rounded-lg">

                {payrolls.map((p) => (

                    <div
                        key={p.id}
                        className="flex justify-between items-center border-b p-4"
                    >

                        <div>
                            <p className="font-medium">{p.month}</p>
                            <p className="text-sm text-gray-500">
                                Net Salary: ₹{p.netSalary}
                            </p>
                        </div>

                        <div className="flex gap-3">

                            <button
                                onClick={() => navigate(`/employee/payroll/${p.id}`)}
                                className="text-blue-600"
                            >
                                View
                            </button>

                            <button
                                onClick={() => window.open(`/payroll/${p.id}/slip`)}
                                className="text-green-600"
                            >
                                Download
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
};

export default EmployeePayrollPage;