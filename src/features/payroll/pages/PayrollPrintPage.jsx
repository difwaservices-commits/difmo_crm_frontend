import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { usePayrollStore } from "../store/payrollStore";

const PayrollPrintPage = () => {

  const { id } = useParams();

  const { selectedPayroll, fetchPayrollById } = usePayrollStore();

  useEffect(() => {

    fetchPayrollById(id);

    setTimeout(() => {
      window.print();
    }, 1000);

  }, [id]);

  if (!selectedPayroll) return null;

  return (
    <div className="p-8">

      <h2 className="text-xl font-bold mb-4">
        Salary Slip
      </h2>

      <p>Employee: {selectedPayroll.employeeName}</p>
      <p>Month: {selectedPayroll.month}</p>

      <p>Net Salary: ₹{selectedPayroll.netSalary}</p>

    </div>
  );
};

export default PayrollPrintPage;