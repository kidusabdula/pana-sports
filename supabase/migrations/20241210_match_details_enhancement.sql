-- =====================================
-- MATCH DETAILS ENHANCEMENT MIGRATION
-- =====================================
-- This migration adds support for:
-- 1. Match Officials (Coach, Assistant Referees, Fourth Official, Match Commissioner)
-- 2. Round/Matchday structure
-- 3. Formations for both teams
-- 4. Weather and surface conditions
-- 5. Injured players tracking
-- 6. Knockout tournament bracket
-- =====================================

-- ================
-- UPDATE MATCHES TABLE
-- ================

-- Add round field for tournament structure
ALTER TABLE matches ADD COLUMN IF NOT EXISTS round TEXT;

-- Add matchday field (separate from match_day for tournament rounds)
-- match_day already exists for league match day tracking

-- Add formations for both teams
ALTER TABLE matches ADD COLUMN IF NOT EXISTS home_formation TEXT DEFAULT '4-4-2';
ALTER TABLE matches ADD COLUMN IF NOT EXISTS away_formation TEXT DEFAULT '4-4-2';

-- Add match officials
ALTER TABLE matches ADD COLUMN IF NOT EXISTS coach_home TEXT;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS coach_away TEXT;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS assistant_referee_1 TEXT;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS assistant_referee_2 TEXT;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS assistant_referee_3 TEXT; -- VAR if applicable
ALTER TABLE matches ADD COLUMN IF NOT EXISTS fourth_official TEXT;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS match_commissioner TEXT;

-- Add weather and conditions
ALTER TABLE matches ADD COLUMN IF NOT EXISTS weather TEXT; -- e.g., 'sunny', 'cloudy', 'rainy', etc.
ALTER TABLE matches ADD COLUMN IF NOT EXISTS temperature TEXT; -- e.g., '24°C'
ALTER TABLE matches ADD COLUMN IF NOT EXISTS humidity TEXT; -- e.g., '65%'
ALTER TABLE matches ADD COLUMN IF NOT EXISTS wind TEXT; -- e.g., '12 km/h'
ALTER TABLE matches ADD COLUMN IF NOT EXISTS surface TEXT DEFAULT 'grass'; -- 'grass', 'artificial', 'hybrid'

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_matches_round ON matches(round);

-- ================
-- UPDATE VENUES TABLE
-- ================

-- Add geolocation for Google Maps integration
ALTER TABLE venues ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE venues ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
ALTER TABLE venues ADD COLUMN IF NOT EXISTS google_place_id TEXT;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS surface TEXT DEFAULT 'grass';

-- ================
-- UPDATE MATCH_LINEUPS TABLE
-- ================

-- Add injury tracking
ALTER TABLE match_lineups ADD COLUMN IF NOT EXISTS is_injured BOOLEAN DEFAULT false;
ALTER TABLE match_lineups ADD COLUMN IF NOT EXISTS injury_type TEXT; -- e.g., 'Leg Injury', 'Muscle Injury'
ALTER TABLE match_lineups ADD COLUMN IF NOT EXISTS injury_return_date DATE;
ALTER TABLE match_lineups ADD COLUMN IF NOT EXISTS injury_status TEXT; -- 'injured', 'doubtful', 'suspended'

-- Add formation position coordinates for field map visualization
ALTER TABLE match_lineups ADD COLUMN IF NOT EXISTS position_x DECIMAL(5, 2); -- 0-100 percentage from left
ALTER TABLE match_lineups ADD COLUMN IF NOT EXISTS position_y DECIMAL(5, 2); -- 0-100 percentage from top

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_match_lineups_is_injured ON match_lineups(is_injured);
CREATE INDEX IF NOT EXISTS idx_match_lineups_injury_status ON match_lineups(injury_status);

-- ================
-- CREATE KNOCKOUT_ROUNDS TABLE
-- ================

CREATE TABLE IF NOT EXISTS knockout_rounds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
    season TEXT NOT NULL,
    round_name TEXT NOT NULL, -- 'Round of 16', 'Quarter-final', 'Semi-final', 'Final'
    round_order INT NOT NULL, -- 1, 2, 3, 4 for ordering
    total_matches INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    UNIQUE(league_id, season, round_name)
);

