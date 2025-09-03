"use client";
import { useAuth } from "@/hooks/useAuth";

export const useCheckAdmin = () => {
    const { user } = useAuth();
    const isAdmin = user?.roles === "admin";
    return { isAdmin };
}
