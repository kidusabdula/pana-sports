# Match Details Enhancement - Implementation Summary

This document summarizes the comprehensive enhancement made to the match details and match events features.

## Overview

The implementation adds robust support for:
- Match officials (coaches, assistant referees, fourth official, match commissioner)
- Formation management with visual field map display
- Round/matchday structure for tournaments
- Weather and surface conditions
- Player injury tracking in lineups
- League table integration on match detail page
- Knockout bracket visualization
- Head-to-head match history

## Schema Changes

A new SQL migration file has been created at:
`supabase/migrations/20241210_match_details_enhancement.sql`

### New Columns Added to `matches` Table:
- `round` - Tournament round name (e.g., Quarter-final)
- `home_formation` - Home team formation (e.g., 4-4-2)
- `away_formation` - Away team formation
- `coach_home` - Home team coach name
- `coach_away` - Away team coach name
- `assistant_referee_1` - First assistant referee
- `assistant_referee_2` - Second assistant referee
- `assistant_referee_3` - VAR official
- `fourth_official` - Fourth official
- `match_commissioner` - Match commissioner
- `weather` - Weather conditions
- `temperature` - Temperature reading
- `humidity` - Humidity percentage
- `wind` - Wind conditions
- `surface` - Playing surface type

### New Columns Added to `venues` Table:
- `latitude` - Venue latitude for Google Maps
- `longitude` - Venue longitude for Google Maps
- `google_place_id` - Google Places API ID
- `surface` - Default surface type

### New Columns Added to `match_lineups` Table:
- `is_injured` - Player injury status
- `injury_type` - Type of injury
- `injury_return_date` - Expected return date
- `injury_status` - Status (injured, doubtful, suspended)
- `position_x` - X coordinate for field visualization
- `position_y` - Y coordinate for field visualization

### New Tables Created:
- `knockout_rounds` - Tournament knockout round definitions
- `knockout_matches` - Individual knockout match brackets
- `player_injuries` - Detailed player injury tracking
- `match_stats` - Detailed match statistics per team

## TypeScript Schema Updates

### `lib/schemas/match.ts`
- Added all new match fields to entity and input schemas
- Updated venue relation to include lat/long/surface

### `lib/schemas/matchLineup.ts`
- Added injury tracking fields
- Added position coordinate fields
- Added photo_url to player relation

## API Updates

### `app/api/public/matches/[id]/route.ts`
- Now fetches lineups with player photos
- Fetches match stats
- Includes venue coordinates
- Includes all new match fields

### `app/api/public/matches/head-to-head/route.ts` (NEW)
- Fetches previous matches between two teams
- Calculates win/draw/loss statistics
- Returns recent form data

## Hooks Updates

### `lib/hooks/public/useMatchDetail.ts`
- Updated `MatchDetail` type with all new fields
- Added `MatchLineup` type with injury/position data
- Added `MatchStats` type for match statistics
- Added real-time subscription for lineups

### `lib/hooks/public/useHeadToHead.ts` (NEW)
- Hook for fetching head-to-head data between teams
- Hook for fetching team form

## New Components

### `components/matches/FormationFieldMap.tsx`
- Displays players on a football field visualization
- Supports common formations (4-4-2, 4-3-3, 3-5-2, etc.)
- Shows player photos/numbers
- Indicates captain and injured players
- Responsive design with compact mode

### `components/matches/KnockoutBracket.tsx`
- Visualizes tournament knockout brackets
- Shows team logos, names, and scores
- Indicates winners
- Trophy display for champion
- Simple variant for smaller displays

## CMS Updates

### `components/cms/matches/MatchControlPanel.tsx`
- Added new "Details" tab with sections for:
  - Round/Stage and Surface
  - Team formations
  - Coaches
  - Match officials (AR1, AR2, VAR, 4th Official, Commissioner)
  - Weather conditions (weather, temperature, humidity, wind)
- All details save to database with single button click

## Frontend Updates

### `components/matches/MatchDetailPage.tsx`
- Complete rewrite with 4 new tabs:
  1. **Preview** - Formation map, lineups, coaches, match events
  2. **Table** - League standings with highlighted teams
  3. **Knockout** - Tournament bracket visualization
  4. **Head-to-Head** - Previous match history and statistics
- Displays match officials (referee, ARs, 4th official, VAR, commissioner)
- Shows venue with Google Maps integration (when coordinates available)
- Weather conditions display
- Formation badges for both teams
- Round/matchday badges

## How to Deploy

### 1. Apply the SQL Migration in Supabase

**Important:** You MUST run this migration for the new features to work.

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy the entire contents of:
   ```
   supabase/migrations/20241210_match_details_enhancement.sql
   ```
4. Paste it into the SQL Editor
5. Click **Run** to execute

This will:
- Add new columns to `matches` table (formations, officials, weather)
- Add new columns to `venues` table (coordinates)
- Add new columns to `match_lineups` table (injury data, positions)
- Create new tables: `knockout_rounds`, `knockout_matches`, `player_injuries`, `match_stats`
- Update the `public_matches` view

### 2. Verify the Migration

After running the migration, verify the new columns exist:
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'matches' 
AND column_name IN ('home_formation', 'away_formation', 'coach_home', 'coach_away', 'weather');
```

### 3. Set Environment Variables (Optional)

For Google Maps integration on venue display:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 4. Add Test Data via CMS

1. Go to CMS > Matches > Select a match
2. Go to the **Details** tab
3. Fill in:
   - Formations (4-4-2, 4-3-3, etc.)
   - Coach names
   - Match officials
   - Weather conditions
4. Click **Save Details**

### 5. Add Lineups via CMS

1. In the CMS Match Control Panel
2. Go to **Lineups** tab
3. Add players from both teams
4. Mark starting XI vs substitutes
5. Save lineups

### 6. Verify on Frontend

1. Navigate to a match detail page: `/matches/[id]`
2. You should see:
   - Formation field map (always visible, with placeholder positions if no lineups)
   - Match officials section (if data exists)
   - Weather conditions (if data exists)
   - Team lineups and substitutes
