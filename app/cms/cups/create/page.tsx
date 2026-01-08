"use client";

import { CupForm } from "@/components/cms/cups/CupForm";
import { useCreateCup } from "@/lib/hooks/cms/useCups";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { CupCreate } from "@/lib/schemas/cup";

export default function CreateCupPage() {
  const router = useRouter();
  const { mutate: createCup, isPending } = useCreateCup();

  const onSubmit = (data: CupCreate) => {
    createCup(data, {
      onSuccess: (newCup) => {
        toast.success(`Cup "${newCup.name_en}" created successfully`);
        router.push("/cms/cups");
      },
      onError: (err) => {
        toast.error(err.message || "Failed to create cup");
      },
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-8">
      <div className="flex items-center gap-4">
        <Button
          asChild
          variant="outline"
          size="icon"
          className="h-10 w-10 border-border bg-card hover:bg-muted"
        >
          <Link href="/cms/cups">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Create New Cup
          </h1>
          <p className="text-muted-foreground">
            Define a new competition for your football platform.
          </p>
        </div>
      </div>

      <CupForm onSubmit={onSubmit} isPending={isPending} />
    </div>
  );
}
