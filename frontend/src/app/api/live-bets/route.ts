import { NextResponse } from 'next/server';

export interface BetMatch {
  id: string;
  homeTeam: {
    name: string;
    flag: string;
    color: string;
  };
  awayTeam: {
    name: string;
    flag: string;
    color: string;
  };
  competition: string;
  time: string;
  status: 'live' | 'upcoming' | 'finished';
  bettingStats: {
    totalBettors: number;
    homeBets: number;
    awayBets: number;
    homePercentage: number;
    awayPercentage: number;
  };
}

const mockMatches: BetMatch[] = [
  {
    id: '1',
    homeTeam: {
      name: 'PSG',
      flag: '🇫🇷',
      color: 'bg-blue-500',
    },
    awayTeam: {
      name: 'Barcelona',
      flag: '🇪🇸',
      color: 'bg-red-500',
    },
    competition: 'Champions League',
    time: '20:00',
    status: 'live',
    bettingStats: {
      totalBettors: 156,
      homeBets: 89,
      awayBets: 67,
      homePercentage: 57,
      awayPercentage: 43,
    },
  },
  {
    id: '2',
    homeTeam: {
      name: 'Real Madrid',
      flag: '🇪🇸',
      color: 'bg-purple-500',
    },
    awayTeam: {
      name: 'Liverpool',
      flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      color: 'bg-orange-500',
    },
    competition: 'Champions League',
    time: '22:00',
    status: 'upcoming',
    bettingStats: {
      totalBettors: 89,
      homeBets: 31,
      awayBets: 58,
      homePercentage: 35,
      awayPercentage: 65,
    },
  },
  {
    id: '3',
    homeTeam: {
      name: 'Bayern Munich',
      flag: '🇩🇪',
      color: 'bg-emerald-500',
    },
    awayTeam: {
      name: 'Manchester City',
      flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      color: 'bg-pink-500',
    },
    competition: 'Champions League',
    time: '21:00',
    status: 'live',
    bettingStats: {
      totalBettors: 203,
      homeBets: 124,
      awayBets: 79,
      homePercentage: 61,
      awayPercentage: 39,
    },
  },
  {
    id: '4',
    homeTeam: {
      name: 'Arsenal',
      flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      color: 'bg-yellow-500',
    },
    awayTeam: {
      name: 'AC Milan',
      flag: '🇮🇹',
      color: 'bg-indigo-500',
    },
    competition: 'Champions League',
    time: '20:45',
    status: 'upcoming',
    bettingStats: {
      totalBettors: 142,
      homeBets: 76,
      awayBets: 66,
      homePercentage: 54,
      awayPercentage: 46,
    },
  },
];

export async function GET() {
  return NextResponse.json(mockMatches);
}
