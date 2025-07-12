'use client';

import { useState, useEffect } from 'react';
import { BetMatch } from '@/app/api/live-bets/route';

interface UseLiveBetsReturn {
  matches: BetMatch[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
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
