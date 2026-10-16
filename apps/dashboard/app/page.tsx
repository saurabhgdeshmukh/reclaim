import { getCurrentUser } from "@server/session";
import { redirect } from "next/navigation";
import { ApiStatus } from "@/components/api-status";
import { SignOutButton } from "@/components/sign-out-button";
import { YardShell } from "@/components/yard-shell";

export default async function DeskPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <YardShell>
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-8 py-12">
        <header className="flex items-start justify-between gap-6">
          <div>
            <p className="font-mono text-xs tracking-[0.22em] text-carbon uppercase">
              Claims desk
            </p>
            <h1 className="mt-2 font-display text-7xl leading-none tracking-wide">
              Reclaim
            </h1>
            <p className="mt-3 font-mono text-sm">{user.email}</p>
          </div>
          <SignOutButton />
        </header>
        <div className="mt-8">
          <ApiStatus />
        </div>
        <section className="mt-10 border border-ink/15 bg-sheet">
          <div className="grid grid-cols-5 border-b border-rule px-4 py-3 font-mono text-xs tracking-[0.16em] uppercase">
            <span>Pro</span>
            <span>Dwell</span>
            <span>Free</span>
            <span>Rate</span>
            <span>Owed</span>
          </div>
          <p className="px-4 py-10 font-serif text-xl text-ink/70">
            Nothing to collect yet. The next step is a rate confirmation that
            becomes a detention invoice.
          </p>
        </section>
      </div>
    </YardShell>
  );
}
