"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import {
  Home,
  Trophy,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  Settings,
  Menu,
  ChevronDown,
  ChevronRight,
  UserCheck,
  MoveRight,
  TrendingUp,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/cms/dashboard",
    icon: Home,
  },
  {
    name: "Leagues",
    href: "/cms/leagues",
    icon: Trophy,
  },
  {
    name: "Teams",
    href: "/cms/teams",
    icon: Users,
  },
  {
    name: "Players",
    href: "/cms/players",
    icon: UserCheck,
  },
  {
    name: "Matches",
    href: "/cms/matches",
    icon: Calendar,
  },
  // {
  //   name: "Match Events",
  //   href: "/cms/match-events",
  //   icon: TrendingUp,
  // },
  {
    name: "Standings",
    href: "/cms/standings",
    icon: Trophy,
  },
  {
    name: "Top Scorers",
    href: "/cms/top-scorers",
    icon: TrendingUp,
  },
  // {
  //   name: "Transfers",
  //   href: "/cms/transfers",
  //   icon: MoveRight,
  // },
  {
    name: "News",
    href: "/cms/news",
    icon: FileText,
  },
  // {
  //   name: "Comments",
  //   href: "/cms/comments",
  //   icon: MessageSquare,
  // },
  {
    name: "Authors",
    href: "/cms/authors",
    icon: UserCheck,
  },
  {
    name: "Users",
    href: "/cms/users",
    icon: Users,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  // Desktop sidebar
  return (
    <>
      <div className="hidden md:flex md:shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col grow pt-5 pb-4 overflow-y-auto bg-sidebar border-r border-sidebar-border">
            <div className="flex items-center shrink-0 px-6 mb-6">
              <Link href="/cms" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground tracking-tight">
                  Pana Sports
                </span>
              </Link>
            </div>
            <div className="flex-1 flex flex-col">
              <nav className="flex-1 px-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      "group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out"
                    )}
                  >
                    <item.icon
                      className={cn(
                        pathname === item.href
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground",
                        "mr-3 shrink-0 h-5 w-5 transition-colors duration-200"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-foreground hover:text-primary">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SheetTitle className="sr-only">CMS Navigation</SheetTitle>
            <div className="flex flex-col h-full bg-sidebar">
              <div className="flex items-center shrink-0 p-6 border-b border-sidebar-border">
                <Link href="/cms" className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-bold text-foreground tracking-tight">
                    Pana Sports
                  </span>
                </Link>
              </div>
              <div className="flex-1 overflow-y-auto">
                <nav className="px-4 py-4 space-y-1">
                  {navigation.map((item) => (
                    <SheetClose asChild key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          pathname === item.href
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          "group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out"
                        )}
                      >
                        <item.icon
                          className={cn(
                            pathname === item.href
                              ? "text-primary"
                              : "text-muted-foreground group-hover:text-foreground",
                            "mr-3 shrink-0 h-5 w-5 transition-colors duration-200"
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
