import { Metadata } from "next";
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
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard | Pana Sports CMS",
  description: "Pana Sports CMS Dashboard",
};

export default function DashboardPage() {
  // In a real implementation, these would be fetched from the API
  const stats = [
    {
      title: "Leagues",
      value: 4,
      description: "Active football leagues",
      icon: Trophy,
      color: "text-primary",
      bgClass: "bg-primary/10",
      borderClass: "border-primary/20",
      gradientClass: "bg-linear-to-br from-primary/5 to-primary/10",
    },
    {
      title: "Teams",
      value: 16,
      description: "Registered teams",
      icon: Shield,
      color: "text-blue-500",
      bgClass: "bg-blue-500/10",
      borderClass: "border-blue-500/20",
      gradientClass: "bg-linear-to-br from-blue-500/5 to-blue-500/10",
    },
    {
      title: "Matches",
      value: 120,
      description: "Total matches scheduled",
      icon: Calendar,
      color: "text-green-500",
      bgClass: "bg-green-500/10",
      borderClass: "border-green-500/20",
      gradientClass: "bg-linear-to-br from-green-500/5 to-green-500/10",
    },
    {
      title: "News",
      value: 48,
      description: "Published articles",
      icon: FileText,
      color: "text-orange-500",
      bgClass: "bg-orange-500/10",
      borderClass: "border-orange-500/20",
      gradientClass: "bg-linear-to-br from-orange-500/5 to-orange-500/10",
    },
    {
      title: "Comments",
      value: 256,
      description: "User comments",
      icon: MessageSquare,
      color: "text-purple-500",
      bgClass: "bg-purple-500/10",
      borderClass: "border-purple-500/20",
      gradientClass: "bg-linear-to-br from-purple-500/5 to-purple-500/10",
    },
    {
      title: "Users",
      value: 8,
      description: "Active users",
      icon: Users,
      color: "text-pink-500",
      bgClass: "bg-pink-500/10",
      borderClass: "border-pink-500/20",
      gradientClass: "bg-linear-to-br from-pink-500/5 to-pink-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to Pana Sports CMS. Here&apos;s an overview of your content.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
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
                  <div className="text-3xl font-bold">{stat.value}</div>
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
            <div className="divide-y divide-border/50">
              <div className="flex items-start gap-4 p-6 hover:bg-muted/20 transition-colors">
                <div className="mt-1 h-2 w-2 rounded-full bg-blue-500 ring-4 ring-blue-500/20" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    New league &quot;U-20 National Team&quot; created
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 hover:bg-muted/20 transition-colors">
                <div className="mt-1 h-2 w-2 rounded-full bg-green-500 ring-4 ring-green-500/20" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Match &quot;Saint George vs Fasil Kenema&quot; updated
                  </p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 hover:bg-muted/20 transition-colors">
                <div className="mt-1 h-2 w-2 rounded-full bg-purple-500 ring-4 ring-purple-500/20" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    News article &quot;Transfer Window Updates&quot; published
                  </p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
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
