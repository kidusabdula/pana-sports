import { z } from "zod";

// Database entity schema (includes all fields)
export const playerEntitySchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  team_id: z.string().uuid(),
  name_en: z.string(),
  name_am: z.string(),
  position_en: z.string().nullable(),
  position_am: z.string().nullable(),
  jersey_number: z.number().nullable(),
  dob: z.string().datetime().nullable(),
  nationality: z.string().nullable(),
  height_cm: z.number().nullable(),
  weight_kg: z.number().nullable(),
  bio_en: z.string().nullable(),
  bio_am: z.string().nullable(),
  photo_url: z.string().nullable(),
  contract_until: z.string().datetime().nullable(),
  market_value: z.string().nullable(),
  is_active: z.boolean().default(true),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  created_by: z.string().uuid().nullable(),
});

// API input schema for creating players
export const createPlayerInputSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(50, "Slug must be less than 50 characters"),
  team_id: z.string().uuid("Team is required"),
  name_en: z
    .string()
    .min(1, "English name is required")
    .max(100, "Name must be less than 100 characters"),
  name_am: z
    .string()
    .min(1, "Amharic name is required")
    .max(100, "Name must be less than 100 characters"),
  position_en: z.string().optional(),
  position_am: z.string().optional(),
  jersey_number: z.number().optional(),
  dob: z.string().optional(),
  nationality: z.string().optional(),
  height_cm: z.number().optional(),
  weight_kg: z.number().optional(),
  bio_en: z.string().optional(),
  bio_am: z.string().optional(),
  photo_url: z.string().url("Invalid URL").optional(),
  contract_until: z.string().optional(),
  market_value: z.string().optional(),
  is_active: z.boolean().optional(),
});

// API input schema for updating players
export const updatePlayerInputSchema = createPlayerInputSchema.partial();

// Schema for players with joined relations
export const playerWithRelationsSchema = playerEntitySchema.extend({
  teams: z
    .object({
      id: z.string().uuid(),
      name_en: z.string(),
      name_am: z.string(),
      slug: z.string(),
      logo_url: z.string().nullable(),
    })
    .optional(),
});

// Type exports
export type PlayerEntity = z.infer<typeof playerEntitySchema>;
export type CreatePlayerInput = z.infer<typeof createPlayerInputSchema>;
export type UpdatePlayerInput = z.infer<typeof updatePlayerInputSchema>;
export type PlayerResponse = z.infer<typeof playerWithRelationsSchema>;

// For backward compatibility
export type Player = PlayerResponse;
export type CreatePlayer = CreatePlayerInput;
export type UpdatePlayer = UpdatePlayerInput;
