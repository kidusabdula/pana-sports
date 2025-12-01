import { z } from "zod";

// Database entity schema (includes all fields)
export const leagueEntitySchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  name_en: z.string(),
  name_am: z.string(),
  category: z.string(),
  logo_url: z.string().nullable(),
  logo_file: z.instanceof(File).optional(), // Add this for file upload
  description_en: z.string().nullable(),
  description_am: z.string().nullable(),
  founded_year: z.number().nullable(),
  country: z.string(),
  website_url: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  created_by: z.string().uuid().nullable(),
});

// API input schema for creating leagues
export const createLeagueInputSchema = z.object({
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
  category: z.string().min(1, "Category is required"),
  logo_url: z
    .string()
    .url("Invalid URL")
    .or(z.literal(""))
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  description_en: z.string().optional(),
  description_am: z.string().optional(),
  founded_year: z.number().optional(),
  website_url: z
    .string()
    .url("Invalid URL")
    .or(z.literal(""))
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  is_active: z.boolean().optional(),
});

// API input schema for updating leagues
export const updateLeagueInputSchema = createLeagueInputSchema.partial();

// Schema for leagues with joined relations
export const leagueWithRelationsSchema = leagueEntitySchema.extend({
  teams: z
    .array(
      z.object({
        id: z.string().uuid(),
        slug: z.string(),
        name_en: z.string(),
        name_am: z.string(),
        logo_url: z.string().nullable(),
      })
    )
    .optional(),
});

// Type exports
export type LeagueEntity = z.infer<typeof leagueEntitySchema>;
export type CreateLeagueInput = z.infer<typeof createLeagueInputSchema>;
export type UpdateLeagueInput = z.infer<typeof updateLeagueInputSchema>;
export type LeagueResponse = z.infer<typeof leagueWithRelationsSchema>;

// For backward compatibility
export type League = LeagueResponse;
export type CreateLeague = CreateLeagueInput;
export type UpdateLeague = UpdateLeagueInput;
