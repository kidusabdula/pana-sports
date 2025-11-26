import { z } from "zod";

// Database entity schema (includes all fields)
export const teamEntitySchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  name_en: z.string(),
  name_am: z.string(),
  short_name_en: z.string().nullable(),
  short_name_am: z.string().nullable(),
  logo_url: z.string().url().nullable(),
  description_en: z.string().nullable(),
  description_am: z.string().nullable(),
  stadium_en: z.string().nullable(),
  stadium_am: z.string().nullable(),
  founded: z.number().int().nullable(),
  league_slug: z.string().nullable(),
  meta: z.record(z.string(), z.any()).nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  created_by: z.string().uuid().nullable(),
});

// API input schema for creating a team (excludes fields that should be set by backend)
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
  short_name_en: z
    .string()
    .max(50, "Short name must be less than 50 characters")
    .optional(),
  short_name_am: z
    .string()
    .max(50, "Short name must be less than 50 characters")
    .optional(),
  logo_url: z.string().url("Invalid URL").optional().nullable(),
  description_en: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  description_am: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  stadium_en: z
    .string()
    .max(100, "Stadium name must be less than 100 characters")
    .optional(),
  stadium_am: z
    .string()
    .max(100, "Stadium name must be less than 100 characters")
    .optional(),
  founded: z
    .number()
    .int()
    .min(1800, "Founded year must be after 1800")
    .max(new Date().getFullYear(), "Founded year cannot be in the future")
    .optional(),
  league_slug: z.string().optional(),
  meta: z.record(z.string(), z.any()).optional(),
});

// API input schema for updating a team (all fields optional)
export const updateTeamInputSchema = createTeamInputSchema.partial();

// API response schema (what to API returns)
export const teamResponseSchema = teamEntitySchema;

// Type exports
export type TeamEntity = z.infer<typeof teamEntitySchema>;
export type CreateTeamInput = z.infer<typeof createTeamInputSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamInputSchema>;
export type TeamResponse = z.infer<typeof teamResponseSchema>;

// For backward compatibility
export type Team = TeamResponse;
export type CreateTeam = CreateTeamInput;
export type UpdateTeam = UpdateTeamInput;
