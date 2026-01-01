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

      <main className="min-h-screen bg-black text-white pt-8 pb-10">
        <div className="container mx-auto px-4 space-y-6">
          {/* Main Content Grid: News (Left) + Matches/Standings/Spotlight (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column - News Section (8 columns on desktop) */}
            <div className="lg:col-span-8 space-y-6">
              <Suspense fallback={<HomeNewsSectionSkeleton />}>
                <HomeNewsSection />
              </Suspense>

              {/* Ad after news feed */}
              <AdBanner variant="inline" showClose={false} page="home" />

              {/* Other News Grid (2x3) */}
              <Suspense
                fallback={
                  <div className="h-48 bg-zinc-900 animate-pulse rounded-xl" />
                }
              >
                <OtherNews />
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
