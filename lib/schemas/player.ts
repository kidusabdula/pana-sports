import { z } from "zod";

// Database entity schema (includes all fields)
export const playerEntitySchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  name_en: z.string(),
  name_am: z.string(),
  team_slug: z.string().nullable(),
  position_en: z.string().nullable(),
  position_am: z.string().nullable(),
  jersey_number: z.number().int().nullable(),
  dob: z.string().datetime().nullable(),
  bio_en: z.string().nullable(),
  bio_am: z.string().nullable(),
  photo_url: z.string().url().nullable(),
  stats: z.record(z.string(), z.any()).nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  created_by: z.string().uuid().nullable(),
});

// API input schema for creating a player (excludes fields that should be set by backend)
export const createPlayerInputSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(50, "Slug must be less than 50 characters"),
  name_en: z
    .string()
    .min(1, "English name is required")
    .max(100, "Name must be less than 100 characters"),
  name_am: z
    .string()
    .min(1, "Amharic name is required")
    .max(100, "Name must be less than 100 characters"),
  team_slug: z.string().min(1, "Team is required").optional(),
  position_en: z
    .string()
    .max(50, "Position must be less than 50 characters")
    .optional(),
  position_am: z
    .string()
    .max(50, "Position must be less than 50 characters")
    .optional(),
  jersey_number: z
    .number()
    .int()
    .min(1, "Jersey number must be at least 1")
    .max(99, "Jersey number must be less than 100")
    .optional(),
  dob: z.string().datetime().optional(),
  bio_en: z
    .string()
    .max(1000, "Bio must be less than 1000 characters")
    .optional(),
  bio_am: z
    .string()
    .max(1000, "Bio must be less than 1000 characters")
    .optional(),
  photo_url: z.string().url("Invalid URL").optional().nullable(),
  stats: z.record(z.string(), z.any()).optional(),
});

// API input schema for updating a player (all fields optional)
export const updatePlayerInputSchema = createPlayerInputSchema.partial();

// API response schema (what to API returns)
export const playerResponseSchema = playerEntitySchema;

// Type exports
export type PlayerEntity = z.infer<typeof playerEntitySchema>;
export type CreatePlayerInput = z.infer<typeof createPlayerInputSchema>;
export type UpdatePlayerInput = z.infer<typeof updatePlayerInputSchema>;
export type PlayerResponse = z.infer<typeof playerResponseSchema>;

// For backward compatibility
export type Player = PlayerResponse;
export type CreatePlayer = CreatePlayerInput;
export type UpdatePlayer = UpdatePlayerInput;
