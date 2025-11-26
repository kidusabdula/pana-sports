// app/premier-league/page.tsx
import PremierLeagueHeader from '@/components/premier-league/PremierLeagueHeader';
import { getMatchesByLeagueSlug } from '@/lib/data/matches';
import { getNewsByLeagueSlug } from '@/lib/data/news';
import { getStandingsByLeagueSlug } from '@/lib/data/standings';
import { getTeamsByLeagueSlug } from '@/lib/data/teams';
import { getTopScorersByLeagueSlug } from '@/lib/data/topScorers';
import { getPlayersByLeagueSlug } from '@/lib/data/players';

export default async function PremierLeaguePage() {
  const leagueSlug = 'premier-league'
  const [matches, news, standings, teams, topScorers, players] = await Promise.all([
    getMatchesByLeagueSlug(leagueSlug),
    getNewsByLeagueSlug(leagueSlug),
    getStandingsByLeagueSlug(leagueSlug),
    getTeamsByLeagueSlug(leagueSlug),
    getTopScorersByLeagueSlug(leagueSlug),
    getPlayersByLeagueSlug(leagueSlug),
  ])

  return (
    <div className="container mx-auto px-4 py-6">
      <PremierLeagueHeader initialMatches={matches} initialNews={news} initialStandings={standings} initialTeams={teams} initialTopScorers={topScorers} initialPlayers={players} />
    </div>
  );
}

