export type BetStatus = 'won' | 'lost' | 'pending';

export interface Bet {
  id: string;
  event: string;
  team: string;
  opponent: string;
  status: BetStatus;
  date: string;
  sport: string;
  league: string;
  result?: string;
  fanTokenWon?: number;
  fanTokenSymbol?: string;
  claimed?: boolean;
  fanTokenInvested?: number;
}

// Mock bets data - matches the profile statistics (23 total bets, 14 won, 9 lost, 2 pending)
export const mockBets: Bet[] = [
  // Won bets (14 total) - matches profile stats
  {
    id: '1',
    event: 'PSG vs Manchester City',
    team: 'PSG',
    opponent: 'Manchester City',
    status: 'won',
    date: '2024-01-15',
    sport: 'Football',
    league: 'Champions League',
    result: 'PSG 2-1 Manchester City',
    fanTokenWon: 150,
    fanTokenSymbol: 'PSG',
    claimed: true,
  },
  {
    id: '2',
    event: 'Liverpool vs Tottenham',
    team: 'Liverpool',
    opponent: 'Tottenham',
    status: 'won',
    date: '2024-01-08',
    sport: 'Football',
    league: 'Premier League',
    result: 'Liverpool 3-1 Tottenham',
    fanTokenWon: 120,
    fanTokenSymbol: 'LFC',
    claimed: false,
  },
  {
    id: '3',
    event: 'Bayern Munich vs Borussia Dortmund',
    team: 'Bayern Munich',
    opponent: 'Borussia Dortmund',
    status: 'won',
    date: '2024-01-12',
    sport: 'Football',
    league: 'Bundesliga',
    result: 'Bayern Munich 2-0 Borussia Dortmund',
    fanTokenWon: 85,
    fanTokenSymbol: 'FCB',
    claimed: true,
  },
  {
    id: '4',
    event: 'Juventus vs Napoli',
    team: 'Juventus',
    opponent: 'Napoli',
    status: 'won',
    date: '2024-01-18',
    sport: 'Football',
    league: 'Serie A',
    result: 'Juventus 1-0 Napoli',
    fanTokenWon: 80,
    fanTokenSymbol: 'JUV',
    claimed: false,
  },
  {
    id: '5',
    event: 'Manchester United vs Chelsea',
    team: 'Manchester United',
    opponent: 'Chelsea',
    status: 'won',
    date: '2024-01-22',
    sport: 'Football',
    league: 'Premier League',
    result: 'Manchester United 2-1 Chelsea',
    fanTokenWon: 100,
    fanTokenSymbol: 'MUN',
    claimed: true,
  },
  {
    id: '6',
    event: 'Barcelona vs Valencia',
    team: 'Barcelona',
    opponent: 'Valencia',
    status: 'won',
    date: '2024-01-25',
    sport: 'Football',
    league: 'La Liga',
    result: 'Barcelona 3-0 Valencia',
    fanTokenWon: 95,
    fanTokenSymbol: 'FCB',
    claimed: false,
  },
  {
    id: '7',
    event: 'Arsenal vs Manchester City',
    team: 'Arsenal',
    opponent: 'Manchester City',
    status: 'won',
    date: '2024-01-28',
    sport: 'Football',
    league: 'Premier League',
    result: 'Arsenal 2-1 Manchester City',
    fanTokenWon: 200,
    fanTokenSymbol: 'ARS',
    claimed: true,
  },
  {
    id: '8',
    event: 'Real Madrid vs Atletico Madrid',
    team: 'Real Madrid',
    opponent: 'Atletico Madrid',
    status: 'won',
    date: '2024-02-01',
    sport: 'Football',
    league: 'La Liga',
    result: 'Real Madrid 3-2 Atletico Madrid',
    fanTokenWon: 110,
    fanTokenSymbol: 'RMA',
    claimed: false,
  },
  {
    id: '9',
    event: 'AC Milan vs Inter Milan',
    team: 'AC Milan',
    opponent: 'Inter Milan',
    status: 'won',
    date: '2024-02-05',
    sport: 'Football',
    league: 'Serie A',
    result: 'AC Milan 1-0 Inter Milan',
    fanTokenWon: 105,
    fanTokenSymbol: 'ACM',
    claimed: true,
  },
  {
    id: '10',
    event: 'Atletico Madrid vs Sevilla',
    team: 'Atletico Madrid',
    opponent: 'Sevilla',
    status: 'won',
    date: '2024-02-08',
    sport: 'Football',
    league: 'La Liga',
    result: 'Atletico Madrid 2-0 Sevilla',
    fanTokenWon: 60,
    fanTokenSymbol: 'ATM',
    claimed: false,
  },
  {
    id: '11',
    event: 'Tottenham vs Newcastle',
    team: 'Tottenham',
    opponent: 'Newcastle',
    status: 'won',
    date: '2024-02-12',
    sport: 'Football',
    league: 'Premier League',
    result: 'Tottenham 3-1 Newcastle',
    fanTokenWon: 85,
    fanTokenSymbol: 'TOT',
    claimed: true,
  },
  {
    id: '12',
    event: 'RB Leipzig vs Borussia Dortmund',
    team: 'RB Leipzig',
    opponent: 'Borussia Dortmund',
    status: 'won',
    date: '2024-02-15',
    sport: 'Football',
    league: 'Bundesliga',
    result: 'RB Leipzig 2-1 Borussia Dortmund',
    fanTokenWon: 95,
    fanTokenSymbol: 'RBL',
    claimed: false,
  },
  {
    id: '13',
    event: 'Lazio vs Roma',
    team: 'Lazio',
    opponent: 'Roma',
    status: 'won',
    date: '2024-02-18',
    sport: 'Football',
    league: 'Serie A',
    result: 'Lazio 2-1 Roma',
    fanTokenWon: 65,
    fanTokenSymbol: 'LAZ',
    claimed: true,
  },
  {
    id: '14',
    event: 'Brighton vs West Ham',
    team: 'Brighton',
    opponent: 'West Ham',
    status: 'won',
    date: '2024-02-22',
    sport: 'Football',
    league: 'Premier League',
    result: 'Brighton 1-0 West Ham',
    fanTokenWon: 45,
    fanTokenSymbol: 'BRI',
    claimed: false,
  },

  // Lost bets (9 total) - matches profile stats
  {
    id: '15',
    event: 'Real Madrid vs Barcelona',
    team: 'Real Madrid',
    opponent: 'Barcelona',
    status: 'lost',
    date: '2024-01-10',
    sport: 'Football',
    league: 'La Liga',
    result: 'Real Madrid 1-3 Barcelona',
  },
  {
    id: '16',
    event: 'Inter Milan vs AC Milan',
    team: 'Inter Milan',
    opponent: 'AC Milan',
    status: 'lost',
    date: '2024-01-05',
    sport: 'Football',
    league: 'Serie A',
    result: 'Inter Milan 0-2 AC Milan',
  },
  {
    id: '17',
    event: 'Chelsea vs Liverpool',
    team: 'Chelsea',
    opponent: 'Liverpool',
    status: 'lost',
    date: '2024-01-16',
    sport: 'Football',
    league: 'Premier League',
    result: 'Chelsea 0-2 Liverpool',
  },
  {
    id: '18',
    event: 'Borussia Dortmund vs Bayern Munich',
    team: 'Borussia Dortmund',
    opponent: 'Bayern Munich',
    status: 'lost',
    date: '2024-01-20',
    sport: 'Football',
    league: 'Bundesliga',
    result: 'Borussia Dortmund 1-4 Bayern Munich',
  },
  {
    id: '19',
    event: 'Valencia vs Barcelona',
    team: 'Valencia',
    opponent: 'Barcelona',
    status: 'lost',
    date: '2024-01-30',
    sport: 'Football',
    league: 'La Liga',
    result: 'Valencia 0-1 Barcelona',
  },
  {
    id: '20',
    event: 'Newcastle vs Arsenal',
    team: 'Newcastle',
    opponent: 'Arsenal',
    status: 'lost',
    date: '2024-02-03',
    sport: 'Football',
    league: 'Premier League',
    result: 'Newcastle 1-2 Arsenal',
  },
  {
    id: '21',
    event: 'Napoli vs Juventus',
    team: 'Napoli',
    opponent: 'Juventus',
    status: 'lost',
    date: '2024-02-10',
    sport: 'Football',
    league: 'Serie A',
    result: 'Napoli 0-1 Juventus',
  },
  {
    id: '22',
    event: 'Sevilla vs Real Madrid',
    team: 'Sevilla',
    opponent: 'Real Madrid',
    status: 'lost',
    date: '2024-02-14',
    sport: 'Football',
    league: 'La Liga',
    result: 'Sevilla 0-3 Real Madrid',
  },
  {
    id: '23',
    event: 'West Ham vs Tottenham',
    team: 'West Ham',
    opponent: 'Tottenham',
    status: 'lost',
    date: '2024-02-20',
    sport: 'Football',
    league: 'Premier League',
    result: 'West Ham 1-2 Tottenham',
  },

  // Pending bets (2 total) - for testing pending status
  {
    id: '24',
    event: 'Manchester City vs Liverpool',
    team: 'Manchester City',
    opponent: 'Liverpool',
    status: 'pending',
    date: '2024-02-25',
    sport: 'Football',
    league: 'Premier League',
    fanTokenInvested: 75,
    fanTokenSymbol: 'MCI',
  },
  {
    id: '25',
    event: 'Barcelona vs Real Madrid',
    team: 'Barcelona',
    opponent: 'Real Madrid',
    status: 'pending',
    date: '2024-02-28',
    sport: 'Football',
    league: 'La Liga',
    fanTokenInvested: 90,
    fanTokenSymbol: 'FCB',
  },
];

