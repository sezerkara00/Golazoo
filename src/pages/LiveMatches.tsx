import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import TeamLogo from '../components/TeamLogo';

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
  };
  status: {
    description: string;
    type: string;
  };
}

const LiveMatches: React.FC = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [groupedMatches, setGroupedMatches] = useState<{ [key: string]: Match[] }>({});
  const [loading, setLoading] = useState(true);

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
      const tournamentName = match.tournament.name;
      if (!grouped[tournamentName]) {
        grouped[tournamentName] = [];
      }
      grouped[tournamentName].push(match);
    });
    setGroupedMatches(grouped);
  };

  const handleMatchClick = (match: Match) => {
    navigate(`/match/${match.id}`);
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
                    className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition cursor-pointer hover:bg-gray-50"
                    onClick={() => handleMatchClick(match)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <TeamLogo 
                          team={match.homeTeam.slug} 
                          className="w-8 h-8"
                          fallback={
                            <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center text-white text-sm">
                              {match.homeTeam.name.substring(0, 2).toUpperCase()}
                            </div>
                          }
                        />
                        <p className="font-semibold">{match.homeTeam.name}</p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold">{match.homeScore?.display ?? 0}</span>
                          <span className="text-xl font-bold">-</span>
                          <span className="text-xl font-bold">{match.awayScore?.display ?? 0}</span>
                        </div>
                        <span className="text-sm text-red-600 font-medium">
                          {match.status.description}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <p className="font-semibold">{match.awayTeam.name}</p>
                        <TeamLogo 
                          team={match.awayTeam.slug}
                          className="w-8 h-8"
                          fallback={
                            <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center text-white text-sm">
                              {match.awayTeam.name.substring(0, 2).toUpperCase()}
                            </div>
                          }
                        />
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