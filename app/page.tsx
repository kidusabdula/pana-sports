import AdBanner from "@/components/shared/AdBanner";
import HomeNewsSection from "@/components/shared/HomeNewsSection";
import RightColumn from "@/components/shared/RightColumn";

export default function Home() {
  return (
    <>
      {/* Ad Banner at the top */}
      <AdBanner />

      <main className="min-h-screen bg-black text-white pt-20 pb-10">
        <div className="container mx-auto px-4 space-y-6">
          {/* Compact Hero Section */}
          <section className="w-full bg-gradient-to-r from-zinc-900 to-black border border-white/5 rounded-2xl p-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <span className="text-xl font-black text-primary italic">
                  P
                </span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white leading-none">
                  Pana Sports
                </h1>
                <p className="text-xs text-zinc-400 mt-1">
                  The Heart of Ethiopian Football
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-xs font-bold text-white">
                  Premier League
                </span>
                <span className="text-[10px] text-zinc-500">Week 11</span>
              </div>
              <div className="h-8 w-px bg-white/10 mx-1 hidden sm:block" />
              <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium transition-colors">
                Live Scores
              </button>
            </div>
          </section>

          {/* Main Content Grid: News (Left) + Matches/Standings/Spotlight (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column - News Section (8 columns on desktop) */}
            <div className="lg:col-span-8">
              <HomeNewsSection />
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
