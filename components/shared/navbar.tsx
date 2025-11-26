"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

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

  const leagueLinks = [
    { href: '/premier-league', label: 'Premier League' },
    { href: '/ethiopian-cup', label: 'Ethiopian Cup' },
    { href: '/higher-league', label: 'Higher League' },
    { href: '/league-one', label: 'League One' },
    { href: '/walias-u20-pl', label: 'Walias U-20 PL' },
  ];

  const NavLink = ({ href, label, isLeague = false, onClick }: { 
    href: string; 
    label: string; 
    isLeague?: boolean;
    onClick?: () => void;
  }) => (
    <Link
      href={href}
      className={cn(
        "relative font-semibold transition-all duration-300 block",
        isLeague ? "text-sm py-2" : "text-base py-3"
      )}
      onClick={onClick}
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
        "absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/60 transition-all duration-300",
        activeLink === href && "w-full"
      )} />
    </Link>
  );

  return (
    <div className={cn(
      "sticky top-0 z-50 border-b border-zinc-800/50 backdrop-blur-xl transition-all duration-500",
      scrolled 
        ? "bg-zinc-900/80 shadow-2xl shadow-zinc-900/20" 
        : "bg-zinc-900/60 shadow-sm"
    )}>
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/80 via-zinc-900/70 to-zinc-900/60 pointer-events-none" />
      
      {/* Top Row */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between relative z-10">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center space-x-3"
        >
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/70 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-primary-foreground font-black text-xl tracking-tight">P</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent">
              Pana Sports
            </span>
            <span className="text-xs text-muted-foreground font-medium tracking-wider hidden sm:block">
              ETHIOPIAN FOOTBALL HUB
            </span>
          </div>
        </Link>

        <div className="flex items-center space-x-2">
          {/* Search Button - Desktop */}
          <div className="hidden lg:flex items-center relative">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-20" />
              <Input
                placeholder="Search"
                className="pl-10 pr-4 w-48 md:w-64 bg-zinc-800/40 border-zinc-700/50 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:bg-zinc-800/60 transition-all duration-300 h-9"
              />
            </div>
          </div>

          {/* Search Button - Mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-9 w-9 rounded-xl hover:bg-zinc-800/50 border border-zinc-700/50 hover:border-primary/30 transition-all duration-300"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-xl hover:bg-zinc-800/50 border border-zinc-700/50 hover:border-primary/30 transition-all duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <div className="lg:hidden px-4 pb-3 relative z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-20" />
            <Input
              placeholder="Search"
              className="pl-10 pr-4 w-full bg-zinc-800/40 border-zinc-700/50 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:bg-zinc-800/60 transition-all duration-300 h-9"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Desktop League Links */}
      <div className="hidden md:block relative bg-zinc-900/70 border-t border-zinc-800/70">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-center space-x-6 lg:space-x-8 py-3 overflow-x-auto">
            {leagueLinks.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} isLeague={true} />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden py-2 bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-800/70 relative z-10">
          <div className="container mx-auto px-4">
            {/* League Links */}
            <div className="py-2 space-y-1">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
                Leagues
              </h3>
              {leagueLinks.map((link) => (
                <NavLink 
                  key={link.href} 
                  href={link.href} 
                  label={link.label} 
                  isLeague={true}
                  onClick={() => setMobileMenuOpen(false)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}