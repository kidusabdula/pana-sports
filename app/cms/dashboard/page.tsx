"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Trophy,
  Users,
  Calendar,
  FileText,
  Activity,
  ArrowRight,
  Shield,
  Loader2,
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useDashboardStats } from "@/lib/hooks/useDashboardStats";
import { format, formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { data: dashboardData, isLoading, error } = useDashboardStats();
  const [greeting, setGreeting] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const statConfigs = [
    {
      key: "leagues" as const,
      title: "Leagues",
      icon: Trophy,
      color: "text-primary",
      bgClass: "bg-primary/10",
      borderClass: "border-primary/20",
      gradient: "from-primary/5 to-transparent",
    },
    {
      key: "teams" as const,
      title: "Teams",
      icon: Shield,
      color: "text-blue-500",
      bgClass: "bg-blue-500/10",
      borderClass: "border-blue-500/20",
      gradient: "from-blue-500/5 to-transparent",
    },
    {
      key: "matches" as const,
      title: "Matches",
      icon: Calendar,
      color: "text-emerald-500",
      bgClass: "bg-emerald-500/10",
      borderClass: "border-emerald-500/20",
      gradient: "from-emerald-500/5 to-transparent",
    },
    {
      key: "news" as const,
      title: "Articles",
      icon: FileText,
      color: "text-orange-500",
      bgClass: "bg-orange-500/10",
      borderClass: "border-orange-500/20",
      gradient: "from-orange-500/5 to-transparent",
    },
  ];

  const getActivityColor = (type: string) => {
    switch (type) {
      case "league":
        return "bg-blue-500";
      case "match":
        return "bg-emerald-500";
      case "news":
        return "bg-purple-500";
      default:
        return "bg-slate-500";
    }
  };

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">
          Loading pana-sports analytics...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5 m-10">
        <CardContent className="p-10 flex flex-col items-center text-center gap-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <div>
            <h3 className="text-xl font-bold text-destructive">
              Dashboard Error
            </h3>
            <p className="text-muted-foreground mt-2 max-w-md">
              {error instanceof Error
                ? error.message
                : "Something went wrong while fetching stats."}
            </p>
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-10 pb-10">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <Badge
            variant="outline"
            className="mb-2 bg-primary/5 text-primary border-primary/20 px-3 py-1"
          >
            System Overview
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            {greeting},{" "}
            <span className="text-primary underline decoration-primary/30 underline-offset-8">
              Admin
            </span>
          </h1>
          <p className="text-muted-foreground mt-3 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            It&apos;s {format(new Date(), "EEEE, MMMM do, yyyy")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="destructive" size="sm" className="hidden sm:flex gap-2">
            <Activity className="h-4 w-4" />
            Full Report
          </Button>
          <Link href="/cms/matches/create">
            <Button size="sm" className="gap-2 shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4" />
              New Match
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statConfigs.map((stat, index) => (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Card
              className={cn(
                "relative overflow-hidden border-border/50 transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5",
                stat.borderClass
              )}
            >
              <div
                className={cn(
                  "absolute inset-0 bg-linear-to-br opacity-50",
                  stat.gradient
                )}
              />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("p-2.5 rounded-xl", stat.bgClass)}>
                    <stat.icon className={cn("h-6 w-6", stat.color)} />
                  </div>
                  <Badge variant="default" className="text-xs font-normal">
                    Real-time
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total {stat.title}
                  </p>
                  <div className="text-4xl font-black text-foreground tabular-nums">
                    {dashboardData?.[stat.key] ?? 0}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          {/* Upcoming Matches */}
          <Card className="border-border/50 bg-background/50 backdrop-blur-sm shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 py-4 bg-muted/5">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-emerald-500" />
                  Upcoming Matches
                </CardTitle>
                <CardDescription>
                  Next scheduled games across all leagues
                </CardDescription>
              </div>
              <Link href="/cms/matches">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:bg-primary/5 hover:text-primary shrink-0"
                >
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {dashboardData?.upcomingMatches &&
              dashboardData.upcomingMatches.length > 0 ? (
                <div className="divide-y divide-border/50">
                  {dashboardData.upcomingMatches.map((match) => (
                    <div
                      key={match.id}
                      className="p-5 flex items-center justify-between hover:bg-muted/30 transition-colors group"
                    >
                      <div className="flex items-center gap-8 flex-1">
                        <div className="flex items-center justify-end gap-3 w-[40%]">
                          <span className="text-sm font-semibold text-right hidden sm:inline truncate max-w-[120px]">
                            {match.home_team.name_en}
                          </span>
                          <div className="h-10 w-10 relative shrink-0 bg-muted/50 rounded-lg p-1 group-hover:bg-background transition-colors">
                            {match.home_team.logo_url ? (
                              <Image
                                src={match.home_team.logo_url}
                                alt=""
                                fill
                                className="object-contain p-1"
                              />
                            ) : (
                              <Shield className="h-full w-full text-muted-foreground/30 p-1" />
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-center gap-1 min-w-[60px]">
                          <Badge
                            variant="outline"
                            className="bg-muted/50 text-[10px] py-0 px-2 font-mono uppercase tracking-tighter"
                          >
                            vs
                          </Badge>
                          <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">
                            {format(new Date(match.scheduled_at), "HH:mm")}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 w-[40%]">
                          <div className="h-10 w-10 relative shrink-0 bg-muted/50 rounded-lg p-1 group-hover:bg-background transition-colors">
                            {match.away_team.logo_url ? (
                              <Image
                                src={match.away_team.logo_url}
                                alt=""
                                fill
                                className="object-contain p-1"
                              />
                            ) : (
                              <Shield className="h-full w-full text-muted-foreground/30 p-1" />
                            )}
                          </div>
                          <span className="text-sm font-semibold text-left hidden sm:inline truncate max-w-[120px]">
                            {match.away_team.name_en}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 ml-4 pr-1">
                        <p className="text-xs font-medium text-foreground whitespace-nowrap">
                          {format(new Date(match.scheduled_at), "MMM d")}
                        </p>
                        <Badge
                          variant="outline"
                          className="text-[9px] h-4 leading-none bg-emerald-50 text-emerald-600 border-emerald-100 flex items-center justify-center"
                        >
                          Ready
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-3">
                  <Calendar className="h-12 w-12 opacity-10" />
                  <p>No matches scheduled for the coming days.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* latest News */}
          <Card className="border-border/50 bg-background/50 backdrop-blur-sm shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 py-4 bg-muted/5">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-orange-500" />
                  Latest Articles
                </CardTitle>
                <CardDescription>
                  Recently published news content
                </CardDescription>
              </div>
              <Link href="/cms/news">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:bg-primary/5 hover:text-primary shrink-0"
                >
                  Manage Content <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {dashboardData?.latestNews &&
              dashboardData.latestNews.length > 0 ? (
                <div className="divide-y divide-border/50">
                  {dashboardData.latestNews.map((news) => (
                    <div
                      key={news.id}
                      className="p-5 flex items-start gap-4 hover:bg-muted/30 transition-colors group"
                    >
                      <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-all">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-bold text-foreground leading-snug group-hover:text-primary transition-colors cursor-pointer line-clamp-1">
                          {news.title_en}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                          <span className="flex items-center gap-1.5">
                            <Users className="h-3 w-3" />
                            {news.author || "Global Editor"}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-border" />
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(news.published_at), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/cms/news/${news.id}`}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center text-muted-foreground">
                  No published articles found.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Space */}
        <div className="lg:col-span-4 space-y-8">
          {/* Quick Actions */}
          <Card className="border-border/50 shadow-lg shadow-primary/5 bg-background relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
            <CardHeader className="border-b border-border/50 pb-4">
              <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-5 grid grid-cols-2 gap-4">
              {[
                {
                  href: "/cms/leagues/create",
                  label: "New League",
                  icon: Trophy,
                  color: "text-primary",
                  bg: "bg-primary/10",
                },
                {
                  href: "/cms/news/create",
                  label: "Write News",
                  icon: FileText,
                  color: "text-orange-500",
                  bg: "bg-orange-500/10",
                },
                {
                  href: "/cms/teams/create",
                  label: "Add Team",
                  icon: Shield,
                  color: "text-blue-500",
                  bg: "bg-blue-500/10",
                },
                {
                  href: "/cms/matches/create",
                  label: "New Match",
                  icon: Calendar,
                  color: "text-emerald-500",
                  bg: "bg-emerald-500/10",
                },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="group flex flex-col items-center gap-3 p-4 rounded-2xl border border-border/50 hover:border-primary/50 hover:bg-muted/50 transition-all duration-300"
                >
                  <div
                    className={cn(
                      "h-12 w-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                      action.bg
                    )}
                  >
                    <action.icon className={cn("h-6 w-6", action.color)} />
                  </div>
                  <span className="text-xs font-bold text-center group-hover:text-primary transition-colors">
                    {action.label}
                  </span>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity Feed */}
          <Card className="border-border/50 shadow-sm bg-background">
            <CardHeader className="border-b border-border/50 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">
                  Activity Feed
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground animate-pulse" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {dashboardData?.recentActivities &&
              dashboardData.recentActivities.length > 0 ? (
                <div className="relative p-6 space-y-8 before:absolute before:left-[21px] before:top-8 before:bottom-8 before:w-px before:bg-border/50">
                  {dashboardData.recentActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="relative pl-8 flex flex-col gap-1 group"
                    >
                      <div
                        className={cn(
                          "absolute left-0 top-1 h-3 w-3 rounded-full ring-4 bg-background z-10 transition-transform group-hover:scale-125",
                          getActivityColor(activity.type).replace(
                            "bg-",
                            "ring-"
                          ) + "/20",
                          getActivityColor(activity.type)
                        )}
                      />
                      <p className="text-sm font-semibold leading-none group-hover:text-primary transition-colors">
                        {activity.message}
                      </p>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest mt-1">
                        {formatDistanceToNow(new Date(activity.timestamp), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center text-sm text-muted-foreground">
                  No activity captured recently.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
