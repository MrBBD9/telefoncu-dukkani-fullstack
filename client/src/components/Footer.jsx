import React from 'react';
import { Smartphone, ShieldCheck, MapPin, Phone, MessageSquare, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const { shopInfo } = useAuth();

  return (
    <footer className="mt-12 bg-white border-t border-slate-200 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Col 1: Shop Brand (6 cols) */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm font-black">
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
              <span>Dükkanımızdan 3 Ay Garantili İkinci El Cihazlar</span>
            </div>
          </div>

          {/* Col 2: Store Info (6 cols) */}
          <div className="md:col-span-6 space-y-2.5">
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

        </div>

        <div className="mt-8 pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-2">
          <p>© {new Date().getFullYear()} {shopInfo.shopName}. Tüm hakları saklıdır.</p>
          <p>Sade & Kullanışlı Telefoncu Dükkan Vitrini ve Servisi</p>
        </div>
      </div>
    </footer>
  );
}
