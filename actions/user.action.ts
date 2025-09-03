"use server";

import { cookies } from "next/headers";
import axiosInstance from "@/config/axios";
import { IUser, Result, LoginFormType } from "@/helpers/types";

export async function signIn(data: LoginFormType): Promise<Result<{ token: string; user: IUser }>> {
  try {
    const response = await axiosInstance.post("/api/admin/signin", data);

    // Set token in cookies
    const cookieStore = cookies();
    cookieStore.set("cookie-token", response.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 24 * 60 * 60, // 15 days
    });

    return { data: { token: response.data.token, user: response.data.user } };
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "Sign in failed";
    return { error: errorMessage };
  }
}

export async function signOut(): Promise<Result<{ message: string }>> {
  try {
    // Clear the token from cookies
    const cookieStore = cookies();
    cookieStore.delete("cookie-token");

    return { data: { message: "Logged out successfully" } };
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "Sign out failed";
    return { error: errorMessage };
  }
}

export async function uploadImage(file: File): Promise<Result<{ url: string }>> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post("/api/admin/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return { data: { url: response.data.data.url } };
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "Upload failed";
    return { error: errorMessage };
  }
}
