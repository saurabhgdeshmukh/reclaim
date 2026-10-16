import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import {
  DEMO_EMAIL_COOKIE,
  isSupabaseConfigured,
  readDemoEmail,
  supabasePublishableKey,
} from "./lib/shared/config";

const PUBLIC_PREFIXES = ["/login", "/signup", "/auth", "/api/auth"];

function isPublic(pathname: string): boolean {
  return PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export async function proxy(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    const email = readDemoEmail(request.cookies.get(DEMO_EMAIL_COOKIE)?.value);
    return gate(request, email, NextResponse.next({ request }));
  }

  let supabaseResponse = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    return gate(request, null, supabaseResponse);
  }

  const supabase = createServerClient(url, supabasePublishableKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        supabaseResponse = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          supabaseResponse.cookies.set(name, value, options);
        }
        for (const [key, value] of Object.entries(headers)) {
          supabaseResponse.headers.set(key, value);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return gate(request, user?.email ?? null, supabaseResponse);
}

function gate(
  request: NextRequest,
  email: string | null,
  supabaseResponse: NextResponse,
) {
  const { pathname } = request.nextUrl;
  if (!email && !isPublic(pathname)) {
    return redirectTo(request, "/login", supabaseResponse);
  }
  if (email && (pathname === "/login" || pathname === "/signup")) {
    return redirectTo(request, "/", supabaseResponse);
  }
  return supabaseResponse;
}

function redirectTo(
  request: NextRequest,
  pathname: string,
  supabaseResponse: NextResponse,
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  const redirect = NextResponse.redirect(url);
  for (const cookie of supabaseResponse.cookies.getAll()) {
    redirect.cookies.set(cookie);
  }
  return redirect;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
