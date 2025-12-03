// components/news/NewsDetail.tsx

"use client";

import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Eye,
  MessageCircle,
  User,
  Share2,
  Bookmark,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  Tag,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import NewsCard from "./NewsCard";
import { useFilteredNews } from "@/lib/hooks/public/useNews";

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
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  // Fetch related news from the same category
  const { data: relatedNews } = useFilteredNews(news.category);

  // Filter out current article and limit to 3 related articles
  const filteredRelatedNews = relatedNews
    ?.filter((article) => article.id !== news.id)
    .slice(0, 3);

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
        news.title
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

      {/* Tags Section */}
      {news.tags && news.tags.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="h-4 w-4 text-muted-foreground" />
            {news.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Separator className="my-6 md:my-8" />

      {/* Social Share Section */}
      <Card className="mb-8 bg-zinc-900/40 backdrop-blur-xl border-white/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            Share This Article
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={shareToFacebook}
              className="flex items-center gap-2 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
            >
              <Facebook className="h-4 w-4" />
              Facebook
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={shareToTwitter}
              className="flex items-center gap-2 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-colors"
            >
              <Twitter className="h-4 w-4" />
              Twitter
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={shareToLinkedIn}
              className="flex items-center gap-2 hover:bg-blue-700 hover:text-white hover:border-blue-700 transition-colors"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={copyLink}
              className="flex items-center gap-2 hover:bg-primary hover:text-white hover:border-primary transition-colors"
            >
              <LinkIcon className="h-4 w-4" />
              Copy Link
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Author Bio Section */}
      {news.author_bio && (
        <Card className="mb-8 bg-zinc-900/40 backdrop-blur-xl border-white/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={news.author_avatar} alt={news.author} />
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2">About {news.author}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {news.author_bio}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Separator className="my-6 md:my-8" />

      {/* Amharic Content - Render HTML directly */}
      <div className="space-y-4 mb-8 md:mb-12">
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

      <Separator className="my-8 md:my-12" />

      {/* Related News Section */}
      {filteredRelatedNews && filteredRelatedNews.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold">Related Articles</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRelatedNews.map((article, index) => (
              <NewsCard
                key={article.id}
                news={article}
                variant="default"
                index={index}
              />
            ))}
          </div>
        </section>
      )}

      {/* Engagement CTA */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">Stay Updated</h3>
            <p className="text-muted-foreground">
              Get the latest Ethiopian sports news delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto">
              <Button className="w-full sm:w-auto">
                <MessageCircle className="h-4 w-4 mr-2" />
                Join Discussion
              </Button>
              <Button variant="outline" className="w-full sm:w-auto">
                <Bookmark className="h-4 w-4 mr-2" />
                Save for Later
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Share notification */}
      {shareUrl && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg z-50 animate-in slide-in-from-bottom-5">
          {shareUrl}
        </div>
      )}
    </article>
  );
}
