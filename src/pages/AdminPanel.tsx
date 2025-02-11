import React, { useState, useEffect } from 'react';
import { storage, db } from '../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import TeamLogo from '../components/TeamLogo';

interface Team {
  name: string;
  slug: string;
  logoUrl?: string;
}

interface League {
  id: number;
  name: string;
  slug: string;
  country: {
    name: string;
    flag: string;
    alpha2?: string;
  };
}

const LEAGUES = [
  { 
    id: 4954,
    name: 'Süper Lig', 
    slug: 'super-lig', 
    country: { name: 'Türkiye', flag: 'tr' } 
  },
  { 
    id: 8,
    name: 'LaLiga',
    slug: 'laliga',
    country: { name: 'Spain', flag: 'es', alpha2: 'ES' }
  },
  { 
    id: 17,
    name: 'Premier League',
    slug: 'premier-league',
    country: { name: 'England', flag: 'gb-eng', alpha2: 'GB' }
  },
  { 
    id: 23,
    name: 'Serie A',
    slug: 'serie-a',
    country: { name: 'Italy', flag: 'it' }
  },
  // Diğer ligler...
];

const AdminPanel: React.FC = () => {
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
            'super-lig': {
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

          // Seçili ligin bilgilerini al
          const leagueInfo = leagueMatches[selectedLeague?.slug as keyof typeof leagueMatches];
          
          if (!leagueInfo) return false;

          // Hem slug hem de ülke kontrolü yap
          return (
            leagueInfo.slugs.includes(tournamentSlug) && 
            (
              tournamentId === selectedLeague?.id || 
              tournamentCountry === leagueInfo.country
            )
          );
        });

      // Maçlardaki tüm takımları al ve tekrar edenleri kaldır
      const allTeams: Team[] = leagueMatches.flatMap((match: any) => [
        {
          name: match.homeTeam.name,
          slug: match.homeTeam.slug,
          shortName: match.homeTeam.shortName
        },
        {
          name: match.awayTeam.name,
          slug: match.awayTeam.slug,
          shortName: match.awayTeam.shortName
        }
      ]);

      // Tekrar eden takımları kaldır (slug'a göre)
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
    if (editMode) {
      const isConfirmed = window.confirm('Devam eden düzenlemeyi iptal etmek istiyor musunuz?');
      if (!isConfirmed) return;
    }
    
    setSelectedTeam(team);
    setEditMode(true);
    setSelectedFile(null);
  };

  const handleCancel = () => {
    const isConfirmed = selectedFile 
      ? window.confirm('Değişiklikleri iptal etmek istediğinize emin misiniz?') 
      : true;
    
    if (isConfirmed) {
      setEditMode(false);
      setSelectedTeam(null);
      setSelectedFile(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Dosya boyutu 5MB\'dan küçük olmalıdır!');
        e.target.value = '';
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Lütfen sadece resim dosyası seçin!');
        e.target.value = '';
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleLogoUpdate = async () => {
    if (!selectedFile || !selectedTeam) return;

    try {
      setLoading(true);

      const compressedFile = await compressImage(selectedFile);
      const file = new File([compressedFile], `${selectedTeam.slug}`, {
        type: 'image/png'
      });

      const storageRef = ref(storage, `team-logos/${selectedTeam.slug}`);
      const metadata = {
        contentType: 'image/png',
        customMetadata: {
          'teamName': selectedTeam.name,
          'teamSlug': selectedTeam.slug,
          'uploadedAt': new Date().toISOString()
        }
      };

      await uploadBytes(storageRef, file, metadata);
      const logoUrl = await getDownloadURL(storageRef);

      const teamRef = doc(db, 'teams', selectedTeam.slug);
      await setDoc(teamRef, {
        name: selectedTeam.name,
        slug: selectedTeam.slug,
        logoUrl,
        updatedAt: new Date(),
        createdAt: new Date()
      }, { merge: true });

      // Sessiz güncelleme - bildirim yok
      setEditMode(false);
      setSelectedTeam(null);
      setSelectedFile(null);
    } catch (error: any) {
      console.error('Logo güncellenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  // Resim sıkıştırma fonksiyonu
  const compressImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 512;
          const MAX_HEIGHT = 512;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Canvas to Blob conversion failed'));
              }
            },
            'image/png',
            0.8
          );
        };
      };
      reader.onerror = (error) => reject(error);
    });
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

        {/* Tarih Seçimi */}
        <div className="mb-8">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {selectedLeague && (
          <>
            {loading ? (
              <div className="text-white text-center">Yükleniyor...</div>
            ) : teams.length === 0 ? (
              <div className="text-white text-center">Bu tarihte maç bulunamadı</div>
            ) : (
              <>
                {editMode && selectedTeam ? (
                  <div className="bg-gray-800 p-6 rounded-lg mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl text-white">
                        {selectedTeam.name} - Logo Düzenle
                      </h2>
                      <button
                        onClick={handleCancel}
                        className="text-gray-400 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="w-32 h-32 bg-gray-700 rounded-lg flex items-center justify-center">
                        <TeamLogo 
                          team={selectedTeam.slug}
                          className="w-24 h-24"
                          fallback={
                            <div className="text-gray-400">Logo Yok</div>
                          }
                        />
                      </div>

                      <div className="flex-1">
                        <input
                          type="file"
                          onChange={handleFileChange}
                          accept="image/*"
                          className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 mb-4"
                        />

                        <div className="flex gap-4">
                          <button
                            onClick={handleLogoUpdate}
                            disabled={!selectedFile || loading}
                            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                          >
                            {loading ? 'Güncelleniyor...' : 'Logo Güncelle'}
                          </button>

                          <button
                            onClick={handleCancel}
                            disabled={loading}
                            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
                          >
                            İptal
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Arama kutusu */}
                    <div className="mb-6">
                      <input
                        type="text"
                        placeholder="Takım ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    {/* Takım listesi */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {teams
                        .filter(team => 
                          team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          team.slug.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map(team => (
                          <div key={team.slug} className="bg-gray-800 p-4 rounded-lg">
                            <div className="flex items-center gap-4">
                              <div className="flex flex-col items-center">
                                <TeamLogo 
                                  team={team.slug}
                                  className="w-16 h-16"
                                />
                                <button
                                  onClick={() => handleTeamSelect(team)}
                                  className="text-xs text-blue-400 hover:text-blue-300 mt-2"
                                >
                                  Logo Güncelle
                                </button>
                              </div>
                              <div>
                                <div className="text-white font-medium">{team.name}</div>
                                <div className="text-gray-400 text-sm">{team.slug}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel; 