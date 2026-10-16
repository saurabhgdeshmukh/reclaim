import "server-only";

import {
  DEMO_EMAIL_COOKIE,
  isSupabaseConfigured,
  readDemoEmail,
} from "@shared/config";
import type { SessionUser } from "@shared/user";
import { cookies } from "next/headers";
import { createClient } from "./supabase";

export async function getCurrentUser(): Promise<SessionUser | null> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user?.email) {
      return null;
    }
    return { id: data.user.id, email: data.user.email };
  }

  const cookieStore = await cookies();
  const email = readDemoEmail(cookieStore.get(DEMO_EMAIL_COOKIE)?.value);
  if (!email) {
    return null;
  }
  return { id: "demo", email };
}

export async function exchangeAuthCode(code: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    throw new Error(error.message);
  }
}
