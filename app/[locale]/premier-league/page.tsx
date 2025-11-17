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
    <div className="container mx-auto px-4 py-6">
      <PremierLeagueHeader />
    </div>
  );
}