CREATE INDEX IF NOT EXISTS idx_knockout_rounds_league ON knockout_rounds(league_id);
CREATE INDEX IF NOT EXISTS idx_knockout_rounds_season ON knockout_rounds(season);
CREATE INDEX IF NOT EXISTS idx_knockout_rounds_order ON knockout_rounds(round_order);

-- ================
-- CREATE KNOCKOUT_MATCHES TABLE
-- ================

CREATE TABLE IF NOT EXISTS knockout_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    knockout_round_id UUID NOT NULL REFERENCES knockout_rounds(id) ON DELETE CASCADE,
    match_id UUID REFERENCES matches(id) ON DELETE SET NULL,
    position INT NOT NULL, -- Position in bracket (1, 2, 3, 4 for semi-finals, etc.)
    
    -- For matches not yet determined (TBD scenarios)
    home_placeholder TEXT, -- e.g., 'Winner of Match 1' or team options
    away_placeholder TEXT,
    
    -- Aggregate scores for two-legged ties
    aggregate_home INT DEFAULT 0,
    aggregate_away INT DEFAULT 0,
    is_two_legged BOOLEAN DEFAULT false,
    first_leg_match_id UUID REFERENCES matches(id) ON DELETE SET NULL,
    second_leg_match_id UUID REFERENCES matches(id) ON DELETE SET NULL,
    
    -- Winner tracking
    winner_team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    next_knockout_match_id UUID REFERENCES knockout_matches(id) ON DELETE SET NULL,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_knockout_matches_round ON knockout_matches(knockout_round_id);
CREATE INDEX IF NOT EXISTS idx_knockout_matches_match ON knockout_matches(match_id);
CREATE INDEX IF NOT EXISTS idx_knockout_matches_winner ON knockout_matches(winner_team_id);

-- ================
-- CREATE PLAYER_INJURIES TABLE
-- ================
-- Separate table for detailed injury tracking (optional, for historical records)

CREATE TABLE IF NOT EXISTS player_injuries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    injury_type TEXT NOT NULL, -- 'Leg Injury', 'Muscle Injury', 'Ankle Injury', etc.
    injury_date DATE,
    expected_return_date DATE,
    status TEXT DEFAULT 'injured', -- 'injured', 'doubtful', 'recovering', 'fit'
    notes_en TEXT,
    notes_am TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_player_injuries_player ON player_injuries(player_id);
CREATE INDEX IF NOT EXISTS idx_player_injuries_team ON player_injuries(team_id);
CREATE INDEX IF NOT EXISTS idx_player_injuries_status ON player_injuries(status);

CREATE TRIGGER update_player_injuries_updated_at 
    BEFORE UPDATE ON player_injuries 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ================
-- CREATE MATCH_STATS TABLE
-- ================
-- For detailed match statistics

CREATE TABLE IF NOT EXISTS match_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    
    -- Possession and passing
    possession INT DEFAULT 0, -- percentage
    total_passes INT DEFAULT 0,
    pass_accuracy INT DEFAULT 0, -- percentage
    
    -- Shots
    total_shots INT DEFAULT 0,
    shots_on_target INT DEFAULT 0,
    shots_off_target INT DEFAULT 0,
    blocked_shots INT DEFAULT 0,
    
    -- Set pieces
    corners INT DEFAULT 0,
    free_kicks INT DEFAULT 0,
    penalties_awarded INT DEFAULT 0,
    
    -- Defensive
    fouls_committed INT DEFAULT 0,
    offsides INT DEFAULT 0,
    tackles INT DEFAULT 0,
    interceptions INT DEFAULT 0,
    clearances INT DEFAULT 0,
    saves INT DEFAULT 0, -- goalkeeper saves
    
    -- Discipline
    yellow_cards INT DEFAULT 0,
    red_cards INT DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    UNIQUE(match_id, team_id)
);

CREATE INDEX IF NOT EXISTS idx_match_stats_match ON match_stats(match_id);
CREATE INDEX IF NOT EXISTS idx_match_stats_team ON match_stats(team_id);

