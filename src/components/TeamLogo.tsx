import React from 'react';

interface TeamLogoProps {
  teamId: number;
  className?: string;
  fallback: React.ReactNode;
}

const TeamLogo: React.FC<TeamLogoProps> = ({ teamId, className = '', fallback }) => {
  const imageUrl = `https://img.sofascore.com/api/v1/team/${teamId}/image`;

  return (
    <div className={className}>
      <img
        src={imageUrl}
        alt="team logo"
        className="w-full h-full object-contain"
        onError={(e) => {
          if (e.currentTarget.parentElement) {
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement.appendChild(fallback as any);
          }
        }}
      />
    </div>
  );
};

export default TeamLogo; 