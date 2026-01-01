-- ============================================================================
-- PANA SPORTS V2.0 DATABASE MIGRATION
-- ============================================================================
-- Run this migration on Supabase Dashboard SQL Editor
-- Created: 2024-12-31
-- Description: Comprehensive schema updates for v2.0 features including:
--   - Season Management System
--   - Cup Competition Support
--   - Match Time Persistence
--   - Standings Automation
--   - Player Career Stats
--   - Live Commentary
--   - Ad Management
--   - Head-to-Head Stats
-- ============================================================================

-- ============================================================================
-- PART 1: SEASONS MANAGEMENT SYSTEM
-- ============================================================================

-- Main seasons table - central entity for season management
CREATE TABLE IF NOT EXISTS public.seasons (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,                              -- e.g., "2024/25"
  slug text NOT NULL UNIQUE,                       -- e.g., "2024-25"
  start_date date NOT NULL,
  end_date date NOT NULL,
  is_current boolean DEFAULT false,
  is_archived boolean DEFAULT false,               -- Lock previous seasons from edits
  description_en text,
  description_am text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid,
  CONSTRAINT seasons_pkey PRIMARY KEY (id),
  CONSTRAINT seasons_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);

-- Ensure only one current season per context (using partial unique index)
CREATE UNIQUE INDEX IF NOT EXISTS idx_seasons_single_current 
ON public.seasons (is_current) WHERE is_current = true;

-- Season-Team participation (which teams participate in which season)
CREATE TABLE IF NOT EXISTS public.season_teams (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  season_id uuid NOT NULL,
  team_id uuid NOT NULL,
  league_id uuid NOT NULL,                         -- The league they're participating in
  is_promoted boolean DEFAULT false,               -- Promoted from lower league
  is_relegated boolean DEFAULT false,              -- Relegated from this season
  promoted_from_league_id uuid,                    -- Which league they came from
  relegated_to_league_id uuid,                     -- Which league they're going to
  notes_en text,
  notes_am text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid,
  CONSTRAINT season_teams_pkey PRIMARY KEY (id),
  CONSTRAINT season_teams_season_id_fkey FOREIGN KEY (season_id) REFERENCES public.seasons(id) ON DELETE CASCADE,
  CONSTRAINT season_teams_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE,
  CONSTRAINT season_teams_league_id_fkey FOREIGN KEY (league_id) REFERENCES public.leagues(id),
  CONSTRAINT season_teams_promoted_from_fkey FOREIGN KEY (promoted_from_league_id) REFERENCES public.leagues(id),
  CONSTRAINT season_teams_relegated_to_fkey FOREIGN KEY (relegated_to_league_id) REFERENCES public.leagues(id),
  CONSTRAINT season_teams_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT season_teams_unique UNIQUE (season_id, team_id, league_id)
);

-- Season-Player participation (which players participate in which season)
CREATE TABLE IF NOT EXISTS public.season_players (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  season_id uuid NOT NULL,
  player_id uuid NOT NULL,
  team_id uuid NOT NULL,                           -- Their team for this season
  jersey_number integer,                           -- Jersey # can change per season
  joined_date date,
  left_date date,
  is_captain boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid,
  CONSTRAINT season_players_pkey PRIMARY KEY (id),
  CONSTRAINT season_players_season_id_fkey FOREIGN KEY (season_id) REFERENCES public.seasons(id) ON DELETE CASCADE,
  CONSTRAINT season_players_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE CASCADE,
  CONSTRAINT season_players_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id),
  CONSTRAINT season_players_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT season_players_unique UNIQUE (season_id, player_id, team_id)
);

-- Season statistics summary (aggregated stats for each season)
CREATE TABLE IF NOT EXISTS public.season_stats (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  season_id uuid NOT NULL,
  league_id uuid NOT NULL,
  total_matches integer DEFAULT 0,
  total_goals integer DEFAULT 0,
  total_yellow_cards integer DEFAULT 0,
  total_red_cards integer DEFAULT 0,
  highest_scoring_match_id uuid,
  top_scorer_id uuid,                              -- Player with most goals
  top_assister_id uuid,                            -- Player with most assists
  most_clean_sheets_team_id uuid,
  champion_team_id uuid,                           -- Season winner
  runner_up_team_id uuid,
  third_place_team_id uuid,
  relegated_teams jsonb DEFAULT '[]'::jsonb,       -- Array of team IDs
  promoted_teams jsonb DEFAULT '[]'::jsonb,        -- Array of team IDs
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid,
  CONSTRAINT season_stats_pkey PRIMARY KEY (id),
  CONSTRAINT season_stats_season_id_fkey FOREIGN KEY (season_id) REFERENCES public.seasons(id) ON DELETE CASCADE,
  CONSTRAINT season_stats_league_id_fkey FOREIGN KEY (league_id) REFERENCES public.leagues(id),
  CONSTRAINT season_stats_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT season_stats_unique UNIQUE (season_id, league_id)
);

-- ============================================================================
-- PART 2: CUP COMPETITIONS SYSTEM
-- ============================================================================

