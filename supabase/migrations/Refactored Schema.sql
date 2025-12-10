- - Create proper foreign key constraints
-- Add proper cascade options for referential integrity
-- Create optimized views for public API
-- Implement proper indexing strategy
- - ================
-- LEAGUES (Enhanced)
-- ================
CREATE TABLE leagues (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
slug TEXT UNIQUE NOT NULL,
name_en TEXT NOT NULL,
name_am TEXT NOT NULL,
category TEXT NOT NULL, -- e.g., 'premier', 'womens', 'walias', 'u20', 'cup'
logo_url TEXT,
description_en TEXT,
description_am TEXT,
founded_year INT,
country TEXT DEFAULT 'Ethiopia',
website_url TEXT,
is_active BOOLEAN DEFAULT true,
created_at TIMESTAMPTZ DEFAULT now(),
updated_at TIMESTAMPTZ DEFAULT now(),
created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX idx_leagues_slug ON leagues(slug);
CREATE INDEX idx_leagues_category ON leagues(category);
CREATE INDEX idx_leagues_active ON leagues(is_active);
CREATE TRIGGER update_leagues_updated_at BEFORE UPDATE ON leagues FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

- - ================
-- TEAMS (Enhanced with proper FK)
-- ================
CREATE TABLE teams (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
slug TEXT UNIQUE NOT NULL,
league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
name_en TEXT NOT NULL,
name_am TEXT NOT NULL,
short_name_en TEXT,
short_name_am TEXT,
logo_url TEXT,
description_en TEXT,
description_am TEXT,
stadium_en TEXT,
stadium_am TEXT,
founded INT,
website_url TEXT,
is_active BOOLEAN DEFAULT true,
created_at TIMESTAMPTZ DEFAULT now(),
updated_at TIMESTAMPTZ DEFAULT now(),
created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX idx_teams_slug ON teams(slug);
CREATE INDEX idx_teams_league_id ON teams(league_id);
CREATE INDEX idx_teams_active ON teams(is_active);
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

- - ================
-- PLAYERS (Enhanced with proper FK)
-- ================
CREATE TABLE players (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
slug TEXT UNIQUE NOT NULL,
team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
name_en TEXT NOT NULL,
name_am TEXT NOT NULL,
position_en TEXT,
position_am TEXT,
jersey_number INT,
dob DATE,
nationality TEXT,
height_cm INT,
weight_kg INT,
bio_en TEXT,
bio_am TEXT,
photo_url TEXT,
contract_until DATE,
market_value TEXT,
is_active BOOLEAN DEFAULT true,
created_at TIMESTAMPTZ DEFAULT now(),
updated_at TIMESTAMPTZ DEFAULT now(),
created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX idx_players_slug ON players(slug);
CREATE INDEX idx_players_team_id ON players(team_id);
CREATE INDEX idx_players_active ON players(is_active);
CREATE INDEX idx_players_position ON players(position_en);
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

- - ================
-- MATCHES (Enhanced with proper FK)
-- ================
CREATE TABLE matches (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
home_team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
away_team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
date TIMESTAMPTZ NOT NULL,
status TEXT DEFAULT 'scheduled', -- 'scheduled', 'live', 'completed', 'postponed', 'cancelled'
score_home INT DEFAULT 0,
score_away INT DEFAULT 0,
score_detail JSONB DEFAULT '{}', -- e.g., {"penalties": [4, 3], "extra_time": true}
minute INT DEFAULT 0,
venue_id UUID,
attendance INT,
referee TEXT,
match_day INT, -- For league match day tracking
season TEXT, -- e.g., "2023/2024"
is_featured BOOLEAN DEFAULT false,
created_at TIMESTAMPTZ DEFAULT now(),
updated_at TIMESTAMPTZ DEFAULT now(),
created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
- - Ensure a team doesn't play against itself
CONSTRAINT matches_home_away_different CHECK (home_team_id != away_team_id)
);

CREATE INDEX idx_matches_league_id ON matches(league_id);
CREATE INDEX idx_matches_date ON matches(date DESC);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_home_team ON matches(home_team_id);
CREATE INDEX idx_matches_away_team ON matches(away_team_id);
CREATE INDEX idx_matches_featured ON matches(is_featured);
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

- - ================
-- VENUES (New table)
-- ================
CREATE TABLE venues (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
name_en TEXT NOT NULL,
name_am TEXT NOT NULL,
city TEXT,
capacity INT,
address TEXT,
photo_url TEXT,
created_at TIMESTAMPTZ DEFAULT now(),
updated_at TIMESTAMPTZ DEFAULT now(),
created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX idx_venues_city ON venues(city);
CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON venues FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

- - Add venue_id foreign key to matches
ALTER TABLE matches ADD CONSTRAINT matches_venue_id_fkey
FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE SET NULL;
- - ================
-- MATCH_EVENTS (Enhanced with proper FK)
-- ================
CREATE TABLE match_events (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
player_id UUID REFERENCES players(id) ON DELETE SET NULL,
team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
minute INT NOT NULL,
type TEXT NOT NULL, -- e.g., 'goal', 'yellow', 'red', 'sub', 'assist', 'own_goal', 'penalty'
description_en TEXT,
description_am TEXT,
created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_match_events_match_id ON match_events(match_id);
CREATE INDEX idx_match_events_player_id ON match_events(player_id);
CREATE INDEX idx_match_events_team_id ON match_events(team_id);
CREATE INDEX idx_match_events_minute ON match_events(minute);
CREATE INDEX idx_match_events_type ON match_events(type);

- - ================
-- STANDINGS (Enhanced with proper FK)
-- ================
CREATE TABLE standings (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
season TEXT NOT NULL,
played INT DEFAULT 0,
won INT DEFAULT 0,
draw INT DEFAULT 0,
lost INT DEFAULT 0,
goals_for INT DEFAULT 0,
goals_against INT DEFAULT 0,
gd INT DEFAULT 0, -- goal difference, computed trigger
points INT DEFAULT 0,
rank INT DEFAULT 0,
home_played INT DEFAULT 0,
home_won INT DEFAULT 0,
home_draw INT DEFAULT 0,
home_lost INT DEFAULT 0,
home_goals_for INT DEFAULT 0,
home_goals_against INT DEFAULT 0,
away_played INT DEFAULT 0,
away_won INT DEFAULT 0,
away_draw INT DEFAULT 0,
away_lost INT DEFAULT 0,
away_goals_for INT DEFAULT 0,
away_goals_against INT DEFAULT 0,
created_at TIMESTAMPTZ DEFAULT now(),
updated_at TIMESTAMPTZ DEFAULT now(),
created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
- - Ensure one entry per team per league per season
UNIQUE(league_id, team_id, season)
);

CREATE INDEX idx_standings_league_id ON standings(league_id);
CREATE INDEX idx_standings_team_id ON standings(team_id);
CREATE INDEX idx_standings_season ON standings(season);
CREATE INDEX idx_standings_rank ON standings(rank);
CREATE TRIGGER update_standings_updated_at BEFORE UPDATE ON standings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

- - Trigger for gd:
CREATE OR REPLACE FUNCTION compute_gd()
RETURNS TRIGGER AS $$ BEGIN
[NEW.gd](http://new.gd/) = NEW.goals_for - NEW.goals_against;
NEW.home_gd = NEW.home_goals_for - NEW.home_goals_against;
NEW.away_gd = NEW.away_goals_for - NEW.away_goals_against;
RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER compute_standings_gd BEFORE INSERT OR UPDATE ON standings FOR EACH ROW EXECUTE PROCEDURE compute_gd();

- - ================
-- TOP_SCORERS (Enhanced with proper FK)
-- ================
CREATE TABLE top_scorers (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
season TEXT NOT NULL,
goals INT DEFAULT 0,
assists INT DEFAULT 0,
created_at TIMESTAMPTZ DEFAULT now(),
updated_at TIMESTAMPTZ DEFAULT now(),
created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
- - Ensure one entry per player per league per season
UNIQUE(league_id, player_id, season)
);

CREATE INDEX idx_top_scorers_league_id ON top_scorers(league_id);
CREATE INDEX idx_top_scorers_player_id ON top_scorers(player_id);
CREATE INDEX idx_top_scorers_team_id ON top_scorers(team_id);
CREATE INDEX idx_top_scorers_goals ON top_scorers(goals DESC);
CREATE INDEX idx_top_scorers_season ON top_scorers(season);
CREATE TRIGGER update_top_scorers_updated_at BEFORE UPDATE ON top_scorers FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

- - ================
-- TRANSFERS (Enhanced with proper FK)
-- ================
CREATE TABLE transfers (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
from_team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
to_team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
transfer_date DATE NOT NULL,
transfer_type TEXT NOT NULL, -- 'permanent', 'loan', 'loan_end'
fee TEXT,
contract_length TEXT,
notes_en TEXT,
notes_am TEXT,
created_at TIMESTAMPTZ DEFAULT now(),
updated_at TIMESTAMPTZ DEFAULT now(),
created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX idx_transfers_player_id ON transfers(player_id);
CREATE INDEX idx_transfers_from_team_id ON transfers(from_team_id);
CREATE INDEX idx_transfers_to_team_id ON transfers(to_team_id);
CREATE INDEX idx_transfers_date ON transfers(transfer_date DESC);
CREATE TRIGGER update_transfers_updated_at BEFORE UPDATE ON transfers FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

- - ================
-- AUTHORS (Enhanced)
-- ================
CREATE TABLE authors (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
name TEXT NOT NULL,
email TEXT UNIQUE,
bio_en TEXT,
bio_am TEXT,
avatar_url TEXT,
social_links JSONB DEFAULT '{}', -- e.g., {"twitter": "@handle", "facebook": "url"}
is_active BOOLEAN DEFAULT true,
created_at TIMESTAMPTZ DEFAULT now(),
updated_at TIMESTAMPTZ DEFAULT now(),
created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX idx_authors_name ON authors(name);
CREATE INDEX idx_authors_email ON authors(email);
CREATE INDEX idx_authors_active ON authors(is_active);
CREATE TRIGGER update_authors_updated_at BEFORE UPDATE ON authors FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

- - ================
-- NEWS (Enhanced with proper FK)
-- ================
CREATE TABLE news (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
title_en TEXT NOT NULL,
title_am TEXT NOT NULL,
slug TEXT UNIQUE,
content_en TEXT,
content_am TEXT,
excerpt_en TEXT,
excerpt_am TEXT,
thumbnail_url TEXT,
category_id UUID, -- Reference to news_categories table
author_id UUID REFERENCES authors(id) ON DELETE SET NULL,
league_id UUID REFERENCES leagues(id) ON DELETE SET NULL,
match_id UUID REFERENCES matches(id) ON DELETE SET NULL,
tags JSONB DEFAULT '[]', -- e.g., ["saint-george", "fasil-kenema", "match-report"]
views INT DEFAULT 0,
likes INT DEFAULT 0,
comments_count INT DEFAULT 0, -- auto-updated via trigger
is_featured BOOLEAN DEFAULT false,
is_published BOOLEAN DEFAULT false,
published_at TIMESTAMPTZ,
created_at TIMESTAMPTZ DEFAULT now(),
updated_at TIMESTAMPTZ DEFAULT now(),
created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX idx_news_category_id ON news(category_id);
CREATE INDEX idx_news_author_id ON news(author_id);
CREATE INDEX idx_news_league_id ON news(league_id);
CREATE INDEX idx_news_match_id ON news(match_id);
CREATE INDEX idx_news_published_at ON news(published_at DESC);
CREATE INDEX idx_news_is_published ON news(is_published);
CREATE INDEX idx_news_is_featured ON news(is_featured);
CREATE INDEX idx_news_views ON news(views DESC);
CREATE INDEX idx_news_likes ON news(likes DESC);
CREATE INDEX idx_news_tags ON news USING GIN(tags);
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

- - Function to generate slug from title
CREATE OR REPLACE FUNCTION generate_news_slug()
RETURNS TRIGGER AS $$ BEGIN
NEW.slug = lower(regexp_replace(NEW.title_en, '[^a-zA-Z0-9 ]', '', 'g'));
NEW.slug = regexp_replace(NEW.slug, '\s+', '-', 'g');
NEW.slug = regexp_replace(NEW.slug, '-+', '-', 'g');
NEW.slug = trim(both '-' from NEW.slug);
NEW.slug = coalesce(NEW.slug || '-' || substr([NEW.id](http://new.id/)::text, 1, 8));
RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_news_slug BEFORE INSERT ON news FOR EACH ROW EXECUTE PROCEDURE generate_news_slug();

- - ================
-- NEWS_CATEGORIES (New table)
-- ================
CREATE TABLE news_categories (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
name TEXT UNIQUE NOT NULL,
name_en TEXT,
name_am TEXT,
slug TEXT UNIQUE NOT NULL,
description TEXT,
color TEXT, -- Hex color for UI
icon TEXT, -- Icon name for UI
sort_order INT DEFAULT 0,
is_active BOOLEAN DEFAULT true,
created_at TIMESTAMPTZ DEFAULT now(),
updated_at TIMESTAMPTZ DEFAULT now(),
created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX idx_news_categories_slug ON news_categories(slug);
CREATE INDEX idx_news_categories_active ON news_categories(is_active);
CREATE INDEX idx_news_categories_sort ON news_categories(sort_order);
CREATE TRIGGER update_news_categories_updated_at BEFORE UPDATE ON news_categories FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

- - Add category_id foreign key to news
ALTER TABLE news ADD CONSTRAINT news_category_id_fkey
FOREIGN KEY (category_id) REFERENCES news_categories(id) ON DELETE SET NULL;
- - ================
-- COMMENTS (Enhanced with proper FK)
-- ================
CREATE TABLE comments (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
news_id UUID NOT NULL REFERENCES news(id) ON DELETE CASCADE,
user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- For nested comments
content_en TEXT NOT NULL,
content_am TEXT,
is_approved BOOLEAN DEFAULT false, -- For moderation
likes INT DEFAULT 0,
is_deleted BOOLEAN DEFAULT false,
created_at TIMESTAMPTZ DEFAULT now(),
updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_comments_news_id ON comments(news_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_is_approved ON comments(is_approved);
CREATE INDEX idx_comments_is_deleted ON comments(is_deleted);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

- - Trigger to update comments count on news
CREATE OR REPLACE FUNCTION update_news_comments_count()
RETURNS TRIGGER AS $$ BEGIN
IF TG_OP = 'INSERT' AND NEW.is_approved = true AND NOT NEW.is_deleted THEN
UPDATE news SET comments_count = comments_count + 1 WHERE id = NEW.news_id;
ELSIF TG_OP = 'UPDATE' AND OLD.is_approved = false AND NEW.is_approved = true AND NOT NEW.is_deleted THEN
UPDATE news SET comments_count = comments_count + 1 WHERE id = NEW.news_id;
ELSIF TG_OP = 'UPDATE' AND OLD.is_approved = true AND NEW.is_approved = false AND NOT NEW.is_deleted THEN
UPDATE news SET comments_count = comments_count - 1 WHERE id = NEW.news_id;
ELSIF TG_OP = 'UPDATE' AND OLD.is_deleted = false AND NEW.is_deleted = true THEN
UPDATE news SET comments_count = comments_count - 1 WHERE id = NEW.news_id;
ELSIF TG_OP = 'DELETE' AND OLD.is_approved = true AND NOT OLD.is_deleted THEN
UPDATE news SET comments_count = comments_count - 1 WHERE id = OLD.news_id;
END IF;
RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_news_comments_count_trigger
AFTER INSERT OR UPDATE OR DELETE ON comments
FOR EACH ROW EXECUTE PROCEDURE update_news_comments_count();

- - ================
-- VIEWS_LOG (Enhanced)
-- ================
CREATE TABLE views_log (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
news_id UUID NOT NULL REFERENCES news(id) ON DELETE CASCADE,
user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ip_hash TEXT NOT NULL,
user_agent TEXT,
referrer TEXT,
created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_views_log_news_id ON views_log(news_id);
CREATE INDEX idx_views_log_user_id ON views_log(user_id);
CREATE INDEX idx_views_log_created_at ON views_log(created_at DESC);
CREATE UNIQUE INDEX idx_unique_view ON views_log(news_id, ip_hash, user_id);

- - Trigger to increment views count on news
CREATE OR REPLACE FUNCTION update_news_views_count()
RETURNS TRIGGER AS $$ BEGIN
UPDATE news SET views = views + 1 WHERE id = NEW.news_id;
RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_news_views_count_trigger
AFTER INSERT ON views_log
FOR EACH ROW EXECUTE PROCEDURE update_news_views_count();

- - ================
-- AUDIT_LOGS (Enhanced)
-- ================
CREATE TABLE audit_logs (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
table_name TEXT NOT NULL,
row_id UUID NOT NULL,
operation TEXT NOT NULL, -- 'insert', 'update', 'delete'
old_values JSONB,
new_values JSONB,
created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_row_id ON audit_logs(row_id);

- - Function to log changes
CREATE OR REPLACE FUNCTION log_audit()
RETURNS TRIGGER AS $$ BEGIN
IF TG_OP = 'INSERT' THEN
INSERT INTO audit_logs (user_id, table_name, row_id, operation, new_values)
VALUES (COALESCE(current_setting('app.current_user_id'), TG_TABLE_NAME, [NEW.id](http://new.id/), 'INSERT', row_to_json(NEW));
ELSIF TG_OP = 'UPDATE' THEN
INSERT INTO audit_logs (user_id, table_name, row_id, operation, old_values, new_values)
VALUES (COALESCE(current_setting('app.current_user_id'), TG_TABLE_NAME, [NEW.id](http://new.id/), 'UPDATE', row_to_json(OLD), row_to_json(NEW));
ELSIF TG_OP = 'DELETE' THEN
INSERT INTO audit_logs (user_id, table_name, row_id, operation, old_values)
VALUES (COALESCE(current_setting('app.current_user_id'), TG_TABLE_NAME, [OLD.id](http://old.id/), 'DELETE', row_to_json(OLD));
END IF;
RETURN NULL;
END;
$$ language 'plpgsql';
- - Add triggers to core tables
CREATE TRIGGER audit_leagues AFTER INSERT OR UPDATE OR DELETE ON leagues FOR EACH ROW EXECUTE PROCEDURE log_audit();
CREATE TRIGGER audit_teams AFTER INSERT OR UPDATE OR DELETE ON teams FOR EACH ROW EXECUTE PROCEDURE log_audit();
CREATE TRIGGER audit_players AFTER INSERT OR UPDATE OR DELETE ON players FOR EACH ROW EXECUTE PROCEDURE log_audit();
CREATE TRIGGER audit_matches AFTER INSERT OR UPDATE OR DELETE ON matches FOR EACH ROW EXECUTE PROCEDURE log_audit();
CREATE TRIGGER audit_news AFTER INSERT OR UPDATE OR DELETE ON news FOR EACH ROW EXECUTE PROCEDURE log_audit();
CREATE TRIGGER audit_comments AFTER INSERT OR UPDATE OR DELETE ON comments FOR EACH ROW EXECUTE PROCEDURE log_audit();
- - ================
-- EDITOR_LOCKS (Enhanced)
-- ================
CREATE TABLE editor_locks (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
table_name TEXT NOT NULL,
row_id UUID NOT NULL,
admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
expires_at TIMESTAMPTZ NOT NULL,
created_at TIMESTAMPTZ DEFAULT now(),
meta JSONB DEFAULT '{}',

UNIQUE(table_name, row_id)
);

CREATE INDEX idx_editor_locks_table_name ON editor_locks(table_name);
CREATE INDEX idx_editor_locks_row_id ON editor_locks(row_id);
CREATE INDEX idx_editor_locks_admin_id ON editor_locks(admin_id);
CREATE INDEX idx_editor_locks_expires_at ON editor_locks(expires_at);

- - Function to clean expired locks
CREATE OR REPLACE FUNCTION clean_expired_editor_locks()
RETURNS void AS $$ BEGIN
DELETE FROM editor_locks WHERE expires_at < now();
END;
$$ language 'plpgsql';
- - Schedule to run daily at 3 AM
SELECT cron.schedule('clean-expired-locks', '0 3 * * *', 'SELECT clean_expired_editor_locks();');
- - ================
-- OPTIMIZED VIEWS FOR PUBLIC API
-- ================
- - View for matches with all relations
CREATE OR REPLACE VIEW public_matches AS
SELECT
[m.id](http://m.id/),
m.date,
m.status,
m.score_home,
m.score_away,
m.minute,
m.attendance,
m.referee,
m.is_featured,
m.season,
[ht.id](http://ht.id/) as home_team_id,
ht.slug as home_team_slug,
ht.name_en as home_team_name_en,
ht.name_am as home_team_name_am,
ht.short_name_en as home_team_short_name_en,
ht.short_name_am as home_team_short_name_am,
ht.logo_url as home_team_logo_url,
[at.id](http://at.id/) as away_team_id,
at.slug as away_team_slug,
at.name_en as away_team_name_en,
at.name_am as away_team_name_am,
at.short_name_en as away_team_short_name_en,
at.short_name_am as away_team_short_name_am,
at.logo_url as away_team_logo_url,
[l.id](http://l.id/) as league_id,
l.slug as league_slug,
l.name_en as league_name_en,
l.name_am as league_name_am,
l.category as league_category,
[v.id](http://v.id/) as venue_id,
v.name_en as venue_name_en,
v.name_am as venue_name_am,
v.city as venue_city,
v.capacity as venue_capacity
FROM
matches m
LEFT JOIN teams ht ON m.home_team_id = [ht.id](http://ht.id/)
LEFT JOIN teams at ON m.away_team_id = [at.id](http://at.id/)
LEFT JOIN leagues l ON m.league_id = [l.id](http://l.id/)
LEFT JOIN venues v ON m.venue_id = [v.id](http://v.id/)
WHERE m.is_published = true;
- - View for news with all relations
CREATE OR REPLACE VIEW public_news AS
SELECT
[n.id](http://n.id/),
n.title_en,
n.title_am,
n.slug,
n.excerpt_en,
n.excerpt_am,
n.thumbnail_url,
n.published_at,
n.views,
n.likes,
n.comments_count,
n.is_featured,
n.tags,
[nc.id](http://nc.id/) as category_id,
nc.slug as category_slug,
nc.name_en as category_name_en,
nc.name_am as category_name_am,
nc.color as category_color,
nc.icon as category_icon,
[a.id](http://a.id/) as author_id,
[a.name](http://a.name/) as author_name,
a.avatar_url as author_avatar_url,
[l.id](http://l.id/) as league_id,
l.slug as league_slug,
l.name_en as league_name_en,
l.name_am as league_name_am,
[m.id](http://m.id/) as match_id,
ht.name_en as home_team_name,
at.name_en as away_team_name
FROM
news n
LEFT JOIN news_categories nc ON n.category_id = [nc.id](http://nc.id/)
LEFT JOIN authors a ON n.author_id = [a.id](http://a.id/)
LEFT JOIN leagues l ON n.league_id = [l.id](http://l.id/)
LEFT JOIN matches m ON n.match_id = [m.id](http://m.id/)
LEFT JOIN teams ht ON m.home_team_id = [ht.id](http://ht.id/)
LEFT JOIN teams at ON m.away_team_id = [at.id](http://at.id/)
WHERE n.is_published = true;
- - View for standings with team info
CREATE OR REPLACE VIEW public_standings AS
SELECT
[s.id](http://s.id/),
s.season,
s.played,
s.won,
s.draw,
s.lost,
s.goals_for,
s.goals_against,
[s.gd](http://s.gd/),
s.points,
s.rank,
s.home_played,
s.home_won,
s.home_draw,
s.home_lost,
s.home_goals_for,
s.home_goals_against,
s.away_played,
s.away_won,
s.away_draw,
s.away_lost,
s.away_goals_for,
s.away_goals_against,
[t.id](http://t.id/) as team_id,
t.slug as team_slug,
t.name_en as team_name_en,
t.name_am as team_name_am,
t.short_name_en as team_short_name_en,
t.short_name_am as team_short_name_am,
t.logo_url as team_logo_url,
[l.id](http://l.id/) as league_id,
l.slug as league_slug,
l.name_en as league_name_en,
l.name_am as league_name_am
FROM
standings s
LEFT JOIN teams t ON s.team_id = [t.id](http://t.id/)
LEFT JOIN leagues l ON s.league_id = [l.id](http://l.id/)
ORDER BY s.rank;
- - ================
-- ENABLE REALTIME FOR ALL TABLES
-- ================
- - Enable replication for all tables
ALTER TABLE leagues REPLICA IDENTITY FULL;
ALTER TABLE teams REPLICA IDENTITY FULL;
ALTER TABLE players REPLICA IDENTITY FULL;
ALTER TABLE matches REPLICA IDENTITY FULL;
ALTER TABLE venues REPLICA IDENTITY FULL;
ALTER TABLE match_events REPLICA IDENTITY FULL;
ALTER TABLE standings REPLICA IDENTITY FULL;
ALTER TABLE top_scorers REPLICA IDENTITY FULL;
ALTER TABLE transfers REPLICA IDENTITY FULL;
ALTER TABLE authors REPLICA IDENTITY FULL;
ALTER TABLE news_categories REPLICA IDENTITY FULL;
ALTER TABLE news REPLICA IDENTITY FULL;
ALTER TABLE comments REPLICA IDENTITY FULL;
ALTER TABLE views_log REPLICA IDENTITY FULL;
ALTER TABLE audit_logs REPLICA IDENTITY FULL;
ALTER TABLE editor_locks REPLICA IDENTITY FULL;
- - Add all tables to publication
ALTER PUBLICATION supabase_realtime ADD TABLE leagues;
ALTER PUBLICATION supabase_realtime ADD TABLE teams;
ALTER PUBLICATION supabase_realtime ADD TABLE players;
ALTER PUBLICATION supabase_realtime ADD TABLE matches;
ALTER PUBLICATION supabase_realtime ADD TABLE venues;
ALTER PUBLICATION supabase_realtime ADD TABLE match_events;
ALTER PUBLICATION supabase_realtime ADD TABLE standings;
ALTER PUBLICATION supabase_realtime ADD TABLE top_scorers;
ALTER PUBLICATION supabase_realtime ADD TABLE transfers;
ALTER PUBLICATION supabase_realtime ADD TABLE authors;
ALTER PUBLICATION supabase_realtime ADD TABLE news_categories;
ALTER PUBLICATION supabase_realtime ADD TABLE news;
ALTER PUBLICATION supabase_realtime ADD TABLE comments;
ALTER PUBLICATION supabase_realtime ADD TABLE views_log;
ALTER PUBLICATION supabase_realtime ADD TABLE audit_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE editor_locks;
- - ================
-- ROLES AND PERMISSIONS
-- ================
- - Create roles table
CREATE TABLE roles (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
name TEXT UNIQUE NOT NULL,
description TEXT,
permissions JSONB DEFAULT '{}',
created_at TIMESTAMPTZ DEFAULT now(),
updated_at TIMESTAMPTZ DEFAULT now()
);
- - Insert default roles
INSERT INTO roles (name, description, permissions) VALUES
('admin', 'Full system access', '{"all": true}'),
('editor', 'Can edit content', '{"news": ["create", "update"], "matches": ["create", "update"], "teams": ["update"]}'),
('viewer', 'Read-only access', '{"news": ["read"], "matches": ["read"], "teams": ["read"]}');
- - Create user_roles junction table
CREATE TABLE user_roles (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
created_at TIMESTAMPTZ DEFAULT now(),
UNIQUE(user_id, role_id)
);
- - Add role column to auth.users if not exists
ALTER TABLE auth.users
ADD COLUMN IF NOT EXISTS role_id UUID REFERENCES roles(id) ON DELETE SET NULL;
- - Update existing users to have default role
UPDATE auth.users
SET role_id = (SELECT id FROM roles WHERE name = 'viewer')
WHERE role_id IS NULL;
- - ================
-- MIGRATION SCRIPT FROM OLD SCHEMA
-- ================
- - This section would contain specific migration logic to move from your current schema to the new one
-- It would need to be customized based on your exact current schema
- - Example migration for teams:
-- 1. Create a temporary mapping table between old team slugs and new team IDs
-- 2. Insert all teams into the new teams table
-- 3. Update all references in other tables to use the new IDs
- - This is a placeholder for the actual migration script you would need Option 2: Via Supabase Dashboard
Go to Authentication → Users
Click Add user
Enter email and set password
In User metadata, add: {"role": "admin"}
Save the user 