import React from 'react';
import { Battery, ShieldCheck, HardDrive, Cpu, Eye, MessageSquare, ChevronRight, ArrowRightLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getImageUrl, DEFAULT_PHONE_IMAGE } from '../services/api';

export default function PhoneCard({ phone, onSelectPhone, isCompared, onToggleCompare }) {
  const { shopInfo } = useAuth();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(price);
  };

  const rawImage = phone.images && phone.images.length > 0 ? phone.images[0] : null;
  const mainImage = getImageUrl(rawImage);

  const handleWhatsAppDirect = (e) => {
    e.stopPropagation();
    const cleanNumber = shopInfo.whatsapp.replace(/\D/g, '');
    const message = `Merhaba, vitrininizdeki "${phone.title}" (${formatPrice(phone.price)}) ilanı hakkında bilgi almak istiyorum.`;
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCompareClick = (e) => {
    e.stopPropagation();
    onToggleCompare(phone);
  };

  return (
    <div
      onClick={() => onSelectPhone(phone)}
      className={`group bg-white rounded-lg border transition-all duration-150 cursor-pointer flex flex-col h-full relative ${
        isCompared ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md' : 'border-gray-200 hover:border-blue-500 hover:shadow-md'
      }`}
    >
      
      {/* Image Header Container */}
      <div className="relative w-full h-48 bg-gray-50 overflow-hidden flex items-center justify-center border-b border-gray-100">
        
        <img
          src={mainImage}
          alt={phone.title}
          className={`w-full h-full object-cover transition-transform duration-200 group-hover:scale-105 ${phone.isSold ? 'grayscale opacity-50' : ''}`}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_PHONE_IMAGE;
          }}
        />

        {/* Top Status Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
          
          {phone.isSold ? (
            <span className="px-2 py-0.5 rounded bg-gray-800 text-white font-extrabold text-[10px] uppercase shadow">
              SATILDI
            </span>
          ) : (
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold shadow-sm ${
              phone.status === 'Sıfır'
                ? 'bg-emerald-600 text-white'
                : phone.status === 'Yenilenmiş'
                ? 'bg-amber-600 text-white'
                : 'bg-blue-600 text-white'
            }`}>
              {phone.status}
            </span>
          )}

          <span className="px-2 py-0.5 rounded bg-gray-900/80 text-white text-[10px] font-bold">
            {phone.brand}
          </span>
        </div>

        {/* Compare Checkbox Button on Image */}
        <button
          onClick={handleCompareClick}
          className={`absolute bottom-2 left-2 z-10 px-2 py-0.5 rounded text-[10px] font-bold border transition-all flex items-center gap-1 ${
            isCompared ? 'bg-blue-600 text-white border-blue-600' : 'bg-white/90 text-gray-700 border-gray-200 hover:bg-gray-100'
          }`}
          title="Kıyaslamak için seç"
        >
          <ArrowRightLeft className="w-3 h-3" />
          <span>{isCompared ? 'Kıyaslanıyor' : 'Kıyasla'}</span>
        </button>

        {/* View Count Pill */}
        <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1 text-[10px] text-gray-700 bg-white/90 px-1.5 py-0.5 rounded border border-gray-200">
          <Eye className="w-3 h-3 text-gray-500" />
          <span>{phone.views || 0}</span>
        </div>

      </div>

      {/* Card Content Body */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
        
        <div>
          {/* Title */}
          <h3 className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
            {phone.title}
          </h3>

          {/* Key Specs */}
          <div className="grid grid-cols-2 gap-1 mt-2 text-[11px] text-gray-600">
            
            <div className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
              <HardDrive className="w-3 h-3 text-gray-500 flex-shrink-0" />
              <span className="truncate font-semibold">{phone.storage}</span>
            </div>

            {phone.ram && (
              <div className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                <Cpu className="w-3 h-3 text-gray-500 flex-shrink-0" />
                <span className="truncate font-semibold">{phone.ram} RAM</span>
              </div>
            )}

            {phone.batteryHealth && (
              <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 col-span-2">
                <Battery className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                <span>Pil: <strong className="text-emerald-700">%{phone.batteryHealth}</strong></span>
              </div>
            )}

            {phone.warrantyStatus && (
              <div className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded border border-gray-200 col-span-2">
                <ShieldCheck className="w-3 h-3 text-blue-600 flex-shrink-0" />
                <span className="truncate text-gray-600 font-medium">{phone.warrantyStatus}</span>
              </div>
            )}

          </div>
        </div>

        {/* Footer: Price & Actions */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
          <div>
            {phone.originalPrice && phone.originalPrice > phone.price && (
              <span className="text-[10px] text-gray-400 line-through block font-semibold">
                {formatPrice(phone.originalPrice)}
              </span>
            )}
            <span className="text-base font-extrabold text-blue-700 tracking-tight">
              {formatPrice(phone.price)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {!phone.isSold && (
              <button
                onClick={handleWhatsAppDirect}
                title="WhatsApp ile Sor"
                className="p-1 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all border border-emerald-200"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => onSelectPhone(phone)}
              className="flex items-center gap-0.5 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all"
            >
              <span>İncele</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
