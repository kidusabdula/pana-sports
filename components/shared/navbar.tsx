"use client";

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Settings, User, Globe, Menu, X, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);

  const changeLanguage = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    router.refresh();
  };

  const leagueLinks = [
    { href: '/premier-league', label: t('premierLeague') },
    { href: '/ethiopian-cup', label: t('ethiopianCup') },
    { href: '/higher-league', label: t('higherLeague') },
    { href: '/league-one', label: t('leagueOne') },
    { href: '/walias-u20-pl', label: t('waliasU20PL') },
  ];

  const mainLinks = [
    { href: '/news', label: t('news') },
    { href: '/about-us', label: t('aboutUs') },
  ];

  const NavLink = ({ href, label, isLeague = false }: { href: string; label: string; isLeague?: boolean }) => (
    <Link
      href={href}
      className={cn(
        "relative font-semibold transition-all duration-300 group",
        isLeague ? "text-sm" : "text-base"
      )}
      onMouseEnter={() => !isLeague && setActiveLink(href)}
      onMouseLeave={() => !isLeague && setActiveLink(pathname)}
    >
      <span className={cn(
        "relative z-10 transition-colors duration-300",
        activeLink === href 
          ? "text-primary" 
          : "text-foreground/80 hover:text-primary"
      )}>
        {label}
      </span>
      
      {/* Animated underline */}
      <span className={cn(
        "absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/60 transition-all duration-300 group-hover:w-full",
        activeLink === href && "w-full",
        isLeague && "h-0.5",
        !isLeague && "h-0.5 -bottom-1"
      )} />
      
      {/* Glow effect */}
      <span className={cn(
        "absolute inset-0 rounded-lg bg-primary/5 scale-0 group-hover:scale-100 transition-transform duration-300",
        activeLink === href && "scale-100"
      )} />
    </Link>
  );

  return (
    <div className={cn(
      "sticky top-0 z-50 border-b border-zinc-800/50 backdrop-blur-xl transition-all duration-500 rounded-b-3xl rounded-t-3xl",
      scrolled 
        ? "bg-zinc-900/80 shadow-2xl shadow-zinc-900/20" 
        : "bg-zinc-900/60 shadow-sm"
    )}>
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/80 via-zinc-900/70 to-zinc-900/60 pointer-events-none" />
      
      {/* Top Row */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-6">
          {/* Enhanced Logo with animation */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 group"
            onMouseEnter={() => setActiveLink('/')}
            onMouseLeave={() => setActiveLink(pathname)}
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/70 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-all duration-500 group-hover:scale-105">
                <span className="text-primary-foreground font-black text-xl tracking-tight">P</span>
              </div>
              {/* Pulsing glow */}
              <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl group-hover:bg-primary/30 transition-all duration-500 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent transition-all duration-500 group-hover:scale-105">
                Pana Sports
              </span>
              <span className="text-xs text-muted-foreground font-medium tracking-wider">
                ETHIOPIAN FOOTBALL HUB
              </span>
            </div>
          </Link>

          {/* Enhanced Search Bar */}
          <div className="hidden lg:flex items-center relative">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors duration-300 group-hover:text-primary z-20" />
              <Input
                placeholder={t('search')}
                className="pl-12 pr-4 w-80 bg-zinc-800/40 border-zinc-700/50 rounded-2xl focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:bg-zinc-800/60 transition-all duration-300 backdrop-blur-sm h-11"
              />
              {/* Search bar glow */}
              <div className="absolute inset-0 rounded-2xl bg-primary/5 scale-0 group-hover:scale-100 transition-transform duration-300" />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Enhanced Language Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-11 w-11 rounded-2xl hover:bg-zinc-800/50 border border-zinc-700/50 hover:border-primary/30 transition-all duration-300 group relative overflow-hidden"
              >
                <Globe className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                <ChevronDown className="absolute -bottom-1 -right-1 h-3 w-3 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300" />
                {/* Gradient border effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="rounded-2xl border-zinc-700/50 bg-zinc-900/95 backdrop-blur-xl shadow-2xl p-2 min-w-32"
            >
              <DropdownMenuItem 
                onClick={() => changeLanguage('en')}
                className="rounded-lg hover:bg-zinc-800/50 transition-colors duration-200 cursor-pointer"
              >
                <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  English
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => changeLanguage('am')}
                className="rounded-lg hover:bg-zinc-800/50 transition-colors duration-200 cursor-pointer"
              >
                <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  አማርኛ
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Main Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 ml-4">
            {mainLinks.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
          </div>

          {/* Enhanced User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-11 w-11 rounded-2xl hover:bg-zinc-800/50 border border-zinc-700/50 hover:border-primary/30 transition-all duration-300 group relative overflow-hidden"
              >
                <User className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="rounded-2xl border-zinc-700/50 bg-zinc-900/95 backdrop-blur-xl shadow-2xl p-2 min-w-32"
            >
              <DropdownMenuItem className="rounded-lg hover:bg-zinc-800/50 transition-colors duration-200 cursor-pointer">
                <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  {t('signIn')}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Enhanced Settings */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-11 w-11 rounded-2xl hover:bg-zinc-800/50 border border-zinc-700/50 hover:border-primary/30 transition-all duration-300 group relative overflow-hidden"
          >
            <Settings className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-90" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Button>

          {/* Enhanced Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-11 w-11 rounded-2xl hover:bg-zinc-800/50 border border-zinc-700/50 hover:border-primary/30 transition-all duration-300 group relative overflow-hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 transition-all duration-300 rotate-90 scale-110" />
            ) : (
              <Menu className="h-5 w-5 transition-all duration-300 group-hover:scale-110" />
            )}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Button>
        </div>
      </div>

      {/* Enhanced Bottom Row - League Links */}
      <div className="relative bg-zinc-900/70 border-t border-zinc-800/70 rounded-b-3xl">
        {/* Animated background gradient */}
        <div className="absolute inset-0 animate-pulse" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="hidden md:flex items-center justify-center space-x-8 py-4 overflow-x-auto rounded-b-3xl">
            {leagueLinks.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} isLeague={true} />
            ))}
          </div>

          {/* Enhanced Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-3 bg-zinc-900/95 backdrop-blur-xl rounded-2xl border border-zinc-700/50 m-2 shadow-2xl">
              <div className="flex items-center relative mb-4 px-4">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground z-20" />
                <Input
                  placeholder={t('search')}
                  className="pl-12 pr-4 w-full bg-zinc-800/40 border-zinc-700/50 rounded-2xl focus-visible:ring-2 focus-visible:ring-primary/50 transition-all duration-300 h-11"
                />
              </div>
              
              {/* Main links */}
              <div className="space-y-2 px-4">
                {mainLinks.map((link) => (
                  <NavLink key={link.href} href={link.href} label={link.label} />
                ))}
              </div>
              
              {/* Divider with gradient */}
              <div className="relative px-4">
                <div className="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
              </div>
              
              {/* League links */}
              <div className="space-y-2 px-4 pb-2">
                {leagueLinks.map((link) => (
                  <NavLink key={link.href} href={link.href} label={link.label} isLeague={true} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}