import Link from "next/link";
import { GateForm } from "@/components/gate-form";
import { YardShell } from "@/components/yard-shell";

export default function LoginPage() {
  return (
    <YardShell>
      <div className="pointer-events-none absolute top-16 right-10 hidden h-28 w-28 rotate-12 items-center justify-center rounded-full border-4 border-stamp/70 font-display text-2xl tracking-widest text-stamp/80 uppercase sm:flex">
        Unpaid
      </div>
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-8 py-16">
        <p className="font-display text-7xl leading-none tracking-wide sm:text-8xl">
          Reclaim
        </p>
        <p className="mt-3 max-w-xl font-serif text-2xl text-ink/80">
          Hours the dock kept. Money the load is owed.
        </p>
        <div className="mt-10">
          <GateForm mode="sign-in" />
        </div>
        <p className="mt-6 font-serif">
          New yard?{" "}
          <Link
            href="/signup"
            className="underline decoration-safety decoration-4 underline-offset-4"
          >
            Open an account
          </Link>
        </p>
      </div>
    </YardShell>
  );
}
