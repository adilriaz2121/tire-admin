"use client";

import React from "react";
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { OrdersChartData, DashboardFilters } from "@/actions/stats.action";

interface ChartsSectionProps {
  charts: {
    orders: OrdersChartData;
  };
  period?: DashboardFilters["period"];
}

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const ChartsSection: React.FC<ChartsSectionProps> = ({ charts, period = "month" }) => {
  // Transform data for charts with proper labels based on period
  const chartData = charts.orders.monthlyData.map((item) => {
    let label: string;
    switch (period) {
      case "day":
        label = `Day ${item.month}`;
        break;
      case "week":
        label = `W${item.month}`;
        break;
      case "year":
        label = String(item.month);
        break;
      default:
        label = monthNames[item.month - 1] || String(item.month);
    }
    return {
      label,
      orders: item.count,
      revenue: item.revenue,
    };
  });

  const periodTitles: Record<string, string> = {
    day: "Daily Orders",
    week: "Weekly Orders",
    month: "Monthly Orders",
    year: "Yearly Orders",
  };

  const revenueTitles: Record<string, string> = {
    day: "Daily Revenue",
    week: "Weekly Revenue",
    month: "Monthly Revenue",
    year: "Yearly Revenue",
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Orders Chart */}
      <Card className="shadow-none border border-gray-200">
        <CardHeader className="pb-2">
          <div>
            <h3 className="text-lg font-semibold">
              {periodTitles[period || "month"]}
            </h3>
            <p className="text-sm text-gray-600">
              Total: {charts.orders.summary.total} | Revenue: $
              {charts.orders.summary.revenue.toFixed(2)} | Avg: $
              {charts.orders.summary.averageOrderValue.toFixed(2)}
            </p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="pt-6">
          {/* @ts-ignore */}
          <ResponsiveContainer width="100%" height={300}>
            {/* @ts-ignore */}
            <BarChart data={chartData} width={500} height={300}>
              {/* @ts-ignore */}
              <CartesianGrid strokeDasharray="3 3" />
              {/* @ts-ignore */}
              <XAxis dataKey="label" />
              {/* @ts-ignore */}
              <YAxis />
              {/* @ts-ignore */}
              <Tooltip />
              {/* @ts-ignore */}
              <Bar dataKey="orders" fill="#05CB14" />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Revenue Chart */}
      <Card className="shadow-none border border-gray-200">
        <CardHeader className="pb-2">
          <h3 className="text-lg font-semibold">
            {revenueTitles[period || "month"]}
          </h3>
        </CardHeader>
        <Divider />
        <CardBody className="pt-6">
          {/* @ts-ignore */}
          <ResponsiveContainer width="100%" height={300}>
            {/* @ts-ignore */}
            <LineChart data={chartData} width={500} height={300}>
              {/* @ts-ignore */}
              <CartesianGrid strokeDasharray="3 3" />
              {/* @ts-ignore */}
              <XAxis dataKey="label" />
              {/* @ts-ignore */}
              <YAxis />
              {/* @ts-ignore */}
              <Tooltip
                formatter={(value) => [
                  `$${Number(value).toFixed(2)}`,
                  "Revenue",
                ]}
              />
              {/* @ts-ignore */}
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#05CB14"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>
    </div>
  );
};

export default ChartsSection;
