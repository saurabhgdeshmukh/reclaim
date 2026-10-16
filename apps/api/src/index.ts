import { createLogger } from "@reclaim/logging";
import { buildServer } from "./server";

const log = createLogger("api");
const port = Number(process.env.API_PORT ?? 4000);

const app = await buildServer();

try {
  await app.listen({ port, host: "0.0.0.0" });
  log.info("listening", { port });
} catch (error) {
  log.error("failed to start", {
    message: error instanceof Error ? error.message : "unknown error",
  });
  process.exit(1);
}
