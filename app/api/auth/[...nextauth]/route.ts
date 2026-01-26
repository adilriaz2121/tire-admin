// NextAuth is not used in this application
// We use custom JWT-based authentication instead
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    return NextResponse.json({ error: "Not implemented" }, { status: 404 });
}

export async function POST(request: NextRequest) {
    return NextResponse.json({ error: "Not implemented" }, { status: 404 });
}
