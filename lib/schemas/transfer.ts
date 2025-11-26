import { z } from "zod";

// Database entity schema (includes all fields)
export const transferEntitySchema = z.object({
  id: z.string().uuid(),
  player_slug: z.string(),
  from_team_slug: z.string().nullable(),
  to_team_slug: z.string(),
  date: z.string().date(),
  fee: z.string().nullable(),
  notes_en: z.string().nullable(),
  notes_am: z.string().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  created_by: z.string().uuid().nullable(),
});

// API input schema for creating a transfer
export const createTransferInputSchema = z.object({
  player_slug: z.string().min(1, "Player is required"),
  from_team_slug: z.string().optional().nullable(),
  to_team_slug: z.string().min(1, "Destination team is required"),
  date: z.string().date().or(z.date().transform((date) => date.toISOString().split('T')[0])),
  fee: z.string().max(50).optional().nullable(),
  notes_en: z.string().max(500).optional().nullable(),
  notes_am: z.string().max(500).optional().nullable(),
});

// API input schema for updating a transfer
export const updateTransferInputSchema = createTransferInputSchema.partial();

// Schema for transfer with joined relations
export const transferWithRelationsSchema = transferEntitySchema.extend({
  player: z.object({
    id: z.string(),
    name_en: z.string(),
    name_am: z.string(),
    slug: z.string(),
  }).optional().nullable(),
  from_team: z.object({
    id: z.string(),
    name_en: z.string(),
    name_am: z.string(),
    slug: z.string(),
    logo_url: z.string().nullable(),
  }).optional().nullable(),
  to_team: z.object({
    id: z.string(),
    name_en: z.string(),
    name_am: z.string(),
    slug: z.string(),
    logo_url: z.string().nullable(),
  }).optional().nullable(),
});

// Type exports
export type TransferEntity = z.infer<typeof transferEntitySchema>;
export type CreateTransferInput = z.infer<typeof createTransferInputSchema>;
export type UpdateTransferInput = z.infer<typeof updateTransferInputSchema>;
export type TransferResponse = z.infer<typeof transferWithRelationsSchema>;

// For backward compatibility
export type Transfer = TransferResponse;
export type CreateTransfer = CreateTransferInput;
export type UpdateTransfer = UpdateTransferInput;
