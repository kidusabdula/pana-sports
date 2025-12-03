// components/news/NewsDetail.tsx

"use client";

import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Eye,
  MessageCircle,
  User,
  Share2,
  Bookmark,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

// Update the interface to match the transformed news object
interface NewsDetailProps {
  news: {
    id: string;
    title: string;
    title_am: string;
    category: string;
    image: string;
    date: string;
    author: string;
    author_avatar?: string;
    excerpt: string;
    content: string;
    content_am: string;
    views: number;
    comments_count: number;
    league?: string;
  };
}

export default function NewsDetail({ news }: NewsDetailProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  // Handle bookmark functionality
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // In a real app, you would save this to the user's profile or local storage
  };

  // Handle share functionality
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: news.title,
        text: `Read this article on Pana Sports: ${news.title}`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      setShareUrl("Link copied to clipboard!");
      setTimeout(() => setShareUrl(""), 2000);
    }
  };

  return (
    <article className="px-4 md:px-0">
      <header className="mb-6 md:mb-8">
        <div className="flex items-center gap-2 mb-3 md:mb-4">
          {news.category && (
            <Badge
              variant="secondary"
              className="capitalize text-xs md:text-sm"
            >
              {news.category}
            </Badge>
          )}
          {news.league && (
            <Badge variant="outline" className="capitalize text-xs md:text-sm">
              {news.league}
            </Badge>
          )}
        </div>

        <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-4 leading-tight">
          {news.title}
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {news.author && (
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 md:h-10 md:w-10">
                  <AvatarImage src={news.author_avatar} alt={news.author} />
                  <AvatarFallback>
                    <User className="h-4 w-4 md:h-5 md:w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{news.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(news.date), "MMMM d, yyyy")}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-zinc-800 pt-3 sm:pt-0">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {news.views}
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                {news.comments_count}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="h-8 w-8"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBookmark}
                className={`h-8 w-8 ${isBookmarked ? "text-primary" : ""}`}
              >
                <Bookmark
                  className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
                />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {news.image && (
        <div className="mb-6 md:mb-8 -mx-4 md:mx-0">
          <img
            src={news.image}
            alt={news.title}
            className="w-full h-auto md:rounded-lg"
          />
        </div>
      )}

      {/* English Content - Render HTML directly */}
      <div className="prose prose-base md:prose-lg max-w-none dark:prose-invert mb-8 md:mb-12">
        <div
          dangerouslySetInnerHTML={{ __html: news.content || "" }}
          className="tiptap-content"
        />
      </div>

      <Separator className="my-6 md:my-8" />

      {/* Amharic Content - Render HTML directly */}
      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight">
          {news.title_am}
        </h2>

        <div className="prose prose-base md:prose-lg max-w-none dark:prose-invert">
          <div
            dangerouslySetInnerHTML={{ __html: news.content_am || "" }}
            className="tiptap-content"
          />
        </div>
      </div>

      {/* Share notification */}
      {shareUrl && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg z-50">
          {shareUrl}
        </div>
      )}
    </article>
  );
}