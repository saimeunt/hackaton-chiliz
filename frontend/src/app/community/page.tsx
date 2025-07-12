'use client';

import { Users, Trophy, Zap, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UpcomingEventCard } from '@/components/shared/upcoming-event-card';
import {
  upcomingEvents,
  userPOAPBadges,
  calculateTotalMultiplier,
} from '@/data/community';
import Link from 'next/link';

export default function Community() {
  const totalMultiplier = calculateTotalMultiplier(userPOAPBadges);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Users className="h-8 w-8 text-purple-500" />
        <div>
          <h1 className="text-title font-rubik text-gray-900 dark:text-gray-100">
            Community
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect with other bettors and share your live experiences
          </p>
        </div>
      </div>

      {/* Statistiques de la communauté */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">
              {userPOAPBadges.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Your POAP Badges
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">
              {totalMultiplier.toFixed(1)}x
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Your Multiplier
            </div>
          </CardContent>
        </Card>
      </div>

      {/* POAP Badges en avant - Clickable */}
      <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-purple-900 dark:text-purple-100 flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              POAP Badges Collection
            </CardTitle>
            <div className="flex items-center gap-2">
              <Link href="/community/poap-badges">
                <button className="text-purple-600 dark:text-purple-400 hover:underline text-sm">
                  View All
                </button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {userPOAPBadges.map((badge) => (
              <div key={badge.id} className="relative group cursor-pointer">
                <Link href="/community/poap-badges">
                  <div className="aspect-square bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700 flex items-center justify-center hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                    <div className="text-4xl">{badge.image}</div>
                  </div>
                  <div className="text-center mt-2">
                    <div className="text-sm font-medium text-purple-900 dark:text-purple-100">
                      {badge.name}
                    </div>
                    <div className="text-xs text-purple-600 dark:text-purple-400">
                      {badge.multiplier}x
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                Multiplier Advantage
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your POAP badges multiply your betting rewards! With your current{' '}
              {totalMultiplier.toFixed(1)}x multiplier, a 1,000 CHZ win becomes{' '}
              <span className="font-semibold text-green-600 dark:text-green-400">
                {(1000 * totalMultiplier).toLocaleString()} CHZ
              </span>
              .
              <Link
                href="/community/poap-badges"
                className="text-purple-600 dark:text-purple-400 hover:underline ml-1"
              >
                Learn more →
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Upcoming Events
          </h2>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {upcomingEvents.length} events scheduled
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingEvents.map((event) => (
            <UpcomingEventCard key={event.id} event={event} />
          ))}
        </div>
      </div>

      {/* Message d'encouragement */}
      <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <CardContent className="p-6 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Ready to Boost Your Rewards?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Join upcoming matches and events to earn more POAP badges and
            increase your multiplier! Each event you participate in gives you
            exclusive badges that multiply your future betting rewards.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            🏆 Participate in matches • 📈 Earn POAP badges • 💰 Multiply your
            winnings
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
