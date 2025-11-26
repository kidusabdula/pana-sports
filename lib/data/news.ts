import { z } from "zod"
import { newsWithRelationsSchema } from "@/lib/schemas/news"

function baseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
  )
}

export async function getNews() {
  const res = await fetch(`${baseUrl()}/api/news`, ({ next: { revalidate: 120 } } as any))
  const json = await res.json()
  const normalized = (Array.isArray(json) ? json : []).map((n: any) => ({
    ...n,
    published_at: n?.published_at ? new Date(n.published_at).toISOString() : new Date().toISOString(),
    created_at: n?.created_at ? new Date(n.created_at).toISOString() : new Date().toISOString(),
    updated_at: n?.updated_at ? new Date(n.updated_at).toISOString() : new Date().toISOString(),
  }))
  return z.array(newsWithRelationsSchema).parse(normalized)
}

export async function getNewsByLeagueSlug(slug: string) {
  const all = await getNews()
  // Handle different league slug formats
  const leagueMappings: Record<string, string[]> = {
    'premier-league': ['premier-league', 'premier'],
    'league-one': ['league-one', 'league1'],
    'ethiopian-cup': ['ethiopian-cup', 'cup'],
    'higher-league': ['higher-league', 'higher'],
    'walias-u20-pl': ['walias-u20-pl', 'walias-u20', 'u20']
  }
  
  const validSlugs = leagueMappings[slug] || [slug]
  const filtered = all.filter((n) => validSlugs.includes(n.league_slug || ''))
  return filtered
}