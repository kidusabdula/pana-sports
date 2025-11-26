import { z } from "zod"
import { topScorerResponseSchema } from "@/lib/schemas/topScorer"

function baseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
  )
}

export async function getTopScorers() {
  const res = await fetch(`${baseUrl()}/api/top-scorers`, ({ next: { revalidate: 300 } } as any))
  const json = await res.json()
  const normalized = (Array.isArray(json) ? json : []).map((t: any) => ({
    ...t,
    created_at: t?.created_at ? new Date(t.created_at).toISOString() : new Date().toISOString(),
    updated_at: t?.updated_at ? new Date(t.updated_at).toISOString() : new Date().toISOString(),
  }))
  return z.array(topScorerResponseSchema).parse(normalized)
}

export async function getTopScorersByLeagueSlug(slug: string) {
  const all = await getTopScorers()
  return all.filter((t) => t.league_slug === slug)
}