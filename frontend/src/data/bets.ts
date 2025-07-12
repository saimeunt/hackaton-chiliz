export type BetStatus = 'won' | 'lost' | 'pending';

export interface Bet {
  id: string;
  event: string;
  team: string;
  opponent: string;
  amount: number;
  odds: number;
  potentialWin: number;
  status: BetStatus;
  date: string;
  sport: string;
  league: string;
  result?: string;
}

// Mock bets data - matches the profile statistics (23 total bets, 14 won, 9 lost)
export const mockBets: Bet[] = [
  // Won bets (14 total) - matches profile stats
  {
    id: '1',
    event: 'PSG vs Manchester City',
    team: 'PSG',
    opponent: 'Manchester City',
    amount: 50,
    odds: 2.8,
    potentialWin: 140,
    status: 'won',
    date: '2024-01-15',
    sport: 'Football',
    league: 'Champions League',
    result: 'PSG 2-1 Manchester City',
  },
  {
    id: '2',
    event: 'Liverpool vs Tottenham',
    team: 'Liverpool',
    opponent: 'Tottenham',
    amount: 60,
    odds: 2.1,
    potentialWin: 126,
    status: 'won',
    date: '2024-01-08',
    sport: 'Football',
    league: 'Premier League',
    result: 'Liverpool 3-1 Tottenham',
  },
  {
    id: '3',
    event: 'Bayern Munich vs Borussia Dortmund',
    team: 'Bayern Munich',
    opponent: 'Borussia Dortmund',
    amount: 45,
    odds: 1.85,
    potentialWin: 83.25,
    status: 'won',
    date: '2024-01-12',
    sport: 'Football',
    league: 'Bundesliga',
    result: 'Bayern Munich 2-0 Borussia Dortmund',
  },
  {
    id: '4',
    event: 'Juventus vs Napoli',
    team: 'Juventus',
    opponent: 'Napoli',
    amount: 35,
    odds: 2.3,
    potentialWin: 80.5,
    status: 'won',
    date: '2024-01-18',
    sport: 'Football',
    league: 'Serie A',
    result: 'Juventus 1-0 Napoli',
  },
  {
    id: '5',
    event: 'Manchester United vs Chelsea',
    team: 'Manchester United',
    opponent: 'Chelsea',
    amount: 40,
    odds: 2.6,
    potentialWin: 104,
    status: 'won',
    date: '2024-01-22',
    sport: 'Football',
    league: 'Premier League',
    result: 'Manchester United 2-1 Chelsea',
  },
  {
    id: '6',
    event: 'Barcelona vs Valencia',
    team: 'Barcelona',
    opponent: 'Valencia',
    amount: 55,
    odds: 1.7,
    potentialWin: 93.5,
    status: 'won',
    date: '2024-01-25',
    sport: 'Football',
    league: 'La Liga',
    result: 'Barcelona 3-0 Valencia',
  },
  {
    id: '7',
    event: 'Arsenal vs Manchester City',
    team: 'Arsenal',
    opponent: 'Manchester City',
    amount: 65,
    odds: 3.1,
    potentialWin: 201.5,
    status: 'won',
    date: '2024-01-28',
    sport: 'Football',
    league: 'Premier League',
    result: 'Arsenal 2-1 Manchester City',
  },
  {
    id: '8',
    event: 'Real Madrid vs Atletico Madrid',
    team: 'Real Madrid',
    opponent: 'Atletico Madrid',
    amount: 50,
    odds: 2.2,
    potentialWin: 110,
    status: 'won',
    date: '2024-02-01',
    sport: 'Football',
    league: 'La Liga',
    result: 'Real Madrid 3-2 Atletico Madrid',
  },
  {
    id: '9',
    event: 'AC Milan vs Inter Milan',
    team: 'AC Milan',
    opponent: 'Inter Milan',
    amount: 45,
    odds: 2.4,
    potentialWin: 108,
    status: 'won',
    date: '2024-02-05',
    sport: 'Football',
    league: 'Serie A',
    result: 'AC Milan 1-0 Inter Milan',
  },
  {
    id: '10',
    event: 'Atletico Madrid vs Sevilla',
    team: 'Atletico Madrid',
    opponent: 'Sevilla',
    amount: 30,
    odds: 1.9,
    potentialWin: 57,
    status: 'won',
    date: '2024-02-08',
    sport: 'Football',
    league: 'La Liga',
    result: 'Atletico Madrid 2-0 Sevilla',
  },
  {
    id: '11',
    event: 'Tottenham vs Newcastle',
    team: 'Tottenham',
    opponent: 'Newcastle',
    amount: 40,
    odds: 2.1,
    potentialWin: 84,
    status: 'won',
    date: '2024-02-12',
    sport: 'Football',
    league: 'Premier League',
    result: 'Tottenham 3-1 Newcastle',
  },
  {
    id: '12',
    event: 'RB Leipzig vs Borussia Dortmund',
    team: 'RB Leipzig',
    opponent: 'Borussia Dortmund',
    amount: 35,
    odds: 2.8,
    potentialWin: 98,
    status: 'won',
    date: '2024-02-15',
    sport: 'Football',
    league: 'Bundesliga',
    result: 'RB Leipzig 2-1 Borussia Dortmund',
  },
  {
    id: '13',
    event: 'Lazio vs Roma',
    team: 'Lazio',
    opponent: 'Roma',
    amount: 25,
    odds: 2.5,
    potentialWin: 62.5,
    status: 'won',
    date: '2024-02-18',
    sport: 'Football',
    league: 'Serie A',
    result: 'Lazio 2-1 Roma',
  },
  {
    id: '14',
    event: 'Brighton vs West Ham',
    team: 'Brighton',
    opponent: 'West Ham',
    amount: 20,
    odds: 2.3,
    potentialWin: 46,
    status: 'won',
    date: '2024-02-22',
    sport: 'Football',
    league: 'Premier League',
    result: 'Brighton 1-0 West Ham',
  },

  // Lost bets (9 total) - matches profile stats
  {
    id: '15',
    event: 'Real Madrid vs Barcelona',
    team: 'Real Madrid',
    opponent: 'Barcelona',
    amount: 75,
    odds: 1.95,
    potentialWin: 146.25,
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
    amount: 40,
    odds: 2.5,
    potentialWin: 100,
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
    amount: 50,
    odds: 2.7,
    potentialWin: 135,
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
    amount: 45,
    odds: 3.2,
    potentialWin: 144,
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
    amount: 30,
    odds: 4.1,
    potentialWin: 123,
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
    amount: 35,
    odds: 2.9,
    potentialWin: 101.5,
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
    amount: 40,
    odds: 2.4,
    potentialWin: 96,
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
    amount: 25,
    odds: 3.5,
    potentialWin: 87.5,
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
    amount: 30,
    odds: 2.8,
    potentialWin: 84,
    status: 'lost',
    date: '2024-02-20',
    sport: 'Football',
    league: 'Premier League',
    result: 'West Ham 1-2 Tottenham',
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
  const totalStaked = bets.reduce((sum, bet) => sum + bet.amount, 0);
  const totalWon = bets
    .filter((bet) => bet.status === 'won')
    .reduce((sum, bet) => sum + bet.potentialWin, 0);
  const totalLost = bets
    .filter((bet) => bet.status === 'lost')
    .reduce((sum, bet) => sum + bet.amount, 0);
  const netProfit = totalWon - totalLost;

  return {
    totalBets,
    wonBets,
    lostBets,
    pendingBets,
    winRate,
    totalStaked,
    totalWon,
    totalLost,
    netProfit,
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