-- Cups table (Ethiopian Cup, Super Cup, etc.)
CREATE TABLE IF NOT EXISTS public.cups (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  slug text NOT NULL UNIQUE,
  name_en text NOT NULL,
  name_am text NOT NULL,
  description_en text,
  description_am text,
  logo_url text,
  cup_type text NOT NULL DEFAULT 'knockout' CHECK (cup_type IN ('knockout', 'group_knockout', 'league_cup')),
  country text DEFAULT 'Ethiopia'::text,
  founded_year integer,
  current_holder_team_id uuid,                     -- Current champion
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid,
  CONSTRAINT cups_pkey PRIMARY KEY (id),
  CONSTRAINT cups_current_holder_fkey FOREIGN KEY (current_holder_team_id) REFERENCES public.teams(id),
  CONSTRAINT cups_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);

-- Cup Editions (each year's cup competition)
CREATE TABLE IF NOT EXISTS public.cup_editions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  cup_id uuid NOT NULL,
  season_id uuid NOT NULL,
  name text NOT NULL,                              -- e.g., "Ethiopian Cup 2024/25"
  start_date date,
  end_date date,
  status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  winner_team_id uuid,
  runner_up_team_id uuid,
  total_teams integer DEFAULT 0,
  has_group_stage boolean DEFAULT false,
  groups_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid,
  CONSTRAINT cup_editions_pkey PRIMARY KEY (id),
  CONSTRAINT cup_editions_cup_id_fkey FOREIGN KEY (cup_id) REFERENCES public.cups(id) ON DELETE CASCADE,
  CONSTRAINT cup_editions_season_id_fkey FOREIGN KEY (season_id) REFERENCES public.seasons(id),
  CONSTRAINT cup_editions_winner_fkey FOREIGN KEY (winner_team_id) REFERENCES public.teams(id),
  CONSTRAINT cup_editions_runner_up_fkey FOREIGN KEY (runner_up_team_id) REFERENCES public.teams(id),
  CONSTRAINT cup_editions_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);

-- Cup Groups (for group stage cups)
CREATE TABLE IF NOT EXISTS public.cup_groups (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  cup_edition_id uuid NOT NULL,
  name text NOT NULL,                              -- e.g., "Group A"
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid,
  CONSTRAINT cup_groups_pkey PRIMARY KEY (id),
  CONSTRAINT cup_groups_cup_edition_id_fkey FOREIGN KEY (cup_edition_id) REFERENCES public.cup_editions(id) ON DELETE CASCADE,
  CONSTRAINT cup_groups_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);

-- Cup Group Teams
CREATE TABLE IF NOT EXISTS public.cup_group_teams (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  cup_group_id uuid NOT NULL,
  team_id uuid NOT NULL,
  played integer DEFAULT 0,
  won integer DEFAULT 0,
  draw integer DEFAULT 0,
  lost integer DEFAULT 0,
  goals_for integer DEFAULT 0,
  goals_against integer DEFAULT 0,
  gd integer DEFAULT 0,
  points integer DEFAULT 0,
  rank integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT cup_group_teams_pkey PRIMARY KEY (id),
  CONSTRAINT cup_group_teams_group_id_fkey FOREIGN KEY (cup_group_id) REFERENCES public.cup_groups(id) ON DELETE CASCADE,
  CONSTRAINT cup_group_teams_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id),
  CONSTRAINT cup_group_teams_unique UNIQUE (cup_group_id, team_id)
);

-- Modify knockout_rounds to support cups
ALTER TABLE public.knockout_rounds 
ADD COLUMN IF NOT EXISTS cup_edition_id uuid,
ADD COLUMN IF NOT EXISTS is_cup_round boolean DEFAULT false;

-- Add foreign key for cup_edition_id
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'knockout_rounds_cup_edition_id_fkey'
  ) THEN
    ALTER TABLE public.knockout_rounds 
    ADD CONSTRAINT knockout_rounds_cup_edition_id_fkey 
    FOREIGN KEY (cup_edition_id) REFERENCES public.cup_editions(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ============================================================================
-- PART 3: MATCH TIME PERSISTENCE & ENHANCED STATUS
-- ============================================================================

-- Update matches status enum to include all needed statuses
-- First, drop the old constraint
ALTER TABLE public.matches DROP CONSTRAINT IF EXISTS matches_status_check;

-- Add new constraint with all statuses
ALTER TABLE public.matches ADD CONSTRAINT matches_status_check 
CHECK (status IN (
  'scheduled',
  'live',
  'paused',           -- NEW: In-game pause (injury stoppage, VAR)
  'half_time',
  'second_half',      -- NEW: Second half in progress
  'extra_time',
  'extra_time_break', -- NEW: Break between extra time halves
  'penalties',
  'completed',
  'postponed',
  'cancelled',
  'abandoned',        -- NEW: Match abandoned
  'suspended'         -- NEW: Match suspended (to continue later)
));

-- Add new columns for match time tracking
ALTER TABLE public.matches 
ADD COLUMN IF NOT EXISTS season_id uuid,
ADD COLUMN IF NOT EXISTS cup_edition_id uuid,
ADD COLUMN IF NOT EXISTS is_cup_match boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS match_started_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS first_half_ended_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS second_half_started_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS second_half_ended_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS extra_time_started_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS extra_time_ended_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS penalties_started_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS match_ended_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS total_stoppage_time integer DEFAULT 0,           -- Total accumulated stoppage
ADD COLUMN IF NOT EXISTS first_half_injury_time integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS second_half_injury_time integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS extra_time_first_injury_time integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS extra_time_second_injury_time integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS auto_timeout_at timestamp with time zone,        -- For auto-timeout feature
ADD COLUMN IF NOT EXISTS penalty_score_home integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS penalty_score_away integer DEFAULT 0;

-- Add foreign keys for new columns
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'matches_season_id_fkey'
  ) THEN
    ALTER TABLE public.matches 
    ADD CONSTRAINT matches_season_id_fkey 
    FOREIGN KEY (season_id) REFERENCES public.seasons(id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'matches_cup_edition_id_fkey'
  ) THEN
    ALTER TABLE public.matches 
    ADD CONSTRAINT matches_cup_edition_id_fkey 
    FOREIGN KEY (cup_edition_id) REFERENCES public.cup_editions(id);
  END IF;
