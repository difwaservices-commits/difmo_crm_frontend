import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import useAuthStore from '../../store/useAuthStore';
import financeService from '../../services/financeService';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import MetricsCard from '../dashboard/components/MetricsCard';
import useLocale from '../../hooks/useLocale';

const ExpensesPage = () => {
    const { formatPrice, formatDate, location, isLoading: isLocaleLoading } = useLocale();
    const [expensesData, setExpensesData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const { user } = useAuthStore();
    const isAdmin = user?.roles?.some(r => ['Super Admin', 'Admin'].includes(r.name));

    // Form states
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Travel');
    const [type, setType] = useState('debit');

    // Filter states
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterType, setFilterType] = useState('All');
    const [filterMonth, setFilterMonth] = useState('All');
    const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());

    const fetchExpenses = async () => {
        const companyId = user?.company?.id || user?.companyId;
        if (!companyId) return;

        setIsLoading(true);
        try {
            const currency = location?.currency || 'USD';
            const responseData = await financeService.getExpenses(companyId, currency);
            const data = Array.isArray(responseData) ? responseData : responseData?.data || [];

            // If the user is an employee and not an admin, filter to show only their expenses.
            if (!isAdmin) {
                const userExpenses = data.filter(e => e.employee?.userId === user?.id || e.employee?.id === user?.employeeId);
                setExpensesData(userExpenses);
            } else {
                setExpensesData(data);
            }
        } catch (error) {
            console.error('Failed to fetch expenses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [user, location?.currency]);

    const handleAddExpense = async (e) => {
        e.preventDefault();
        const companyId = user?.company?.id || user?.companyId;
        if (!companyId) {
            console.error('Cannot create expense: Company info missing');
            return;
        }
        try {
            await financeService.createExpense({
                companyId,
                title,
                description,
                amount: parseFloat(amount),
                currency: location?.currency || 'USD',
                category,
                type,
                date: new Date().toISOString().split('T')[0],
                status: isAdmin ? 'approved' : 'pending',
            });
            setIsAddModalOpen(false);

            // Reset form
            setTitle('');
            setDescription('');
            setAmount('');
            setCategory('Travel');
            setType('debit');

            fetchExpenses();
        } catch (error) {
            console.error('Failed to create expense:', error);
        }
    };

    const breadcrumbItems = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Expenses', path: '/expenses' },
    ];

    const filteredExpenses = useMemo(() => {
        return expensesData.filter(e => {
            const d = new Date(e.date);
            const matchCategory = filterCategory === 'All' || e.category === filterCategory;
            const matchType = filterType === 'All' || e.type === filterType;
            const matchMonth = filterMonth === 'All' || (d.getMonth() + 1).toString() === filterMonth;
            const matchYear = filterYear === 'All' || d.getFullYear().toString() === filterYear;
            return matchCategory && matchType && matchMonth && matchYear;
        });
    }, [expensesData, filterCategory, filterType, filterMonth, filterYear]);

    const summary = useMemo(() => {
        const debit = filteredExpenses.filter(e => e.type === 'debit').reduce((sum, e) => sum + Number(e.amount), 0);
        const credit = filteredExpenses.filter(e => e.type === 'credit').reduce((sum, e) => sum + Number(e.amount), 0);
        return { debit, credit, balance: credit - debit };
    }, [filteredExpenses]);

    const chartData = [
        { name: 'Debit (Expense)', value: summary.debit, color: '#ef4444' },
        { name: 'Credit (Income)', value: summary.credit, color: '#22c55e' }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
            <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pt-16 pb-20 lg:pb-6`}>
                <div className="p-6 max-w-7xl mx-auto">
                    <BreadcrumbNavigation items={breadcrumbItems} />

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Expense Tracker</h1>
                            <p className="text-muted-foreground mt-1">Manage company credits and debits with visual insights</p>
                        </div>
                        <div className="mt-4 sm:mt-0 flex space-x-3">
                            <Button onClick={() => setIsAddModalOpen(true)} iconName="Plus">Add Expense</Button>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <MetricsCard title="Total Debit (Expenses)" value={formatPrice(summary.debit)} icon="ArrowUpRight" color="error" />
                        <MetricsCard title="Total Credit (Income)" value={formatPrice(summary.credit)} icon="ArrowDownLeft" color="success" />
                        <MetricsCard title="Net Balance" value={formatPrice(Math.abs(summary.balance))} icon="Wallet" color={summary.balance >= 0 ? "success" : "error"} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        {/* Filters Panel */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <Icon name="Filter" size={18} className="mr-2 text-primary" />
                                    Filter Records
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Category</label>
                                        <select
                                            value={filterCategory}
                                            onChange={(e) => setFilterCategory(e.target.value)}
                                            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                                        >
                                            <option value="All">All Categories</option>
                                            <option value="Travel">Travel</option>
                                            <option value="Supplies">Supplies</option>
                                            <option value="Marketing">Marketing</option>
                                            <option value="Meal">Meal</option>
                                            <option value="Software">Software</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Type</label>
                                        <select
                                            value={filterType}
                                            onChange={(e) => setFilterType(e.target.value)}
                                            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                                        >
                                            <option value="All">All Types</option>
                                            <option value="debit">Debit (Expense)</option>
                                            <option value="credit">Credit (Income)</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Month</label>
                                            <select
                                                value={filterMonth}
                                                onChange={(e) => setFilterMonth(e.target.value)}
                                                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                                            >
                                                <option value="All">All</option>
                                                {Array.from({ length: 12 }, (_, i) => (
                                                    <option key={i + 1} value={i + 1}>
                                                        {new Date(0, i).toLocaleString('en', { month: 'long' })}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Year</label>
                                            <select
                                                value={filterYear}
                                                onChange={(e) => setFilterYear(e.target.value)}
                                                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                                            >
                                                <option value="All">All</option>
                                                {Array.from({ length: 5 }, (_, i) => {
                                                    const y = new Date().getFullYear() - i;
                                                    return <option key={y} value={y}>{y}</option>;
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Chart Panel */}
                        <div className="lg:col-span-2">
                            <div className="bg-card border border-border rounded-xl p-6 shadow-sm h-full flex flex-col">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <Icon name="BarChart" size={18} className="mr-2 text-primary" />
                                    Financial Insight
                                </h3>
                                <div className="flex-1 min-h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => formatPrice(v)} width={80} />
                                            <Tooltip
                                                cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                                formatter={(value) => [formatPrice(value), 'Amount']}
                                            />
                                            <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center">
                            <h3 className="font-semibold text-foreground">Transactions List</h3>
                            <span className="text-sm text-muted-foreground">{filteredExpenses.length} records found</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-muted/50 border-b border-border">
                                        <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Amount</th>
                                        {isAdmin && <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Employee</th>}
                                        <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={isAdmin ? 7 : 6} className="px-6 py-20 text-center">
                                                <Icon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-3" />
                                                <p className="text-muted-foreground font-medium">Fetching transaction details...</p>
                                            </td>
                                        </tr>
                                    ) : filteredExpenses.length === 0 ? (
                                        <tr>
                                            <td colSpan={isAdmin ? 7 : 6} className="px-6 py-20 text-center">
                                                <Icon name="Inbox" size={48} className="text-muted-foreground/20 mx-auto mb-4" />
                                                <p className="text-foreground font-semibold text-lg">Empty Vault</p>
                                                <p className="text-muted-foreground">Adjust filters to see different records</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredExpenses.map((record) => (
                                            <tr key={record.id} className="hover:bg-muted/30 transition-colors group">
                                                <td className="px-6 py-4 text-sm font-medium">{formatDate(record.date, { hour: undefined, minute: undefined })}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <div className="font-semibold text-foreground group-hover:text-primary transition-colors">{record.title}</div>
                                                    <div className="text-xs text-muted-foreground line-clamp-1 max-w-[250px]">{record.description}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span className="px-2 py-1 bg-muted rounded-md text-xs font-medium">
                                                        {record.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${record.type === 'credit' ? 'bg-success/10 text-success border border-success/20' : 'bg-error/10 text-error border border-error/20'
                                                        }`}>
                                                        {record.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-foreground">
                                                    <span className={record.type === 'credit' ? 'text-success' : 'text-error'}>
                                                        {record.type === 'credit' ? '+' : '-'}{formatPrice(Number(record.amount))}
                                                    </span>
                                                </td>
                                                {isAdmin && (
                                                    <td className="px-6 py-4 text-sm">
                                                        <div className="flex items-center">
                                                            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mr-2 text-[10px] font-bold text-primary border border-primary/20">
                                                                {record.employee ? record.employee.user?.firstName?.[0] : '?'}
                                                            </div>
                                                            <span className="text-xs font-medium truncate max-w-[120px]">
                                                                {record.employee ? `${record.employee.user?.firstName} ${record.employee.user?.lastName}` : 'System'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                )}
                                                <td className="px-6 py-4">
                                                    <div className={`flex items-center w-fit px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm ${record.status === 'paid' ? 'bg-success/10 text-success' :
                                                        record.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                                                            record.status === 'rejected' ? 'bg-error/10 text-error' :
                                                                'bg-warning/10 text-warning'
                                                        }`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full mr-2 ${record.status === 'paid' ? 'bg-success' :
                                                            record.status === 'approved' ? 'bg-blue-500' :
                                                                record.status === 'rejected' ? 'bg-error' :
                                                                    'bg-warning'
                                                            }`} />
                                                        {record.status.toUpperCase()}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {isAddModalOpen && (
                        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                            <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                                <div className="p-6 border-b border-border flex justify-between items-center bg-muted/10">
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground">New Transaction</h3>
                                        <p className="text-sm text-muted-foreground mt-0.5">Add a new credit or debit entry</p>
                                    </div>
                                    <button onClick={() => setIsAddModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground transition-colors">
                                        <Icon name="X" size={20} />
                                    </button>
                                </div>
                                <form onSubmit={handleAddExpense} className="p-8 space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-foreground">Type</label>
                                            <div className="relative">
                                                <select
                                                    value={type}
                                                    onChange={(e) => setType(e.target.value)}
                                                    required
                                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                                                >
                                                    <option value="debit">Debit (Expense)</option>
                                                    <option value="credit">Credit (Income)</option>
                                                </select>
                                                <Icon name="ChevronDown" size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-foreground">Category</label>
                                            <div className="relative">
                                                <select
                                                    value={category}
                                                    onChange={(e) => setCategory(e.target.value)}
                                                    required
                                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                                                >
                                                    <option value="Travel">Travel</option>
                                                    <option value="Supplies">Supplies</option>
                                                    <option value="Marketing">Marketing</option>
                                                    <option value="Meal">Meal</option>
                                                    <option value="Software">Software</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                <Icon name="ChevronDown" size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">Title</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                            placeholder="e.g. Monthly server cost"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">Amount ({location?.currency || 'USD'})</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                                                {location?.currency === 'INR' ? '₹' : location?.currency || '$'}
                                            </div>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                required
                                                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">Description (Optional)</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            rows="3"
                                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                                            placeholder="Add transaction notes here..."
                                        ></textarea>
                                    </div>

                                    <div className="pt-4 flex items-center justify-end space-x-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsAddModalOpen(false)}
                                            className="px-6 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <Button type="submit" className="px-8 py-3 rounded-xl shadow-lg shadow-primary/20">Submit Transaction</Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ExpensesPage;
