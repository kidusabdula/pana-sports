// components/premier-league/NewsSection.tsx
"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getNewsByLeagueSlug } from '@/lib/data/news';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  ExternalLink, 
  MessageCircle, 
  TrendingUp, 
  Calendar, 
  User, 
  Filter,
  Share2,
  Bookmark,
  ThumbsUp,
  Heart,
  Send,
  X,
  ChevronRight,
  Eye,
  Tag
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type Props = { initialData?: any[]; leagueSlug?: string };

export default function NewsSection({ initialData = [], leagueSlug = "premier-league" }: Props) {
  const [activeTab, setActiveTab] = useState("latest");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedNews, setSelectedNews] = useState<number | null>(null);
  const [likedComments, setLikedComments] = useState<number[]>([]);
  const [bookmarkedArticles, setBookmarkedArticles] = useState<number[]>([]);
  const [newComment, setNewComment] = useState("");
  const query = useQuery({
    queryKey: ["news", leagueSlug],
    queryFn: () => getNewsByLeagueSlug(leagueSlug),
    initialData,
  });

  const items = (query.data || []).map((n: any) => ({
    id: n.id,
    title: n.title_en,
    excerpt: n.content_en ? String(n.content_en).slice(0, 160) : "",
    image: n.thumbnail_url || "/placeholder.svg",
    date: new Date(n.published_at).toLocaleDateString(),
    source: n.league?.name_en || "Pana Sports",
    category: n.category || "",
    comments: n.comments_count,
    trending: (n.views || 0) > 1000,
    author: {
      name: n.author?.name || "",
      avatar: n.author?.avatar_url || "",
      bio: "",
      social: { twitter: "", followers: 0 },
    },
    readTime: "",
    content: n.content_en || "",
    tags: [],
    relatedArticles: [],
    views: n.views || 0,
    likes: 0,
    commentsList: [] as any[],
  }))

  const latestNews = items
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const trendingNews = items
    .slice()
    .sort((a, b) => (b.views as number) - (a.views as number))

  const categories = [
    { value: "all", label: "All News" },
    { value: "match-report", label: "Match Reports" },
    { value: "transfer-news", label: "Transfer News" },
    { value: "national-team", label: "National Team" },
    { value: "analysis", label: "Analysis" },
    { value: "development", label: "Development" }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Match Report": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Transfer News": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "National Team": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Analysis": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "Development": return "bg-teal-500/20 text-teal-400 border-teal-500/30";
      default: return "bg-zinc-700/30 text-zinc-300 border-zinc-600/50";
    }
  };

  const filteredNews = (activeTab === "latest" ? latestNews : trendingNews).filter(
    (n) => filterCategory === "all" || n.category?.toLowerCase().includes(filterCategory)
  );

  const toggleLikeComment = (commentId: number) => {
    setLikedComments(prev => 
      prev.includes(commentId) 
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    );
  };

  const toggleBookmark = (articleId: number) => {
    setBookmarkedArticles(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  const handleShare = (articleId: number) => {};

  const handleAddComment = () => {};

  return (
    <>
      <Card className="bg-zinc-800/20 backdrop-blur-sm border-zinc-700/30 h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Premier League News
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 h-8 px-2">
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
          
          {/* News Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-2">
            <TabsList className="grid w-full grid-cols-2 bg-zinc-800/30 border-zinc-700/50 p-1 h-auto">
              <TabsTrigger 
                value="latest" 
                className="data-[state=active]:bg-zinc-700/50"
              >
                Latest
              </TabsTrigger>
              <TabsTrigger 
                value="trending" 
                className="data-[state=active]:bg-zinc-700/50"
              >
                Trending
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Filter Categories */}
            <div className="px-4 pb-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    variant={filterCategory === category.value ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "whitespace-nowrap shrink-0",
                      filterCategory === category.value 
                        ? "bg-primary/20 text-primary border-primary/30" 
                        : "bg-zinc-800/40 border-zinc-700/50 hover:bg-zinc-800/60"
                    )}
                    onClick={() => setFilterCategory(category.value)}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Latest News Tab */}
            <TabsContent value="latest" className="mt-0">
              <div className="space-y-4 p-4">
                {filteredNews.map((item) => (
                  <div key={item.id} className="border-b border-zinc-700/30 pb-4 last:border-0 cursor-pointer hover:bg-zinc-800/20 -mx-2 px-2 py-2 rounded-md transition-colors" onClick={() => setSelectedNews(item.id)}>
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          {item.trending && (
                            <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              <span>Trending</span>
                            </Badge>
                          )}
                          <Badge variant="outline" className={cn("text-xs", getCategoryColor(item.category))}>
                            {item.category}
                          </Badge>
                        </div>
                        <h3 className="font-medium text-sm leading-tight hover:text-primary line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {item.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{item.author.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{item.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{item.readTime}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              <span>{item.comments}</span>
                            </div>
                            <span>{item.source}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full mt-2 bg-zinc-800/30 border-zinc-700/50 hover:bg-zinc-800/50">
                  Load More News
                </Button>
              </div>
            </TabsContent>
            
            {/* Trending News Tab */}
            <TabsContent value="trending" className="mt-0">
              <div className="space-y-4 p-4">
                {filteredNews.map((item) => (
                  <div key={item.id} className="border-b border-zinc-700/30 pb-4 last:border-0 cursor-pointer hover:bg-zinc-800/20 -mx-2 px-2 py-2 rounded-md transition-colors" onClick={() => setSelectedNews(item.id)}>
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>Trending</span>
                          </Badge>
                          <Badge variant="outline" className={cn("text-xs", getCategoryColor(item.category))}>
                            {item.category}
                          </Badge>
                        </div>
                        <h3 className="font-medium text-sm leading-tight hover:text-primary line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {item.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{item.author.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{item.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{item.readTime}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              <span>{item.comments}</span>
                            </div>
                            <span>{item.source}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full mt-2 bg-zinc-800/30 border-zinc-700/50 hover:bg-zinc-800/50">
                  Load More Trending News
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* News Detail Modal */}
      {selectedNews && (() => {
        const newsItem = [...latestNews, ...trendingNews].find(item => item.id === selectedNews);
        if (!newsItem) return null;

        return (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-zinc-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8">
              {/* Header */}
              <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={cn("text-xs", getCategoryColor(newsItem.category))}>
                    {newsItem.category}
                  </Badge>
                  {newsItem.trending && (
                    <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>Trending</span>
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedNews(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Hero Image */}
              <div className="relative h-64 md:h-96 w-full">
                <Image
                  src={newsItem.image}
                  alt={newsItem.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-zinc-900 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{newsItem.title}</h1>
                  <div className="flex items-center gap-4 text-white/80 text-sm">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{newsItem.author.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{newsItem.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{newsItem.readTime} read</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-6">
                {/* Author Info */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-zinc-800">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={newsItem.author.avatar} alt={newsItem.author.name} />
                    <AvatarFallback>{newsItem.author.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{newsItem.author.name}</h3>
                      <span className="text-xs text-muted-foreground">@{newsItem.author.social.twitter}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{newsItem.author.bio}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span>{newsItem.author.social.followers.toLocaleString()} followers</span>
                      <span>{newsItem.source}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="bg-zinc-800/40 border-zinc-700/50 hover:bg-zinc-800/60">
                    Follow
                  </Button>
                </div>

                {/* Article Stats */}
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-zinc-800">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{newsItem.views.toLocaleString()} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{newsItem.likes} likes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{newsItem.comments} comments</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8 rounded-lg",
                        bookmarkedArticles.includes(newsItem.id) 
                          ? "text-primary bg-primary/10" 
                          : "text-muted-foreground hover:text-primary"
                      )}
                      onClick={() => toggleBookmark(newsItem.id)}
                    >
                      <Bookmark className={cn("h-4 w-4", bookmarkedArticles.includes(newsItem.id) && "fill-current")} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary"
                      onClick={() => handleShare(newsItem.id)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Article Body */}
                <div 
                  className="prose prose-invert max-w-none mb-8"
                  dangerouslySetInnerHTML={{ __html: newsItem.content }}
                />

                {/* Tags */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {newsItem.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="bg-zinc-800/40 border-zinc-700/50 hover:bg-zinc-800/60 cursor-pointer">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Comments Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Comments ({newsItem.comments})</h3>
                  
                  {/* Add Comment */}
                  <div className="mb-6">
                    <div className="flex gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <textarea
                          placeholder="Add a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="w-full bg-zinc-800/40 border-zinc-700/50 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                          rows={3}
                        />
                        <div className="flex justify-end mt-2">
                          <Button
                            onClick={handleAddComment}
                            className="btn-pana"
                            disabled={!newComment.trim()}
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Post Comment
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {newsItem.commentsList.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={comment.avatar} alt={comment.author} />
                          <AvatarFallback>{comment.author.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-zinc-800/40 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-sm">{comment.author}</h4>
                              <span className="text-xs text-muted-foreground">{comment.date}</span>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                          </div>
                          <div className="flex items-center gap-4 mt-2 ml-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={cn(
                                "h-8 px-2 text-xs",
                                likedComments.includes(comment.id) 
                                  ? "text-primary" 
                                  : "text-muted-foreground hover:text-primary"
                              )}
                              onClick={() => toggleLikeComment(comment.id)}
                            >
                              <ThumbsUp className={cn("h-3 w-3 mr-1", likedComments.includes(comment.id) && "fill-current")} />
                              {comment.likes}
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground">
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}