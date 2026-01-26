"use server";

import axiosInstance from "@/config/axios";

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactStats {
  totalContacts: number;
  unreadContacts: number;
  recentContacts: number;
  readStatus: Array<{
    status: string;
    count: number;
  }>;
}

export interface ContactsResponse {
  success: boolean;
  data: {
    contacts: Contact[];
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

export const getAllContacts = async (params?: {
  page?: number;
  limit?: number;
  isRead?: boolean | string;
  search?: string;
  email?: string;
  name?: string;
  subject?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<ContactsResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.isRead !== undefined) {
      // Handle both boolean and string (for URL params)
      const isReadValue = typeof params.isRead === 'boolean' 
        ? params.isRead.toString() 
        : params.isRead;
      queryParams.append("isRead", isReadValue);
    }
    if (params?.search) queryParams.append("search", params.search);
    if (params?.email) queryParams.append("email", params.email);
    if (params?.name) queryParams.append("name", params.name);
    if (params?.subject) queryParams.append("subject", params.subject);
    if (params?.dateFrom) queryParams.append("dateFrom", params.dateFrom);
    if (params?.dateTo) queryParams.append("dateTo", params.dateTo);

    const response = await axiosInstance.get(`/api/contacts?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw error;
  }
};

export const getContactById = async (id: string): Promise<{ success: boolean; data: { contact: Contact } }> => {
  try {
    const response = await axiosInstance.get(`/api/contacts/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching contact:", error);
    throw error;
  }
};

export const markContactAsRead = async (id: string): Promise<{ success: boolean; message: string; data: { contact: Contact } }> => {
  try {
    const response = await axiosInstance.patch(`/api/contacts/${id}/read`);
    return response.data;
  } catch (error) {
    console.error("Error marking contact as read:", error);
    throw error;
  }
};

export const markAllContactsAsRead = async (): Promise<{ success: boolean; message: string; data: { updatedCount: number } }> => {
  try {
    const response = await axiosInstance.patch("/api/contacts/mark-all-read");
    return response.data;
  } catch (error) {
    console.error("Error marking all contacts as read:", error);
    throw error;
  }
};

export const deleteContact = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axiosInstance.delete(`/api/contacts/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting contact:", error);
    throw error;
  }
};

export const deleteMultipleContacts = async (contactIds: string[]): Promise<{ success: boolean; message: string; data: { deletedCount: number } }> => {
  try {
    const response = await axiosInstance.delete("/api/contacts/bulk/delete", {
      data: { contactIds }
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting multiple contacts:", error);
    throw error;
  }
};

export const getContactStats = async (): Promise<{ success: boolean; data: ContactStats }> => {
  try {
    const response = await axiosInstance.get("/api/contacts/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching contact stats:", error);
    throw error;
  }
};
