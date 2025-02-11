import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
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

const LiveMatches: React.FC = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [groupedMatches, setGroupedMatches] = useState<{ [key: string]: Match[] }>({});
  const [loading, setLoading] = useState(true);
  const [favoriteMatches, setFavoriteMatches] = useState<number[]>(() => {
    const saved = localStorage.getItem('favoriteMatches');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const fetchLiveMatches = async () => {
      setLoading(true);
      try {
        const response = await api.get('/sport/football/events/live');
        const liveMatches = response.data.events.filter((match: Match) => 
          match.status.type === 'inprogress' || 
          match.status.type === 'halftime'
        );
        setMatches(liveMatches);
        groupMatchesByTournament(liveMatches);
      } catch (error) {
        console.error('Canlı maçlar yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveMatches();
    const interval = setInterval(fetchLiveMatches, 60000);
    return () => clearInterval(interval);
  }, []);

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
    setGroupedMatches(grouped);
  };

  const handleMatchClick = (match: Match) => {
    navigate(`/match/${match.id}`);
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

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 text-white bg-gray-800 p-4 rounded-lg">
          Canlı Maçlar
        </h1>
        
        {loading ? (
          <div className="text-center text-gray-400 py-8">Yükleniyor...</div>
        ) : (
          <div className="grid gap-8">
            {Object.entries(groupedMatches).map(([fullName, matches]) => {
              const [category, tournament] = fullName.split(' - ');
              
              return (
                <div key={fullName} className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700">
                  <div className="p-4 bg-gray-800 border-b border-gray-700">
                    <span className="text-sm text-gray-400">{category}</span>
                    <h2 className="text-lg font-semibold text-white">{tournament}</h2>
                  </div>
                  <div className="divide-y divide-gray-700/50">
                    {matches.map((match) => (
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
            
            {matches.length === 0 && (
              <div className="text-center text-gray-400 text-lg bg-gray-800/50 p-8 rounded-lg border border-gray-700">
                Şu anda canlı maç bulunmuyor.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveMatches; 