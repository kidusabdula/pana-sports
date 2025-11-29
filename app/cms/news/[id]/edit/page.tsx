"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import NewsForm from "@/components/cms/news/NewsForm";
import { useNewsItem } from "@/lib/hooks/cms/useNews";
import { Card, CardContent } from "@/components/ui/card";
import { Newspaper } from "lucide-react";

export default function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: news, isLoading, error } = useNewsItem(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-destructive">
            <Newspaper className="h-5 w-5" />
            <span>
              Error loading article:{" "}
              {error instanceof Error ? error.message : "Article not found"}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <NewsForm
        news={news}
        onSuccess={() => router.push("/cms/news")}
        onCancel={() => router.back()}
      />
    </div>
  );
}
