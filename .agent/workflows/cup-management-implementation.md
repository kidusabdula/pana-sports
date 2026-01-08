---
description: Cup Management CMS Module & Public Pages Implementation Guide for Pana Sports v2.0 Phase 5 Task 4
---

# 🏆 CUP MANAGEMENT MODULE - IMPLEMENTATION WORKFLOW

## 📋 Overview

This workflow implements the comprehensive Cup Management system for Pana Sports v2.0. It includes:

- **CMS Module**: Full CRUD for cups and cup editions
- **Public-Facing Pages**: Cup detail pages with knockout brackets, group stages, and match displays
- **Integration**: With matches, players, top scorers, teams, standings, and seasons
- **Navigation Updates**: New `/cups` route with dedicated navigation

## 📊 Database Schema (Already Created)

The following tables exist from the v2.0 migration (`supabase/migrations/20241231_v2_0_migration.sql`):

### Core Tables
- `cups` - Cup definitions (Ethiopian Cup, Super Cup, etc.)
- `cup_editions` - Yearly cup instances linked to seasons
- `cup_groups` - Group stage groups (for group+knockout format)
- `cup_group_teams` - Teams in groups with standings data

### Modified Tables
- `matches` - Has `cup_edition_id`, `is_cup_match` fields
- `knockout_rounds` - Has `cup_edition_id`, `is_cup_round` fields
- `top_scorers` - Can be filtered by cup edition
- `player_season_stats` - Has `cup_edition_id` for cup-specific stats

---

## 🎯 Implementation Phases

### PHASE 1: CMS Infrastructure
**Estimated complexity: Medium**

#### Task 1.1: Create Cup Types & Schemas

Create `lib/schemas/cup.ts`:
```typescript
import { z } from 'zod';

export const cupCreateSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  name_en: z.string().min(1),
  name_am: z.string().min(1),
  description_en: z.string().optional(),
  description_am: z.string().optional(),
  logo_url: z.string().url().optional().or(z.literal('')),
  cup_type: z.enum(['knockout', 'group_knockout', 'league_cup']).default('knockout'),
  country: z.string().default('Ethiopia'),
  founded_year: z.number().optional(),
  current_holder_team_id: z.string().uuid().optional().nullable(),
  is_active: z.boolean().default(true),
});

export const cupUpdateSchema = cupCreateSchema.partial();

export const cupEditionCreateSchema = z.object({
  cup_id: z.string().uuid(),
  season_id: z.string().uuid(),
  name: z.string().min(1),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  status: z.enum(['upcoming', 'ongoing', 'completed', 'cancelled']).default('upcoming'),
  winner_team_id: z.string().uuid().optional().nullable(),
  runner_up_team_id: z.string().uuid().optional().nullable(),
  total_teams: z.number().default(0),
  has_group_stage: z.boolean().default(false),
  groups_count: z.number().default(0),
});

export const cupEditionUpdateSchema = cupEditionCreateSchema.partial();

export const cupGroupCreateSchema = z.object({
  cup_edition_id: z.string().uuid(),
  name: z.string().min(1), // e.g., "Group A"
});

export const cupGroupTeamCreateSchema = z.object({
  cup_group_id: z.string().uuid(),
  team_id: z.string().uuid(),
});

export type CupCreate = z.infer<typeof cupCreateSchema>;
export type CupUpdate = z.infer<typeof cupUpdateSchema>;
export type CupEditionCreate = z.infer<typeof cupEditionCreateSchema>;
export type CupEditionUpdate = z.infer<typeof cupEditionUpdateSchema>;
export type CupGroupCreate = z.infer<typeof cupGroupCreateSchema>;
export type CupGroupTeamCreate = z.infer<typeof cupGroupTeamCreateSchema>;
```

#### Task 1.2: Create Cup Interfaces

