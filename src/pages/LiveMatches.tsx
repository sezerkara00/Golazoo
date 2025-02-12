import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MatchCard from '../components/MatchCard';

interface Match {
  id: string;
  homeTeam: {
    id: number;
    name: string;
    shortName: string;
  };
  awayTeam: {
    id: number;
    name: string;
    shortName: string;
  };
  tournament: {
    name: string;
    category: {
      name: string;
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
  homeScore: {
    current: number;
    display: number;
  };
  awayScore: {
    current: number;
    display: number;
  };
}

const LiveMatches: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteMatches, setFavoriteMatches] = useState<string[]>(() => {
    const saved = localStorage.getItem('favoriteMatches');
    return saved ? JSON.parse(saved) : [];
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchLiveMatches();
    // 5 saniyede bir güncelle (5000 milisaniye)
    const interval = setInterval(fetchLiveMatches, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchLiveMatches = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://www.sofascore.com/api/v1/sport/football/events/live');
      const data = await response.json();
      
      // Tüm olası canlı maç durumlarını kontrol et
      const liveMatches = data.events.filter((match: Match) => {
        const status = match.status.type?.toLowerCase();
        const description = match.status.description?.toLowerCase();

        return (
          status === 'inprogress' || 
          status === 'live' ||
          description?.includes('devre') ||
          description?.includes('yarı') ||
          /^\d+\'$/.test(description || '') || // Dakika gösterimi (örn: "45'")
          description?.includes('halftime') ||
          description?.includes('half time') ||
          status === 'playing'
        );
      }).sort((a: Match, b: Match) => 
        a.tournament.uniqueTournament?.id - b.tournament.uniqueTournament?.id
      );

      console.log('Filtrelenen maçlar:', liveMatches); // Debug için
      setMatches(liveMatches);
    } catch (error) {
      console.error('Canlı maçlar yüklenirken hata:', error);
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

  const handleMatchClick = (matchId: number) => {
    navigate(`/match/${matchId}`);
  };

  // Maçları liglere göre grupla - Null check ekleyelim
  const groupedMatches = matches.reduce((groups: {[key: string]: Match[]}, match) => {
    // Tournament veya category null ise kontrol et
    if (!match.tournament?.category?.name || !match.tournament?.uniqueTournament?.name) {
      const leagueName = 'Diğer Maçlar';
      if (!groups[leagueName]) {
        groups[leagueName] = [];
      }
      groups[leagueName].push(match);
      return groups;
    }

    const leagueName = `${match.tournament.category.name} - ${match.tournament.uniqueTournament.name}`;
    if (!groups[leagueName]) {
      groups[leagueName] = [];
    }
    groups[leagueName].push(match);
    return groups;
  }, {});

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-4">
            Canlı Maçlar
          </h1>
          <div className="text-sm text-gray-400">
            Her 5 saniyede bir güncelleniyor
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-8">Yükleniyor...</div>
        ) : matches.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            Şu anda canlı maç bulunmuyor
          </div>
        ) : (
          <div className="space-y-6">
            {/* Favori Maçlar */}
            {favoriteMatches.length > 0 && (
              <div className="bg-gradient-to-br from-gray-800/80 via-gray-800/50 to-gray-800/80 rounded-lg overflow-hidden border border-gray-700 shadow-xl">
                <div className="bg-gradient-to-r from-red-600/30 via-red-500/20 to-transparent px-4 py-3 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="text-yellow-500">★</span>
                      Favori Maçlar
                    </h2>
                    <span className="text-sm text-gray-400">
                      {matches.filter(match => favoriteMatches.includes(match.id)).length} maç
                    </span>
                  </div>
                </div>
                <div className="divide-y divide-gray-700">
                  {matches
                    .filter(match => favoriteMatches.includes(match.id))
                    .map(match => (
                      <div key={match.id} className="hover:bg-gray-700/30 transition-colors">
                        <MatchCard
                          match={match}
                          onClick={() => handleMatchClick(match.id)}
                          onToggleFavorite={toggleFavorite}
                          isFavorite={true}
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Ayırıcı - Favoriler varsa göster */}
            {favoriteMatches.length > 0 && (
              <div className="relative py-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-6 py-1 bg-gray-900 text-gray-400 text-sm font-medium rounded-full border border-gray-700">
                    DİĞER MAÇLAR
                  </span>
                </div>
              </div>
            )}

            {/* Tüm Ligler */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(groupedMatches).map(([leagueName, leagueMatches]) => (
                <div key={leagueName} className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700">
                  <div className="bg-gradient-to-r from-gray-700/50 to-transparent px-4 py-3">
                    <div>
                      {leagueName !== 'Diğer Maçlar' ? (
                        <>
                          <span className="text-sm text-gray-400">
                            {leagueName.split(' - ')[0]}
                          </span>
                          <h2 className="text-lg font-semibold text-white">
                            {leagueName.split(' - ')[1]}
                          </h2>
                        </>
                      ) : (
                        <h2 className="text-lg font-semibold text-white">
                          {leagueName}
                        </h2>
                      )}
                    </div>
                  </div>
                  <div className="divide-y divide-gray-700/50">
                    {leagueMatches.map(match => {
                      const isLive = match.status.type === 'inprogress' || 
                                     match.status.description === 'Devre Arası' ||
                                     match.status.description === 'İlk Yarı Sonucu';

                      return (
                        <MatchCard
                          key={match.id}
                          match={match}
                          onClick={() => handleMatchClick(match.id)}
                          onToggleFavorite={toggleFavorite}
                          isFavorite={favoriteMatches.includes(match.id)}
                          isLive={isLive}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveMatches; 