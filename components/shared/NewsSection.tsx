// components/shared/NewsSection.tsx
"use client"
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ExternalLink, TrendingUp, MessageCircle, Heart, Eye } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function NewsSection() {
  const t = useTranslations('Home');
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // Sample news data
  const newsItems = [
    {
      id: 1,
      title: "Saint George Secures Victory in Thrilling Derby Match",
      excerpt: "Saint George emerged victorious in a heated derby against their rivals, with a last-minute goal sealing the win.",
      image: "/placeholder.svg",
      date: "2 hours ago",
      source: "Ethiopian Football Federation",
      category: "Match Report",
      comments: 24,
      trending: true,
      views: 1250
    },
    {
      id: 2,
      title: "National Team Announces Squad for Upcoming Qualifiers",
      excerpt: "The Ethiopian national team coach has announced the final squad for the upcoming World Cup qualifiers.",
      image: "/placeholder.svg",
      date: "5 hours ago",
      source: "Ethio Sports",
      category: "National Team",
      comments: 18,
      trending: false,
      views: 980
    },
    {
      id: 3,
      title: "Transfer Rumors: Top Ethiopian Player Linked with European Club",
      excerpt: "Rumors are circulating about a potential move for one of Ethiopia's brightest talents to a European club.",
      image: "/placeholder.svg",
      date: "1 day ago",
      source: "Zehabesha Sports",
      category: "Transfer News",
      comments: 42,
      trending: true,
      views: 2150
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
      views: 750
    },
    {
      id: 5,
      title: "Youth Development: Ethiopia's New Football Academy",
      excerpt: "A new state-of-the-art football academy has been launched in Addis Ababa to nurture young talent.",
      image: "/placeholder.svg",
      date: "3 days ago",
      source: "Ethiopian Football Federation",
      category: "Development",
      comments: 8,
      trending: false,
      views: 520
    }
  ];

  return (
    <Card className="bg-zinc-800/20 backdrop-blur-sm border-zinc-700/30 overflow-hidden group hover:shadow-xl hover:shadow-primary/10 transition-all duration-500">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Latest News
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 h-8 px-2">
          <ExternalLink className="h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {newsItems.map((item) => (
          <div key={item.id} className="border-b border-zinc-700/30 pb-3 last:border-0 group/news">
            <div className="flex gap-3">
              <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover/news:scale-110"
                />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  {item.trending && (
                    <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                  <Badge variant="secondary" className="bg-zinc-700/50 text-zinc-300 border-zinc-600/50 text-xs">
                    {item.category}
                  </Badge>
                </div>
                <h3 className="font-medium text-sm leading-tight line-clamp-2 hover:text-primary cursor-pointer transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {item.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{item.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{item.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>{item.comments}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-5 w-5 p-0 rounded transition-all duration-300",
                        favorites.includes(item.id) 
                          ? "text-red-500 bg-red-500/10 hover:bg-red-500/20" 
                          : "text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                      )}
                      onClick={() => toggleFavorite(item.id)}
                    >
                      <Heart className={cn("h-3 w-3 transition-all", favorites.includes(item.id) && "fill-current")} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <Button variant="outline" className="w-full mt-2 bg-zinc-800/30 border-zinc-700/30 hover:bg-zinc-800/50 group">
          Load More News
          <ExternalLink className="ml-2 h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </CardContent>
    </Card>
  );
}