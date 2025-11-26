// components/news/NewsDetail.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Share2, ArrowLeft, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface NewsDetailProps {
  news: {
    id: number;
    title: string;
    category: string;
    image: string;
    date: string;
    author: string;
    content: string;
  };
}

export default function NewsDetail({ news }: NewsDetailProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Button
          variant="ghost"
          className="mb-8 text-zinc-400 hover:text-white hover:bg-white/5 flex items-center gap-2 rounded-full px-4"
          asChild
        >
          <Link href="/news">
            <ArrowLeft className="w-4 h-4" />
            Back to Feed
          </Link>
        </Button>
      </motion.div>

      <article>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden mb-12"
        >
          <Image
            src={news.image}
            alt={news.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />

          <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full md:w-3/4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Badge className="bg-primary hover:bg-primary text-white border-none text-sm px-4 py-1.5 mb-6 uppercase tracking-wider font-bold shadow-lg shadow-primary/20">
                {news.category}
              </Badge>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 drop-shadow-lg">
                {news.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-zinc-200 font-medium">
                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                  <User className="w-4 h-4 text-primary" />
                  <span>{news.author}</span>
                </div>
                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{news.date}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-2 hidden lg:block">
            <div className="sticky top-32 space-y-4">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">
                Share
              </p>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10 border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white hover:border-zinc-700"
              >
                <Share2 className="w-4 h-4" />
              </Button>
              {/* Add more social icons here if needed */}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="lg:col-span-8"
          >
            <div
              className="prose prose-lg prose-invert max-w-none 
              prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white
              prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white prose-strong:font-bold
              prose-blockquote:border-l-primary prose-blockquote:bg-zinc-900/30 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
              "
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
          </motion.div>
        </div>
      </article>
    </div>
  );
}
