import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function getServerSession() {
  try {
    const token = cookies().get("cookie-token")?.value;

    if (!token) {
      return null;
    }

    // For middleware, we just check if token exists
    // Actual verification will happen in the API routes via backend
    // This is a lightweight check for middleware performance
    return {
      token,
    };
  } catch (error) {
    console.error("Error in getServerSession:", error);
    return null;
  }
}

export async function requireAuth(request: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return session;
}
