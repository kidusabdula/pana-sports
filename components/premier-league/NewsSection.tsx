// components/premier-league/NewsSection.tsx
"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, ExternalLink, MessageCircle, TrendingUp, Calendar, User, Filter } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function NewsSection() {
  const [activeTab, setActiveTab] = useState("latest");
  const [filterCategory, setFilterCategory] = useState("all");

  // Sample news data
  const latestNews = [
    {
      id: 1,
      title: "Saint George Extends Lead at Top with Convincing Victory",
      excerpt: "Saint George secured a 3-0 victory against Fasil Kenema in a thrilling match that saw goals from Getaneh Kebede, Shimeles Bekele, and Abel Yalew.",
      image: "/placeholder.svg",
      date: "2 hours ago",
      source: "Ethiopian Football Federation",
      category: "Match Report",
      comments: 24,
      trending: true,
      author: "Samuel Tesfaye",
      readTime: "3 min"
    },
    {
      id: 2,
      title: "Mekelle 70 Enderta Announces New Signing Ahead of Second Half of Season",
      excerpt: "Mekelle 70 Enderta has confirmed the signing of midfielder Dawit Fekadu from Dire Dawa City on a two-and-a-half-year deal.",
      image: "/placeholder.svg",
      date: "5 hours ago",
      source: "Ethio Sports",
      category: "Transfer News",
      comments: 18,
      trending: false,
      author: "Kassahun Bekele",
      readTime: "2 min"
    },
    {
      id: 3,
      title: "National Team Coach Announces Squad for Upcoming Qualifiers",
      excerpt: "The Ethiopian national team coach has announced a 25-man squad for the upcoming World Cup qualifiers against Kenya and Uganda.",
      image: "/placeholder.svg",
      date: "1 day ago",
      source: "Zehabesha Sports",
      category: "National Team",
      comments: 42,
      trending: true,
      author: "Yohannes Tadesse",
      readTime: "4 min"
    },
    {
      id: 4,
      title: "Ethiopian Premier League Season Halfway Review",
      excerpt: "As the Ethiopian Premier League reaches its midpoint, we take a look at the standout performers and surprises so far.",
      image: "/placeholder.svg",
      date: "2 days ago",
      source: "Soccer Ethiopia",
      category: "Analysis",
      comments: 15,
      trending: false,
      author: "Mekonnen Alemu",
      readTime: "6 min"
    }
  ];

  const trendingNews = [
    {
      id: 5,
      title: "Saint George Star Player Linked with European Move",
      excerpt: "Rumors are circulating about a potential move for one of Ethiopia's brightest talents to a European club.",
      image: "/placeholder.svg",
      date: "3 days ago",
      source: "Transfer Market",
      category: "Transfer News",
      comments: 67,
      trending: true,
      author: "Dawit Haile",
      readTime: "3 min"
    },
    {
      id: 6,
      title: "Controversial Penalty Decision Sparks Debate in League",
      excerpt: "A controversial penalty decision in the match between Dire Dawa City and Hadiya Hossana has sparked widespread debate.",
      image: "/placeholder.svg",
      date: "4 days ago",
      source: "Ethiopian Football Federation",
      category: "Match Report",
      comments: 53,
      trending: true,
      author: "Tilahun Bekele",
      readTime: "5 min"
    },
    {
      id: 7,
      title: "Youth Development: Ethiopia's New Football Academy Shows Promise",
      excerpt: "A new state-of-the-art football academy launched in Addis Ababa is already showing promising results in nurturing young talent.",
      image: "/placeholder.svg",
      date: "5 days ago",
      source: "Ethiopian Football Federation",
      category: "Development",
      comments: 31,
      trending: true,
      author: "Abebech Wondimu",
      readTime: "4 min"
    }
  ];

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

  const filteredNews = activeTab === "latest" ? latestNews : trendingNews;

  return (
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
              <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={filterCategory === category.value ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "whitespace-nowrap flex-shrink-0",
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
                <div key={item.id} className="border-b border-zinc-700/30 pb-4 last:border-0">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
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
                      <h3 className="font-medium text-sm leading-tight hover:text-primary cursor-pointer line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {item.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{item.author}</span>
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
                <div key={item.id} className="border-b border-zinc-700/30 pb-4 last:border-0">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
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
                      <h3 className="font-medium text-sm leading-tight hover:text-primary cursor-pointer line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {item.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{item.author}</span>
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
  );
}