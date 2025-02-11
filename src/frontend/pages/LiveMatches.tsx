import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

interface Match {
  id: number;
  homeTeam: { 
    name: string;
    score?: number;
  };
  awayTeam: { 
    name: string;
    score?: number;
  };
  startTimestamp: number;
  tournament: {
    name: string;
  };
  status: {
    description: string;
    type: string;
  };
}

const LiveMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [groupedMatches, setGroupedMatches] = useState<{ [key: string]: Match[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveMatches = async () => {
      setLoading(true);
      try {
        const response = await api.get('https://www.sofascore.com/api/v1/sport/football/events/live');
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
    const interval = setInterval(fetchLiveMatches, 60000); // Her 1 dakikada bir güncelle

    return () => clearInterval(interval);
  }, []);

  const groupMatchesByTournament = (matches: Match[]) => {
    const grouped: { [key: string]: Match[] } = {};
    matches.forEach(match => {
      const tournamentName = match.tournament.name;
      if (!grouped[tournamentName]) {
        grouped[tournamentName] = [];
      }
      grouped[tournamentName].push(match);
    });
    setGroupedMatches(grouped);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Canlı Maçlar</h1>
      
      {loading ? (
        <div className="text-center">Yükleniyor...</div>
      ) : (
        <div className="grid gap-8">
          {Object.keys(groupedMatches).map(tournamentName => (
            <div key={tournamentName} className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">{tournamentName}</h2>
              <div className="grid gap-4">
                {groupedMatches[tournamentName].map((match) => (
                  <div 
                    key={match.id} 
                    className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="font-semibold">{match.homeTeam.name}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 px-4">
                        <span className="text-xl font-bold">
                          {match.homeTeam.score ?? 0}
                        </span>
                        <span className="text-sm text-red-600 font-medium">
                          {match.status.description}
                        </span>
                        <span className="text-xl font-bold">
                          {match.awayTeam.score ?? 0}
                        </span>
                      </div>
                      
                      <div className="flex-1 text-right">
                        <p className="font-semibold">{match.awayTeam.name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {matches.length === 0 && (
            <p className="text-center text-gray-500 text-lg">
              Şu anda canlı maç bulunmuyor.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default LiveMatches; 