import {
  type DetentionResponse,
  detentionRequestSchema,
  detentionResponseSchema,
} from "@reclaim/api-contracts";

export type DetentionQuoteInput = {
  /** Value from an `<input type="datetime-local">`. */
  arrivedAt: string;
  departedAt: string;
  freeMinutes: string;
  /** Dollars per hour, such as "75" or "75.50". */
  rateDollars: string;
};

export async function quoteDetention(
  input: DetentionQuoteInput,
): Promise<DetentionResponse> {
  const body = detentionRequestSchema.parse({
    arrivedAt: localDateTimeToIso(input.arrivedAt),
    departedAt: localDateTimeToIso(input.departedAt),
    freeMinutes: parseFreeMinutes(input.freeMinutes),
    rateCentsPerHour: dollarsToCents(input.rateDollars),
  });

  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  const response = await fetch(`${base}/v1/detention/calculate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new Error(payload?.message ?? "The yard could not price this stop.");
  }

  return detentionResponseSchema.parse(await response.json());
}

function localDateTimeToIso(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    throw new Error("Enter arrival and departure as a date and time.");
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Enter a real arrival and departure.");
  }
  return date.toISOString();
}

function parseFreeMinutes(value: string): number {
  if (!/^\d+$/.test(value.trim())) {
    throw new Error("Free time must be a whole number of minutes.");
  }
  return Number(value);
}

function dollarsToCents(value: string): number {
  const trimmed = value.trim();
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) {
    throw new Error("Rate must be dollars and cents, like 75.00.");
  }
  const [whole, fraction = ""] = trimmed.split(".");
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
}
