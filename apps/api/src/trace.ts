import type { FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    traceId: string;
  }
}

export function readTraceId(request: FastifyRequest): string {
  const incoming = request.headers["x-trace-id"];
  return typeof incoming === "string" ? incoming : "";
}
