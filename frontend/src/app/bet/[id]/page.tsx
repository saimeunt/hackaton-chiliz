'use client';

import {
  ArrowLeft,
  TrendingUp,
  Users,
  Clock,
  AlertCircle,
  Coins,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useParams, useRouter } from 'next/navigation';
import { useMatchById } from '@/hooks/useLiveBets';
import { useState, useEffect, useCallback } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { Address, erc20Abi } from 'viem';
import { chilizTeams } from '@/data/chiliz-teams';
import { usePlaceBet } from '@/hooks/usePlaceBet';
import { useBettingPoolInfo } from '@/hooks/useBettingPoolInfo';
import { toast } from 'sonner';

export default function BetDetailPage() {
  const { address, isConnected } = useAccount();
  const params = useParams();
  const router = useRouter();
  const poolAddress = params.id as string;
  const { match, loading, error } = useMatchById(poolAddress);
  const [canGoBack, setCanGoBack] = useState(false);
  const [isRefreshingBalances, setIsRefreshingBalances] = useState(false);

  const [selectedTeam, setSelectedTeam] = useState<'home' | 'away' | null>(
    null,
  );
  const [betAmount, setBetAmount] = useState('');

  // Token balance contracts with refetch capability
  const { 
    data: psgBalance, 
    refetch: refetchPsgBalance 
  } = useReadContract({
    address: chilizTeams.find(({ id }) => id === 'psg')!
      .fanTokenAddress as Address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address!],
    query: { enabled: isConnected },
  });

  const { 
    data: acmBalance, 
    refetch: refetchAcmBalance 
  } = useReadContract({
    address: chilizTeams.find(({ id }) => id === 'ac-milan')!
      .fanTokenAddress as Address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address!],
    query: { enabled: isConnected },
  });

  // Callback to refresh all token balances
  const refreshTokenBalances = useCallback(async () => {
    console.log('Refreshing token balances after successful bet...');
    setIsRefreshingBalances(true);
    try {
      await Promise.all([
        refetchPsgBalance(),
        refetchAcmBalance(),
      ]);
      console.log('Token balances refreshed successfully');
      toast.success('Token balances updated! 💰');
    } catch (error) {
      console.error('Error refreshing token balances:', error);
      toast.error('Failed to update token balances');
    } finally {
      setIsRefreshingBalances(false);
    }
  }, [refetchPsgBalance, refetchAcmBalance]);

  // Initialize hooks for betting functionality with success callback
  const { placeBet, isPlacingBet, isApproving } = usePlaceBet({
    onSuccess: refreshTokenBalances,
  });

  // Utiliser l'adresse du pool pour le hook
  const poolInfo = useBettingPoolInfo(poolAddress as Address);

  useEffect(() => {
    // Check if there's a previous page in the history
    setCanGoBack(window.history.length > 1);
  }, []);

  const handleBackClick = () => {
    if (canGoBack) {
      router.back();
    } else {
      router.push('/live-bets');
    }
  };

  // Simulated fan token balances
  const fanTokens = {
    PSG: psgBalance,
    Barcelona: 0,
    'Real Madrid': 750,
    Liverpool: 0,
    'Bayern Munich': 0,
    'Manchester City': 890,
    Arsenal: 0,
    'AC Milan': acmBalance,
    Vitality: 2100,
    MIBR: 0,
    OG: 0,
    'Team Heretics': 450,
  };

  const getSportIcon = (competition: string) => {
    const esportCompetitions = [
      'CS:GO Major',
      'Valorant Champions Tour',
      'League of Legends',
      'Dota 2',
    ];
    return esportCompetitions.includes(competition) ? '🎮' : '⚽';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return (
          <Badge className="bg-green-500 text-white animate-pulse">
            ● LIVE
          </Badge>
        );
      case 'upcoming':
        return (
          <Badge className="bg-blue-500 text-white">
            <Clock className="h-3 w-3 mr-1" />
            {match?.time}
          </Badge>
        );
      default:
        return <Badge className="bg-gray-500 text-white">Finished</Badge>;
    }
  };

  const handlePlaceBet = async () => {
    if (
      !selectedTeam ||
      !betAmount ||
      !match ||
      !poolInfo.team1Token ||
      !poolInfo.team2Token ||
      !poolAddress
    ) {
      console.error('Missing required data for placing bet');
      toast.error(
        'Missing required data for placing bet. Please refresh the page.',
      );
      return;
    }

    // Check if pool has errors
    if (poolInfo.hasError) {
      toast.error('Unable to load pool information. Please try again later.');
      return;
    }

    // Validate bet amount
    const betAmountNum = parseFloat(betAmount);
    if (isNaN(betAmountNum) || betAmountNum <= 0) {
      toast.error('Please enter a valid bet amount');
      return;
    }

    // Check if match is still open for betting
    if (poolInfo.matchStatus !== undefined && poolInfo.matchStatus !== 0) {
      toast.error('Betting is closed for this match');
      return;
    }

    const teamToken =
      selectedTeam === 'home' ? poolInfo.team1Token : poolInfo.team2Token;

    // Check token balance
    const tokenBalance =
      selectedTeam === 'home' ? homeTokenBalance : awayTokenBalance;
    if (tokenBalance < betAmountNum) {
      toast.error(
        `Insufficient ${selectedTeam === 'home' ? match.homeTeam.name : match.awayTeam.name} tokens. You have ${tokenBalance} tokens.`,
      );
      return;
    }

    try {
      await placeBet({
        poolAddress: poolAddress as Address,
        teamToken,
        amount: betAmount,
      });

      // Reset form on success
      setBetAmount('');
      setSelectedTeam(null);
    } catch (error) {
      console.error('Error placing bet:', error);
      toast.error('Failed to place bet. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleBackClick}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Match not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            {error || 'This match may not exist or may have been removed.'}
          </p>
        </div>
      </div>
    );
  }

  const homeTokenBalance =
    fanTokens[match.homeTeam.name as keyof typeof fanTokens] || 0;
  const awayTokenBalance =
    fanTokens[match.awayTeam.name as keyof typeof fanTokens] || 0;

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={handleBackClick}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-title font-rubik text-gray-900 dark:text-gray-100">
            {match.homeTeam.name} vs {match.awayTeam.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Place your stake and join the action
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Match Information */}
        <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900 dark:text-gray-100">
                Match Information
              </CardTitle>
              {getStatusBadge(match.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-6">
              <div className="text-6xl mb-4">
                {getSportIcon(match.competition)}
              </div>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl mb-1">{match.homeTeam.flag}</div>
                  <div className="font-bold text-gray-900 dark:text-gray-100">
                    {match.homeTeam.name}
                  </div>
                </div>
                <div className="text-gray-400 dark:text-gray-500 text-lg font-medium">
                  VS
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">{match.awayTeam.flag}</div>
                  <div className="font-bold text-gray-900 dark:text-gray-100">
                    {match.awayTeam.name}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Competition:
                </span>
                <span className="font-medium">{match.competition}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Status:
                </span>
                {getStatusBadge(match.status)}
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Total Bettors:
                </span>
                <span className="font-medium flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {match.bettingStats.totalBettors}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Betting Distribution:
                </span>
                <span className="font-medium">
                  {match.bettingStats.homePercentage}% -{' '}
                  {match.bettingStats.awayPercentage}%
                </span>
              </div>
              {poolInfo.team1Pool && poolInfo.team2Pool && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      {match.homeTeam.name} Pool:
                    </span>
                    <span className="font-medium">
                      {Number(poolInfo.team1Pool.totalAmount) / 1e18} tokens
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      {match.awayTeam.name} Pool:
                    </span>
                    <span className="font-medium">
                      {Number(poolInfo.team2Pool.totalAmount) / 1e18} tokens
                    </span>
                  </div>
                </>
              )}
              {poolInfo.matchStatus !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Match Status:
                  </span>
                  <span className="font-medium">
                    {poolInfo.matchStatus === 0
                      ? 'Active'
                      : poolInfo.matchStatus === 1
                        ? 'Ended'
                        : 'Pending'}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Place Your Bet */}
        <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              Place Your Bet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Team Selection */}
            <div className="space-y-3">
              <Label>Choose your team</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedTeam('home')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedTeam === 'home'
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{match.homeTeam.flag}</div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {match.homeTeam.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center justify-center gap-1">
                      <Coins className="h-3 w-3" />
                      {isRefreshingBalances ? (
                        <span className="flex items-center gap-1">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-600"></div>
                          Updating...
                        </span>
                      ) : (
                        `${homeTokenBalance} tokens`
                      )}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedTeam('away')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedTeam === 'away'
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{match.awayTeam.flag}</div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {match.awayTeam.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center justify-center gap-1">
                      <Coins className="h-3 w-3" />
                      {isRefreshingBalances ? (
                        <span className="flex items-center gap-1">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-600"></div>
                          Updating...
                        </span>
                      ) : (
                        `${awayTokenBalance} tokens`
                      )}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-3">
              <Label htmlFor="bet-amount">Bet Amount</Label>
              <div className="relative">
                <Input
                  id="bet-amount"
                  type="number"
                  placeholder="Enter amount..."
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="pr-20"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  {selectedTeam === 'home'
                    ? match.homeTeam.name
                    : selectedTeam === 'away'
                      ? match.awayTeam.name
                      : 'tokens'}
                </div>
              </div>
              {selectedTeam && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Available:{' '}
                  {isRefreshingBalances ? (
                    <span className="flex items-center gap-1">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-600"></div>
                      Updating...
                    </span>
                  ) : (
                    `${selectedTeam === 'home' ? homeTokenBalance : awayTokenBalance} ${
                      selectedTeam === 'home' ? match.homeTeam.name : match.awayTeam.name
                    } tokens`
                  )}
                </div>
              )}
            </div>

            {/* Validation Messages */}
            {selectedTeam && (
              <div className="space-y-2">
                {(selectedTeam === 'home'
                  ? homeTokenBalance
                  : awayTokenBalance) === 0 && (
                  <div className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    You need{' '}
                    {selectedTeam === 'home'
                      ? match.homeTeam.name
                      : match.awayTeam.name}{' '}
                    fan tokens to bet on this team
                  </div>
                )}
                {betAmount &&
                  parseInt(betAmount) >
                    (selectedTeam === 'home'
                      ? homeTokenBalance
                      : awayTokenBalance) && (
                    <div className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      Insufficient balance
                    </div>
                  )}
                {poolInfo.matchStatus === 1 && (
                  <div className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    This match has ended. No more bets can be placed.
                  </div>
                )}
              </div>
            )}

            {/* Transaction Status */}
            {(isApproving || isPlacingBet) && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm font-medium">
                    {isApproving
                      ? 'Approving tokens for betting...'
                      : 'Placing your bet on the blockchain...'}
                  </span>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Please wait while the transaction is being processed. Do not
                  close this page.
                </p>
              </div>
            )}

            {/* Place Bet Button */}
            <Button
              onClick={handlePlaceBet}
              disabled={
                !selectedTeam ||
                !betAmount ||
                parseInt(betAmount) <= 0 ||
                parseInt(betAmount) >
                  (selectedTeam === 'home'
                    ? homeTokenBalance
                    : awayTokenBalance) ||
                (selectedTeam === 'home'
                  ? homeTokenBalance
                  : awayTokenBalance) === 0 ||
                isPlacingBet ||
                isApproving ||
                poolInfo.matchStatus === 1
              }
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium"
            >
              <span className="text-white">
                {isApproving
                  ? '🔐 Approving Tokens...'
                  : isPlacingBet
                    ? '⏳ Placing Bet...'
                    : '🚀 Place Bet'}
              </span>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Fan Token Info */}
      <Card className="border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
              💰 Fan Token Requirements
            </h3>
            <p className="text-sm text-purple-700 dark:text-purple-300 mb-4">
              You need fan tokens from the team you want to support. Get them
              from the Chiliz ecosystem!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white dark:bg-purple-800/20 p-3 rounded-lg">
                <div className="font-medium text-purple-900 dark:text-purple-100">
                  Your {match.homeTeam.name} Tokens
                </div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {isRefreshingBalances ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                      Updating...
                    </span>
                  ) : (
                    homeTokenBalance
                  )}
                </div>
              </div>
              <div className="bg-white dark:bg-purple-800/20 p-3 rounded-lg">
                <div className="font-medium text-purple-900 dark:text-purple-100">
                  Your {match.awayTeam.name} Tokens
                </div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {isRefreshingBalances ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                      Updating...
                    </span>
                  ) : (
                    awayTokenBalance
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
