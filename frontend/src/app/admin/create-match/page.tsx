'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/hooks/useAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Calendar as CalendarIcon,
  Plus,
  AlertCircle,
  Trophy,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  getTeamsBySport,
  getAvailableSports,
  type ChilizTeam,
} from '@/data/chiliz-teams';
import { toast } from 'sonner';
import { useBettingPool } from '@/hooks/useBettingPool';
import { BackButton } from '@/components/shared/back-button';

export default function CreateMatchPage() {
  const router = useRouter();
  const { isAdmin, isLoading } = useAdmin();
  const { createBettingPool, isCreating: isCreatingPool } = useBettingPool();

  const [selectedSport, setSelectedSport] = useState<string>('');
  const [teamA, setTeamA] = useState<ChilizTeam | null>(null);
  const [teamB, setTeamB] = useState<ChilizTeam | null>(null);
  const [matchDate, setMatchDate] = useState<Date>();
  const [matchTime, setMatchTime] = useState<string>('');
  const [league, setLeague] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);

  const availableSports = getAvailableSports();
  const availableTeams = selectedSport ? getTeamsBySport(selectedSport) : [];

  // Filter teams for Team B selection (exclude Team A)
  const availableTeamsB = availableTeams.filter(
    (team) => team.id !== teamA?.id,
  );

  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamA || !teamB || !matchDate || !matchTime || !league) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (teamA.id === teamB.id) {
      toast.error('Both teams cannot be the same');
      return;
    }

    setIsCreating(true);

    try {
      // Create match start and end times
      const startDateTime = new Date(
        `${format(matchDate, 'yyyy-MM-dd')}T${matchTime}:00`,
      );
      const endDateTime = new Date(
        startDateTime.getTime() + 2 * 60 * 60 * 1000,
      ); // 2 hours after start

      // Create betting pool on blockchain
      await createBettingPool(teamA, teamB, startDateTime, endDateTime);

      // Here you would typically also call your backend API to store match data
      // const response = await fetch('/api/admin/matches', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     teamA: teamA.id,
      //     teamB: teamB.id,
      //     sport: selectedSport,
      //     league,
      //     date: format(matchDate, 'yyyy-MM-dd'),
      //     time: matchTime,
      //     description,
      //     startDateTime: startDateTime.toISOString(),
      //     endDateTime: endDateTime.toISOString()
      //   })
      // })

      toast.success('Match and betting pool created successfully!');
      router.push('/admin/matches');
    } catch {
      toast.error('Error creating match');
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setSelectedSport('');
    setTeamA(null);
    setTeamB(null);
    setMatchDate(undefined);
    setMatchTime('');
    setLeague('');
    setDescription('');
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BackButton fallbackUrl="/admin/matches" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create a New Match
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Configure a match between two teams with Chiliz fan tokens
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Match Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateMatch} className="space-y-6">
            {/* Sport Selection */}
            <div className="space-y-2">
              <Label htmlFor="sport">Sport *</Label>
              <Select value={selectedSport} onValueChange={setSelectedSport}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Select a sport" />
                </SelectTrigger>
                <SelectContent>
                  {availableSports.map((sport) => (
                    <SelectItem
                      key={sport}
                      value={sport}
                      className="cursor-pointer"
                    >
                      {sport === 'football' && '⚽ Football'}
                      {sport === 'basketball' && '🏀 Basketball'}
                      {sport === 'esports' && '🎮 Esports'}
                      {sport === 'formula1' && '🏎️ Formula 1'}
                      {sport === 'mma' && '🥊 MMA'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Team Selection */}
            {selectedSport && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="teamA">Team A *</Label>
                    <Select
                      value={teamA?.id || ''}
                      onValueChange={(value) =>
                        setTeamA(
                          availableTeams.find((t) => t.id === value) || null,
                        )
                      }
                    >
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder="Select Team A" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTeams.map((team) => (
                          <SelectItem
                            key={team.id}
                            value={team.id}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <span>{team.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                {team.fanTokenSymbol}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teamB">Team B *</Label>
                    <Select
                      value={teamB?.id || ''}
                      onValueChange={(value) =>
                        setTeamB(
                          availableTeamsB.find((t) => t.id === value) || null,
                        )
                      }
                      disabled={!teamA}
                    >
                      <SelectTrigger
                        className={cn(
                          'cursor-pointer',
                          !teamA && 'cursor-not-allowed',
                        )}
                      >
                        <SelectValue placeholder="Select Team B" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTeamsB.map((team) => (
                          <SelectItem
                            key={team.id}
                            value={team.id}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <span>{team.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                {team.fanTokenSymbol}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Match Preview */}
                {teamA && teamB && (
                  <Alert>
                    <Trophy className="w-4 h-4" />
                    <AlertDescription>
                      <strong>Match:</strong> {teamA.name} vs {teamB.name}
                      <br />
                      <strong>Fan Tokens:</strong> {teamA.fanTokenSymbol} vs{' '}
                      {teamB.fanTokenSymbol}
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}

            {/* League */}
            <div className="space-y-2">
              <Label htmlFor="league">Competition *</Label>
              <Input
                id="league"
                type="text"
                placeholder="e.g., Champions League, Premier League, etc."
                value={league}
                onChange={(e) => setLeague(e.target.value)}
                className="cursor-text"
                required
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Match Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal cursor-pointer',
                        !matchDate && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {matchDate ? (
                        format(matchDate, 'PPP')
                      ) : (
                        <span>Select a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={matchDate}
                      onSelect={setMatchDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Match Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={matchTime}
                  onChange={(e) => setMatchTime(e.target.value)}
                  className="cursor-text"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Add additional details about the match..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="cursor-text"
                rows={3}
              />
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isCreating || isCreatingPool}
                className="flex-1 cursor-pointer disabled:cursor-not-allowed"
              >
                {isCreating || isCreatingPool ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Match
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={isCreating || isCreatingPool}
                className="cursor-pointer disabled:cursor-not-allowed"
              >
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