Create `lib/types/cup.ts`:
```typescript
export interface Cup {
  id: string;
  slug: string;
  name_en: string;
  name_am: string;
  description_en?: string;
  description_am?: string;
  logo_url?: string;
  cup_type: 'knockout' | 'group_knockout' | 'league_cup';
  country: string;
  founded_year?: number;
  current_holder_team_id?: string;
  current_holder?: {
    id: string;
    name_en: string;
    name_am: string;
    logo_url?: string;
    slug: string;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CupEdition {
  id: string;
  cup_id: string;
  cup?: Cup;
  season_id: string;
  season?: {
    id: string;
    name: string;
    slug: string;
  };
  name: string;
  start_date?: string;
  end_date?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  winner_team_id?: string;
  winner?: {
    id: string;
    name_en: string;
    name_am: string;
    logo_url?: string;
    slug: string;
  };
  runner_up_team_id?: string;
  runner_up?: {
    id: string;
    name_en: string;
    name_am: string;
    logo_url?: string;
    slug: string;
  };
  total_teams: number;
  has_group_stage: boolean;
  groups_count: number;
  created_at: string;
  updated_at: string;
}

export interface CupGroup {
  id: string;
  cup_edition_id: string;
  name: string;
  teams?: CupGroupTeam[];
  created_at: string;
  updated_at: string;
}

export interface CupGroupTeam {
  id: string;
  cup_group_id: string;
  team_id: string;
  team?: {
    id: string;
    name_en: string;
    name_am: string;
    logo_url?: string;
    slug: string;
  };
  played: number;
  won: number;
  draw: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  gd: number;
  points: number;
  rank: number;
  created_at: string;
  updated_at: string;
}

export interface KnockoutMatch {
  id: string;
  round_name: string; // e.g., "Round of 16", "Quarter-finals", "Semi-finals", "Final"
  match_number: number;
  home_team?: {
    id: string;
    name_en: string;
    name_am: string;
    logo_url?: string;
    slug: string;
  };
  away_team?: {
    id: string;
    name_en: string;
    name_am: string;
    logo_url?: string;
    slug: string;
  };
  home_score?: number;
  away_score?: number;
  home_penalty_score?: number;
  away_penalty_score?: number;
  home_aggregate?: number;
  away_aggregate?: number;
  is_two_legged: boolean;
  first_leg_match_id?: string;
  second_leg_match_id?: string;
  winner_team_id?: string;
  date?: string;
  venue?: string;
  status: string;
}

export type CupRoundName = 
  | 'Preliminary Round'
  | 'First Round'
  | 'Round of 64'
  | 'Round of 32'
  | 'Round of 16'
  | 'Quarter-finals'
  | 'Semi-finals'
  | 'Third Place'
  | 'Final';
```

#### Task 1.3: Create CMS Cup Hooks

Create `lib/hooks/cms/useCups.ts`:
```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Cup, CupEdition, CupGroup, CupGroupTeam } from '@/lib/types/cup';
import { CupCreate, CupUpdate, CupEditionCreate, CupEditionUpdate } from '@/lib/schemas/cup';

// Query keys
export const cupKeys = {
  all: ['cms', 'cups'] as const,
  list: () => [...cupKeys.all, 'list'] as const,
  detail: (id: string) => [...cupKeys.all, 'detail', id] as const,
  editions: (cupId: string) => [...cupKeys.all, cupId, 'editions'] as const,
  edition: (editionId: string) => [...cupKeys.all, 'edition', editionId] as const,
  groups: (editionId: string) => [...cupKeys.all, 'edition', editionId, 'groups'] as const,
  matches: (editionId: string) => [...cupKeys.all, 'edition', editionId, 'matches'] as const,
  bracket: (editionId: string) => [...cupKeys.all, 'edition', editionId, 'bracket'] as const,
};

// Fetch all cups
export function useCups() {
  return useQuery<Cup[]>({
    queryKey: cupKeys.list(),
    queryFn: async () => {
      const res = await fetch('/api/cms/cups');
      if (!res.ok) throw new Error('Failed to fetch cups');
      return res.json();
    },
  });
}

// Fetch single cup
export function useCup(id: string) {
  return useQuery<Cup>({
    queryKey: cupKeys.detail(id),
    queryFn: async () => {
      const res = await fetch(`/api/cms/cups/${id}`);
      if (!res.ok) throw new Error('Failed to fetch cup');
      return res.json();
    },
    enabled: !!id,
  });
}

// Create cup
export function useCreateCup() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CupCreate) => {
      const res = await fetch('/api/cms/cups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create cup');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cupKeys.all });
    },
  });
}

// Update cup
export function useUpdateCup() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CupUpdate }) => {
      const res = await fetch(`/api/cms/cups/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update cup');
      }
      return res.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: cupKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: cupKeys.list() });
    },
  });
}

