"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import TransferForm from "@/components/cms/transfers/TransferForm";
import { useTransfer } from "@/lib/hooks/cms/useTransfers";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRightLeft } from "lucide-react";

export default function EditTransferPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: transfer, isLoading, error } = useTransfer(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !transfer) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-destructive">
            <ArrowRightLeft className="h-5 w-5" />
            <span>
              Error loading transfer:{" "}
              {error instanceof Error ? error.message : "Transfer not found"}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <TransferForm
        transfer={transfer}
        onSuccess={() => router.push("/cms/transfers")}
        onCancel={() => router.back()}
      />
    </div>
  );
}
