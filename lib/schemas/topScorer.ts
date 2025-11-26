import { z } from 'zod'

// Database entity schema (includes all fields)
export const topScorerEntitySchema = z.object({
  id: z.string().uuid(),
  league_slug: z.string(),
  player_slug: z.string(),
  team_slug: z.string(),
  goals: z.number().int(),
  assists: z.number().int().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  created_by: z.string().uuid().nullable(),
})

// API input schema for creating a top scorer (excludes fields that should be set by backend)
export const createTopScorerInputSchema = z.object({
  league_slug: z.string().min(1, 'League is required'),
  player_slug: z.string().min(1, 'Player is required'),
  team_slug: z.string().min(1, 'Team is required'),
  goals: z.number().int().min(0, 'Goals must be at least 0').max(200, 'Goals cannot exceed 200'),
  assists: z.number().int().min(0, 'Assists cannot be negative').max(100, 'Assists cannot exceed 100').optional(),
})

// API input schema for updating a top scorer (all fields optional)
export const updateTopScorerInputSchema = createTopScorerInputSchema.partial()

// API response schema (what the API returns)
export const topScorerResponseSchema = topScorerEntitySchema

// Type exports
export type TopScorerEntity = z.infer<typeof topScorerEntitySchema>
export type CreateTopScorerInput = z.infer<typeof createTopScorerInputSchema>
export type UpdateTopScorerInput = z.infer<typeof updateTopScorerInputSchema>
export type TopScorerResponse = z.infer<typeof topScorerResponseSchema>

// For backward compatibility
export type TopScorer = TopScorerResponse
export type CreateTopScorer = CreateTopScorerInput
export type UpdateTopScorer = UpdateTopScorerInput