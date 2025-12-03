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

export default function Footer() {
  const quickLinks = [
    { href: "/premier-league", label: "Premier League" },
    { href: "/ethiopian-cup", label: "Ethiopian Cup" },
    { href: "/higher-league", label: "Higher League" },
    { href: "/league-one", label: "League One" },
    { href: "/womens-league", label: "Women's League" },
    { href: "/walias-u20-pl", label: "Walias U-20 PL" },
  ];

  const nationalTeamLinks = [
    { href: "/national-team/mens", label: "Men's Team" },
    { href: "/national-team/womens", label: "Women's Team" },
    { href: "/national-team/under-20", label: "U-20 Team" },
    { href: "/national-team/under-17", label: "U-17 Team" },
    { href: "/national-team/walias", label: "Walias" },
  ];

  const resourcesLinks = [
    { href: "/news", label: "News" },
    { href: "/live", label: "Live Matches" },
    { href: "/athletics", label: "Athletics" },
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
              Your comprehensive source for Ethiopian football news, match
              results, player statistics, and league standings. Stay updated
              with the latest from Ethiopian football.
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
            <h3 className="text-lg font-semibold text-foreground">Leagues</h3>
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
              National Teams
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
            <h3 className="text-lg font-semibold text-foreground">Resources</h3>
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
            © {new Date().getFullYear()} Pana Sports. All rights reserved.
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