END $$;

-- ============================================================================
-- PART 4: STANDINGS AUTOMATION ENHANCEMENTS
-- ============================================================================

-- Add new columns to standings for automation
ALTER TABLE public.standings 
ADD COLUMN IF NOT EXISTS season_id uuid,
ADD COLUMN IF NOT EXISTS points_deduction integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS points_deduction_reason text,
ADD COLUMN IF NOT EXISTS form jsonb DEFAULT '[]'::jsonb,                  -- Last 5 match results: ["W","D","L","W","W"]
ADD COLUMN IF NOT EXISTS head_to_head_data jsonb DEFAULT '{}'::jsonb,     -- H2H vs other teams
ADD COLUMN IF NOT EXISTS last_updated_from_match_id uuid,                 -- Track which match triggered last update
ADD COLUMN IF NOT EXISTS clean_sheets integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS failed_to_score integer DEFAULT 0,               -- Matches without scoring
ADD COLUMN IF NOT EXISTS is_manual_override boolean DEFAULT false;        -- True if manually adjusted

-- Add foreign key for season_id
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'standings_season_id_fkey'
  ) THEN
    ALTER TABLE public.standings 
    ADD CONSTRAINT standings_season_id_fkey 
    FOREIGN KEY (season_id) REFERENCES public.seasons(id);
  END IF;
END $$;

-- ============================================================================
-- PART 5: PLAYER CAREER STATS
-- ============================================================================

-- Player career stats (aggregated across all seasons)
CREATE TABLE IF NOT EXISTS public.player_career_stats (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  player_id uuid NOT NULL UNIQUE,
  total_appearances integer DEFAULT 0,
  total_starts integer DEFAULT 0,
  total_substitutions integer DEFAULT 0,
  total_minutes_played integer DEFAULT 0,
  total_goals integer DEFAULT 0,
  total_assists integer DEFAULT 0,
  total_yellow_cards integer DEFAULT 0,
  total_red_cards integer DEFAULT 0,
  total_clean_sheets integer DEFAULT 0,            -- For goalkeepers
  total_penalties_scored integer DEFAULT 0,
  total_penalties_missed integer DEFAULT 0,
  seasons_played integer DEFAULT 0,
  teams_played_for jsonb DEFAULT '[]'::jsonb,      -- Array of team IDs
  first_appearance_date date,
  last_appearance_date date,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT player_career_stats_pkey PRIMARY KEY (id),
  CONSTRAINT player_career_stats_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE CASCADE
);

-- Player season stats (per season breakdown)
CREATE TABLE IF NOT EXISTS public.player_season_stats (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  player_id uuid NOT NULL,
  season_id uuid NOT NULL,
  team_id uuid NOT NULL,
  league_id uuid,
  cup_edition_id uuid,
  competition_type text DEFAULT 'league' CHECK (competition_type IN ('league', 'cup', 'friendly')),
  appearances integer DEFAULT 0,
  starts integer DEFAULT 0,
  substitutions integer DEFAULT 0,
  minutes_played integer DEFAULT 0,
  goals integer DEFAULT 0,
  assists integer DEFAULT 0,
  yellow_cards integer DEFAULT 0,
  red_cards integer DEFAULT 0,
  clean_sheets integer DEFAULT 0,
  penalties_scored integer DEFAULT 0,
  penalties_missed integer DEFAULT 0,
  man_of_the_match integer DEFAULT 0,
  average_rating numeric(3,2) DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT player_season_stats_pkey PRIMARY KEY (id),
  CONSTRAINT player_season_stats_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE CASCADE,
  CONSTRAINT player_season_stats_season_id_fkey FOREIGN KEY (season_id) REFERENCES public.seasons(id) ON DELETE CASCADE,
  CONSTRAINT player_season_stats_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id),
  CONSTRAINT player_season_stats_league_id_fkey FOREIGN KEY (league_id) REFERENCES public.leagues(id),
  CONSTRAINT player_season_stats_cup_edition_id_fkey FOREIGN KEY (cup_edition_id) REFERENCES public.cup_editions(id),
  CONSTRAINT player_season_stats_unique UNIQUE (player_id, season_id, team_id, competition_type, league_id, cup_edition_id)
);

-- ============================================================================
-- PART 6: LIVE COMMENTARY SYSTEM
-- ============================================================================

