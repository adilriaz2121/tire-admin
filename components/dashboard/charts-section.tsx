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
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { OrdersChartData } from "@/actions/stats.action";

interface ChartsSectionProps {
  charts: {
    orders: OrdersChartData;
  };
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ charts }) => {
  // Transform monthly data for charts
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const ordersMonthlyData = charts.orders.monthlyData.map((item) => ({
    month: monthNames[item.month - 1],
    orders: item.count,
    revenue: item.revenue,
  }));

  // Status breakdown pie chart data
  const statusColors = {
    pending: "#f59e0b",
    shipped: "#05CB14",
    delivered: "#10b981",
    cancelled: "#ef4444",
  };

  const statusPieData = charts.orders.statusBreakdown.map((item) => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    value: item.count,
    color: statusColors[item.status as keyof typeof statusColors] || "#6b7280",
  }));

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Orders Chart */}
      <Card>
        <CardHeader className="pb-2">
          <div>
            <h3 className="text-lg font-semibold">Orders This Year</h3>
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
            <BarChart data={ordersMonthlyData} width={500} height={300}>
              {/* @ts-ignore */}
              <CartesianGrid strokeDasharray="3 3" />
              {/* @ts-ignore */}
              <XAxis dataKey="month" />
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
      <Card>
        <CardHeader className="pb-2">
          <h3 className="text-lg font-semibold">Monthly Revenue</h3>
        </CardHeader>
        <Divider />
        <CardBody className="pt-6">
          {/* @ts-ignore */}
          <ResponsiveContainer width="100%" height={300}>
            {/* @ts-ignore */}
            <LineChart data={ordersMonthlyData} width={500} height={300}>
              {/* @ts-ignore */}
              <CartesianGrid strokeDasharray="3 3" />
              {/* @ts-ignore */}
              <XAxis dataKey="month" />
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

      {/* Order Status Breakdown */}
    </div>
  );
};

export default ChartsSection;
