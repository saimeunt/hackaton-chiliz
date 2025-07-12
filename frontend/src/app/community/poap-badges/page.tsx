'use client';

import { ArrowLeft, Trophy, Zap, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  userPOAPBadges,
  getRarityColor,
  calculateTotalMultiplier,
} from '@/data/community';

export default function POAPBadgesPage() {
  const totalMultiplier = calculateTotalMultiplier(userPOAPBadges);
  const multiplierPercentage = (
    (totalMultiplier - userPOAPBadges.length) *
    100
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header avec bouton retour */}
      <div className="flex items-center gap-4">
        <Link href="/community">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Community
          </Button>
        </Link>
        <div>
          <h1 className="text-title font-rubik text-gray-900 dark:text-gray-100">
            My POAP Badges
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your collection of proof-of-attendance protocol badges
          </p>
        </div>
      </div>

      {/* Statistiques des multiplicateurs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {userPOAPBadges.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Badges
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {totalMultiplier.toFixed(1)}x
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Multiplier
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              +{multiplierPercentage}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Bonus Rewards
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Explication du système de multiplicateur */}
      <Card className="border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
        <CardHeader>
          <CardTitle className="text-purple-900 dark:text-purple-100 flex items-center gap-2">
            <Zap className="h-5 w-5" />
            How POAP Multipliers Work
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                🎯 Betting Rewards
              </h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                When you win a bet, your POAP badges multiply your rewards!
                Instead of getting just 20% of the pool, you get 20% × your
                total multiplier.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                💎 Rarity Matters
              </h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Legendary badges give the highest multipliers (2x+), while
                common badges provide smaller boosts (1.1x). Collect rare badges
                to maximize your rewards!
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              📊 Example Calculation
            </h4>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <div>• Base bet win: 1,000 CHZ tokens</div>
              <div>• Your multiplier: {totalMultiplier.toFixed(1)}x</div>
              <div className="font-semibold text-green-600 dark:text-green-400">
                • Total reward: {(1000 * totalMultiplier).toLocaleString()} CHZ
                tokens
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Collection de badges */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Your Badge Collection
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userPOAPBadges.map((badge) => (
            <Card
              key={badge.id}
              className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{badge.image}</div>
                    <div>
                      <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
                        {badge.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {badge.multiplier}x
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      Multiplier
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className={getRarityColor(badge.rarity)}>
                    {badge.rarity.charAt(0).toUpperCase() +
                      badge.rarity.slice(1)}
                  </Badge>
                  <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {badge.dateEarned.toLocaleDateString()}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {badge.eventName}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Event attended
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to action */}
      <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <CardContent className="p-6 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Want More Multipliers?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Join upcoming events and earn exclusive POAP badges to increase your
            betting rewards!
          </p>
          <Link href="/community">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Calendar className="h-4 w-4 mr-2" />
              View Upcoming Events
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