-- Live commentary/minute-by-minute updates
CREATE TABLE IF NOT EXISTS public.match_commentary (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  match_id uuid NOT NULL,
  minute integer NOT NULL,
  added_time integer DEFAULT 0,                    -- e.g., 45+3 would be minute=45, added_time=3
  comment_en text NOT NULL,
  comment_am text,
  comment_type text DEFAULT 'general' CHECK (comment_type IN (
    'general',
    'goal',
    'card',
    'substitution',
    'var',
    'injury',
    'highlight',
    'chance',
    'save',
    'post',
    'period_start',
    'period_end'
  )),
  is_key_event boolean DEFAULT false,
  related_event_id uuid,                           -- Link to match_events
  created_at timestamp with time zone DEFAULT now(),
  created_by uuid,
  CONSTRAINT match_commentary_pkey PRIMARY KEY (id),
  CONSTRAINT match_commentary_match_id_fkey FOREIGN KEY (match_id) REFERENCES public.matches(id) ON DELETE CASCADE,
  CONSTRAINT match_commentary_related_event_fkey FOREIGN KEY (related_event_id) REFERENCES public.match_events(id),
  CONSTRAINT match_commentary_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);

-- Index for efficient querying
CREATE INDEX IF NOT EXISTS idx_match_commentary_match_minute 
ON public.match_commentary (match_id, minute DESC, added_time DESC);

-- ============================================================================
-- PART 7: HEAD-TO-HEAD STATS
-- ============================================================================

-- Head-to-head stats between teams
CREATE TABLE IF NOT EXISTS public.head_to_head (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  team_a_id uuid NOT NULL,
  team_b_id uuid NOT NULL,
  total_matches integer DEFAULT 0,
  team_a_wins integer DEFAULT 0,
  team_b_wins integer DEFAULT 0,
  draws integer DEFAULT 0,
  team_a_goals integer DEFAULT 0,
  team_b_goals integer DEFAULT 0,
  team_a_home_wins integer DEFAULT 0,
  team_b_home_wins integer DEFAULT 0,
  last_match_id uuid,
  last_match_date timestamp with time zone,
  last_winner_team_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT head_to_head_pkey PRIMARY KEY (id),
  CONSTRAINT head_to_head_team_a_fkey FOREIGN KEY (team_a_id) REFERENCES public.teams(id) ON DELETE CASCADE,
  CONSTRAINT head_to_head_team_b_fkey FOREIGN KEY (team_b_id) REFERENCES public.teams(id) ON DELETE CASCADE,
  CONSTRAINT head_to_head_last_match_fkey FOREIGN KEY (last_match_id) REFERENCES public.matches(id),
  -- Ensure team_a_id is always less than team_b_id to prevent duplicates
  CONSTRAINT head_to_head_unique UNIQUE (team_a_id, team_b_id),
  CONSTRAINT head_to_head_order CHECK (team_a_id < team_b_id)
);

-- ============================================================================
-- PART 8: AD MANAGEMENT SYSTEM
-- ============================================================================

-- Ad campaigns/slots
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

-- Ad images (for carousel)
CREATE TABLE IF NOT EXISTS public.ad_images (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  campaign_id uuid NOT NULL,
  image_url text NOT NULL,
  alt_text_en text,
  alt_text_am text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  target_pages jsonb DEFAULT '["home"]'::jsonb,    -- Which pages to show on
  size_type text DEFAULT 'banner' CHECK (size_type IN ('banner', 'sidebar', 'inline', 'popup')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ad_images_pkey PRIMARY KEY (id),
  CONSTRAINT ad_images_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.ad_campaigns(id) ON DELETE CASCADE
);

-- Ad analytics
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

-- ============================================================================
-- PART 9: FIXTURE GENERATION HELPERS
-- ============================================================================

-- Generated fixtures (for round-robin scheduling)
CREATE TABLE IF NOT EXISTS public.fixture_templates (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  league_id uuid,
  season_id uuid NOT NULL,
  cup_edition_id uuid,
  match_day integer NOT NULL,
  round text,
  home_team_id uuid NOT NULL,
  away_team_id uuid NOT NULL,
  suggested_date date,
  is_generated boolean DEFAULT true,              -- True if auto-generated
  match_id uuid,                                  -- Link to actual match once created
  created_at timestamp with time zone DEFAULT now(),
  created_by uuid,
  CONSTRAINT fixture_templates_pkey PRIMARY KEY (id),
  CONSTRAINT fixture_templates_league_id_fkey FOREIGN KEY (league_id) REFERENCES public.leagues(id),
  CONSTRAINT fixture_templates_season_id_fkey FOREIGN KEY (season_id) REFERENCES public.seasons(id),
  CONSTRAINT fixture_templates_cup_edition_id_fkey FOREIGN KEY (cup_edition_id) REFERENCES public.cup_editions(id),
  CONSTRAINT fixture_templates_home_team_fkey FOREIGN KEY (home_team_id) REFERENCES public.teams(id),
  CONSTRAINT fixture_templates_away_team_fkey FOREIGN KEY (away_team_id) REFERENCES public.teams(id),
  CONSTRAINT fixture_templates_match_fkey FOREIGN KEY (match_id) REFERENCES public.matches(id),
  CONSTRAINT fixture_templates_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);

-- ============================================================================
-- PART 10: NEWS CATEGORIES ENHANCEMENTS
-- ============================================================================

-- Add new columns for enhanced news categorization
ALTER TABLE public.news_categories 
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false,               -- For featured/opinionated articles
ADD COLUMN IF NOT EXISTS category_type text DEFAULT 'general' CHECK (category_type IN (
  'general',
  'league',
  'featured',         -- Opinionated articles
  'match_report',
  'transfer',
  'interview',
  'opinion',
  'analysis',
  'breaking'
));

-- Add season_id to news for filtering by season
ALTER TABLE public.news 
ADD COLUMN IF NOT EXISTS season_id uuid;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'news_season_id_fkey'
  ) THEN
    ALTER TABLE public.news 
    ADD CONSTRAINT news_season_id_fkey 
    FOREIGN KEY (season_id) REFERENCES public.seasons(id);
  END IF;
