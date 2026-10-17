"use client";

import { quoteDetention } from "@client/detention";
import { type FormEvent, useState } from "react";

type Quote = {
  id: string;
  pro: string;
  dwell: string;
  free: string;
  rate: string;
  owed: string;
  amountCents: number;
};

export function DetentionSlip() {
  const [pro, setPro] = useState("");
  const [arrivedAt, setArrivedAt] = useState("");
  const [departedAt, setDepartedAt] = useState("");
  const [freeMinutes, setFreeMinutes] = useState("120");
  const [rateDollars, setRateDollars] = useState("75.00");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      const result = await quoteDetention({
        arrivedAt,
        departedAt,
        freeMinutes,
        rateDollars,
      });
      setQuotes((current) => [
        {
          id: crypto.randomUUID(),
          pro: pro.trim(),
          dwell: formatMinutes(result.totalMinutes),
          free: formatMinutes(result.freeMinutes),
          rate: formatRate(rateDollars),
          owed: formatCents(result.amountCents),
          amountCents: result.amountCents,
        },
        ...current,
      ]);
      setPro("");
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Could not price this stop.",
      );
    } finally {
      setPending(false);
    }
  }

  const totalCents = quotes.reduce((sum, quote) => sum + quote.amountCents, 0);

  return (
    <section className="mt-10 border border-ink/15 bg-sheet">
      <form onSubmit={onSubmit} className="border-b border-rule px-4 py-6">
        <p className="font-mono text-xs tracking-[0.22em] text-carbon uppercase">
          Detention slip
        </p>
        <p className="mt-2 max-w-xl font-serif text-lg text-ink/80">
          Price one stop. The quote stays on this desk until you refresh. It is
          not saved.
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <Field
            id="pro"
            label="Pro"
            value={pro}
            onChange={setPro}
            required
            placeholder="PRO-1042"
          />
          <Field
            id="arrived"
            label="Arrived"
            type="datetime-local"
            value={arrivedAt}
            onChange={setArrivedAt}
            required
          />
          <Field
            id="departed"
            label="Departed"
            type="datetime-local"
            value={departedAt}
            onChange={setDepartedAt}
            required
          />
          <Field
            id="free"
            label="Free minutes"
            type="number"
            min={0}
            step={1}
            value={freeMinutes}
            onChange={setFreeMinutes}
            required
          />
          <Field
            id="rate"
            label="Rate $/hour"
            inputMode="decimal"
            value={rateDollars}
            onChange={setRateDollars}
            required
          />
        </div>
        {error ? <p className="mt-4 font-serif text-stamp">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="mt-6 bg-ink px-5 py-3 font-display text-2xl tracking-wide text-paper disabled:opacity-60"
        >
          {pending ? "Pricing…" : "Price this stop"}
        </button>
      </form>
      <div className="grid grid-cols-5 border-b border-rule px-4 py-3 font-mono text-xs tracking-[0.16em] uppercase">
        <span>Pro</span>
        <span>Dwell</span>
        <span>Free</span>
        <span>Rate</span>
        <span>Owed</span>
      </div>
      {quotes.length === 0 ? (
        <p className="px-4 py-10 font-serif text-xl text-ink/70">
          Nothing to collect yet. Fill in the slip above.
        </p>
      ) : (
        <ul>
          {quotes.map((quote) => (
            <li
              key={quote.id}
              className="grid grid-cols-5 border-b border-rule px-4 py-4 font-serif text-lg last:border-b-0"
            >
              <span>{quote.pro}</span>
              <span>{quote.dwell}</span>
              <span>{quote.free}</span>
              <span>{quote.rate}</span>
              <span
                className={quote.amountCents > 0 ? "text-stamp" : undefined}
              >
                {quote.owed}
              </span>
            </li>
          ))}
          <li className="grid grid-cols-5 px-4 py-4 font-mono text-sm tracking-[0.12em] uppercase">
            <span className="col-span-4">Desk total</span>
            <span className={totalCents > 0 ? "text-stamp" : undefined}>
              {formatCents(totalCents)}
            </span>
          </li>
        </ul>
      )}
    </section>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  min,
  step,
  inputMode,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  min?: number;
  step?: number;
  inputMode?: "decimal";
}) {
  return (
    <label className="block" htmlFor={id}>
      <span className="font-mono text-xs tracking-[0.18em] uppercase">
        {label}
      </span>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        min={min}
        step={step}
        inputMode={inputMode}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full border-b border-ink bg-transparent py-2 font-serif text-lg outline-none"
      />
    </label>
  );
}

function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `${hours}h ${String(rest).padStart(2, "0")}m`;
}

function formatCents(cents: number): string {
  const dollars = Math.floor(cents / 100);
  const rest = String(cents % 100).padStart(2, "0");
  return `$${dollars}.${rest}`;
}

function formatRate(rateDollars: string): string {
  const [whole, fraction = "00"] = rateDollars.trim().split(".");
  return `$${whole}.${fraction.padEnd(2, "0")}/h`;
}
