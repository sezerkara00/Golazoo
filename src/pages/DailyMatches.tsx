import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TeamLogo from '../components/TeamLogo';
import DateSelector from '../components/DateSelector';
import MatchCard from '../components/MatchCard';

interface Match {
  id: string;
  homeTeam: {
    id: string;
    name: string;
    shortName: string;
  };
  awayTeam: {
    id: string;
    name: string;
    shortName: string;
  };
  tournament: {
    name: string;
    category: {
      name: string;
      flag?: string;
    };
    uniqueTournament: {
      name: string;
      id: number;
    };
  };
  status: {
    type: string;
    description: string;
  };
  startTimestamp: number;
  homeScore?: {
    current: number;
  };
  awayScore?: {
    current: number;
  };
}

// Favori ligler
const FAVORITE_LEAGUES = [
  'Turkey - Trendyol Süper Lig',
  'England - Premier League',
  'Europe - UEFA Champions League'
];

// Öncelikli ligler - Türkiye en başta
const PRIORITY_LEAGUES = [
  'Turkey - Süper Lig',
  'Europe - UEFA Champions League',
  'Europe - UEFA Europa League',
  'Europe - UEFA Europa Conference League',
  'England - Premier League',
  'Italy - Serie A',
  'Spain - LaLiga',
  'Germany - Bundesliga',
  'France - Ligue 1',
  'Netherlands - Eredivisie',
  'Portugal - Primeira Liga',
  'Belgium - Pro League'
];

// Lig kategorileri ve öncelikleri
const LEAGUE_CATEGORIES = {
  TURKISH: 'Turkey',
  EUROPEAN: 'Europe',
  TOP5: ['England', 'Spain', 'Italy', 'Germany', 'France'],
  OTHER: 'Other'
};

// Lig öncelik sıralaması
const getLeaguePriority = (leagueName: string): number => {
  // Türkiye Ligleri
  if (leagueName.includes('Turkey')) {
    if (leagueName.includes('Süper Lig')) return 1;
    if (leagueName.includes('1. Lig')) return 2;
    return 3;
  }

  // Avrupa Kupaları
  if (leagueName.includes('Champions League')) return 10;
  if (leagueName.includes('Europa League')) return 11;
  if (leagueName.includes('Conference League')) return 12;

  // Top 5 Ligler
  if (leagueName.includes('Premier League')) return 20;
  if (leagueName.includes('LaLiga')) return 21;
  if (leagueName.includes('Serie A')) return 22;
  if (leagueName.includes('Bundesliga')) return 23;
  if (leagueName.includes('Ligue 1')) return 24;

  // Diğer önemli ligler
  if (leagueName.includes('Eredivisie')) return 30;
  if (leagueName.includes('Primeira Liga')) return 31;
  if (leagueName.includes('Pro League')) return 32;

  // Diğer tüm ligler
  return 100;
};

const groupAndSortMatches = (matches: Match[]) => {
  // Maçları liglere göre grupla
  const groups = matches.reduce((groups: {[key: string]: Match[]}, match) => {
    const country = match.tournament.category?.name || '';
    const league = match.tournament.uniqueTournament?.name || match.tournament.name;
    const fullKey = `${country} - ${league}`;

    if (!groups[fullKey]) {
      groups[fullKey] = [];
    }
    groups[fullKey].push(match);
    return groups;
  }, {});

  // Favori ligleri ve diğer ligleri ayır
  const favoriteLeagues = Object.entries(groups)
    .filter(([key]) => FAVORITE_LEAGUES.some(league => 
      key.toLowerCase().includes(league.toLowerCase().replace('trendyol ', ''))
    ));

  const otherLeagues = Object.entries(groups)
    .filter(([key]) => !FAVORITE_LEAGUES.some(league => 
      key.toLowerCase().includes(league.toLowerCase().replace('trendyol ', ''))
    ));

  // Diğer ligleri sırala
  const sortedOtherLeagues = otherLeagues.sort((a, b) => {
    const [keyA] = a;
    const [keyB] = b;

    // Avrupa kupaları kontrolü
    const isChampionsA = keyA.includes('Champions League');
    const isChampionsB = keyB.includes('Champions League');
    const isEuropaA = keyA.includes('Europa League');
    const isEuropaB = keyB.includes('Europa League');
    const isConferenceA = keyA.includes('Conference League');
    const isConferenceB = keyB.includes('Conference League');

    // Şampiyonlar Ligi en üstte
    if (isChampionsA && !isChampionsB) return -1;
    if (!isChampionsA && isChampionsB) return 1;

    // Avrupa Ligi ikinci sırada
    if (isEuropaA && !isEuropaB) return -1;
    if (!isEuropaA && isEuropaB) return 1;

    // Konferans Ligi üçüncü sırada
    if (isConferenceA && !isConferenceB) return -1;
    if (!isConferenceB && isConferenceA) return 1;

    // Diğer ligler için API sıralaması
    const tournamentIdA = a[1][0]?.tournament?.uniqueTournament?.id || 0;
    const tournamentIdB = b[1][0]?.tournament?.uniqueTournament?.id || 0;
    return tournamentIdA - tournamentIdB;
  });

  // Favori ligleri ve diğer ligleri birleştir
  return [...favoriteLeagues, ...sortedOtherLeagues];
};

