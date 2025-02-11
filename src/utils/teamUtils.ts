export const getTeamFolderName = (teamSlug: string): string => {
  // Slug zaten URL-friendly olduğu için minimal işlem yapıyoruz
  let fileName = teamSlug
    .toLowerCase()
    .replace(/^./, str => str.toUpperCase());

  // Türkçe karakterleri İngilizce karakterlere dönüştürme
  const turkishToEnglish: { [key: string]: string } = {
    'ğ': 'g',
    'Ğ': 'G',
    'ü': 'u',
    'Ü': 'U',
    'ş': 's',
    'Ş': 'S',
    'ı': 'i',
    'İ': 'I',
    'ö': 'o',
    'Ö': 'O',
    'ç': 'c',
    'Ç': 'C'
  };

  // Türkçe karakterleri değiştir
  Object.entries(turkishToEnglish).forEach(([turkishChar, englishChar]) => {
    fileName = fileName.replace(new RegExp(turkishChar, 'g'), englishChar);
  });

  // Boşlukları ve özel karakterleri düzelt
  fileName = fileName
    .replace(/\s+/g, '') // Tüm boşlukları kaldır
    .replace(/[^a-zA-Z0-9]/g, ''); // Sadece harf ve rakamları tut

  console.log('Takım slug dönüşümü:', {
    original: teamSlug,
    converted: fileName
  });

  return fileName;
};

// Debug için yardımcı fonksiyon
export const logTeamName = (apiTeamName: string) => {
  console.log('API Takım İsmi:', apiTeamName);
  console.log('Dosya İsmi:', getTeamFolderName(apiTeamName));
}; 