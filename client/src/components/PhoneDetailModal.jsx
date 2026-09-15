import React, { useState, useEffect } from 'react';
import {
  X, MessageSquare, Phone, ShieldCheck, Battery, HardDrive, Cpu,
  CheckCircle2, MapPin, Share2, Smartphone, ChevronLeft, ChevronRight, Maximize2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api, getImageUrl, DEFAULT_PHONE_IMAGE } from '../services/api';

export default function PhoneDetailModal({ phoneId, onClose }) {
  const { shopInfo } = useAuth();
  const [phone, setPhone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  useEffect(() => {
    if (!phoneId) return;
    setLoading(true);
    setActiveImageIndex(0);
    api.getPhoneById(phoneId)
      .then(res => {
        if (res.success) {
          setPhone(res.phone);
        }
      })
      .catch(err => console.error('Fetch detail error:', err))
      .finally(() => setLoading(false));
  }, [phoneId]);

  if (!phoneId) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(price);
  };

  const handleWhatsApp = () => {
    if (!phone) return;
    const cleanNumber = shopInfo.whatsapp.replace(/\D/g, '');
    const message = `Merhaba ${shopInfo.shopName}, vitrininizdeki "${phone.title}" (${formatPrice(phone.price)}) ilanınız hakkında bilgi almak istiyorum. Stokta mevcut mu?`;
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const imagesList = phone && Array.isArray(phone.images) && phone.images.length > 0
    ? phone.images.filter(img => img && typeof img === 'string' && img.trim() !== '')
    : [DEFAULT_PHONE_IMAGE];

  const currentImage = getImageUrl(imagesList[activeImageIndex] || imagesList[0]);

  const handlePrevImage = (e) => {
    e?.stopPropagation();
    setActiveImageIndex(prev => (prev === 0 ? imagesList.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e?.stopPropagation();
    setActiveImageIndex(prev => (prev === imagesList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      
      {/* Container */}
      <div className="relative w-full max-w-4xl bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden my-6 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-200 bg-gray-50 sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
              <Smartphone className="w-5 h-5" />
            </span>
            <div>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">İlan Detayı</span>
              <span className="text-xs font-mono text-gray-600">İlan Kodu: #{phone?.id || '...'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors text-xs font-semibold flex items-center gap-1.5"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copied ? 'Kopyalandı!' : 'Paylaş'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        {loading || !phone ? (
          <div className="p-12 text-center text-gray-500 animate-pulse">
            İlan detayları yükleniyor...
          </div>
        ) : (
          <div className="p-6 overflow-y-auto space-y-6">
            
            {/* Top Grid: Gallery & Quick Purchase Info */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Photo Gallery (7 cols) */}
              <div className="lg:col-span-7 space-y-3">
                
                {/* Main Large Image Container */}
                <div className="relative w-full h-72 sm:h-88 rounded-xl bg-gray-100 overflow-hidden border border-gray-200 flex items-center justify-center group">
                  
                  <img
                    src={currentImage}
                    alt={phone.title}
                    className={`w-full h-full object-cover cursor-zoom-in transition-transform duration-300 group-hover:scale-105 ${phone.isSold ? 'grayscale opacity-60' : ''}`}
                    onClick={() => setIsZoomOpen(true)}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_PHONE_IMAGE;
                    }}
                  />

                  {/* Zoom Fullscreen Trigger Badge */}
                  <button
                    onClick={() => setIsZoomOpen(true)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/90 text-gray-700 hover:bg-white shadow-sm border border-gray-200 text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Büyütmek için tıklayın"
                  >
                    <Maximize2 className="w-4 h-4 text-blue-600" />
                    <span className="hidden sm:inline">Büyüt</span>
                  </button>

                  {/* Left / Right Next Image Arrows */}
                  {imagesList.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md border border-gray-200 transition-all opacity-80 hover:opacity-100"
                        title="Önceki Fotoğraf"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md border border-gray-200 transition-all opacity-80 hover:opacity-100"
                        title="Sonraki Fotoğraf"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {phone.isSold && (
                    <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center pointer-events-none">
                      <span className="px-5 py-2 bg-red-600 text-white font-extrabold text-base rounded-lg shadow uppercase">
                        BU CİHAZ SATILDI
                      </span>
                    </div>
                  )}

                </div>

                {/* Thumbnail Selector */}
                {imagesList.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
                    {imagesList.map((img, idx) => {
                      const thumbUrl = getImageUrl(img);
                      return (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 bg-gray-100 ${
                            activeImageIndex === idx ? 'border-blue-600 shadow-sm scale-105' : 'border-gray-200 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={thumbUrl}
                            alt={`Foto ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = DEFAULT_PHONE_IMAGE;
                            }}
                          />
                        </button>
                      );
                    })}
                  </div>
                )}

              </div>

              {/* Purchase Details Card (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                
                <div className="space-y-3">
                  {/* Badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-bold">
                      {phone.brand}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                      phone.status === 'Sıfır' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {phone.status}
                    </span>
                    {phone.warrantyStatus && (
                      <span className="px-2.5 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-semibold">
                        {phone.warrantyStatus}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="text-lg font-bold text-gray-900 leading-snug">
                    {phone.title}
                  </h2>

                  {/* Price Box */}
                  <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                    <span className="text-[11px] text-blue-700 font-bold uppercase block">Fiyat</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-blue-700">
                        {formatPrice(phone.price)}
                      </span>
                      {phone.originalPrice && phone.originalPrice > phone.price && (
                        <span className="text-xs text-gray-400 line-through font-semibold">
                          {formatPrice(phone.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quick Features List */}
                  <div className="space-y-1.5 text-xs text-gray-700">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-200">
                      <span className="flex items-center gap-1.5 text-gray-500">
                        <HardDrive className="w-3.5 h-3.5 text-blue-600" /> Dahili Hafıza
                      </span>
                      <strong className="text-gray-900">{phone.storage}</strong>
                    </div>

                    {phone.ram && (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-200">
                        <span className="flex items-center gap-1.5 text-gray-500">
                          <Cpu className="w-3.5 h-3.5 text-blue-600" /> RAM Bellek
                        </span>
                        <strong className="text-gray-900">{phone.ram}</strong>
                      </div>
                    )}

                    {phone.batteryHealth && (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                        <span className="flex items-center gap-1.5 text-emerald-800 font-medium">
                          <Battery className="w-3.5 h-3.5 text-emerald-600" /> Pil Sağlığı (BTY)
                        </span>
                        <strong className="text-emerald-800 font-bold">%{phone.batteryHealth}</strong>
                      </div>
                    )}

                    {phone.cosmeticRating && (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-200">
                        <span className="text-gray-500">Kozmetik Puanı</span>
                        <strong className="text-gray-900">{phone.cosmeticRating}</strong>
                      </div>
                    )}
                  </div>
                </div>

                {/* Call to Actions */}
                <div className="space-y-2 pt-1">
                  {!phone.isSold ? (
                    <>
                      <button
                        onClick={handleWhatsApp}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                      >
                        <MessageSquare className="w-4 h-4 fill-white/20" />
                        <span>WhatsApp ile İletişime Geç</span>
                      </button>

                      <a
                        href={`tel:${shopInfo.phone.replace(/\s+/g, '')}`}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs border border-gray-200 transition-all"
                      >
                        <Phone className="w-4 h-4 text-blue-600" />
                        <span>Dükkanı Ara: {shopInfo.phone}</span>
                      </a>
                    </>
                  ) : (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-center font-bold">
                      Bu cihaz satılmıştır.
                    </div>
                  )}
                </div>

              </div>

            </div>

            {/* Middle Section: Technical Specifications Table */}
            <div className="space-y-3 pt-3 border-t border-gray-200">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Teknik Özellikler ve Cihaz Durumu</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                
                <div className="flex justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                  <span className="text-gray-500">Marka / Model</span>
                  <span className="font-semibold text-gray-900">{phone.brand} {phone.model}</span>
                </div>

                <div className="flex justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                  <span className="text-gray-500">Cihaz Durumu</span>
                  <span className="font-semibold text-gray-900">{phone.status}</span>
                </div>

                <div className="flex justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                  <span className="text-gray-500">Renk</span>
                  <span className="font-semibold text-gray-900">{phone.color || 'Belirtilmedi'}</span>
                </div>

                <div className="flex justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                  <span className="text-gray-500">Garanti Durumu</span>
                  <span className="font-semibold text-blue-700">{phone.warrantyStatus || 'Yok'}</span>
                </div>

                {phone.screen && (
                  <div className="flex justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                    <span className="text-gray-500">Ekran Özellikleri</span>
                    <span className="font-semibold text-gray-900">{phone.screen}</span>
                  </div>
                )}

                {phone.processor && (
                  <div className="flex justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                    <span className="text-gray-500">İşlemci</span>
                    <span className="font-semibold text-gray-900">{phone.processor}</span>
                  </div>
                )}

              </div>
            </div>

            {/* Accessories Checklist */}
            {phone.accessories && phone.accessories.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Yanında Verilecek Aksesuarlar
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {phone.accessories.map((acc, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{acc}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description Text */}
            {phone.description && (
              <div className="space-y-2 pt-3 border-t border-gray-200">
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  İlan Açıklaması
                </h4>
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 text-xs leading-relaxed whitespace-pre-line">
                  {phone.description}
                </div>
              </div>
            )}

            {/* Store Location Footer Note */}
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-2.5 text-xs text-blue-900">
              <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-blue-900 mb-0.5">Mağaza Adresi</strong>
                <span>{shopInfo.address}</span>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* FULLSCREEN LIGHTBOX PHOTO ZOOM MODAL */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 animate-fade-in">
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {imagesList.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <img
            src={currentImage}
            alt={phone?.title}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = DEFAULT_PHONE_IMAGE;
            }}
          />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-xs bg-black/60 px-4 py-1.5 rounded-full backdrop-blur-md">
            Fotoğraf {activeImageIndex + 1} / {imagesList.length}
          </div>
        </div>
      )}

    </div>
  );
}