END $$;

-- ============================================================================
-- PART 11: LEAGUES TABLE ENHANCEMENTS
-- ============================================================================

-- Add league type to distinguish between leagues and other competitions
ALTER TABLE public.leagues 
ADD COLUMN IF NOT EXISTS league_type text DEFAULT 'league' CHECK (league_type IN (
  'league',
  'cup',              -- Keep for backward compatibility
  'friendly',
  'tournament'
)),
ADD COLUMN IF NOT EXISTS tier integer DEFAULT 1,                          -- 1 = Premier, 2 = Higher, etc.
ADD COLUMN IF NOT EXISTS promotion_spots integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS relegation_spots integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_season_id uuid;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'leagues_current_season_id_fkey'
  ) THEN
    ALTER TABLE public.leagues 
    ADD CONSTRAINT leagues_current_season_id_fkey 
    FOREIGN KEY (current_season_id) REFERENCES public.seasons(id);
  END IF;
END $$;

-- ============================================================================
-- PART 12: TOP SCORERS ENHANCEMENTS
-- ============================================================================

-- Add season_id foreign key to top_scorers
ALTER TABLE public.top_scorers 
ADD COLUMN IF NOT EXISTS season_id uuid,
ADD COLUMN IF NOT EXISTS penalties integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS minutes_played integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS matches_played integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS goals_per_match numeric(4,2) DEFAULT 0;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'top_scorers_season_id_fkey'
  ) THEN
    ALTER TABLE public.top_scorers 
    ADD CONSTRAINT top_scorers_season_id_fkey 
    FOREIGN KEY (season_id) REFERENCES public.seasons(id);
  END IF;
END $$;

-- ============================================================================
-- PART 13: MATCH EVENTS ENHANCEMENTS
-- ============================================================================

-- Update match_events type constraint to allow NULL team_id and player_id for unconfirmed events
-- (Already supports NULL via existing schema, just need to add event types)

-- Drop existing constraint
ALTER TABLE public.match_events DROP CONSTRAINT IF EXISTS match_events_type_check;

-- Add updated constraint with more event types
ALTER TABLE public.match_events ADD CONSTRAINT match_events_type_check 
CHECK (type IN (
  'goal',
  'yellow',
  'red',
  'sub',
  'assist',
  'own_goal',
  'penalty',
  'match_start',
  'match_end',
  'half_time',
  'second_half',
  'injury_time',
  'var_check',
  'var_goal',
  'var_no_goal',
  'corner',
  'free_kick',
  'offside',
  'penalty_goal',
  'penalty_miss',
  'second_yellow',
  'match_pause',
  'match_resume',
  'extra_time_start',
  'extra_time_end',
  'penalty_shootout_start',
  'penalty_shootout_end',
  'penalty_shootout_scored',
  'penalty_shootout_missed',
  'injury',              -- NEW: Player injury
  'save',                -- NEW: Notable save
  'post',                -- NEW: Hit the post
  'chance',              -- NEW: Big chance
  'kickoff',             -- NEW: Match/half kickoff
  'final_whistle'        -- NEW: End of match/period
));

-- Add updated_at column if missing
ALTER TABLE public.match_events 
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- ============================================================================
-- PART 14: DATABASE FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to calculate elapsed match time
CREATE OR REPLACE FUNCTION calculate_match_elapsed_time(match_row matches)
RETURNS integer AS $$
DECLARE
  elapsed_seconds integer := 0;
  current_time_tz timestamp with time zone := now();
BEGIN
  -- Return stored minute if match is not live
  IF match_row.status NOT IN ('live', 'second_half', 'extra_time', 'penalties') THEN
    RETURN match_row.minute;
  END IF;
  
  -- Calculate based on current period
  CASE match_row.status
    WHEN 'live' THEN
      -- First half
      IF match_row.match_started_at IS NOT NULL THEN
        elapsed_seconds := EXTRACT(EPOCH FROM (current_time_tz - match_row.match_started_at))::integer;
      END IF;
    WHEN 'second_half' THEN
      -- Second half (starts at minute 45)
      IF match_row.second_half_started_at IS NOT NULL THEN
        elapsed_seconds := 45 * 60 + EXTRACT(EPOCH FROM (current_time_tz - match_row.second_half_started_at))::integer;
      END IF;
    WHEN 'extra_time' THEN
      -- Extra time (starts at minute 90)
      IF match_row.extra_time_started_at IS NOT NULL THEN
        elapsed_seconds := 90 * 60 + EXTRACT(EPOCH FROM (current_time_tz - match_row.extra_time_started_at))::integer;
      END IF;
    ELSE
      RETURN match_row.minute;
  END CASE;
  
  -- Convert to minutes and cap at reasonable values
  RETURN LEAST(elapsed_seconds / 60, 120);
