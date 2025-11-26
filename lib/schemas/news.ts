import { z } from "zod";

// Database entity schema (includes all fields)
export const newsEntitySchema = z.object({
  id: z.string().uuid(),
  title_en: z.string(),
  title_am: z.string(),
  content_en: z.string().nullable(),
  content_am: z.string().nullable(),
  thumbnail_url: z.string().nullable(),
  category: z.string().nullable(),
  views: z.number().int(),
  comments_count: z.number().int(),
  published_at: z.string().datetime(),
  league_slug: z.string().nullable(),
  author_id: z.string().uuid().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  created_by: z.string().uuid().nullable(),
});

// API input schema for creating news
export const createNewsInputSchema = z.object({
  title_en: z.string().min(1, "English title is required").max(200, "Title must be less than 200 characters"),
  title_am: z.string().min(1, "Amharic title is required").max(200, "Title must be less than 200 characters"),
  content_en: z.string().optional().nullable(),
  content_am: z.string().optional().nullable(),
  thumbnail_url: z.string().url("Invalid URL").optional().nullable(),
  category: z.string().optional().nullable(),
  league_slug: z.string().optional().nullable(),
  author_id: z.string().uuid().optional().nullable(),
  published_at: z.string().datetime().or(z.date().transform((date) => date.toISOString())).optional(),
});

// API input schema for updating news
export const updateNewsInputSchema = createNewsInputSchema.partial();

// Schema for news with joined relations
export const newsWithRelationsSchema = newsEntitySchema.extend({
  league: z.object({
    id: z.string(),
    name_en: z.string(),
    name_am: z.string(),
    slug: z.string(),
  }).optional().nullable(),
  author: z.object({
    id: z.string(),
    name: z.string(),
    avatar_url: z.string().nullable(),
  }).optional().nullable(),
});

// Type exports
export type NewsEntity = z.infer<typeof newsEntitySchema>;
export type CreateNewsInput = z.infer<typeof createNewsInputSchema>;
export type UpdateNewsInput = z.infer<typeof updateNewsInputSchema>;
export type NewsResponse = z.infer<typeof newsWithRelationsSchema>;

// For backward compatibility
export type News = NewsResponse;
export type CreateNews = CreateNewsInput;
export type UpdateNews = UpdateNewsInput;
