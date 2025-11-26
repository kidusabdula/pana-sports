import { z } from "zod";

export const matchStatusEnum = z.enum([
  "scheduled",
  "live",
  "finished",
  "postponed",
  "cancelled",
]);

// Database entity schema (includes all fields)
export const matchEntitySchema = z.object({
  id: z.string().uuid(),
  league_slug: z.string(),
  home_team_slug: z.string(),
  away_team_slug: z.string(),
  date: z.string().datetime(),
  status: matchStatusEnum,
  score_home: z.number().int().nullable(),
  score_away: z.number().int().nullable(),
  score_detail: z.record(z.string(), z.any()).nullable(),
  minute: z.number().int().nullable(),
  venue_en: z.string().nullable(),
  venue_am: z.string().nullable(),
  attendance: z.number().int().nullable(),
  referee: z.string().nullable(),
  meta: z.record(z.string(), z.any()).nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  created_by: z.string().uuid().nullable(),
});

// API input schema for creating a match
export const createMatchInputSchema = z.object({
  league_slug: z.string().min(1, "League is required"),
  home_team_slug: z.string().min(1, "Home team is required"),
  away_team_slug: z.string().min(1, "Away team is required"),
  date: z.string().datetime().or(z.date().transform((date) => date.toISOString())),
  status: matchStatusEnum.default("scheduled"),
  score_home: z.number().int().min(0).nullable().optional(),
  score_away: z.number().int().min(0).nullable().optional(),
  venue_en: z.string().max(100).nullable().optional(),
  venue_am: z.string().max(100).nullable().optional(),
  minute: z.number().int().min(0).nullable().optional(),
  referee: z.string().max(100).nullable().optional(),
  attendance: z.number().int().min(0).nullable().optional(),
  meta: z.record(z.string(), z.any()).nullable().optional(),
}).refine((data) => data.home_team_slug !== data.away_team_slug, {
  message: "Home and away teams must be different",
  path: ["away_team_slug"],
});

// API input schema for updating a match
export const updateMatchInputSchema = createMatchInputSchema.partial();

// Schema for match with joined relations
export const matchWithRelationsSchema = matchEntitySchema.extend({
  league: z.object({
    id: z.string(),
    name_en: z.string(),
    name_am: z.string(),
    slug: z.string(),
  }).optional(),
  home_team: z.object({
    id: z.string(),
    name_en: z.string(),
    name_am: z.string(),
    slug: z.string(),
    logo_url: z.string().nullable(),
  }).optional(),
  away_team: z.object({
    id: z.string(),
    name_en: z.string(),
    name_am: z.string(),
    slug: z.string(),
    logo_url: z.string().nullable(),
  }).optional(),
});

// Type exports
export type MatchEntity = z.infer<typeof matchEntitySchema>;
export type CreateMatchInput = z.infer<typeof createMatchInputSchema>;
export type UpdateMatchInput = z.infer<typeof updateMatchInputSchema>;
export type MatchResponse = z.infer<typeof matchWithRelationsSchema>;
export type MatchStatus = z.infer<typeof matchStatusEnum>;

// For backward compatibility
export type Match = MatchResponse;
export type CreateMatch = CreateMatchInput;
export type UpdateMatch = UpdateMatchInput;
