import { ReactNode } from "react";
import { Sidebar } from "@/components/cms/layout/Sidebar";
import { Header } from "@/components/cms/layout/Header";
import { getCurrentUser } from "@/lib/auth";

export default async function CMSLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="cms-light-theme flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <Header user={user} />
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-muted/10">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
