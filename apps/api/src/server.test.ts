import { describe, expect, it } from "vitest";
import { buildServer } from "./server";

describe("api", () => {
  it("answers health with the shared contract", async () => {
    const app = await buildServer();
    const response = await app.inject({ method: "GET", url: "/health" });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ ok: true, service: "reclaim-api" });
    expect(response.headers["x-trace-id"]).toEqual(expect.any(String));
    await app.close();
  });

  it("answers hello", async () => {
    const app = await buildServer();
    const response = await app.inject({ method: "GET", url: "/v1/hello" });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ message: "reclaim" });
    await app.close();
  });
});
