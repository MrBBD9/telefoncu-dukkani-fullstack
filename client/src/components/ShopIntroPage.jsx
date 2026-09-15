import React from 'react';
import {
  Smartphone, ShieldCheck, Wrench, RefreshCw, Headphones, Star, MapPin,
  Phone, MessageSquare, Clock, CheckCircle2, Award, HeartHandshake, ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ShopIntroPage({ onGoToStorefront, onOpenTradeIn }) {
  const { shopInfo } = useAuth();

  const handleWhatsApp = () => {
    const cleanNumber = shopInfo.whatsapp.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent('Merhaba, mağazanız ve sunduğunuz hizmetler hakkında bilgi almak istiyorum.')}`, '_blank');
  };

  const handleOpenMap = () => {
    window.open(`https://maps.google.com/?q=${encodeURIComponent(shopInfo.address)}`, '_blank');
  };

  return (
    <div className="space-y-12 pb-12">
      
      {/* Hero Intro Section */}
      <section className="bg-white border-b border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
              <Award className="w-3.5 h-3.5 text-blue-600" />
              <span>15 Yıllık Güven ve Tecrübe</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
              {shopInfo.shopName} – Akıllı Telefon & Teknik Servis Mağazanız
            </h1>
            
            <p className="text-sm text-gray-600 leading-relaxed">
              Kadıköy'ün kalbinde 15 yıldır sıfır ve ikinci el akıllı telefon alım-satımı, garantili teknik servis tamiri ve aksesuar satışı hizmeti sunuyoruz. Mağazamızda satılan tüm cihazlar uzman teknisyenlerimiz tarafından 40 noktadan test edilir.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onGoToStorefront}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
              >
                <Smartphone className="w-4 h-4" />
                <span>İlan Vitrinini İncele</span>
              </button>

              <button
                onClick={onOpenTradeIn}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 font-bold text-xs transition-all"
              >
                <RefreshCw className="w-4 h-4 text-emerald-600" />
                <span>Eski Telefonunu Takas Yap</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-200">
              <img
                src="https://images.unsplash.com/photo-1556742049-0a67daf64f42?auto=format&fit=crop&w=800&q=80"
                alt="Mağaza İçi Görünüm"
                className="w-full h-72 object-cover"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between text-xs">
                <div>
                  <strong className="text-gray-900 block font-bold">Müşteri Memnuniyet Puanı</strong>
                  <div className="flex items-center gap-1 text-amber-500 font-bold mt-0.5">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>4.9 / 5.0 (1.250+ Google Yorumu)</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded text-[11px] font-bold">
                  Açık • Kadıköy
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Services Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Sunduğumuz Hizmetler</h2>
          <p className="text-xs text-gray-500 mt-1">Dükkanımızda ihtiyacınız olan tüm mobil çözümleri tek çatı altında topluyoruz.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3 hover:border-blue-500 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Sıfır & 2. El Telefon Satışı</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Orijinal kutulu, faturalı ve garantili tüm marka ve modeller (iPhone, Samsung, Xiaomi) en uygun fiyatlarla mağazamızda.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3 hover:border-blue-500 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Garantili Teknik Servis</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Kırık ekran değişimi, batarya yenileme, kasa tamiri ve sıvı teması onarımları orijinal parçalarla aynı gün teslim edilir.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3 hover:border-blue-500 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Değerinde Takas & Nakit Alım</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Eski telefonunuzu mağazamıza getirin, anında piyasa değerinde hesaplansın. Farkı ödeyerek yeni modelinize geçin.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3 hover:border-blue-500 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Orijinal Aksesuar & Cam</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Şarj adaptörleri, orijinal kılıflar, MagSafe aksesuarlar ve tam koruma ekran camları dükkanımızda mevcuttur.
            </p>
          </div>

        </div>
      </section>

      {/* Why Choose Us & Principles */}
      <section className="bg-white border-y border-gray-200 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700 flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase">3 Ay Dükkan Garantisi</h4>
              <p className="text-xs text-gray-500 mt-0.5">Sattığımız tüm 2. el cihazlara 3 ay mekanik dükkan garanti desteği veriyoruz.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-blue-100 text-blue-700 flex-shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase">%100 Orijinal Parça</h4>
              <p className="text-xs text-gray-500 mt-0.5">Teknik servisimizde yan sanayi parçalara yer yoktur, sadece A+ kalite parçalar kullanılır.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-amber-100 text-amber-700 flex-shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase">Şeffaf ve Şartsız Güven</h4>
              <p className="text-xs text-gray-500 mt-0.5">Müşteri memnuniyetimiz her şeyin önündedir. Cihazınızı test ederek teslim alabilirsiniz.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Testimonials & Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Müşteri Değerlendirmeleri</h2>
          <p className="text-xs text-gray-500 mt-1">Dükkanımızdan alışveriş yapan müşterilerimizin yorumları.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-gray-700 italic">
              "iPhone 15 Pro Max cihazımı eski telefonumu vererek takasla aldım. Piyasadaki en dürüst fiyatı verdiler, 10 dakikada veri transferimi de yaptılar."
            </p>
            <span className="block font-bold text-gray-900">— Ahmet K. (Kadıköy)</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-gray-700 italic">
              "Ekranım kırılmıştı, başka yerler 2 gün sürer derken burada 45 dakikada orijinal ekran takıp sıfır gibi teslim ettiler. Güvenilir esnaf."
            </p>
            <span className="block font-bold text-gray-900">— Zeynep T. (Moda)</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-gray-700 italic">
              "İkinci el aldığım Samsung S23 Ultra tam anlatıldığı gibi çiziksiz çıktı. Kutusu ve faturası eksiksiz verildi. Teşekkür ederim."
            </p>
            <span className="block font-bold text-gray-900">— Murat B. (Ataşehir)</span>
          </div>

        </div>
      </section>

      {/* Location & Contact Details */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Mağazamıza Uğrayın</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Cihazları yakından incelemek, test etmek veya çayımızı içmek için dükkanımıza davetlisiniz.
            </p>

            <div className="space-y-2.5 text-xs text-gray-700">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span><strong>Adres:</strong> {shopInfo.address}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span><strong>Telefon:</strong> {shopInfo.phone}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span><strong>WhatsApp:</strong> {shopInfo.whatsapp}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span><strong>Çalışma Saatleri:</strong> Pazartesi - Pazar: 09:00 - 21:00</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleWhatsApp}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp'tan Yazın</span>
              </button>

              <button
                onClick={handleOpenMap}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs border border-gray-300 flex items-center gap-1.5"
              >
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Google Haritalar'da Aç</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gray-100 p-4 rounded-xl border border-gray-200 text-center space-y-3">
            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center border border-gray-300">
              <div className="text-center p-4">
                <MapPin className="w-8 h-8 text-red-600 mx-auto mb-1 animate-bounce" />
                <strong className="text-xs text-gray-900 block font-bold">{shopInfo.shopName} Kadıköy Mağazası</strong>
                <span className="text-[11px] text-gray-500">Kadıköy Rıhtım / Atatürk Caddesi Üzeri</span>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
