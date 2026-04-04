import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import Icon from "../../../components/AppIcon";
import productivityService from "services/productivity.service";

const ProductivityChart = () => {
  const [chartType, setChartType] = useState("line");
  const [productivityData, setProductivityData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProductivity = async () => {
      try {
        setLoading(true);

        const res = await productivityService.getAnalytics();

        const mapped = res.map((item) => ({
          time: item.time,
          productivity: Number(item.productivity),
          tasks: Number(item.tasks),
          screenTime: Number(item.screenTime)
        }));

        setProductivityData(mapped);
      } catch (err) {
        console.error("Productivity API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductivity();
  }, []);

  const toggleChartType = () => {
    setChartType((prev) => (prev === "line" ? "area" : "line"));
  };

  const avgProductivity =
    productivityData.reduce((acc, cur) => acc + cur.productivity, 0) /
      productivityData.length || 0;

  const totalTasks =
    productivityData.reduce((acc, cur) => acc + cur.tasks, 0) || 0;

  const avgScreen =
    productivityData.reduce((acc, cur) => acc + cur.screenTime, 0) /
      productivityData.length || 0;

  if (loading) {
    return <div className="p-6 text-center">Loading Chart...</div>;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 card-shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Productivity Trends
          </h3>
          <p className="text-sm text-muted-foreground">
            Real-time productivity metrics and task completion
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleChartType}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
          >
            <Icon name={chartType === "line" ? "AreaChart" : "TrendingUp"} size={16} />
            <span>{chartType === "line" ? "Area View" : "Line View"}</span>
          </button>

          <button className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md">
            <Icon name="Download" size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            <LineChart data={productivityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="time" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="productivity"
                stroke="var(--color-primary)"
                strokeWidth={3}
                name="Productivity %"
              />

              <Line
                type="monotone"
                dataKey="screenTime"
                stroke="var(--color-success)"
                strokeWidth={2}
                name="Screen Time %"
              />
            </LineChart>
          ) : (
            <AreaChart data={productivityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="time" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />

              <Area
                type="monotone"
                dataKey="productivity"
                stroke="var(--color-primary)"
                fill="var(--color-primary)"
                fillOpacity={0.6}
                name="Productivity %"
              />

              <Area
                type="monotone"
                dataKey="screenTime"
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
          <p className="text-2xl font-semibold text-foreground">
            {avgProductivity.toFixed(0)}%
          </p>
          <p className="text-sm text-muted-foreground">Avg Productivity</p>
        </div>

        <div className="text-center">
          <p className="text-2xl font-semibold text-foreground">{totalTasks}</p>
          <p className="text-sm text-muted-foreground">Tasks Completed</p>
        </div>

        <div className="text-center">
          <p className="text-2xl font-semibold text-foreground">
            {avgScreen.toFixed(0)}%
          </p>
          <p className="text-sm text-muted-foreground">Screen Activity</p>
        </div>
      </div>
    </div>
  );
};

export default ProductivityChart;