import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import TeamLogo from '../components/TeamLogo';
import { logLeagueName } from '../utils/leagueUtils';

interface MatchData {
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
  venue: {
    city: string;
    name: string;
    slug: string;
  };
  tournament: {
    name: string;
    slug: string;
    category: any;
  };
  status: {
    code: number;
    description: string;
    type: string;
  };
  events: MatchEvent[];
}

interface MatchEvent {
  time: string;
  type: string;
  player: {
    name: string;
    slug: string;
  };
  team: {
    name: string;
    slug: string;
  };
}

const MatchDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      setLoading(true);
      try {
        // Önce maç detaylarını al
        const matchResponse = await api.get(`/match/${id}`);
        console.log('Match Response:', matchResponse.data);

        // Sonra events bilgilerini al
        const eventsResponse = await api.get(`/match/${id}/events`);
        console.log('Events Response:', eventsResponse.data);

        if (matchResponse.data.event) {
          // İki API yanıtını birleştir
          setMatchData({
            ...matchResponse.data.event,
            homeTeam: matchResponse.data.event.homeTeam,
            awayTeam: matchResponse.data.event.awayTeam,
            events: eventsResponse.data.incidents || []
          });
        }
      } catch (error) {
        console.error('Maç detayları yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMatchDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-500">Yükleniyor...</div>
      </div>
    );
  }

  if (!matchData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-500">Maç bulunamadı</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-gray-900 rounded-lg overflow-hidden">
      {/* Üst Bilgi */}
      <div className="p-4 text-center border-b border-gray-800">
        <div className="text-gray-400">{matchData.tournament.name}</div>
        <div className="text-sm text-gray-500">{matchData.venue.name}</div>
      </div>

      {/* Skor Tablosu */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <TeamLogo 
              team={matchData.homeTeam.slug.toLowerCase()}
              className="w-16 h-16"
              fallback={
                <div className="w-16 h-16 bg-gray-800 rounded flex items-center justify-center text-white text-lg">
                  {matchData.homeTeam.name.substring(0, 2).toUpperCase()}
                </div>
              }
            />
            <div className="text-xl font-bold text-white">{matchData.homeTeam.name}</div>
          </div>

          <div className="text-3xl font-bold text-white">
            {`${matchData.homeScore.display} - ${matchData.awayScore.display}`}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-xl font-bold text-white">{matchData.awayTeam.name}</div>
            <TeamLogo 
              team={matchData.awayTeam.slug.toLowerCase()}
              className="w-16 h-16"
              fallback={
                <div className="w-16 h-16 bg-gray-800 rounded flex items-center justify-center text-white text-lg">
                  {matchData.awayTeam.name.substring(0, 2).toUpperCase()}
                </div>
              }
            />
          </div>
        </div>
      </div>

      {/* Maç Olayları */}
      <div className="p-4 bg-gray-800">
        <div className="space-y-2">
          {matchData.events?.map((event, index) => (
            <div key={index} className="flex items-center text-sm">
              <div className="w-16 text-gray-400">{event.time}'</div>
              <div className="flex-1">
                <span className={`${event.team.name === matchData.homeTeam.name ? 'text-blue-400' : 'text-red-400'}`}>
                  {event.player.name}
                </span>
                <span className="text-gray-400 ml-2">
                  {event.type === 'substitution' ? '↔️' : 
                   event.type === 'yellow' ? '🟨' : 
                   event.type === 'red' ? '🟥' : '⚽'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Durum */}
      <div className="p-2 text-center bg-gray-800 border-t border-gray-700">
        <span className="text-sm text-red-500">{matchData.status.description}</span>
      </div>
    </div>
  );
};

export default MatchDetails; 