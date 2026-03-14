import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';

const TaskAnalytics = ({ tasks }) => {
  // Calculate analytics data
  const totalTasks = tasks?.length;
  const completedTasks = tasks?.filter(task => task?.status === 'completed')?.length;
  const overdueTasks = tasks?.filter(task => {
    return task?.status !== 'completed' && new Date(task.dueDate) < new Date();
  })?.length;
  const inProgressTasks = tasks?.filter(task => task?.status === 'in-progress')?.length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Priority distribution data
  const priorityData = [
    {
      name: 'High',
      value: tasks?.filter(task => task?.priority === 'high')?.length,
      color: '#dc2626'
    },
    {
      name: 'Medium',
      value: tasks?.filter(task => task?.priority === 'medium')?.length,
      color: '#d97706'
    },
    {
      name: 'Low',
      value: tasks?.filter(task => task?.priority === 'low')?.length,
      color: '#059669'
    }
  ];

  // Weekly completion trend (mock data for demonstration)
  const weeklyTrend = [
    { week: 'Week 1', completed: 12, created: 15 },
    { week: 'Week 2', completed: 18, created: 20 },
    { week: 'Week 3', completed: 25, created: 22 },
    { week: 'Week 4', completed: 30, created: 28 }
  ];

  // Department performance data
  const departmentData = [
    { department: 'Engineering', completed: 45, total: 52 },
    { department: 'Marketing', completed: 32, total: 38 },
    { department: 'Sales', completed: 28, total: 35 },
    { department: 'HR', completed: 15, total: 18 },
    { department: 'Finance', completed: 22, total: 25 }
  ];

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color?.replace('text-', 'bg-')?.replace(/text-(\w+)/, 'bg-$1/10')}`}>
          <Icon name={icon} size={24} className={color} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tasks"
          value={totalTasks}
          icon="CheckSquare"
          color="text-primary"
          subtitle="All active tasks"
        />
        <StatCard
          title="Completed"
          value={completedTasks}
          icon="CheckCircle"
          color="text-success"
          subtitle={`${completionRate}% completion rate`}
        />
        <StatCard
          title="In Progress"
          value={inProgressTasks}
          icon="Clock"
          color="text-warning"
          subtitle="Currently active"
        />
        <StatCard
          title="Overdue"
          value={overdueTasks}
          icon="AlertTriangle"
          color="text-error"
          subtitle="Needs attention"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Distribution */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="Target" size={20} className="text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">Priority Distribution</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {priorityData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            {priorityData?.map((item) => (
              <div key={item?.name} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item?.color }}
                ></div>
                <span className="text-sm text-muted-foreground">
                  {item?.name} ({item?.value})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Completion Trend */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="TrendingUp" size={20} className="text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">Weekly Trend</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="week" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#059669"
                  strokeWidth={2}
                  name="Completed"
                />
                <Line
                  type="monotone"
                  dataKey="created"
                  stroke="#1e40af"
                  strokeWidth={2}
                  name="Created"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Department Performance */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Users" size={20} className="text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Department Performance</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="department" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="completed" fill="#059669" name="Completed" />
              <Bar dataKey="total" fill="#e2e8f0" name="Total" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Zap" size={20} className="text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Quick Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Clock" size={16} className="text-warning" />
              <span className="text-sm font-medium text-foreground">Average Completion Time</span>
            </div>
            <p className="text-lg font-bold text-foreground">3.2 days</p>
            <p className="text-xs text-muted-foreground">Based on last 30 tasks</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Users" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Most Productive Team</span>
            </div>
            <p className="text-lg font-bold text-foreground">Engineering</p>
            <p className="text-xs text-muted-foreground">87% completion rate</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="AlertTriangle" size={16} className="text-error" />
              <span className="text-sm font-medium text-foreground">Tasks at Risk</span>
            </div>
            <p className="text-lg font-bold text-foreground">{overdueTasks + 3}</p>
            <p className="text-xs text-muted-foreground">Due within 2 days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskAnalytics;