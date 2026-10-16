import { describe, expect, it } from "vitest";
import { createTraceId } from "./index";

describe("createTraceId", () => {
  it("returns a uuid", () => {
    expect(createTraceId()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
  });
});
