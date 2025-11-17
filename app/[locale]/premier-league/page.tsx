// app/[locale]/premier-league/page.tsx
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';
import PremierLeagueHeader from '@/components/premier-league/PremierLeagueHeader';

export default function PremierLeaguePage({ params }: {
  params: Promise<{ locale: string }>
}) {
  // Using the params Promise as per Next.js 16
  const { locale } = use(params);
  
  // Set the locale for this page
  setRequestLocale(locale);

  const t = useTranslations('premierLeague');

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header with Tabs */}
      <PremierLeagueHeader />
      
      {/* Placeholder for other rows */}
      <div className="text-center text-muted-foreground py-12">
        <h2 className="text-2xl font-bold mb-4">Premier League Page</h2>
        <p>Other sections will be added here in the next steps...</p>
      </div>
    </div>
  );
}