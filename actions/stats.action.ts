"use server";

import axiosInstance from "@/config/axios";

export interface AdminStats {
  totalUnreadContacts: number;
  totalDeliveredOrders: number;
  totalRevenue: number;
  totalProcessingOrders: number;
}

export interface ProductsChartData {
  monthlyData: Array<{
    month: number;
    count: number;
  }>;
  summary: {
    total: number;
    active: number;
    inactive: number;
  };
}

export interface OrdersChartData {
  monthlyData: Array<{
    month: number;
    count: number;
    revenue: number;
  }>;
  summary: {
    total: number;
    revenue: number;
    averageOrderValue: number;
  };
  statusBreakdown: Array<{
    status: string;
    count: number;
  }>;
}

export interface DashboardData {
  cards: AdminStats;
  charts: {
    orders: OrdersChartData;
  };
}

export const getAdminStats = async (): Promise<{ success: boolean; data: AdminStats }> => {
  try {
    const response = await axiosInstance.get("/api/stats/cards");
    return response.data;
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    throw error;
  }
};

export const getProductsChartData = async (): Promise<{ success: boolean; data: ProductsChartData }> => {
  try {
    const response = await axiosInstance.get("/api/stats/charts/products");
    return response.data;
  } catch (error) {
    console.error("Error fetching products chart data:", error);
    throw error;
  }
};

export const getOrdersChartData = async (): Promise<{ success: boolean; data: OrdersChartData }> => {
  try {
    const response = await axiosInstance.get("/api/stats/charts/orders");
    return response.data;
  } catch (error) {
    console.error("Error fetching orders chart data:", error);
    throw error;
  }
};

export interface DashboardFilters {
  period?: "day" | "week" | "month" | "year";
  year?: number;
  month?: number;
}

export const getDashboardData = async (
  filters?: DashboardFilters
): Promise<{ success: boolean; data: DashboardData }> => {
  try {
    const params = new URLSearchParams();
    if (filters?.period) params.append("period", filters.period);
    if (filters?.year) params.append("year", String(filters.year));
    if (filters?.month) params.append("month", String(filters.month));

    const query = params.toString();
    const response = await axiosInstance.get(
      `/api/stats/dashboard${query ? `?${query}` : ""}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};
