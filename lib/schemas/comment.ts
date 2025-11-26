import { z } from "zod";

// Database entity schema (includes all fields)
export const commentEntitySchema = z.object({
  id: z.string().uuid(),
  news_id: z.string().uuid(),
  user_id: z.string().uuid(),
  content_en: z.string(),
  content_am: z.string().nullable(),
  flagged: z.boolean(),
  deleted: z.boolean(),
  created_at: z.string().datetime(),
});

// API input schema for creating a comment
export const createCommentInputSchema = z.object({
  news_id: z.string().uuid("News article is required"),
  content_en: z.string().min(1, "Comment content is required").max(1000, "Comment must be less than 1000 characters"),
  content_am: z.string().max(1000, "Comment must be less than 1000 characters").optional().nullable(),
});

// API input schema for updating a comment
export const updateCommentInputSchema = z.object({
  content_en: z.string().min(1, "Comment content is required").max(1000, "Comment must be less than 1000 characters").optional(),
  content_am: z.string().max(1000, "Comment must be less than 1000 characters").optional().nullable(),
  flagged: z.boolean().optional(),
  deleted: z.boolean().optional(),
});

// Schema for comment with joined relations
export const commentWithRelationsSchema = commentEntitySchema.extend({
  news: z.object({
    id: z.string(),
    title_en: z.string(),
    title_am: z.string(),
  }).optional().nullable(),
  user: z.object({
    id: z.string(),
    email: z.string().nullable(),
  }).optional().nullable(),
});

// Type exports
export type CommentEntity = z.infer<typeof commentEntitySchema>;
export type CreateCommentInput = z.infer<typeof createCommentInputSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentInputSchema>;
export type CommentResponse = z.infer<typeof commentWithRelationsSchema>;

// For backward compatibility
export type Comment = CommentResponse;
export type CreateComment = CreateCommentInput;
export type UpdateComment = UpdateCommentInput;
