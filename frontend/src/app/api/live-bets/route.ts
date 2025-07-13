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
      name: 'AC Milan',
      flag: '🇮🇹',
      color: 'bg-emerald-500',
    },
    competition: 'Champions League',
    time: '20:00',
    status: 'live',
    bettingStats: {
      totalBettors: 156,
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
      color: 'bg-emerald-500',
    },
    competition: 'Champions League',
    time: '20:45',
    status: 'upcoming',
    bettingStats: {
      totalBettors: 142,
      homePercentage: 54,
      awayPercentage: 46,
    },
  },
  {
    id: '5',
    homeTeam: {
      name: 'Vitality',
      flag: '🇫🇷',
      color: 'bg-amber-500',
    },
    awayTeam: {
      name: 'MIBR',
      flag: '🇧🇷',
      color: 'bg-green-500',
    },
    competition: 'CS:GO Major',
    time: '19:00',
    status: 'live',
    bettingStats: {
      totalBettors: 312,
      homePercentage: 63,
      awayPercentage: 37,
    },
  },
  {
    id: '6',
    homeTeam: {
      name: 'OG',
      flag: '🇪🇺',
      color: 'bg-red-600',
    },
    awayTeam: {
      name: 'Team Heretics',
      flag: '🇪🇸',
      color: 'bg-slate-700',
    },
    competition: 'Valorant Champions Tour',
    time: '20:30',
    status: 'upcoming',
    bettingStats: {
      totalBettors: 189,
      homePercentage: 46,
      awayPercentage: 54,
    },
  },
];

export async function GET() {
  return NextResponse.json(mockMatches);
}
