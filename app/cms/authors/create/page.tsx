"use client";

import { useRouter } from "next/navigation";
import AuthorForm from "@/components/cms/authors/AuthorForm";

export default function CreateAuthorPage() {
  const router = useRouter();

  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <AuthorForm
        onSuccess={() => router.push("/cms/authors")}
        onCancel={() => router.back()}
      />
    </div>
  );
}
