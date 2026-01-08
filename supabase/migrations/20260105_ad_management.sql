-- ============================================================================
-- AD MANAGEMENT MODULE MIGRATION
-- ============================================================================

-- Ad campaigns/slots - grouping for ads
CREATE TABLE IF NOT EXISTS public.ad_campaigns (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  advertiser text,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  is_active boolean DEFAULT true,
  priority integer DEFAULT 0,                      -- Higher = more priority
  click_url text,
  impressions_count integer DEFAULT 0,
  clicks_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid,
  CONSTRAINT ad_campaigns_pkey PRIMARY KEY (id),
  CONSTRAINT ad_campaigns_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);

-- Ad images - actual banners displayed
CREATE TABLE IF NOT EXISTS public.ad_images (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  campaign_id uuid NOT NULL,
  image_url text NOT NULL,
  alt_text_en text,
  alt_text_am text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  target_pages jsonb DEFAULT '["home"]'::jsonb,    -- Which pages to show on (e.g. ["home", "matches", "leagues"])
  size_type text DEFAULT 'banner' CHECK (size_type IN ('full', 'sidebar', 'inline', 'popup')),
  link_url text,                                   -- Specific link if different from campaign
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ad_images_pkey PRIMARY KEY (id),
  CONSTRAINT ad_images_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.ad_campaigns(id) ON DELETE CASCADE
);

-- Ad analytics - tracking performance
CREATE TABLE IF NOT EXISTS public.ad_analytics (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  ad_image_id uuid NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('impression', 'click')),
  page_url text,
  user_agent text,
  ip_hash text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ad_analytics_pkey PRIMARY KEY (id),
  CONSTRAINT ad_analytics_ad_image_id_fkey FOREIGN KEY (ad_image_id) REFERENCES public.ad_images(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_analytics ENABLE ROW LEVEL SECURITY;

-- Policies for ad_campaigns
CREATE POLICY "Allow public read-only access on ad_campaigns" ON public.ad_campaigns
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow admin full access on ad_campaigns" ON public.ad_campaigns
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Policies for ad_images
CREATE POLICY "Allow public read-only access on ad_images" ON public.ad_images
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow admin full access on ad_images" ON public.ad_images
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Policies for ad_analytics
CREATE POLICY "Allow public insert on ad_analytics" ON public.ad_analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin read access on ad_analytics" ON public.ad_analytics
  FOR SELECT TO authenticated USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ad_images_active ON public.ad_images (is_active, size_type);
CREATE INDEX IF NOT EXISTS idx_ad_images_campaign ON public.ad_images (campaign_id);
CREATE INDEX IF NOT EXISTS idx_ad_analytics_event ON public.ad_analytics (event_type, ad_image_id);
