import React, { useState, useEffect } from 'react';
import MatchCard from '../components/MatchCard';

interface Match {
  id: number;
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

const LiveScores: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteMatches, setFavoriteMatches] = useState<number[]>(() => {
    const saved = localStorage.getItem('favoriteMatches');
    return saved ? JSON.parse(saved) : [];
  });
  const [favoriteLeagues, setFavoriteLeagues] = useState<string[]>(() => {
    const saved = localStorage.getItem('favoriteLeagues');
    return saved ? JSON.parse(saved) : [
      'Turkey - Trendyol Süper Lig',
      'England - Premier League',
      'Europe - UEFA Champions League'
    ];
  });

  useEffect(() => {
    fetchLiveMatches();
    // Her 30 saniyede bir güncelle
    const interval = setInterval(fetchLiveMatches, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchLiveMatches = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://www.sofascore.com/api/v1/sport/football/live-events');
      const data = await response.json();
      
      // Canlı maçları sırala (önce başlayanlar)
      const sortedMatches = data.events.sort((a: Match, b: Match) => 
        a.startTimestamp - b.startTimestamp
      );

      setMatches(sortedMatches);
    } catch (error) {
      console.error('Canlı maçlar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (matchId: number) => {
    setFavoriteMatches(prev => {
      const newFavorites = prev.includes(matchId)
        ? prev.filter(id => id !== matchId)
        : [...prev, matchId];
      
      localStorage.setItem('favoriteMatches', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const toggleFavoriteLeague = (leagueName: string) => {
    setFavoriteLeagues(prev => {
      const newFavorites = prev.includes(leagueName)
        ? prev.filter(name => name !== leagueName)
        : [...prev, leagueName];
      
      localStorage.setItem('favoriteLeagues', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  // Maçları liglere göre grupla
  const groupedMatches = matches.reduce((groups: {[key: string]: Match[]}, match) => {
    const league = `${match.tournament.category.name} - ${match.tournament.uniqueTournament.name}`;
    if (!groups[league]) {
      groups[league] = [];
    }
    groups[league].push(match);
    return groups;
  }, {});

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-4">
            Canlı Skorlar
          </h1>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-8">Yükleniyor...</div>
        ) : (
          <div className="space-y-6">
            {/* Favori Maçlar */}
            {favoriteMatches.length > 0 && (
              <div className="bg-gray-800/50 rounded-lg overflow-hidden">
                <div className="bg-gray-800 px-4 py-2">
                  <h2 className="text-lg font-semibold text-white">Favori Maçlar</h2>
                </div>
                <div className="divide-y divide-gray-700">
                  {matches
                    .filter(match => favoriteMatches.includes(match.id))
                    .map(match => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        onClick={() => {}}
                        onToggleFavorite={toggleFavorite}
                        isFavorite={true}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* Favori Ligler */}
            <div className="bg-gray-800/50 rounded-lg overflow-hidden">
              <div className="bg-gray-700 px-4 py-2">
                <h2 className="text-lg font-semibold text-white">Favori Ligler</h2>
              </div>
              <div className="divide-y divide-gray-700">
                {favoriteLeagues.map(leagueName => {
                  const leagueMatches = matches.filter(match => {
                    const fullLeagueName = `${match.tournament.category.name} - ${match.tournament.uniqueTournament.name}`;
                    return fullLeagueName.toLowerCase().includes(leagueName.toLowerCase().replace('trendyol ', ''));
                  });

                  if (leagueMatches.length === 0) return null;

                  return (
                    <div key={leagueName} className="bg-gray-800/50">
                      <div className="px-4 py-2 flex items-center justify-between">
                        <h3 className="text-md font-semibold text-white">{leagueName}</h3>
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
                            onClick={() => {}}
                            onToggleFavorite={toggleFavorite}
                            isFavorite={favoriteMatches.includes(match.id)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tüm Canlı Maçlar */}
            {Object.entries(groupedMatches).map(([leagueName, leagueMatches]) => (
              <div key={leagueName} className="bg-gray-800/50 rounded-lg overflow-hidden">
                <div className="bg-gray-800 px-4 py-2">
                  <div>
                    <span className="text-sm text-gray-400">
                      {leagueName.split(' - ')[0]}
                    </span>
                    <h2 className="text-lg font-semibold text-white">
                      {leagueName.split(' - ')[1]}
                    </h2>
                  </div>
                </div>
                <div className="divide-y divide-gray-700">
                  {leagueMatches.map(match => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onClick={() => {}}
                      onToggleFavorite={toggleFavorite}
                      isFavorite={favoriteMatches.includes(match.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveScores; 