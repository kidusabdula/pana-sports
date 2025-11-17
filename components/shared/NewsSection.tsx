// components/shared/NewsSection.tsx
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, ExternalLink, TrendingUp, MessageCircle } from 'lucide-react';
import Image from 'next/image';

export default function NewsSection() {
  const t = useTranslations('Home');

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
      trending: true
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
      trending: false
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
      trending: true
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
      trending: false
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
      trending: false
    }
  ];

  return (
    <Card className="bg-zinc-800/20 backdrop-blur-sm border-zinc-700/30 h-full">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg text-pana-gradient flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Latest News
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 h-8 px-2">
          <ExternalLink className="h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {newsItems.map((item) => (
          <div key={item.id} className="border-b border-zinc-700/30 pb-3 last:border-0">
            <div className="flex gap-3">
              <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  {item.trending && (
                    <div className="bg-primary/20 text-primary text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>Trending</span>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">{item.category}</div>
                </div>
                <h3 className="font-medium text-sm leading-tight line-clamp-2 hover:text-primary cursor-pointer">
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
        
        <Button variant="outline" className="w-full mt-2 bg-zinc-800/30 border-zinc-700/30 hover:bg-zinc-800/50">
          Load More News
        </Button>
      </CardContent>
    </Card>
  );
}