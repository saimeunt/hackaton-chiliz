'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Achievement, getDifficultyColor } from '@/data/achievements';
import { Lock, Check } from 'lucide-react';

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const {
    title,
    description,
    difficulty,
    reward,
    requirement,
    icon,
    progress = 0,
    unlocked,
  } = achievement;

  const difficultyColor = getDifficultyColor(difficulty);

  return (
    <Card
      className={`
      relative border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900
      hover:shadow-lg transition-all duration-300 h-full
      ${unlocked ? 'border-green-300 dark:border-green-700' : ''}
    `}
    >
      {/* Difficulty badge */}
      <div className="absolute top-3 right-3 z-10">
        <Badge
          className={`${difficultyColor} text-white text-xs font-medium capitalize`}
        >
          {difficulty}
        </Badge>
      </div>

      {/* Status icon */}
      <div className="absolute top-3 left-3 z-10">
        {unlocked ? (
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        ) : (
          <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
            <Lock className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      <CardHeader className="pb-4 pt-12">
        {/* Main icon */}
        <div className="flex justify-center mb-4">
          <div
            className={`
            w-16 h-16 rounded-full flex items-center justify-center text-4xl
            ${unlocked ? 'bg-green-100 dark:bg-green-900/20' : 'bg-gray-100 dark:bg-gray-800'}
          `}
          >
            {icon}
          </div>
        </div>

        <CardTitle className="text-center text-gray-900 dark:text-gray-100 text-lg">
          {title}
        </CardTitle>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
          {description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Requirement */}
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {requirement.description}
          </p>
        </div>

        {/* Progress Bar (if not yet unlocked) */}
        {!unlocked && progress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Reward - Style sobre comme dans livebets */}
        <div className="mt-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center bg-gray-50 dark:bg-gray-800/50">
            <div className="text-gray-700 dark:text-gray-300">
              <div className="text-2xl mb-2">
                {reward.type === 'tokens' && '🪙'}
                {reward.type === 'nft' && '🎨'}
                {reward.type === 'badge' && '🏆'}
                {reward.type === 'xp' && '⭐'}
              </div>
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                REWARD
              </div>
              <div className="text-sm font-semibold mt-1 text-gray-900 dark:text-gray-100">
                {reward.description}
              </div>
            </div>
          </div>
        </div>

        {/* Unlock date if applicable */}
        {unlocked && achievement.unlockedAt && (
          <div className="text-center pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-green-600 dark:text-green-400">
              Unlocked on {achievement.unlockedAt.toLocaleDateString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
