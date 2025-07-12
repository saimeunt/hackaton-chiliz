export interface NFTTrophy {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  acquiredAt: Date;
  image: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
  achievement_id?: string; // Linked to a specific achievement
}

export const nftTrophies: NFTTrophy[] = [
  {
    id: 'nft-001',
    name: 'First Victory Trophy',
    description:
      'Commemorates your very first betting victory on Clash of FanZ.',
    rarity: 'common',
    acquiredAt: new Date('2024-01-15T14:30:00'),
    image: '🏅',
    attributes: [
      { trait_type: 'Category', value: 'Victory' },
      { trait_type: 'Level', value: 'Beginner' },
      { trait_type: 'Color', value: 'Gold' },
    ],
    achievement_id: 'first-bet',
  },
  {
    id: 'nft-002',
    name: 'Welcome Badge',
    description: 'Earned for joining the Clash of FanZ community.',
    rarity: 'common',
    acquiredAt: new Date('2024-01-15T10:15:00'),
    image: '🎖️',
    attributes: [
      { trait_type: 'Category', value: 'Welcome' },
      { trait_type: 'Level', value: 'Starter' },
      { trait_type: 'Color', value: 'Silver' },
    ],
    achievement_id: 'first-steps',
  },
  {
    id: 'nft-003',
    name: 'Fire Streak Medal',
    description: 'Awarded for achieving a hot betting streak.',
    rarity: 'rare',
    acquiredAt: new Date('2024-01-20T16:45:00'),
    image: '🔥',
    attributes: [
      { trait_type: 'Category', value: 'Streak' },
      { trait_type: 'Level', value: 'Intermediate' },
      { trait_type: 'Color', value: 'Red' },
    ],
  },
  {
    id: 'nft-004',
    name: 'Diamond Champion Crown',
    description: 'Rare crown for exceptional betting performance.',
    rarity: 'epic',
    acquiredAt: new Date('2024-02-01T12:20:00'),
    image: '💎',
    attributes: [
      { trait_type: 'Category', value: 'Champion' },
      { trait_type: 'Level', value: 'Advanced' },
      { trait_type: 'Color', value: 'Diamond' },
    ],
  },
  {
    id: 'nft-005',
    name: 'Legendary Master Shield',
    description: 'The ultimate trophy for true betting masters.',
    rarity: 'legendary',
    acquiredAt: new Date('2024-02-14T09:30:00'),
    image: '🛡️',
    attributes: [
      { trait_type: 'Category', value: 'Master' },
      { trait_type: 'Level', value: 'Legendary' },
      { trait_type: 'Color', value: 'Platinum' },
    ],
  },
  {
    id: 'nft-006',
    name: 'Community Spirit Badge',
    description: 'Recognizes active participation in the community.',
    rarity: 'rare',
    acquiredAt: new Date('2024-02-05T18:00:00'),
    image: '🤝',
    attributes: [
      { trait_type: 'Category', value: 'Community' },
      { trait_type: 'Level', value: 'Social' },
      { trait_type: 'Color', value: 'Blue' },
    ],
  },
];

// Sort by acquisition date (most recent first)
export const sortedNFTTrophies = [...nftTrophies].sort(
  (a, b) => b.acquiredAt.getTime() - a.acquiredAt.getTime(),
);

// Utility function to get color based on rarity
export function getRarityColor(rarity: NFTTrophy['rarity']): string {
  switch (rarity) {
    case 'common':
      return 'bg-gray-500';
    case 'rare':
      return 'bg-blue-500';
    case 'epic':
      return 'bg-purple-500';
    case 'legendary':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-400';
  }
}

// Function to format acquisition date
export function formatAcquiredDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
