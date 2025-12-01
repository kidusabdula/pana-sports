import { z } from "zod";

// Database entity schema (includes all fields)
export const teamEntitySchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  league_id: z.string().uuid(),
  name_en: z.string(),
  name_am: z.string(),
  short_name_en: z.string(),
  short_name_am: z.string(),
  logo_url: z.string().nullable(),
  description_en: z.string().nullable(),
  description_am: z.string().nullable(),
  stadium_en: z.string().nullable(),
  stadium_am: z.string().nullable(),
  founded: z.number().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  created_by: z.string().uuid().nullable(),
  is_active: z.boolean().default(true),
});

// API input schema for creating teams
export const createTeamInputSchema = z.object({
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
  short_name_en: z.string().optional(),
  short_name_am: z.string().optional(),
  league_id: z.string().uuid("League is required"),
  logo_url: z.string().url("Invalid URL").optional(),
  logo_file: z.instanceof(File).optional(), // Add this for file upload
  description_en: z.string().optional(),
  description_am: z.string().optional(),
  stadium_en: z.string().optional(),
  stadium_am: z.string().optional(),
  founded: z.number().optional(),
  is_active: z.boolean().optional(),
});

// API input schema for updating teams
export const updateTeamInputSchema = createTeamInputSchema.partial();

// Schema for teams with joined relations
export const teamWithRelationsSchema = teamEntitySchema.extend({
  league: z
    .object({
      id: z.string().uuid(),
      slug: z.string(),
      name_en: z.string(),
      name_am: z.string(),
      category: z.string(),
    })
    .optional(),
  players: z
    .array(
      z.object({
        id: z.string().uuid(),
        slug: z.string(),
        name_en: z.string(),
        name_am: z.string(),
        position_en: z.string(),
        position_am: z.string(),
        jersey_number: z.number(),
        dob: z.date(),
        nationality: z.string(),
        height_cm: z.number(),
        weight_kg: z.number(),
        bio_en: z.string(),
        bio_am: z.string(),
        photo_url: z.string().nullable(),
        contract_until: z.date(),
        market_value: z.string(),
        is_active: z.boolean(),
      })
    )
    .optional(),
});

// Type exports
export type TeamEntity = z.infer<typeof teamEntitySchema>;
export type CreateTeamInput = z.infer<typeof createTeamInputSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamInputSchema>;
export type TeamResponse = z.infer<typeof teamWithRelationsSchema>;

// For backward compatibility
export type Team = TeamResponse;
export type CreateTeam = CreateTeamInput;
export type UpdateTeam = UpdateTeamInput;
