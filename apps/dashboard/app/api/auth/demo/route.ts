import { demoSignInSchema } from "@reclaim/api-contracts";
import { DEMO_EMAIL_COOKIE, isSupabaseConfigured } from "@shared/config";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (isSupabaseConfigured() || process.env.NODE_ENV === "production") {
    return NextResponse.json(
      {
        message: "Demo sign-in is only for local development without Supabase.",
      },
      { status: 404 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = demoSignInSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Use an email and a password of at least 8 characters." },
      { status: 400 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(DEMO_EMAIL_COOKIE, parsed.data.email, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(DEMO_EMAIL_COOKIE, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return response;
}
