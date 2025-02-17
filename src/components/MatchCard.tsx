import React from 'react';
import TeamLogo from './TeamLogo';

interface MatchCardProps {
  match: Match;
  onClick: () => void;
  onToggleFavorite: (id: string) => void;
  isFavorite: boolean;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onClick, onToggleFavorite, isFavorite }) => {
  const isLive = () => {
    const status = match.status.type?.toLowerCase();
    const description = match.status.description?.toLowerCase();

    return (
      status === 'inprogress' || 
      status === 'live' ||
      description?.includes('devre') ||
      description?.includes('yarı') ||
      /^\d+\'$/.test(description || '') || // Dakika gösterimi (örn: "45'")
      description?.includes('halftime') ||
      description?.includes('half time') ||
      status === 'playing'
    );
  };

  const getScoreStyle = (score: number) => {
    if (!isLive()) return 'text-white';
    if (score >= 3) return 'text-green-400 font-bold';
    if (score >= 1) return 'text-yellow-400';
    return 'text-gray-400';
  };

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

  const getMatchStatus = () => {
    const status = match.status.type?.toLowerCase();
    const description = match.status.description?.toLowerCase();

    console.log('Maç durumu:', { status, description }); // Debug için

    // Dakika kontrolü (örn: "45'")
    const minuteMatch = description?.match(/^(\d+)'/);
    if (minuteMatch) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-500/80 text-white animate-pulse">
          {minuteMatch[0]}
        </span>
      );
    }

    // Özel durumlar
    if (description?.includes('half time') || description?.includes('halftime') || description?.includes('devre arası')) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-500/80 text-white">
          Devre Arası
        </span>
      );
    }

    if (description?.includes('1st half') || description?.includes('first half') || description?.includes('1. yarı')) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-500/80 text-white animate-pulse">
          1. Yarı
        </span>
      );
    }

    if (description?.includes('2nd half') || description?.includes('second half') || description?.includes('2. yarı')) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-500/80 text-white animate-pulse">
          2. Yarı
        </span>
      );
    }

    // Varsayılan CANLI gösterimi
    if (isLive()) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-500/80 text-white animate-pulse">
          CANLI
        </span>
      );
    }

    // Maç başlamamışsa saati göster
    return new Date(match.startTimestamp * 1000).toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div 
      onClick={onClick}
      className={`p-3 hover:bg-gray-700/50 cursor-pointer transition-colors ${
        isLive() ? 'bg-red-900/20' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="w-24 text-gray-400 text-sm">
          {getMatchStatus()}
        </div>

        <div className="flex-1 mx-4">
          <div className="flex items-center mb-2">
            <TeamLogo 
              teamId={match.homeTeam.id} 
              className="w-6 h-6 mr-3" 
              fallback={match.homeTeam.name.substring(0, 2)}
            />
            <span className="text-white font-medium flex-1">{match.homeTeam.name}</span>
          </div>

          <div className="flex items-center">
            <TeamLogo 
              teamId={match.awayTeam.id} 
              className="w-6 h-6 mr-3"
              fallback={match.awayTeam.name.substring(0, 2)}
            />
            <span className="text-white font-medium flex-1">{match.awayTeam.name}</span>
          </div>
        </div>

        <div className="w-16 flex flex-col items-center">
          <div className={`
            text-xl font-bold mb-2 min-w-[40px] text-center
            px-2 py-0.5 rounded
            ${isLive() 
              ? 'bg-gray-800 border-2 border-gray-600 text-white shadow-lg' 
              : match.status.type === 'finished'
                ? 'bg-gray-800/40 border border-gray-700 text-gray-300'
                : 'text-gray-500'
            }
            ${match.homeScore?.current > match.awayScore?.current && (isLive() || match.status.type === 'finished')
              ? 'ring-2 ring-green-500/30'
              : ''
            }
          `}>
            {match.homeScore?.current ?? '-'}
          </div>
          <div className={`
            text-xl font-bold min-w-[40px] text-center
            px-2 py-0.5 rounded
            ${isLive() 
              ? 'bg-gray-800 border-2 border-gray-600 text-white shadow-lg' 
              : match.status.type === 'finished'
                ? 'bg-gray-800/40 border border-gray-700 text-gray-300'
                : 'text-gray-500'
            }
            ${match.awayScore?.current > match.homeScore?.current && (isLive() || match.status.type === 'finished')
              ? 'ring-2 ring-green-500/30'
              : ''
            }
          `}>
            {match.awayScore?.current ?? '-'}
          </div>
        </div>

        <div className="w-8 ml-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(match.id);
            }}
            className={`text-xl transition-colors ${
              isFavorite ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400'
            }`}
          >
            {isFavorite ? '★' : '☆'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchCard; 