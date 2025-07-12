'use client';

import { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from '@/components/ui/carousel';
import { AchievementCard } from './achievement-card';
import { achievements } from '@/data/achievements';

interface AchievementsCarouselProps {
  itemsPerView?: number;
}

export function AchievementsCarousel({
  itemsPerView = 3,
}: AchievementsCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const totalItems = achievements.length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Achievements
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {achievements.filter((a) => a.unlocked).length} of {totalItems}{' '}
            unlocked
          </p>
        </div>
      </div>

      {/* Carrousel */}
      <Carousel
        setApi={setApi}
        opts={{
          align: 'start',
          slidesToScroll: itemsPerView,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {achievements.map((achievement) => (
            <CarouselItem
              key={achievement.id}
              className={`pl-2 md:pl-4 ${
                itemsPerView === 1
                  ? 'basis-full'
                  : itemsPerView === 2
                    ? 'basis-1/2'
                    : itemsPerView === 3
                      ? 'basis-1/3'
                      : 'basis-1/4'
              }`}
            >
              <AchievementCard achievement={achievement} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>

      {/* Indicateurs de page */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === current - 1
                ? 'bg-purple-500'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
            aria-label={`Go to page ${i + 1}`}
          />
        ))}
      </div>

      {/* Information de navigation */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Page {current} of {count}
      </div>
    </div>
  );
}
