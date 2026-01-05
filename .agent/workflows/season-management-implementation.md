---
description: Season Management CMS Module Implementation Plan
---

# Season Management CMS Module - Implementation Plan

## Overview

The Season Management module is a comprehensive feature that centralizes the management of seasons, which are the core organizational unit for league competitions. This module will affect and integrate with:

- **Matches**: All matches must be associated with a season
- **Standings**: Standings are filtered by season and league
- **Top Scorers**: Top scorers are tracked per season
- **Teams**: Teams participate in specific seasons via `season_teams`
- **Players**: Players are registered to teams per season via `season_players`

## Database Schema (Already Migrated)

The following tables exist from the v2.0 migration:

### Core Season Tables
1. **`seasons`**: Main season entity (e.g., "2024/25")
   - `id`, `name`, `slug`, `start_date`, `end_date`
   - `is_current` (only one can be current)
   - `is_archived` (locks previous seasons from edits)
   - `description_en`, `description_am`

2. **`season_teams`**: Team participation in seasons
   - Links `season_id`, `team_id`, `league_id`
   - Tracks promotion/relegation status

3. **`season_players`**: Player registration per season
   - Links `season_id`, `player_id`, `team_id`
   - Tracks `jersey_number` per season, `is_captain`

4. **`season_stats`**: Aggregated season statistics
   - Total matches, goals, cards
   - Champions, relegated/promoted teams

### Related Updates
- `matches.season_id` - Foreign key to seasons
- `standings.season_id` - Foreign key for filtering
- `top_scorers.season_id` - Foreign key for filtering
- `leagues.current_season_id` - Active season for league

## Implementation Tasks

### Phase 1: API Layer ✅ COMPLETE

#### 1.1 CMS Season API Routes ✅ COMPLETE
Created: `app/api/cms/seasons/`

```
app/api/cms/seasons/
├── route.ts              # GET (list), POST (create)
├── [id]/
│   └── route.ts          # GET, PATCH, DELETE
├── [id]/teams/
│   └── route.ts          # GET, POST, DELETE (manage season teams)
├── [id]/players/
│   └── route.ts          # GET, POST, DELETE (manage season players)
└── [id]/set-current/
    └── route.ts          # POST (set as current season)
```

#### 1.2 API Features ✅ COMPLETE
- **GET /api/cms/seasons**: List all seasons with stats
- **POST /api/cms/seasons**: Create new season
- **GET /api/cms/seasons/[id]**: Get season with teams/players
- **PATCH /api/cms/seasons/[id]**: Update season
- **DELETE /api/cms/seasons/[id]**: Delete season (if no matches)
- **POST /api/cms/seasons/[id]/set-current**: Set as current season
- **GET/POST/DELETE /api/cms/seasons/[id]/teams**: Manage season teams
- **GET/POST/DELETE /api/cms/seasons/[id]/players**: Manage season players

### Phase 2: React Query Hooks ✅ COMPLETE

#### 2.1 CMS Hooks ✅ COMPLETE
Created: `lib/hooks/cms/useSeasons.ts`

```typescript
// Hooks implemented:
- useAdminSeasons()      // List all seasons for CMS
- useAdminSeason(id)     // Get single season with relations
- useCreateSeason()      // Create mutation
- useUpdateSeason()      // Update mutation
- useDeleteSeason()      // Delete mutation
- useSetCurrentSeason()  // Set current season mutation

// Season Teams
- useSeasonTeams(seasonId)
- useAddSeasonTeam()
- useRemoveSeasonTeam()

// Season Players
- useSeasonPlayers(seasonId, teamId?)
- useAddSeasonPlayer()
- useRemoveSeasonPlayer()
```

### Phase 3: CMS UI Components ✅ COMPLETE

#### 3.1 Season List Page ✅ COMPLETE
Created: `app/cms/seasons/page.tsx`

Features:
- List all seasons (sorted by date)
- Show status: Current, Active, Archived
- Quick actions: Set Current, Archive, Edit, Delete
- Show team count, match count per season

