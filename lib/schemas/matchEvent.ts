import { z } from 'zod'

// Database entity schema (includes all fields)
export const matchEventEntitySchema = z.object({
  id: z.string().uuid(),
  match_id: z.string().uuid(),
  minute: z.number().int(),
  type: z.enum(['goal', 'yellow', 'red', 'sub', 'assist', 'own_goal', 'penalty']),
  player_slug: z.string().nullable(),
  team_slug: z.string().nullable(),
  description_en: z.string().nullable(),
  description_am: z.string().nullable(),
  created_at: z.string().datetime(),
})

// API input schema for creating a match event
export const createMatchEventInputSchema = z.object({
  match_id: z.string().uuid('Match ID is required'),
  minute: z.number().int('Minute is required').min(0, 'Minute cannot be negative').max(120, 'Minute cannot exceed 120'),
  type: z.enum(['goal', 'yellow', 'red', 'sub', 'assist', 'own_goal', 'penalty'], 'Event type is required'),
  player_slug: z.string().optional(),
  team_slug: z.string().optional(),
  description_en: z.string().max(200, 'Description must be less than 200 characters').optional(),
  description_am: z.string().max(200, 'Description must be less than 200 characters').optional(),
})

// API input schema for updating a match event (all fields optional)
export const updateMatchEventInputSchema = createMatchEventInputSchema.partial()

// API response schema (what the API returns)
export const matchEventResponseSchema = matchEventEntitySchema

// Type exports
export type MatchEventEntity = z.infer<typeof matchEventEntitySchema>
export type CreateMatchEventInput = z.infer<typeof createMatchEventInputSchema>
export type UpdateMatchEventInput = z.infer<typeof updateMatchEventInputSchema>
export type MatchEventResponse = z.infer<typeof matchEventResponseSchema>

// For backward compatibility
export type MatchEvent = MatchEventResponse
export type CreateMatchEvent = CreateMatchEventInput
export type UpdateMatchEvent = UpdateMatchEventInput