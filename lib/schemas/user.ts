import { z } from "zod";

// User schema from Supabase Auth
export const userEntitySchema = z.object({
  id: z.string().uuid(),
  email: z.string().email().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().nullable(),
  last_sign_in_at: z.string().datetime().nullable(),
  raw_user_meta_data: z.record(z.string(), z.any()).nullable(),
  role: z.string().nullable(),
});

// API input schema for updating user metadata (admin only)
export const updateUserMetadataInputSchema = z.object({
  role: z.enum(["user", "admin"]).optional(),
});

// Type exports
export type UserEntity = z.infer<typeof userEntitySchema>;
export type UpdateUserMetadata = z.infer<typeof updateUserMetadataInputSchema>;

// For backward compatibility
export type User = UserEntity;
