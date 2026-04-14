import React from 'react';
import Icon from '../../../components/AppIcon';

const FinancialSummaryCard = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white p-8 h-[280px] animate-pulse">
        <div className="h-6 w-48 bg-slate-100 rounded-lg mb-8"></div>
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="h-24 bg-slate-50 rounded-xl"></div>
          <div className="h-24 bg-slate-50 rounded-xl"></div>
        </div>
        <div className="h-3 w-full bg-slate-50 rounded-full"></div>
      </div>
    );
  }

  if (!data) return null;

  const { totalPayroll, totalExpenses, outgoingTotal, turnover, netProfit } = data;
  
  const payrollPct = outgoingTotal > 0 ? (totalPayroll / outgoingTotal) * 100 : 0;
  const expensesPct = outgoingTotal > 0 ? (totalExpenses / outgoingTotal) * 100 : 0;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="bg-white transition-all duration-300">
      <div className="flex flex-col lg:flex-row border-b border-slate-50">
        <div className="p-8 lg:w-1/3 space-y-2">
            <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-blue-600">
                <Icon name="Activity" size={14} />
                <span>FISCAL SUMMARY</span>
            </div>
            <h3 className="text-3xl font-bold text-slate-800 tracking-tight">Financial Health</h3>
            <p className="text-xs text-slate-400 font-medium tracking-tight">Real-time aggregate data stream</p>
        </div>

        <div className="p-8 flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-50/30">
            {/* TURNOVER */}
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Turnover</p>
                <p className="text-2xl font-bold text-slate-800 tracking-tight">{formatCurrency(turnover || 0)}</p>
            </div>

            {/* NET PROFIT */}
            <div className={`p-5 rounded-xl border shadow-sm space-y-2 ${netProfit >= 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>Net Profit</p>
                <p className={`text-2xl font-bold tracking-tight ${netProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {formatCurrency(netProfit || 0)}
                </p>
            </div>

            {/* PAYROLL */}
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Payroll</p>
                <p className="text-2xl font-bold text-slate-800 tracking-tight">{formatCurrency(totalPayroll || 0)}</p>
            </div>

            {/* EXPENSES */}
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Expenses</p>
                <p className="text-2xl font-bold text-slate-800 tracking-tight">{formatCurrency(totalExpenses || 0)}</p>
            </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Budget Distribution</span>
          <div className="bg-slate-900 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-lg shadow-slate-900/10 flex items-center space-x-2">
            <Icon name="TrendingUp" size={12} strokeWidth={3} />
            <span>{formatCurrency(outgoingTotal)} OUTGOING</span>
          </div>
        </div>
        
        <div className="h-6 w-full bg-slate-50 rounded-full p-1 flex">
          <div 
            style={{ width: `${payrollPct}%` }} 
            className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out flex items-center justify-center overflow-hidden shadow-sm"
          >
             <span className="text-[8px] font-bold text-white px-2">PAYROLL</span>
          </div>
          <div 
            style={{ width: `${expensesPct}%` }} 
            className="h-full bg-slate-400 rounded-full transition-all duration-1000 ease-out ml-1 flex items-center justify-center overflow-hidden"
          >
             <span className="text-[8px] font-bold text-white px-2">MARKETING/OPS</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
            <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                    <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">{payrollPct.toFixed(0)}% Personnel</span>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
                    <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">{expensesPct.toFixed(0)}% Resource</span>
                </div>
            </div>
            <button className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest flex items-center group">
                Access Audit Logs
                <Icon name="ArrowRight" size={14} className="ml-2 transition-transform group-hover:translate-x-1" strokeWidth={3} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummaryCard;
