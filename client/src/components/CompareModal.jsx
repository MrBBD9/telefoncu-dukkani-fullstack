import React from 'react';
import { X, ArrowRightLeft, Smartphone, Check, ShieldCheck, Battery, HardDrive, Cpu, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CompareModal({ comparePhones, onRemoveFromCompare, onClose }) {
  const { shopInfo } = useAuth();

  if (!comparePhones || comparePhones.length === 0) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(price);
  };

  const handleWhatsApp = (phone) => {
    const cleanNumber = shopInfo.whatsapp.replace(/\D/g, '');
    const message = `Merhaba, Karşılaştırma ekranından "${phone.title}" (${formatPrice(phone.price)}) cihazınızı satın almak istiyorum.`;
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-5xl bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Telefon Karşılaştırma Ekranı</h2>
              <p className="text-xs text-gray-500">Seçtiğiniz {comparePhones.length} cihazı yan yana inceleyin</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Table Body */}
        <div className="p-6 overflow-y-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr>
                  <th className="p-3 w-44 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">
                    Özellikler
                  </th>
                  {comparePhones.map(phone => (
                    <th key={phone.id} className="p-4 border-b border-gray-200 text-center relative bg-white">
                      <button
                        onClick={() => onRemoveFromCompare(phone.id)}
                        className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 text-gray-500 hover:text-red-600 hover:bg-red-50"
                        title="Karşılaştırmadan Çıkar"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      <div className="w-24 h-24 mx-auto rounded-lg overflow-hidden border border-gray-200 mb-2">
                        <img src={phone.images[0]} alt={phone.title} className="w-full h-full object-cover" />
                      </div>

                      <span className="font-bold text-gray-900 text-xs line-clamp-2 block mb-1">
                        {phone.title}
                      </span>
                      <span className="text-sm font-extrabold text-blue-700 block">
                        {formatPrice(phone.price)}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-xs">
                
                {/* Brand & Model */}
                <tr>
                  <td className="p-3 font-bold bg-gray-50 text-gray-700">Marka / Model</td>
                  {comparePhones.map(p => (
                    <td key={p.id} className="p-3 text-center font-semibold text-gray-900">
                      {p.brand} {p.model}
                    </td>
                  ))}
                </tr>

                {/* Status */}
                <tr>
                  <td className="p-3 font-bold bg-gray-50 text-gray-700">Cihaz Durumu</td>
                  {comparePhones.map(p => (
                    <td key={p.id} className="p-3 text-center font-bold">
                      <span className={`px-2 py-0.5 rounded text-[11px] ${
                        p.status === 'Sıfır' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Storage */}
                <tr>
                  <td className="p-3 font-bold bg-gray-50 text-gray-700">Depolama Hafızası</td>
                  {comparePhones.map(p => (
                    <td key={p.id} className="p-3 text-center font-bold text-gray-900">
                      {p.storage}
                    </td>
                  ))}
                </tr>

                {/* RAM */}
                <tr>
                  <td className="p-3 font-bold bg-gray-50 text-gray-700">RAM Bellek</td>
                  {comparePhones.map(p => (
                    <td key={p.id} className="p-3 text-center font-bold text-gray-900">
                      {p.ram || '-'}
                    </td>
                  ))}
                </tr>

                {/* Battery Health */}
                <tr>
                  <td className="p-3 font-bold bg-gray-50 text-gray-700">Pil Sağlığı (%)</td>
                  {comparePhones.map(p => (
                    <td key={p.id} className="p-3 text-center font-bold text-emerald-700">
                      {p.batteryHealth ? `%${p.batteryHealth}` : '-'}
                    </td>
                  ))}
                </tr>

                {/* Cosmetic Rating */}
                <tr>
                  <td className="p-3 font-bold bg-gray-50 text-gray-700">Kozmetik Puanı</td>
                  {comparePhones.map(p => (
                    <td key={p.id} className="p-3 text-center font-bold text-gray-900">
                      {p.cosmeticRating || '9.5 / 10'}
                    </td>
                  ))}
                </tr>

                {/* Warranty */}
                <tr>
                  <td className="p-3 font-bold bg-gray-50 text-gray-700">Garanti Durumu</td>
                  {comparePhones.map(p => (
                    <td key={p.id} className="p-3 text-center font-medium text-blue-700">
                      {p.warrantyStatus || 'Yok'}
                    </td>
                  ))}
                </tr>

                {/* Screen Specs */}
                <tr>
                  <td className="p-3 font-bold bg-gray-50 text-gray-700">Ekran Özelliği</td>
                  {comparePhones.map(p => (
                    <td key={p.id} className="p-3 text-center text-gray-600 text-[11px]">
                      {p.screen || 'AMOLED / Retina'}
                    </td>
                  ))}
                </tr>

                {/* Processor */}
                <tr>
                  <td className="p-3 font-bold bg-gray-50 text-gray-700">İşlemci</td>
                  {comparePhones.map(p => (
                    <td key={p.id} className="p-3 text-center font-semibold text-gray-800">
                      {p.processor || 'A-Serisi / Snapdragon'}
                    </td>
                  ))}
                </tr>

                {/* Action Row */}
                <tr>
                  <td className="p-3 font-bold bg-gray-50 text-gray-700">Satın Al / Sor</td>
                  {comparePhones.map(p => (
                    <td key={p.id} className="p-3 text-center">
                      <button
                        onClick={() => handleWhatsApp(p)}
                        className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp ile İste</span>
                      </button>
                    </td>
                  ))}
                </tr>

              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
