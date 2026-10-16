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

  it("calculates detention", async () => {
    const app = await buildServer();
    const response = await app.inject({
      method: "POST",
      url: "/v1/detention/calculate",
      payload: {
        arrivedAt: "2026-10-15T08:00:00Z",
        departedAt: "2026-10-15T12:00:00Z",
        rateCentsPerHour: 7500,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      totalMinutes: 240,
      freeMinutes: 120,
      billableMinutes: 120,
      amountCents: 15000,
    });
    await app.close();
  });

  it("rejects a malformed detention request", async () => {
    const app = await buildServer();
    const response = await app.inject({
      method: "POST",
      url: "/v1/detention/calculate",
      payload: { arrivedAt: "yesterday", rateCentsPerHour: -5 },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json().error).toBe("invalid_request");
    await app.close();
  });

  it("rejects a departure before the arrival", async () => {
    const app = await buildServer();
    const response = await app.inject({
      method: "POST",
      url: "/v1/detention/calculate",
      payload: {
        arrivedAt: "2026-10-15T12:00:00Z",
        departedAt: "2026-10-15T08:00:00Z",
        rateCentsPerHour: 7500,
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json().message).toBe(
      "departedAt must not be before arrivedAt",
    );
    await app.close();
  });
});
