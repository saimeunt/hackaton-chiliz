'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, Wifi, Clock } from 'lucide-react';
import { LiveMatch } from '@/data/community';
import Link from 'next/link';

interface LiveMatchCardProps {
  match: LiveMatch;
}

export function LiveMatchCard({ match }: LiveMatchCardProps) {
  const formatPool = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K`;
    }
    return amount.toString();
  };

  return (
    <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Wifi className="h-5 w-5 text-green-500" />
            {match.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            {match.status === 'live' && (
              <Badge className="bg-green-500 text-white animate-pulse">
                LIVE
              </Badge>
            )}
            {match.status === 'upcoming' && (
              <Badge className="bg-blue-500 text-white">
                <Clock className="h-3 w-3 mr-1" />
                {match.startTime}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Score si match en live */}
        {match.status === 'live' && match.score && (
          <div className="flex items-center justify-center py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {match.score.home} - {match.score.away}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {match.homeTeam} vs {match.awayTeam}
              </div>
            </div>
          </div>
        )}

        {/* Statistiques */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400">
              <Users className="h-4 w-4" />
              <span className="text-sm">Connected</span>
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {match.connectedUsers}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Pool</span>
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {formatPool(match.totalPool)} CHZ
            </div>
          </div>
        </div>

        {/* Cotes */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Odds
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center py-2 bg-gray-50 dark:bg-gray-800 rounded">
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Home
              </div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {match.odds.home}
              </div>
            </div>
            <div className="text-center py-2 bg-gray-50 dark:bg-gray-800 rounded">
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Draw
              </div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {match.odds.draw}
              </div>
            </div>
            <div className="text-center py-2 bg-gray-50 dark:bg-gray-800 rounded">
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Away
              </div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {match.odds.away}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/bet/${match.id}`} className="flex-1">
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              {match.status === 'live' ? 'Join Live' : 'Place Bet'}
            </Button>
          </Link>
          <Button variant="outline" size="sm">
            <Users className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
