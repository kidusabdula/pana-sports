// lib/schemas/news.ts
import { z } from "zod";

// Database entity schema (includes all fields)
export const newsEntitySchema = z.object({
  id: z.string().uuid(),
  title_en: z.string(),
  title_am: z.string(),
  slug: z.string(),
  content_en: z.string().nullable(),
  content_am: z.string().nullable(),
  excerpt_en: z.string().nullable(),
  excerpt_am: z.string().nullable(),
  thumbnail_url: z.string().nullable(),
  category_id: z.string().uuid().nullable(),
  author_id: z.string().uuid().nullable(),
  league_id: z.string().uuid().nullable(),
  // match_id: z.string().uuid().nullable(),
  tags: z.array(z.string()).default([]),
  views: z.number().default(0),
  likes: z.number().default(0),
  comments_count: z.number().default(0),
  is_featured: z.boolean().default(false),
  is_published: z.boolean().default(false),
  published_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  created_by: z.string().uuid().nullable(),
});

// API input schema for creating news
export const createNewsInputSchema = z.object({
  title_en: z.string().min(1, "English title is required"),
  title_am: z.string().min(1, "Amharic title is required"),
  slug: z.string().optional(), // Optional - will be auto-generated from title_en if not provided
  content_en: z.string().nullable(),
  content_am: z.string().nullable(),
  excerpt_en: z.string().nullable(),
  excerpt_am: z.string().nullable(),
  thumbnail_url: z.string().nullable(),
  category_id: z.string().uuid().nullable(),
  author_id: z.string().uuid().nullable(),
  league_id: z.string().uuid().nullable(),
  // match_id: z.string().uuid().nullable(),
  tags: z.array(z.string()).default([]),
  is_featured: z.boolean().default(false),
  is_published: z.boolean().default(false),
  published_at: z.string().datetime().nullable(),
});

// API input schema for updating news
export const updateNewsInputSchema = createNewsInputSchema.partial();

// Schema for news with joined relations
export const newsWithRelationsSchema = newsEntitySchema.extend({
  category: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
      name_en: z.string(),
      name_am: z.string(),
      slug: z.string(),
      color: z.string().nullable(),
      icon: z.string().nullable(),
    })
    .nullable()
    .optional(),
  author: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
      email: z.string().nullable(),
      avatar_url: z.string().nullable(),
    })
    .nullable()
    .optional(),
  league: z
    .object({
      id: z.string().uuid(),
      name_en: z.string(),
      name_am: z.string(),
      slug: z.string(),
      category: z.string(),
    })
    .nullable()
    .optional(),
  match: z
    .object({
      id: z.string().uuid(),
      home_team_id: z.string().uuid(),
      away_team_id: z.string().uuid(),
      date: z.string().datetime(),
      status: z.string(),
      score_home: z.number(),
      score_away: z.number(),
    })
    .nullable()
    .optional(),
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
