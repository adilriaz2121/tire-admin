import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axiosInstance from "@/config/axios";

export async function GET(request: NextRequest) {
    const token = cookies().get("cookie-token")?.value;

    if (!token) {
        return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    try {
        // Try to verify token by making a request to a protected endpoint
        // Since your backend doesn't have a verify endpoint, we'll try to get articles
        const response = await axiosInstance.get("/api/admin/coupons?limit=1", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // If we get here, the token is valid
        // We'll return a mock user object since we don't have user info from this endpoint
        return NextResponse.json({
            user: {
                id: "admin",
                email: "admin@example.com",
                roles: "admin"
            }
        });
    } catch (error) {
        // Token is invalid, clear it
        cookies().delete("cookie-token");
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}
