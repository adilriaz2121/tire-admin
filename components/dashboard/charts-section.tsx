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
import { ProductsChartData, OrdersChartData } from "@/actions/stats.action";

interface ChartsSectionProps {
  charts: {
    products: ProductsChartData;
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

  const productsMonthlyData = charts.products.monthlyData.map((item) => ({
    month: monthNames[item.month - 1],
    products: item.count,
  }));

  const ordersMonthlyData = charts.orders.monthlyData.map((item) => ({
    month: monthNames[item.month - 1],
    orders: item.count,
    revenue: item.revenue,
  }));

  // Status breakdown pie chart data
  const statusColors = {
    pending: "#f59e0b",
    shipped: "#3b82f6",
    delivered: "#10b981",
    cancelled: "#ef4444",
  };

  const statusPieData = charts.orders.statusBreakdown.map((item) => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    value: item.count,
    color: statusColors[item.status as keyof typeof statusColors] || "#6b7280",
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Products Chart */}
      <Card>
        <CardHeader className="pb-2">
          <div>
            <h3 className="text-lg font-semibold">Products Added This Year</h3>
            <p className="text-sm text-gray-600">
              Total: {charts.products.summary.total} | Active:{" "}
              {charts.products.summary.active} | Inactive:{" "}
              {charts.products.summary.inactive}
            </p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productsMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="products"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

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
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ordersMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#82ca9d" />
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
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ordersMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value) => [
                  `$${Number(value).toFixed(2)}`,
                  "Revenue",
                ]}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Order Status Breakdown */}
      <Card>
        <CardHeader className="pb-2">
          <h3 className="text-lg font-semibold">Order Status Breakdown</h3>
        </CardHeader>
        <Divider />
        <CardBody className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusPieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>
    </div>
  );
};

export default ChartsSection;
