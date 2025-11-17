// components/shared/Overview.tsx
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Trophy, TrendingUp } from 'lucide-react';

export default function Overview() {
  const t = useTranslations('Home');

  return (
    <Card className="card-pana h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-pana-gradient">League Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recent Match */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Recent Match</span>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold">
                  ETH
                </div>
                <span className="font-medium">Ethiopia</span>
              </div>
              <div className="text-lg font-bold">2 - 1</div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Kenya</span>
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold">
                  KEN
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-2 text-center">
              Premier League • Oct 15, 2025
            </div>
          </div>
        </div>

        {/* Upcoming Match */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Upcoming Match</span>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold">
                  SID
                </div>
                <span className="font-medium">Sidama</span>
              </div>
              <div className="text-lg font-bold">VS</div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Mekelle</span>
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold">
                  MEK
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-2 text-center">
              Premier League • Oct 22, 2025 • 3:00 PM
            </div>
          </div>
        </div>

        {/* League Standings */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Trophy className="h-4 w-4" />
            <span>Top Teams</span>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3">
            <div className="space-y-2">
              {[
                { team: 'Saint George', points: 28, position: 1 },
                { team: 'Fasil Kenema', points: 25, position: 2 },
                { team: 'Mekelle 70 Enderta', points: 23, position: 3 },
              ].map((team) => (
                <div key={team.position} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      team.position === 1 ? 'bg-primary/30' : 'bg-secondary'
                    }`}>
                      {team.position}
                    </div>
                    <span className="text-sm">{team.team}</span>
                  </div>
                  <span className="text-sm font-medium">{team.points} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Scorers */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>Top Scorers</span>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3">
            <div className="space-y-2">
              {[
                { player: 'Getaneh Kebede', goals: 8, team: 'Saint George' },
                { player: 'Shimeles Bekele', goals: 7, team: 'Fasil Kenema' },
                { player: 'Abel Yalew', goals: 6, team: 'Mekelle 70 Enderta' },
              ].map((player, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium">{player.player}</div>
                    <div className="text-xs text-muted-foreground">{player.team}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">{player.goals}</span>
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button className="btn-pana w-full">
          View Full Standings
        </Button>
      </CardContent>
    </Card>
  );
}