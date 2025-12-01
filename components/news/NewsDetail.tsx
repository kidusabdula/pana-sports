// components/news/NewsDetail.tsx

"use client";

import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Calendar, Eye, MessageCircle, User, Share2, Bookmark } from "lucide-react";
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
    <article className="max-w-4xl mx-auto">
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          {news.category && (
            <Badge variant="secondary" className="capitalize">
              {news.category}
            </Badge>
          )}
          {news.league && (
            <Badge variant="outline" className="capitalize">
              {news.league}
            </Badge>
          )}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          {news.title}
        </h1>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {news.author && (
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={news.author_avatar} alt={news.author} />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
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
          
          <div className="flex items-center gap-4">
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
                <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {news.image && (
        <div className="mb-8">
          <img
            src={news.image}
            alt={news.title}
            className="w-full h-auto rounded-lg"
          />
        </div>
      )}
      
      {/* English Content - Render HTML directly */}
      <div className="prose prose-lg max-w-none dark:prose-invert mb-12">
        <div 
          dangerouslySetInnerHTML={{ __html: news.content || "" }}
          className="tiptap-content"
        />
      </div>
      
      <Separator className="my-8" />
      
      {/* Amharic Content - Render HTML directly */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">
          {news.title_am}
        </h2>
        
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <div 
            dangerouslySetInnerHTML={{ __html: news.content_am || "" }}
            className="tiptap-content"
          />
        </div>
      </div>
      
      {/* Share notification */}
      {shareUrl && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg">
          {shareUrl}
        </div>
      )}
    </article>
  );
}