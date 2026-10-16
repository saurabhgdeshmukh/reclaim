import { z } from "zod";

export const DEMO_EMAIL_COOKIE = "reclaim_demo_email";

export function supabasePublishableKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    ""
  );
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && supabasePublishableKey(),
  );
}

const emailSchema = z.email();

export function readDemoEmail(value: string | undefined): string | null {
  if (!value) {
    return null;
  }
  const parsed = emailSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}
