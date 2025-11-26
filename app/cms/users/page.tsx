import UserTable from "@/components/cms/users/UserTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users | Pana Sports CMS",
  description: "Manage user accounts and roles",
};

export default function UsersPage() {
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Users
        </h1>
        <p className="mt-2 text-muted-foreground">
          View and manage user accounts and assign roles.
        </p>
      </div>

      <UserTable />
    </div>
  );
}
