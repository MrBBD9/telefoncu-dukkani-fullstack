# 📱 Telefoncu Dükkanı Full-Stack Web Uygulaması (Sahibinden Tarzı İlan & Yönetim Vitrini)

Bu proje, bir telefoncu dükkanının sıfır ve ikinci el akıllı telefon ilanlarını sergileyebileceği, müşterilerin doğrudan WhatsApp veya Telefon ile dükkanla iletişime geçebileceği ve dükkan sahibinin özel yönetim portalından ilan ekleyip (cihaz galerisinden fotoğraf yükleme, özel RAM & Depolama tanımlama) yönetebileceği **Full-Stack** bir web uygulamasıdır.

---

## ✨ Özellikler

### 🛍️ Müşteri Vitrini
- **Canlı İlan Arama & Filtreleme**: Marka (Apple, Samsung, Xiaomi vb.), cihaz durumu (Sıfır, 2.El, Yenilenmiş), fiyat aralığı ve sıralama seçenekleri.
- **Sahibinden Tarzı İlan Kartları**: Yüksek kaliteli görseller, pil sağlığı (BTY %), hafıza, RAM, garanti etiketleri ve ilan görüntülenme sayıları.
- **İlan Detay Galerisi & İletişim**:
  - Fotoğraf önizleme galerisi
  - Detaylı teknik özellik tablosu & aksesuar kontrol listesi
  - **Doğrudan WhatsApp İletişim Butonu** (İlan başlığı ve fiyatı içeren otomatik mesaj)
  - **Hemen Ara Butonu** (Dükkan telefonunu arama)

### 👑 Dükkan Sahibi Yönetim Portalı (`https://admin.cepmarket.com`)
- **İstatistik Kartları**: Toplam stok adedi, toplam stok değeri (₺), yayındaki ilanlar, satılan cihazlar ve ortalama ilan fiyatı.
- **📱 Cihaz Galerisinden Fotoğraf Yükleme**: Telefon galerisinden veya bilgisayardan sürükle-bırak/seç ile doğrudan resim yükleme.
- **Özel (Custom) RAM & Depolama**: Hızlı seçimlerin yanı sıra istenen her türlü özel RAM (Örn: 18 GB, 24 GB) ve Hafıza metni girebilme.
- **İlan Yönetimi**: İlanları tek tıkla "Satıldı" veya "Yayında" durumuna getirme, düzenleme ve silme.
- **Mağaza Ayarları**: Dükkan adı, Telefon, WhatsApp hattı, Adres ve Yönetici şifresi güncelleme.

---

## 🛠️ Kullanılan Teknolojiler

- **Frontend**: React (Vite), TailwindCSS, Lucide Icons, Context API
- **Backend**: Node.js, Express.js REST API
- **Veritabanı & Yükleme**: JSON File Database (Kalıcı Saklama), Base64 / Multer File Storage

---

## 🚀 Kurulum ve Çalıştırma

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/MrBBD9/telefoncu-dukkani-fullstack.git
cd telefoncu-dukkani-fullstack
```

### 2. Backend Sunucusunu Başlatın
```bash
cd server
npm install
npm start
```
*Backend `http://localhost:5000` adresinde çalışmaya başlayacaktır.*

### 3. Frontend İstemcisini Başlatın
```bash
cd ../client
npm install
npm run dev
```
*Frontend `http://localhost:5173` adresinde açılacaktır.*

---

## 🔑 Varsayılan Yönetici Giriş Bilgileri

- **Kullanıcı Adı**: `admin`
- **Şifre**: `admin123`
*(Sağ üstteki "Dükkan Sahibi Girişi" butonundan yönetim portalına erişebilirsiniz).*
