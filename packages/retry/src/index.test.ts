import { describe, expect, it } from "vitest";
import { withRetry } from "./index";

describe("withRetry", () => {
  it("returns the value when the task succeeds on a later attempt", async () => {
    let calls = 0;
    const value = await withRetry(
      async () => {
        calls += 1;
        if (calls < 3) {
          throw new Error("not yet");
        }
        return "paid";
      },
      { attempts: 3, sleep: async () => {} },
    );

    expect(value).toBe("paid");
    expect(calls).toBe(3);
  });

  it("throws the last error after the final attempt", async () => {
    await expect(
      withRetry(
        async () => {
          throw new Error("still owed");
        },
        { attempts: 2, sleep: async () => {} },
      ),
    ).rejects.toThrow("still owed");
  });
});
