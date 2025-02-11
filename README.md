# Match Forum 🏆

Canlı maç tartışmaları için geliştirilen modern ve interaktif bir forum platformu. Kullanıcılar maçları takip edebilir, yorum yapabilir ve diğer taraftarlarla etkileşime geçebilir.

---

## 🌟 Özellikler

### 💬 Forum Özellikleri
- Maç başına özel tartışma forumları
- İç içe yorum sistemi (nested comments)
- Yorum beğenme sistemi
- Gerçek zamanlı bildirimler
- Maç istatistikleri
- Canlı skor takibi

### 🔐 Kullanıcı Deneyimi
- Modern ve koyu tema arayüz
- Mobil uyumlu tasarım
- Hızlı yükleme süreleri
- Güvenli kullanıcı kimlik doğrulama
- Çoklu dil desteği (yakında)

---

## 🛠 Teknoloji Yığını

### 🛠️ Frontend
- **React 18** - Modern UI geliştirme
- **TypeScript** - Tip güvenliği
- **Tailwind CSS** - Stil ve tasarım
- **Context API** - State yönetimi

### 🛠️ Backend
- **Python (FastAPI/Django)** - API sunucusu
- **PostgreSQL** - Ana veritabanı
- **Redis** - Önbellek yönetimi
- **WebSocket** - Gerçek zamanlı iletişim

---

## 📚 Proje Yapısı

```
src/
├── pages/
│   ├── MatchForum.tsx # Maç forum sayfası
│   └── DailyMatches.tsx # Günlük maçlar sayfası
├── components/
│   └── Navbar.tsx # Navigasyon bileşeni
├── services/
│   └── api.ts # API servisleri
├── contexts/ # Context dosyaları
├── types/ # TypeScript tipleri
└── utils/ # Yardımcı fonksiyonlar
```

---

## 💪 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

---

## ✅ Yapılacaklar

- [ ] Kullanıcı profil sayfaları
- [ ] Maç istatistikleri entegrasyonu
- [ ] Moderasyon araçları
- [ ] Çoklu dil desteği
- [ ] PWA desteği

---

## 🐝 Kurulum

Projeyi klonlayın:
```bash
git clone https://github.com/sezerkara00/match-forum.git
cd match-forum
```

### Frontend Kurulumu
```bash
npm install
npm run dev
```

### Backend Kurulumu
```bash
pip install -r requirements.txt
python app.py
```

---

## 📂 Ortam Değişkenleri

`.env` dosyanızı aşağıdaki gibi yapılandırın:
```env
VITE_API_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000
DATABASE_URL=postgresql://user:password@localhost:5432/matchforum
REDIS_URL=redis://localhost:6379
```

---

## 💎 Lisans

Bu proje [MIT](LICENSE) lisansı altında lisanslanmıştır.

---

## 🙏 İletişim

- Geliştirici - [@sezerkara00](https://github.com/sezerkara00)
- E-posta - sezerkara949@gmail.com

Projeye katkıda bulunan herkese teşekkürler! 🚀
![image](https://github.com/user-attachments/assets/d0873f00-0991-4d15-9d62-f53800b4ec5f)
![image](https://github.com/user-attachments/assets/87827d9c-c0b6-40ea-acb2-da5e5d0d9a35)
![image](https://github.com/user-attachments/assets/7c8dc747-fe97-4c7b-b2c5-e9429c192fdf)


