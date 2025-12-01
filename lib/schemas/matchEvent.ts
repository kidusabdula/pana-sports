import { z } from "zod";

// Database entity schema (includes all fields)
export const matchEventEntitySchema = z.object({
  id: z.string().uuid(),
  match_id: z.string().uuid(),
  player_id: z.string().uuid().nullable(),
  team_id: z.string().uuid().nullable(),
  minute: z.number(),
  type: z.enum([
    'goal', 'yellow', 'red', 'sub', 'assist', 'own_goal', 'penalty',
    'match_start', 'match_end', 'half_time', 'second_half', 'injury_time',
    'var_check', 'var_goal', 'var_no_goal', 'corner', 'free_kick', 'offside'
  ]),
  description_en: z.string().nullable(),
  description_am: z.string().nullable(),
  additional_data: z.record(z.any()).optional(),
  is_assist: z.boolean().default(false),
  subbed_in_player_id: z.string().uuid().nullable(),
  subbed_out_player_id: z.string().uuid().nullable(),
  confirmed: z.boolean().default(false),
  confirmed_by: z.string().uuid().nullable(),
  confirmed_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
  // Fix: Remove created_by as it doesn't exist in the table
});

// API input schema for creating match events
export const createMatchEventInputSchema = z.object({
  match_id: z.string().uuid(),
  player_id: z.string().uuid().nullable(),
  team_id: z.string().uuid().nullable(),
  minute: z.number(),
  type: z.enum([
    'goal', 'yellow', 'red', 'sub', 'assist', 'own_goal', 'penalty',
    'match_start', 'match_end', 'half_time', 'second_half', 'injury_time',
    'var_check', 'var_goal', 'var_no_goal', 'corner', 'free_kick', 'offside'
  ]),
  description_en: z.string().optional(),
  description_am: z.string().optional(),
  additional_data: z.record(z.any()).optional(),
  is_assist: z.boolean().default(false),
  subbed_in_player_id: z.string().uuid().nullable().optional(),
  subbed_out_player_id: z.string().uuid().nullable().optional(),
  confirmed: z.boolean().default(false),
}).refine((data) => {
  // Fix: Only validate substitution players if the event type is 'sub'
  if (data.type === 'sub') {
    return !!(data.subbed_in_player_id && data.subbed_out_player_id);
  }
  // For non-substitution events, these fields can be null
  return true;
}, {
  message: "Substitution events must have both subbed in and subbed out players",
  path: ["subbed_in_player_id"],
}).refine((data) => {
  // Fix: Only validate player for goal-related events
  if (['goal', 'own_goal', 'penalty'].includes(data.type)) {
    return !!data.player_id;
  }
  return true;
}, {
  message: "Goal events must have a player",
  path: ["player_id"],
}).refine((data) => {
  // Fix: Only validate player for card events
  if (['yellow', 'red'].includes(data.type)) {
    return !!data.player_id;
  }
  return true;
}, {
  message: "Card events must have a player",
  path: ["player_id"],
});

// API input schema for updating match events
export const updateMatchEventInputSchema = createMatchEventInputSchema.partial();

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
export type MatchEventResponse = z.infer<typeof matchEventWithRelationsSchema>;

// For backward compatibility
export type MatchEvent = MatchEventResponse;
export type CreateMatchEvent = CreateMatchEventInput;
export type UpdateMatchEvent = UpdateMatchEventInput;