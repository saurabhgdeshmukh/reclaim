import { exchangeAuthCode } from "@server/session";
import { isSupabaseConfigured } from "@shared/config";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (code && isSupabaseConfigured()) {
    await exchangeAuthCode(code);
  }

  return NextResponse.redirect(new URL("/", url.origin));
}
