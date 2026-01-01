import { z } from "zod";

// Create schema
export const seasonCreateSchema = z.object({
  name: z.string().min(1, "Season name is required"),
  slug: z.string().min(1, "Slug is required"),
  start_date: z.string(),
  end_date: z.string(),
  is_current: z.boolean().optional().default(false),
  is_archived: z.boolean().optional().default(false),
  description_en: z.string().optional(),
  description_am: z.string().optional(),
});

// Update schema
export const seasonUpdateSchema = seasonCreateSchema.partial();

// Types
export type SeasonCreate = z.infer<typeof seasonCreateSchema>;
export type SeasonUpdate = z.infer<typeof seasonUpdateSchema>;

export interface Season {
  id: string;
  name: string;
  slug: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  is_archived: boolean;
  description_en?: string | null;
  description_am?: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
}
