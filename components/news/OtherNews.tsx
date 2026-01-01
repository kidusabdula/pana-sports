"use client";

import { useHomeNews } from "@/lib/hooks/public/useNews";
import { transformNewsList } from "@/lib/utils/transformers";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function OtherNews() {
  const { data: news, isLoading } = useHomeNews();

  if (isLoading) return null;

  // Get news items after the first 5 (which are shown in main section)
  const transformedNews = transformNewsList(news || []);
  const otherNews = transformedNews.slice(5, 11); // Items 6-11 for 2x3 grid

  if (otherNews.length === 0) return null;

  return (
    <section className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">More Stories</h3>
        <Link
          href="/news"
          className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
        >
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {otherNews.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link href={`/news/${item.id}`} className="group block">
              <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                <Image
                  src={item.image || "/placeholder.jpg"}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h4 className="text-sm font-medium text-zinc-200 line-clamp-2 group-hover:text-primary transition-colors">
                {item.title}
              </h4>
              <p className="text-xs text-zinc-500 mt-1">{item.category}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
