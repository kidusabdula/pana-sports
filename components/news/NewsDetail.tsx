// components/news/NewsDetail.tsx

"use client";

import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Eye,
  MessageCircle,
  User,
  Share2,
  Bookmark,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import { motion } from "framer-motion";

// Update the interface to match the transformed news object
interface NewsDetailProps {
  news: {
    id: string;
    title: string;
    title_am: string;
    category: string;
    category_id?: string;
    image: string;
    date: string;
    author: string;
    author_avatar?: string;
    author_bio?: string;
    excerpt: string;
    content: string;
    content_am: string;
    views: number;
    comments_count: number;
    league?: string;
    tags?: string[];
  };
}

export default function NewsDetail({ news }: NewsDetailProps) {
  const { language } = useLanguage();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  // Determine content based on language
  const isAmharic = language === "am";
  const displayTitle = isAmharic && news.title_am ? news.title_am : news.title;
  const displayContent =
    isAmharic && news.content_am ? news.content_am : news.content;

  // Handle bookmark functionality
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // In a real app, you would save this to the user's profile or local storage
  };

  // Handle share functionality
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: displayTitle,
        text: `Read this article on Pana Sports: ${displayTitle}`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      setShareUrl("Link copied to clipboard!");
      setTimeout(() => setShareUrl(""), 2000);
    }
  };

  // Social media share handlers
  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        window.location.href
      )}`,
      "_blank"
    );
  };

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        displayTitle
      )}&url=${encodeURIComponent(window.location.href)}`,
      "_blank"
    );
  };

  const shareToLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        window.location.href
      )}`,
      "_blank"
    );
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareUrl("Link copied to clipboard!");
    setTimeout(() => setShareUrl(""), 2000);
  };

  return (
    <article className="relative">
      {/* Background Glow Effects to match NewsPage */}
      <div className="fixed top-20 right-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] -z-10 rounded-full pointer-events-none" />

      <header className="mb-8 md:mb-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-4 md:mb-6"
        >
          {news.category && (
            <Badge className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 text-xs px-3 py-1 uppercase tracking-wider font-bold backdrop-blur-md">
              {news.category}
            </Badge>
          )}
          {news.league && (
            <Badge
              variant="outline"
              className="border-white/10 text-zinc-400 capitalize text-xs hover:bg-white/5"
            >
              {news.league}
            </Badge>
          )}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 md:mb-8 leading-[1.1] text-white"
        >
          {displayTitle}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-y border-white/5 py-6 backdrop-blur-sm bg-black/20 rounded-xl px-4"
        >
          <div className="flex items-center gap-4">
            {news.author && (
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 md:h-12 md:w-12 ring-2 ring-white/10">
                  <AvatarImage src={news.author_avatar} alt={news.author} />
                  <AvatarFallback className="bg-zinc-800 text-zinc-400">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold text-white">{news.author}</p>
                  <p className="text-xs text-zinc-400 font-medium">
                    {format(new Date(news.date), "MMMM d, yyyy")}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-6">
            <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 uppercase tracking-wide">
              <div className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                {news.views.toLocaleString()} Views
              </div>
              <div className="flex items-center gap-1.5">
                <MessageCircle className="h-4 w-4" />
                {news.comments_count} Comments
              </div>
            </div>

            <div className="h-8 w-px bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="h-9 w-9 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBookmark}
                className={`h-9 w-9 rounded-full ${
                  isBookmarked
                    ? "text-primary bg-primary/10"
                    : "text-zinc-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <Bookmark
                  className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
                />
              </Button>
            </div>
          </div>
        </motion.div>
      </header>

      {news.image && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8 md:mb-12 rounded-2xl md:rounded-3xl overflow-hidden border border-white/5 shadow-2xl relative"
        >
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none z-10" />
          <img
            src={news.image}
            alt={news.title}
            className="w-full h-auto object-cover"
          />
        </motion.div>
      )}

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-10 text-zinc-300 prose-headings:text-white prose-a:text-primary prose-strong:text-white prose-blockquote:border-primary prose-blockquote:bg-white/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-img:rounded-xl"
      >
        <div
          dangerouslySetInnerHTML={{ __html: displayContent || "" }}
          className="tiptap-content font-light leading-relaxed tracking-wide"
        />
      </motion.div>

      {/* Tags Section */}
      {news.tags && news.tags.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-10 flex flex-wrap gap-2"
        >
          {news.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-zinc-400 hover:bg-primary/20 hover:text-primary transition-colors cursor-pointer border border-white/5"
            >
              #{tag}
            </span>
          ))}
        </motion.div>
      )}

      <Separator className="my-8 md:my-10 bg-white/5" />

      {/* Social Share Section */}
      <Card className="mb-10 bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
        <CardHeader className="bg-white/2 border-b border-white/5 pb-4">
          <CardTitle className="text-lg flex items-center gap-2 text-white">
            <Share2 className="h-5 w-5 text-primary" />
            Share This Article
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={shareToFacebook}
              className="flex items-center gap-2 bg-transparent border-white/10 text-zinc-300 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-colors rounded-full"
            >
              <Facebook className="h-4 w-4" />
              Facebook
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={shareToTwitter}
              className="flex items-center gap-2 bg-transparent border-white/10 text-zinc-300 hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-colors rounded-full"
            >
              <Twitter className="h-4 w-4" />
              Twitter
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={shareToLinkedIn}
              className="flex items-center gap-2 bg-transparent border-white/10 text-zinc-300 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-colors rounded-full"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={copyLink}
              className="flex items-center gap-2 bg-transparent border-white/10 text-zinc-300 hover:bg-primary hover:text-white hover:border-primary transition-colors rounded-full"
            >
              <LinkIcon className="h-4 w-4" />
              Copy Link
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Author Bio Section */}
      {news.author_bio && (
        <Card className="mb-10 bg-zinc-900/40 backdrop-blur-xl border-white/5 overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 border-2 border-white/10">
                <AvatarImage src={news.author_avatar} alt={news.author} />
                <AvatarFallback className="bg-zinc-800">
                  <User className="h-8 w-8 text-zinc-500" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2 text-white">
                  About {news.author}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {news.author_bio}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Related News Section */}
      {/* Engagement CTA */}
      <Card className="bg-linear-to-r from-primary/10 to-primary/5 border-primary/20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <CardContent className="pt-8 pb-8 relative z-10">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-black text-white">Stay in the Game</h3>
            <p className="text-zinc-400 max-w-md mx-auto">
              Get the latest Ethiopian sports news, match analysis, and
              exclusive interviews delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto pt-2">
              <Button
                className="w-full sm:w-auto font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                size="lg"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Join Discussion
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto border-white/10 bg-black/20 hover:bg-white/10 text-white font-medium"
                size="lg"
              >
                <Bookmark className="h-4 w-4 mr-2" />
                Save Article
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Share notification */}
      {shareUrl && (
        <div className="fixed bottom-4 right-4 bg-primary text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-in slide-in-from-bottom-5 font-medium border border-white/20">
          {shareUrl}
        </div>
      )}
    </article>
  );
}
