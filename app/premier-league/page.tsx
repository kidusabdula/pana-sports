// app/premier-league/page.tsx

import { notFound } from "next/navigation";
import PremierLeaguePage from "@/components/premier-league/PremierLeaguePage";
import LeagueNotFound from "@/components/premier-league/LeagueNotFound";
import { Suspense } from "react";

// Mark this route as dynamic to prevent static generation issues
export const dynamic = "force-dynamic";

async function getPremierLeagueId() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/public/leagues`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch leagues");
    }

    const leagues = await res.json();

    // Find the Premier League by name or slug
    const premierLeague = leagues.find(

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (league: any) =>
        league.name_en?.toLowerCase().includes("premier") ||
        league.slug?.toLowerCase().includes("premier")
    );

    return premierLeague?.id;
  } catch (error) {
    console.error("Error fetching Premier League:", error);
    return null;
  }
}

export default async function Page() {
  const leagueId = await getPremierLeagueId();

  if (!leagueId) {
    return <LeagueNotFound />;
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-800"></div>
        </div>
      }
    >
      <PremierLeaguePage leagueId={leagueId} />
    </Suspense>
  );
}
