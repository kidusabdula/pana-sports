// app/[locale]/layout.tsx
import { Inter, DM_Mono } from "next/font/google";
import "../globals.css";
import QueryClientProvider from "@/components/providers/query-client-provider";
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/Footer";

const inter = Inter({ subsets: ["latin"] });
const dmMono = DM_Mono({ subsets: ["latin"], variable: "--font-dm-mono", weight: ["300","400","500"] });

export const metadata = {
  title: "Pana Sports",
  description: "Ethiopian Football Hub"
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({ children, params }: {
  children: React.ReactNode,
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  
  // Validate that the incoming `locale` parameter is valid
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  
  // Set the locale for all server components in this layout
  setRequestLocale(locale);
  
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <body className={`${inter.className} ${dmMono.variable} flex flex-col min-h-screen`}>
        <QueryClientProvider>
          <NextIntlClientProvider messages={messages}>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </NextIntlClientProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}