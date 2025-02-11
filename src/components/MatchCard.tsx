import React from 'react';
import TeamLogo from './TeamLogo';

interface MatchCardProps {
  match: any;
  onClick: () => void;
  onToggleFavorite: (id: number) => void;
  isFavorite: boolean;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onClick, onToggleFavorite, isFavorite }) => {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'inProgress':
        return 'text-green-500';
      case 'finished':
        return 'text-gray-400';
      default:
        return 'text-white';
    }
  };

  return (
    <div 
      onClick={onClick}
      className="flex items-center justify-between p-4 hover:bg-gray-700/50 transition cursor-pointer"
    >
      <div className="flex items-center gap-3 flex-1">
        <TeamLogo teamId={match.homeTeam.id} className="w-8 h-8" />
        <span className="text-white">{match.homeTeam.name}</span>
      </div>

      <div className="flex flex-col items-center min-w-[100px]">
        <span className={getStatusColor(match.status.type)}>
          {match.status.type === 'notstarted' 
            ? formatTime(match.startTimestamp)
            : match.status.description
          }
        </span>
        {match.status.type !== 'notstarted' && (
          <div className="text-white font-bold">
            {match.homeScore?.current} - {match.awayScore?.current}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 flex-1 justify-end">
        <span className="text-white">{match.awayTeam.name}</span>
        <TeamLogo teamId={match.awayTeam.id} className="w-8 h-8" />
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(match.id);
        }}
        className="ml-4 text-gray-400 hover:text-yellow-500 transition"
      >
        {isFavorite ? '★' : '☆'}
      </button>
    </div>
  );
};

export default MatchCard; 