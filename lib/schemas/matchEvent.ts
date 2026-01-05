// lib/schemas/matchEvent.ts
import { z } from "zod";

// All event types matching the database constraint
const eventTypes = [
  "goal",
  "yellow",
  "red",
  "sub",
  "assist",
  "own_goal",
  "penalty",
  "match_start",
  "match_end",
  "half_time",
  "second_half",
  "injury_time",
  "var_check",
  "var_goal",
  "var_no_goal",
  "corner",
  "free_kick",
  "offside",
  // New event types from schema update
  "penalty_goal",
  "penalty_miss",
  "second_yellow",
  "match_pause",
  "match_resume",
  "extra_time_start",
  "extra_time_end",
  "penalty_shootout_start",
  "penalty_shootout_end",
  "penalty_shootout_scored",
  "penalty_shootout_missed",
] as const;

// Database entity schema (includes all fields)
export const matchEventEntitySchema = z.object({
  id: z.string().uuid(),
  match_id: z.string().uuid(),
  player_id: z.string().uuid().nullable(),
  team_id: z.string().uuid().nullable(),
  minute: z.number(),
  type: z.enum(eventTypes),
  description_en: z.string().nullable(),
  description_am: z.string().nullable(),
  // New fields from schema update
  subbed_in_player_id: z.string().uuid().nullable(),
  subbed_out_player_id: z.string().uuid().nullable(),
  is_assist: z.boolean().default(false),
  confirmed: z.boolean().default(false),
  confirmed_by: z.string().uuid().nullable(),
  confirmed_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
});

// API input schema for creating match events
// Note: player_id and team_id are optional - events can be created without them
// and updated later with the proper player/team assignments
export const createMatchEventInputSchema = z.object({
  match_id: z.string().uuid(),
  player_id: z.string().uuid().nullable().optional(),
  team_id: z.string().uuid().nullable().optional(),
  minute: z.number(),
  type: z.enum(eventTypes),
  description_en: z.string().optional().nullable(),
  description_am: z.string().optional().nullable(),
  // Fields for substitution events
  subbed_in_player_id: z.string().uuid().nullable().optional(),
  subbed_out_player_id: z.string().uuid().nullable().optional(),
  is_assist: z.boolean().default(false),
  confirmed: z.boolean().default(false),
});

// API input schema for updating match events - all fields optional
export const updateMatchEventInputSchema = z.object({
  player_id: z.string().uuid().nullable().optional(),
  team_id: z.string().uuid().nullable().optional(),
  minute: z.number().optional(),
  type: z.enum(eventTypes).optional(),
  description_en: z.string().optional().nullable(),
  description_am: z.string().optional().nullable(),
  subbed_in_player_id: z.string().uuid().nullable().optional(),
  subbed_out_player_id: z.string().uuid().nullable().optional(),
  is_assist: z.boolean().optional(),
  confirmed: z.boolean().optional(),
});

// Schema for match events with joined relations
export const matchEventWithRelationsSchema = matchEventEntitySchema.extend({
  player: z
    .object({
      id: z.string().uuid(),
      name_en: z.string(),
      name_am: z.string(),
      slug: z.string(),
      jersey_number: z.number().nullable(),
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
  // New relations for substitution players
  subbed_in_player: z
    .object({
      id: z.string().uuid(),
      name_en: z.string(),
      name_am: z.string(),
      slug: z.string(),
      jersey_number: z.number().nullable(),
    })
    .nullable(),
  subbed_out_player: z
    .object({
      id: z.string().uuid(),
      name_en: z.string(),
      name_am: z.string(),
      slug: z.string(),
      jersey_number: z.number().nullable(),
    })
    .nullable(),
});

// Type exports
export type MatchEventEntity = z.infer<typeof matchEventEntitySchema>;
export type CreateMatchEventInput = z.infer<typeof createMatchEventInputSchema>;
export type UpdateMatchEventInput = z.infer<typeof updateMatchEventInputSchema>;
export type MatchEventWithRelations = z.infer<
  typeof matchEventWithRelationsSchema
>;

// For backward compatibility
export type MatchEvent = MatchEventWithRelations;
export type CreateMatchEvent = CreateMatchEventInput;
export type UpdateMatchEvent = UpdateMatchEventInput;
