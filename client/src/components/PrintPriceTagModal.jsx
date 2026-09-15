import React from 'react';
import { Printer, X, Smartphone, ShieldCheck, Battery, HardDrive, Cpu, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function PrintPriceTagModal({ phone, onClose }) {
  const { shopInfo } = useAuth();

  if (!phone) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(price);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in print:bg-white print:p-0 print:static">
      
      <div className="relative w-full max-w-lg bg-white border border-gray-300 rounded-2xl shadow-xl overflow-hidden p-6 print:border-none print:shadow-none print:max-w-none print:w-full">
        
        {/* Actions (Hidden when printing) */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200 print:hidden">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
            <Printer className="w-4 h-4 text-blue-600" />
            <span>Mağaza Vitrin Etiketi Yazdır</span>
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Etiketi Yazdır / PDF İndir</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:text-gray-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PRINTABLE STORE PHYSICAL DISPLAY TAG CARD */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-white space-y-4 print:border-2 print:border-solid print:border-black">
          
          {/* Header Tag */}
          <div className="flex items-center justify-between border-b pb-3 border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gray-900 text-white flex items-center justify-center font-bold">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-sm font-black text-gray-900 block leading-none">{shopInfo.shopName}</strong>
                <span className="text-[10px] text-gray-500 font-semibold uppercase">Orijinal İkinci El & Sıfır Vitrin Etiketi</span>
              </div>
            </div>

            <span className="px-2 py-1 rounded bg-gray-900 text-white font-bold text-xs uppercase">
              {phone.status}
            </span>
          </div>

          {/* Phone Title */}
          <div>
            <h3 className="text-lg font-black text-gray-900 leading-tight">
              {phone.title}
            </h3>
            <span className="text-xs text-gray-500 font-bold">{phone.brand} {phone.model}</span>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded bg-gray-50 border border-gray-200">
              <span className="text-gray-500 text-[10px] block font-semibold">Hafıza</span>
              <strong className="text-gray-900 font-bold">{phone.storage}</strong>
            </div>

            <div className="p-2 rounded bg-gray-50 border border-gray-200">
              <span className="text-gray-500 text-[10px] block font-semibold">RAM Bellek</span>
              <strong className="text-gray-900 font-bold">{phone.ram || '-'}</strong>
            </div>

            {phone.batteryHealth && (
              <div className="p-2 rounded bg-emerald-50 border border-emerald-200">
                <span className="text-emerald-800 text-[10px] block font-semibold">Pil Sağlığı (BTY)</span>
                <strong className="text-emerald-800 font-bold">%{phone.batteryHealth}</strong>
              </div>
            )}

            <div className="p-2 rounded bg-gray-50 border border-gray-200">
              <span className="text-gray-500 text-[10px] block font-semibold">Garanti Durumu</span>
              <strong className="text-blue-700 font-bold">{phone.warrantyStatus || 'Mağaza Garantili'}</strong>
            </div>
          </div>

          {/* Accessories */}
          {phone.accessories && phone.accessories.length > 0 && (
            <div className="text-[11px] text-gray-700">
              <span className="font-bold text-gray-500 block mb-1">Aksesuarlar:</span>
              <div className="flex flex-wrap gap-1">
                {phone.accessories.map((acc, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-gray-100 border border-gray-200 font-semibold">
                    ✓ {acc}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Price Box */}
          <div className="p-4 rounded-xl bg-gray-900 text-white flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Nakit / İndirimli Fiyat</span>
              <span className="text-2xl font-black text-emerald-400">{formatPrice(phone.price)}</span>
            </div>
            <div className="text-right text-[10px] text-gray-300">
              <span>İletişim: {shopInfo.phone}</span>
              <span className="block font-bold text-white">Kadıköy / İstanbul</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