// Delete cup
export function useDeleteCup() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/cms/cups/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete cup');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cupKeys.all });
    },
  });
}

// ========== Cup Editions ==========

// Fetch editions for a cup
export function useCupEditions(cupId: string) {
  return useQuery<CupEdition[]>({
    queryKey: cupKeys.editions(cupId),
    queryFn: async () => {
      const res = await fetch(`/api/cms/cups/${cupId}/editions`);
      if (!res.ok) throw new Error('Failed to fetch cup editions');
      return res.json();
    },
    enabled: !!cupId,
  });
}

// Fetch single edition
export function useCupEdition(editionId: string) {
  return useQuery<CupEdition>({
    queryKey: cupKeys.edition(editionId),
    queryFn: async () => {
      const res = await fetch(`/api/cms/cup-editions/${editionId}`);
      if (!res.ok) throw new Error('Failed to fetch cup edition');
      return res.json();
    },
    enabled: !!editionId,
  });
}

// Create edition
export function useCreateCupEdition() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CupEditionCreate) => {
      const res = await fetch('/api/cms/cup-editions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create cup edition');
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: cupKeys.editions(variables.cup_id) });
    },
  });
}

// Update edition
export function useUpdateCupEdition() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CupEditionUpdate }) => {
      const res = await fetch(`/api/cms/cup-editions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update cup edition');
      }
      return res.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: cupKeys.edition(id) });
    },
  });
}

// Delete edition
export function useDeleteCupEdition() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/cms/cup-editions/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete cup edition');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cupKeys.all });
    },
  });
}

// ========== Cup Groups ==========

// Fetch groups for an edition
export function useCupGroups(editionId: string) {
  return useQuery<CupGroup[]>({
    queryKey: cupKeys.groups(editionId),
    queryFn: async () => {
      const res = await fetch(`/api/cms/cup-editions/${editionId}/groups`);
      if (!res.ok) throw new Error('Failed to fetch cup groups');
      return res.json();
    },
    enabled: !!editionId,
  });
}

// Create group
export function useCreateCupGroup() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { cup_edition_id: string; name: string }) => {
      const res = await fetch(`/api/cms/cup-editions/${data.cup_edition_id}/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create group');
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: cupKeys.groups(variables.cup_edition_id) });
    },
  });
}

