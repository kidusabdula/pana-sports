export interface Cup {
  id: string;
  slug: string;
  name_en: string;
  name_am: string;
  description_en?: string;
  description_am?: string;
  logo_url?: string;
  cup_type: "knockout" | "group_knockout" | "league_cup";
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
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
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
  | "Preliminary Round"
  | "First Round"
  | "Round of 64"
  | "Round of 32"
  | "Round of 16"
  | "Quarter-finals"
  | "Semi-finals"
  | "Third Place"
  | "Final";
