export interface Achievement {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'legendary';
  reward: {
    type: 'tokens' | 'nft' | 'badge' | 'xp';
    amount: number;
    description: string;
  };
  requirement: {
    type:
      | 'bets_placed'
      | 'first_connection'
      | 'win_streak'
      | 'total_winnings'
      | 'community_engagement'
      | 'referrals';
    target: number;
    description: string;
  };
  icon: string;
  progress?: number; // 0-100
  unlocked: boolean;
  unlockedAt?: Date;
}

export const achievements: Achievement[] = [
  // Beginner (1-3)
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Welcome to Clash of FanZ! Your journey begins here.',
    difficulty: 'beginner',
    reward: {
      type: 'tokens',
      amount: 50,
      description: '50 CFZ Tokens',
    },
    requirement: {
      type: 'first_connection',
      target: 1,
      description: 'Connect your wallet for the first time',
    },
    icon: '🚀',
    progress: 100,
    unlocked: true,
    unlockedAt: new Date('2024-01-15'),
  },
  {
    id: 'first-bet',
    title: 'First Bet',
    description: 'Place your very first bet and feel the thrill!',
    difficulty: 'beginner',
    reward: {
      type: 'tokens',
      amount: 100,
      description: '100 CFZ Tokens',
    },
    requirement: {
      type: 'bets_placed',
      target: 1,
      description: 'Place your first bet',
    },
    icon: '🎯',
    progress: 100,
    unlocked: true,
    unlockedAt: new Date('2024-01-15'),
  },
  {
    id: 'betting-rookie',
    title: 'Betting Rookie',
    description: "You're getting the hang of this! Keep it up.",
    difficulty: 'beginner',
    reward: {
      type: 'xp',
      amount: 250,
      description: '250 XP Points',
    },
    requirement: {
      type: 'bets_placed',
      target: 5,
      description: 'Place 5 bets',
    },
    icon: '⭐',
    progress: 80,
    unlocked: false,
  },

  // Intermediate (4-6)
  {
    id: 'steady-bettor',
    title: 'Steady Bettor',
    description: 'Consistency is key in the betting world.',
    difficulty: 'intermediate',
    reward: {
      type: 'tokens',
      amount: 300,
      description: '300 CFZ Tokens',
    },
    requirement: {
      type: 'bets_placed',
      target: 25,
      description: 'Place 25 bets',
    },
    icon: '📈',
    progress: 32,
    unlocked: false,
  },
  {
    id: 'hot-streak',
    title: 'Hot Streak',
    description: "Win 3 bets in a row - you're on fire!",
    difficulty: 'intermediate',
    reward: {
      type: 'nft',
      amount: 1,
      description: 'Fire Trophy NFT',
    },
    requirement: {
      type: 'win_streak',
      target: 3,
      description: 'Win 3 consecutive bets',
    },
    icon: '🔥',
    progress: 66,
    unlocked: false,
  },
  {
    id: 'community-member',
    title: 'Community Member',
    description: 'Engage with fellow bettors and build connections.',
    difficulty: 'intermediate',
    reward: {
      type: 'badge',
      amount: 1,
      description: 'Community Badge',
    },
    requirement: {
      type: 'community_engagement',
      target: 10,
      description: 'Interact 10 times with community',
    },
    icon: '👥',
    progress: 20,
    unlocked: false,
  },

  // Advanced (7-9)
  {
    id: 'high-roller',
    title: 'High Roller',
    description: "You're not afraid to bet big!",
    difficulty: 'advanced',
    reward: {
      type: 'tokens',
      amount: 1000,
      description: '1,000 CFZ Tokens',
    },
    requirement: {
      type: 'total_winnings',
      target: 5000,
      description: 'Win 5,000 CFZ tokens total',
    },
    icon: '💎',
    progress: 0,
    unlocked: false,
  },
  {
    id: 'betting-machine',
    title: 'Betting Machine',
    description: "You've mastered the art of consistent betting.",
    difficulty: 'advanced',
    reward: {
      type: 'nft',
      amount: 1,
      description: 'Golden Machine NFT',
    },
    requirement: {
      type: 'bets_placed',
      target: 100,
      description: 'Place 100 bets',
    },
    icon: '🤖',
    progress: 8,
    unlocked: false,
  },
  {
    id: 'influencer',
    title: 'Influencer',
    description: 'Bring friends to the platform and grow the community.',
    difficulty: 'advanced',
    reward: {
      type: 'tokens',
      amount: 2000,
      description: '2,000 CFZ Tokens',
    },
    requirement: {
      type: 'referrals',
      target: 10,
      description: 'Refer 10 new users',
    },
    icon: '📢',
    progress: 0,
    unlocked: false,
  },

  // Expert (10-11)
  {
    id: 'unstoppable',
    title: 'Unstoppable',
    description: 'Win 10 bets in a row - absolutely legendary!',
    difficulty: 'expert',
    reward: {
      type: 'nft',
      amount: 1,
      description: 'Legendary Crown NFT',
    },
    requirement: {
      type: 'win_streak',
      target: 10,
      description: 'Win 10 consecutive bets',
    },
    icon: '👑',
    progress: 0,
    unlocked: false,
  },
  {
    id: 'millionaire',
    title: 'Millionaire',
    description: "Accumulate massive winnings - you're a true champion!",
    difficulty: 'expert',
    reward: {
      type: 'tokens',
      amount: 10000,
      description: '10,000 CFZ Tokens',
    },
    requirement: {
      type: 'total_winnings',
      target: 100000,
      description: 'Win 100,000 CFZ tokens total',
    },
    icon: '💰',
    progress: 0,
    unlocked: false,
  },

  // Legendary (12)
  {
    id: 'hall-of-fame',
    title: 'Hall of Fame',
    description: "The ultimate achievement - you're a legend among legends!",
    difficulty: 'legendary',
    reward: {
      type: 'nft',
      amount: 1,
      description: 'Hall of Fame NFT',
    },
    requirement: {
      type: 'bets_placed',
      target: 1000,
      description: 'Place 1,000 bets',
    },
    icon: '🏆',
    progress: 0,
    unlocked: false,
  },
];

// Fonction utilitaire pour obtenir la couleur selon la difficulté
export function getDifficultyColor(
  difficulty: Achievement['difficulty'],
): string {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-500';
    case 'intermediate':
      return 'bg-blue-500';
    case 'advanced':
      return 'bg-purple-500';
    case 'expert':
      return 'bg-orange-500';
    case 'legendary':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}
