// components/shared/Footer.tsx
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import { useLanguage } from "@/components/providers/language-provider";

export default function Footer() {
  const { language } = useLanguage();

  const labels = {
    en: {
      premierLeague: "Premier League",
      ethiopianCup: "Ethiopian Cup",
      higherLeague: "Higher League",
      leagueOne: "League One",
      womensLeague: "Women's League",
      waliasU20: "Walias U-20 PL",
      mensTeam: "Men's Team",
      womensTeam: "Women's Team",
      u20Team: "U-20 Team",
      u17Team: "U-17 Team",
      walias: "Walias",
      news: "News",
      liveMatches: "Live Matches",
      athletics: "Athletics",
      leagues: "Leagues",
      nationalTeams: "National Teams",
      resources: "Resources",
      about: "Your comprehensive source for Ethiopian football news, match results, player statistics, and league standings. Stay updated with the latest from Ethiopian football.",
      rights: "All rights reserved."
    },
    am: {
      premierLeague: "ፕሪሚየር ሊግ",
      ethiopianCup: "የኢትዮጵያ ዋንጫ",
      higherLeague: "ከፍተኛ ሊግ",
      leagueOne: "ሊግ አንድ",
      womensLeague: "የሴቶች ሊግ",
      waliasU20: "ዋሊያ U-20",
      mensTeam: "የወንዶች ቡድን",
      womensTeam: "የሴቶች ቡድን",
      u20Team: "ከ 20 ዓመት በታች",
      u17Team: "ከ 17 ዓመት በታች",
      walias: "ዋሊያ",
      news: "ዜና",
      liveMatches: "ቀጥታ ጨዋታዎች",
      athletics: "አትሌቲክስ",
      leagues: "ሊጎች",
      nationalTeams: "ብሄራዊ ቡድኖች",
      resources: "ግብዓቶች",
      about: "የኢትዮጵያ እግር ኳስ ዜናዎች፣ የጨዋታ ውጤቶች፣ የታዋቂዎች ስታቲስቲክስ እና የሊግ ደረጃዎች ሁሉን አቀፍ ምንጭ። ከኢትዮጵያ እግር ኳስ ጋር ይዘመኑ።",
      rights: "መብቱ በህግ የተጠበቀ ነው።"
    }
  };

  const t = labels[language];

  const quickLinks = [
    { href: "/premier-league", label: t.premierLeague },
    { href: "/ethiopian-cup", label: t.ethiopianCup },
    { href: "/higher-league", label: t.higherLeague },
    { href: "/league-one", label: t.leagueOne },
    { href: "/womens-league", label: t.womensLeague },
    { href: "/walias-u20-pl", label: t.waliasU20 },
  ];

  const nationalTeamLinks = [
    { href: "/national-team/mens", label: t.mensTeam },
    { href: "/national-team/womens", label: t.womensTeam },
    { href: "/national-team/under-20", label: t.u20Team },
    { href: "/national-team/under-17", label: t.u17Team },
    { href: "/national-team/walias", label: t.walias },
  ];

  const resourcesLinks = [
    { href: "/news", label: t.news },
    { href: "/live", label: t.liveMatches },
    { href: "/athletics", label: t.athletics },
  ];

  return (
    <footer className="bg-zinc-900/60 backdrop-blur-xl border-t border-zinc-800/50 mt-auto">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/40 via-zinc-900/60 to-zinc-900/80 pointer-events-none" />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-22 h-16 p-7 rounded-2xl overflow-hidden shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo2.png"
                  alt="Pana Sports Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent">
                  Pana Sports
                </span>
                <span className="text-xs text-muted-foreground font-medium tracking-wider">
                  ETHIOPIAN FOOTBALL HUB
                </span>
              </div>
            </Link>

            <p className="text-sm text-muted-foreground max-w-md">
              {t.about}
            </p>

            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full hover:bg-zinc-800/50 border border-zinc-700/50 hover:border-primary/30 transition-all duration-300"
              >
                <Facebook className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full hover:bg-zinc-800/50 border border-zinc-700/50 hover:border-primary/30 transition-all duration-300"
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full hover:bg-zinc-800/50 border border-zinc-700/50 hover:border-primary/30 transition-all duration-300"
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full hover:bg-zinc-800/50 border border-zinc-700/50 hover:border-primary/30 transition-all duration-300"
              >
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Leagues */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">{t.leagues}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* National Teams */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              {t.nationalTeams}
            </h3>
            <ul className="space-y-2">
              {nationalTeamLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">{t.resources}</h3>
            <ul className="space-y-2 mb-6">
              {resourcesLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-zinc-800/50" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Pana Sports. {t.rights}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>info@panasports.et</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>+251 123 456 789</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Addis Ababa, Ethiopia</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
