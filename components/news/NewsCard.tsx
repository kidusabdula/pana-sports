// components/client/NewsCard.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Clock, User, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// Updated interface to match transformed news object
interface NewsCardProps {
  news: {
    id: string;
    title: string;
    title_am?: string;
    category: string;
    image: string;
    date: string;
    author: string;
    author_avatar?: string;
    excerpt: string;
    content?: string;
    content_am?: string;
    views?: number;
    comments_count?: number;
    league?: string;
    league_slug?: string;
  };
  variant?: "default" | "featured" | "compact" | "minimal" | "horizontal";
  index?: number;
}

export default function NewsCard({
  news,
  variant = "default",
  index = 0,
}: NewsCardProps) {
  if (variant === "featured") {
    return (
      <Link href={`/news/${news.id}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="group relative rounded-3xl overflow-hidden cursor-pointer h-[500px] w-full"
        >
          <Image
            src={news.image}
            alt={news.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90" />

          <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full md:w-3/4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-primary hover:bg-primary text-white border-none text-xs px-3 py-1 uppercase tracking-wider font-semibold">
                  {news.category || 'General'}
                </Badge>
                <span className="text-sm text-zinc-300 flex items-center gap-1.5 font-medium">
                  <Clock className="w-4 h-4" /> {news.date}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-4 group-hover:text-primary transition-colors">
                {news.title}
              </h1>
              <p className="text-base md:text-lg text-zinc-300 line-clamp-2 max-w-2xl leading-relaxed">
                {news.excerpt}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </Link>
    );
  }

  if (variant === "minimal") {
    return (
      <Link href={`/news/${news.id}`}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group flex gap-4 items-center p-3 rounded-xl hover:bg-white/5 transition-colors"
        >
          <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden">
            <Image
              src={news.image}
              alt={news.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                {news.category || 'General'}
              </span>
              <span className="text-[10px] text-zinc-500">•</span>
              <span className="text-[10px] text-zinc-500">{news.date}</span>
            </div>
            <h4 className="text-sm font-bold text-zinc-200 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
              {news.title}
            </h4>
          </div>
        </motion.div>
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <Link href={`/news/${news.id}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="group grid grid-cols-12 gap-6 p-4 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5"
        >
          <div className="col-span-12 md:col-span-4 relative h-48 md:h-full min-h-[200px] rounded-xl overflow-hidden">
            <Image
              src={news.image}
              alt={news.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-3 left-3">
              <Badge className="bg-black/50 backdrop-blur-md hover:bg-black/70 text-white border-white/10 text-xs">
                {news.category || 'General'}
              </Badge>
            </div>
          </div>
          <div className="col-span-12 md:col-span-8 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-3 text-xs text-zinc-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {news.date}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" /> {news.author}
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors leading-tight">
              {news.title}
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2 mb-4">
              {news.excerpt}
            </p>
            <div className="flex items-center text-primary text-sm font-medium group-hover:translate-x-1 transition-transform w-fit">
              Read Article <ArrowUpRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  // Default Card
  return (
    <Link href={`/news/${news.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        className="group h-full bg-zinc-900/40 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col"
      >
        <div className="relative h-52 overflow-hidden">
          <Image
            src={news.image}
            alt={news.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60" />
          <Badge className="absolute top-3 left-3 bg-black/50 backdrop-blur-md hover:bg-black/70 text-white border-white/10 text-xs px-2.5 py-1">
            {news.category || 'General'}
          </Badge>
        </div>
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-3 text-xs text-zinc-500 mb-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {news.date}
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug flex-1">
            {news.title}
          </h3>
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
            <span className="text-xs text-zinc-400 flex items-center gap-1.5">
              <User className="w-3 h-3" /> {news.author}
            </span>
            <span className="p-1.5 rounded-full bg-white/5 group-hover:bg-primary group-hover:text-white transition-colors text-zinc-400">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}