import { useTranslations } from 'next-intl';
import NewsSection from './NewsSection';
import LeagueStandings from './LeagueStandings';
import PlayerSpotlight from './PlayerSpotlight';

export default function RightColumn() {
  const t = useTranslations('Home');

  return (
    <div className="p-6 space-y-4">
      {/* News Section - Takes natural height */}
      <NewsSection />
      
      {/* League Standings - Takes natural height */}
      <LeagueStandings />
      
      {/* Player Spotlight - Takes natural height */}
      <PlayerSpotlight />
    </div>
  );
}