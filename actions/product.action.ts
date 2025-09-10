"use server";

import axiosInstance from "@/config/axios";
import { IProduct, Result } from "@/helpers/types";

export async function getAllProducts({
    query,
    page,
    limit,
    make,
    model,
    year,
}: {
    query?: string;
    page?: number;
    limit?: number;
    make?: string;
    model?: string;
    year?: string;
}): Promise<Result<{ items: IProduct[] }>> {
    try {
        const response = await axiosInstance.get("/api/admin/products", {
            params: { q: query, page, limit, make, model, year },
        });

        return { data: { items: response.data.items }, meta: response.data.meta };
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Fetch products failed";
        return { error: errorMessage };
    }
}

export async function getProductById(
    id: string
): Promise<Result<{ product: IProduct }>> {
    try {
        const response = await axiosInstance.get(`/api/admin/products/${id}`);
        return { data: { product: response.data.product } };
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Fetch product failed";
        return { error: errorMessage };
    }
}

export async function createProduct(
    data: Omit<IProduct, "id" | "createdAt" | "updatedAt" | "reviews">
): Promise<Result<IProduct>> {
    try {
        const response = await axiosInstance.post("/api/admin/products", data);
        return { data: response.data.product };
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Create product failed";
        return { error: errorMessage };
    }
}

export async function updateProduct(
    id: string,
    data: Partial<Omit<IProduct, "id" | "createdAt" | "updatedAt" | "reviews">>
): Promise<Result<IProduct>> {
    try {
        const response = await axiosInstance.put(`/api/admin/products/${id}`, data);
        return { data: response.data.product };
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Update product failed";
        return { error: errorMessage };
    }
}

export async function deleteProduct(id: string): Promise<Result<null>> {
    try {
        await axiosInstance.delete(`/api/admin/products/${id}`);
        return { data: null };
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Delete product failed";
        return { error: errorMessage };
    }
}

export async function toggleProductActive(id: string, currentStatus: boolean): Promise<Result<IProduct>> {
    try {
        const response = await axiosInstance.patch(`/api/admin/products/${id}/toggle-active`, {
            isActive: !currentStatus
        });
        return { data: response.data.product };
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Toggle product status failed";
        return { error: errorMessage };
    }
}
