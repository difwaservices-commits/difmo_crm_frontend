import React, { useMemo } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import useProjectStore from "store/useProjectStore"; // Ensure path is correct

const CustomTooltip = ({ active, payload, label, growthData }) => {
    if (active && payload && payload.length && growthData) {
        const value = payload[0].value;
        const currentIndex = growthData.findIndex((d) => d.month === label);
        const previousValue = currentIndex > 0 ? growthData[currentIndex - 1].projects : 0;
        const diff = value - previousValue;

        return (
            <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl p-3 animate-in fade-in zoom-in-95 duration-200">
                <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-emerald-600">{value}</span>
                    <span className="text-xs text-gray-500">projects</span>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100">
                    <p className={`text-xs ${diff >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
                        {diff >= 0 ? "↑" : "↓"} {Math.abs(diff)} vs previous
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

const CustomCursor = (props) => {
    const { points, height } = props;
    if (!points || !points[0]) return null;
    const { x } = points[0];
    return (
        <line x1={x} y1={0} x2={x} y2={height} stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 4" />
    );
};

const ProjectLineGraph = () => {
    // 1. Grab STATIC data and loading state from Store
    // DO NOT call getGrowthData() here. Use the variable we save in fetchProjects.
    const growthData = useProjectStore((state) => state.growthData) || [];
    const loading = useProjectStore((state) => state.loading);

    // 2. Memoize calculations so they only run when growthData actually changes
    const stats = useMemo(() => {
        if (!growthData.length) return { total: 0, pct: "0.0", avg: 0, peak: null };

        const total = growthData.reduce((sum, d) => sum + d.projects, 0);
        const firstVal = growthData[0]?.projects || 0;
        const lastVal = growthData[growthData.length - 1]?.projects || 0;

        const pct = firstVal === 0
            ? (lastVal * 100).toFixed(1)
            : (((lastVal - firstVal) / firstVal) * 100).toFixed(1);

        const avg = growthData.length > 1
            ? (lastVal - firstVal) / (growthData.length - 1)
            : 0;

        const peak = [...growthData].sort((a, b) => b.projects - a.projects)[0];

        return { total, pct, avg, peak };
    }, [growthData]);

    // 3. Show a skeleton/loader if fetching
    if (loading && growthData.length === 0) {
        return <div className="w-full h-[400px] bg-gray-50 animate-pulse rounded-2xl border border-gray-100" />;
    }

    return (
        <div className="w-full h-[400px] bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all hover:shadow-xl">
            <div className="px-6 pt-6 pb-2 border-b border-gray-100">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Project Growth</h3>
                        <p className="text-sm text-gray-500 mt-0.5">Live workspace analytics</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-right">
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Total</p>
                            <p className="text-xl font-black text-gray-800">{stats.total}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Growth</p>
                            <p className={`text-xl font-black ${Number(stats.pct) >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                {Number(stats.pct) >= 0 ? '+' : ''}{stats.pct}%
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 pt-2 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={growthData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="projectGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                            dy={10}
                        />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
                        <Tooltip
                            content={<CustomTooltip growthData={growthData} />}
                            cursor={<CustomCursor />}
                            wrapperStyle={{ outline: 'none' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="projects"
                            stroke="#10b981"
                            strokeWidth={3}
                            fill="url(#projectGradient)"
                            fillOpacity={1}
                            activeDot={{ r: 6, strokeWidth: 2, stroke: '#ffffff', fill: '#10b981' }}
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>

                <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100 text-xs text-gray-600 flex items-center justify-between font-medium">

                    <div className="flex items-center gap-2">
                        <span className="text-green-500">📈</span>
                        <span>
                            Avg. monthly: {stats?.avg?.toFixed(1) || 0} projects
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-blue-500">🔝</span>
                        <span>
                            Peak: {stats?.peak?.projects || 0} in {stats?.peak?.month || "N/A"}
                        </span>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default ProjectLineGraph;