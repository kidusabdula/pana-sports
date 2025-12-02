// lib/schemas/standing.ts
import { z } from "zod";

// Database entity schema (includes all fields)
export const standingEntitySchema = z.object({
  id: z.string().uuid(),
  league_id: z.string().uuid(),
  team_id: z.string().uuid(),
  season: z.string(),
  played: z.number(),
  won: z.number(),
  draw: z.number(),
  lost: z.number(),
  goals_for: z.number(),
  goals_against: z.number(),
  gd: z.number(), // Overall goal difference
  points: z.number(),
  rank: z.number(),
  home_played: z.number(),
  home_won: z.number(),
  home_draw: z.number(),
  home_lost: z.number(),
  home_goals_for: z.number(),
  home_goals_against: z.number(),
  home_gd: z.number(), // Add home goal difference
  away_played: z.number(),
  away_won: z.number(),
  away_draw: z.number(),
  away_lost: z.number(),
  away_goals_for: z.number(),
  away_goals_against: z.number(),
  away_gd: z.number(), // Add away goal difference
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  created_by: z.string().uuid().nullable(),
});

// Update the createStandingInputSchema to include the new fields
export const createStandingInputSchema = z.object({
  league_id: z.string().uuid("League is required"),
  team_id: z.string().uuid("Team is required"),
  season: z.string().min(1, "Season is required"),
  played: z.number().default(0),
  won: z.number().default(0),
  draw: z.number().default(0),
  lost: z.number().default(0),
  goals_for: z.number().default(0),
  goals_against: z.number().default(0),
  gd: z.number().default(0), // Add overall goal difference
  points: z.number().default(0),
  rank: z.number().default(0),
  home_played: z.number().default(0),
  home_won: z.number().default(0),
  home_draw: z.number().default(0),
  home_lost: z.number().default(0),
  home_goals_for: z.number().default(0),
  home_goals_against: z.number().default(0),
  home_gd: z.number().default(0), // Add home goal difference
  away_played: z.number().default(0),
  away_won: z.number().default(0),
  away_draw: z.number().default(0),
  away_lost: z.number().default(0),
  away_goals_for: z.number().default(0),
  away_goals_against: z.number().default(0),
  away_gd: z.number().default(0), // Add away goal difference
});
// API input schema for updating standings
export const updateStandingInputSchema = createStandingInputSchema.partial();

// Schema for standings with joined relations
export const standingWithRelationsSchema = standingEntitySchema.extend({
  team: z
    .object({
      id: z.string().uuid(),
      name_en: z.string(),
      name_am: z.string(),
      slug: z.string(),
      logo_url: z.string().nullable(),
    })
    .optional(),
  league: z
    .object({
      id: z.string().uuid(),
      name_en: z.string(),
      name_am: z.string(),
      slug: z.string(),
      category: z.string(),
    })
    .optional(),
});

// Type exports
export type StandingEntity = z.infer<typeof standingEntitySchema>;
export type CreateStandingInput = z.infer<typeof createStandingInputSchema>;
export type UpdateStandingInput = z.infer<typeof updateStandingInputSchema>;
export type StandingResponse = z.infer<typeof standingWithRelationsSchema>;

// For backward compatibility
export type Standing = StandingResponse;
export type CreateStanding = CreateStandingInput;
export type UpdateStanding = UpdateStandingInput;