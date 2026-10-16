import cors from "@fastify/cors";
import {
  detentionRequestSchema,
  detentionResponseSchema,
  healthResponseSchema,
  helloResponseSchema,
} from "@reclaim/api-contracts";
import { calculateDetention } from "@reclaim/detention";
import { createLogger, createTraceId } from "@reclaim/logging";
import Fastify from "fastify";
import { readTraceId } from "./trace";

const log = createLogger("api");

export async function buildServer() {
  const app = Fastify({ logger: false });

  await app.register(cors, {
    origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  });

  app.addHook("onRequest", async (request, reply) => {
    const incoming = readTraceId(request);
    request.traceId = incoming.length > 0 ? incoming : createTraceId();
    reply.header("x-trace-id", request.traceId);
  });

  app.get("/health", async (request) => {
    log.info("health", { traceId: request.traceId });
    return healthResponseSchema.parse({
      ok: true,
      service: "reclaim-api",
    });
  });

  app.get("/v1/hello", async (request) => {
    log.info("hello", { traceId: request.traceId });
    return helloResponseSchema.parse({ message: "reclaim" });
  });

  app.post("/v1/detention/calculate", async (request, reply) => {
    const parsed = detentionRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply
        .code(400)
        .send({ error: "invalid_request", issues: parsed.error.issues });
    }

    const { arrivedAt, departedAt, freeMinutes, rateCentsPerHour } =
      parsed.data;
    try {
      const result = calculateDetention({
        arrivedAt: new Date(arrivedAt),
        departedAt: new Date(departedAt),
        freeMinutes,
        rateCentsPerHour,
      });
      log.info("detention", {
        traceId: request.traceId,
        billableMinutes: result.billableMinutes,
      });
      return detentionResponseSchema.parse(result);
    } catch (error) {
      if (error instanceof RangeError) {
        return reply
          .code(400)
          .send({ error: "invalid_request", message: error.message });
      }
      throw error;
    }
  });

  return app;
}
