'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { BetMatch } from '@/app/api/live-bets/route';
import { DualProgressBar } from './dual-progress-bar';
import { IncitationBetText } from './incitation-bet-text';
import { useRouter } from 'next/navigation';

interface BetCardProps {
  match: BetMatch;
}

export function BetCard({ match }: BetCardProps) {
  const { homeTeam, awayTeam, competition, time, status, bettingStats } = match;
  const { totalBettors, homePercentage, awayPercentage } = bettingStats;
  const router = useRouter();

  const isLive = status === 'live';

  const handleCardClick = () => {
    router.push(`/bet/${match.id}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      className={`
        relative border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 
        hover:shadow-xl transition-all duration-300 hover:scale-[1.03] h-full cursor-pointer
        hover:border-purple-300 dark:hover:border-purple-700
        ${isLive ? 'border-l-4 border-l-green-500' : ''}
        group
      `}
    >
      {/* Live badge */}
      {isLive && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-green-500 text-white px-2 py-1 text-xs font-medium animate-pulse">
            ● LIVE
          </Badge>
        </div>
      )}

      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader className="pb-4 relative z-10">
        {/* Date and time */}
        <div className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          {competition} • {isLive ? 'Live now' : `Today at ${time}`}
        </div>

        {/* Teams face to face with color points */}
        <div className="flex items-center justify-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <span className="text-3xl group-hover:scale-110 transition-transform">
                {homeTeam.flag}
              </span>
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {homeTeam.name}
              </span>
            </div>
            <div
              className={`w-3 h-3 rounded-full ${homeTeam.color} group-hover:scale-125 transition-transform`}
            ></div>
          </div>

          <div className="text-gray-400 dark:text-gray-500 text-lg font-medium group-hover:text-purple-500 transition-colors">
            VS
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {awayTeam.name}
              </span>
              <span className="text-3xl group-hover:scale-110 transition-transform">
                {awayTeam.flag}
              </span>
            </div>
            <div
              className={`w-3 h-3 rounded-full ${awayTeam.color} group-hover:scale-125 transition-transform`}
            ></div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col h-full relative z-10">
        {/* Progress Bar avec pourcentages */}
        <div className="mb-6">
          <DualProgressBar
            homeTeam={{ color: homeTeam.color }}
            awayTeam={{ color: awayTeam.color }}
            homePercentage={homePercentage}
            awayPercentage={awayPercentage}
          />
        </div>

        {/* Spacer to push content down */}
        <div className="flex-1"></div>

        {/* Card bottom - Centered incentive message */}
        <div className="space-y-4">
          <div className="w-full">
            <IncitationBetText
              homePercentage={homePercentage}
              awayPercentage={awayPercentage}
              homeTeam={homeTeam.name}
              awayTeam={awayTeam.name}
            />
          </div>

          {/* Small separator bar */}
          <div className="w-full h-px bg-gray-200 dark:bg-gray-700 group-hover:bg-purple-300 dark:group-hover:bg-purple-600 transition-colors"></div>

          {/* Centered statistics */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            <Users className="h-4 w-4" />
            <span className="font-medium">{totalBettors} active bettors</span>
          </div>
        </div>
      </CardContent>

      {/* Click indicator at bottom right */}
      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">→</span>
        </div>
      </div>
    </Card>
  );
}
