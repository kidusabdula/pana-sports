import TransferTable from "@/components/cms/transfers/TransferTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transfers | Pana Sports CMS",
  description: "Manage player transfers",
};

export default function TransfersPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Transfers
        </h1>
        <p className="mt-2 text-muted-foreground">
          Track and manage player transfers between teams.
        </p>
      </div>

      <TransferTable />
    </div>
  );
}
