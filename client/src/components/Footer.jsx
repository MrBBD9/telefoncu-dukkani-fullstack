import React from 'react';
import { Smartphone, ShieldCheck, MapPin, Phone, MessageSquare, Clock, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const { shopInfo, setIsLoginModalOpen, isAdmin, setIsAdminOpen } = useAuth();

  return (
    <footer className="mt-12 bg-white border-t border-slate-200 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Col 1: Shop Brand (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <Smartphone className="w-5 h-5" />
              </div>
              <span className="text-base font-extrabold text-slate-900">
                {shopInfo.shopName}
              </span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed max-w-sm">
              Mağazamızda satışa sunulan tüm sıfır ve ikinci el cep telefonları teknik ekibimiz tarafından test edilmiş, %100 orijinal cihazlardır.
            </p>
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Dükkanımızdan Garantili İkinci El Cihazlar</span>
            </div>
          </div>

          {/* Col 2: Store Info (4 cols) */}
          <div className="md:col-span-4 space-y-2.5">
            <h4 className="text-slate-900 font-bold text-sm">Mağaza İletişim & Adres</h4>
            
            <div className="flex items-start gap-2 text-slate-600">
              <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>{shopInfo.address}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-600">
              <Phone className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>{shopInfo.phone}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-600">
              <MessageSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>WhatsApp: {shopInfo.whatsapp}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-500">
              <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>Haftanın 7 Günü: 09:00 - 21:00</span>
            </div>
          </div>

          {/* Col 3: Quick Admin Access (3 cols) */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-slate-900 font-bold text-sm">Mağaza Sahibi Paneli</h4>
            <p className="text-slate-500 text-xs">
              Yeni telefon ilanı eklemek veya var olan ilanları yönetmek için dükkan sahibi panelinize giriş yapabilirsiniz.
            </p>
            {isAdmin ? (
              <button
                onClick={() => setIsAdminOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs shadow-sm hover:bg-blue-700 transition-colors"
              >
                <span>Yönetim Paneline Git</span>
              </button>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-semibold text-xs transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                <span>Yönetici Girişi Yap</span>
              </button>
            )}
          </div>

        </div>

        <div className="mt-8 pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-2">
          <p>© {new Date().getFullYear()} {shopInfo.shopName}. Tüm hakları saklıdır.</p>
          <p>Sade & Kullanışlı Telefoncu Dükkan Vitrini</p>
        </div>
      </div>
    </footer>
  );
}
