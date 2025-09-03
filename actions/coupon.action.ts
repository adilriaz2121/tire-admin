"use server";

import axiosInstance from "@/config/axios";
import { ICoupon, Result } from "@/helpers/types";

export async function getAllCoupons({
    query,
    page,
    limit,
}: {
    query?: string;
    page?: number;
    limit?: number;
}): Promise<Result<{ items: ICoupon[] }>> {
    try {
        const response = await axiosInstance.get("/api/admin/coupons", {
            params: { q: query, page, limit },
        });

        return { data: { items: response.data.items }, meta: response.data.meta };
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Fetch coupons failed";
        return { error: errorMessage };
    }
}

export async function getCouponById(
    id: string
): Promise<Result<{ coupon: ICoupon }>> {
    try {
        const res = await axiosInstance.get(`/api/admin/coupons/${id}`);
        return { data: { coupon: res.data.coupon } };
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Get coupon failed";
        return { error: errorMessage };
    }
}

export async function createCoupon(
    data: Omit<ICoupon, "id" | "usedCount" | "createdAt" | "updatedAt">
): Promise<Result<ICoupon>> {
    try {
        const response = await axiosInstance.post("/api/admin/coupons", data);
        return { data: response.data.coupon };
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Create coupon failed";
        return { error: errorMessage };
    }
}

export async function updateCoupon(
    id: string,
    data: Partial<Omit<ICoupon, "id" | "usedCount" | "createdAt" | "updatedAt">>
): Promise<Result<ICoupon>> {
    try {
        const response = await axiosInstance.put(`/api/admin/coupons/${id}`, data);
        return { data: response.data.coupon };
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Update coupon failed";
        return { error: errorMessage };
    }
}

export async function deleteCoupon(
    id: string
): Promise<Result<{ message: string }>> {
    try {
        await axiosInstance.delete(`/api/admin/coupons/${id}`);
        return { data: { message: "Coupon deleted successfully" } };
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Delete coupon failed";
        return { error: errorMessage };
    }
}

export async function setCouponActive(
    id: string,
    isActive: boolean
): Promise<Result<ICoupon>> {
    try {
        const response = await axiosInstance.patch(`/api/admin/coupons/${id}/active`, {
            isActive,
        });
        return { data: response.data.coupon };
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Update coupon status failed";
        return { error: errorMessage };
    }
}

export async function incrementCouponUsage(
    id: string
): Promise<Result<ICoupon>> {
    try {
        const response = await axiosInstance.post(`/api/admin/coupons/${id}/increment`);
        return { data: response.data.coupon };
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Increment coupon usage failed";
        return { error: errorMessage };
    }
}
