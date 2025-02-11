import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import MatchEvents from './MatchEvents';
import MatchStats from './MatchStats';
import TeamLogo from '../components/TeamLogo';

interface Match {
  id: number;
  homeTeam: {
    id: number;
    name: string;
    shortName: string;
    slug: string;
  };
  awayTeam: {
    id: number;
    name: string;
    shortName: string;
    slug: string;
  };
  homeScore: {
    current: number;
    display: number;
  };
  awayScore: {
    current: number;
    display: number;
  };
  tournament: {
    name: string;
    category: {
      name: string;
    };
  };
  status: {
    description: string;
    type: string;
  };
  venue?: {
    name: string;
    city: string;
  };
}

const Match: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [match, setMatch] = useState<Match | null>(null);
  const [activeTab, setActiveTab] = useState<'events' | 'stats' | 'forum'>('events');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/event/${id}`);
        const matchData = response.data.event;
        
        if (matchData && matchData.tournament) {
          setMatch(matchData);
        } else {
          setError('Maç bilgileri alınamadı');
        }
      } catch (error) {
        console.error('Maç detayları yüklenirken hata:', error);
        setError('Maç detayları yüklenirken bir hata oluştu');
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">Yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">Maç bulunamadı</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto p-4">
        {/* Turnuva Bilgisi */}
        <div className="bg-gray-800/50 rounded-lg p-4 mb-6 border border-gray-700">
          <div className="text-gray-400 text-center">{match.tournament.name}</div>
          {match.venue?.name && (
            <div className="text-sm text-gray-500 text-center">{match.venue.name}</div>
          )}
        </div>

        {/* Maç Detayları */}
        <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700 mb-6">
          <div className="p-8">
            <div className="flex items-center justify-between">
              {/* Ev Sahibi */}
              <div className="flex flex-col items-center gap-4 w-1/3">
                <TeamLogo 
                  teamId={match.homeTeam.id.toString()}
                  size="large"
                />
                <div className="text-xl font-bold text-white text-center">
                  {match.homeTeam.name}
                </div>
              </div>

              {/* Skor */}
              <div className="flex flex-col items-center w-1/3">
                <div className="text-4xl font-bold text-white mb-2">
                  {`${match.homeScore?.display ?? 0} - ${match.awayScore?.display ?? 0}`}
                </div>
                <span className={`text-sm px-3 py-1 rounded-full ${
                  match.status.type === 'inprogress' 
                    ? 'bg-red-500/20 text-red-500' 
                    : 'bg-gray-700/50 text-gray-400'
                }`}>
                  {match.status.description}
                </span>
              </div>

              {/* Deplasman */}
              <div className="flex flex-col items-center gap-4 w-1/3">
                <TeamLogo 
                  teamId={match.awayTeam.id.toString()}
                  size="large"
                />
                <div className="text-xl font-bold text-white text-center">
                  {match.awayTeam.name}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Menüsü */}
        <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('events')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition ${
                activeTab === 'events'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              Maç Olayları
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition ${
                activeTab === 'stats'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              İstatistikler
            </button>
            <button
              onClick={() => setActiveTab('forum')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition ${
                activeTab === 'forum'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              Forum
            </button>
          </div>

          <div className="p-4">
            {activeTab === 'events' && id && match && (
              <MatchEvents 
                matchId={parseInt(id)}
                homeTeamId={match.homeTeam.id}
                awayTeamId={match.awayTeam.id}
              />
            )}
            {activeTab === 'stats' && id && (
              <MatchStats matchId={parseInt(id)} />
            )}
            {activeTab === 'forum' && (
              <div className="text-center text-gray-400 py-8">
                Forum özelliği yakında eklenecek...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Match; 