// Add team to group
export function useAddTeamToGroup() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { cup_group_id: string; team_id: string; cup_edition_id: string }) => {
      const res = await fetch(`/api/cms/cup-groups/${data.cup_group_id}/teams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team_id: data.team_id }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to add team to group');
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: cupKeys.groups(variables.cup_edition_id) });
    },
  });
}

// Remove team from group
export function useRemoveTeamFromGroup() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { cup_group_id: string; team_id: string; cup_edition_id: string }) => {
      const res = await fetch(`/api/cms/cup-groups/${data.cup_group_id}/teams/${data.team_id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to remove team from group');
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: cupKeys.groups(variables.cup_edition_id) });
    },
  });
}
```

---

### PHASE 2: CMS API Routes

#### Task 2.1: Cups CRUD API

Create `app/api/cms/cups/route.ts`:
```typescript
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { cupCreateSchema } from '@/lib/schemas/cup';

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('cups')
      .select(`
        *,
        current_holder:teams!cups_current_holder_fkey(
          id, name_en, name_am, logo_url, slug
        )
      `)
      .order('name_en');

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching cups:', error);
    return NextResponse.json({ error: 'Failed to fetch cups' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const validated = cupCreateSchema.parse(body);
    
    const { data, error } = await supabase
      .from('cups')
      .insert(validated)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating cup:', error);
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: error }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create cup' }, { status: 500 });
  }
}
```

Create `app/api/cms/cups/[id]/route.ts`:
```typescript
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { cupUpdateSchema } from '@/lib/schemas/cup';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('cups')
      .select(`
        *,
        current_holder:teams!cups_current_holder_fkey(
          id, name_en, name_am, logo_url, slug
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: 'Cup not found' }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching cup:', error);
    return NextResponse.json({ error: 'Failed to fetch cup' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const body = await request.json();
    
    const validated = cupUpdateSchema.parse(body);
    
    const { data, error } = await supabase
      .from('cups')
      .update({ ...validated, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating cup:', error);
    return NextResponse.json({ error: 'Failed to update cup' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('cups')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting cup:', error);
    return NextResponse.json({ error: 'Failed to delete cup' }, { status: 500 });
  }
}
```

#### Task 2.2: Cup Editions API

Create `app/api/cms/cups/[id]/editions/route.ts`:
```typescript
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('cup_editions')
      .select(`
        *,
        season:seasons(id, name, slug),
        winner:teams!cup_editions_winner_fkey(id, name_en, name_am, logo_url, slug),
        runner_up:teams!cup_editions_runner_up_fkey(id, name_en, name_am, logo_url, slug)
      `)
      .eq('cup_id', id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching cup editions:', error);
    return NextResponse.json({ error: 'Failed to fetch cup editions' }, { status: 500 });
  }
}
```

Create `app/api/cms/cup-editions/route.ts`:
```typescript
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { cupEditionCreateSchema } from '@/lib/schemas/cup';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const validated = cupEditionCreateSchema.parse(body);
    
    const { data, error } = await supabase
      .from('cup_editions')
      .insert(validated)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating cup edition:', error);
    return NextResponse.json({ error: 'Failed to create cup edition' }, { status: 500 });
  }
}
```

Create `app/api/cms/cup-editions/[id]/route.ts`:
```typescript
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { cupEditionUpdateSchema } from '@/lib/schemas/cup';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('cup_editions')
      .select(`
        *,
        cup:cups(*),
        season:seasons(id, name, slug),
        winner:teams!cup_editions_winner_fkey(id, name_en, name_am, logo_url, slug),
        runner_up:teams!cup_editions_runner_up_fkey(id, name_en, name_am, logo_url, slug)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching cup edition:', error);
    return NextResponse.json({ error: 'Failed to fetch cup edition' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const body = await request.json();
    
    const validated = cupEditionUpdateSchema.parse(body);
    
    const { data, error } = await supabase
      .from('cup_editions')
      .update({ ...validated, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating cup edition:', error);
    return NextResponse.json({ error: 'Failed to update cup edition' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('cup_editions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting cup edition:', error);
    return NextResponse.json({ error: 'Failed to delete cup edition' }, { status: 500 });
  }
}
```

#### Task 2.3: Cup Groups API

Create `app/api/cms/cup-editions/[id]/groups/route.ts`:
```typescript
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('cup_groups')
      .select(`
        *,
        teams:cup_group_teams(
          *,
          team:teams(id, name_en, name_am, logo_url, slug)
        )
      `)
      .eq('cup_edition_id', id)
      .order('name');

    if (error) throw error;
    
    // Sort teams within each group by rank/points
    const sortedData = data?.map(group => ({
      ...group,
      teams: group.teams?.sort((a, b) => b.points - a.points || b.gd - a.gd)
    }));
    
    return NextResponse.json(sortedData);
  } catch (error) {
    console.error('Error fetching cup groups:', error);
    return NextResponse.json({ error: 'Failed to fetch cup groups' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('cup_groups')
      .insert({ cup_edition_id: id, name: body.name })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating cup group:', error);
    return NextResponse.json({ error: 'Failed to create cup group' }, { status: 500 });
  }
}
```

Create `app/api/cms/cup-groups/[id]/teams/route.ts`:
```typescript
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('cup_group_teams')
      .insert({ cup_group_id: id, team_id: body.team_id })
      .select(`
        *,
        team:teams(id, name_en, name_am, logo_url, slug)
      `)
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error adding team to group:', error);
    return NextResponse.json({ error: 'Failed to add team to group' }, { status: 500 });
  }
}
```

Create `app/api/cms/cup-groups/[id]/teams/[teamId]/route.ts`:
```typescript
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; teamId: string }> }
) {
  try {
    const { id, teamId } = await params;
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('cup_group_teams')
      .delete()
      .eq('cup_group_id', id)
      .eq('team_id', teamId);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing team from group:', error);
    return NextResponse.json({ error: 'Failed to remove team from group' }, { status: 500 });
  }
}
```

---

### PHASE 3: CMS Pages

#### Task 3.1: Cups List Page

Create `app/cms/cups/page.tsx`:
- Display all cups in a card grid
- Show cup logo, name, type, and current holder
- Action buttons: View/Edit/Delete
- Add New Cup button

#### Task 3.2: Create Cup Page

Create `app/cms/cups/create/page.tsx`:
- Form with all cup fields
- Team selector for current holder
- Image upload for logo

#### Task 3.3: Cup Detail Page

Create `app/cms/cups/[id]/page.tsx`:
- Display cup information
- List all editions
- Quick stats (total editions, total matches)
- Action buttons: Edit/Add Edition

#### Task 3.4: Cup Edit Page

Create `app/cms/cups/[id]/edit/page.tsx`:
- Pre-filled form for editing
- Same structure as create page

#### Task 3.5: Cup Edition Detail Page

Create `app/cms/cup-editions/[id]/page.tsx`:
- Edition details
- Group management (if has_group_stage)
- Knockout round management
- Matches list
- Bracket preview

---

### PHASE 4: Public API Routes

#### Task 4.1: Public Cups API

Create `app/api/public/cups/route.ts`:
```typescript
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('cups')
      .select(`
        *,
        current_holder:teams!cups_current_holder_fkey(
          id, name_en, name_am, logo_url, slug
        )
      `)
      .eq('is_active', true)
      .order('name_en');

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching cups:', error);
    return NextResponse.json({ error: 'Failed to fetch cups' }, { status: 500 });
  }
}
```

Create `app/api/public/cups/[slug]/route.ts`:
```typescript
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createClient();
    
    // Fetch cup with current edition
    const { data: cup, error: cupError } = await supabase
      .from('cups')
      .select(`
        *,
        current_holder:teams!cups_current_holder_fkey(
          id, name_en, name_am, logo_url, slug
        )
      `)
      .eq('slug', slug)
      .single();

    if (cupError) throw cupError;
    if (!cup) {
      return NextResponse.json({ error: 'Cup not found' }, { status: 404 });
    }
    
    // Fetch current/latest edition
    const { data: editions } = await supabase
      .from('cup_editions')
      .select(`
        *,
        season:seasons(id, name, slug),
        winner:teams!cup_editions_winner_fkey(id, name_en, name_am, logo_url, slug),
        runner_up:teams!cup_editions_runner_up_fkey(id, name_en, name_am, logo_url, slug)
      `)
      .eq('cup_id', cup.id)
      .order('created_at', { ascending: false });
    
    return NextResponse.json({
      ...cup,
      editions: editions || [],
      current_edition: editions?.find(e => e.status === 'ongoing') || editions?.[0] || null,
    });
  } catch (error) {
    console.error('Error fetching cup:', error);
    return NextResponse.json({ error: 'Failed to fetch cup' }, { status: 500 });
  }
}
```

#### Task 4.2: Cup Edition & Bracket API

Create `app/api/public/cup-editions/[id]/route.ts`:
- Full edition details with groups and bracket

Create `app/api/public/cup-editions/[id]/bracket/route.ts`:
- Knockout bracket data for visualization

Create `app/api/public/cup-editions/[id]/matches/route.ts`:
- All matches for the edition

---

### PHASE 5: Public Hooks

#### Task 5.1: Create Public Cup Hooks

Create `lib/hooks/public/useCups.ts`:
```typescript
import { useQuery } from '@tanstack/react-query';
import { Cup, CupEdition, CupGroup } from '@/lib/types/cup';

