import { getTableName } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { memberships, organizations } from "./schema";

describe("phase 0 schema", () => {
  it("names the organization and membership tables", () => {
    expect(getTableName(organizations)).toBe("organizations");
    expect(getTableName(memberships)).toBe("memberships");
  });
});
