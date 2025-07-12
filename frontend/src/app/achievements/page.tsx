'use client';

import { Trophy, Award, Star } from 'lucide-react';
import { AchievementsCarousel } from '@/components/shared/achievements-carousel';
import { NFTTrophyGrid } from '@/components/shared/nft-trophy-grid';
import { achievements } from '@/data/achievements';
import { Card, CardContent } from '@/components/ui/card';

export default function Achievements() {
  const totalAchievements = achievements.length;
  const unlockedAchievements = achievements.filter((a) => a.unlocked).length;
  const completionPercentage = Math.round(
    (unlockedAchievements / totalAchievements) * 100,
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Trophy className="h-8 w-8 text-purple-500" />
        <div>
          <h1 className="text-title font-rubik text-gray-900 dark:text-gray-100">
            Achievements
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your progress and unlock exclusive rewards
          </p>
        </div>
      </div>

      {/* General statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {unlockedAchievements}/{totalAchievements}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Achievements Unlocked
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {completionPercentage}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Completion Rate
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {
                achievements.filter(
                  (a) => a.difficulty === 'legendary' && a.unlocked,
                ).length
              }
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Legendary Unlocked
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Carrousel des achievements */}
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
        <AchievementsCarousel itemsPerView={3} />
      </div>

      {/* NFT Trophies section */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/10 dark:to-purple-800/10 rounded-lg p-6">
        <NFTTrophyGrid />
      </div>

      {/* Encouragement message */}
      <Card className="border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
            Keep Going, Champion!
          </h3>
          <p className="text-purple-700 dark:text-purple-300 mb-4">
            {unlockedAchievements === 0
              ? 'Start your journey by placing your first bet!'
              : unlockedAchievements === totalAchievements
                ? "Incredible! You've unlocked all achievements!"
                : `You're ${totalAchievements - unlockedAchievements} achievements away from completing everything!`}
          </p>
          <div className="text-sm text-purple-600 dark:text-purple-400">
            💡 Tip: Check the Live Bets section to start earning achievements
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
