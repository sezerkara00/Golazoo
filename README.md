# Team Logo Management 🎨

Futbol takımlarının logolarını yönetmek için geliştirilmiş modern bir web uygulaması. SofaScore API entegrasyonu ile güncel takım verilerini çeker ve Firebase altyapısı ile logo yönetimini sağlar.

## 🌟 Özellikler

### 🏆 Lig Desteği
- Süper Lig 🇹🇷
- LaLiga 🇪🇸
- Premier League 🏴󠁧󠁢󠁥󠁮󠁧󠁿
- Serie A 🇮🇹

### 💼 Logo Yönetimi
- Otomatik boyutlandırma ve sıkıştırma
- Firebase Storage entegrasyonu
- Firestore veritabanı kaydı
- Anlık önizleme

### 🔍 Akıllı Filtreleme
- Son 30 günlük maç verilerine göre takım listesi
- Lig ve ülke bazlı doğrulama
- Takım adı ve slug bazlı arama
- Tekrar eden takımların otomatik filtrelenmesi

## 🛠 Teknoloji Yığını

### Frontend
- **React 18** - Modern UI geliştirme
- **TypeScript** - Tip güvenliği
- **TailwindCSS** - Stil ve tasarım
- **Firebase SDK** - Backend entegrasyonu

### Backend & Storage
- **Firebase Storage** - Logo depolama
- **Firestore** - Veritabanı
- **SofaScore API** - Maç ve takım verileri

## 🚀 Kurulum

1. Repoyu klonlayın:
```bash
git clone https://github.com/kullaniciadi/team-logo-management.git
cd team-logo-management
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `.env.local` dosyası oluşturun ve gerekli ortam değişkenlerini ekleyin:
```env
VITE_FIREBASE_CONFIG=your_firebase_config
```

4. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

## 📁 Proje Yapısı

```
src/
├── components/
│   └── TeamLogo.tsx     # Logo bileşeni
├── pages/
│   └── AdminPanel.tsx   # Ana yönetim paneli
├── firebase.ts          # Firebase yapılandırması
└── types/
    └── index.ts         # TypeScript tipleri
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Yapılacaklar

- [ ] Bundesliga desteği
- [ ] Ligue 1 desteği
- [ ] Toplu logo güncelleme
- [ ] Logo geçmişi
- [ ] Yetkilendirme sistemi

## 📄 Lisans

Bu proje [MIT](LICENSE) lisansı altında lisanslanmıştır.

## 📞 İletişim

- Geliştirici - [@kullaniciadi](https://github.com/kullaniciadi)
- E-posta - ornek@email.com

---

⭐️ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!


