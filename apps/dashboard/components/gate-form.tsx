"use client";

import { signIn, signUp } from "@client/auth";
import { isSupabaseConfigured } from "@shared/config";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

type Mode = "sign-in" | "sign-up";

export function GateForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const demo = !isSupabaseConfigured();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setPending(true);
    try {
      if (mode === "sign-in") {
        await signIn(email, password);
        router.push("/");
        router.refresh();
        return;
      }
      const result = await signUp(email, password);
      if (result === "confirm") {
        setNotice("Check your email to confirm the account, then sign in.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Something went wrong",
      );
    } finally {
      setPending(false);
    }
  }

  const title = mode === "sign-in" ? "Gate pass" : "New carrier";
  const action = mode === "sign-in" ? "Enter the yard" : "Open an account";

  return (
    <form
      onSubmit={onSubmit}
      className="relative max-w-md border border-ink/15 bg-sheet p-8 shadow-[8px_8px_0_0_rgba(28,22,18,0.12)]"
    >
      <p className="font-mono text-xs tracking-[0.22em] text-carbon uppercase">
        Bill of lading
      </p>
      <h1 className="mt-2 font-display text-6xl leading-none tracking-wide">
        {title}
      </h1>
      <p className="mt-4 font-serif text-lg text-ink/80">
        {demo
          ? "Supabase is not connected, so this sign-in stays on your laptop."
          : "Sign in with the carrier account for this yard."}
      </p>
      <label
        className="mt-8 block font-mono text-xs tracking-[0.18em] uppercase"
        htmlFor="email"
      >
        Carrier email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="mt-2 w-full border-b border-ink bg-transparent py-2 font-serif text-lg outline-none"
      />
      <label
        className="mt-6 block font-mono text-xs tracking-[0.18em] uppercase"
        htmlFor="password"
      >
        Gate code
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
        required
        minLength={8}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className="mt-2 w-full border-b border-ink bg-transparent py-2 font-serif text-lg outline-none"
      />
      {error ? <p className="mt-4 font-serif text-stamp">{error}</p> : null}
      {notice ? <p className="mt-4 font-serif text-carbon">{notice}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-8 bg-ink px-5 py-3 font-display text-2xl tracking-wide text-paper disabled:opacity-60"
      >
        {pending ? "Checking the gate…" : action}
      </button>
    </form>
  );
}
