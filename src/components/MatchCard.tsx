import React from 'react';
import TeamLogo from './TeamLogo';

interface Match {
  id: number;
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
  startTimestamp: number;
  tournament: {
    name: string;
    category: {
      name: string;
    };
  };
  status: {
    type: string;
    description: string;
  };
}

interface MatchCardProps {
  match: Match;
  onClick: () => void;
  onToggleFavorite: (matchId: number) => void;
  isFavorite: boolean;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onClick, onToggleFavorite, isFavorite }) => {
  const isLive = match.status.type === 'inprogress' || match.status.type === 'halftime';

  const getMatchScore = () => {
    const scoreClasses = `font-bold ${
      isLive ? 'text-red-500 text-2xl' : 'text-white text-xl'
    }`;

    if (match.status.type === 'notstarted') {
      return <div className="text-gray-400 text-lg">vs</div>;
    }

    return (
      <div className={`flex items-center gap-2 ${scoreClasses}`}>
        <span>{match.homeScore?.display ?? 0}</span>
        <span>-</span>
        <span>{match.awayScore?.display ?? 0}</span>
      </div>
    );
  };

  const getMatchStatus = () => {
    switch (match.status.type) {
      case 'inprogress':
      case 'halftime':
        return (
          <span className="text-red-600 font-medium text-sm">
            {match.status.description}
          </span>
        );
      case 'finished':
        return (
          <span className="text-gray-600 text-sm">
            Tamamlandı
          </span>
        );
      default:
        return (
          <span className="text-gray-500 text-sm">
            {new Date(match.startTimestamp * 1000).toLocaleTimeString('tr-TR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        );
    }
  };

  return (
    <div 
      className={`p-4 hover:bg-gray-700/70 transition cursor-pointer ${
        isLive ? 'bg-gray-700/70 border-l-4 border-red-500' : 'bg-gray-800/30'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        {/* Ev sahibi takım */}
        <div className="w-[40%] flex items-center justify-end gap-3">
          <span className="text-white text-sm font-medium text-right">
            {match.homeTeam.name}
          </span>
          <TeamLogo 
            team={match.homeTeam.slug} 
            className="w-8 h-8"
            fallback={
              <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center text-white text-xs">
                {match.homeTeam.name.substring(0, 2)}
              </div>
            }
          />
        </div>

        {/* Skor ve durum */}
        <div className="w-[20%] flex flex-col items-center">
          <div className="relative w-full flex justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(match.id);
              }}
              className="absolute -top-3 text-gray-400 hover:text-yellow-500 transition"
              title={isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
            >
              {isFavorite ? "⭐" : "☆"}
            </button>
          </div>
          {getMatchScore()}
          {getMatchStatus()}
        </div>

        {/* Deplasman takım */}
        <div className="w-[40%] flex items-center justify-start gap-3">
          <TeamLogo 
            team={match.awayTeam.slug}
            className="w-8 h-8"
            fallback={
              <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center text-white text-xs">
                {match.awayTeam.name.substring(0, 2)}
              </div>
            }
          />
          <span className="text-white text-sm font-medium text-left">
            {match.awayTeam.name}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MatchCard; 