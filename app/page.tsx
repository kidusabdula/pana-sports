// app/page.tsx
import AdBanner from "@/components/shared/AdBanner";
import HomeNewsSection from "@/components/news/HomeNewsSection";
import RightColumn from "@/components/shared/RightColumn";
import HomeNewsSectionSkeleton from "@/components/shared/Skeletons/HomeNewsSectionSkeleton";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      {/* Ad Banner at the top */}
      <AdBanner />

      <main className="min-h-screen bg-black text-white pt-20 pb-10">
        <div className="container mx-auto px-4 space-y-6">
          {/* Main Content Grid: News (Left) + Matches/Standings/Spotlight (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column - News Section (8 columns on desktop) */}
            <div className="lg:col-span-8">
              <Suspense fallback={<HomeNewsSectionSkeleton />}>
                <HomeNewsSection />
              </Suspense>
            </div>

            {/* Right Column - Matches, Standings, Player Spotlight (4 columns on desktop) */}
            <div className="lg:col-span-4">
              <RightColumn />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}