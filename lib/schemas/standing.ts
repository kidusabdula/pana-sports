import { z } from 'zod'

// Database entity schema (includes all fields)
export const standingEntitySchema = z.object({
  id: z.string().uuid(),
  league_slug: z.string(),
  team_slug: z.string(),
  played: z.number().int(),
  won: z.number().int(),
  drawn: z.number().int(),
  lost: z.number().int(),
  goals_for: z.number().int(),
  goals_against: z.number().int(),
  gd: z.number().int(),
  points: z.number().int(),
  rank: z.number().int(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  created_by: z.string().uuid().nullable(),
})

// API input schema for creating a standing (excludes fields that should be set by backend)
export const createStandingInputSchema = z.object({
  league_slug: z.string().min(1, 'League is required'),
  team_slug: z.string().min(1, 'Team is required'),
  played: z.number().int().min(0, 'Played matches cannot be negative').optional(),
  won: z.number().int().min(0, 'Won matches cannot be negative').optional(),
  drawn: z.number().int().min(0, 'Drawn matches cannot be negative').optional(),
  lost: z.number().int().min(0, 'Lost matches cannot be negative').optional(),
  goals_for: z.number().int().min(0, 'Goals for cannot be negative').optional(),
  goals_against: z.number().int().min(0, 'Goals against cannot be negative').optional(),
  gd: z.number().int().optional(),
  points: z.number().int().min(0, 'Points cannot be negative').optional(),
  rank: z.number().int().min(1, 'Rank must be at least 1').optional(),
})

// API input schema for updating a standing (all fields optional)
export const updateStandingInputSchema = createStandingInputSchema.partial()

// API response schema (what the API returns)
export const standingResponseSchema = standingEntitySchema

// Type exports
export type StandingEntity = z.infer<typeof standingEntitySchema>
export type CreateStandingInput = z.infer<typeof createStandingInputSchema>
export type UpdateStandingInput = z.infer<typeof updateStandingInputSchema>
export type StandingResponse = z.infer<typeof standingResponseSchema>

// For backward compatibility
export type Standing = StandingResponse
export type CreateStanding = CreateStandingInput
export type UpdateStanding = UpdateStandingInput