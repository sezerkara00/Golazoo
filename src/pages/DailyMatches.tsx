import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";
import MatchDetails from './MatchDetails';
import TeamLogo from '../components/TeamLogo';
import MatchCard from '../components/MatchCard';

interface Match {
  id: number;
  homeTeam: { 
    name: string;
    slug: string;
  };
  awayTeam: { 
    name: string;
    slug: string;
  };
  homeScore: {
    current: number;
    display: number;
    period1: number;
    period2: number;
    normaltime: number;
  };
  awayScore: {
    current: number;
    display: number;
    period1: number;
    period2: number;
    normaltime: number;
  };
  startTimestamp: number;
  tournament: {
    name: string;
    category: {
      name: string;
    };
  };
  status: {
    type: string;
    description: string;
  };
}

const DEFAULT_PINNED_LEAGUES = [
  'Europe - UEFA Champions League',
  'Europe - UEFA Europa League',
  'England - Premier League',
  'Spain - La Liga',
  'Germany - Bundesliga',
  'Italy - Serie A',
  'France - Ligue 1',
  'Turkey - Süper Lig'
];

const DailyMatches = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [groupedMatches, setGroupedMatches] = useState<{ [key: string]: Match[] }>({});
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [pinnedLeagues, setPinnedLeagues] = useState<string[]>(() => {
    const saved = localStorage.getItem('pinnedLeagues');
    return saved ? JSON.parse(saved) : DEFAULT_PINNED_LEAGUES;
  });
  const [favoriteMatches, setFavoriteMatches] = useState<number[]>(() => {
    const saved = localStorage.getItem('favoriteMatches');
    return saved ? JSON.parse(saved) : [];
  });

  const isMatchFinished = (match: Match) => match.status.type === 'finished';
  const isMatchLive = (match: Match) => match.status.type === 'inprogress' || match.status.type === 'halftime';

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        const response = await api.get(`/sport/football/scheduled-events/${formattedDate}`);
        setMatches(response.data.events);
        groupMatchesByTournament(response.data.events);
      } catch (error) {
        console.error('Maçlar yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [selectedDate]);

  const groupMatchesByTournament = (matches: Match[]) => {
    const grouped: { [key: string]: Match[] } = {};
    matches.forEach(match => {
      const categoryName = match.tournament.category?.name || '';
      const tournamentName = match.tournament.name;
      const fullName = categoryName ? `${categoryName} - ${tournamentName}` : tournamentName;
      
      if (!grouped[fullName]) {
        grouped[fullName] = [];
      }
      grouped[fullName].push(match);
    });

    // API'den gelen sıralamayı koru
    setGroupedMatches(grouped);
  };

  const getMatchStatus = (match: Match) => {
    switch (match.status.type) {
      case 'inprogress':
      case 'halftime':
        return (
          <span className="text-red-600 font-medium text-sm">
            {match.status.description}
          </span>
        );
      case 'finished':
        return (
          <span className="text-gray-600 text-sm">
            Tamamlandı
          </span>
        );
      default:
        return (
          <span className="text-gray-500 text-sm">
            {new Date(match.startTimestamp * 1000).toLocaleTimeString('tr-TR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        );
    }
  };

  const getMatchScore = (match: Match) => {
    const scoreClasses = `font-bold ${
      isMatchLive(match) ? 'text-red-500 text-2xl' : 'text-white text-xl'
    }`;

    if (match.status.type === 'notstarted') {
      return <div className="text-gray-400 text-lg">vs</div>;
    }

    return (
      <div className={`flex items-center gap-2 ${scoreClasses}`}>
        <span>{match.homeScore?.display ?? 0}</span>
        <span>-</span>
        <span>{match.awayScore?.display ?? 0}</span>
      </div>
    );
  };

  const handleMatchClick = (match: Match) => {
    navigate(`/match/${match.id}`);
  };

  // Lig sabitleme/sabitleme kaldırma fonksiyonu
  const togglePin = (leagueName: string) => {
    setPinnedLeagues(prev => {
      const newPinned = prev.includes(leagueName)
        ? prev.filter(name => name !== leagueName)
        : [...prev, leagueName];
      
      // Local storage'a kaydet
      localStorage.setItem('pinnedLeagues', JSON.stringify(newPinned));
      return newPinned;
    });
  };

  const toggleFavoriteMatch = (matchId: number) => {
    setFavoriteMatches(prev => {
      const newFavorites = prev.includes(matchId)
        ? prev.filter(id => id !== matchId)
        : [...prev, matchId];
      
      localStorage.setItem('favoriteMatches', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  // Ligleri grupla (sabitler ve diğerleri)
  const { pinnedMatches, otherMatches } = Object.entries(groupedMatches).reduce(
    (acc, [fullName, matches]) => {
      // Eğer lig sabitlenmişse pinnedMatches'e ekle
      if (pinnedLeagues.includes(fullName)) {
        acc.pinnedMatches[fullName] = matches;
      }
      
      // Tüm ligleri otherMatches'e ekle
      acc.otherMatches[fullName] = matches;
      
      return acc;
    },
    { 
      pinnedMatches: {} as { [key: string]: Match[] }, 
      otherMatches: {} as { [key: string]: Match[] } 
    }
  );

  // Favori maçları en üste getir
  const sortMatchesByFavorite = (matches: Match[]) => {
    return [...matches].sort((a, b) => {
      const aFav = favoriteMatches.includes(a.id) ? -1 : 1;
      const bFav = favoriteMatches.includes(b.id) ? -1 : 1;
      return aFav - bFav;
    });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto p-4">
        {/* Başlık ve Tarih Seçici */}
        <div className="flex items-center gap-4 mb-8 bg-gray-800 p-4 rounded-lg">
          <h1 className="text-2xl font-bold text-white">Günlük Maçlar</h1>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => date && setSelectedDate(date)}
            dateFormat="dd/MM/yyyy"
            className="bg-gray-700 border border-gray-600 p-2 rounded text-white"
          />
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-8">Yükleniyor...</div>
        ) : (
          <>
            {/* Favori Maçlar */}
            {favoriteMatches.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold mb-4 text-white bg-gray-800 p-3 rounded-lg">
                  Favori Maçlar
                </h2>
                <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700">
                  <div className="divide-y divide-gray-700/50">
                    {matches
                      .filter(match => favoriteMatches.includes(match.id))
                      .map((match) => (
                        <MatchCard
                          key={match.id}
                          match={match}
                          onClick={() => handleMatchClick(match)}
                          onToggleFavorite={toggleFavoriteMatch}
                          isFavorite={true}
                        />
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Öne Çıkan Ligler */}
            {Object.keys(pinnedMatches).length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold mb-4 text-white bg-gray-800 p-3 rounded-lg">
                  Öne Çıkan Ligler
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {Object.entries(pinnedMatches).map(([fullName, matches]) => {
                    const [category, tournament] = fullName.split(' - ');
                    const sortedMatches = sortMatchesByFavorite(matches);
                    
                    return (
                      <div key={fullName} id={tournament} className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700">
                        <div className="p-4 bg-gray-800 flex justify-between items-center border-b border-gray-700">
                          <div>
                            <span className="text-sm text-gray-400">{category}</span>
                            <h2 className="text-lg font-semibold text-white">{tournament}</h2>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePin(fullName);
                            }}
                            className="text-gray-400 hover:text-white transition"
                          >
                            <span title="Sabitlemeyi Kaldır">📌</span>
                          </button>
                        </div>
                        <div className="divide-y divide-gray-700/50">
                          {sortedMatches.map((match) => (
                            <MatchCard
                              key={match.id}
                              match={match}
                              onClick={() => handleMatchClick(match)}
                              onToggleFavorite={toggleFavoriteMatch}
                              isFavorite={favoriteMatches.includes(match.id)}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Diğer Ligler */}
            {Object.keys(otherMatches).length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-white bg-gray-800 p-3 rounded-lg">
                  Diğer Ligler
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {Object.entries(otherMatches).map(([fullName, matches]) => {
                    const [category, tournament] = fullName.split(' - ');
                    const sortedMatches = sortMatchesByFavorite(matches);
                    
                    return (
                      <div key={fullName} id={tournament} className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700">
                        <div className="p-4 bg-gray-800 flex justify-between items-center border-b border-gray-700">
                          <div>
                            <span className="text-sm text-gray-400">{category}</span>
                            <h2 className="text-lg font-semibold text-white">{tournament}</h2>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePin(fullName);
                            }}
                            className="text-gray-400 hover:text-white transition"
                          >
                            <span title="Sabitle">📍</span>
                          </button>
                        </div>
                        <div className="divide-y divide-gray-700/50">
                          {sortedMatches.map((match) => (
                            <MatchCard
                              key={match.id}
                              match={match}
                              onClick={() => handleMatchClick(match)}
                              onToggleFavorite={toggleFavoriteMatch}
                              isFavorite={favoriteMatches.includes(match.id)}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DailyMatches; 