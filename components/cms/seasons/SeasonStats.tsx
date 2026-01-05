// components/cms/seasons/SeasonStats.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Trophy,
  SwatchBook,
  Calendar,
  CheckCircle2,
  History,
} from "lucide-react";

interface SeasonStatsProps {
  teamCount: number;
  matchCount: number;
  playerCount?: number;
  isCurrent: boolean;
  isArchived: boolean;
}

export function SeasonStats({
  teamCount,
  matchCount,
  playerCount = 0,
  isCurrent,
  isArchived,
}: SeasonStatsProps) {
  const stats = [
    {
      title: "Total Teams",
      value: teamCount,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Matches Scheduled",
      value: matchCount,
      icon: Trophy,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      title: "Registered Players",
      value: playerCount,
      icon: SwatchBook,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Status",
      value: isCurrent ? "Active" : isArchived ? "Archived" : "Scheduled",
      icon: isCurrent ? CheckCircle2 : isArchived ? History : Calendar,
      color: isCurrent ? "text-green-500" : "text-slate-500",
      bg: isCurrent ? "bg-green-500/10" : "bg-slate-500/10",
      isText: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bg}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${stat.isText ? "text-lg" : ""}`}
            >
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
