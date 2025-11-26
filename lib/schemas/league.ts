import { z } from 'zod'

// Database entity schema (includes all fields)
export const createLeagueInputSchema = z.object({
  slug: z.string().min(1, 'Slug is required').max(50, 'Slug must be less than 50 characters'),
  name_en: z.string().min(1, 'English name is required').max(100, 'Name must be less than 100 characters'),
  name_am: z.string().min(1, 'Amharic name is required').max(100, 'Name must be less than 100 characters'),
  category: z.string().min(1, 'Category is required'), // Add this line
})

// Also update the entity schema
export const leagueEntitySchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  name_en: z.string(),
  name_am: z.string(),
  category: z.string(), // Add this line
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  created_by: z.string().uuid().nullable(),
})

// API input schema for updating a league (all fields optional)
export const updateLeagueInputSchema = createLeagueInputSchema.partial()

// API response schema (what the API returns)
export const leagueResponseSchema = leagueEntitySchema

// Type exports
export type LeagueEntity = z.infer<typeof leagueEntitySchema>
export type CreateLeagueInput = z.infer<typeof createLeagueInputSchema>
export type UpdateLeagueInput = z.infer<typeof updateLeagueInputSchema>
export type LeagueResponse = z.infer<typeof leagueResponseSchema>

// For backward compatibility
export type League = LeagueResponse
export type CreateLeague = CreateLeagueInput
export type UpdateLeague = UpdateLeagueInput