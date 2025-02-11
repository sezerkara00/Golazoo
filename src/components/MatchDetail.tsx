import React from 'react';
import TeamLogo from './TeamLogo';

interface MatchDetailProps {
  homeTeam: string;
  awayTeam: string;
  score: string;
  stadium: string;
  league: string;
  status: string;
  events?: Array<{
    time: string;
    type: string;
    player: string;
    team: string;
  }>;
}

const MatchDetail: React.FC<MatchDetailProps> = ({
  homeTeam,
  awayTeam,
  score,
  stadium,
  league,
  status,
  events = []
}) => {
  return (
    <div className="max-w-4xl mx-auto bg-gray-900 rounded-lg overflow-hidden">
      {/* Üst Bilgi */}
      <div className="p-4 text-center border-b border-gray-800">
        <div className="text-gray-400">{league}</div>
        <div className="text-sm text-gray-500">{stadium}</div>
      </div>

      {/* Skor Tablosu */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <TeamLogo 
              team={homeTeam}
              className="w-16 h-16"
            />
            <div className="text-xl font-bold text-white">{homeTeam}</div>
          </div>

          <div className="text-3xl font-bold text-white">
            {score}
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-xl font-bold text-white">{awayTeam}</div>
            <TeamLogo 
              team={awayTeam}
              className="w-16 h-16"
            />
          </div>
        </div>
      </div>

      {/* Maç Olayları */}
      <div className="p-4 bg-gray-800">
        <div className="space-y-2">
          {events.map((event, index) => (
            <div key={index} className="flex items-center text-sm">
              <div className="w-16 text-gray-400">{event.time}'</div>
              <div className="flex-1">
                <span className={`${event.team === homeTeam ? 'text-blue-400' : 'text-red-400'}`}>
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

      {/* Durum */}
      <div className="p-2 text-center bg-gray-800 border-t border-gray-700">
        <span className="text-sm text-red-500">{status}</span>
      </div>
    </div>
  );
};

export default MatchDetail; 