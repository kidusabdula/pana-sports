import { z } from "zod";

export const cupCreateSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens"),
  name_en: z.string().min(1),
  name_am: z.string().min(1),
  description_en: z.string().optional().nullable(),
  description_am: z.string().optional().nullable(),
  logo_url: z.string().url().optional().nullable().or(z.literal("")),
  cup_type: z
    .enum(["knockout", "group_knockout", "league_cup"])
    .default("knockout"),
  country: z.string().default("Ethiopia"),
  founded_year: z.number().optional().nullable(),
  current_holder_team_id: z.string().uuid().optional().nullable(),
  is_active: z.boolean().default(true),
});

export const cupUpdateSchema = cupCreateSchema.partial();

export const cupEditionCreateSchema = z.object({
  cup_id: z.string().uuid(),
  season_id: z.string().uuid(),
  name: z.string().min(1),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  status: z
    .enum(["upcoming", "ongoing", "completed", "cancelled"])
    .default("upcoming"),
  winner_team_id: z.string().uuid().optional().nullable(),
  runner_up_team_id: z.string().uuid().optional().nullable(),
  total_teams: z.number().default(0),
  has_group_stage: z.boolean().default(false),
  groups_count: z.number().default(0),
});

export const cupEditionUpdateSchema = cupEditionCreateSchema.partial();

export const cupGroupCreateSchema = z.object({
  cup_edition_id: z.string().uuid(),
  name: z.string().min(1), // e.g., "Group A"
});

export const cupGroupTeamCreateSchema = z.object({
  cup_group_id: z.string().uuid(),
  team_id: z.string().uuid(),
});

export type CupCreate = z.infer<typeof cupCreateSchema>;
export type CupUpdate = z.infer<typeof cupUpdateSchema>;
export type CupEditionCreate = z.infer<typeof cupEditionCreateSchema>;
export type CupEditionUpdate = z.infer<typeof cupEditionUpdateSchema>;
export type CupGroupCreate = z.infer<typeof cupGroupCreateSchema>;
export type CupGroupTeamCreate = z.infer<typeof cupGroupTeamCreateSchema>;
