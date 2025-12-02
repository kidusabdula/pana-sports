import { redirect } from "next/navigation";
import TopScorerForm from "@/components/cms/top-scorers/TopScorerForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Top Scorer | Pana Sports CMS",
  description: "Create a new top scorer entry",
};

export default function CreateTopScorerPage() {
  // Create a server action that can be called from the client
  async function handleSuccess() {
    "use server";
    redirect("/cms/top-scorers");
  }

  async function handleCancel() {
    "use server";
    redirect("/cms/top-scorers");
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Create Top Scorer
        </h1>
        <p className="mt-2 text-muted-foreground">
          Add a new top scorer entry to the system.
        </p>
      </div>

      <TopScorerForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
}