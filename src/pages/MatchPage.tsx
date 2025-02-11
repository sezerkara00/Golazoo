import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import MatchDetails from './MatchDetails';
import MatchEvents from './MatchEvents';
import MatchStats from './MatchStats';

interface Match {
  id: number;
  homeTeam: {
    name: string;
    shortName: string;
    id: number;
  };
  awayTeam: {
    name: string;
    shortName: string;
    id: number;
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

const MatchPage = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const [match, setMatch] = useState<Match | null>(null);
  const [activeTab, setActiveTab] = useState<'events' | 'stats' | 'forum'>('events');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatch = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/event/${matchId}`);
        console.log('API Response:', response.data); // Debug için

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

    if (matchId) {
      fetchMatch();
    }
  }, [matchId]);

  if (loading) return <div className="text-center p-8">Yükleniyor...</div>;
  if (error) return <div className="text-center p-8 text-red-600">{error}</div>;
  if (!match) return <div className="text-center p-8">Maç bulunamadı</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Maç Başlığı */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold text-gray-800">
            {match.tournament.category?.name || match.tournament.name}
          </h1>
          {match.venue && (
            <p className="text-sm text-gray-600">
              {typeof match.venue.name === 'string' ? match.venue.name : ''}, 
              {typeof match.venue.city === 'string' ? match.venue.city : ''}
            </p>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-center flex-1">
            <p className="text-2xl font-bold">
              {typeof match.homeTeam.name === 'string' ? match.homeTeam.name : ''}
            </p>
          </div>
          <div className="text-center px-8">
            <div className="text-3xl font-bold mb-2">
              {match.homeScore?.display ?? 0} - {match.awayScore?.display ?? 0}
            </div>
            <div className="text-sm text-red-600 font-medium">
              {typeof match.status.description === 'string' ? match.status.description : ''}
            </div>
          </div>
          <div className="text-center flex-1">
            <p className="text-2xl font-bold">
              {typeof match.awayTeam.name === 'string' ? match.awayTeam.name : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Menü */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab('events')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'events'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Maç Olayları
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'stats'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              İstatistikler
            </button>
            <button
              onClick={() => setActiveTab('forum')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'forum'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Forum
            </button>
          </div>
        </div>

        <div className="p-4">
          {activeTab === 'events' ? (
            <MatchEvents 
              matchId={parseInt(matchId!)} 
              homeTeamId={match.homeTeam.id} 
              awayTeamId={match.awayTeam.id}
            />
          ) : activeTab === 'stats' ? (
            <MatchStats matchId={parseInt(matchId!)} />
          ) : (
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4">Maç Forumu</h2>
              <div className="text-gray-600">
                Forum özelliği yakında eklenecek...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchPage; 