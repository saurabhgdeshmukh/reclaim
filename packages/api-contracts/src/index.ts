import { z } from "zod";

export const healthResponseSchema = z.object({
  ok: z.literal(true),
  service: z.literal("reclaim-api"),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;

export const helloResponseSchema = z.object({
  message: z.literal("reclaim"),
});

export type HelloResponse = z.infer<typeof helloResponseSchema>;

export const demoSignInSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export type DemoSignIn = z.infer<typeof demoSignInSchema>;
