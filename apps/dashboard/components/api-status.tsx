"use client";

import { fetchHealth } from "@client/health";
import { useEffect, useState } from "react";

type State = "checking" | "live" | "down";

export function ApiStatus() {
  const [state, setState] = useState<State>("checking");

  useEffect(() => {
    let cancelled = false;
    fetchHealth()
      .then(() => {
        if (!cancelled) {
          setState("live");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState("down");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const label =
    state === "live"
      ? "Yard radio live"
      : state === "down"
        ? "Yard radio quiet"
        : "Checking radio";

  return (
    <p className="font-mono text-xs tracking-[0.16em] uppercase">
      <span
        className={`mr-2 inline-block h-2 w-2 rounded-full ${state === "live" ? "bg-carbon" : "bg-stamp"}`}
      />
      {label}
    </p>
  );
}
