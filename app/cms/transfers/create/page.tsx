"use client";

import { useRouter } from "next/navigation";
import TransferForm from "@/components/cms/transfers/TransferForm";

export default function CreateTransferPage() {
  const router = useRouter();

  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <TransferForm
        onSuccess={() => router.push("/cms/transfers")}
        onCancel={() => router.back()}
      />
    </div>
  );
}
