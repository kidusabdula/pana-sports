import CommentTable from "@/components/cms/comments/CommentTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comments | Pana Sports CMS",
  description: "Manage user comments and moderation",
};

export default function CommentsPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Comments
        </h1>
        <p className="mt-2 text-muted-foreground">
          Moderate user comments, flag inappropriate content, and manage discussions.
        </p>
      </div>

      <CommentTable />
    </div>
  );
}
