// lib/schemas/match.ts
import { z } from "zod";

// Database entity schema (includes all fields)
export const matchEntitySchema = z.object({
  id: z.string().uuid(),
  league_id: z.string().uuid(),
  home_team_id: z.string().uuid(),
  away_team_id: z.string().uuid(),
  date: z.string(),
  status: z.enum([
    "scheduled",
    "live",
    "completed",
    "postponed",
    "cancelled",
    "half_time",
    "extra_time",
    "penalties",
  ]),
  score_home: z.number().default(0),
  score_away: z.number().default(0),
  score_detail: z.record(z.string(), z.any()).default({}),
  minute: z.number().default(0),
  venue_id: z.string().uuid().nullable(),
  attendance: z.number().nullable(),
  referee: z.string().nullable(),
  match_day: z.number().nullable(),
  season: z.string().nullable(),
  is_featured: z.boolean().default(false),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  created_by: z.string().uuid().nullable(),
});

// API input schema for creating matches
export const createMatchInputSchema = z
  .object({
    league_id: z.string().uuid("League is required"),
    home_team_id: z.string().uuid("Home team is required"),
    away_team_id: z.string().uuid("Away team is required"),
    date: z
      .string()
      .refine((val) => !val || !isNaN(Date.parse(val)), {
        message: "Valid date is required",
      })
      .optional(),
    status: z
      .enum([
        "scheduled",
        "live",
        "completed",
        "postponed",
        "cancelled",
        "half_time",
        "extra_time",
        "penalties",
      ])
      .default("scheduled"),
    score_home: z.number().default(0),
    score_away: z.number().default(0),
    score_detail: z.record(z.string(), z.any()).optional(),
    minute: z.number().default(0),
    venue_id: z.string().uuid().optional(),
    attendance: z.number().optional(),
    referee: z.string().optional(),
    match_day: z.number().optional(),
    season: z.string().optional(),
    is_featured: z.boolean().default(false),
  })
  .refine((data) => data.home_team_id !== data.away_team_id, {
    message: "Home and away teams must be different",
    path: ["away_team_id"],
  });

// API input schema for updating matches
export const updateMatchInputSchema = createMatchInputSchema.partial();

// Schema for matches with joined relations
export const matchWithRelationsSchema = matchEntitySchema.extend({
  home_team: z
    .object({
      id: z.string().uuid(),
      name_en: z.string(),
      name_am: z.string(),
      slug: z.string(),
      logo_url: z.string().nullable(),
    })
    .nullable(),
  away_team: z
    .object({
      id: z.string().uuid(),
      name_en: z.string(),
      name_am: z.string(),
      slug: z.string(),
      logo_url: z.string().nullable(),
    })
    .nullable(),
  league: z
    .object({
      id: z.string().uuid(),
      name_en: z.string(),
      name_am: z.string(),
      slug: z.string(),
      category: z.string(),
    })
    .nullable(),
  venue: z
    .object({
      id: z.string().uuid(),
      name_en: z.string(),
      name_am: z.string(),
      city: z.string(),
      capacity: z.number().nullable(),
    })
    .nullable(),
});

// Type exports
export type MatchEntity = z.infer<typeof matchEntitySchema>;
export type CreateMatchInput = z.infer<typeof createMatchInputSchema>;
export type UpdateMatchInput = z.infer<typeof updateMatchInputSchema>;
export type MatchWithRelations = z.infer<typeof matchWithRelationsSchema>;

// For backward compatibility
export type Match = MatchWithRelations;
export type CreateMatch = CreateMatchInput;
export type UpdateMatch = UpdateMatchInput;
