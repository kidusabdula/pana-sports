"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useLiveMatches } from "@/lib/hooks/public/useMatches";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  ShieldCheck,
  Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href?: string;
  label: string;
  type: "link" | "dropdown";
  items?: { href: string; label: string }[];
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Dropdown state
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use the hook to check for live matches (same as other components)
  const { data: liveMatches } = useLiveMatches();
  const hasLiveMatches = (liveMatches?.length ?? 0) > 0;

  // Navigation structure
  const navItems: NavItem[] = [
    { href: "/", label: "Home", type: "link" },
    { href: "/news", label: "News", type: "link" },
    {
      label: "League",
      type: "dropdown",
      items: [
        { href: "/premier-league", label: "Premier League" },
        { href: "/ethiopian-cup", label: "Ethiopian Cup" },
        { href: "/higher-league", label: "Higher League" },
        { href: "/league-one", label: "League One" },
      ],
    },
    { href: "/womens-league", label: "Women's League", type: "link" },
    {
      label: "National Team",
      type: "dropdown",
      items: [
        { href: "/national-team/walias", label: "Walias" },
        { href: "/national-team/under-20", label: "Under 20" },
        { href: "/national-team/under-17", label: "Under 17" },
        { href: "/national-team/mens", label: "Men's" },
        { href: "/national-team/womens", label: "Women's" },
      ],
    },
    { href: "/athletics", label: "Athletics", type: "link" },
  ];

  // 1. Handle Scroll & Outside Clicks
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 2. Handle Auth Check
  useEffect(() => {
    const supabase = createClient();

    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user?.user_metadata?.role === "admin") {
        setIsAdmin(true);
      }
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      // Don't use session.user directly - verify with getUser() for security
      if (_event === "SIGNED_OUT") {
        setUser(null);
        setIsAdmin(false);
        setProfileOpen(false);
        router.refresh();
      } else if (session) {
        // Verify the user with the server
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
        setIsAdmin(user?.user_metadata?.role === "admin");
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // 3. Handle route changes
  useEffect(() => {
    // Use setTimeout to avoid "synchronous setState in effect" warning
    const timer = setTimeout(() => {
      setMobileMenuOpen(false);
      setSearchOpen(false);
      setOpenDropdown(null);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  // Check if a dropdown item is active
  const isDropdownActive = (items?: { href: string; label: string }[]) => {
    return items?.some((item) => pathname === item.href) ?? false;
  };

  // Desktop NavLink Component
  const DesktopNavLink = ({ item }: { item: NavItem }) => {
    if (item.type === "link" && item.href) {
      const isActive = pathname === item.href;
      return (
        <Link
          href={item.href}
          className="relative group transition-all duration-300"
        >
          <span
            className={cn(
              "relative z-10 transition-colors duration-300 text-sm font-medium",
              isActive ? "text-primary" : "text-zinc-400 group-hover:text-white"
            )}
          >
            {item.label}
          </span>
          <span
            className={cn(
              "absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-primary blur-[1px] transition-all duration-300 group-hover:w-full",
              isActive ? "w-full" : "w-0"
            )}
          />
        </Link>
      );
    }

    // Dropdown menu
    const isActive = isDropdownActive(item.items);
    const isOpen = openDropdown === item.label;

    return (
      <div
        className="relative"
        onMouseEnter={() => handleMouseEnter(item.label)}
        onMouseLeave={handleMouseLeave}
      >
        <button className="relative group transition-all duration-300 flex items-center gap-1">
          <span
            className={cn(
              "relative z-10 transition-colors duration-300 text-sm font-medium",
              isActive ? "text-primary" : "text-zinc-400 group-hover:text-white"
            )}
          >
            {item.label}
          </span>
          <ChevronDown
            className={cn(
              "w-3.5 h-3.5 transition-all duration-300",
              isActive
                ? "text-primary"
                : "text-zinc-400 group-hover:text-white",
              isOpen && "rotate-180"
            )}
          />
          <span
            className={cn(
              "absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-primary blur-[1px] transition-all duration-300 group-hover:w-full",
              isActive ? "w-full" : "w-0"
            )}
          />
        </button>

        {/* Dropdown Menu */}
        <div
          className={cn(
            "absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-[#0a0a0a] border border-zinc-800 rounded-xl shadow-2xl p-2 transform transition-all duration-200 origin-top",
            isOpen
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          )}
        >
          {item.items?.map((subItem) => (
            <Link
              key={subItem.href}
              href={subItem.href}
              className={cn(
                "block px-3 py-2 text-sm rounded-lg transition-colors",
                pathname === subItem.href
                  ? "text-primary bg-primary/10"
                  : "text-zinc-300 hover:text-white hover:bg-zinc-900"
              )}
            >
              {subItem.label}
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 transition-all duration-500 border-b",
          scrolled
            ? "bg-black/60 backdrop-blur-xl border-white/5 supports-[backdrop-filter]:bg-black/60"
            : "bg-transparent border-transparent"
        )}
      >
        {/* Top Row */}
        <div className="container mx-auto px-4 h-16 flex items-center justify-between relative z-10">
          {/* Logo Section */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/logo1.png"
              alt="Pana Sports"
              width={120}
              height={48}
              className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              priority
            />
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

            <div className="h-6 w-px bg-zinc-800 mx-1 hidden lg:block" />

            {/* User Auth Section - Only show if logged in */}
            {user && (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:border-zinc-700 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center text-xs font-bold text-white border border-zinc-700">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-zinc-500 transition-transform",
                      profileOpen && "rotate-180"
                    )}
                  />
                </button>

                {/* Profile Dropdown */}
                <div
                  className={cn(
                    "absolute right-0 top-full mt-2 w-64 bg-[#0a0a0a] border border-zinc-800 rounded-2xl shadow-2xl p-2 transform transition-all duration-200 origin-top-right",
                    profileOpen
                      ? "opacity-100 scale-100 translate-y-0"
                      : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                  )}
                >
                  <div className="px-3 py-2 border-b border-zinc-800 mb-2">
                    <p className="text-sm font-medium text-white truncate">
                      {user.email}
                    </p>
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
            )}

            {/* Mobile Toggles */}
            <div className="flex md:hidden items-center gap-2">
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
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out border-b border-zinc-800/50 bg-black/40 backdrop-blur-md",
            searchOpen ? "max-h-16 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="container mx-auto px-4 py-3">
            <Input
              placeholder="Search Pana Sports..."
              className="w-full bg-zinc-900/80 border-zinc-800 focus:ring-primary/50"
              autoFocus
            />
          </div>
        </div>

        {/* Secondary Nav (Desktop) */}
        <div className="hidden md:block border-t border-white/5 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-6 py-2.5">
              {navItems.map((item) => (
                <DesktopNavLink key={item.label} item={item} />
              ))}

              {/* Conditional Live Menu */}
              {hasLiveMatches && (
                <Link
                  href="/live"
                  className="relative group transition-all duration-300 flex items-center gap-1.5"
                >
                  <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                  <span
                    className={cn(
                      "relative z-10 transition-colors duration-300 text-sm font-medium",
                      pathname.includes("/live")
                        ? "text-red-500"
                        : "text-red-400 group-hover:text-red-300"
                    )}
                  >
                    Live
                  </span>
                  <span
                    className={cn(
                      "absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-red-500 blur-[1px] transition-all duration-300 group-hover:w-full",
                      pathname.includes("/live") ? "w-full" : "w-0"
                    )}
                  />
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Full Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black md:hidden transition-all duration-300",
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        {/* Background with blur */}
        <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" />

        {/* Content container */}
        <div className="relative h-full overflow-y-auto">
          {/* Close button at top */}
          <div className="sticky top-0 z-10 flex justify-end p-6 bg-gradient-to-b from-black/80 to-transparent">
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-white hover:bg-white/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Menu content */}
          <div className="flex flex-col gap-6 pb-6 px-6">
            {/* Navigation Items */}
            {navItems.map((item) => (
              <div key={item.label}>
                {item.type === "link" && item.href ? (
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "block text-lg font-medium transition-all",
                      pathname === item.href
                        ? "text-primary"
                        : "text-zinc-300 hover:text-white hover:pl-2"
                    )}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">
                      {item.label}
                    </h3>
                    <div className="pl-3 space-y-3">
                      {item.items?.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "block text-base font-medium transition-all",
                            pathname === subItem.href
                              ? "text-primary"
                              : "text-zinc-300 hover:text-white hover:pl-2"
                          )}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Conditional Live Menu for Mobile */}
            {hasLiveMatches && (
              <Link
                href="/live"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-lg font-medium text-red-400"
              >
                <Radio className="w-4 h-4 animate-pulse" />
                Live Matches
              </Link>
            )}

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
      </div>
    </>
  );
}
