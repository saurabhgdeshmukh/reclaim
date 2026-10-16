import {
  type HealthResponse,
  healthResponseSchema,
} from "@reclaim/api-contracts";

export async function fetchHealth(): Promise<HealthResponse> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  const response = await fetch(`${base}/health`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`API health failed: ${response.status}`);
  }
  return healthResponseSchema.parse(await response.json());
}
