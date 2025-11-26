// components/news/NewsFilter.tsx
"use client";

import { motion } from "framer-motion";
import { getCategories } from "@/lib/newsData";
import { cn } from "@/lib/utils";

interface NewsFilterProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export default function NewsFilter({
  activeCategory,
  setActiveCategory,
}: NewsFilterProps) {
  const categories = ["All", ...getCategories()];

  return (
    <div className="mb-10 overflow-x-auto pb-4 scrollbar-hide">
      <div className="flex items-center gap-2 min-w-max">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              "relative px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-300",
              activeCategory === category
                ? "text-white"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            )}
          >
            {activeCategory === category && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 bg-primary rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{category}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
