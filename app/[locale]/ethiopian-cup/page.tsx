// app/[locale]/ethiopian-cup/page.tsx
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';
import EthiopianCupHeader from '@/components/ethiopian-cup/EthiopianCupHeader';

export default function EthiopianCupPage({ params }: {
  params: Promise<{ locale: string }>
}) {
  // Using the params Promise as per Next.js 16
  const { locale } = use(params);
  
  // Set the locale for this page
  setRequestLocale(locale);

  const t = useTranslations('ethiopianCup');

  return (
    <div className="container mx-auto px-4 py-6">
      <EthiopianCupHeader />
    </div>
  );
}