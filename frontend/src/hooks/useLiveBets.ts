'use client';

import { useState, useEffect } from 'react';
import { BetMatch } from '@/app/api/live-bets/route';

interface UseLiveBetsReturn {
  matches: BetMatch[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface UseMatchByIdReturn {
  match: BetMatch | null;
  loading: boolean;
  error: string | null;
}

export function useLiveBets(): UseLiveBetsReturn {
  const [matches, setMatches] = useState<BetMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/live-bets');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMatches(data);
    } catch (err) {
      console.error('Error fetching live bets:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch matches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return {
    matches,
    loading,
    error,
    refetch: fetchMatches,
  };
}

export function useMatchById(id: string): UseMatchByIdReturn {
  const [match, setMatch] = useState<BetMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatch = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/live-bets');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BetMatch[] = await response.json();
      const foundMatch = data.find((m) => m.id === id);

      if (!foundMatch) {
        throw new Error('Match not found');
      }

      setMatch(foundMatch);
    } catch (err) {
      console.error('Error fetching match:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch match');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatch();
  }, [id]);

  return {
    match,
    loading,
    error,
  };
}
