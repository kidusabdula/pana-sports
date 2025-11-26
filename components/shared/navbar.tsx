"use client";

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client'; // See note below if you don't have this
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, Menu, X, User, LogOut, 
  LayoutDashboard, ChevronDown, ShieldCheck 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  
  // Auth State
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // 1. Handle Scroll & Outside Clicks
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 2. Handle Auth Check
  useEffect(() => {
    const supabase = createClient();

    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      // Check metadata for admin role
      if (user?.user_metadata?.role === 'admin') {
        setIsAdmin(true);
      }
    };

    checkUser();

    // Listen for auth state changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.user_metadata?.role === 'admin');
      if (_event === 'SIGNED_OUT') {
        setProfileOpen(false);
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    setActiveLink(pathname);
    setMobileMenuOpen(false); // Close mobile menu on route change
    setSearchOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  const leagueLinks = [
    { href: '/premier-league', label: 'Premier League' },
    { href: '/ethiopian-cup', label: 'Ethiopian Cup' },
    { href: '/higher-league', label: 'Higher League' },
    { href: '/league-one', label: 'League One' },
    { href: '/walias-u20-pl', label: 'Walias U-20 PL' },
  ];

  // Refined NavLink with smoother hover
  const NavLink = ({ href, label, isLeague = false }: { href: string; label: string; isLeague?: boolean }) => (
    <Link
      href={href}
      className={cn(
        "relative group transition-all duration-300",
        isLeague ? "text-sm font-medium px-1" : "text-base font-semibold"
      )}
    >
      <span className={cn(
        "relative z-10 transition-colors duration-300",
        activeLink === href ? "text-primary" : "text-zinc-400 group-hover:text-white"
      )}>
        {label}
      </span>
      {/* Premium Glow Underline */}
      <span className={cn(
        "absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-primary blur-[1px] transition-all duration-300 group-hover:w-full",
        activeLink === href ? "w-full" : "w-0"
      )} />
    </Link>
  );

  return (
    <header className={cn(
      "sticky top-0 z-50 transition-all duration-500 border-b",
      scrolled 
        ? "bg-black/60 backdrop-blur-xl border-white/5 supports-[backdrop-filter]:bg-black/60" 
        : "bg-transparent border-transparent"
    )}>
      
      {/* Top Row */}
      <div className="container mx-auto px-4 h-16 flex items-center justify-between relative z-10">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
            <span className="text-white font-black text-xl italic">P</span>
            <div className="absolute inset-0 bg-white/20 group-hover:opacity-0 transition-opacity" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-primary transition-colors">
              Pana Sports
            </span>
            <span className="text-[10px] text-zinc-500 font-medium tracking-[0.2em] uppercase hidden sm:block">
              Ethiopian Hub
            </span>
          </div>
        </Link>

        {/* Desktop Actions */}
        <div className="flex items-center gap-3">
          
          {/* Desktop Search */}
          <div className="hidden lg:flex items-center relative group">
            <Search className="absolute left-3 w-4 h-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search news, stats..."
              className="pl-9 pr-4 w-64 h-9 bg-zinc-900/50 border-zinc-800 rounded-full focus:bg-black focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 text-sm"
            />
          </div>

          <div className="h-6 w-[1px] bg-zinc-800 mx-1 hidden lg:block" />

          {/* User Auth Section */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:border-zinc-700 transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center text-xs font-bold text-white border border-zinc-700">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <ChevronDown className={cn("w-4 h-4 text-zinc-500 transition-transform", profileOpen && "rotate-180")} />
              </button>

              {/* Profile Dropdown */}
              <div className={cn(
                "absolute right-0 top-full mt-2 w-64 bg-[#0a0a0a] border border-zinc-800 rounded-2xl shadow-2xl p-2 transform transition-all duration-200 origin-top-right",
                profileOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              )}>
                <div className="px-3 py-2 border-b border-zinc-800 mb-2">
                  <p className="text-sm font-medium text-white truncate">{user.email}</p>
                  <p className="text-xs text-zinc-500">Sports Fan</p>
                </div>

                {isAdmin && (
                  <Link 
                    href="/cms/dashboard" 
                    className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-xl transition-colors mb-1"
                    onClick={() => setProfileOpen(false)}
                  >
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm" className="rounded-full px-5 bg-primary hover:bg-primary/90 text-white font-medium shadow-lg shadow-primary/20">
                Sign In
              </Button>
            </Link>
          )}

          {/* Mobile Toggles */}
          <div className="flex lg:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-white hover:bg-white/10"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-white hover:bg-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <div className={cn(
        "lg:hidden overflow-hidden transition-all duration-300 ease-in-out border-b border-zinc-800/50 bg-black/40 backdrop-blur-md",
        searchOpen ? "max-h-16 opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="container mx-auto px-4 py-3">
          <Input
            placeholder="Search Pana Sports..."
            className="w-full bg-zinc-900/80 border-zinc-800 focus:ring-primary/50"
            autoFocus
          />
        </div>
      </div>

      {/* Secondary Nav (Leagues) - Desktop */}
      <div className="hidden md:block border-t border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-8 py-2.5 overflow-x-auto no-scrollbar">
            {leagueLinks.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} isLeague={true} />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu Full Overlay */}
      <div className={cn(
        "fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-20 px-6 transition-all duration-300 lg:hidden",
        mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        <div className="flex flex-col gap-6">
           <div className="space-y-4">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Leagues</h3>
            <div className="grid grid-cols-1 gap-4">
              {leagueLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium text-zinc-300 hover:text-white hover:pl-2 transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </div>
           </div>

           {/* Mobile Admin Link */}
           {isAdmin && (
             <div className="pt-4 border-t border-zinc-800">
                <Link
                  href="/cms/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-primary font-medium"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  CMS Dashboard
                </Link>
             </div>
           )}
        </div>
      </div>
    </header>
  );
}