#### 3.2 Season Detail/Edit Page ✅ COMPLETE
Created: `app/cms/seasons/[id]/page.tsx`

Features:
- Edit season details (name, dates, descriptions)
- Tab-based interface:
  - **Overview**: Stats summary
  - **Teams**: Manage teams in this season
  - **Players**: Manage players (filterable by team)
  - **Matches**: List/link to matches in this season
  - **Standings**: View standings for this season
  - **Settings**: Archive, set current, etc.

#### 3.3 Create Season Page ✅ COMPLETE
Created: `app/cms/seasons/create/page.tsx`

Features:
- Form to create new season
- Auto-generate slug from name
- Option to copy teams from previous season

#### 3.4 Season Components ✅ COMPLETE
Created under: `components/cms/seasons/`

```
components/cms/seasons/
├── SeasonForm.tsx           # Create/Edit form
├── SeasonCard.tsx           # Card for list display
├── SeasonStatusBadge.tsx    # Current/Active/Archived badge
├── SeasonTeamManager.tsx    # Add/remove teams UI
├── SeasonPlayerManager.tsx  # Add/remove players UI
├── SeasonSelector.tsx       # Dropdown for selecting season
└── SeasonStats.tsx          # Stats summary card
```

### Phase 4: Match Module Integration ✅ COMPLETE

#### 4.1 Update Match Form ✅ COMPLETE
File: `components/cms/matches/MatchForm.tsx`

Changes:
- Added **mandatory** season selector at the top
- Filtered league dropdown to show leagues with teams in selected season
- Auto-populated team dropdowns with only teams in the selected season

#### 4.2 Update Match List ✅ COMPLETE
File: `app/cms/matches/page.tsx`

Changes:
- Added season filter dropdown (default to current season)
- Shows season name in match list

### Phase 5: Standings Integration ✅ COMPLETE

#### 5.1 Update Standings Page ✅ COMPLETE
File: `app/cms/standings/page.tsx`

Changes:
- Added season filter (default to current)
- Filtered standings by `season_id` AND `league_id`

#### 5.2 Update Public Standings ✅ COMPLETE
Files: `app/(public)/standings/page.tsx` and league components.

Changes:
- Added `SeasonToggle` in competition headers.
- Integrated `season_id` into `useLeagueStandings` hook.

### Phase 6: Top Scorers Integration ✅ COMPLETE

#### 6.1 Update Top Scorers Page ✅ COMPLETE
Files: `app/cms/top-scorers/page.tsx`

Changes:
- Added season filter
- Ensured top scorers are linked to season

### Phase 7: Sidebar Navigation ✅ COMPLETE

Update: `components/Layout/Layout.tsx`

Added new CMS menu item:
```
{
  name: "Seasons",
  href: "/cms/seasons",
  icon: CalendarDays
}
```

## Additional Features Added

### 1. Global RightColumn Season Selector
Integrated a `SeasonSelector` into the `RightColumn.tsx` component. This allows users to switch between matches/standings of different seasons globally on the homepage.

### 2. Competition Header Toggle
Implemented a robust `SeasonToggle` in the `CompetitionHeader.tsx` which is used across `PremierLeaguePage` and `EthiopianCupPage`. It dynamically filters:
- **MatchesTab**: Shows matches for selected season.
- **TeamsTab**: Shows teams participating in selected season.
- **Standings/Overview**: Updates tables to selected season.

### 3. Match Detail Context
Updated `MatchDetailPage` to automatically fetch the league table for the specific season the match belongs to, ensuring historical accuracy.

## 🏁 Final Status: 100% Complete

1. ✅ Admins can create, edit, delete seasons
2. ✅ Admins can manage which teams participate in each season
3. ✅ Admins can manage player registration per season per team
4. ✅ Match creation requires season selection
5. ✅ Standings are filtered by season
6. ✅ Top scorers are filtered by season
7. ✅ One season can be marked as "current"
8. ✅ Previous seasons can be archived
9. ✅ Public pages default to current season
