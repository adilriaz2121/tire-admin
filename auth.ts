import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Replace with your authentication logic
        if (credentials?.username === "admin" && credentials?.password === "password") {
          return { id: "1", name: "Admin" };
        }
        return null;
      }
    })
  ],
  // Add other NextAuth options as needed
};

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
