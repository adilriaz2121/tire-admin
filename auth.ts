import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function getServerSession() {
  const token = cookies().get("cookie-token")?.value;

  if (!token) {
    return null;
  }

  // For middleware, we just check if token exists
  // Actual verification will happen in the API routes
  return {
    token,
  };
}

export async function requireAuth(request: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return session;
}
