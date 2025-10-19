import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const AttendanceAnalytics = ({ attendanceData }) => {
  // Mock analytics data
  const weeklyTrend = [
    { day: 'Mon', present: 92, absent: 8, late: 5, productivity: 88 },
    { day: 'Tue', present: 95, absent: 5, late: 3, productivity: 91 },
    { day: 'Wed', present: 89, absent: 11, late: 7, productivity: 85 },
    { day: 'Thu', present: 94, absent: 6, late: 4, productivity: 89 },
    { day: 'Fri', present: 87, absent: 13, late: 8, productivity: 82 },
    { day: 'Sat', present: 45, absent: 55, late: 2, productivity: 78 },
    { day: 'Sun', present: 12, absent: 88, late: 0, productivity: 85 }
  ];

  const departmentStats = [
    { name: 'Engineering', present: 85, total: 92, rate: 92.4 },
    { name: 'Marketing', present: 28, total: 32, rate: 87.5 },
    { name: 'Sales', present: 45, total: 48, rate: 93.8 },
    { name: 'HR', present: 12, total: 15, rate: 80.0 },
    { name: 'Finance', present: 18, total: 20, rate: 90.0 }
  ];

  const attendanceDistribution = [
    { name: 'Present', value: 78, color: '#22c55e' },
    { name: 'Absent', value: 12, color: '#ef4444' },
    { name: 'Late', value: 8, color: '#f59e0b' },
    { name: 'Early Out', value: 2, color: '#f97316' }
  ];

  const punctualityTrend = [
    { month: 'Jan', onTime: 92, late: 8, earlyOut: 3 },
    { month: 'Feb', onTime: 94, late: 6, earlyOut: 2 },
    { month: 'Mar', onTime: 88, late: 12, earlyOut: 4 },
    { month: 'Apr', onTime: 91, late: 9, earlyOut: 3 },
    { month: 'May', onTime: 95, late: 5, earlyOut: 2 },
    { month: 'Jun', onTime: 89, late: 11, earlyOut: 5 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Weekly Attendance Trend */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Weekly Attendance Trend</h3>
          <Icon name="TrendingUp" size={20} className="text-primary" />
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="day" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="present" fill="#22c55e" name="Present" />
              <Bar dataKey="late" fill="#f59e0b" name="Late" />
              <Bar dataKey="absent" fill="#ef4444" name="Absent" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Attendance Distribution */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Attendance Distribution</h3>
          <Icon name="PieChart" size={20} className="text-primary" />
        </div>
        <div className="h-64 flex items-center">
          <ResponsiveContainer width="60%" height="100%">
            <PieChart>
              <Pie
                data={attendanceDistribution}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="value"
              >
                {attendanceDistribution?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 space-y-2">
            {attendanceDistribution?.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item?.color }}
                  ></div>
                  <span className="text-sm text-foreground">{item?.name}</span>
                </div>
                <span className="text-sm font-medium text-foreground">{item?.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Performance */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Department Performance</h3>
          <Icon name="Building" size={20} className="text-primary" />
        </div>
        <div className="space-y-4">
          {departmentStats?.map((dept, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{dept?.name}</span>
                  <span className="text-sm text-muted-foreground">{dept?.present}/{dept?.total}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-success h-2 rounded-full transition-all duration-300"
                    style={{ width: `${dept?.rate}%` }}
                  ></div>
                </div>
              </div>
              <div className="ml-4 text-right">
                <span className="text-sm font-semibold text-foreground">{dept?.rate}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Punctuality Trend */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">6-Month Punctuality Trend</h3>
          <Icon name="Clock" size={20} className="text-primary" />
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={punctualityTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="onTime" 
                stroke="#22c55e" 
                strokeWidth={3}
                name="On Time"
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="late" 
                stroke="#f59e0b" 
                strokeWidth={2}
                name="Late"
                dot={{ r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="earlyOut" 
                stroke="#f97316" 
                strokeWidth={2}
                name="Early Out"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AttendanceAnalytics;