END;
$$ LANGUAGE plpgsql;

-- Function to update standings after match completion (for automation)
CREATE OR REPLACE FUNCTION update_standings_from_match()
RETURNS TRIGGER AS $$
DECLARE
  home_result text;
  away_result text;
  home_standing_id uuid;
  away_standing_id uuid;
BEGIN
  -- Only trigger on match completion
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    -- Skip if it's a cup match
    IF NEW.is_cup_match = true THEN
      RETURN NEW;
    END IF;
    
    -- Determine results
    IF NEW.score_home > NEW.score_away THEN
      home_result := 'W';
      away_result := 'L';
    ELSIF NEW.score_home < NEW.score_away THEN
      home_result := 'L';
      away_result := 'W';
    ELSE
      home_result := 'D';
      away_result := 'D';
    END IF;
    
    -- Get or create home team standing
    SELECT id INTO home_standing_id 
    FROM public.standings 
    WHERE team_id = NEW.home_team_id 
      AND league_id = NEW.league_id 
      AND season = NEW.season;
    
    IF home_standing_id IS NULL AND NEW.season IS NOT NULL THEN
      INSERT INTO public.standings (team_id, league_id, season)
      VALUES (NEW.home_team_id, NEW.league_id, NEW.season)
      RETURNING id INTO home_standing_id;
    END IF;
    
    -- Get or create away team standing
    SELECT id INTO away_standing_id 
    FROM public.standings 
    WHERE team_id = NEW.away_team_id 
      AND league_id = NEW.league_id 
      AND season = NEW.season;
    
    IF away_standing_id IS NULL AND NEW.season IS NOT NULL THEN
      INSERT INTO public.standings (team_id, league_id, season)
      VALUES (NEW.away_team_id, NEW.league_id, NEW.season)
      RETURNING id INTO away_standing_id;
    END IF;
    
    -- Update home team stats
    IF home_standing_id IS NOT NULL THEN
      UPDATE public.standings SET
        played = played + 1,
        won = won + CASE WHEN home_result = 'W' THEN 1 ELSE 0 END,
        draw = draw + CASE WHEN home_result = 'D' THEN 1 ELSE 0 END,
        lost = lost + CASE WHEN home_result = 'L' THEN 1 ELSE 0 END,
        goals_for = goals_for + NEW.score_home,
        goals_against = goals_against + NEW.score_away,
        gd = goals_for + NEW.score_home - goals_against - NEW.score_away,
        points = points + CASE 
          WHEN home_result = 'W' THEN 3 
          WHEN home_result = 'D' THEN 1 
          ELSE 0 
        END,
        home_played = home_played + 1,
        home_won = home_won + CASE WHEN home_result = 'W' THEN 1 ELSE 0 END,
        home_draw = home_draw + CASE WHEN home_result = 'D' THEN 1 ELSE 0 END,
        home_lost = home_lost + CASE WHEN home_result = 'L' THEN 1 ELSE 0 END,
        home_goals_for = home_goals_for + NEW.score_home,
        home_goals_against = home_goals_against + NEW.score_away,
        clean_sheets = clean_sheets + CASE WHEN NEW.score_away = 0 THEN 1 ELSE 0 END,
        failed_to_score = failed_to_score + CASE WHEN NEW.score_home = 0 THEN 1 ELSE 0 END,
        form = (
          SELECT jsonb_agg(val)
          FROM (
            SELECT val
            FROM jsonb_array_elements_text(
              CASE 
                WHEN jsonb_array_length(COALESCE(form, '[]'::jsonb)) >= 5 
                THEN form - 0 
                ELSE form 
              END || to_jsonb(home_result)
            ) val
            LIMIT 5
          ) sub
        ),
        last_updated_from_match_id = NEW.id,
        updated_at = now()
      WHERE id = home_standing_id AND is_manual_override = false;
    END IF;
    
    -- Update away team stats
    IF away_standing_id IS NOT NULL THEN
      UPDATE public.standings SET
        played = played + 1,
        won = won + CASE WHEN away_result = 'W' THEN 1 ELSE 0 END,
        draw = draw + CASE WHEN away_result = 'D' THEN 1 ELSE 0 END,
        lost = lost + CASE WHEN away_result = 'L' THEN 1 ELSE 0 END,
        goals_for = goals_for + NEW.score_away,
        goals_against = goals_against + NEW.score_home,
        gd = goals_for + NEW.score_away - goals_against - NEW.score_home,
        points = points + CASE 
          WHEN away_result = 'W' THEN 3 
          WHEN away_result = 'D' THEN 1 
          ELSE 0 
        END,
        away_played = away_played + 1,
        away_won = away_won + CASE WHEN away_result = 'W' THEN 1 ELSE 0 END,
        away_draw = away_draw + CASE WHEN away_result = 'D' THEN 1 ELSE 0 END,
        away_lost = away_lost + CASE WHEN away_result = 'L' THEN 1 ELSE 0 END,
        away_goals_for = away_goals_for + NEW.score_away,
        away_goals_against = away_goals_against + NEW.score_home,
        clean_sheets = clean_sheets + CASE WHEN NEW.score_home = 0 THEN 1 ELSE 0 END,
        failed_to_score = failed_to_score + CASE WHEN NEW.score_away = 0 THEN 1 ELSE 0 END,
        form = (
          SELECT jsonb_agg(val)
          FROM (
            SELECT val
            FROM jsonb_array_elements_text(
              CASE 
                WHEN jsonb_array_length(COALESCE(form, '[]'::jsonb)) >= 5 
                THEN form - 0 
                ELSE form 
              END || to_jsonb(away_result)
            ) val
            LIMIT 5
          ) sub
        ),
        last_updated_from_match_id = NEW.id,
        updated_at = now()
      WHERE id = away_standing_id AND is_manual_override = false;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS trigger_update_standings_from_match ON public.matches;
