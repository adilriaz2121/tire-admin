"use server";

import axiosInstance from "@/config/axios";
import { IReview, Result } from "@/helpers/types";

export async function getAllReviews({
    query,
    page,
    limit,
    rating,
    productId,
}: {
    query?: string;
    page?: number;
    limit?: number;
    rating?: number;
    productId?: string;
}): Promise<Result<{ items: IReview[] }>> {
    try {
        const response = await axiosInstance.get("/api/admin/reviews", {
            params: { q: query, page, limit, rating, productId },
        });

        return { data: { items: response.data.items }, meta: response.data.meta };
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Fetch reviews failed";
        return { error: errorMessage };
    }
}

export async function getReviewById(
    id: string
): Promise<Result<{ review: IReview }>> {
    try {
        const response = await axiosInstance.get(`/api/admin/reviews/${id}`);
        return { data: { review: response.data.review } };
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Get review failed";
        return { error: errorMessage };
    }
}

export async function updateReview(
    id: string,
    data: Partial<Omit<IReview, "id" | "createdAt">>
): Promise<Result<IReview>> {
    try {
        const response = await axiosInstance.put(`/api/admin/reviews/${id}`, data);
        return { data: response.data.review };
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Update review failed";
        return { error: errorMessage };
    }
}

export async function deleteReview(
    id: string
): Promise<Result<{ message: string }>> {
    try {
        await axiosInstance.delete(`/api/admin/reviews/${id}`);
        return { data: { message: "Review deleted successfully" } };
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Delete review failed";
        return { error: errorMessage };
    }
}
