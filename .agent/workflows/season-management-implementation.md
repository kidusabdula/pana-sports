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

### Phase 1: API Layer

#### 1.1 CMS Season API Routes
Create: `app/api/cms/seasons/`

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

#### 1.2 API Features
- **GET /api/cms/seasons**: List all seasons with stats
- **POST /api/cms/seasons**: Create new season
- **GET /api/cms/seasons/[id]**: Get season with teams/players
- **PATCH /api/cms/seasons/[id]**: Update season
- **DELETE /api/cms/seasons/[id]**: Delete season (if no matches)
- **POST /api/cms/seasons/[id]/set-current**: Set as current season
- **GET/POST/DELETE /api/cms/seasons/[id]/teams**: Manage season teams
- **GET/POST/DELETE /api/cms/seasons/[id]/players**: Manage season players

### Phase 2: React Query Hooks

#### 2.1 CMS Hooks
Create: `lib/hooks/cms/useSeasons.ts`

```typescript
// Hooks to implement:
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

### Phase 3: CMS UI Components

#### 3.1 Season List Page
Create: `app/cms/seasons/page.tsx`

Features:
- List all seasons (sorted by date)
- Show status: Current, Active, Archived
- Quick actions: Set Current, Archive, Edit, Delete
- Show team count, match count per season

#### 3.2 Season Detail/Edit Page
Create: `app/cms/seasons/[id]/page.tsx`

Features:
- Edit season details (name, dates, descriptions)
- Tab-based interface:
  - **Overview**: Stats summary
  - **Teams**: Manage teams in this season
  - **Players**: Manage players (filterable by team)
  - **Matches**: List/link to matches in this season
  - **Standings**: View standings for this season
  - **Settings**: Archive, set current, etc.

#### 3.3 Create Season Page
Create: `app/cms/seasons/create/page.tsx`

Features:
- Form to create new season
- Auto-generate slug from name
- Option to copy teams from previous season

#### 3.4 Season Components
Create under: `components/cms/seasons/`

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

### Phase 4: Match Module Integration

#### 4.1 Update Match Form
File: `components/cms/matches/MatchForm.tsx`

Changes:
- Add **mandatory** season selector at the top
- Filter league dropdown to show leagues with teams in selected season
- Auto-populate team dropdowns with only teams in the selected season

#### 4.2 Update Match List
File: `app/cms/matches/page.tsx`

Changes:
- Add season filter dropdown (default to current season)
- Show season name in match list

### Phase 5: Standings Integration

#### 5.1 Update Standings Page
File: `app/cms/standings/page.tsx`

Changes:
- Add season filter (default to current)
- Filter standings by `season_id` AND `league_id`

#### 5.2 Update Public Standings
Files: `app/(public)/standings/page.tsx`

Changes:
- Add season selector in public view
- Default to current season

### Phase 6: Top Scorers Integration

#### 6.1 Update Top Scorers Page
Files: `app/cms/top-scorers/page.tsx`

Changes:
- Add season filter
- Ensure top scorers are linked to season

### Phase 7: Sidebar Navigation

Update: `components/Layout/Layout.tsx`

Add new CMS menu item:
```
{
  name: "Seasons",
  href: "/cms/seasons",
  icon: CalendarDays
}
```

## Additional Considerations

### 1. Season Creation Workflow
When creating a new season:
1. Admin enters season name (e.g., "2024/25")
2. Auto-generate slug (e.g., "2024-25")
3. Set start/end dates
4. Option to "Copy from previous season":
   - Copies all teams from selected previous season
   - Optionally copies players as well

### 2. Setting Current Season
When setting a season as current:
1. Unset any existing current season
2. Update `leagues.current_season_id` for all leagues
3. This affects what the public site shows by default

### 3. Archiving a Season
When archiving a season:
1. Set `is_archived = true`
2. Prevent new matches from being created in this season
3. Standings become read-only
4. Keep data viewable for historical purposes

### 4. Team Management in Season
- Show all available teams
- Allow adding/removing teams to/from season
- Track which league each team participates in
- Support promotion/relegation notes

### 5. Player Management in Season
- Filter by team
- Allow bulk operations
- Track jersey numbers per season (can differ from player's default)
- Mark team captains per season

### 6. Data Validation
- Cannot delete a season with matches
- Cannot remove a team from season if it has matches
- Cannot set start_date after end_date
- Ensure league is specified when adding team to season

## File Creation Order

1. **API Routes** (in order):
   - `app/api/cms/seasons/route.ts`
   - `app/api/cms/seasons/[id]/route.ts`
   - `app/api/cms/seasons/[id]/teams/route.ts`
   - `app/api/cms/seasons/[id]/players/route.ts`
   - `app/api/cms/seasons/[id]/set-current/route.ts`

2. **Hooks**:
   - `lib/hooks/cms/useSeasons.ts`

3. **Components** (in order):
   - `components/cms/seasons/SeasonStatusBadge.tsx`
   - `components/cms/seasons/SeasonSelector.tsx`
   - `components/cms/seasons/SeasonForm.tsx`
   - `components/cms/seasons/SeasonTeamManager.tsx`
   - `components/cms/seasons/SeasonPlayerManager.tsx`
   - `components/cms/seasons/SeasonCard.tsx`
   - `components/cms/seasons/SeasonStats.tsx`

4. **Pages**:
   - `app/cms/seasons/page.tsx`
   - `app/cms/seasons/create/page.tsx`
   - `app/cms/seasons/[id]/page.tsx`

5. **Integration Updates**:
   - Update `components/cms/matches/MatchForm.tsx`
   - Update `app/cms/matches/page.tsx`
   - Update `app/cms/standings/page.tsx`
   - Update `app/cms/top-scorers/page.tsx`
   - Update `components/Layout/Layout.tsx`

## Estimated Effort

- **Phase 1 (API)**: 2-3 hours
- **Phase 2 (Hooks)**: 1-2 hours
- **Phase 3 (UI)**: 4-6 hours
- **Phase 4-6 (Integration)**: 2-3 hours
- **Phase 7 (Navigation)**: 15 minutes

**Total**: ~10-15 hours

## Success Criteria

1. ✅ Admins can create, edit, delete seasons
2. ✅ Admins can manage which teams participate in each season
3. ✅ Admins can manage player registration per season per team
4. ✅ Match creation requires season selection
5. ✅ Standings are filtered by season
6. ✅ Top scorers are filtered by season
7. ✅ One season can be marked as "current"
8. ✅ Previous seasons can be archived
9. ✅ Public pages default to current season

---

**Ready to proceed with implementation. Start with Phase 1: API Routes.**
