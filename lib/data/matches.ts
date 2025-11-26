import { z } from "zod"
import { matchWithRelationsSchema } from "@/lib/schemas/match"

function baseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
  )
}

export async function getMatches() {
  const res = await fetch(`${baseUrl()}/api/matches`, ({ next: { revalidate: 60 } } as any))
  const json = await res.json()
  const normalized = (Array.isArray(json) ? json : []).map((m: any) => ({
    ...m,
    date: m?.date ? new Date(m.date).toISOString() : new Date().toISOString(),
    created_at: m?.created_at ? new Date(m.created_at).toISOString() : new Date().toISOString(),
    updated_at: m?.updated_at ? new Date(m.updated_at).toISOString() : new Date().toISOString(),
  }))
  return z.array(matchWithRelationsSchema).parse(normalized)
}

export async function getMatchesByLeagueSlug(slug: string) {
  const all = await getMatches()
  // Handle different league slug formats
  const leagueMappings: Record<string, string[]> = {
    'premier-league': ['premier-league', 'premier'],
    'league-one': ['league-one', 'league1'],
    'ethiopian-cup': ['ethiopian-cup', 'cup'],
    'higher-league': ['higher-league', 'higher'],
    'walias-u20-pl': ['walias-u20-pl', 'walias-u20', 'u20']
  }
  
  const validSlugs = leagueMappings[slug] || [slug]
  const filtered = all.filter((m) => validSlugs.includes(m.league_slug || ''))
  return filtered
}