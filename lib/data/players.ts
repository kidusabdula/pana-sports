import { z } from "zod"
import { playerResponseSchema } from "@/lib/schemas/player"

function baseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
  )
}

export async function getPlayers() {
  const res = await fetch(`${baseUrl()}/api/players`, ({ next: { revalidate: 300 } } as any))
  const json = await res.json()
  const normalized = (Array.isArray(json) ? json : []).map((p: any) => ({
    ...p,
    dob: p?.dob ? new Date(p.dob).toISOString() : undefined,
    created_at: p?.created_at ? new Date(p.created_at).toISOString() : new Date().toISOString(),
    updated_at: p?.updated_at ? new Date(p.updated_at).toISOString() : new Date().toISOString(),
  }))
  return z.array(playerResponseSchema).parse(normalized)
}

export async function getPlayersByLeagueSlug(slug: string) {
  const [playersRes, teamsRes] = await Promise.all([
    getPlayers(),
    fetch(`${baseUrl()}/api/teams`, ({ next: { revalidate: 300 } } as any)).then((r) => r.json()),
  ])
  const teams = Array.isArray(teamsRes) ? teamsRes : []
  const leagueTeamSlugs = new Set(teams.filter((t: any) => t.league_slug === slug).map((t: any) => t.slug))
  return playersRes.filter((p: any) => leagueTeamSlugs.has(p.team_slug))
}