'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/hooks/useAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Plus,
  AlertCircle,
  Trophy,
  Users,
  Clock,
  Play,
  Square,
  CheckCircle2,
  Eye,
  Calendar,
} from 'lucide-react';
import { format } from 'date-fns';
import {
  getActiveMatches,
  getPendingMatches,
  getFinishedMatches,
  type AdminMatch,
} from '@/data/admin-matches';
import { getTeamById } from '@/data/chiliz-teams';
import { toast } from 'sonner';
import { useBettingPool } from '@/hooks/useBettingPool';
import { BackButton } from '@/components/shared/back-button';

const MatchCard = ({ match }: { match: AdminMatch }) => {
  const router = useRouter();
  const { finalizeBettingPool, isFinalizing } = useBettingPool();
  const [finishDialogOpen, setFinishDialogOpen] = useState(false);
  const [winner, setWinner] = useState<
    'teamA' | 'teamB' | 'draw' | 'cancelled'
  >('teamA');
  const [scoreA, setScoreA] = useState<number>(0);
  const [scoreB, setScoreB] = useState<number>(0);
  const [isFinishing, setIsFinishing] = useState(false);

  const teamA = getTeamById(match.teamAId);
  const teamB = getTeamById(match.teamBId);

  const handleFinishMatch = async () => {
    setIsFinishing(true);
    try {
      // Finalize betting pool on blockchain
      if (match.bettingPoolAddress) {
        // Convert 'cancelled' to 'draw' for blockchain, but keep track of real status
        const blockchainWinner = winner === 'cancelled' ? 'draw' : winner;
        await finalizeBettingPool(
          match.bettingPoolAddress,
          blockchainWinner,
          scoreA,
          scoreB,
        );
      }

      // Here you would typically also call your backend API
      // const response = await fetch(`/api/admin/matches/${match.id}/finish`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     winner,
      //     scoreA,
      //     scoreB
      //   })
      // })

      toast.success('Match finished and betting pool finalized successfully!');
      setFinishDialogOpen(false);

      // Reset form
      setWinner('teamA');
      setScoreA(0);
      setScoreB(0);
    } catch {
      toast.error('Error finalizing match');
    } finally {
      setIsFinishing(false);
    }
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

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">
              {match.teamA} vs {match.teamB}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Badge variant="outline">{match.sport}</Badge>
              <span>{match.league}</span>
            </div>
          </div>
          {getStatusBadge(match.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>
                {format(
                  new Date(match.startDate + 'T' + match.startTime),
                  "MMM dd, yyyy 'at' HH:mm",
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span>{match.totalBets || 0} bets</span>
            </div>
          </div>

          {/* Fan Tokens */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {teamA?.fanTokenSymbol || 'N/A'}
              </Badge>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                vs
              </span>
              <Badge variant="secondary" className="text-xs">
                {teamB?.fanTokenSymbol || 'N/A'}
              </Badge>
            </div>
            {match.totalAmount && (
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <span>
                  {match.totalAmount.toLocaleString()} fan tokens at stake
                </span>
              </div>
            )}
          </div>

          {/* Result for finished matches */}
          {match.status === 'finished' && match.result && (
            <Alert>
              <Trophy className="w-4 h-4" />
              <AlertDescription>
                <strong>Result:</strong> {match.result.scoreA} -{' '}
                {match.result.scoreB}
                <br />
                <strong>Winner:</strong>{' '}
                {match.result.winner === 'teamA'
                  ? match.teamA
                  : match.result.winner === 'teamB'
                    ? match.teamB
                    : match.result.winner === 'cancelled'
                      ? 'Cancelled/Suspended'
                      : 'Draw'}
              </AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/admin/matches/${match.id}`)}
              className="cursor-pointer"
            >
              <Eye className="w-4 h-4 mr-2" />
              Details
            </Button>

            {(match.status === 'active' || match.status === 'pending') && (
              <Dialog
                open={finishDialogOpen}
                onOpenChange={setFinishDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="cursor-pointer"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Finish
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
                        disabled={isFinishing || isFinalizing}
                        className="flex-1 cursor-pointer disabled:cursor-not-allowed"
                      >
                        {isFinishing || isFinalizing ? (
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
                        disabled={isFinishing || isFinalizing}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default function ManageMatchesPage() {
  const router = useRouter();
  const { isAdmin, isLoading } = useAdmin();
  const [activeTab, setActiveTab] = useState('active');

  const activeMatches = getActiveMatches();
  const pendingMatches = getPendingMatches();
  const finishedMatches = getFinishedMatches();

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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BackButton fallbackUrl="/" />
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Match Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage all matches created on the platform
          </p>
        </div>
        <Button
          onClick={() => router.push('/admin/create-match')}
          variant="default"
          className="cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Match
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Active Matches
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {activeMatches.length}
                </p>
              </div>
              <Play className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Pending
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {pendingMatches.length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Finished
                </p>
                <p className="text-2xl font-bold text-gray-600">
                  {finishedMatches.length}
                </p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Matches List */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active" className="cursor-pointer">
            Active ({activeMatches.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="cursor-pointer">
            Pending ({pendingMatches.length})
          </TabsTrigger>
          <TabsTrigger value="finished" className="cursor-pointer">
            Finished ({finishedMatches.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeMatches.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Play className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">
                  No Active Matches
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  There are currently no matches in progress.
                </p>
                <Button
                  onClick={() => router.push('/admin/create-match')}
                  className="cursor-pointer"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create a Match
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {activeMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingMatches.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">
                  No Pending Matches
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  All scheduled matches are active or finished.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pendingMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="finished" className="space-y-4">
          {finishedMatches.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">
                  No Finished Matches
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Finished matches will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {finishedMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
