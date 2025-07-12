'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Trophy, Zap } from 'lucide-react';
import { UpcomingEvent } from '@/data/community';

interface UpcomingEventCardProps {
  event: UpcomingEvent;
}

export function UpcomingEventCard({ event }: UpcomingEventCardProps) {
  const getEventIcon = (type: UpcomingEvent['type']) => {
    switch (type) {
      case 'match':
        return <Trophy className="h-5 w-5 text-purple-500" />;
      case 'tournament':
        return <Zap className="h-5 w-5 text-orange-500" />;
      case 'special':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      default:
        return <Calendar className="h-5 w-5 text-gray-500" />;
    }
  };

  const getEventBadgeColor = (type: UpcomingEvent['type']) => {
    switch (type) {
      case 'match':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'tournament':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'special':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
            {getEventIcon(event.type)}
            {event.title}
          </CardTitle>
          <Badge className={getEventBadgeColor(event.type)}>{event.type}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {event.description}
        </p>

        {/* Date et heure */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{event.date}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{event.time}</span>
          </div>
        </div>

        {/* Reward */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
              Reward
            </span>
          </div>
          <div className="text-sm text-purple-700 dark:text-purple-300">
            {event.reward}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
