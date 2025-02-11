import React, { useState } from 'react';

interface TeamLogoProps {
  team: string;
  className?: string;
  fallback?: React.ReactNode;
}

const TeamLogo: React.FC<TeamLogoProps> = ({ team, className = "w-12 h-12", fallback }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (hasError && fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className={`${className} flex items-center justify-center`}>
      <img 
        src={`/assets/team-logos/${team}.png`}
        alt={`${team} logo`}
        className={`w-full h-full object-contain ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
        onError={(e) => {
          setHasError(true);
          e.currentTarget.style.display = 'none';
        }}
      />
      {!isLoaded && !hasError && (
        <div className="text-gray-500">...</div>
      )}
    </div>
  );
};

export default TeamLogo; 