// Utility functions for bet statistics
export function calculateBetStats(bets: Bet[]) {
  const totalBets = bets.length;
  const wonBets = bets.filter((bet) => bet.status === 'won').length;
  const lostBets = bets.filter((bet) => bet.status === 'lost').length;
  const pendingBets = bets.filter((bet) => bet.status === 'pending').length;
  const winRate =
    totalBets > 0 ? ((wonBets / (wonBets + lostBets)) * 100).toFixed(1) : 0;

  // Calculate unclaimed tokens
  const unclaimedTokens = bets
    .filter((bet) => bet.status === 'won' && !bet.claimed)
    .reduce((sum, bet) => sum + (bet.fanTokenWon || 0), 0);

  const totalTokensWon = bets
    .filter((bet) => bet.status === 'won')
    .reduce((sum, bet) => sum + (bet.fanTokenWon || 0), 0);

  return {
    totalBets,
    wonBets,
    lostBets,
    pendingBets,
    winRate,
    unclaimedTokens,
    totalTokensWon,
  };
}

export function getStatusIcon(status: BetStatus) {
  switch (status) {
    case 'won':
      return { icon: '✅', color: 'text-green-500' };
    case 'lost':
      return { icon: '❌', color: 'text-red-500' };
    case 'pending':
      return { icon: '⏳', color: 'text-orange-500' };
  }
}

export function getStatusColor(status: BetStatus) {
  switch (status) {
    case 'won':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'lost':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'pending':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
  }
}

export function getStatusLabel(status: BetStatus) {
  switch (status) {
    case 'won':
      return 'Won';
    case 'lost':
      return 'Lost';
    case 'pending':
      return 'Pending';
  }
}