interface CupWithEditions extends Cup {
  editions: CupEdition[];
  current_edition: CupEdition | null;
}

export function useCups() {
  return useQuery<Cup[]>({
    queryKey: ['cups'],
    queryFn: async () => {
      const res = await fetch('/api/public/cups');
      if (!res.ok) throw new Error('Failed to fetch cups');
      return res.json();
    },
  });
}

export function useCup(slug: string) {
  return useQuery<CupWithEditions>({
    queryKey: ['cups', slug],
    queryFn: async () => {
      const res = await fetch(`/api/public/cups/${slug}`);
      if (!res.ok) throw new Error('Failed to fetch cup');
      return res.json();
    },
    enabled: !!slug,
  });
}

export function useCupEdition(id: string) {
  return useQuery<CupEdition & { groups: CupGroup[] }>({
    queryKey: ['cup-editions', id],
    queryFn: async () => {
      const res = await fetch(`/api/public/cup-editions/${id}`);
      if (!res.ok) throw new Error('Failed to fetch cup edition');
      return res.json();
    },
    enabled: !!id,
  });
}

export function useCupBracket(editionId: string) {
  return useQuery({
    queryKey: ['cup-editions', editionId, 'bracket'],
    queryFn: async () => {
      const res = await fetch(`/api/public/cup-editions/${editionId}/bracket`);
      if (!res.ok) throw new Error('Failed to fetch bracket');
      return res.json();
    },
    enabled: !!editionId,
  });
}