const DailyMatches: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [favoriteMatches, setFavoriteMatches] = useState<string[]>(() => {
    const saved = localStorage.getItem('favoriteMatches');
    return saved ? JSON.parse(saved) : [];
  });

  // Başlangıçta tüm ligler açık gelsin
  const [expandedLeagues, setExpandedLeagues] = useState<string[]>(() => {
    // Tüm lig isimlerini içeren bir dizi oluştur
    const allLeagues = [
      ...PRIORITY_LEAGUES,
      // Diğer tüm ligler de açık gelsin
      'all'  // 'all' değeri tüm liglerin açık olduğunu gösterir
    ];
    return allLeagues;
  });
  const sortedLeagues = groupAndSortMatches(matches);

  // Favori ligler localStorage'dan yüklensin
  const [favoriteLeagues, setFavoriteLeagues] = useState<string[]>(() => {
    const saved = localStorage.getItem('favoriteLeagues');
    return saved ? JSON.parse(saved) : [
      'Turkey - Trendyol Süper Lig',
      'England - Premier League',
      'Europe - UEFA Champions League'
    ];
  });

  const navigate = useNavigate();

  const [collapsedLeagues, setCollapsedLeagues] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    fetchMatches();
  }, [selectedDate]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const response = await fetch(`https://www.sofascore.com/api/v1/sport/football/scheduled-events/${formattedDate}`);
      const data = await response.json();
      
      // Seçili tarihe ait maçları filtrele
      const matchesForDate = data.events.filter((match: Match) => {
        const matchDate = new Date(match.startTimestamp * 1000).toISOString().split('T')[0];
        return matchDate === formattedDate;
      });

      // Maçları saate göre sırala
      const sortedMatches = matchesForDate.sort((a: Match, b: Match) => 
        a.startTimestamp - b.startTimestamp
      );

      setMatches(sortedMatches);
    } catch (error) {
      console.error('Maçlar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (matchId: string) => {
    setFavoriteMatches(prev => {
      const newFavorites = prev.includes(matchId)
        ? prev.filter(id => id !== matchId)
        : [...prev, matchId];
      
      localStorage.setItem('favoriteMatches', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const toggleLeagueExpand = (leagueName: string) => {
    setExpandedLeagues(prev => 
      prev.includes(leagueName) 
        ? prev.filter(name => name !== leagueName)
        : [...prev, leagueName]
    );
  };

  // Bir ligin açık olup olmadığını kontrol et
  const isLeagueExpanded = (leagueName: string) => {
    return expandedLeagues.includes('all') || expandedLeagues.includes(leagueName);
  };

  // Lig favorilere ekleme/çıkarma fonksiyonu
  const toggleFavoriteLeague = (leagueName: string) => {
    setFavoriteLeagues(prev => {
      const newFavorites = prev.includes(leagueName)
        ? prev.filter(name => name !== leagueName)
        : [...prev, leagueName];
      
      localStorage.setItem('favoriteLeagues', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const handleMatchClick = (matchId: number) => {
    navigate(`/match/${matchId}`);
  };

  const toggleLeague = (leagueName: string) => {
    setCollapsedLeagues(prev => ({
      ...prev,
      [leagueName]: !prev[leagueName]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-4">
            Günlük Maçlar
          </h1>
          <DateSelector 
            selectedDate={selectedDate}
            onChange={setSelectedDate}
          />
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-8">Yükleniyor...</div>
        ) : (
          <div>
            {/* Favoriler Bölümü */}
            <div className="space-y-6 mb-8">
              {/* Favori Maçlar */}
              {favoriteMatches.length > 0 && (
                <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700">
                  <div className="bg-gradient-to-r from-red-600/20 to-transparent px-4 py-2">
                    <h2 className="text-lg font-semibold text-white">Favori Maçlar</h2>
                  </div>
                  <div className="divide-y divide-gray-700">
                    {matches
                      .filter(match => favoriteMatches.includes(match.id))
                      .map(match => (
                        <MatchCard
                          key={match.id}
                          match={match}
                          onClick={() => handleMatchClick(match.id)}
                          onToggleFavorite={toggleFavorite}
                          isFavorite={true}
                        />
                      ))}
                  </div>
                </div>
              )}

              {/* Favori Ligler */}
              {favoriteLeagues.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favoriteLeagues.map(leagueName => {
                    const leagueMatches = matches.filter(match => {
                      const fullLeagueName = `${match.tournament.category.name} - ${match.tournament.uniqueTournament.name}`;
                      return fullLeagueName.toLowerCase().includes(leagueName.toLowerCase().replace('trendyol ', ''));
                    });

                    if (leagueMatches.length === 0) return null;

                    return (
                      <div key={leagueName} className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700">
                        <div className="bg-gradient-to-r from-yellow-600/20 to-transparent px-4 py-2 flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-white">{leagueName}</h3>
                          <button
                            onClick={() => toggleFavoriteLeague(leagueName)}
                            className="text-yellow-400 hover:text-yellow-500 transition-colors"
                          >
                            ★
                          </button>
                        </div>
                        <div className="divide-y divide-gray-700">
                          {leagueMatches.map(match => (
                            <MatchCard
                              key={match.id}
                              match={match}
                              onClick={() => handleMatchClick(match.id)}
                              onToggleFavorite={toggleFavorite}
                              isFavorite={favoriteMatches.includes(match.id)}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Ayırıcı - Favoriler varsa göster */}
            {(favoriteMatches.length > 0 || favoriteLeagues.length > 0) && (
              <div className="relative py-4 mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-gray-900 text-gray-500 text-sm">DİĞER LİGLER</span>
                </div>
              </div>
            )}

            {/* Tüm Ligler */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedLeagues
                .filter(([leagueName]) => !favoriteLeagues.includes(leagueName))
                .map(([leagueName, leagueMatches]) => (
                  <div key={leagueName} className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700">
                    <div 
                      className="bg-gradient-to-r from-gray-700/50 to-transparent px-4 py-3 flex items-center justify-between"
                    >
                      <div>
                        <span className="text-sm text-gray-400">
                          {leagueName.split(' - ')[0]}
                        </span>
                        <h2 className="text-lg font-semibold text-white">
                          {leagueName.split(' - ')[1]}
                        </h2>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleFavoriteLeague(leagueName)}
                          className="text-gray-400 hover:text-yellow-400 transition-colors"
                        >
                          {favoriteLeagues.includes(leagueName) ? '★' : '☆'}
                        </button>
                        <button
                          onClick={() => toggleLeague(leagueName)}
                          className="p-1 hover:bg-gray-700 rounded-full transition-colors"
                        >
                          <span className={`text-gray-400 transform transition-transform duration-200 block ${
                            collapsedLeagues[leagueName] ? 'rotate-180' : ''
                          }`}>
                            ▼
                          </span>
                        </button>
                      </div>
                    </div>
                    {/* Maç Listesi */}
                    {!collapsedLeagues[leagueName] && (
                      <div className="divide-y divide-gray-700/50">
                        {leagueMatches.map(match => (
                          <MatchCard
                            key={match.id}
                            match={match}
                            onClick={() => handleMatchClick(match.id)}
                            onToggleFavorite={toggleFavorite}
                            isFavorite={favoriteMatches.includes(match.id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyMatches; 