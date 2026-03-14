import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import Icon from '../../../components/AppIcon';

const ProductivityChart = () => {
  const [chartType, setChartType] = useState('line');

  const productivityData = [
    { time: '9:00', productivity: 65, tasks: 12, screenTime: 85 },
    { time: '10:00', productivity: 78, tasks: 18, screenTime: 92 },
    { time: '11:00', productivity: 85, tasks: 25, screenTime: 88 },
    { time: '12:00', productivity: 72, tasks: 20, screenTime: 75 },
    { time: '13:00', productivity: 45, tasks: 8, screenTime: 45 },
    { time: '14:00', productivity: 82, tasks: 22, screenTime: 90 },
    { time: '15:00', productivity: 88, tasks: 28, screenTime: 95 },
    { time: '16:00', productivity: 79, tasks: 24, screenTime: 87 },
    { time: '17:00', productivity: 71, tasks: 19, screenTime: 82 },
    { time: '18:00', productivity: 58, tasks: 14, screenTime: 70 }
  ];

  const toggleChartType = () => {
    setChartType(prev => prev === 'line' ? 'area' : 'line');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 card-shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Productivity Trends</h3>
          <p className="text-sm text-muted-foreground">Real-time productivity metrics and task completion</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleChartType}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors duration-150"
          >
            <Icon name={chartType === 'line' ? 'AreaChart' : 'TrendingUp'} size={16} />
            <span>{chartType === 'line' ? 'Area View' : 'Line View'}</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors duration-150">
            <Icon name="Download" size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={productivityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="time" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  color: 'var(--color-popover-foreground)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="productivity" 
                stroke="var(--color-primary)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                name="Productivity %"
              />
              <Line 
                type="monotone" 
                dataKey="screenTime" 
                stroke="var(--color-success)" 
                strokeWidth={2}
                dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 3 }}
                name="Screen Time %"
              />
            </LineChart>
          ) : (
            <AreaChart data={productivityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="time" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  color: 'var(--color-popover-foreground)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="productivity" 
                stackId="1"
                stroke="var(--color-primary)" 
                fill="var(--color-primary)"
                fillOpacity={0.6}
                name="Productivity %"
              />
              <Area 
                type="monotone" 
                dataKey="screenTime" 
                stackId="2"
                stroke="var(--color-success)" 
                fill="var(--color-success)"
                fillOpacity={0.4}
                name="Screen Time %"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-2xl font-semibold text-foreground">78%</p>
          <p className="text-sm text-muted-foreground">Avg Productivity</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-foreground">187</p>
          <p className="text-sm text-muted-foreground">Tasks Completed</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-foreground">82%</p>
          <p className="text-sm text-muted-foreground">Screen Activity</p>
        </div>
      </div>
    </div>
  );
};

export default ProductivityChart;