export function useCupMatches(editionId: string, options?: { round?: string; status?: string }) {
  return useQuery({
    queryKey: ['cup-editions', editionId, 'matches', options],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options?.round) params.set('round', options.round);
      if (options?.status) params.set('status', options.status);
      
      const res = await fetch(`/api/public/cup-editions/${editionId}/matches?${params}`);
      if (!res.ok) throw new Error('Failed to fetch matches');
      return res.json();
    },
    enabled: !!editionId,
  });
}
```

---

### PHASE 6: Public Cup Pages

#### Task 6.1: Cups List Page

Create `app/cups/page.tsx`:
- List all active cups
- Card design with cup logo, name, current holder
- Link to each cup's detail page

#### Task 6.2: Cup Detail Page

Create `app/cups/[slug]/page.tsx`:
- Cup information header
- Edition selector (if multiple editions)
- Tabs: Overview, Matches, Bracket, Groups (if applicable), Teams, Top Scorers
- Uses CompetitionHeader with cup-specific styling

#### Task 6.3: Cup Match Detail Page

Create `app/cups/[slug]/matches/[matchId]/page.tsx`:
- Full match detail view for cup matches
- Shows round info, aggregate scores if applicable
- Same features as league match detail

---

### PHASE 7: Cup Components

#### Task 7.1: Knockout Bracket Component

Create `components/cups/KnockoutBracket.tsx`:
```typescript
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { KnockoutMatch, CupRoundName } from "@/lib/types/cup";

