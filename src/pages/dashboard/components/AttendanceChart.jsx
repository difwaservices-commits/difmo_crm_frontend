import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useEffect } from 'react';
import attendanceService from 'services/attendanceService';
import useAuthStore from 'store/useAuthStore';


const AttendanceChart = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [analyticsData, setAnalyticsData] = useState([]);

  // const weeklyData = [
  //   { day: 'Mon', present: 85, absent: 15, wfh: 25, office: 60 },
  //   { day: 'Tue', present: 92, absent: 8, wfh: 30, office: 62 },
  //   { day: 'Wed', present: 88, absent: 12, wfh: 28, office: 60 },
  //   { day: 'Thu', present: 90, absent: 10, wfh: 32, office: 58 },
  //   { day: 'Fri', present: 87, absent: 13, wfh: 35, office: 52 },
  //   { day: 'Sat', present: 45, absent: 55, wfh: 20, office: 25 },
  //   { day: 'Sun', present: 12, absent: 88, wfh: 8, office: 4 }
  // ];

  // const monthlyData = [
  //   { period: 'Week 1', present: 88, absent: 12, wfh: 28, office: 60 },
  //   { period: 'Week 2', present: 91, absent: 9, wfh: 31, office: 60 },
  //   { period: 'Week 3', present: 85, absent: 15, wfh: 26, office: 59 },
  //   { period: 'Week 4', present: 89, absent: 11, wfh: 29, office: 60 }
  // ];
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user?.company?.id) return;

    const fetchAnalytics = async () => {
      try {
        const res = await attendanceService.getAnalytics({
          companyId: user.company.id
        });

        console.log('analytics:', res);

        const mapped = res.punctualityTrend.map(item => ({
          period: item.month,
          late: Number(item.late),
          onTime: Number(item.onTime),
          earlyOut: Number(item.earlyOut)
        }));

        setAnalyticsData(mapped);

      } catch (err) {
        console.error(err);
      }
    };

    fetchAnalytics();
  }, [user]);

  const currentData = analyticsData;
  const handleRangeChange = (range) => {
    setTimeRange(range);
  };

  console.log("ertfghj", user);
  useEffect(() => {
    if (!user?.company?.id) return;

    const fetchAnalytics = async () => {
      try {
        const res = await attendanceService.getAnalytics({
          companyId: user.company.id
        });
        console.log('analytics:', res);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAnalytics();
  }, [user]);
  return (
    <div className="bg-card border border-border rounded-lg p-6 card-shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Attendance Overview</h3>
          <p className="text-sm text-muted-foreground">Employee attendance patterns and work modes</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleRangeChange('week')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-150 ${timeRange === 'week' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
          >
            Week
          </button>
          <button
            onClick={() => handleRangeChange('month')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-150 ${timeRange === 'month' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
          >
            Month
          </button>
        </div>
      </div>

      <div className="h-80">
        {/* <ResponsiveContainer width="100%" height="100%">
          <BarChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey={timeRange === 'week' ? 'day' : 'period'}
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
            <Legend />
            <Bar dataKey="office" stackId="a" fill="var(--color-primary)" name="Office" />
            <Bar dataKey="wfh" stackId="a" fill="var(--color-success)" name="Work from Home" />
            <Bar dataKey="absent" stackId="a" fill="var(--color-error)" name="Absent" />
          </BarChart>
        </ResponsiveContainer> */}

        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />

            {/* X-axis is always 'period' now */}
            <XAxis dataKey="period" stroke="var(--color-muted-foreground)" fontSize={12} />

            <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />

            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-popover)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                color: 'var(--color-popover-foreground)'
              }}
            />
            <Legend />

            {/* Bars aligned with new analytics keys */}
            <Bar dataKey="late" name="Late" stackId="a" fill="var(--color-error)" />
            <Bar dataKey="onTime" name="On Time" stackId="a" fill="var(--color-success)" />
            <Bar dataKey="earlyOut" name="Early Out" stackId="a" fill="var(--color-primary)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-error rounded-full"></div>
          <span className="text-sm text-muted-foreground">Late</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-success rounded-full"></div>
          <span className="text-sm text-muted-foreground">On Time</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <span className="text-sm text-muted-foreground">Early Out</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceChart;