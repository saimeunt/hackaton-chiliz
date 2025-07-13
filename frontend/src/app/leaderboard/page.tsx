'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  Users,
  Target,
  Zap,
  Filter,
} from 'lucide-react';
import {
  leaderboardData,
  getClubLeaderboards,
  getRandomMotivationalPhrase,
  getTopStreak,
  getAverageScore,
  type LeaderboardPlayer,
} from '@/data/leaderboard';

export default function LeaderboardPage() {
  const [motivationalPhrase] = useState(getRandomMotivationalPhrase());
  const clubLeaderboards = getClubLeaderboards();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return (
          <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">
            #{rank}
          </span>
        );
    }
  };

  const renderPlayerCard = (
    player: LeaderboardPlayer,
    showTeamBadge = true,
  ) => (
    <div
      key={player.id}
      className={`flex items-center gap-4 p-4 rounded-lg border ${
        player.rank <= 3
          ? 'bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20'
          : 'bg-gray-50 dark:bg-gray-800'
      }`}
    >
      <div className="flex items-center justify-center w-8">
        {getRankIcon(player.rank)}
      </div>

      <Avatar>
        <AvatarImage src={player.avatar} />
        <AvatarFallback>
          {player.username.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900 dark:text-white">
            {player.username}
          </span>
          <Badge className={`${player.level.color} text-xs`}>
            {player.level.emoji} {player.level.name}
          </Badge>
          {showTeamBadge && (
            <Badge variant="outline" className="text-xs">
              {player.favoriteTeam.toUpperCase()}
            </Badge>
          )}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {player.wins} wins • {player.losses} losses • {player.xp} XP
        </div>
      </div>

      <div className="text-right">
        <div className="text-lg font-bold text-purple-600">{player.score}</div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {player.winRate}% win rate
        </div>
      </div>

      <div className="text-right">
        <Badge variant={player.streak > 0 ? 'default' : 'secondary'}>
          {player.streak > 0 ? `${player.streak} streak` : 'No streak'}
        </Badge>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Leaderboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Discover the top players in the community
          </p>
        </div>
      </div>

      {/* Motivational banner */}
      <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-2 text-center">
            <Zap className="w-5 h-5" />
            <p className="font-medium">{motivationalPhrase}</p>
          </div>
        </CardContent>
      </Card>

      {/* Top 3 podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {leaderboardData.slice(0, 3).map((player) => (
          <Card
            key={player.id}
            className={`${player.rank === 1 ? 'ring-2 ring-yellow-400' : ''}`}
          >
            <CardHeader className="text-center pb-3">
              <div className="flex justify-center mb-2">
                {getRankIcon(player.rank)}
              </div>
              <Avatar className="mx-auto mb-2">
                <AvatarImage src={player.avatar} />
                <AvatarFallback>
                  {player.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg">{player.username}</CardTitle>
              <Badge className={`${player.level.color} mx-auto`}>
                {player.level.emoji} {player.level.name}
              </Badge>
            </CardHeader>
            <CardContent className="text-center space-y-2">
              <div className="text-2xl font-bold text-purple-600">
                {player.score}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                points
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {player.xp} XP
              </div>
              <div className="flex justify-center gap-4 text-sm">
                <span className="text-green-600">{player.wins}W</span>
                <span className="text-red-600">{player.losses}L</span>
                <span className="text-blue-600">{player.winRate}%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main leaderboard with tabs */}
      <Tabs defaultValue="global" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="global" className="cursor-pointer">
            Global Leaderboard
          </TabsTrigger>
          <TabsTrigger value="clubs" className="cursor-pointer">
            Club Rankings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="global">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Global Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboardData.map((player) => renderPlayerCard(player))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clubs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Rankings by Club
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {clubLeaderboards.map((clubData) => (
                  <AccordionItem key={clubData.teamId} value={clubData.teamId}>
                    <AccordionTrigger className="cursor-pointer hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full ${clubData.teamColor} flex items-center justify-center`}
                        >
                          <span className="text-white font-bold text-sm">
                            {clubData.teamName.slice(0, 2)}
                          </span>
                        </div>
                        <span className="font-semibold">
                          {clubData.teamName}
                        </span>
                        <Badge variant="outline" className="ml-2">
                          {clubData.players.length} players
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pt-4">
                        {clubData.players.map((player) =>
                          renderPlayerCard(player, false),
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Total Players
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {leaderboardData.length}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Average Score
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {getAverageScore()}
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Best Streak
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {getTopStreak()}
                </p>
              </div>
              <Award className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
