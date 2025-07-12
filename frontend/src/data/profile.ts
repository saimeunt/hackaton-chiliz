// Fun leveling system from tadpole to shark
export const LEVELS = [
  {
    name: 'Tadpole',
    emoji: '🐸',
    min: 0,
    max: 99,
    color: 'bg-green-100 text-green-800',
  },
  {
    name: 'Fish',
    emoji: '🐠',
    min: 100,
    max: 299,
    color: 'bg-blue-100 text-blue-800',
  },
  {
    name: 'Dolphin',
    emoji: '🐬',
    min: 300,
    max: 699,
    color: 'bg-cyan-100 text-cyan-800',
  },
  {
    name: 'Orca',
    emoji: '🐋',
    min: 700,
    max: 1499,
    color: 'bg-purple-100 text-purple-800',
  },
  {
    name: 'Shark',
    emoji: '🦈',
    min: 1500,
    max: Infinity,
    color: 'bg-red-100 text-red-800',
  },
];

export interface UserStats {
  xp: number;
  totalBets: number;
  wonBets: number;
  lostBets: number;
  achievements: number;
  poapBadges: number;
  joinDate: string;
  favoriteTeam: string;
  winRate: number;
}

// Mock user data - to be replaced with real data from API/blockchain
export const mockUserStats: UserStats = {
  xp: 750,
  totalBets: 25,
  wonBets: 14,
  lostBets: 9,
  achievements: 8,
  poapBadges: 5,
  joinDate: '2024-01-15',
  favoriteTeam: 'PSG',
  winRate: 60.9,
};

export function getCurrentLevel(xp: number) {
  return (
    LEVELS.find((level) => xp >= level.min && xp <= level.max) || LEVELS[0]
  );
}

export function getNextLevel(xp: number) {
  return LEVELS.find((level) => xp < level.min) || LEVELS[LEVELS.length - 1];
}

export function calculateProgressToNext(xp: number) {
  const currentLevel = getCurrentLevel(xp);
  const nextLevel = getNextLevel(xp);

  if (nextLevel.min === Infinity) return 100;

  return ((xp - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100;
}

export function formatAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
