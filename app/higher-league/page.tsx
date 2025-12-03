// // app/higher-league/page.tsx
// "use client"
// import { notFound } from "next/navigation";
// import HigherLeaguePage from "@/components/higher-league/HigherLeaguePage";
// import { Suspense } from "react";

// async function getHigherLeagueId() {
//   try {
//     const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
//     const res = await fetch(`${baseUrl}/api/public/leagues`, {
//       cache: "no-store",
//     });

//     if (!res.ok) {
//       throw new Error("Failed to fetch leagues");
//     }

//     const leagues = await res.json();

//     // Find the Higher League by name or slug
//     const higherLeague = leagues.find(
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       (league: any) =>
//         league.name_en?.toLowerCase().includes("higher") ||
//         league.slug?.toLowerCase().includes("higher")
//     );

//     return higherLeague?.id;
//   } catch (error) {
//     console.error("Error fetching Higher League:", error);
//     return null;
//   }
// }

// export default async function Page() {
//   const leagueId = await getHigherLeagueId();

//   if (!leagueId) {
//     return (
//       <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
//         <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 max-w-md mx-auto text-center">
//           <h2 className="text-2xl font-bold text-white mb-4">Higher League Not Found</h2>
//           <p className="text-zinc-400 mb-6">The Higher League data is not available at the moment. Please try again later.</p>
//           <button 
//             onClick={() => window.location.reload()} 
//             className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <Suspense fallback={
//       <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-800"></div>
//       </div>
//     }>
//       <HigherLeaguePage leagueId={leagueId} />
//     </Suspense>
//   );
// }

"use client"
import ComingSoon from "@/components/shared/ComingSoon";

export default function HigherLeaguePage() {
  return (
    <ComingSoon
      title="HigherLeague"
      description="The battle for promotion. HigherLeague coverage, standings, and stats are coming soon."
    />
  );
}
