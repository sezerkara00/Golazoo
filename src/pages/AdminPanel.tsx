import React, { useState, useEffect } from 'react';
import TeamLogo from '../components/TeamLogo';

interface League {
  id: number;
  name: string;
  slug: string;
  country: {
    name: string;
    flag: string;
  };
}

interface Team {
  name: string;
  slug: string;
  shortName: string;
}

const LEAGUES = [
  { 
    id: 4954,
    name: 'Süper Lig', 
    slug: 'trendyol-super-lig', 
    country: { name: 'Türkiye', flag: 'tr' } 
  },
  { 
    id: 8,
    name: 'LaLiga',
    slug: 'laliga',
    country: { name: 'Spain', flag: 'es' } 
  },
  { 
    id: 17,
    name: 'Premier League',
    slug: 'premier-league',
    country: { name: 'England', flag: 'gb-eng' } 
  },
  { 
    id: 23,
    name: 'Serie A',
    slug: 'serie-a',
    country: { name: 'Italy', flag: 'it' } 
  }
];

const AdminPanel: React.FC = () => {
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (selectedLeague) {
      fetchDailyMatches();
    }
  }, [selectedLeague, date]);

  const fetchDailyMatches = async () => {
    try {
      setLoading(true);
      
      // Son 30 günlük tarih aralığını oluştur
      const dates = Array.from({length: 30}, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      });

      // Tüm tarihlerdeki maçları çek
      const allMatches = await Promise.all(
        dates.map(async (date) => {
          const formattedDate = date.replace(/-/g, '-');
          const response = await fetch(`https://www.sofascore.com/api/v1/sport/football/scheduled-events/${formattedDate}`);
          const data = await response.json();
          return data.events || [];
        })
      );

      // Seçili lige göre maçları filtrele
      const leagueMatches = allMatches
        .flat()
        .filter((event: any) => {
          const tournamentSlug = event.tournament.uniqueTournament?.slug;
          const tournamentId = event.tournament.uniqueTournament?.id;
          const tournamentCountry = event.tournament.uniqueTournament?.category?.country?.alpha2;

          // Her lig için slug ve ülke kontrolü
          const leagueMatches = {
            'trendyol-super-lig': {
              slugs: ['trendyol-super-lig', 'super-lig'],
              country: 'TR'
            },
            'laliga': {
              slugs: ['laliga', 'primera-division'],
              country: 'ES'
            },
            'premier-league': {
              slugs: ['premier-league'],
              country: 'GB'
            },
            'serie-a': {
              slugs: ['serie-a', 'serie-a-tim'],
              country: 'IT'
            }
          };

          const leagueInfo = leagueMatches[selectedLeague?.slug as keyof typeof leagueMatches];
          
          if (!leagueInfo) return false;

          return (
            leagueInfo.slugs.includes(tournamentSlug) && 
            tournamentCountry === leagueInfo.country
          );
        });

      // Maçlardaki tüm takımları al
      const allTeams: Team[] = leagueMatches.flatMap((match: any) => [
        {
          name: match.homeTeam.name,
          slug: match.homeTeam.id.toString(),
          shortName: match.homeTeam.shortName
        },
        {
          name: match.awayTeam.name,
          slug: match.awayTeam.id.toString(),
          shortName: match.awayTeam.shortName
        }
      ]);

      // Tekrar eden takımları kaldır
      const uniqueTeams = Array.from(
        new Map(allTeams.map((team: Team) => [team.slug, team])).values()
      ) as Team[];

      setTeams(uniqueTeams);
    } catch (error) {
      console.error('Maçlar yüklenirken hata:', error);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTeamSelect = (team: Team) => {
    setSelectedTeam(team);
    setEditMode(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">Takım Logo Yönetimi</h1>

        {/* Lig Seçimi */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {LEAGUES.map(league => (
            <button
              key={league.id}
              onClick={() => setSelectedLeague(league)}
              className={`p-4 rounded-lg flex items-center gap-2 ${
                selectedLeague?.id === league.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <img 
                src={`https://flagcdn.com/24x18/${league.country.flag}.png`}
                alt={league.country.name}
                className="w-6 h-4"
              />
              <span>{league.name}</span>
            </button>
          ))}
        </div>

        {selectedLeague && (
          <>
            {loading ? (
              <div className="text-white text-center">Yükleniyor...</div>
            ) : teams.length === 0 ? (
              <div className="text-white text-center">Bu tarihte maç bulunamadı</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teams.map(team => (
                  <div key={team.slug} className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center">
                        <TeamLogo 
                          team={team.slug}
                          className="w-16 h-16"
                        />
                      </div>
                      <div>
                        <div className="text-white font-medium">{team.name}</div>
                        <div className="text-gray-400 text-sm">{team.shortName}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel; 