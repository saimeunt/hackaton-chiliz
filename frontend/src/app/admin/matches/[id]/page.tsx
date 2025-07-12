'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAdmin } from '@/hooks/useAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Trophy,
  Clock,
  Play,
  Square,
  CheckCircle2,
  AlertCircle,
  Target,
  Copy,
} from 'lucide-react';
import { format } from 'date-fns';
import { getMatchById, type AdminMatch } from '@/data/admin-matches';
import { getTeamById } from '@/data/chiliz-teams';
import { toast } from 'sonner';
import { BackButton } from '@/components/shared/back-button';

export default function MatchDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { isAdmin, isLoading } = useAdmin();
  const matchId = params.id as string;

  const [finishDialogOpen, setFinishDialogOpen] = useState(false);
  const [winner, setWinner] = useState<
    'teamA' | 'teamB' | 'draw' | 'cancelled'
  >('teamA');
  const [scoreA, setScoreA] = useState<number>(0);
  const [scoreB, setScoreB] = useState<number>(0);
  const [isFinishing, setIsFinishing] = useState(false);

  const match = getMatchById(matchId);
  const teamA = match ? getTeamById(match.teamAId) : null;
  const teamB = match ? getTeamById(match.teamBId) : null;

  const handleFinishMatch = async () => {
    if (!match) return;

    setIsFinishing(true);
    try {
      // Simulate API call to finish match and update blockchain
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success('Match finished successfully!');
      setFinishDialogOpen(false);

      // Reset form
      setWinner('teamA');
      setScoreA(0);
      setScoreB(0);

      // Redirect to matches list
      router.push('/admin/matches');
    } catch {
      toast.error('Error finalizing match');
    } finally {
      setIsFinishing(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(`${type} copied!`);
  };

  const getStatusBadge = (status: AdminMatch['status']) => {
    switch (status) {
      case 'pending':
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
          >
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'active':
        return (
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
          >
            <Play className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case 'finished':
        return (
          <Badge
            variant="secondary"
            className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
          >
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Finished
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="mb-6 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            You do not have the necessary permissions to access this page
          </p>
        </div>
        <BackButton fallbackUrl="/" label="Back to Home" />
      </div>
    );
  }

  if (!match) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="mb-6 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Match Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            The requested match does not exist or has been deleted
          </p>
        </div>
        <BackButton fallbackUrl="/admin/matches" label="Back to Matches" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BackButton fallbackUrl="/admin/matches" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Match Details
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Complete management of match #{match.id}
          </p>
        </div>
      </div>

      {/* Match Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">
                {match.teamA} vs {match.teamB}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{match.sport}</Badge>
                <Badge variant="outline">{match.league}</Badge>
                {getStatusBadge(match.status)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {format(
                  new Date(match.startDate + 'T' + match.startTime),
                  'MMM dd, yyyy',
                )}
              </div>
              <div className="text-lg font-semibold">
                {format(
                  new Date(match.startDate + 'T' + match.startTime),
                  'HH:mm',
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Team A */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">{match.teamA}</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Fan Token
                  </span>
                  <Badge variant="secondary">
                    {teamA?.fanTokenSymbol || 'N/A'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Country
                  </span>
                  <span className="text-sm">{teamA?.country || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Contract Address
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono">
                      {teamA?.fanTokenAddress
                        ? `${teamA.fanTokenAddress.slice(0, 6)}...${teamA.fanTokenAddress.slice(-4)}`
                        : 'N/A'}
                    </span>
                    {teamA?.fanTokenAddress && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(teamA.fanTokenAddress, 'Address')
                        }
                        className="cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Team B */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">{match.teamB}</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Fan Token
                  </span>
                  <Badge variant="secondary">
                    {teamB?.fanTokenSymbol || 'N/A'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Country
                  </span>
                  <span className="text-sm">{teamB?.country || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Contract Address
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono">
                      {teamB?.fanTokenAddress
                        ? `${teamB.fanTokenAddress.slice(0, 6)}...${teamB.fanTokenAddress.slice(-4)}`
                        : 'N/A'}
                    </span>
                    {teamB?.fanTokenAddress && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(teamB.fanTokenAddress, 'Address')
                        }
                        className="cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Betting Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Betting Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Number of bets
                </span>
                <span className="font-semibold">{match.totalBets || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Total amount
                </span>
                <span className="font-semibold">
                  {match.totalAmount?.toLocaleString() || 0} fan tokens at stake
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Created on
                </span>
                <span className="text-sm">
                  {format(new Date(match.createdAt), 'PPP')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Status
                </span>
                {getStatusBadge(match.status)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Result (for finished matches) */}
      {match.status === 'finished' && match.result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Match Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <Trophy className="w-4 h-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="text-lg font-semibold">
                    {match.teamA} {match.result.scoreA} - {match.result.scoreB}{' '}
                    {match.teamB}
                  </div>
                  <div>
                    <strong>Winner:</strong>{' '}
                    {match.result.winner === 'teamA'
                      ? match.teamA
                      : match.result.winner === 'teamB'
                        ? match.teamB
                        : match.result.winner === 'cancelled'
                          ? 'Cancelled/Suspended'
                          : 'Draw'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Finished on{' '}
                    {format(new Date(match.result.finishedAt), 'PPP at HH:mm')}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(match.status === 'active' || match.status === 'pending') && (
              <Dialog
                open={finishDialogOpen}
                onOpenChange={setFinishDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="destructive" className="cursor-pointer">
                    <Square className="w-4 h-4 mr-2" />
                    Finish Match
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Finish Match</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Alert>
                      <AlertCircle className="w-4 h-4" />
                      <AlertDescription>
                        This action will finish the match and send the results
                        to the blockchain. It cannot be undone.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="font-semibold text-lg">
                          {match.teamA} vs {match.teamB}
                        </h3>
                      </div>

                      {winner !== 'cancelled' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Score {match.teamA}</Label>
                            <Input
                              type="number"
                              min="0"
                              value={scoreA}
                              onChange={(e) =>
                                setScoreA(parseInt(e.target.value) || 0)
                              }
                              className="cursor-text"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Score {match.teamB}</Label>
                            <Input
                              type="number"
                              min="0"
                              value={scoreB}
                              onChange={(e) =>
                                setScoreB(parseInt(e.target.value) || 0)
                              }
                              className="cursor-text"
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>Result</Label>
                        <Select
                          value={winner}
                          onValueChange={(
                            value: 'teamA' | 'teamB' | 'draw' | 'cancelled',
                          ) => setWinner(value)}
                        >
                          <SelectTrigger className="cursor-pointer">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              value="teamA"
                              className="cursor-pointer"
                            >
                              {match.teamA}
                            </SelectItem>
                            <SelectItem
                              value="teamB"
                              className="cursor-pointer"
                            >
                              {match.teamB}
                            </SelectItem>
                            <SelectItem value="draw" className="cursor-pointer">
                              Draw
                            </SelectItem>
                            <SelectItem
                              value="cancelled"
                              className="cursor-pointer"
                            >
                              Cancelled/Suspended
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleFinishMatch}
                        disabled={isFinishing}
                        className="flex-1 cursor-pointer disabled:cursor-not-allowed"
                      >
                        {isFinishing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Finalizing...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Confirm
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setFinishDialogOpen(false)}
                        disabled={isFinishing}
                        className="cursor-pointer disabled:cursor-not-allowed"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
