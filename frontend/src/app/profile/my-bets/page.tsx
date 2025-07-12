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
  Target,
  Trophy,
  Calendar,
  CheckCircle,
  XCircle,
  Clock3,
  Coins,
  Gift,
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
  const [isClaimingToken, setIsClaimingToken] = useState(false);
  const [showClaimSuccess, setShowClaimSuccess] = useState(false);

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

  const handleClaimTokens = async () => {
    setIsClaimingToken(true);
    // Simulate web3 transaction
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsClaimingToken(false);
    setShowClaimSuccess(true);
    // Hide success message after 3 seconds
    setTimeout(() => setShowClaimSuccess(false), 3000);
    // In real app, this would update the bet's claimed status
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      {/* Success Alert */}
      {showClaimSuccess && (
        <div className="absolute top-2 left-2 right-2 z-50 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              You claimed {bet.fanTokenWon} {bet.fanTokenSymbol} tokens! 🎉
            </span>
          </div>
        </div>
      )}

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

          {bet.status === 'pending' &&
            bet.fanTokenInvested &&
            bet.fanTokenSymbol && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Fan tokens bet
                  </span>
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-blue-600">
                      {bet.fanTokenInvested} {bet.fanTokenSymbol}
                    </span>
                  </div>
                </div>
              </>
            )}

          {bet.status === 'won' && bet.fanTokenWon && bet.fanTokenSymbol && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Fan tokens won
              </span>
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-500" />
                <span className="font-medium text-green-600">
                  {bet.fanTokenWon} {bet.fanTokenSymbol}
                </span>
              </div>
            </div>
          )}

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

          {bet.status === 'won' && bet.fanTokenWon && (
            <div className="pt-3 border-t">
              {bet.claimed ? (
                <Button disabled className="w-full" variant="outline">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Tokens Already Claimed
                </Button>
              ) : (
                <Button
                  onClick={handleClaimTokens}
                  disabled={isClaimingToken}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 cursor-pointer"
                >
                  {isClaimingToken ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Claiming...
                    </>
                  ) : (
                    <>
                      <Gift className="w-4 h-4 mr-2" />
                      Claim {bet.fanTokenWon} {bet.fanTokenSymbol}
                    </>
                  )}
                </Button>
              )}
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
    unclaimedTokens,
    totalTokensWon,
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
                  {totalTokensWon}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Total fan tokens won
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {unclaimedTokens}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Unclaimed tokens
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
          <TabsTrigger value="all" className="cursor-pointer">
            All ({totalBets})
          </TabsTrigger>
          <TabsTrigger value="won" className="cursor-pointer">
            Won ({wonBets})
          </TabsTrigger>
          <TabsTrigger value="lost" className="cursor-pointer">
            Lost ({lostBets})
          </TabsTrigger>
          <TabsTrigger value="pending" className="cursor-pointer">
            Pending ({pendingBets})
          </TabsTrigger>
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
