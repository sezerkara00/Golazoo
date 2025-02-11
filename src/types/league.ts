export interface League {
  id: number;
  name: string;
  logo_url: string;
  country: string;
  folder_name: string;
}

export interface Team {
  id: number;
  name: string;
  logo: string;
  league: string;
}

export const TEAMS = {
  'Türkiye - Süper Lig': {
    'Adana Demirspor': {
      name: 'Adana Demirspor',
      logo: '/assets/logos/Türkiye - Süper Lig/Adana Demirspor.png'
    },
    'Alanyaspor': {
      name: 'Alanyaspor',
      logo: '/assets/logos/Türkiye - Süper Lig/Alanyaspor.png'
    },
    'Antalyaspor': {
      name: 'Antalyaspor',
      logo: '/assets/logos/Türkiye - Süper Lig/Antalyaspor.png'
    },
    'Başakşehir FK': {
      name: 'Başakşehir FK',
      logo: '/assets/logos/Türkiye - Süper Lig/Basaksehir FK.png'
    },
    'Beşiktaş JK': {
      name: 'Beşiktaş JK',
      logo: '/assets/logos/Türkiye - Süper Lig/Besiktas JK.png'
    },
    'Bodrum FK': {
      name: 'Bodrum FK',
      logo: '/assets/logos/Türkiye - Süper Lig/Bodrum FK.png'
    },
    'Çaykur Rizespor': {
      name: 'Çaykur Rizespor',
      logo: '/assets/logos/Türkiye - Süper Lig/Caykur Rizespor.png'
    },
    'Eyüpspor': {
      name: 'Eyüpspor',
      logo: '/assets/logos/Türkiye - Süper Lig/Eyupspor.png'
    },
    'Fenerbahçe': {
      name: 'Fenerbahçe',
      logo: '/assets/logos/Türkiye - Süper Lig/Fenerbahce.png'
    },
    'Galatasaray': {
      name: 'Galatasaray',
      logo: '/assets/logos/Türkiye - Süper Lig/Galatasaray.png'
    },
    'Gaziantep FK': {
      name: 'Gaziantep FK',
      logo: '/assets/logos/Türkiye - Süper Lig/Gaziantep FK.png'
    },
    'Göztepe': {
      name: 'Göztepe',
      logo: '/assets/logos/Türkiye - Süper Lig/Goztepe.png'
    },
    'Hatayspor': {
      name: 'Hatayspor',
      logo: '/assets/logos/Türkiye - Süper Lig/Hatayspor.png'
    },
    'Kasımpaşa': {
      name: 'Kasımpaşa',
      logo: '/assets/logos/Türkiye - Süper Lig/Kasimpasa.png'
    },
    'Kayserispor': {
      name: 'Kayserispor',
      logo: '/assets/logos/Türkiye - Süper Lig/Kayserispor.png'
    },
    'Konyaspor': {
      name: 'Konyaspor',
      logo: '/assets/logos/Türkiye - Süper Lig/Konyaspor.png'
    },
    'Samsunspor': {
      name: 'Samsunspor',
      logo: '/assets/logos/Türkiye - Süper Lig/Samsunspor.png'
    },
    'Sivasspor': {
      name: 'Sivasspor',
      logo: '/assets/logos/Türkiye - Süper Lig/Sivasspor.png'
    },
    'Trabzonspor': {
      name: 'Trabzonspor',
      logo: '/assets/logos/Türkiye - Süper Lig/Trabzonspor.png'
    }
  }
  // Diğer ligler için takımlar buraya eklenecek
} as const;

export type TeamKey = keyof typeof TEAMS; 