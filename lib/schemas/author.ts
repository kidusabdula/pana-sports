import { z } from "zod";

// Database entity schema (includes all fields)
export const authorEntitySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  bio_en: z.string().nullable(),
  bio_am: z.string().nullable(),
  avatar_url: z.string().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  created_by: z.string().uuid().nullable(),
});

// API input schema for creating an author
export const createAuthorInputSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  bio_en: z.string().max(500, "Bio must be less than 500 characters").optional().nullable(),
  bio_am: z.string().max(500, "Bio must be less than 500 characters").optional().nullable(),
  avatar_url: z.string().url("Invalid URL").optional().nullable(),
});

// API input schema for updating an author
export const updateAuthorInputSchema = createAuthorInputSchema.partial();

// Type exports
export type AuthorEntity = z.infer<typeof authorEntitySchema>;
export type CreateAuthorInput = z.infer<typeof createAuthorInputSchema>;
export type UpdateAuthorInput = z.infer<typeof updateAuthorInputSchema>;

// For backward compatibility
export type Author = AuthorEntity;
export type CreateAuthor = CreateAuthorInput;
export type UpdateAuthor = UpdateAuthorInput;
