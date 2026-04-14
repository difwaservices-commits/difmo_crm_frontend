import React from "react";
import Icon from "../../../components/AppIcon";

const Filter = ({ 
    search, setSearch, 
    phase, setPhase, 
    budget, setBudget, 
    sort, setSort,
    deadlineStatus, setDeadlineStatus 
}) => {
    
    const budgetOptions = ["Low Budget", "Medium Budget", "High Budget"];
    const deadlineOptions = ["All Deadlines", "Overdue", "Due this week", "Upcoming"];

    return (
        <div className="bg-white p-6 border-b border-slate-100 flex flex-col gap-6 transition-all">
            
            {/* Row 1: Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                {/* Search */}
                <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-700 mb-2 ml-1">Search Project</label>
                    <div className="relative group">
                        <Icon name="Search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Project name or ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm"
                        />
                    </div>
                </div>

                {/* Phase Filter */}
                <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-700 mb-2 ml-1">Project Phase</label>
                    <select
                        value={phase}
                        onChange={(e) => setPhase(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm appearance-none cursor-pointer"
                    >
                        <option value="">All Phases</option>
                        <option value="Planning">Planning</option>
                        <option value="Development">Development</option>
                        <option value="Testing">Testing</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                {/* Deadline Filter */}
                <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-700 mb-2 ml-1">Timeline</label>
                    <select
                        value={deadlineStatus}
                        onChange={(e) => setDeadlineStatus(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm appearance-none cursor-pointer"
                    >
                        {deadlineOptions.map(opt => (
                            <option key={opt} value={opt === "All Deadlines" ? "" : opt}>{opt}</option>
                        ))}
                    </select>
                </div>

                {/* Budget Filter */}
                <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-700 mb-2 ml-1">Budget Range</label>
                    <select
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm appearance-none cursor-pointer"
                    >
                        <option value="">All Budgets</option>
                        {budgetOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Row 2: Sorting and Reset */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-3">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sort By:</span>
                    <div className="flex p-1 bg-slate-100/50 rounded-xl gap-1">
                        {["All", "Recently Added", "Closest Deadline"].map((label) => (
                            <button
                                key={label}
                                onClick={() => setSort(label)}
                                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                                    sort === label 
                                    ? "bg-white text-blue-600 shadow-sm" 
                                    : "text-slate-500 hover:text-slate-700"
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => {
                        setSearch("");
                        setPhase("");
                        setBudget("");
                        setSort("All");
                        setDeadlineStatus("");
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors group"
                >
                    <Icon name="RotateCcw" size={14} className="group-hover:rotate-[-45deg] transition-transform" />
                    Reset Filters
                </button>
            </div>
        </div>
    );
};

export default Filter;