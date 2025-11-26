import LeftColumn from '@/components/shared/LeftColumn'; // Matches
import NewsSection from '@/components/shared/NewsSection'; // Hero
import LeagueStandings from '@/components/shared/LeagueStandings';
import PlayerSpotlight from '@/components/shared/PlayerSpotlight';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white pt-20 pb-10">
      <div className="container mx-auto px-4 space-y-6">
        
        {/* Section 1: Hero News (Full Width) */}
        <section className="w-full">
          <NewsSection />
        </section>

        {/* Section 2: Content Grid */}
        {/* Mobile: Stacked, Desktop: Grid (Right Column is wider) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (Matches) - Takes 4/12 columns on Desktop */}
          <div className="lg:col-span-4 order-2 lg:order-1 space-y-6">
             <LeftColumn />
          </div>

          {/* Right Column (Standings, Spotlight) - Takes 8/12 columns on Desktop */}
          {/* Note: You asked for Right Column content to be 'larger' */}
          <div className="lg:col-span-8 order-1 lg:order-2 space-y-6">
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