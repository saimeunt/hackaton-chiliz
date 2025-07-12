'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Trophy,
  Medal,
  Target,
  TrendingUp,
  Users,
  Award,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import Link from 'next/link';
import {
  mockUserStats,
  getCurrentLevel,
  getNextLevel,
  calculateProgressToNext,
  formatAddress,
} from '@/data/profile';

export default function Profile() {
  const { address, isConnected } = useAccount();
  const [copied, setCopied] = useState(false);

  // Use mock data from data/profile.ts
  const userStats = mockUserStats;
  const currentLevel = getCurrentLevel(userStats.xp);
  const nextLevel = getNextLevel(userStats.xp);
  const progressToNext = calculateProgressToNext(userStats.xp);

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="mb-6 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Connect your wallet
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            You need to connect your wallet to access your profile
          </p>
        </div>
        <div className="flex justify-center">
          <appkit-button />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your information and track your performance
        </p>
      </div>

      {/* Main profile */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar className="w-20 h-20 border-4 border-amber-400 shadow-lg">
              <AvatarImage
                src="/avatar/avatar.png"
                alt="Profile Avatar"
                className="object-cover"
              />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                {address?.slice(2, 4).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Fan #{address?.slice(-4)}
                </h2>
                <Badge className={currentLevel.color}>
                  {currentLevel.emoji} {currentLevel.name}
                </Badge>
              </div>
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {formatAddress(address!)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyAddress}
                  className="h-6 w-6 p-0"
                >
                  {copied ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Member since{' '}
                {new Date(userStats.joinDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                })}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* XP and level system */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center">
              <Trophy className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            Experience and Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userStats.xp} XP
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Level {currentLevel.name} {currentLevel.emoji}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Next level: {nextLevel.name} {nextLevel.emoji}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {nextLevel.min === Infinity
                    ? 'Maximum level!'
                    : `${nextLevel.min - userStats.xp} XP remaining`}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{currentLevel.min} XP</span>
                <span>
                  {nextLevel.min === Infinity ? '∞' : nextLevel.min} XP
                </span>
              </div>
              <Progress value={progressToNext} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userStats.totalBets}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Total Bets
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userStats.winRate}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Win Rate
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Medal className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userStats.achievements}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Achievements
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userStats.poapBadges}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  POAP Badges
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick links */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/achievements">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  Achievements
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userStats.achievements}/12
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Unlock exclusive rewards
                </p>
              </div>
              <div className="flex gap-1 mt-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-amber-400 rounded-full" />
                ))}
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-gray-300 dark:bg-gray-700 rounded-full"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/community/poap-badges">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-500" />
                  POAP Badges
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userStats.poapBadges}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Community badges collected
                </p>
              </div>
              <div className="flex gap-1 mt-3">
                {[...Array(userStats.poapBadges)].map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center"
                  >
                    <Award className="w-3 h-3 text-white" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/profile/my-bets">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  My Bets
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userStats.winRate}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Win rate performance
                </p>
              </div>
              <div className="space-y-2 mt-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Won
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    {userStats.wonBets}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Lost
                  </span>
                  <span className="text-sm font-medium text-red-600">
                    {userStats.lostBets}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Total
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {userStats.totalBets}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
