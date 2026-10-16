import Link from "next/link";
import { GateForm } from "@/components/gate-form";
import { YardShell } from "@/components/yard-shell";

export default function SignupPage() {
  return (
    <YardShell>
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-8 py-16">
        <p className="font-display text-7xl leading-none tracking-wide">
          Reclaim
        </p>
        <div className="mt-10">
          <GateForm mode="sign-up" />
        </div>
        <p className="mt-6 font-serif">
          Already on the list?{" "}
          <Link
            href="/login"
            className="underline decoration-safety decoration-4 underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </div>
    </YardShell>
  );
}
