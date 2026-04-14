import React, { useState, useEffect } from 'react';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    PieChart,
    Plus,
    Calendar,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    CreditCard,
    Wallet,
    Receipt,
    Download,
    Edit2
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart as RePieChart,
    Pie,
    Cell
} from 'recharts';
import Header from '../../../components/ui/Header';
import Sidebar from '../../../components/ui/Sidebar';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import useAuthStore from '../../../store/useAuthStore';
import financeService from '../../../services/finance.service';
import BreadcrumbNavigation from '../../../components/ui/BreadcrumbNavigation';
import ExpenseModal from '../components/ExpenseModal';
import ExpenseViewModal from '../components/ExpenseViewModal';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { FaRupeeSign } from 'react-icons/fa';

const FinanceDashboardPage = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [summary, setSummary] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [viewingExpense, setViewingExpense] = useState(null);
    const { user } = useAuthStore();
    const [selectedCurrency] = useState('INR');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [trendData, setTrendData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);

    useEffect(() => {
        if (user?.company?.id) {
            fetchFinanceData();
        }
    }, [user]);

    const fetchFinanceData = async () => {
        setIsLoading(true);
        try {
            const [summaryRes, expensesRes, payrollsRes] = await Promise.all([
                financeService.getSummary(user.company.id),
                financeService.getExpenses(user.company.id),
                financeService.getPayroll(user.company.id)
            ]);

            const summaryData = summaryRes?.data || summaryRes || {};
            const expensesData = expensesRes?.data || expensesRes || [];
            const payrollsData = Array.isArray(payrollsRes) ? payrollsRes : (payrollsRes?.data || payrollsRes || []);

            // Calculate credits and debits from expenses list
            const totalCredit = (expensesData || []).reduce((acc, e) => acc + (e.type === 'credit' ? Number(e.amount || 0) : 0), 0);
            const totalDebit = (expensesData || []).reduce((acc, e) => acc + (e.type === 'credit' ? 0 : Number(e.amount || 0)), 0);

            // Payroll total from payrolls endpoint (each payroll item may have `netSalary` or `amount`)
            const totalPayroll = (payrollsData || []).reduce((acc, p) => acc + Number(p.netSalary || p.amount || p.total || 0), 0);

            // Determine turnover: prefer server value, else use credits sum
            const turnover = summaryData.turnover || totalCredit;

            // Total expenses (excluding payroll) are debits
            const totalExpensesCalculated = totalDebit;

            // Merge computed fields with server summary (server wins when present)
            const mergedSummary = {
                ...summaryData,
                turnover,
                totalCredit,
                totalDebit,
                totalExpenses: summaryData.totalExpenses || totalExpensesCalculated,
                totalPayroll: summaryData.totalPayroll || totalPayroll,
            };

            setSummary(mergedSummary);
            setExpenses(Array.isArray(expensesData) ? expensesData : []);

            // Compute Chart Data dynamically
            const categoryMap = {};
            const colors = ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0'];
            let colorIdx = 0;

            (expensesData || []).forEach(exp => {
                if (exp.type !== 'credit') {
                    const cat = exp.category || 'Misc';
                    if (!categoryMap[cat]) {
                        categoryMap[cat] = { name: cat, value: 0, color: colors[colorIdx % colors.length] };
                        colorIdx++;
                    }
                    categoryMap[cat].value += Number(exp.amount || 0);
                }
            });
            setCategoryData(Object.values(categoryMap).sort((a, b) => b.value - a.value));

            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const trendMap = {};
            const today = new Date();
            for (let i = 5; i >= 0; i--) {
                const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
                const monthStr = months[d.getMonth()];
                trendMap[`${d.getFullYear()}-${d.getMonth()}`] = {
                    month: monthStr,
                    revenue: 0,
                    expenses: 0,
                    year: d.getFullYear(),
                    monthNum: d.getMonth()
                };
            }

            (expensesData || []).forEach(exp => {
                const d = exp.date ? new Date(exp.date) : new Date();
                const key = `${d.getFullYear()}-${d.getMonth()}`;
                if (trendMap[key]) {
                    if (exp.type === 'credit') {
                        trendMap[key].revenue += Number(exp.amount || 0);
                    } else {
                        trendMap[key].expenses += Number(exp.amount || 0);
                    }
                }
            });

            payrollsData.forEach(p => {
                const pMonth = p.month ? p.month - 1 : new Date(p.createdAt || new Date()).getMonth();
                const pYear = p.year || new Date(p.createdAt || new Date()).getFullYear();
                const key = `${pYear}-${pMonth}`;
                if (trendMap[key]) {
                    trendMap[key].expenses += Number(p.netSalary || p.amount || p.total || 0);
                }
            });

            setTrendData(Object.values(trendMap).sort((a, b) => {
                if (a.year !== b.year) return a.year - b.year;
                return a.monthNum - b.monthNum;
            }).map(t => ({ month: t.month, revenue: t.revenue, expenses: t.expenses })));
        } catch (error) {
            console.error('Failed to fetch finance data:', error);
            toast.error('Failed to load financial data');
        } finally {
            setIsLoading(false);
        }
    };

    const breadcrumbItems = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Finance', path: '/finance' },
    ];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    const filteredExpenses = expenses.filter(expense => {
        const matchesSearch =
            (expense.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (expense.category?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (expense.employee?.user?.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase());

        const matchesCategory = filterCategory === 'All' || expense.category === filterCategory;

        const expenseDate = new Date(expense.date);
        const matchesDate =
            (!startDate || expenseDate >= new Date(startDate)) &&
            (!endDate || expenseDate <= new Date(endDate));

        return matchesSearch && matchesCategory && matchesDate;
    });

    const resetFilters = () => {
        setSearchTerm('');
        setFilterCategory('All');
        setStartDate('');
        setEndDate('');
    };

    const handleEditExpense = (expense) => {
        setEditingExpense(expense);
        setIsExpenseModalOpen(true);
    };

    const handleViewExpense = (expense) => {
        setViewingExpense(expense);
    };

    const handleCloseModal = () => {
        setIsExpenseModalOpen(false);
        setEditingExpense(null);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Header />
            <Sidebar
                isCollapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pt-16 pb-12 flex flex-col min-h-screen`}>
                <div className="p-8 max-w-[1600px] mx-auto w-full space-y-8">
                    <BreadcrumbNavigation items={breadcrumbItems} />

                    {/* Modern Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Finance Management</h1>
                            <p className="text-slate-500 text-sm">Real-time financial activity, expense auditing, and company solvency tracking</p>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => {
                                    setEditingExpense(null);
                                    setIsExpenseModalOpen(true);
                                }}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-sm shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
                            >
                                <Plus size={18} strokeWidth={3} />
                                New Expense Entry
                            </button>
                        </div>
                    </div>

                    {/* Diagnostic Bar (Modern Cards) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Overall Balance / Revenue */}
                        <div className="bg-white p-6  border border-slate-100 shadow-sm hover:shadow-md transition-all group flex items-center justify-between">
                            <div>
                                <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-2">Est. Turnover</p>
                                <h3 className="text-3xl font-bold text-slate-800 tracking-tight leading-none mb-2">{formatCurrency(summary?.turnover || 0)}</h3>
                                <div className="flex items-center text-[10px] font-bold text-emerald-600 uppercase tracking-tight">
                                    <ArrowUpRight size={14} className="mr-1" /> +12.5% vs Last Month
                                </div>
                            </div>
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                <TrendingUp size={24} />
                            </div>
                        </div>

                        {/* Total Expenses */}
                        <div className="bg-white p-6  border border-slate-100 shadow-sm hover:shadow-md transition-all group flex items-center justify-between">
                            <div>
                                <p className="text-[11px] font-bold text-rose-600 uppercase tracking-wider mb-2">Total Expenses</p>
                                <h3 className="text-3xl font-bold text-slate-800 tracking-tight leading-none mb-2">{formatCurrency(summary?.totalExpenses || 0)}</h3>
                                <div className="flex items-center text-[10px] font-bold text-rose-600 uppercase tracking-tight">
                                    <TrendingDown size={14} className="mr-1" /> 5.2% Consumption
                                </div>
                            </div>
                            <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                                <Receipt size={24} />
                            </div>
                        </div>

                        {/* Payroll Total */}
                        <div className="bg-white p-6  border border-slate-100 shadow-sm hover:shadow-md transition-all group flex items-center justify-between">
                            <div>
                                <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider mb-2">Total Payroll</p>
                                <h3 className="text-3xl font-bold text-slate-800 tracking-tight leading-none mb-2">{formatCurrency(summary?.totalPayroll || 0)}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1 border border-slate-100 px-2 py-0.5 rounded inline-block">Active Cycle</p>
                            </div>
                            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                                <Wallet size={24} />
                            </div>
                        </div>

                        {/* Net Margin/Profit */}
                        <div className="bg-emerald-600 p-6  shadow-lg shadow-emerald-600/20 group flex items-center justify-between">
                            <div>
                                <p className="text-[11px] font-bold text-emerald-100 uppercase tracking-wider mb-2">Net Profit</p>
                                <h3 className="text-3xl font-bold text-white tracking-tight leading-none mb-2">
                                    {formatCurrency((summary?.turnover || 0) - (summary?.totalExpenses || 0) - (summary?.totalPayroll || 0))}
                                </h3>
                                <div className="flex items-center text-[10px] font-bold text-emerald-100 uppercase tracking-tight">
                                    <span className="w-2 h-2 bg-emerald-200 mr-2 rounded-full animate-pulse"></span>
                                    Status: Healthy
                                </div>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
                                <DollarSign size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Integrated Intelligence Center (Charts) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Revenue vs Expenses Chart */}
                        <div className="lg:col-span-2 bg-white p-8 rounded-none border border-slate-100">
                            <div className="flex justify-between items-start mb-8">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Growth Analysis</h3>
                                    <p className="text-slate-500 text-xs">Monthly revenue tracking vs operational burn rate</p>
                                </div>
                                <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-wider">
                                    <div className="flex items-center gap-2 text-blue-600">
                                        <div className="w-3 h-3 bg-blue-600 rounded-full" /> Revenue
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <div className="w-3 h-3 bg-slate-200 rounded-full" /> Expenses
                                    </div>
                                </div>
                            </div>
                            <div className="h-[340px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="month"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                                            tickFormatter={(val) => `₹${val / 1000}K`}
                                        />
                                        <Tooltip
                                            content={({ active, payload, label }) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <div className="bg-white p-4 shadow-xl border border-slate-50 rounded-xl">
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{label}</p>
                                                            {payload.map((entry, index) => (
                                                                <div key={index} className="flex items-center justify-between gap-8 mt-1">
                                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{entry.name}</span>
                                                                    <span className="text-sm font-bold text-slate-900">{formatCurrency(entry.value)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="revenue" 
                                            stroke="#2563eb" 
                                            strokeWidth={3} 
                                            fillOpacity={1} 
                                            fill="url(#colorRev)" 
                                            activeDot={{ r: 6, strokeWidth: 4, stroke: '#ffffff', fill: '#2563eb' }}
                                            animationDuration={1500}
                                            animationEasing="ease-in-out"
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="expenses" 
                                            stroke="#cbd5e1" 
                                            strokeWidth={2} 
                                            fill="transparent"
                                            strokeDasharray="5 5"
                                            animationDuration={1500}
                                            animationEasing="ease-in-out"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Expense Distribution */}
                        <div className="bg-white p-8 rounded-none border border-slate-100 flex flex-col">
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Expense Allocation</h3>
                                <p className="text-slate-500 text-xs">Burn rate split by category</p>
                            </div>
                            
                            <div className="flex-1 flex flex-col items-center justify-center">
                                <div className="h-[220px] w-full mb-8">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RePieChart>
                                            <Pie
                                                data={categoryData}
                                                innerRadius={70}
                                                outerRadius={95}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                                animationDuration={1500}
                                                animationEasing="ease-in-out"
                                            >
                                                {categoryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                        const data = payload[0].payload;
                                                        return (
                                                            <div className="bg-white p-3 shadow-xl border border-slate-50 rounded-xl">
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{data.name}</p>
                                                                <p className="text-lg font-bold text-slate-900">{formatCurrency(data.value)}</p>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                        </RePieChart>
                                    </ResponsiveContainer>
                                </div>
                                
                                <div className="w-full space-y-2">
                                    {categoryData.slice(0, 4).map((item, id) => (
                                        <div key={id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{item.name}</span>
                                            </div>
                                            <span className="text-[11px] font-bold text-slate-900">{formatCurrency(item.value)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Audit Table */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Transaction Log</h3>
                                <p className="text-slate-500 text-xs">Detailed audit of all incoming and outgoing capital</p>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="relative">
                                    <Icon name="Search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search records..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="bg-slate-50 border-none rounded-xl pl-12 pr-6 py-2.5 text-sm w-full sm:w-64 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                                    />
                                </div>

                                <select
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    className="bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                                >
                                    <option value="All">All Categories</option>
                                    <option value="Operating">Operating</option>
                                    <option value="Salaries">Salaries</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Infrastructure">Infrastructure</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Tax">Tax</option>
                                    <option value="Misc">Misc</option>
                                </select>

                                <button className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all">
                                    <Download size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-50">
                                        <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Transaction</th>
                                        <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Category</th>
                                        <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">Date</th>
                                        <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">Status</th>
                                        <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 text-right">Amount</th>
                                        <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="6" className="px-8 py-12 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Records...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredExpenses.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-8 py-12 text-center">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No matching records found</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredExpenses.map((expense, idx) => (
                                            <tr key={expense.id || idx} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-2.5 rounded-xl ${expense.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                                            {expense.type === 'credit' ? <ArrowDownRight size={20} /> : <CreditCard size={20} />}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900 tracking-tight">{expense.title}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{expense.employee?.user?.firstName || 'System'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className="text-[10px] font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-600 uppercase tracking-tight">
                                                        {expense.category || 'Misc'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-[11px] font-bold text-slate-500 text-center">
                                                    {format(new Date(expense.date), 'MMM dd, yyyy')}
                                                </td>
                                                <td className="px-8 py-5 text-center">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tight ${
                                                        expense.status === 'approved' 
                                                        ? 'bg-emerald-50 text-emerald-600' 
                                                        : 'bg-amber-50 text-amber-600'
                                                    }`}>
                                                        {expense.status === 'approved' ? 'Verified' : 'Pending'}
                                                    </span>
                                                </td>
                                                <td className={`px-8 py-5 text-sm font-bold text-right ${expense.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                                                    {expense.type === 'credit' ? '+' : '-'}{formatCurrency(expense.amount)}
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleViewExpense(expense)}
                                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                        >
                                                            <Icon name="Eye" size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEditExpense(expense)}
                                                            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <ExpenseModal
                    isOpen={isExpenseModalOpen}
                    onClose={handleCloseModal}
                    onSuccess={fetchFinanceData}
                    expenseToEdit={editingExpense}
                />
                <ExpenseViewModal
                    isOpen={!!viewingExpense}
                    onClose={() => setViewingExpense(null)}
                    expense={viewingExpense}
                />
            </main>
        </div>
    );
};

export default FinanceDashboardPage;
