export interface ChilizTeam {
  id: string;
  name: string;
  shortName: string;
  fanTokenSymbol: string;
  fanTokenAddress: string;
  sport: 'football' | 'basketball' | 'esports' | 'formula1' | 'mma';
  league: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  country: string;
}

export const chilizTeams: ChilizTeam[] = [
  // Football Teams
  {
    id: 'psg',
    name: 'Paris Saint-Germain',
    shortName: 'PSG',
    fanTokenSymbol: 'PSG',
    fanTokenAddress: '0xc2661815C69c2B3924D3dd0c2C1358A1E38A3105',
    sport: 'football',
    league: 'Ligue 1',
    logo: '/teams/psg.png',
    primaryColor: '#001E65',
    secondaryColor: '#FF0000',
    country: 'France',
  },
  {
    id: 'barcelona',
    name: 'FC Barcelona',
    shortName: 'Barça',
    fanTokenSymbol: 'BAR',
    fanTokenAddress: '0xFD3C73b3B09D418841dd6Aff341b2d6e3abA433b',
    sport: 'football',
    league: 'La Liga',
    logo: '/teams/barcelona.png',
    primaryColor: '#004B87',
    secondaryColor: '#A50044',
    country: 'Spain',
  },
  {
    id: 'juventus',
    name: 'Juventus',
    shortName: 'Juve',
    fanTokenSymbol: 'JUV',
    fanTokenAddress: '0x454038003a93cf44766aF352F74bad6B745616D0',
    sport: 'football',
    league: 'Serie A',
    logo: '/teams/juventus.png',
    primaryColor: '#000000',
    secondaryColor: '#FFFFFF',
    country: 'Italy',
  },
  {
    id: 'atletico',
    name: 'Atlético Madrid',
    shortName: 'Atleti',
    fanTokenSymbol: 'ATM',
    fanTokenAddress: '0xe9506F70be469d2369803Ccf41823713BAFe8154',
    sport: 'football',
    league: 'La Liga',
    logo: '/teams/atletico.png',
    primaryColor: '#CE2E2E',
    secondaryColor: '#1E3A8A',
    country: 'Spain',
  },
  {
    id: 'ac-milan',
    name: 'AC Milan',
    shortName: 'Milan',
    fanTokenSymbol: 'ACM',
    fanTokenAddress: '0xF9C0F80a6c67b1B39bdDF00ecD57f2533ef5b688',
    sport: 'football',
    league: 'Serie A',
    logo: '/teams/ac-milan.png',
    primaryColor: '#FB090B',
    secondaryColor: '#000000',
    country: 'Italy',
  },
  {
    id: 'arsenal',
    name: 'Arsenal FC',
    shortName: 'Arsenal',
    fanTokenSymbol: 'AFC',
    fanTokenAddress: '0x1d4343d35f0E0e14C14115876D01dEAa4792550b',
    sport: 'football',
    league: 'Premier League',
    logo: '/teams/arsenal.png',
    primaryColor: '#EF0107',
    secondaryColor: '#023474',
    country: 'England',
  },
  {
    id: 'manchester-city',
    name: 'Manchester City',
    shortName: 'City',
    fanTokenSymbol: 'CITY',
    fanTokenAddress: '0x6401b29F40a02578Ae44241560625232A01B3F79',
    sport: 'football',
    league: 'Premier League',
    logo: '/teams/man-city.png',
    primaryColor: '#6CABDD',
    secondaryColor: '#1C2C5B',
    country: 'England',
  },
  {
    id: 'napoli',
    name: 'Napoli FC',
    shortName: 'Napoli',
    fanTokenSymbol: 'NAP',
    fanTokenAddress: '0xbE7f1eBB1Fd6246844E093B04991ae0e66D12C77',
    sport: 'football',
    league: 'Serie A',
    logo: '/teams/napoli.png',
    primaryColor: '#0066CC',
    secondaryColor: '#FFFFFF',
    country: 'Italy',
  },
  {
    id: 'lazio',
    name: 'SS Lazio',
    shortName: 'Lazio',
    fanTokenSymbol: 'LAZIO',
    fanTokenAddress: '0x0000000000000000000000000000000000000000',
    sport: 'football',
    league: 'Serie A',
    logo: '/teams/lazio.png',
    primaryColor: '#87CEEB',
    secondaryColor: '#FFFFFF',
    country: 'Italy',
  },
  {
    id: 'galatasaray',
    name: 'Galatasaray S.K.',
    shortName: 'Gala',
    fanTokenSymbol: 'GAL',
    fanTokenAddress: '0x6DaB8Fe8e5d425F2Eb063aAe58540aA04e273E0d',
    sport: 'football',
    league: 'Süper Lig',
    logo: '/teams/galatasaray.png',
    primaryColor: '#FFD700',
    secondaryColor: '#FF0000',
    country: 'Turkey',
  },

  // Basketball Teams
  {
    id: 'la-lakers',
    name: 'Los Angeles Lakers',
    shortName: 'Lakers',
    fanTokenSymbol: 'LAL',
    fanTokenAddress: '0x0000000000000000000000000000000000000000',
    sport: 'basketball',
    league: 'NBA',
    logo: '/teams/lakers.png',
    primaryColor: '#552583',
    secondaryColor: '#FDB927',
    country: 'USA',
  },
  {
    id: 'boston-celtics',
    name: 'Boston Celtics',
    shortName: 'Celtics',
    fanTokenSymbol: 'CELT',
    fanTokenAddress: '0x0000000000000000000000000000000000000000',
    sport: 'basketball',
    league: 'NBA',
    logo: '/teams/celtics.png',
    primaryColor: '#007A33',
    secondaryColor: '#BA9653',
    country: 'USA',
  },

  // Esports Teams
  {
    id: 'og-esports',
    name: 'OG',
    shortName: 'OG',
    fanTokenSymbol: 'OG',
    fanTokenAddress: '0x19cA0F4aDb29e2130A56b9C9422150B5dc07f294',
    sport: 'esports',
    league: 'CS:GO / Dota 2',
    logo: '/teams/og.png',
    primaryColor: '#FF6B35',
    secondaryColor: '#000000',
    country: 'Europe',
  },
  {
    id: 'navi',
    name: 'Natus Vincere',
    shortName: 'NAVI',
    fanTokenSymbol: 'NAVI',
    fanTokenAddress: '0x0000000000000000000000000000000000000000',
    sport: 'esports',
    league: 'CS:GO / Valorant',
    logo: '/teams/navi.png',
    primaryColor: '#FFFF00',
    secondaryColor: '#000000',
    country: 'Ukraine',
  },

  // Formula 1 Teams
  {
    id: 'aston-martin',
    name: 'Aston Martin Cognizant',
    shortName: 'Aston Martin',
    fanTokenSymbol: 'AM',
    fanTokenAddress: '0x3757951792eDFC2CE196E4C06CFfD04027e87403',
    sport: 'formula1',
    league: 'Formula 1',
    logo: '/teams/aston-martin.png',
    primaryColor: '#00594C',
    secondaryColor: '#CEDC00',
    country: 'United Kingdom',
  },
  {
    id: 'alpine',
    name: 'BWT Alpine F1 Team',
    shortName: 'Alpine',
    fanTokenSymbol: 'ALPINE',
    fanTokenAddress: '0x0000000000000000000000000000000000000000',
    sport: 'formula1',
    league: 'Formula 1',
    logo: '/teams/alpine.png',
    primaryColor: '#0090FF',
    secondaryColor: '#FF1878',
    country: 'France',
  },

  // MMA / UFC
  {
    id: 'ufc',
    name: 'Ultimate Fighting Championship',
    shortName: 'UFC',
    fanTokenSymbol: 'UFC',
    fanTokenAddress: '0x0ffa63502f957b66e61F87761cc240e51C74cee5',
    sport: 'mma',
    league: 'UFC',
    logo: '/teams/ufc.png',
    primaryColor: '#D20A0A',
    secondaryColor: '#000000',
    country: 'USA',
  },
];

export function getTeamsByLeague(league: string): ChilizTeam[] {
  return chilizTeams.filter((team) => team.league === league);
}

export function getTeamsBySport(sport: string): ChilizTeam[] {
  return chilizTeams.filter((team) => team.sport === sport);
}

export function getTeamById(id: string): ChilizTeam | undefined {
  return chilizTeams.find((team) => team.id === id);
}

export function getTeamBySymbol(symbol: string): ChilizTeam | undefined {
  return chilizTeams.find((team) => team.fanTokenSymbol === symbol);
}

export function getAvailableLeagues(): string[] {
  return [...new Set(chilizTeams.map((team) => team.league))];
}

export function getAvailableSports(): string[] {
  return [...new Set(chilizTeams.map((team) => team.sport))];
}
