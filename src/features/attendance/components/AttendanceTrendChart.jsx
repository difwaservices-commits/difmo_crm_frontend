import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AttendanceTrendChart = ({ data, period }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (period === 'daily') {
      return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (period === 'weekly') {
      return `Week ${Math.ceil(date?.getDate() / 7)}`;
    } else {
      return date?.toLocaleDateString('en-US', { month: 'short' });
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-foreground font-medium mb-2">{formatDate(label)}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: {entry?.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 card-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Attendance Trends</h3>
          <p className="text-sm text-muted-foreground">
            {period === 'daily' ? 'Daily' : period === 'weekly' ? 'Weekly' : 'Monthly'} attendance patterns and productivity correlation
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Attendance</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Punctuality</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Productivity</span>
          </div>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              className="text-muted-foreground"
            />
            <YAxis 
              domain={[60, 100]}
              className="text-muted-foreground"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="attendance" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Attendance Rate"
            />
            <Line 
              type="monotone" 
              dataKey="punctuality" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Punctuality Score"
            />
            <Line 
              type="monotone" 
              dataKey="productivity" 
              stroke="#8B5CF6" 
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Productivity Index"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AttendanceTrendChart;