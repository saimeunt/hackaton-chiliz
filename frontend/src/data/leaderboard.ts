import { getCurrentLevel } from './profile';

export interface LeaderboardPlayer {
  id: string;
  username: string;
  avatar: string;
  score: number;
  xp: number;
  wins: number;
  losses: number;
  winRate: number;
  streak: number;
  rank: number;
  favoriteTeam: string;
  level: {
    name: string;
    emoji: string;
    color: string;
  };
}

export interface ClubLeaderboard {
  teamId: string;
  teamName: string;
  teamLogo: string;
  teamColor: string;
  players: LeaderboardPlayer[];
}

// Fun motivational phrases to encourage players to climb the leaderboard
export const motivationalPhrases = [
  'Rise from the depths and conquer the leaderboard! 🚀',
  'Every legend starts somewhere - make your mark! ⚡',
  'The top awaits those who dare to climb! 🏆',
  'From tadpole to shark - your journey starts now! 🦈',
  "Champions aren't made in comfort zones! 💪",
  'Your next victory could change everything! 🔥',
  'The leaderboard is calling - will you answer? 📢',
  'Every loss is a lesson, every win is progress! 📈',
  'Join the elite - prove you belong at the top! 👑',
  'The ocean of competition needs its next apex predator! 🌊',
];

// Mock leaderboard data with XP and levels
export const leaderboardData: LeaderboardPlayer[] = [
  {
    id: '1',
    username: 'CryptoKing',
    avatar: '/avatar/avatar.png',
    score: 2840,
    xp: 1650,
    wins: 45,
    losses: 12,
    winRate: 78.9,
    streak: 7,
    rank: 1,
    favoriteTeam: 'psg',
    level: getCurrentLevel(1650),
  },
  {
    id: '2',
    username: 'BetMaster',
    avatar: '/avatar/avatar.png',
    score: 2650,
    xp: 1420,
    wins: 38,
    losses: 15,
    winRate: 71.7,
    streak: 3,
    rank: 2,
    favoriteTeam: 'barcelona',
    level: getCurrentLevel(1420),
  },
  {
    id: '3',
    username: 'SportsFan',
    avatar: '/avatar/avatar.png',
    score: 2480,
    xp: 1280,
    wins: 32,
    losses: 18,
    winRate: 64.0,
    streak: 1,
    rank: 3,
    favoriteTeam: 'juventus',
    level: getCurrentLevel(1280),
  },
  {
    id: '4',
    username: 'LuckyStrike',
    avatar: '/avatar/avatar.png',
    score: 2320,
    xp: 1150,
    wins: 29,
    losses: 21,
    winRate: 58.0,
    streak: 2,
    rank: 4,
    favoriteTeam: 'milan',
    level: getCurrentLevel(1150),
  },
  {
    id: '5',
    username: 'ChampionBet',
    avatar: '/avatar/avatar.png',
    score: 2180,
    xp: 1050,
    wins: 26,
    losses: 19,
    winRate: 57.8,
    streak: 1,
    rank: 5,
    favoriteTeam: 'psg',
    level: getCurrentLevel(1050),
  },
  {
    id: '6',
    username: 'SharkAttack',
    avatar: '/avatar/avatar.png',
    score: 2050,
    xp: 950,
    wins: 24,
    losses: 16,
    winRate: 60.0,
    streak: 4,
    rank: 6,
    favoriteTeam: 'barcelona',
    level: getCurrentLevel(950),
  },
  {
    id: '7',
    username: 'DolphinRider',
    avatar: '/avatar/avatar.png',
    score: 1920,
    xp: 850,
    wins: 22,
    losses: 18,
    winRate: 55.0,
    streak: 0,
    rank: 7,
    favoriteTeam: 'juventus',
    level: getCurrentLevel(850),
  },
  {
    id: '8',
    username: 'AquaWarrior',
    avatar: '/avatar/avatar.png',
    score: 1800,
    xp: 750,
    wins: 20,
    losses: 20,
    winRate: 50.0,
    streak: 2,
    rank: 8,
    favoriteTeam: 'milan',
    level: getCurrentLevel(750),
  },
  {
    id: '9',
    username: 'TidalWave',
    avatar: '/avatar/avatar.png',
    score: 1680,
    xp: 650,
    wins: 18,
    losses: 22,
    winRate: 45.0,
    streak: 1,
    rank: 9,
    favoriteTeam: 'psg',
    level: getCurrentLevel(650),
  },
  {
    id: '10',
    username: 'DeepSeaDiver',
    avatar: '/avatar/avatar.png',
    score: 1550,
    xp: 550,
    wins: 16,
    losses: 24,
    winRate: 40.0,
    streak: 0,
    rank: 10,
    favoriteTeam: 'barcelona',
    level: getCurrentLevel(550),
  },
];

// Function to get club-specific leaderboards
export function getClubLeaderboards(): ClubLeaderboard[] {
  const clubs = ['psg', 'barcelona', 'juventus', 'milan'];

  return clubs.map((teamId) => {
    const teamPlayers = leaderboardData
      .filter((player) => player.favoriteTeam === teamId)
      .sort((a, b) => b.score - a.score)
      .map((player, index) => ({
        ...player,
        rank: index + 1,
      }));

    return {
      teamId,
      teamName: getTeamName(teamId),
      teamLogo: `/teams/${teamId}.png`,
      teamColor: getTeamColor(teamId),
      players: teamPlayers,
    };
  });
}

// Helper functions for team data
function getTeamName(teamId: string): string {
  const teamNames: { [key: string]: string } = {
    psg: 'Paris Saint-Germain',
    barcelona: 'FC Barcelona',
    juventus: 'Juventus FC',
    milan: 'AC Milan',
  };
  return teamNames[teamId] || teamId;
}

function getTeamColor(teamId: string): string {
  const teamColors: { [key: string]: string } = {
    psg: 'bg-blue-500',
    barcelona: 'bg-purple-500',
    juventus: 'bg-black',
    milan: 'bg-red-500',
  };
  return teamColors[teamId] || 'bg-gray-500';
}

export function getRandomMotivationalPhrase(): string {
  return motivationalPhrases[
    Math.floor(Math.random() * motivationalPhrases.length)
  ];
}

export function getTopStreak(): number {
  return Math.max(...leaderboardData.map((p) => p.streak));
}

export function getAverageScore(): number {
  return Math.round(
    leaderboardData.reduce((sum, player) => sum + player.score, 0) /
      leaderboardData.length,
  );
}
