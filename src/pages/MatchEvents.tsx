import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface Player {
  name: string;
  shortName: string;
  id: number;
}

interface MatchEvent {
  id: number;
  time: number;
  text: string;
  player?: Player;
  playerIn?: Player;
  playerOut?: Player;
  teamId?: number;
  incidentType: string;
  isHome: boolean;
  reason?: string;
  goalScore?: {
    home: number;
    away: number;
  };
  assist1?: Player;
  incidentClass?: string;
  injury?: boolean;
  homeScore?: number;
  awayScore?: number;
  confirmed?: boolean;
  addedTime?: number;
  from?: string;
}

interface MatchEventsProps {
  matchId: number;
  homeTeamId: number;
  awayTeamId: number;
}

const formatMatchTime = (time: number, addedTime?: number) => {
  if (addedTime === 999) {
    return time === 45 ? 'HT' : 'FT';
  }
  return `${time}'${addedTime ? `+${addedTime}` : ''}`;
};

const SoccerBall = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,3C7.03,3 3,7.03 3,12C3,16.97 7.03,21 12,21C16.97,21 21,16.97 21,12C21,7.03 16.97,3 12,3M11,7H13V13H11V7M11,15H13V17H11V15Z"/>
  </svg>
);

const MatchEvents = ({ matchId, homeTeamId, awayTeamId }: MatchEventsProps) => {
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get(`/event/${matchId}/incidents`);
        console.log('API Response:', response.data);
        const filteredEvents = response.data.incidents.filter((event: MatchEvent) => 
          ['goal', 'card', 'substitution', 'period', 'varDecision'].includes(event.incidentType)
        );
        
        // Maç başlangıcı olayını ekle
        const kickoffEvent: MatchEvent = {
          id: -1,
          time: 0,
          text: 'KO',
          incidentType: 'period',
          isHome: false,
          homeScore: 0,
          awayScore: 0,
          teamId: undefined
        };
        
        // Olayları ters çevir ve maç başlangıcını en başa ekle
        const reversedEvents = filteredEvents.reverse();
        setEvents([kickoffEvent, ...reversedEvents]);
      } catch (error) {
        console.error('Maç olayları yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [matchId]);

  const getEventIcon = (type: string, incidentClass?: string, isOwnGoal?: boolean) => {
    switch (type) {
      case 'goal':
        if (isOwnGoal) return (
          <span className="relative">
            <span className="text-red-500">⚽</span>
            <span className="absolute -top-2 -right-1 text-xs text-red-500">↩</span>
          </span>
        );
        return <span className="text-green-500">⚽</span>;
      case 'card':
        return incidentClass === 'yellow' ? '🟨' : 
               incidentClass === 'red' ? '🟥' : '⬜';
      case 'substitution':
        return '🔄';
      case 'varDecision':
        return '📺';
      default:
        return '•';
    }
  };

  const getVarDecisionText = (event: MatchEvent) => {
    if (event.confirmed === false) {
      switch (event.incidentClass) {
        case 'penaltyNotAwarded':
          return 'VAR: Penaltı kararı';
        case 'goalCancelled':
          return 'VAR: Gol iptal';
        default:
          return 'VAR İncelemesi';
      }
    }
    return 'VAR: Karar onaylandı';
  };

  const renderEvent = (event: MatchEvent) => {
    const isHome = event.isHome;
    const baseClasses = "flex items-center gap-1 text-sm";
    const alignmentClasses = isHome ? "justify-start" : "justify-end";

    switch (event.incidentType) {
      case 'period':
        if (event.text === 'KO') {  // Kick-off (Maç başlangıcı)
          return (
            <div className="w-full flex justify-between items-center py-2 px-4 bg-gray-800/50">
              <div className="text-xs font-medium text-gray-400">
                Maç Başladı
              </div>
              <div className="text-sm font-bold text-white">
                0 - 0
              </div>
            </div>
          );
        }
        return (
          <div className="w-full flex justify-between items-center py-2 px-4 bg-gray-800/50">
            <div className="text-xs font-medium text-gray-400">
              {event.text === 'HT' ? 'İlk Yarı Sonu' : 'Maç Sonu'}
            </div>
            <div className="text-sm font-bold text-white">
              {event.homeScore} - {event.awayScore}
            </div>
          </div>
        );
      case 'goal':
        return (
          <div className={`${baseClasses} ${alignmentClasses} p-1.5`}>
            <div className={`flex flex-col ${isHome ? 'items-start' : 'items-end'}`}>
              <span className="font-medium text-white flex items-center gap-1">
                {event.player?.name} {
                  event.from === 'penalty' ? (
                    <span className="text-green-500">⚽ 🥅</span>
                  ) : event.from === 'owngoal' ? (
                    <span className="text-red-500">⚽</span>
                  ) : (
                    <span className="text-green-500">⚽ 🎉</span>
                  )
                }
              </span>
              {event.assist1 && (
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  Asist: {event.assist1.name} <span>🎯</span>
                </span>
              )}
              <span className={`text-xs ${event.from === 'owngoal' ? 'text-red-500' : 'text-emerald-500'}`}>
                {event.from === 'penalty' ? 'Penaltı golü ' : 
                 event.from === 'owngoal' ? 'Kendi kalesine ' : ''}
                {event.homeScore}-{event.awayScore}
              </span>
            </div>
          </div>
        );
      case 'card':
        return (
          <div className={`${baseClasses} ${alignmentClasses} p-1.5`}>
            <div className={`flex flex-col ${isHome ? 'items-start' : 'items-end'}`}>
              <span className="text-white">{event.player?.name}</span>
              {event.reason && (
                <span className={`text-xs ${
                  event.incidentClass === 'yellow' ? 'text-yellow-300' :
                  event.incidentClass === 'red' ? 'text-red-300' : 'text-gray-500'
                }`}>
                  {event.reason}
                </span>
              )}
            </div>
          </div>
        );
      case 'substitution':
        return (
          <div className={`${baseClasses} ${alignmentClasses} p-1.5`}>
            <div className={`flex flex-col ${isHome ? 'items-start' : 'items-end'} text-xs`}>
              <span className="text-emerald-500 font-medium">↑ {event.playerIn?.name}</span>
              <span className="text-rose-500 font-medium">↓ {event.playerOut?.name}</span>
            </div>
          </div>
        );
      case 'varDecision':
        return (
          <div className={`${baseClasses} ${alignmentClasses} p-1.5`}>
            <div className={`flex flex-col ${isHome ? 'items-start' : 'items-end'}`}>
              <span className="font-medium text-white flex items-center gap-1">
                {event.player?.name} {
                  event.incidentClass === 'penaltyMissed' && 
                  <span className="text-red-500">⚽ 🥅</span>
                }
              </span>
              <span className="text-xs text-blue-300">
                {getVarDecisionText(event)}
              </span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) return <div className="text-center text-xs text-gray-400">Yükleniyor...</div>;

  return (
    <div className="flex justify-center">
      <div className="bg-gray-900 rounded-lg text-sm w-full max-w-lg">
        <div className="divide-y divide-gray-800">
          {events.map((event) => (
            <div key={event.id} className="flex items-center hover:bg-gray-800/50">
              {event.isHome ? (
                <>
                  <div className={`w-12 text-xl px-2 ${
                    event.incidentType === 'goal' && !event.from ? 'text-green-500' : ''
                  }`}>
                    {getEventIcon(event.incidentType, event.incidentClass, event.from === 'owngoal')}
                  </div>
                  <div className="w-12 text-xs text-gray-500 shrink-0">
                    {formatMatchTime(event.time, event.addedTime)}
                  </div>
                  <div className="flex-1 px-2">
                    {renderEvent(event)}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex-1 px-2">
                    {renderEvent(event)}
                  </div>
                  <div className="w-12 text-xs text-gray-500 shrink-0 text-right">
                    {formatMatchTime(event.time, event.addedTime)}
                  </div>
                  <div className={`w-12 text-xl px-2 text-right ${
                    event.incidentType === 'goal' && !event.from ? 'text-green-500' : ''
                  }`}>
                    {getEventIcon(event.incidentType, event.incidentClass, event.from === 'owngoal')}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchEvents; 