"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import AuthorForm from "@/components/cms/authors/AuthorForm";
import { useAuthor } from "@/lib/hooks/useAuthors";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

export default function EditAuthorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: author, isLoading, error } = useAuthor(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-destructive">
            <User className="h-5 w-5" />
            <span>
              Error loading author:{" "}
              {error instanceof Error ? error.message : "Author not found"}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <AuthorForm
        author={author}
        onSuccess={() => router.push("/cms/authors")}
        onCancel={() => router.back()}
      />
    </div>
  );
}
