"use server";

import axiosInstance from "@/config/axios";

export interface OrderItem {
  id: string;
  orderId: string;
  productName: string;
  productPrice: number;
  productQuantity: number;
  productTotal: number;
  productImage: string;
  productBrand: string;
  productModel: string;
  productYear: string;
  productTrim: string;
  productSize: string;
  productMfg: string;
  productDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userName: string;
  email: string;
  phone: string;
  totalAmount: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  discount?: number | null;
  couponCode?: string | null;
  trackingNumber?: string | null;
  status: 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingLocation: 'MobileInstaller' | 'LocalInstaller' | 'ShipToMe' | 'FedExPickup';
  installerId?: string | null;
  installerName?: string | null;
  appointmentDate?: string | null;
  orderItems: OrderItem[];
  createdAt: string | null;
  updatedAt: string | null;
  // Legacy fields for backward compatibility
  name?: string;
  total?: number;
  paymentIntentId?: string;
  currency?: string;
  productIds?: string[];
  productInfo?: any;
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
  status?: 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  search?: string;
  email?: string;
  userName?: string;
  name?: string; // Legacy support
  paymentIntentId?: string;
  country?: string;
  city?: string;
  state?: string;
  shippingLocation?: 'MobileInstaller' | 'LocalInstaller' | 'ShipToMe' | 'FedExPickup';
  couponCode?: string;
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
  if (params?.shippingLocation) queryParams.append("shippingLocation", params.shippingLocation);
    if (params?.search) queryParams.append("search", params.search);
    if (params?.email) queryParams.append("email", params.email);
    if (params?.userName) queryParams.append("userName", params.userName);
    if (params?.name) queryParams.append("userName", params.name); // Legacy support
    if (params?.paymentIntentId) queryParams.append("paymentIntentId", params.paymentIntentId);
    if (params?.country) queryParams.append("country", params.country);
    if (params?.city) queryParams.append("city", params.city);
    if (params?.state) queryParams.append("state", params.state);
    if (params?.couponCode) queryParams.append("couponCode", params.couponCode);
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

export const updateOrderStatus = async (id: string, status: 'confirmed' | 'shipped' | 'delivered' | 'cancelled', shippingLocation?: 'MobileInstaller' | 'LocalInstaller' | 'ShipToMe' | 'FedExPickup'): Promise<{ success: boolean; message: string; data: { order: Order } }> => {
  try {
    const body: any = {};
    if (status) body.status = status;
    if (shippingLocation) body.shippingLocation = shippingLocation;
    
    const response = await axiosInstance.patch(`/api/orders/${id}`, body);
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

export const shipOrder = async (
  id: string
): Promise<{ success: boolean; message: string; data: { order: Order; trackingNumber: string } }> => {
  try {
    const response = await axiosInstance.post(`/api/orders/${id}/ship`);
    return response.data;
  } catch (error: any) {
    console.error("Error shipping order:", error);
    const message = error?.response?.data?.error || "Failed to create FedEx shipment";
    throw new Error(message);
  }
};

export const getInstallerDetails = async (installerId: string): Promise<{ success: boolean; data: any }> => {
  try {
    const response = await axiosInstance.get(`/api/user/yelp/businesses/${installerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching installer details:", error);
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
