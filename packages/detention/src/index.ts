export const DEFAULT_FREE_MINUTES = 120;

export type DetentionInput = {
  arrivedAt: Date;
  departedAt: Date;
  /** Minutes the dock may hold the truck before detention starts. */
  freeMinutes?: number;
  /** Rate per hour in cents. Integer cents avoid floating point money. */
  rateCentsPerHour: number;
};

export type DetentionResult = {
  totalMinutes: number;
  freeMinutes: number;
  billableMinutes: number;
  amountCents: number;
};

const MS_PER_MINUTE = 60_000;

/**
 * How much a dock owes for keeping a truck waiting.
 *
 * Time on site is counted in whole minutes (partial minutes round down).
 * Minutes past the free window are billed pro rata at the hourly rate,
 * and the amount is rounded to the nearest cent.
 */
export function calculateDetention(input: DetentionInput): DetentionResult {
  const freeMinutes = input.freeMinutes ?? DEFAULT_FREE_MINUTES;

  if (Number.isNaN(input.arrivedAt.getTime())) {
    throw new RangeError("arrivedAt is not a valid date");
  }
  if (Number.isNaN(input.departedAt.getTime())) {
    throw new RangeError("departedAt is not a valid date");
  }
  if (input.departedAt.getTime() < input.arrivedAt.getTime()) {
    throw new RangeError("departedAt must not be before arrivedAt");
  }
  if (!Number.isInteger(freeMinutes) || freeMinutes < 0) {
    throw new RangeError("freeMinutes must be a non-negative integer");
  }
  if (!Number.isInteger(input.rateCentsPerHour) || input.rateCentsPerHour < 0) {
    throw new RangeError("rateCentsPerHour must be a non-negative integer");
  }

  const totalMinutes = Math.floor(
    (input.departedAt.getTime() - input.arrivedAt.getTime()) / MS_PER_MINUTE,
  );
  const billableMinutes = Math.max(0, totalMinutes - freeMinutes);
  const amountCents = Math.round(
    (billableMinutes * input.rateCentsPerHour) / 60,
  );

  return { totalMinutes, freeMinutes, billableMinutes, amountCents };
}
