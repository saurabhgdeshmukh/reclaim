import { demoSignInSchema } from "@reclaim/api-contracts";
import { isSupabaseConfigured } from "@shared/config";
import { createClient } from "./supabase";

export async function signIn(email: string, password: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw new Error(error.message);
    }
    return;
  }

  await postDemo({ email, password });
}

export async function signUp(
  email: string,
  password: string,
): Promise<"session" | "confirm"> {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      throw new Error(error.message);
    }
    return data.session ? "session" : "confirm";
  }

  await postDemo({ email, password });
  return "session";
}

export async function signOut(): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
    return;
  }

  const response = await fetch("/api/auth/demo", { method: "DELETE" });
  if (!response.ok) {
    throw new Error("Could not sign out");
  }
}

async function postDemo(input: {
  email: string;
  password: string;
}): Promise<void> {
  const parsed = demoSignInSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error("Use an email and a password of at least 8 characters.");
  }

  const response = await fetch("/api/auth/demo", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new Error(body?.message ?? "Sign-in failed");
  }
}
