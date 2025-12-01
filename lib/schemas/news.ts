// lib/schemas/news.ts
import { z } from 'zod';

// Define author schema
export const AuthorSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  bio_en: z.string().optional(),
  bio_am: z.string().optional(),
  avatar_url: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Define news category schema
export const NewsCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Define news schema - Updated to use category_slug instead of category_id
export const NewsSchema = z.object({
  id: z.string().uuid(),
  title_en: z.string(),
  title_am: z.string(),
  content_en: z.string(),
  content_am: z.string(),
  thumbnail_url: z.string().optional(),
  category_slug: z.string().optional(), // Changed from category_id
  league_slug: z.string().optional(),
  author_id: z.string().uuid().optional(),
  views: z.number().default(0),
  comments_count: z.number().default(0),
  published_at: z.string().datetime(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  category: NewsCategorySchema.optional(),
  league: z.object({
    id: z.string().uuid(),
    name_en: z.string(),
    name_am: z.string(),
    slug: z.string(),
  }).optional(),
  author: AuthorSchema.optional(),
});

// Define input schemas for create and update
export const createNewsInputSchema = NewsSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  views: true,
  comments_count: true,
  category: true,
  league: true,
  author: true,
});

export const updateNewsInputSchema = NewsSchema.partial().omit({
  id: true,
  created_at: true,
  updated_at: true,
  views: true,
  comments_count: true,
  category: true,
  league: true,
  author: true,
});

// Export types
export type News = z.infer<typeof NewsSchema>;
export type CreateNews = z.infer<typeof createNewsInputSchema>;
export type UpdateNews = z.infer<typeof updateNewsInputSchema>;
export type Author = z.infer<typeof AuthorSchema>;
export type NewsCategory = z.infer<typeof NewsCategorySchema>;