CREATE TRIGGER trigger_update_standings_from_match
AFTER UPDATE ON public.matches
FOR EACH ROW
EXECUTE FUNCTION update_standings_from_match();

-- Function to update rankings after standings change
CREATE OR REPLACE FUNCTION update_standings_rankings()
RETURNS TRIGGER AS $$
BEGIN
  -- Update rankings for the league/season
  WITH ranked AS (
    SELECT 
      id,
      ROW_NUMBER() OVER (
        ORDER BY 
          (points - COALESCE(points_deduction, 0)) DESC,
          gd DESC,
          goals_for DESC,
          won DESC
      ) as new_rank
    FROM public.standings
    WHERE league_id = NEW.league_id AND season = NEW.season
  )
  UPDATE public.standings s
  SET rank = r.new_rank
  FROM ranked r
  WHERE s.id = r.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the ranking trigger
DROP TRIGGER IF EXISTS trigger_update_standings_rankings ON public.standings;
CREATE TRIGGER trigger_update_standings_rankings
AFTER INSERT OR UPDATE ON public.standings
FOR EACH ROW
EXECUTE FUNCTION update_standings_rankings();

-- Function to update head-to-head stats
CREATE OR REPLACE FUNCTION update_head_to_head_from_match()
RETURNS TRIGGER AS $$
DECLARE
  team_a uuid;
  team_b uuid;
  h2h_id uuid;
BEGIN
  -- Only trigger on match completion
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    -- Ensure consistent ordering (smaller UUID first)
    IF NEW.home_team_id < NEW.away_team_id THEN
      team_a := NEW.home_team_id;
      team_b := NEW.away_team_id;
    ELSE
      team_a := NEW.away_team_id;
      team_b := NEW.home_team_id;
    END IF;
    
    -- Get or create h2h record
    SELECT id INTO h2h_id FROM public.head_to_head 
    WHERE team_a_id = team_a AND team_b_id = team_b;
    
    IF h2h_id IS NULL THEN
      INSERT INTO public.head_to_head (team_a_id, team_b_id)
      VALUES (team_a, team_b)
      RETURNING id INTO h2h_id;
    END IF;
    
    -- Update h2h stats based on which team is home/away
    IF NEW.home_team_id = team_a THEN
      UPDATE public.head_to_head SET
        total_matches = total_matches + 1,
        team_a_wins = team_a_wins + CASE WHEN NEW.score_home > NEW.score_away THEN 1 ELSE 0 END,
        team_b_wins = team_b_wins + CASE WHEN NEW.score_away > NEW.score_home THEN 1 ELSE 0 END,
        draws = draws + CASE WHEN NEW.score_home = NEW.score_away THEN 1 ELSE 0 END,
        team_a_goals = team_a_goals + NEW.score_home,
        team_b_goals = team_b_goals + NEW.score_away,
        team_a_home_wins = team_a_home_wins + CASE WHEN NEW.score_home > NEW.score_away THEN 1 ELSE 0 END,
        last_match_id = NEW.id,
        last_match_date = NEW.date,
        last_winner_team_id = CASE 
          WHEN NEW.score_home > NEW.score_away THEN NEW.home_team_id
          WHEN NEW.score_away > NEW.score_home THEN NEW.away_team_id
          ELSE NULL
        END,
        updated_at = now()
      WHERE id = h2h_id;
    ELSE
      UPDATE public.head_to_head SET
        total_matches = total_matches + 1,
        team_a_wins = team_a_wins + CASE WHEN NEW.score_away > NEW.score_home THEN 1 ELSE 0 END,
        team_b_wins = team_b_wins + CASE WHEN NEW.score_home > NEW.score_away THEN 1 ELSE 0 END,
        draws = draws + CASE WHEN NEW.score_home = NEW.score_away THEN 1 ELSE 0 END,
        team_a_goals = team_a_goals + NEW.score_away,
        team_b_goals = team_b_goals + NEW.score_home,
        team_b_home_wins = team_b_home_wins + CASE WHEN NEW.score_home > NEW.score_away THEN 1 ELSE 0 END,
        last_match_id = NEW.id,
        last_match_date = NEW.date,
        last_winner_team_id = CASE 
          WHEN NEW.score_home > NEW.score_away THEN NEW.home_team_id
          WHEN NEW.score_away > NEW.score_home THEN NEW.away_team_id
          ELSE NULL
        END,
        updated_at = now()
      WHERE id = h2h_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the h2h trigger
