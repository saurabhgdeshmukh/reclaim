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

export const detentionRequestSchema = z.object({
  arrivedAt: z.iso.datetime({ offset: true }),
  departedAt: z.iso.datetime({ offset: true }),
  freeMinutes: z.number().int().min(0).optional(),
  rateCentsPerHour: z.number().int().min(0),
});

export type DetentionRequest = z.infer<typeof detentionRequestSchema>;

export const detentionResponseSchema = z.object({
  totalMinutes: z.number().int().min(0),
  freeMinutes: z.number().int().min(0),
  billableMinutes: z.number().int().min(0),
  amountCents: z.number().int().min(0),
});

export type DetentionResponse = z.infer<typeof detentionResponseSchema>;
