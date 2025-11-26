import AuthorTable from "@/components/cms/authors/AuthorTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authors | Pana Sports CMS",
  description: "Manage news authors",
};

export default function AuthorsPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Authors
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage news article authors and contributors.
        </p>
      </div>

      <AuthorTable />
    </div>
  );
}
