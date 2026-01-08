-- ============================================================================
-- AD MANAGEMENT MODULE V2 MIGRATION
-- Adds separate large/small banner images for better quality control
-- ============================================================================

-- Add new columns for small banner image
ALTER TABLE public.ad_images 
ADD COLUMN IF NOT EXISTS image_url_small text;

-- Rename existing image_url to image_url_large for clarity
-- First, add the new column
ALTER TABLE public.ad_images 
ADD COLUMN IF NOT EXISTS image_url_large text;

-- Copy existing image_url to image_url_large
UPDATE public.ad_images 
SET image_url_large = image_url 
WHERE image_url_large IS NULL AND image_url IS NOT NULL;

-- Add comments for clarity
COMMENT ON COLUMN public.ad_images.image_url_large IS 'Full-width banner image (recommended: 1200x400 or 3:1 aspect ratio)';
COMMENT ON COLUMN public.ad_images.image_url_small IS 'Sidebar/mobile banner image (recommended: 400x400 or 1:1 aspect ratio)';

-- Keep the original image_url for backward compatibility but it can be deprecated
-- The application will now primarily use image_url_large and image_url_small
