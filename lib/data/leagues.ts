import { z } from "zod"
import { leagueResponseSchema } from "@/lib/schemas/league"

function baseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
  )
}

export async function getLeagues() {
  const res = await fetch(`${baseUrl()}/api/leagues`, ({ next: { revalidate: 60 } } as any))
  const json = await res.json()
  return z.array(leagueResponseSchema).parse(json)
}

export async function getLeagueBySlug(slug: string) {
  const res = await fetch(`${baseUrl()}/api/leagues`, ({ next: { revalidate: 300 } } as any))
  const json = await res.json()
  const data = z.array(leagueResponseSchema).parse(json)
  return data.find((l) => l.slug === slug) || null
}