"use client";

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Clock, TrendingUp, ChevronRight, PlayCircle, X, Calendar, User, Share2 } from 'lucide-react';
import Image from 'next/image';

// Mock news data
const newsData = [
  {
    id: 1,
    title: "Saint George Extends Lead at Top with Convincing Victory Over Fasil",
    category: "Match Report",
    image: "https://www.soccerethiopia.net/wp-content/uploads/2025/11/IMG_20251125_201641_512-690x460.jpg", // Replace with real image
    date: "2h ago",
    author: "Samuel Tesfaye",
    excerpt: "The Horsemen dominated proceedings at Addis Ababa Stadium with goals from Getaneh and Shimeles...",
    content: `
      <p>Saint George extended their lead at the top of the Ethiopian Premier League with a convincing 3-1 victory over Fasil Kenema at Addis Ababa Stadium on Sunday.</p>
      
      <p>The Horsemen dominated proceedings from the start, with Getaneh Kebede opening the scoring in the 17th minute after a brilliant through ball from Shimeles Bekele. Shimeles doubled the advantage just before halftime with a powerful strike from outside the box.</p>
      
      <p>Fasil Kenema showed some resistance in the second half and pulled one back through a penalty by Dawit Fekadu in the 65th minute. However, Saint George restored their two-goal cushion in the 78th minute when substitute Aynalem Hailu capitalized on a defensive error.</p>
      
      <p>"We played with determination today," said Saint George coach Gebremedhin Haile after the match. "The players executed our game plan perfectly, and I'm proud of their performance."</p>
      
      <p>This victory puts Saint George five points clear at the top of the table with 28 points from 10 games, while Fasil Kenema remains in second place with 23 points.</p>
    `
  },
  {
    id: 2,
    title: "National Team Squad Announced for Qualifiers",
    category: "National Team",
    image: "https://www.soccerethiopia.net/wp-content/uploads/2025/11/IMG_20251125_212009_499-690x460.jpg", // Replace with real image
    date: "4h ago",
    author: "Mekonnen Bekele",
    excerpt: "Coach Wubetu Abate has named a 28-man squad for the upcoming Africa Cup of Nations qualifiers against Kenya and Tanzania...",
    content: `
      <p>Ethiopia's national football team coach Wubetu Abate has announced a 28-man squad for the upcoming Africa Cup of Nations qualifiers against Kenya and Tanzania next month.</p>
      
      <p>The squad includes several overseas-based players, including striker Getaneh Kebede who plays for Saint George, and midfielder Shimelis Bekele who recently returned from an injury.</p>
      
      <p>Notably, the coach has included three uncapped players: goalkeeper Yared Zewdu from Hawassa Kenema, defender Abel Yalew from Mekelle 70 Enderta, and forward Samuel Tefera from Ethiopia Bunna.</p>
      
      <p>"We've selected a balanced squad with a mix of experience and youth," said Abate during the press conference. "We're confident that these players can deliver the results we need to qualify for the tournament."</p>
      
      <p>The Walias will face Kenya on June 5 at Addis Ababa Stadium before traveling to Dar es Salaam to take on Tanzania four days later.</p>
    `
  },
  {
    id: 3,
    title: "Mekelle 70 Enderta Signs Star Midfielder",
    category: "Transfer",
    image: "https://www.soccerethiopia.net/wp-content/uploads/2025/11/IMG_20251125_212004_058-1-690x460.jpg", // Replace with real image
    date: "6h ago",
    author: "Dawit Alemu",
    excerpt: "The northern giants have completed the signing of Bahir Dar Kenema's creative midfielder in a record-breaking deal...",
    content: `
      <p>Mekelle 70 Enderta has completed the signing of Bahir Dar Kenema's star midfielder Amanuel Assefa in what is being described as a record-breaking deal in Ethiopian football.</p>
      
      <p>The 26-year-old playmaker has signed a three-year contract with the northern giants after a protracted transfer negotiation that lasted several weeks.</p>
      
      <p>While the exact transfer fee remains undisclosed, sources close to the deal suggest it's the highest ever paid for a midfielder in the Ethiopian Premier League.</p>
      
      <p>"Amanuel is a player we've been admiring for a long time," said Mekelle's technical director. "His creativity and vision will add a new dimension to our midfield, and we're delighted to have finally secured his signature."</p>
      
      <p>Amanuel, who scored 8 goals and provided 12 assists last season, expressed his excitement about the move: "I'm thrilled to join a club with such ambition. I can't wait to start training with my new teammates and help the team achieve its goals this season."</p>
    `
  },
  {
    id: 4,
    title: "VAR To Be Introduced in Ethiopian Premier League?",
    category: "Exclusive",
    image: "https://www.soccerethiopia.net/wp-content/uploads/2025/11/IMG_20251125_201644_361.jpg", // Replace with real image
    date: "1d ago",
    author: "Tigist Haile",
    excerpt: "The Ethiopian Football Federation is considering the introduction of Video Assistant Referee (VAR) technology in the Premier League next season...",
    content: `
      <p>The Ethiopian Football Federation (EFF) is seriously considering the introduction of Video Assistant Referee (VAR) technology in the Premier League starting next season, sources have told Pana Sports.</p>
      
      <p>The move comes after several controversial refereeing decisions in recent matches that have sparked outrage among fans, players, and club officials.</p>
      
      <p>According to our sources, the EFF has already held preliminary discussions with FIFA about the implementation process and costs involved. A delegation is expected to travel to Europe next month to study how VAR is being used in smaller leagues.</p>
      
      <p>"Refereeing standards have been a major concern this season," said EFF president in an exclusive interview. "We believe VAR could help improve the quality of officiating and ensure fair play for all teams."</p>
      
      <p>If introduced, Ethiopia would become only the third African country after Egypt and South Africa to implement VAR technology in their domestic league.</p>
    `
  },
  {
    id: 5,
    title: "Wolaitta Dicha Coach Resigns After Poor Run",
    category: "Club News",
    image: "https://www.soccerethiopia.net/wp-content/uploads/2025/11/IMG_20251125_201641_094-690x460.jpg", // Replace with real image
    date: "2d ago",
    author: "Kassahun Wondimu",
    excerpt: "The coach of Wolaitta Dicha has stepped down following a string of poor results that left the club hovering above the relegation zone...",
    content: `
      <p>Wolaitta Dicha's head coach, Abraham Mebratu, has resigned from his position following a disappointing run of results that left the club just three points above the relegation zone.</p>
      
      <p>The announcement came just hours after the team's 2-0 defeat to Sidama Bunna, their fifth loss in six matches.</p>
      
      <p>Club chairman stated that they had accepted the coach's resignation with immediate effect. "We thank Abraham for his service to the club during his time here," the chairman said in a statement. "However, we felt a change was necessary to turn our season around."</p>
      
      <p>Assistant coach Tadesse Girma will take charge on an interim basis while the club searches for a permanent replacement.</p>
      
      <p>Wolaitta Dicha, who finished third last season, will face a crucial relegation battle against Dire Dawa in their next match.</p>
    `
  },
  {
    id: 6,
    title: "Ethiopian Premier League Announces Sponsorship Deal",
    category: "Business",
    image: "https://www.soccerethiopia.net/wp-content/uploads/2025/11/IMG_20251125_201641_512-690x460.jpg", // Replace with real image
    date: "3d ago",
    author: "Sofia Teklu",
    excerpt: "The Ethiopian Premier League has signed a three-year sponsorship deal with a major telecommunications company worth millions...",
    content: `
      <p>The Ethiopian Premier League has announced a landmark three-year sponsorship deal with Ethio Telecom, the country's largest telecommunications company.</p>
      
      <p>The deal, worth an estimated 30 million birr per year, will see Ethio Telecom become the title sponsor of the league, which will now be known as the "Ethio Telecom Premier League."</p>
      
      <p>This is the most lucrative sponsorship deal in the history of Ethiopian football, and it comes at a crucial time for the league, which has been struggling financially due to the impact of the pandemic.</p>
      
      <p>"This partnership marks a new era for Ethiopian football," said the league's CEO during the signing ceremony. "The additional funding will help us improve the quality of our competition, develop better infrastructure, and provide better support to our member clubs."</p>
      
      <p>As part of the deal, Ethio Telecom will also sponsor the annual awards ceremony and provide technological support for the implementation of VAR technology, which is currently under consideration.</p>
    `
  }
];

