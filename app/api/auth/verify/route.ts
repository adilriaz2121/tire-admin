import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axiosInstance from "@/config/axios";

export async function GET(request: NextRequest) {
    const token = cookies().get("cookie-token")?.value;

    if (!token) {
        return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    try {
        // Verify token is valid by making a request to a protected endpoint
        // This ensures the token is still valid on the backend
        const response = await axiosInstance.get("/api/admin/coupons?limit=1", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // If we get here, the token is valid
        // Decode the JWT token to get user info (without verification, just parsing)
        // We trust the backend verification above
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            // Use Buffer for Node.js environment
            const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');
            const decoded = JSON.parse(jsonPayload) as { id: string; roles: string };

            return NextResponse.json({
                user: {
                    id: decoded.id,
                    roles: decoded.roles,
                }
            });
        } catch (decodeError) {
            // If we can't decode, still return success since backend verified it
            return NextResponse.json({
                user: {
                    id: "admin",
                    roles: "admin",
                }
            });
        }
    } catch (error: any) {
        // Backend rejected the token, clear it
        const cookieStore = cookies();
        cookieStore.delete("cookie-token");
        
        const errorMessage = error.response?.data?.error || error.message || "Invalid token";
        return NextResponse.json({ error: errorMessage }, { status: 401 });
    }
}
