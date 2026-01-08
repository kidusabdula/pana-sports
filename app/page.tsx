// app/page.tsx
import AdBanner from "@/components/shared/AdBanner";
import HomeNewsSection from "@/components/news/HomeNewsSection";
import RightColumn from "@/components/shared/RightColumn";
import HomeNewsSectionSkeleton from "@/components/shared/Skeletons/HomeNewsSectionSkeleton";
import RightColumnSkeleton from "@/components/shared/Skeletons/RightColumnSkeleton";
import OtherNews from "@/components/news/OtherNews";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      {/* Top Ad Banner */}
      <AdBanner variant="full" page="home" />

      <main className="min-h-screen bg-black text-white pt-8 pb-10 relative overflow-hidden">
        {/* Background Glow */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] -z-10 rounded-full pointer-events-none" />
        <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[150px] -z-10 rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 space-y-6 relative z-10">
          {/* Main Content Grid: News (Left) + Matches/Standings/Spotlight (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column - News Section (8 columns on desktop) */}
            <div className="lg:col-span-8 space-y-6">
              <Suspense fallback={<HomeNewsSectionSkeleton />}>
                <HomeNewsSection />
              </Suspense>

              {/* Other News Grid (2x3) */}
              <Suspense
                fallback={
                  <div className="h-48 bg-zinc-900 animate-pulse rounded-xl" />
                }
              >
                <OtherNews />

                {/* Ad after news feed */}
                <AdBanner variant="full" showClose={false} page="home" />
              </Suspense>
            </div>

            {/* Right Column - Matches, Standings, Player Spotlight (4 columns on desktop) */}
            <div className="lg:col-span-4">
              <Suspense fallback={<RightColumnSkeleton />}>
                <RightColumn />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