CREATE TRIGGER update_match_stats_updated_at 
    BEFORE UPDATE ON match_stats 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ================
-- UPDATE VIEWS
-- ================

-- Drop existing view if it exists and recreate with new columns
DROP VIEW IF EXISTS public_matches;

CREATE OR REPLACE VIEW public_matches AS
SELECT
    m.id,
    m.date,
    m.status,
    m.score_home,
    m.score_away,
    m.minute,
    m.attendance,
    m.referee,
    m.is_featured,
    m.season,
    m.match_day,
    m.round,
    m.home_formation,
    m.away_formation,
    m.coach_home,
    m.coach_away,
    m.assistant_referee_1,
    m.assistant_referee_2,
    m.assistant_referee_3,
    m.fourth_official,
    m.match_commissioner,
    m.weather,
    m.temperature,
    m.humidity,
    m.wind,
    m.surface,
    ht.id as home_team_id,
    ht.slug as home_team_slug,
    ht.name_en as home_team_name_en,
    ht.name_am as home_team_name_am,
    ht.short_name_en as home_team_short_name_en,
    ht.short_name_am as home_team_short_name_am,
    ht.logo_url as home_team_logo_url,
    at.id as away_team_id,
    at.slug as away_team_slug,
    at.name_en as away_team_name_en,
    at.name_am as away_team_name_am,
    at.short_name_en as away_team_short_name_en,
    at.short_name_am as away_team_short_name_am,
    at.logo_url as away_team_logo_url,
    l.id as league_id,
    l.slug as league_slug,
    l.name_en as league_name_en,
    l.name_am as league_name_am,
    l.category as league_category,
    v.id as venue_id,
    v.name_en as venue_name_en,
    v.name_am as venue_name_am,
    v.city as venue_city,
    v.capacity as venue_capacity,
    v.latitude as venue_latitude,
    v.longitude as venue_longitude,
    v.surface as venue_surface
FROM
    matches m
    LEFT JOIN teams ht ON m.home_team_id = ht.id
    LEFT JOIN teams at ON m.away_team_id = at.id
    LEFT JOIN leagues l ON m.league_id = l.id
    LEFT JOIN venues v ON m.venue_id = v.id;

-- ================
-- ENABLE REALTIME FOR NEW TABLES
-- ================

ALTER TABLE knockout_rounds REPLICA IDENTITY FULL;
ALTER TABLE knockout_matches REPLICA IDENTITY FULL;
ALTER TABLE player_injuries REPLICA IDENTITY FULL;
ALTER TABLE match_stats REPLICA IDENTITY FULL;

-- Add tables to publication (uncomment if using Supabase realtime)
-- ALTER PUBLICATION supabase_realtime ADD TABLE knockout_rounds;
-- ALTER PUBLICATION supabase_realtime ADD TABLE knockout_matches;
-- ALTER PUBLICATION supabase_realtime ADD TABLE player_injuries;
-- ALTER PUBLICATION supabase_realtime ADD TABLE match_stats;

-- ================
-- COMMENTS
-- ================

COMMENT ON COLUMN matches.round IS 'Tournament round name (e.g., Round of 16, Quarter-final)';
COMMENT ON COLUMN matches.home_formation IS 'Home team formation (e.g., 4-4-2, 4-3-3)';
COMMENT ON COLUMN matches.away_formation IS 'Away team formation (e.g., 4-4-2, 4-3-3)';
COMMENT ON COLUMN matches.weather IS 'Weather conditions during the match';
COMMENT ON COLUMN matches.surface IS 'Playing surface type (grass, artificial, hybrid)';
COMMENT ON COLUMN match_lineups.position_x IS 'X coordinate (0-100) for formation visualization';
COMMENT ON COLUMN match_lineups.position_y IS 'Y coordinate (0-100) for formation visualization';
COMMENT ON TABLE knockout_rounds IS 'Tournament knockout round definitions';
COMMENT ON TABLE knockout_matches IS 'Individual knockout match brackets';
COMMENT ON TABLE player_injuries IS 'Player injury tracking with history';
COMMENT ON TABLE match_stats IS 'Detailed match statistics per team';
