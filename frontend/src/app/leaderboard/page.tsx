'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BackButton } from '@/components/shared/back-button';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';

// Données temporaires pour le leaderboard
const leaderboardData = [
  {
    id: 1,
    username: 'CryptoKing',
    avatar: '/avatar/avatar.png',
    score: 2840,
    wins: 45,
    losses: 12,
    winRate: 78.9,
    streak: 7,
    rank: 1,
  },
  {
    id: 2,
    username: 'BetMaster',
    avatar: '/avatar/avatar.png',
    score: 2650,
    wins: 38,
    losses: 15,
    winRate: 71.7,
    streak: 3,
    rank: 2,
  },
  {
    id: 3,
    username: 'SportsFan',
    avatar: '/avatar/avatar.png',
    score: 2480,
    wins: 32,
    losses: 18,
    winRate: 64.0,
    streak: 1,
    rank: 3,
  },
  {
    id: 4,
    username: 'LuckyStrike',
    avatar: '/avatar/avatar.png',
    score: 2320,
    wins: 29,
    losses: 21,
    winRate: 58.0,
    streak: 2,
    rank: 4,
  },
  {
    id: 5,
    username: 'ChampionBet',
    avatar: '/avatar/avatar.png',
    score: 2180,
    wins: 26,
    losses: 19,
    winRate: 57.8,
    streak: 1,
    rank: 5,
  },
];

export default function LeaderboardPage() {
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

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
            1st Place
          </Badge>
        );
      case 2:
        return (
          <Badge className="bg-gradient-to-r from-gray-300 to-gray-500 text-white">
            2nd Place
          </Badge>
        );
      case 3:
        return (
          <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white">
            3rd Place
          </Badge>
        );
      default:
        return <Badge variant="outline">#{rank}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BackButton fallbackUrl="/" />
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Leaderboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Découvrez les meilleurs joueurs de la communauté
          </p>
        </div>
      </div>

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
              {getRankBadge(player.rank)}
            </CardHeader>
            <CardContent className="text-center space-y-2">
              <div className="text-2xl font-bold text-purple-600">
                {player.score}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                points
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

      {/* Full leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Classement complet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboardData.map((player) => (
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
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {player.username}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {player.wins} victoires • {player.losses} défaites
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold text-purple-600">
                    {player.score}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {player.winRate}% de réussite
                  </div>
                </div>

                <div className="text-right">
                  <Badge variant={player.streak > 0 ? 'default' : 'secondary'}>
                    {player.streak > 0
                      ? `${player.streak} streak`
                      : 'No streak'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Total des joueurs
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {leaderboardData.length}
                </p>
              </div>
              <Trophy className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Score moyen
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(
                    leaderboardData.reduce(
                      (sum, player) => sum + player.score,
                      0,
                    ) / leaderboardData.length,
                  )}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Meilleur streak
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.max(...leaderboardData.map((p) => p.streak))}
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
