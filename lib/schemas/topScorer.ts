import { z } from "zod";

// Database entity schema (includes all fields)
export const topScorerEntitySchema = z.object({
  id: z.string().uuid(),
  league_id: z.string().uuid(),
  player_id: z.string().uuid(),
  team_id: z.string().uuid(),
  season: z.string(),
  goals: z.number(),
  assists: z.number(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  created_by: z.string().uuid().nullable(),
});

// API input schema for creating top scorers
export const createTopScorerInputSchema = z.object({
  league_id: z.string().uuid("League is required"),
  player_id: z.string().uuid("Player is required"),
  team_id: z.string().uuid("Team is required"),
  season: z.string().min(1, "Season is required"),
  goals: z.number().default(0),
  assists: z.number().default(0),
});

// API input schema for updating top scorers
export const updateTopScorerInputSchema = createTopScorerInputSchema.partial();

// Schema for top scorers with joined relations
export const topScorerWithRelationsSchema = topScorerEntitySchema.extend({
  player: z
    .object({
      id: z.string().uuid(),
      name_en: z.string(),
      name_am: z.string(),
      slug: z.string(),
      jersey_number: z.number().nullable(),
      photo_url: z.string().nullable(),
    })
    .optional(),
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
export type TopScorerEntity = z.infer<typeof topScorerEntitySchema>;
export type CreateTopScorerInput = z.infer<typeof createTopScorerInputSchema>;
export type UpdateTopScorerInput = z.infer<typeof updateTopScorerInputSchema>;
export type TopScorerResponse = z.infer<typeof topScorerWithRelationsSchema>;

// For backward compatibility
export type TopScorer = TopScorerResponse;
export type CreateTopScorer = CreateTopScorerInput;
export type UpdateTopScorer = UpdateTopScorerInput;