export default function NewsSection() {
  const [selectedNews, setSelectedNews] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use the first news item as featured news
  const featuredNews = newsData[0];
  
  // Use the next 4 news items as side news
  const sideNews = newsData.slice(1, 5);

  const openNewsDetail = (news) => {
    setSelectedNews(news);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNews(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-auto lg:h-[400px]">
        
        {/* Hero Card (Major News) */}
        <div 
          className="lg:col-span-8 group relative rounded-3xl overflow-hidden cursor-pointer"
          onClick={() => openNewsDetail(featuredNews)}
        >
          <Image 
             src={featuredNews.image} 
             alt="News" 
             fill 
             className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
             <div className="flex items-center gap-3 mb-3">
               <Badge className="bg-primary hover:bg-primary text-white border-none text-xs px-2 py-0.5">
                  {featuredNews.category}
               </Badge>
               <span className="text-xs text-zinc-300 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {featuredNews.date}
               </span>
             </div>
             <h1 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2 group-hover:text-primary transition-colors">
                {featuredNews.title}
             </h1>
             <p className="text-sm text-zinc-300 hidden md:block max-w-xl">
                {featuredNews.excerpt}
             </p>
          </div>
        </div>

        {/* Side Column (Trending List) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
           <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-5 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" /> Trending
                 </h3>
                 <Button variant="link" className="text-xs text-primary p-0 h-auto">View All</Button>
              </div>
              
              <div className="flex-1 space-y-4">
                 {sideNews.map((news, i) => (
                    <div 
                      key={i} 
                      className="group cursor-pointer flex gap-3 items-start border-b border-white/5 pb-3 last:border-0 last:pb-0"
                      onClick={() => openNewsDetail(news)}
                    >
                       <div className="text-xs font-bold text-zinc-500 mt-1">0{i+1}</div>
                       <div>
                          <Badge variant="outline" className="mb-1 text-[10px] py-0 px-1.5 border-zinc-700 text-zinc-400">
                             {news.category}
                          </Badge>
                          <h4 className="text-sm font-medium text-zinc-200 group-hover:text-primary transition-colors line-clamp-2">
                             {news.title}
                          </h4>
                          <span className="text-[10px] text-zinc-500 mt-1 block">{news.time}</span>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* News Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedNews && (
            <>
              <DialogHeader className="relative">
                <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-4">
                  <Image 
                    src={selectedNews.image} 
                    alt={selectedNews.title} 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <Badge className="bg-primary hover:bg-primary text-white border-none text-xs px-2 py-0.5 mb-2">
                      {selectedNews.category}
                    </Badge>
                    <DialogTitle className="text-2xl md:text-3xl font-bold text-white">
                      {selectedNews.title}
                    </DialogTitle>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 text-white bg-black/30 hover:bg-black/50"
                  onClick={closeModal}
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogHeader>
              
              <div className="flex items-center gap-4 text-sm text-zinc-400 mb-6">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{selectedNews.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{selectedNews.author}</span>
                </div>
                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white ml-auto">
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
              </div>
              
              <div 
                className="prose prose-invert max-w-none text-zinc-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: selectedNews.content }}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}