import React from 'react';

interface League {
  id: string;
  name: string;
  slug: string;
  shortName: string;
}

const favoriteLeagues: League[] = [
  { id: '1', name: 'Süper Lig', slug: 'super-lig', shortName: 'SL' },
  { id: '2', name: 'Premier League', slug: 'premier-league', shortName: 'PL' },
  { id: '3', name: 'La Liga', slug: 'la-liga', shortName: 'LL' },
  { id: '4', name: 'Bundesliga', slug: 'bundesliga', shortName: 'BL' },
  { id: '5', name: 'Serie A', slug: 'serie-a', shortName: 'SA' },
  { id: '6', name: 'Champions League', slug: 'champions-league', shortName: 'CL' },
];

const FavoriteLeagues: React.FC = () => {
  const scrollToLeague = (leagueName: string) => {
    const element = document.getElementById(leagueName);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="grid grid-cols-6 gap-4 mb-6">
      {favoriteLeagues.map(league => (
        <div 
          key={league.id}
          onClick={() => scrollToLeague(league.name)}
          className="bg-gray-800 rounded-lg p-4 text-center hover:bg-gray-700 transition cursor-pointer"
        >
          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-white font-bold">{league.shortName}</span>
          </div>
          <span className="text-sm text-white font-medium block">{league.name}</span>
        </div>
      ))}
    </div>
  );
};

export default FavoriteLeagues; 