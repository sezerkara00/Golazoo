import React from 'react';
import { LEAGUES } from '../constants/leagues';

const LeagueList: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(LEAGUES).map(([key, league]) => (
        <div key={key} className="flex items-center space-x-3 p-4 bg-gray-800 rounded-lg">
          <img 
            src={league.logo}
            alt={league.name}
            className="w-10 h-10 object-contain"
          />
          <span className="text-white font-medium">{league.name}</span>
        </div>
      ))}
    </div>
  );
};

export default LeagueList; 