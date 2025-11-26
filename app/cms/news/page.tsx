import NewsTable from "@/components/cms/news/NewsTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "News | Pana Sports CMS",
  description: "Manage news articles",
};

export default function NewsPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          News
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage news articles, announcements, and updates.
        </p>
      </div>

      <NewsTable />
    </div>
  );
}
