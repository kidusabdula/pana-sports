// components/premier-league/NewsSection.tsx
"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
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

export default function NewsSection() {
  const [activeTab, setActiveTab] = useState("latest");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedNews, setSelectedNews] = useState<number | null>(null);
  const [likedComments, setLikedComments] = useState<number[]>([]);
  const [bookmarkedArticles, setBookmarkedArticles] = useState<number[]>([]);
  const [newComment, setNewComment] = useState("");

  // Sample news data with more detailed content
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
      author: {
        name: "Samuel Tesfaye",
        avatar: "/avatar1.jpg",
        bio: "Senior sports journalist with 10 years of experience covering Ethiopian football",
        social: {
          twitter: "@samueltesfaye",
          followers: 12500
        }
      },
      readTime: "3 min",
      content: `
        <p>Saint George FC extended their lead at the top of the Ethiopian Premier League table with a convincing 3-0 victory over Fasil Kenema at the Addis Ababa Stadium on Saturday.</p>
        
        <h3>Match Highlights</h3>
        <p>The home side started strongly and took the lead in the 18th minute when captain Getaneh Kebede converted from the penalty spot after a handball inside the box. The veteran striker doubled his team's advantage just before halftime with a well-placed header from a corner kick.</p>
        
        <p>Fasil Kenema came out with more purpose in the second half but struggled to break down Saint George's organized defense. The home side sealed the victory in the 78th minute when substitute Abel Yalew capitalized on a defensive error to score his third goal of the season.</p>
        
        <h3>Post-Match Reactions</h3>
        <p>"We're pleased with the performance and the result," said Saint George coach after the match. "The players executed our game plan perfectly and showed great character throughout the match."</p>
        
        <p>Fasil Kenema's assistant coach acknowledged the better team on the day: "Saint George deserved the victory. We need to go back to the drawing board and address our defensive vulnerabilities."</p>
        
        <h3>Implications for the Title Race</h3>
        <p>This victory extends Saint George's lead at the top of the table to 3 points, with second-placed Fasil Kenema having a game in hand. With just 10 rounds of matches remaining, the title race is heating up.</p>
      `,
      tags: ["Saint George", "Fasil Kenema", "Match Report", "Getaneh Kebede"],
      relatedArticles: [2, 5, 8],
      views: 1520,
      likes: 89,
      commentsList: [
        {
          id: 1,
          author: "Dawit Bekele",
          avatar: "/commenter1.jpg",
          content: "Great performance by Saint George! Getaneh is still showing his class even at his age.",
          date: "1 hour ago",
          likes: 12
        },
        {
          id: 2,
          author: "Sofia Kassa",
          avatar: "/commenter2.jpg",
          content: "Fasil Kenema needs to strengthen their defense if they want to challenge for the title.",
          date: "1 hour ago",
          likes: 8
        },
        {
          id: 3,
          author: "Mekonnen Tadesse",
          avatar: "/commenter3.jpg",
          content: "The penalty decision was controversial in my opinion. Still, a good match overall.",
          date: "30 minutes ago",
          likes: 5
        }
      ]
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
      author: {
        name: "Kassahun Bekele",
        avatar: "/avatar2.jpg",
        bio: "Transfer expert and football analyst",
        social: {
          twitter: "@kassahunbekele",
          followers: 8700
        }
      },
      readTime: "2 min",
      content: `
        <p>Mekelle 70 Enderta has completed the signing of midfielder Dawit Fekadu from Dire Dawa City, the club announced today. The 24-year-old has signed a two-and-a-half-year contract with the northern side.</p>
        
        <h3>Player Profile</h3>
        <p>Fekadu began his career with Ethiopian Coffee before joining Dire Dawa City in 2022. He has made 45 appearances for the club, scoring 8 goals and providing 12 assists.</p>
        
        <p>Known for his versatility and work rate, Fekadu can operate in central midfield or on either wing. His technical ability and vision make him a valuable addition to Mekelle's squad.</p>
        
        <h3>Club Statement</h3>
        <p>"We're delighted to welcome Dawit to our club," said Mekelle's sporting director in a statement. "He's a talented young player who fits our philosophy perfectly. We believe he will make a significant impact in the second half of the season."</p>
        
        <h3>Implications</h3>
        <p>This signing strengthens Mekelle's midfield options as they push for a top-four finish. Fekadu is expected to make his debut in the upcoming match against Hadiya Hossana.</p>
      `,
      tags: ["Mekelle 70 Enderta", "Dire Dawa City", "Transfer", "Dawit Fekadu"],
      relatedArticles: [4, 7, 1],
      views: 980,
      likes: 67,
      commentsList: [
        {
          id: 4,
          author: "Tigist Haile",
          avatar: "/commenter4.jpg",
          content: "Good signing for Mekelle. Fekadu is one of the most promising young midfielders in the league.",
          date: "3 hours ago",
          likes: 15
        },
        {
          id: 5,
          author: "Yonas Alemu",
          avatar: "/commenter5.jpg",
          content: "Dire Dawa will miss him. He was one of their best players last season.",
          date: "2 hours ago",
          likes: 9
        }
      ]
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
      author: {
        name: "Yohannes Tadesse",
        avatar: "/avatar3.jpg",
        bio: "National team reporter with exclusive access to the Walia Antelopes",
        social: {
          twitter: "@yohannestadesse",
          followers: 21500
        }
      },
      readTime: "4 min",
      content: `
        <p>Ethiopia's national team coach has named a 25-man squad for the upcoming 2026 World Cup qualifiers against Kenya and Uganda next month.</p>
        
        <h3>Notable Inclusions</h3>
        <p>The squad sees the return of veteran striker Getaneh Kebede, who missed the last qualifiers through injury. His inclusion will boost Ethiopia's attacking options.</p>
        
        <p>Young midfielder Abel Yalew receives his first senior call-up after impressive performances for Mekelle 70 Enderta this season. The 21-year-old has been one of the revelations of the Ethiopian Premier League.</p>
        
        <h3>Notable Omissions</h3>
        <p>Surprisingly, regular defender Biruk Wondimu has been left out of the squad. The 28-year-old has been a mainstay in the national team but has struggled for form recently.</p>
        
        <p>Midfielder Salhadin Seid is also missing due to a knee injury that will keep him out for at least three weeks.</p>
        
        <h3>Fixtures</h3>
        <p>Ethiopia will travel to Nairobi to face Kenya on June 15 before hosting Uganda at the Addis Ababa Stadium five days later. Both matches are crucial for Ethiopia's hopes of qualifying for the World Cup.</p>
        
        <h3>Coach's Comments</h3>
        <p>"We've selected a balanced squad with a mix of experience and youth," said the coach at the press conference. "The players are determined to get positive results in both matches as we continue our journey toward qualification."</p>
      `,
      tags: ["National Team", "World Cup Qualifiers", "Getaneh Kebede", "Abel Yalew"],
      relatedArticles: [6, 1, 9],
      views: 2340,
      likes: 156,
      commentsList: [
        {
          id: 6,
          author: "Fikre Alemu",
          avatar: "/commenter6.jpg",
          content: "Good to see Getaneh back in the squad. His experience will be crucial.",
          date: "20 hours ago",
          likes: 23
        },
        {
          id: 7,
          author: "Helen Tesfaye",
          avatar: "/commenter7.jpg",
          content: "Abel Yalew deserves his call-up. He's been outstanding this season.",
          date: "18 hours ago",
          likes: 18
        },
        {
          id: 8,
          author: "Bekele Gerba",
          avatar: "/commenter8.jpg",
          content: "Surprised by Biruk's omission. He's been one of our most consistent defenders.",
          date: "15 hours ago",
          likes: 14
        }
      ]
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
      author: {
        name: "Mekonnen Alemu",
        avatar: "/avatar4.jpg",
        bio: "Football analyst and former player with deep knowledge of Ethiopian football",
        social: {
          twitter: "@mekonnenalemu",
          followers: 9800
        }
      },
      readTime: "6 min",
      content: `
        <p>With the Ethiopian Premier League reaching its halfway point, it's time to assess the season so far and look at the standout performers and surprises.</p>
        
        <h3>Title Race</h3>
        <p>Saint George leads the table with 28 points from 10 games, showing the consistency that has characterized their season. Fasil Kenema sits three points behind but with a game in hand, keeping the title race interesting.</p>
        
        <p>Mekelle 70 Enderta has been the surprise package of the season, currently sitting in third place and challenging for a spot in continental competition.</p>
        
        <h3>Top Performers</h3>
        <p>Veteran striker Getaneh Kebede continues to defy age with 8 goals so far this season. His leadership and goal-scoring ability have been instrumental in Saint George's title challenge.</p>
        
        <p>Young midfielder Abel Yalew has been one of the revelations of the season. The 21-year-old has been impressive for Mekelle 70 Enderta, earning him a call-up to the national team.</p>
        
        <h3>Disappointments</h3>
        <p>Defending champions Ethiopia Bunna have struggled this season, currently sitting in 9th place, well below expectations. Injuries to key players and inconsistency have plagued their campaign.</p>
        
        <p>Wolaitta Dicha, who finished third last season, have also underperformed and find themselves in the bottom half of the table.</p>
        
        <h3>Second Half Predictions</h3>
        <p>The title race is likely to go down to the wire between Saint George and Fasil Kenema, with Mekelle 70 Enderta potentially playing the role of spoilers.</p>
        
        <p>At the bottom, Welwalo Adigrat University and Arba Minch Ketema will need to improve significantly if they are to avoid relegation.</p>
      `,
      tags: ["Season Review", "Analysis", "Saint George", "Fasil Kenema"],
      relatedArticles: [1, 2, 10],
      views: 1870,
      likes: 124,
      commentsList: [
        {
          id: 9,
          author: "Abebech Wondimu",
          avatar: "/commenter9.jpg",
          content: "Great analysis! Abel Yalew is definitely the player to watch this season.",
          date: "1 day ago",
          likes: 19
        },
        {
          id: 10,
          author: "Tilahun Bekele",
          avatar: "/commenter10.jpg",
          content: "Ethiopia Bunna's poor form has been surprising. Hope they turn it around in the second half.",
          date: "1 day ago",
          likes: 11
        }
      ]
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
      author: {
        name: "Dawit Haile",
        avatar: "/avatar5.jpg",
        bio: "Transfer market specialist with connections across European football",
        social: {
          twitter: "@dawithaile",
          followers: 18700
        }
      },
      readTime: "3 min",
      content: `
        <p>Saint George's star midfielder Shimeles Bekele is reportedly attracting interest from several European clubs, according to sources close to the player.</p>
        
        <h3>Interested Clubs</h3>
        <p>Belgian side Club Brugge and Portuguese outfit Braga are said to be leading the race for the 26-year-old's signature, with both clubs having sent scouts to watch him in recent matches.</p>
        
        <p>French club Lille has also expressed interest, with their technical director reportedly impressed by Bekele's performances in the Ethiopian Premier League.</p>
        
        <h3>Player Profile</h3>
        <p>Bekele has been with Saint George since 2018 and has established himself as one of the best midfielders in Ethiopian football. His technical ability, vision, and set-piece prowess make him an attractive prospect for European clubs.</p>
        
        <h3>Potential Transfer Fee</h3>
        <p>While no official bid has been made yet, sources suggest that Saint George would be looking for a fee in the region of €800,000 for their prized asset.</p>
        
        <h3>Club's Stance</h3>
        <p>Saint George's management has remained tight-lipped about the speculation, but a source within the club revealed that they would be reluctant to sell their star player mid-season.</p>
      `,
      tags: ["Shimeles Bekele", "Transfer Rumors", "Saint George", "European Clubs"],
      relatedArticles: [1, 2, 6],
      views: 3120,
      likes: 189,
      commentsList: [
        {
          id: 11,
          author: "Kassahun Alemayehu",
          avatar: "/commenter11.jpg",
          content: "Bekele deserves a move to Europe. He's too good for the Ethiopian league.",
          date: "2 days ago",
          likes: 31
        },
        {
          id: 12,
          author: "Tigist Mekonnen",
          avatar: "/commenter12.jpg",
          content: "Hope he stays at least until the end of the season. We need him for the title race.",
          date: "2 days ago",
          likes: 27
        }
      ]
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
      author: {
        name: "Tilahun Bekele",
        avatar: "/avatar6.jpg",
        bio: "Referee analyst and former official with deep knowledge of the laws of the game",
        social: {
          twitter: "@tilahunbekele",
          followers: 11200
        }
      },
      readTime: "5 min",
      content: `
        <p>A controversial penalty decision in the dying minutes of the match between Dire Dawa City and Hadiya Hossana has sparked widespread debate across Ethiopian football.</p>
        
        <h3>The Incident</h3>
        <p>With the score level at 1-1 and just two minutes remaining, Hadiya Hossana's striker went down inside the penalty area under a challenge from Dire Dawa's goalkeeper.</p>
        
        <p>The referee immediately pointed to the spot, much to the dismay of the Dire Dawa players who claimed there was no contact. Replays showed minimal contact between the two players.</p>
        
        <h3>The Aftermath</h3>
        <p>Hadiya Hossana converted the penalty and went on to win the match 2-1, a result that has significant implications for both teams' league positions.</p>
        
        <p>Dire Dawa's players surrounded the referee after the final whistle, with their captain receiving a yellow card for his protests.</p>
        
        <h3>Expert Analysis</h3>
        <p>Former referee and current analyst Tilahun Bekele weighed in on the controversy: "It was a very soft penalty. There was minimal contact and the player appeared to go down easily. In today's game, it probably wouldn't be given, but it's one of those marginal decisions that can go either way."</p>
        
        <h3>Club Reactions</h3>
        <p>Dire Dawa City released a statement expressing their disappointment with the decision but stopped short of making an official complaint to the Ethiopian Football Federation.</p>
        
        <p>Hadiya Hossana's coach defended the decision, saying: "The referee made the call and we have to respect it. These things even out over the course of the season."</p>
      `,
      tags: ["Controversy", "Penalty", "Dire Dawa City", "Hadiya Hossana"],
      relatedArticles: [4, 7, 1],
      views: 2870,
      likes: 167,
      commentsList: [
        {
          id: 13,
          author: "Mekonnen Haile",
          avatar: "/commenter13.jpg",
          content: "That was definitely not a penalty. The referee cost Dire Dawa the match.",
          date: "3 days ago",
          likes: 42
        },
        {
          id: 14,
          author: "Senaayt Kassa",
          avatar: "/commenter14.jpg",
          content: "Dire Dawa should have scored more goals earlier in the match instead of blaming the referee.",
          date: "3 days ago",
          likes: 28
        }
      ]
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
      author: {
        name: "Abebech Wondimu",
        avatar: "/avatar7.jpg",
        bio: "Youth development specialist and football education advocate",
        social: {
          twitter: "@abebechwondimu",
          followers: 7600
        }
      },
      readTime: "4 min",
      content: `
        <p>A new state-of-the-art football academy launched in Addis Ababa six months ago is already showing promising results in nurturing young Ethiopian talent.</p>
        
        <h3>Facilities</h3>
        <p>The Ethiopian Football Academy, located in the outskirts of Addis Ababa, boasts world-class facilities including three natural grass pitches, a gymnasium, classrooms, and accommodation for 60 students.</p>
        
        <p>The academy was funded through a partnership between the Ethiopian Football Federation and private investors, with additional support from FIFA's development program.</p>
        
        <h3>Coaching Staff</h3>
        <p>The academy has assembled a team of qualified coaches, including former national team players and European coaches with experience in youth development.</p>
        
        <p>The technical director, a UEFA Pro License holder from Spain, has implemented a curriculum focused on technical development, tactical understanding, and personal growth.</p>
        
        <h3>Early Results</h3>
        <p>Despite being operational for only six months, the academy has already produced impressive results. The U-15 team recently won a regional tournament, defeating more established academies.</p>
        
        <p>Several players have already been identified as having the potential to play professionally, with two 15-year-olds training with Premier League clubs.</p>
        
        <h3>Future Plans</h3>
        <p>The academy plans to expand its intake next year and introduce women's football programs. There are also plans to establish satellite academies in other regions of Ethiopia.</p>
      `,
      tags: ["Youth Development", "Academy", "Ethiopian Football Federation", "Grassroots"],
      relatedArticles: [8, 3, 9],
      views: 1650,
      likes: 134,
      commentsList: [
        {
          id: 15,
          author: "Yohannes Bekele",
          avatar: "/commenter15.jpg",
          content: "This is exactly what Ethiopian football needs. Proper youth development is the key to long-term success.",
          date: "4 days ago",
          likes: 37
        },
        {
          id: 16,
          author: "Ruth Kassa",
          avatar: "/commenter16.jpg",
          content: "Great to see investment in youth development. Hope we see more of these across the country.",
          date: "4 days ago",
          likes: 29
        }
      ]
    }
  ];

  const categories = [
    { value: "all", label: "All News" },
    { value: "match-report", label: "Match Reports" },
    { value: "transfer-news", label: "Transfer News" },
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

  const handleShare = (articleId: number) => {
    // In a real app, this would open a share dialog or copy link to clipboard
    alert(`Article ${articleId} shared!`);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      // In a real app, this would send the comment to a server
      alert(`Comment added: ${newComment}`);
      setNewComment("");
    }
  };

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
                  <div key={item.id} className="border-b border-zinc-700/30 pb-4 last:border-0 cursor-pointer hover:bg-zinc-800/20 -mx-2 px-2 py-2 rounded-md transition-colors" onClick={() => setSelectedNews(item.id)}>
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
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
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
                    <AvatarFallback>{newsItem.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
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
                          <AvatarFallback>{comment.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
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