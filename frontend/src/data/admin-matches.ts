export interface AdminMatch {
  id: string;
  teamA: string;
  teamB: string;
  teamAId: string;
  teamBId: string;
  sport: string;
  league: string;
  startDate: string;
  startTime: string;
  status: 'pending' | 'active' | 'finished';
  createdAt: string;
  result?: {
    winner: 'teamA' | 'teamB' | 'draw' | 'cancelled';
    scoreA: number;
    scoreB: number;
    finishedAt: string;
  };
  bettingPoolAddress?: string;
  totalBets?: number;
  totalAmount?: number;
}

export const mockAdminMatches: AdminMatch[] = [
  {
    id: '1',
    teamA: 'Paris Saint-Germain',
    teamB: 'FC Barcelona',
    teamAId: 'psg',
    teamBId: 'barcelona',
    sport: 'football',
    league: 'Champions League',
    startDate: '2024-12-28',
    startTime: '21:00',
    status: 'active',
    createdAt: '2024-12-20T10:00:00Z',
    bettingPoolAddress: '0x1234567890abcdef',
    totalBets: 245,
    totalAmount: 15600,
  },
  {
    id: '2',
    teamA: 'Juventus FC',
    teamB: 'AC Milan',
    teamAId: 'juventus',
    teamBId: 'ac-milan',
    sport: 'football',
    league: 'Serie A',
    startDate: '2024-12-29',
    startTime: '18:00',
    status: 'active',
    createdAt: '2024-12-21T14:30:00Z',
    bettingPoolAddress: '0x2345678901bcdef0',
    totalBets: 198,
    totalAmount: 12300,
  },
  {
    id: '3',
    teamA: 'Los Angeles Lakers',
    teamB: 'Boston Celtics',
    teamAId: 'la-lakers',
    teamBId: 'boston-celtics',
    sport: 'basketball',
    league: 'NBA',
    startDate: '2024-12-27',
    startTime: '03:00',
    status: 'finished',
    createdAt: '2024-12-19T16:45:00Z',
    result: {
      winner: 'teamA',
      scoreA: 118,
      scoreB: 102,
      finishedAt: '2024-12-27T05:30:00Z',
    },
    bettingPoolAddress: '0x3456789012cdef01',
    totalBets: 156,
    totalAmount: 9800,
  },
  {
    id: '4',
    teamA: 'OG Esports',
    teamB: 'Natus Vincere',
    teamAId: 'og-esports',
    teamBId: 'navi',
    sport: 'esports',
    league: 'CS:GO Major',
    startDate: '2024-12-30',
    startTime: '16:00',
    status: 'pending',
    createdAt: '2024-12-22T09:15:00Z',
    totalBets: 0,
    totalAmount: 0,
  },
];

export function getActiveMatches(): AdminMatch[] {
  return mockAdminMatches.filter((match) => match.status === 'active');
}

export function getPendingMatches(): AdminMatch[] {
  return mockAdminMatches.filter((match) => match.status === 'pending');
}

export function getFinishedMatches(): AdminMatch[] {
  return mockAdminMatches.filter((match) => match.status === 'finished');
}

export function getMatchById(id: string): AdminMatch | undefined {
  return mockAdminMatches.find((match) => match.id === id);
}
