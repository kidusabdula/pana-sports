"use client";

import { useRouter } from "next/navigation";
import NewsForm from "@/components/cms/news/NewsForm";

export default function CreateNewsPage() {
  const router = useRouter();

  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <NewsForm
        onSuccess={() => router.push("/cms/news")}
        onCancel={() => router.back()}
      />
    </div>
  );
}
