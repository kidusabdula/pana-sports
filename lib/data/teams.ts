import { z } from "zod"
import { teamResponseSchema } from "@/lib/schemas/team"

function baseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
  )
}

export async function getTeams() {
  const res = await fetch(`${baseUrl()}/api/teams`, ({ next: { revalidate: 300 } } as any))
  if (!res.ok) {
    throw new Error(`Failed to fetch teams: ${res.status} ${res.statusText}`)
  }
  const json = await res.json()
  const normalized = (Array.isArray(json) ? json : []).map((t: any) => ({
    ...t,
    created_at: t?.created_at ? new Date(t.created_at).toISOString() : new Date().toISOString(),
    updated_at: t?.updated_at ? new Date(t.updated_at).toISOString() : new Date().toISOString(),
  }))
  return z.array(teamResponseSchema).parse(normalized)
}

export async function getTeamsByLeagueSlug(slug: string) {
  const all = await getTeams()
  
  // Handle different league slug formats
  const leagueMappings: Record<string, string[]> = {
    'premier-league': ['premier-league', 'premier'],
    'league-one': ['league-one', 'league1'],
    'ethiopian-cup': ['ethiopian-cup', 'cup'],
    'higher-league': ['higher-league', 'higher'],
    'walias-u20-pl': ['walias-u20-pl', 'walias-u20', 'u20']
  }
  
  const validSlugs = leagueMappings[slug] || [slug]
  const filtered = all.filter((t) => validSlugs.includes(t.league_slug || ''))
  return filtered
}