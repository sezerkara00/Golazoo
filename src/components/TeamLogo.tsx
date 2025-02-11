import React, { useState } from 'react';

interface TeamLogoProps {
  team: string;
  className?: string;
  fallback?: React.ReactNode;
}

const TeamLogo: React.FC<TeamLogoProps> = ({ team, className = "w-12 h-12", fallback }) => {
  const [error, setError] = useState(false);

  if (error || !team) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-700 rounded`}>
        <span className="text-white text-sm font-medium">
          {team?.substring(0, 2).toUpperCase() || 'NA'}
        </span>
      </div>
    );
  }

  const baseUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:9199/v0/b/iddaa-app-8011f.appspot.com/o'
    : 'https://firebasestorage.googleapis.com/v0/b/iddaa-app-8011f.appspot.com/o';

  const logoUrl = `${baseUrl}/team-logos%2F${team}?alt=media`;

  return (
    <div className={`${className} flex items-center justify-center`}>
      <img 
        src={logoUrl}
        alt={`${team} logo`} 
        className="w-full h-full object-contain"
        onError={() => setError(true)}
      />
    </div>
  );
};

export default TeamLogo; 