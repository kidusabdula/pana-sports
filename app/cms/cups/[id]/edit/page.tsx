"use client";

import { useParams, useRouter } from "next/navigation";
import { useCup, useUpdateCup } from "@/lib/hooks/cms/useCups";
import { CupForm } from "@/components/cms/cups/CupForm";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { use } from "react";

export default function EditCupPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { data: cup, isLoading, error } = useCup(id);
  const { mutate: updateCup, isPending: isUpdating } = useUpdateCup();

  const onSubmit = (data: any) => {
    updateCup(
      { id, data },
      {
        onSuccess: () => {
          toast.success("Competition updated successfully");
          router.push(`/cms/cups/${id}`);
        },
        onError: (err) => {
          toast.error(err.message || "Failed to update cup");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-vh-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium">
          Loading competition details...
        </p>
      </div>
    );
  }

  if (error || !cup) {
    return (
      <div className="flex flex-col items-center justify-center min-vh-[400px] text-center p-8 bg-red-500/5 rounded-3xl border border-red-500/10">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">
          Failed to load cup
        </h2>
        <p className="text-muted-foreground mb-6 max-w-sm">
          {error?.message || "Tournament could not be found."}
        </p>
        <Button
          asChild
          variant="outline"
          className="border-red-500/20 hover:bg-red-500/10"
        >
          <Link href="/cms/cups">Return to Cups</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-8">
      <div className="flex items-center gap-4">
        <Button
          asChild
          variant="outline"
          size="icon"
          className="h-10 w-10 border-border bg-card hover:bg-muted"
        >
          <Link href={`/cms/cups/${id}`}>
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Edit Competition
          </h1>
          <p className="text-muted-foreground">
            Updating{" "}
            <span className="text-primary font-semibold">{cup.name_en}</span>{" "}
            settings.
          </p>
        </div>
      </div>

      <CupForm initialData={cup} onSubmit={onSubmit} isPending={isUpdating} />
    </div>
  );
}
