'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Target,
  Trophy,
  Calendar,
  CheckCircle,
  XCircle,
  Clock3,
} from 'lucide-react';
import {
  mockBets,
  calculateBetStats,
  getStatusColor,
  getStatusLabel,
  type Bet,
  type BetStatus,
} from '@/data/bets';

function BetCard({ bet }: { bet: Bet }) {
  const getStatusIconComponent = (status: BetStatus) => {
    switch (status) {
      case 'won':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'lost':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock3 className="w-4 h-4 text-orange-500" />;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIconComponent(bet.status)}
            <CardTitle className="text-lg">{bet.event}</CardTitle>
          </div>
          <Badge className={getStatusColor(bet.status)}>
            {getStatusLabel(bet.status)}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Calendar className="w-4 h-4" />
          <span>{new Date(bet.date).toLocaleDateString('fr-FR')}</span>
          <span>•</span>
          <span>{bet.league}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Team chosen
            </span>
            <span className="font-medium">{bet.team}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Stake
            </span>
            <span className="font-medium">{bet.amount}€</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Odds
            </span>
            <span className="font-medium">{bet.odds}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Potential win
            </span>
            <span className="font-medium text-green-600">
              {bet.potentialWin}€
            </span>
          </div>
          {bet.result && (
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Result
                </span>
                <span className="font-medium text-sm">{bet.result}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function MyBets() {
  const { isConnected } = useAccount();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Check if there's a previous page in the history
    setCanGoBack(window.history.length > 1);
  }, []);

  const handleBackClick = () => {
    if (canGoBack) {
      router.back();
    } else {
      router.push('/profile');
    }
  };

  const filteredBets = mockBets.filter((bet) => {
    switch (activeTab) {
      case 'won':
        return bet.status === 'won';
      case 'lost':
        return bet.status === 'lost';
      case 'pending':
        return bet.status === 'pending';
      default:
        return true;
    }
  });

  // Calculate statistics using imported function
  const stats = calculateBetStats(mockBets);
  const {
    totalBets,
    wonBets,
    lostBets,
    pendingBets,
    winRate,
    totalStaked,
    netProfit,
  } = stats;

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="mb-6 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Connect your wallet
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            You need to connect your wallet to see your bets
          </p>
        </div>
        <div className="flex justify-center">
          <appkit-button />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={handleBackClick}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Bets
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            History and statistics of your bets
          </p>
        </div>
      </div>

      {/* General statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalBets}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Total Bets
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {winRate}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Win Rate
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalStaked}€
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Total staked
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              {netProfit >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-500" />
              )}
              <div>
                <p
                  className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {netProfit >= 0 ? '+' : ''}
                  {netProfit.toFixed(2)}€
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Net Profit
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Results breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Won
              </span>
              <span className="text-sm font-medium text-green-600">
                {wonBets}/{totalBets}
              </span>
            </div>
            <Progress value={(wonBets / totalBets) * 100} className="h-2" />

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Lost
              </span>
              <span className="text-sm font-medium text-red-600">
                {lostBets}/{totalBets}
              </span>
            </div>
            <Progress
              value={(lostBets / totalBets) * 100}
              className="h-2 [&_>div]:bg-red-500"
            />

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Pending
              </span>
              <span className="text-sm font-medium text-orange-600">
                {pendingBets}/{totalBets}
              </span>
            </div>
            <Progress
              value={(pendingBets / totalBets) * 100}
              className="h-2 [&_>div]:bg-orange-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Filter tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({totalBets})</TabsTrigger>
          <TabsTrigger value="won">Won ({wonBets})</TabsTrigger>
          <TabsTrigger value="lost">Lost ({lostBets})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingBets})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {filteredBets.map((bet) => (
              <BetCard key={bet.id} bet={bet} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="won" className="space-y-4">
          <div className="grid gap-4">
            {filteredBets.map((bet) => (
              <BetCard key={bet.id} bet={bet} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lost" className="space-y-4">
          <div className="grid gap-4">
            {filteredBets.map((bet) => (
              <BetCard key={bet.id} bet={bet} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className="grid gap-4">
            {filteredBets.map((bet) => (
              <BetCard key={bet.id} bet={bet} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredBets.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No bets in this category
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Start betting to see your results here
          </p>
        </div>
      )}
    </div>
  );
}
