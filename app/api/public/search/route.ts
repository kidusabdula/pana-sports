import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const supabase = await createClient();
    const searchTerm = `%${query}%`;
    const results = [];

    // Search teams
    const { data: teams } = await supabase
      .from("teams")
      .select("id, name_en, name_am, slug, logo_url")
      .or(`name_en.ilike.${searchTerm},name_am.ilike.${searchTerm}`)
      .limit(5);

    if (teams) {
      results.push(
        ...teams.map((t) => ({
          type: "team",
          id: t.id,
          title: t.name_en,
          subtitle: t.name_am,
          image: t.logo_url,
          href: `/teams/${t.slug}`,
        }))
      );
    }

    // Search players
    const { data: players } = await supabase
      .from("players")
      .select("id, name_en, name_am, slug, photo_url, position_en")
      .or(`name_en.ilike.${searchTerm},name_am.ilike.${searchTerm}`)
      .limit(5);

    if (players) {
      results.push(
        ...players.map((p) => ({
          type: "player",
          id: p.id,
          title: p.name_en,
          subtitle: p.position_en,
          image: p.photo_url,
          href: `/players/${p.slug}`,
        }))
      );
    }

    // Search news
    const { data: news } = await supabase
      .from("news")
      .select("id, title_en, title_am, slug, thumbnail_url")
      .eq("is_published", true)
      .or(`title_en.ilike.${searchTerm},title_am.ilike.${searchTerm}`)
      .limit(5);

    if (news) {
      results.push(
        ...news.map((n) => ({
          type: "news",
          id: n.id,
          title: n.title_en,
          subtitle: n.title_am,
          image: n.thumbnail_url,
          href: `/news/${n.slug}`,
        }))
      );
    }

    // Search matches (by team names)
    const { data: matches } = await supabase
      .from("matches")
      .select(
        `
        id,
        date,
        home_team:teams!matches_home_team_id_fkey(name_en),
        away_team:teams!matches_away_team_id_fkey(name_en)
      `
      )
      .limit(10);

    if (matches) {
      const matchResults = matches
        .filter(
          (m: any) =>
            m.home_team?.name_en?.toLowerCase().includes(query.toLowerCase()) ||
            m.away_team?.name_en?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
        .map((m: any) => ({
          type: "match",
          id: m.id,
          title: `${m.home_team?.name_en} vs ${m.away_team?.name_en}`,
          subtitle: new Date(m.date).toLocaleDateString(),
          href: `/matches/${m.id}`,
        }));
      results.push(...matchResults);
    }

    return NextResponse.json(results.slice(0, 15));
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
