'use client';

import { ArrowLeft, TrendingUp, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function BetDetailPage() {
  const params = useParams();
  const betId = params.id as string;

  return (
    <div className="space-y-6">
      {/* Header avec bouton retour */}
      <div className="flex items-center gap-4">
        <Link href="/live-bets">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Live Bets
          </Button>
        </Link>
        <div>
          <h1 className="text-title font-rubik text-gray-900 dark:text-gray-100">
            Bet Details
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Place your stake and join the action
          </p>
        </div>
      </div>

      {/* Simulation of a detail page */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900 dark:text-gray-100">
                Match Information
              </CardTitle>
              <Badge className="bg-green-500 text-white">
                <Clock className="h-3 w-3 mr-1" />
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🏟️</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Bet #{betId}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                This is a simulation of the bet detail page.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Competition:
                </span>
                <span className="font-medium">Champions League</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Status:
                </span>
                <Badge className="bg-green-500 text-white">Live</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Total Bettors:
                </span>
                <span className="font-medium flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  156
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              Place Your Bet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎲</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Betting Interface
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                In a real application, you would have betting options, stake
                inputs, and odds here.
              </p>

              <div className="space-y-4">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  🚀 Place Bet (Coming Soon)
                </Button>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This is a prototype - betting functionality will be
                  implemented with Web3 integration.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Future development section */}
      <Card className="border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
              🔮 Future Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-purple-700 dark:text-purple-300">
              <div>📊 Real-time odds</div>
              <div>💰 Stake management</div>
              <div>🏆 Live results</div>
              <div>📱 Mobile notifications</div>
              <div>🔗 Blockchain integration</div>
              <div>👥 Social betting</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
