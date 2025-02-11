export const getTeamLogoPath = (league: string, team: string) => {
  return `/assets/logos/${league}/${team}.png`;
};

export const getLeagueLogoPath = (league: string) => {
  return `/assets/logos/${league}/logo.png`;
}; 