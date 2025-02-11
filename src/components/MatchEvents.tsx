import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import TeamLogo from './TeamLogo';

interface MatchEvent {
  time: string;
  type: string;
  player: string;
  team: string;
}

const MatchEvents: React.FC<{ matchId: string }> = ({ matchId }) => {
  const [events, setEvents] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get(`/match/${matchId}/events`);
        console.log('Events Response:', response.data);
        setEvents(response.data);
      } catch (error) {
        console.error('Events yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [matchId]);

  if (loading || !events) return null;

  return (
    <div className="bg-gray-900 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <TeamLogo 
            team={events.home?.slug}
            className="w-8 h-8"
            fallback={
              <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center text-white text-sm">
                {events.home?.name?.substring(0, 2).toUpperCase()}
              </div>
            }
          />
          <span className="text-white">{events.home?.name}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-white">{events.away?.name}</span>
          <TeamLogo 
            team={events.away?.slug}
            className="w-8 h-8"
            fallback={
              <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center text-white text-sm">
                {events.away?.name?.substring(0, 2).toUpperCase()}
              </div>
            }
          />
        </div>
      </div>

      {/* Olaylar listesi */}
      <div className="space-y-2">
        {events.incidents?.map((event: any, index: number) => (
          <div key={index} className="flex items-center text-sm">
            <div className="w-16 text-gray-400">{event.time}'</div>
            <div className="flex-1">
              <span className={`${event.team === events.home?.name ? 'text-blue-400' : 'text-red-400'}`}>
                {event.player}
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
  );
};

export default MatchEvents; 