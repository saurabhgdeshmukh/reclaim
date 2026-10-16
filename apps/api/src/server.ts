import cors from "@fastify/cors";
import {
  healthResponseSchema,
  helloResponseSchema,
} from "@reclaim/api-contracts";
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

  return app;
}
