'use client';

import { TrendingUp, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BetCard } from '@/components/shared/bet-card';
import { useLiveBets } from '@/hooks/useLiveBets';

export default function LiveBets() {
  const { matches, loading, error, refetch } = useLiveBets();

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-purple-500" />
          <div>
            <h1 className="text-title font-rubik text-gray-900 dark:text-gray-100">
              Live Bets
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Discover all ongoing bets and place your stakes
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Failed to load matches
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            {error}
          </p>
          <Button onClick={refetch} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-purple-500" />
          <div>
            <h1 className="text-title font-rubik text-gray-900 dark:text-gray-100">
              Live Bets
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Discover all ongoing bets and place your stakes
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={refetch}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          // Skeleton loading state
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-4 p-6 border rounded-lg">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-4 w-32" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-3 w-full" />
              </div>
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))
        ) : matches.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 space-y-4">
            <TrendingUp className="h-12 w-12 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              No live bets available
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              Check back later for new betting opportunities
            </p>
          </div>
        ) : (
          matches.map((match) => <BetCard key={match.id} match={match} />)
        )}
      </div>
    </div>
  );
}
