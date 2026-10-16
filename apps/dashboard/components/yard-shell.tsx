import type { ReactNode } from "react";

export function YardShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[92px_1fr]">
      <aside className="flex items-end justify-center bg-safety px-3 py-8">
        <p className="rotate-180 font-display text-4xl tracking-wide text-ink [writing-mode:vertical-rl]">
          DOCK 04
        </p>
      </aside>
      <div className="dock-grid relative">{children}</div>
    </div>
  );
}
