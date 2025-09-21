"use server";

import axiosInstance from "@/config/axios";

export interface Order {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalAmount: number;
  productIds: string[];
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  total: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  paymentIntentId: string;
  currency: string;
  userInfo: any;
  shippingInfo: any;
  pricingInfo: any;
  productInfo: any;
  createdAt: string;
  updatedAt: string;
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  recentOrders: number;
  statusBreakdown: Array<{
    status: string;
    count: number;
    revenue: number;
  }>;
}

export interface OrdersResponse {
  success: boolean;
  data: {
    orders: Order[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      nextPage: number | null;
      prevPage: number | null;
    };
  };
}

export const getAllOrders = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  email?: string;
  name?: string;
  paymentIntentId?: string;
  country?: string;
  city?: string;
  state?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}): Promise<OrdersResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.status) queryParams.append("status", params.status);
    if (params?.search) queryParams.append("search", params.search);
    if (params?.email) queryParams.append("email", params.email);
    if (params?.name) queryParams.append("name", params.name);
    if (params?.paymentIntentId) queryParams.append("paymentIntentId", params.paymentIntentId);
    if (params?.country) queryParams.append("country", params.country);
    if (params?.city) queryParams.append("city", params.city);
    if (params?.state) queryParams.append("state", params.state);
    if (params?.dateFrom) queryParams.append("dateFrom", params.dateFrom);
    if (params?.dateTo) queryParams.append("dateTo", params.dateTo);
    if (params?.minAmount) queryParams.append("minAmount", params.minAmount.toString());
    if (params?.maxAmount) queryParams.append("maxAmount", params.maxAmount.toString());

    const url = `/api/orders?${queryParams.toString()}`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const getOrderById = async (id: string): Promise<{ success: boolean; data: { order: Order } }> => {
  try {
    const response = await axiosInstance.get(`/api/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

export const updateOrderStatus = async (id: string, status: 'pending' | 'shipped' | 'delivered' | 'cancelled'): Promise<{ success: boolean; message: string; data: { order: Order } }> => {
  try {
    const response = await axiosInstance.patch(`/api/orders/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

export const getOrderStats = async (): Promise<{ success: boolean; data: OrderStats }> => {
  try {
    const response = await axiosInstance.get("/api/orders/stats/overview");
    return response.data;
  } catch (error) {
    console.error("Error fetching order stats:", error);
    throw error;
  }
};
