import LeftColumn from "@/components/shared/LeftColumn"; // Matches
import NewsSection from "@/components/shared/NewsSection"; // Hero
import LeagueStandings from "@/components/shared/LeagueStandings";
import PlayerSpotlight from "@/components/shared/PlayerSpotlight";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white pt-20 pb-10">
      <div className="container mx-auto px-4 space-y-6">
        {/* Compact Hero Section */}
        <section className="w-full bg-gradient-to-r from-zinc-900 to-black border border-white/5 rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <span className="text-xl font-black text-primary italic">P</span>
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

        {/* Section 1: Hero News (Full Width) */}
        <section className="w-full">
          <NewsSection />
        </section>

        {/* Section 2: Content Grid */}
        {/* Mobile: Matches first, then Standings/Spotlight. Desktop: Matches left (4 cols), Standings/Spotlight right (8 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (Matches) - Takes 4/12 columns on Desktop, shows first on mobile */}
          <div className="lg:col-span-4 space-y-6">
            <LeftColumn />
          </div>

          {/* Right Column (Standings, Spotlight) - Takes 8/12 columns on Desktop, shows second on mobile */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LeagueStandings />
              <PlayerSpotlight />
            </div>

            {/* Additional content could go here to fill the wider space */}
          </div>
        </div>
      </div>
    </main>
  );
}
