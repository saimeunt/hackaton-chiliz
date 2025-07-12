'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  sortedNFTTrophies,
  getRarityColor,
  formatAcquiredDate,
} from '@/data/nft-trophies';
import { Calendar } from 'lucide-react';

export function NFTTrophyGrid() {
  if (sortedNFTTrophies.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏆</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          No Trophies Yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Complete achievements to earn NFT trophies!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            NFT Trophy Collection
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {sortedNFTTrophies.length} trophies earned • Sorted by acquisition
            date
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="h-4 w-4" />
          <span>Latest first</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedNFTTrophies.map((trophy) => {
          const rarityColor = getRarityColor(trophy.rarity);

          return (
            <Card
              key={trophy.id}
              className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
            >
              {/* Glow effect based on rarity */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${rarityColor.replace('bg-', 'bg-gradient-to-br from-')} to-transparent`}
              />

              {/* Rarity badge */}
              <div className="absolute top-3 right-3 z-10">
                <Badge
                  className={`${rarityColor} text-white text-xs font-medium capitalize`}
                >
                  {trophy.rarity}
                </Badge>
              </div>

              <CardHeader className="pb-4">
                {/* NFT icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 flex items-center justify-center text-5xl border-4 border-purple-200 dark:border-purple-700">
                    {trophy.image}
                  </div>
                </div>

                <CardTitle className="text-center text-gray-900 dark:text-gray-100 text-lg">
                  {trophy.name}
                </CardTitle>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {trophy.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Acquisition date */}
                <div className="text-center py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Acquired on
                  </div>
                  <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    {formatAcquiredDate(trophy.acquiredAt)}
                  </div>
                </div>

                {/* Attributes */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Attributes:
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {trophy.attributes.map((attr, index) => (
                      <div key={index} className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">
                          {attr.trait_type}:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {attr.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* NFT ID */}
                <div className="text-center pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    NFT ID: {trophy.id}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Statistics at bottom */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {(['common', 'rare', 'epic', 'legendary'] as const).map((rarity) => {
          const count = sortedNFTTrophies.filter(
            (t) => t.rarity === rarity,
          ).length;
          const color = getRarityColor(rarity);

          return (
            <div key={rarity} className="text-center">
              <div className={`w-8 h-8 ${color} rounded-full mx-auto mb-2`} />
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                {rarity}
              </div>
              <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                {count}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