interface BracketProps {
  rounds: {
    name: CupRoundName;
    matches: KnockoutMatch[];
  }[];
  cupSlug: string;
}

export default function KnockoutBracket({ rounds, cupSlug }: BracketProps) {
  // Responsive bracket visualization
  // Shows teams, scores, and winners
  // Links to match detail pages
  // Handles aggregate scores for two-legged ties
  // ...implementation details
}
```

Key features:
- Visual bracket lines connecting matches
- Team logos and names
- Score display (with aggregate for 2-legged ties)
- Penalty shootout results
- Winner highlighting
- Responsive design (horizontal scroll on mobile)
- Links to match detail pages

#### Task 7.2: Group Stage Table

Create `components/cups/CupGroupTable.tsx`:
- Displays single group standings
- Team logo, name, P, W, D, L, GF, GA, GD, PTS
- Qualification highlighting (top 2 advance)
- Click to view team detail

Create `components/cups/GroupStageDisplay.tsx`:
- Container for all groups
- Grid layout for multiple groups
- Uses CupGroupTable for each group

#### Task 7.3: Cup Page Components

Create `components/cups/CupHeader.tsx`:
- Cup-specific header with trophy icon
- Edition selector dropdown
- Status badge (Ongoing/Completed)

Create `components/cups/CupOverviewTab.tsx`:
- Current round display
- Upcoming matches
- Recent results
- Group standings (if applicable)
- Top scorers preview

Create `components/cups/CupMatchesTab.tsx`:
- Matches grouped by round
- Filter by round name
- Match cards with cup-specific styling

Create `components/cups/CupBracketTab.tsx`:
- Full knockout bracket visualization
- Uses KnockoutBracket component

#### Task 7.4: Shared Match Card Enhancement

Update `components/matches/MatchCard.tsx`:
- Add cup match indicator
- Show round name for cup matches
- Display aggregate scores when applicable

---

### PHASE 8: Navigation Updates

#### Task 8.1: Update Navbar

Modify `components/shared/navbar.tsx`:

1. Add "Cups" to the League dropdown:
```typescript
{
  label: t.league,
  type: "dropdown",
  items: [
    { href: "/premier-league", label: t.pl },
    { href: "/cups", label: t.cups }, // New cups route
    { href: "/higher-league", label: t.hl },
    { href: "/league-one", label: t.lo },
    { href: "/womens-league", label: t.womens },
  ],
}
```

2. Add label translations:
```typescript
// English
cups: "Cups",

