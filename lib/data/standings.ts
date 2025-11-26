import { z } from "zod"
import { standingResponseSchema } from "@/lib/schemas/standing"

function baseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
  )
}

export async function getStandings() {
  const res = await fetch(`${baseUrl()}/api/standings`, ({ next: { revalidate: 30 } } as any))
  if (!res.ok) {
    throw new Error(`Failed to fetch standings: ${res.status} ${res.statusText}`)
  }
  const json = await res.json()
  const normalized = (Array.isArray(json) ? json : []).map((s: any) => ({
    ...s,
    created_at: s?.created_at ? new Date(s.created_at).toISOString() : new Date().toISOString(),
    updated_at: s?.updated_at ? new Date(s.updated_at).toISOString() : new Date().toISOString(),
  }))
  return z.array(standingResponseSchema).parse(normalized)
}

export async function getStandingsByLeagueSlug(slug: string) {
  const all = await getStandings()
  
  // Handle different league slug formats
  const leagueMappings: Record<string, string[]> = {
    'premier-league': ['premier-league', 'premier'],
    'league-one': ['league-one', 'league1'],
    'ethiopian-cup': ['ethiopian-cup', 'cup'],
    'higher-league': ['higher-league', 'higher'],
    'walias-u20-pl': ['walias-u20-pl', 'walias-u20', 'u20']
  }
  
  const validSlugs = leagueMappings[slug] || [slug]
  const filtered = all.filter((s) => validSlugs.includes(s.league_slug || ''))
  return filtered
}