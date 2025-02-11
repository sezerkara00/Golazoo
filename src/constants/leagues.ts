export const LEAGUES = {
  'Austria - Bundesliga': {
    name: 'Austria Bundesliga',
    logo: '/assets/logos/Austria - Bundesliga/logo.png',
    folderName: 'Austria - Bundesliga'
  },
  'Belgium - Jupiler Pro League': {
    name: 'Jupiler Pro League',
    logo: '/assets/logos/Belgium - Jupiler Pro League/logo.png',
    folderName: 'Belgium - Jupiler Pro League'
  },
  'Bulgaria - efbet Liga': {
    name: 'efbet Liga',
    logo: '/assets/logos/Bulgaria - efbet Liga/logo.png',
    folderName: 'Bulgaria - efbet Liga'
  },
  'Croatia - SuperSport HNL': {
    name: 'SuperSport HNL',
    logo: '/assets/logos/Croatia - SuperSport HNL/logo.png',
    folderName: 'Croatia - SuperSport HNL'
  },
  'Czech Republic - Chance Liga': {
    name: 'Chance Liga',
    logo: '/assets/logos/Czech Republic - Chance Liga/logo.png',
    folderName: 'Czech Republic - Chance Liga'
  },
  'Denmark - Superliga': {
    name: 'Superliga',
    logo: '/assets/logos/Denmark - Superliga/logo.png',
    folderName: 'Denmark - Superliga'
  },
  'England - Premier League': {
    name: 'Premier League',
    logo: '/assets/logos/England - Premier League/logo.png',
    folderName: 'England - Premier League'
  },
  'France - Ligue 1': {
    name: 'Ligue 1',
    logo: '/assets/logos/France - Ligue 1/logo.png',
    folderName: 'France - Ligue 1'
  },
  'Germany - Bundesliga': {
    name: 'Bundesliga',
    logo: '/assets/logos/Germany - Bundesliga/logo.png',
    folderName: 'Germany - Bundesliga'
  },
  'Greece - Super League 1': {
    name: 'Super League 1',
    logo: '/assets/logos/Greece - Super League 1/logo.png',
    folderName: 'Greece - Super League 1'
  },
  'Hungary - Nemzeti Bajnokság': {
    name: 'Nemzeti Bajnokság',
    logo: '/assets/logos/Hungary - Nemzeti Bajnokság/logo.png',
    folderName: 'Hungary - Nemzeti Bajnokság'
  },
  'Italy - Serie A': {
    name: 'Serie A',
    logo: '/assets/logos/Italy - Serie A/logo.png',
    folderName: 'Italy - Serie A'
  },
  'Netherlands - Eredivisie': {
    name: 'Eredivisie',
    logo: '/assets/logos/Netherlands - Eredivisie/logo.png',
    folderName: 'Netherlands - Eredivisie'
  },
  'Norway - Eliteserien': {
    name: 'Eliteserien',
    logo: '/assets/logos/Norway - Eliteserien/logo.png',
    folderName: 'Norway - Eliteserien'
  },
  'Poland - PKO BP Ekstraklasa': {
    name: 'PKO BP Ekstraklasa',
    logo: '/assets/logos/Poland - PKO BP Ekstraklasa/logo.png',
    folderName: 'Poland - PKO BP Ekstraklasa'
  },
  'Portugal - Liga Portugal': {
    name: 'Liga Portugal',
    logo: '/assets/logos/Portugal - Liga Portugal/logo.png',
    folderName: 'Portugal - Liga Portugal'
  },
  'Romania - SuperLiga': {
    name: 'SuperLiga',
    logo: '/assets/logos/Romania - SuperLiga/logo.png',
    folderName: 'Romania - SuperLiga'
  },
  'Russia - Premier Liga': {
    name: 'Premier Liga',
    logo: '/assets/logos/Russia - Premier Liga/logo.png',
    folderName: 'Russia - Premier Liga'
  },
  'Scotland - Scottish Premiership': {
    name: 'Scottish Premiership',
    logo: '/assets/logos/Scotland - Scottish Premiership/logo.png',
    folderName: 'Scotland - Scottish Premiership'
  },
  'Serbia - Super liga Srbije': {
    name: 'Super liga Srbije',
    logo: '/assets/logos/Serbia - Super liga Srbije/logo.png',
    folderName: 'Serbia - Super liga Srbije'
  },
  'Spain - LaLiga': {
    name: 'LaLiga',
    logo: '/assets/logos/Spain - LaLiga/logo.png',
    folderName: 'Spain - LaLiga'
  },
  'Sweden - Allsvenskan': {
    name: 'Allsvenskan',
    logo: '/assets/logos/Sweden - Allsvenskan/logo.png',
    folderName: 'Sweden - Allsvenskan'
  },
  'Switzerland - Super League': {
    name: 'Super League',
    logo: '/assets/logos/Switzerland - Super League/logo.png',
    folderName: 'Switzerland - Super League'
  },
  'Türkiye - Süper Lig': {
    name: 'Süper Lig',
    logo: '/assets/logos/Türkiye - Süper Lig/logo.png',
    folderName: 'Türkiye - Süper Lig'
  },
  'Ukraine - Premier Liga': {
    name: 'Premier Liga',
    logo: '/assets/logos/Ukraine - Premier Liga/logo.png',
    folderName: 'Ukraine - Premier Liga'
  }
} as const;

export type LeagueKey = keyof typeof LEAGUES; 