import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface Match {
  id: number;
  homeTeam: { name: string; };
  awayTeam: { name: string; };
  startTimestamp: number;
  tournament: {
    name: string;
  };
  status: {
    type: string;
    description: string;
  };
}

const DailyMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [groupedMatches, setGroupedMatches] = useState<{ [key: string]: Match[] }>({});
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [showOnlyLive, setShowOnlyLive] = useState(false);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        const response = await api.get(`/sport/football/scheduled-events/${formattedDate}`);
        const allMatches = response.data.events;
        
        // Canlı maç filtresi
        const filteredMatches = showOnlyLive 
          ? allMatches.filter((match: Match) => 
              match.status.type === 'inprogress' || 
              match.status.type === 'halftime'
            )
          : allMatches;

        setMatches(filteredMatches);
        groupMatchesByTournament(filteredMatches);
      } catch (error) {
        console.error('Maçlar yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [selectedDate, showOnlyLive]);

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
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Günlük Maçlar</h1>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => date && setSelectedDate(date)}
          dateFormat="dd/MM/yyyy"
          className="border p-2 rounded"
        />
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showOnlyLive}
            onChange={(e) => setShowOnlyLive(e.target.checked)}
            className="w-4 h-4 text-blue-600"
          />
          <span className="text-sm font-medium">Sadece Canlı Maçlar</span>
        </label>
      </div>

      {loading ? (
        <div className="text-center">Yükleniyor...</div>
      ) : (
        <div className="grid gap-8">
          {Object.keys(groupedMatches).map(tournamentName => (
            <div key={tournamentName} className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">{tournamentName}</h2>
              <div className="grid gap-4">
                {groupedMatches[tournamentName].map((match) => (
                  <div key={match.id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="font-semibold">{match.homeTeam.name}</p>
                      </div>
                      
                      <div className="px-4">
                        <span className={`text-sm ${match.status.type === 'inprogress' || match.status.type === 'halftime' ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                          {match.status.type === 'inprogress' || match.status.type === 'halftime'
                            ? match.status.description
                            : new Date(match.startTimestamp * 1000).toLocaleTimeString('tr-TR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                          }
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
              {showOnlyLive ? 'Şu anda canlı maç bulunmuyor.' : 'Bu tarihte maç bulunmuyor.'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DailyMatches; 