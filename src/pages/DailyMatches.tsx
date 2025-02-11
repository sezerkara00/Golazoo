import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";
import MatchDetails from './MatchDetails';

interface Match {
  id: number;
  homeTeam: { 
    name: string;
  };
  awayTeam: { 
    name: string;
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
    type: string;
    description: string;
  };
}

const DailyMatches = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [groupedMatches, setGroupedMatches] = useState<{ [key: string]: Match[] }>({});
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);

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
      const tournamentName = match.tournament.name;
      if (!grouped[tournamentName]) {
        grouped[tournamentName] = [];
      }
      grouped[tournamentName].push(match);
    });
    setGroupedMatches(grouped);
  };

  const getMatchStatus = (match: Match) => {
    if (isMatchLive(match)) {
      return <span className="text-red-600 font-medium">{match.status.description}</span>;
    }
    if (isMatchFinished(match)) {
      return <span className="text-gray-600">Tamamlandı</span>;
    }
    return (
      <span className="text-gray-500">
        {new Date(match.startTimestamp * 1000).toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit'
        })}
      </span>
    );
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
                  <div 
                    key={match.id} 
                    className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition cursor-pointer"
                    onClick={() => navigate(`/match/${match.id}`)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="font-semibold">{match.homeTeam.name}</p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {(isMatchLive(match) || isMatchFinished(match)) && (
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold">{match.homeScore?.display ?? 0}</span>
                            <span className="text-xl font-bold">-</span>
                            <span className="text-xl font-bold">{match.awayScore?.display ?? 0}</span>
                          </div>
                        )}
                        <div className="px-4">
                          {getMatchStatus(match)}
                        </div>
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
              Bu tarihte maç bulunmuyor.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DailyMatches; 