DROP TRIGGER IF EXISTS trigger_update_head_to_head ON public.matches;
CREATE TRIGGER trigger_update_head_to_head
AFTER UPDATE ON public.matches
FOR EACH ROW
EXECUTE FUNCTION update_head_to_head_from_match();

-- ============================================================================
-- PART 15: INDEXES FOR PERFORMANCE
-- ============================================================================

-- Seasons indexes
CREATE INDEX IF NOT EXISTS idx_seasons_is_current ON public.seasons (is_current);
CREATE INDEX IF NOT EXISTS idx_seasons_dates ON public.seasons (start_date, end_date);

-- Season teams indexes
CREATE INDEX IF NOT EXISTS idx_season_teams_season ON public.season_teams (season_id);
CREATE INDEX IF NOT EXISTS idx_season_teams_team ON public.season_teams (team_id);

-- Season players indexes
CREATE INDEX IF NOT EXISTS idx_season_players_season ON public.season_players (season_id);
CREATE INDEX IF NOT EXISTS idx_season_players_player ON public.season_players (player_id);

-- Matches indexes for new columns
CREATE INDEX IF NOT EXISTS idx_matches_season_id ON public.matches (season_id);
CREATE INDEX IF NOT EXISTS idx_matches_cup_edition ON public.matches (cup_edition_id);
CREATE INDEX IF NOT EXISTS idx_matches_status_date ON public.matches (status, date);

-- Standings indexes
CREATE INDEX IF NOT EXISTS idx_standings_season_id ON public.standings (season_id);
CREATE INDEX IF NOT EXISTS idx_standings_league_season ON public.standings (league_id, season);
CREATE INDEX IF NOT EXISTS idx_standings_ranking ON public.standings (league_id, season, rank);

-- Player stats indexes
CREATE INDEX IF NOT EXISTS idx_player_season_stats_season ON public.player_season_stats (season_id);
CREATE INDEX IF NOT EXISTS idx_player_season_stats_player ON public.player_season_stats (player_id);

-- Head to head indexes
CREATE INDEX IF NOT EXISTS idx_h2h_teams ON public.head_to_head (team_a_id, team_b_id);

-- Cup indexes
CREATE INDEX IF NOT EXISTS idx_cup_editions_cup ON public.cup_editions (cup_id);
CREATE INDEX IF NOT EXISTS idx_cup_editions_season ON public.cup_editions (season_id);

-- Ad indexes
CREATE INDEX IF NOT EXISTS idx_ad_images_active ON public.ad_images (is_active, campaign_id);
CREATE INDEX IF NOT EXISTS idx_ad_analytics_image ON public.ad_analytics (ad_image_id);

-- ============================================================================
-- PART 16: INITIAL DATA SEEDING
-- ============================================================================

-- Insert default news categories for v2.0
INSERT INTO public.news_categories (name, name_en, name_am, slug, category_type, sort_order, is_active)
VALUES 
  ('Featured', 'Featured Articles', 'ዋና ጽሁፎች', 'featured', 'featured', 1, true),
  ('Opinion', 'Opinion & Analysis', 'አስተያየት እና ትንታኔ', 'opinion', 'opinion', 2, true),
  ('Match Reports', 'Match Reports', 'የጨዋታ ዘገባዎች', 'match-reports', 'match_report', 3, true),
  ('Transfers', 'Transfer News', 'የዝውውር ዜና', 'transfers', 'transfer', 4, true),
  ('Interviews', 'Interviews', 'ቃለ መጠይቆች', 'interviews', 'interview', 5, true),
  ('Breaking', 'Breaking News', 'ሰበር ዜና', 'breaking', 'breaking', 6, true)
ON CONFLICT (slug) DO UPDATE SET
  category_type = EXCLUDED.category_type,
  is_active = true;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Add a migration record
CREATE TABLE IF NOT EXISTS public.migrations (
  id serial PRIMARY KEY,
  name text NOT NULL,
  executed_at timestamp with time zone DEFAULT now()
);

INSERT INTO public.migrations (name) VALUES ('20241231_v2_0_migration');

-- Summary of changes:
-- 1. Created 'seasons' table with season management
-- 2. Created 'season_teams' and 'season_players' for season participation
-- 3. Created 'season_stats' for season summaries
-- 4. Created 'cups', 'cup_editions', 'cup_groups', 'cup_group_teams' for cup competitions
-- 5. Enhanced 'matches' with time tracking columns and new statuses
-- 6. Enhanced 'standings' with automation fields
-- 7. Created 'player_career_stats' and 'player_season_stats'
-- 8. Created 'match_commentary' for live text updates
-- 9. Created 'head_to_head' for team vs team stats
-- 10. Created 'ad_campaigns', 'ad_images', 'ad_analytics' for ad management
-- 11. Created 'fixture_templates' for schedule generation
-- 12. Enhanced 'news_categories' with category types
-- 13. Added database triggers for standings automation
-- 14. Added indexes for query performance
