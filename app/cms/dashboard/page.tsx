"use client";

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
  MessageSquare,
  Activity,
  ArrowRight,
  Shield,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useDashboardStats } from "@/lib/hooks/useDashboardStats";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
  const { data: dashboardData, isLoading, error } = useDashboardStats();

  // Define stat configurations
  const statConfigs = [
    {
      key: "leagues" as const,
      title: "Leagues",
      description: "Active football leagues",
      icon: Trophy,
      color: "text-primary",
      bgClass: "bg-primary/10",
      borderClass: "border-primary/20",
      gradientClass: "bg-linear-to-br from-primary/5 to-primary/10",
    },
    {
      key: "teams" as const,
      title: "Teams",
      description: "Registered teams",
      icon: Shield,
      color: "text-blue-500",
      bgClass: "bg-blue-500/10",
      borderClass: "border-blue-500/20",
      gradientClass: "bg-linear-to-br from-blue-500/5 to-blue-500/10",
    },
    {
      key: "matches" as const,
      title: "Matches",
      description: "Total matches scheduled",
      icon: Calendar,
      color: "text-green-500",
      bgClass: "bg-green-500/10",
      borderClass: "border-green-500/20",
      gradientClass: "bg-linear-to-br from-green-500/5 to-green-500/10",
    },
    {
      key: "news" as const,
      title: "News",
      description: "Published articles",
      icon: FileText,
      color: "text-orange-500",
      bgClass: "bg-orange-500/10",
      borderClass: "border-orange-500/20",
      gradientClass: "bg-linear-to-br from-orange-500/5 to-orange-500/10",
    },
    {
      key: "comments" as const,
      title: "Comments",
      description: "User comments",
      icon: MessageSquare,
      color: "text-purple-500",
      bgClass: "bg-purple-500/10",
      borderClass: "border-purple-500/20",
      gradientClass: "bg-linear-to-br from-purple-500/5 to-purple-500/10",
    },
    {
      key: "users" as const,
      title: "Users",
      description: "Active users",
      icon: Users,
      color: "text-pink-500",
      bgClass: "bg-pink-500/10",
      borderClass: "border-pink-500/20",
      gradientClass: "bg-linear-to-br from-pink-500/5 to-pink-500/10",
    },
  ];

  // Get activity color based on type
  const getActivityColor = (type: string) => {
    switch (type) {
      case "league":
        return "bg-blue-500";
      case "match":
        return "bg-green-500";
      case "news":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome to Pana Sports CMS. Here&apos;s an overview of your content.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {statConfigs.map((stat, index) => (
            <Card
              key={index}
              className={cn(
                "overflow-hidden transition-all",
                stat.borderClass,
                stat.gradientClass
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <div className="text-3xl font-bold">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground/80">
                      {stat.description}
                    </p>
                  </div>
                  <div className={cn("p-3 rounded-xl", stat.bgClass)}>
                    <stat.icon className={cn("h-6 w-6", stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome to Pana Sports CMS. Here&apos;s an overview of your content.
          </p>
        </div>

        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div>
                <h3 className="font-semibold text-destructive">
                  Failed to load dashboard data
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {error instanceof Error
                    ? error.message
                    : "An unexpected error occurred"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to Pana Sports CMS. Here&apos;s an overview of your content.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statConfigs.map((stat, index) => (
          <Card
            key={index}
            className={cn(
              "overflow-hidden transition-all hover:shadow-md",
              stat.borderClass,
              stat.gradientClass
            )}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <div className="text-3xl font-bold">
                    {dashboardData?.[stat.key] ?? 0}
                  </div>
                  <p className="text-xs text-muted-foreground/80">
                    {stat.description}
                  </p>
                </div>
                <div className={cn("p-3 rounded-xl", stat.bgClass)}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4 shadow-sm border-border/50">
          <CardHeader className="border-b border-border/50 bg-muted/20">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest updates across the system
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {dashboardData?.recentActivities &&
            dashboardData.recentActivities.length > 0 ? (
              <div className="divide-y divide-border/50">
                {dashboardData.recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-6 hover:bg-muted/20 transition-colors"
                  >
                    <div
                      className={cn(
                        "mt-1 h-2 w-2 rounded-full ring-4",
                        getActivityColor(activity.type),
                        `ring-${getActivityColor(activity.type)}/20`
                      )}
                    />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.timestamp), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No recent activity
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-3 shadow-sm border-border/50">
          <CardHeader className="border-b border-border/50 bg-muted/20">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold">
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common tasks you might want to perform
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <Link href="/cms/leagues/create" className="group block">
              <div className="flex items-center gap-4 p-3 rounded-xl border border-border/50 bg-card hover:bg-muted/50 hover:border-primary/30 transition-all duration-300">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium group-hover:text-primary transition-colors">
                    Create New League
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Add a new football league
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link href="/cms/teams/create" className="group block">
              <div className="flex items-center gap-4 p-3 rounded-xl border border-border/50 bg-card hover:bg-muted/50 hover:border-blue-500/30 transition-all duration-300">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Shield className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium group-hover:text-blue-500 transition-colors">
                    Add New Team
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Register a new team
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link href="/cms/matches/create" className="group block">
              <div className="flex items-center gap-4 p-3 rounded-xl border border-border/50 bg-card hover:bg-muted/50 hover:border-green-500/30 transition-all duration-300">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                  <Calendar className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium group-hover:text-green-500 transition-colors">
                    Schedule Match
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Create a new match
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link href="/cms/news/create" className="group block">
              <div className="flex items-center gap-4 p-3 rounded-xl border border-border/50 bg-card hover:bg-muted/50 hover:border-orange-500/30 transition-all duration-300">
                <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                  <FileText className="h-5 w-5 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium group-hover:text-orange-500 transition-colors">
                    Publish News
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Create a news article
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
