"use server";

import axiosInstance from "@/config/axios";
import { IArticle, Result } from "@/helpers/types";

export async function getAllArticles({
    query,
    page,
    limit,
}: {
    query?: string;
    page?: number;
    limit?: number;
}): Promise<Result<{ items: IArticle[] }>> {
    try {
        const response = await axiosInstance.get("/api/user/articles", {
            params: { q: query, page, limit },
        });

        return { data: { items: response.data.items }, meta: response.data.meta };
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Fetch articles failed";
        return { error: errorMessage };
    }
}

export async function getArticleById(
    id: string
): Promise<Result<{ article: IArticle }>> {
    try {
        const res = await axiosInstance.get(`/api/user/articles/${id}`);
        return { data: { article: res.data.article } };
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Get article failed";
        return { error: errorMessage };
    }
}

export async function createArticle(
    data: Omit<IArticle, "id" | "createdAt" | "updatedAt">
): Promise<Result<IArticle>> {
    try {
        const response = await axiosInstance.post("/api/admin/articles", data);
        return { data: response.data.article };
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Create article failed";
        return { error: errorMessage };
    }
}

export async function updateArticle(
    id: string,
    data: Partial<Omit<IArticle, "id" | "createdAt" | "updatedAt">>
): Promise<Result<IArticle>> {
    try {
        const response = await axiosInstance.put(`/api/admin/articles/${id}`, data);
        return { data: response.data.article };
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Update article failed";
        return { error: errorMessage };
    }
}

export async function deleteArticle(
    id: string
): Promise<Result<{ message: string }>> {
    try {
        await axiosInstance.delete(`/api/admin/articles/${id}`);
        return { data: { message: "Article deleted successfully" } };
    } catch (error: any) {
        const errorMessage = error.response?.data?.error || "Delete article failed";
        return { error: errorMessage };
    }
}
