import MatchEventTable from "@/components/cms/match-events/MatchEventTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Match Events | Pana Sports CMS",
  description: "Manage match events",
};

export default function MatchEventsPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Match Events
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage match events like goals, cards, and substitutions.
        </p>
      </div>

      <MatchEventTable />
    </div>
  );
}