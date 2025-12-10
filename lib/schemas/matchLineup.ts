// lib/schemas/matchLineup.ts
import { z } from "zod";

// Database entity schema (includes all fields)
export const matchLineupEntitySchema = z.object({
  id: z.string().uuid(),
  match_id: z.string().uuid(),
  team_id: z.string().uuid(),
  player_id: z.string().uuid(),
  is_starting: z.boolean().default(true),
  position: z.string().nullable(),
  jersey_number: z.number().nullable(),
  captain: z.boolean().default(false),
  // Injury tracking
  is_injured: z.boolean().default(false),
  injury_type: z.string().nullable(),
  injury_return_date: z.string().nullable(),
  injury_status: z.string().nullable(), // 'injured', 'doubtful', 'suspended'
  // Position coordinates for formation visualization
  position_x: z.number().nullable(), // 0-100 percentage from left
  position_y: z.number().nullable(), // 0-100 percentage from top
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// API input schema for creating match lineups
export const createMatchLineupInputSchema = z.object({
  match_id: z.string().uuid(),
  team_id: z.string().uuid(),
  player_id: z.string().uuid(),
  is_starting: z.boolean().default(true),
  position: z.string().optional(),
  jersey_number: z.number().optional(),
  captain: z.boolean().default(false),
  // Injury tracking
  is_injured: z.boolean().default(false).optional(),
  injury_type: z.string().optional(),
  injury_return_date: z.string().optional(),
  injury_status: z.string().optional(),
  // Position coordinates
  position_x: z.number().optional(),
  position_y: z.number().optional(),
});

// API input schema for updating match lineups
export const updateMatchLineupInputSchema =
  createMatchLineupInputSchema.partial();

// Schema for match lineups with joined relations
export const matchLineupWithRelationsSchema = matchLineupEntitySchema.extend({
  player: z
    .object({
      id: z.string().uuid(),
      name_en: z.string(),
      name_am: z.string(),
      slug: z.string(),
      jersey_number: z.number().nullable(),
      position_en: z.string().nullable(),
      position_am: z.string().nullable(),
      photo_url: z.string().nullable(),
    })
    .nullable(),
  team: z
    .object({
      id: z.string().uuid(),
      name_en: z.string(),
      name_am: z.string(),
      slug: z.string(),
      logo_url: z.string().nullable(),
    })
    .nullable(),
});

// Type exports
export type MatchLineupEntity = z.infer<typeof matchLineupEntitySchema>;
export type CreateMatchLineupInput = z.infer<
  typeof createMatchLineupInputSchema
>;
export type UpdateMatchLineupInput = z.infer<
  typeof updateMatchLineupInputSchema
>;
export type MatchLineupWithRelations = z.infer<
  typeof matchLineupWithRelationsSchema
>;

// For backward compatibility
export type MatchLineup = MatchLineupWithRelations;
export type CreateMatchLineup = CreateMatchLineupInput;
export type UpdateMatchLineup = UpdateMatchLineupInput;
