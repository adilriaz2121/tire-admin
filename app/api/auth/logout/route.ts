import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    // Clear the token from cookies
    cookies().delete("cookie-token");

    return NextResponse.json({ message: "Logged out successfully" });
}