// Amharic
cups: "ዋንጫዎች",
```

3. Update `isCompetitionPage` check:
```typescript
const isCompetitionPage = [
  "/premier-league",
  "/higher-league",
  "/league-one",
  "/womens-league",
  "/cups",  // Add this
  "/matches",
  "/live",
].some((path) => pathname.startsWith(path));
```

#### Task 8.2: Redirect Ethiopian Cup

Create redirect from `/ethiopian-cup` to `/cups/ethiopian-cup`:
- Add redirect in `next.config.js` or create redirect page
- Maintain backwards compatibility

---

### PHASE 9: Integration with Existing Modules

#### Task 9.1: Match Module Integration

Update match hooks and APIs to support cup matches:
- Add `cup_edition_id` filter
- Add `is_cup_match` filter
- Include round name in match data

Update CMS match form:
- Add "Is Cup Match" toggle
- Cup edition selector
- Round name selector

#### Task 9.2: Player Stats Integration

Update player stats to include cup statistics:
- Filter by competition type (league/cup)
- Display cup goals/assists separately
- Career cup stats aggregation

#### Task 9.3: Top Scorers Integration

Update top scorers for cups:
- Create cup-specific top scorers endpoint
- Display in cup detail page
- Include in player profiles

#### Task 9.4: RightColumn Integration

Update `components/shared/RightColumn.tsx`:
- Include cup matches in "Upcoming Matches"
- Show cup match indicator

---

## 📋 Implementation Checklist

### Phase 1: CMS Infrastructure
- [x] Create `lib/schemas/cup.ts`
- [x] Create `lib/types/cup.ts`
- [x] Create `lib/hooks/cms/useCups.ts`

### Phase 2: CMS API Routes
- [x] Create `app/api/cms/cups/route.ts`
- [x] Create `app/api/cms/cups/[id]/route.ts`
- [x] Create `app/api/cms/cups/[id]/editions/route.ts`
- [x] Create `app/api/cms/cup-editions/route.ts`
- [x] Create `app/api/cms/cup-editions/[id]/route.ts`
- [x] Create `app/api/cms/cup-editions/[id]/groups/route.ts`
- [x] Create `app/api/cms/cup-groups/[id]/teams/route.ts`
- [x] Create `app/api/cms/cup-groups/[id]/teams/[teamId]/route.ts`

### Phase 3: CMS Pages
- [x] Create `app/cms/cups/page.tsx`
- [x] Create `app/cms/cups/create/page.tsx`
- [x] Create `app/cms/cups/[id]/page.tsx`
- [x] Create `app/cms/cups/[id]/edit/page.tsx`
- [x] Create `app/cms/cup-editions/[id]/page.tsx`
- [x] Create CMS cup components (CupCard, CupForm, CupEditionForm, CupGroupManager)

### Phase 4: Public API Routes
- [x] Create `app/api/public/cups/route.ts`
- [x] Create `app/api/public/cups/[slug]/route.ts`
- [x] Create `app/api/public/cup-editions/[id]/route.ts`
- [ ] Create `app/api/public/cup-editions/[id]/bracket/route.ts` (placeholder created)
- [x] Create `app/api/public/cup-editions/[id]/matches/route.ts`

### Phase 5: Public Hooks
- [x] Create `lib/hooks/public/useCups.ts`

### Phase 6: Public Cup Pages
- [x] Create `app/cups/page.tsx`
- [x] Create `app/cups/[slug]/page.tsx`
- [ ] Create `app/cups/[slug]/matches/[matchId]/page.tsx` (uses existing match detail)

### Phase 7: Cup Components
- [x] Create `components/cups/CupBracket.tsx` (placeholder)
- [x] Create `components/cups/CupGroupStage.tsx` (was named CupGroupTable)
- [ ] Create `components/cups/GroupStageDisplay.tsx` (integrated into CupGroupStage)
- [ ] Create `components/cups/CupHeader.tsx` (using inline header)
- [ ] Create `components/cups/CupOverviewTab.tsx` (integrated into CupDetailPage)
- [x] Create `components/cups/CupMatchesList.tsx`
- [ ] Create `components/cups/CupBracketTab.tsx` (part of CupBracket)

### Phase 8: Navigation Updates
- [x] Update `components/shared/navbar.tsx`
- [x] Create redirect for `/ethiopian-cup`
- [x] Update CMS sidebar

### Phase 9: Integration (PENDING)
- [ ] Update match module for cup support
- [ ] Update player stats
- [ ] Update top scorers
- [ ] Update RightColumn

---

## 🔄 Cross-Chat Handoff Template

When starting a new chat for this task:

```
I'm continuing Pana Sports v2.0 Cup Management implementation.

Reference: /.agent/workflows/cup-management-implementation.md

Current Phase: [Phase X]
Last Completed: [Last completed task]
Next Task: [Next task to implement]

Any blockers: [YES/NO - describe if yes]

Key files created so far:
- [List files created]
```

---

## 📝 Notes

1. The database schema already exists from the v2.0 migration
2. The Ethiopian Cup currently uses the leagues table - will need data migration
3. Knockout bracket visualization should work for various bracket sizes (16, 32, 64 teams)
4. Group stage + knockout hybrid format is common for Ethiopian Cup
5. Two-legged ties with aggregate scores need special handling
6. Consider mobile-first design for bracket view
