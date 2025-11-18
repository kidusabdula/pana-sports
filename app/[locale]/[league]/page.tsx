// app/[locale]/[league]/page.tsx
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';
import { notFound } from 'next/navigation';

// Import all league components
import PremierLeagueHeader from '@/components/premier-league/PremierLeagueHeader';
import EthiopianCupHeader from '@/components/ethiopian-cup/EthiopianCupHeader';
import HigherLeagueHeader from '@/components/higher-league/HigherLeagueHeader';
import LeagueOneHeader from '@/components/league-one/LeagueOneHeader';
import WaliasU20Header from '@/components/walias-u20-pl/WaliasU20Header';

// Define league configurations
const leagueConfigs = {
  'premier-league': {
    name: 'premierLeague',
    title: 'Ethiopian Premier League',
    season: '2025/2026',
    teams: 16,
    matchesPlayed: 120,
    totalMatches: 240,
    status: 'In Progress',
    HeaderComponent: PremierLeagueHeader
  },
  'ethiopian-cup': {
    name: 'ethiopianCup',
    title: 'Ethiopian Cup',
    season: '2025/2026',
    teams: 32,
    matchesPlayed: 60,
    totalMatches: 120,
    status: 'In Progress',
    HeaderComponent: EthiopianCupHeader
  },
  'higher-league': {
    name: 'higherLeague',
    title: 'Higher League',
    season: '2025/2026',
    teams: 14,
    matchesPlayed: 80,
    totalMatches: 160,
    status: 'In Progress',
    HeaderComponent: HigherLeagueHeader
  },
  'league-one': {
    name: 'leagueOne',
    title: 'League One',
    season: '2025/2026',
    teams: 12,
    matchesPlayed: 60,
    totalMatches: 120,
    status: 'In Progress',
    HeaderComponent: LeagueOneHeader
  },
  'walias-u20-pl': {
    name: 'waliasU20PL',
    title: 'Walias U-20 PL',
    season: '2025/2026',
    teams: 10,
    matchesPlayed: 40,
    totalMatches: 80,
    status: 'In Progress',
    HeaderComponent: WaliasU20Header
  }
};

export default function LeaguePage({ params }: {
  params: Promise<{ locale: string; league: string }>
}) {
  // Using the params Promise as per Next.js 16
  const { locale, league } = use(params);
  
  // Set the locale for this page
  setRequestLocale(locale);

  // Check if league exists
  const leagueConfig = leagueConfigs[league as keyof typeof leagueConfigs];
  if (!leagueConfig) {
    notFound();
  }

  const t = useTranslations(leagueConfig.name);

  // Get the appropriate header component
  const HeaderComponent = leagueConfig.HeaderComponent;

  return (
    <div className="container mx-auto px-4 py-6">
      <HeaderComponent />
    </div>
  );
}