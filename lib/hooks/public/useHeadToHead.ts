// lib/hooks/public/useHeadToHead.ts
import { useQuery } from "@tanstack/react-query";

export type HeadToHeadMatch = {
  id: string;
  date: string;
  status: string;
  score_home: number;
  score_away: number;
  home_team: {
    id: string;
    name_en: string;
    logo_url: string | null;
  };
  away_team: {
    id: string;
    name_en: string;
    logo_url: string | null;
  };
  league: {
    id: string;
    name_en: string;
  };
};

export type HeadToHeadStats = {
  totalMatches: number;
  homeWins: number;
  awayWins: number;
  draws: number;
  homeGoals: number;
  awayGoals: number;
};

export type HeadToHeadResponse = {
  matches: HeadToHeadMatch[];
  stats: HeadToHeadStats;
};

async function fetchHeadToHead(
  homeTeamId: string,
  awayTeamId: string,
  limit: number = 5
) {
  const res = await fetch(
    `/api/public/matches/head-to-head?home_team_id=${homeTeamId}&away_team_id=${awayTeamId}&limit=${limit}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch head-to-head data");
  }
  return res.json() as Promise<HeadToHeadResponse>;
}

export function useHeadToHead(
  homeTeamId: string,
  awayTeamId: string,
  limit: number = 5
) {
  return useQuery({
    queryKey: ["head-to-head", homeTeamId, awayTeamId, limit],
    queryFn: () => fetchHeadToHead(homeTeamId, awayTeamId, limit),
    enabled: !!homeTeamId && !!awayTeamId,
    staleTime: 60000, // 1 minute
  });
}

// Hook for fetching team's recent form
export type TeamForm = {
  matchId: string;
  result: "W" | "D" | "L";
  score: string;
  opponent: string;
  date: string;
};

async function fetchTeamForm(teamId: string, limit: number = 5) {
  const res = await fetch(`/api/public/teams/${teamId}/form?limit=${limit}`);
  if (!res.ok) {
    throw new Error("Failed to fetch team form");
  }
  return res.json() as Promise<TeamForm[]>;
}

export function useTeamForm(teamId: string, limit: number = 5) {
  return useQuery({
    queryKey: ["team-form", teamId, limit],
    queryFn: () => fetchTeamForm(teamId, limit),
    enabled: !!teamId,
    staleTime: 60000,
  });
}
