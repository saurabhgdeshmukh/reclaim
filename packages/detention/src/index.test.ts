import { describe, expect, it } from "vitest";
import { calculateDetention, DEFAULT_FREE_MINUTES } from "./index";

const arrivedAt = new Date("2026-10-15T08:00:00Z");
const at = (minutes: number) =>
  new Date(arrivedAt.getTime() + minutes * 60_000);

describe("calculateDetention", () => {
  it("charges nothing inside the free window", () => {
    const result = calculateDetention({
      arrivedAt,
      departedAt: at(90),
      rateCentsPerHour: 7500,
    });

    expect(result).toEqual({
      totalMinutes: 90,
      freeMinutes: DEFAULT_FREE_MINUTES,
      billableMinutes: 0,
      amountCents: 0,
    });
  });

  it("charges nothing at exactly the free window", () => {
    const result = calculateDetention({
      arrivedAt,
      departedAt: at(120),
      rateCentsPerHour: 7500,
    });

    expect(result.billableMinutes).toBe(0);
    expect(result.amountCents).toBe(0);
  });

  it("bills time past the free window by the minute", () => {
    const result = calculateDetention({
      arrivedAt,
      departedAt: at(240),
      rateCentsPerHour: 7500,
    });

    expect(result.billableMinutes).toBe(120);
    expect(result.amountCents).toBe(15000);
  });

  it("honours a custom free window", () => {
    const result = calculateDetention({
      arrivedAt,
      departedAt: at(100),
      freeMinutes: 30,
      rateCentsPerHour: 6000,
    });

    expect(result.billableMinutes).toBe(70);
    expect(result.amountCents).toBe(7000);
  });

  it("rounds the amount to the nearest cent", () => {
    // 1 billable minute at 100 cents/hour is 1.666... cents.
    const result = calculateDetention({
      arrivedAt,
      departedAt: at(121),
      rateCentsPerHour: 100,
    });

    expect(result.amountCents).toBe(2);
  });

  it("drops partial minutes", () => {
    const result = calculateDetention({
      arrivedAt,
      departedAt: new Date(at(150).getTime() + 59_000),
      rateCentsPerHour: 6000,
    });

    expect(result.totalMinutes).toBe(150);
    expect(result.billableMinutes).toBe(30);
  });

  it("rejects a departure before the arrival", () => {
    expect(() =>
      calculateDetention({
        arrivedAt,
        departedAt: at(-1),
        rateCentsPerHour: 7500,
      }),
    ).toThrow("departedAt must not be before arrivedAt");
  });

  it("rejects invalid dates", () => {
    expect(() =>
      calculateDetention({
        arrivedAt: new Date("nope"),
        departedAt: at(10),
        rateCentsPerHour: 7500,
      }),
    ).toThrow("arrivedAt is not a valid date");
  });

  it("rejects a negative or fractional rate and free window", () => {
    expect(() =>
      calculateDetention({
        arrivedAt,
        departedAt: at(10),
        rateCentsPerHour: -1,
      }),
    ).toThrow("rateCentsPerHour");
    expect(() =>
      calculateDetention({
        arrivedAt,
        departedAt: at(10),
        freeMinutes: 1.5,
        rateCentsPerHour: 100,
      }),
    ).toThrow("freeMinutes");
  });
});
