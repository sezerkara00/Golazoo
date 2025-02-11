export const getLeagueFolderName = (leagueName: string): string => {
  const leagueMap: { [key: string]: string } = {
    'Austria Bundesliga': 'Austria - Bundesliga',
    'Jupiler Pro League': 'Belgium - Jupiler Pro League',
    'efbet Liga': 'Bulgaria - efbet Liga',
    'SuperSport HNL': 'Croatia - SuperSport HNL',
    'Chance Liga': 'Czech Republic - Chance Liga',
    'Superliga': 'Denmark - Superliga',
    'Premier League': 'England - Premier League',
    'Ligue 1': 'France - Ligue 1',
    'Bundesliga': 'Germany - Bundesliga',
    'Super League 1': 'Greece - Super League 1',
    'Nemzeti Bajnokság': 'Hungary - Nemzeti Bajnokság',
    'Serie A': 'Italy - Serie A',
    'Eredivisie': 'Netherlands - Eredivisie',
    'Eliteserien': 'Norway - Eliteserien',
    'PKO BP Ekstraklasa': 'Poland - PKO BP Ekstraklasa',
    'Liga Portugal': 'Portugal - Liga Portugal',
    'SuperLiga': 'Romania - SuperLiga',
    'Russian Premier Liga': 'Russia - Premier Liga',
    'Scottish Premiership': 'Scotland - Scottish Premiership',
    'Super liga Srbije': 'Serbia - Super liga Srbije',
    'LaLiga': 'Spain - LaLiga',
    'Allsvenskan': 'Sweden - Allsvenskan',
    'Super League': 'Switzerland - Super League',
    'Super Lig': 'Türkiye - Süper Lig',
    'Ukrainian Premier Liga': 'Ukraine - Premier Liga'
  };

  // API'den gelen lig ismini kontrol et ve klasör adını döndür
  const folderName = leagueMap[leagueName];
  
  if (!folderName) {
    console.log('API Lig İsmi:', leagueName); // Debug için eklendi
    console.warn(`Lig klasör adı bulunamadı: ${leagueName}`);
    return leagueName;
  }

  return folderName;
};

// Debug için yardımcı fonksiyon
export const logLeagueName = (apiLeagueName: string) => {
  console.log('API Lig İsmi:', apiLeagueName);
  console.log('Klasör İsmi:', getLeagueFolderName(apiLeagueName));
}; 