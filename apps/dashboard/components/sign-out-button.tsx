"use client";

import { signOut } from "@client/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onClick() {
    setPending(true);
    try {
      await signOut();
      router.push("/login");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="border border-ink px-3 py-2 font-mono text-xs tracking-[0.16em] uppercase"
    >
      {pending ? "Leaving…" : "Sign out"}
    </button>
  );
}
