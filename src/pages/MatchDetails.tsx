import React, { useState } from 'react';
import MatchEvents from './MatchEvents';
import MatchForum from './MatchForum';
import MatchStats from './MatchStats';

interface MatchDetailsProps {
  matchId: number;
  homeTeamId: number;
  awayTeamId: number;
}

type TabType = 'events' | 'stats' | 'forum';

const MatchDetails: React.FC<MatchDetailsProps> = ({ matchId, homeTeamId, awayTeamId }) => {
  const [activeTab, setActiveTab] = useState<TabType>('events');

  const tabs = [
    { id: 'events', label: 'Maç Olayları' },
    { id: 'stats', label: 'İstatistikler' },
    { id: 'forum', label: 'Forum' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex border-b border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`px-4 py-2 text-sm font-medium transition-colors
              ${activeTab === tab.id 
                ? 'text-white border-b-2 border-blue-500' 
                : 'text-gray-400 hover:text-gray-300'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'events' && (
          <MatchEvents 
            matchId={matchId} 
            homeTeamId={homeTeamId} 
            awayTeamId={awayTeamId} 
          />
        )}
        {activeTab === 'stats' && (
          <MatchStats matchId={matchId} />
        )}
        {activeTab === 'forum' && (
          <MatchForum matchId={matchId} />
        )}
      </div>
    </div>
  );
};

export default MatchDetails; 