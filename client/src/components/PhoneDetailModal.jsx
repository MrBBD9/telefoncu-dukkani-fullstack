import React, { useState, useEffect } from 'react';
import {
  X, MessageSquare, Phone, ShieldCheck, Battery, HardDrive, Cpu,
  CheckCircle2, MapPin, Share2, Smartphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function PhoneDetailModal({ phoneId, onClose }) {
  const { shopInfo } = useAuth();
  const [phone, setPhone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!phoneId) return;
    setLoading(true);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      
      {/* Container */}
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden my-6 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 bg-slate-50 sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
              <Smartphone className="w-5 h-5" />
            </span>
            <div>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">İlan Detayı</span>
              <span className="text-xs font-mono text-slate-600">İlan Kodu: #{phone?.id || '...'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors text-xs font-semibold flex items-center gap-1.5"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copied ? 'Kopyalandı!' : 'Paylaş'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        {loading || !phone ? (
          <div className="p-12 text-center text-slate-500 animate-pulse">
            İlan detayları yükleniyor...
          </div>
        ) : (
          <div className="p-6 overflow-y-auto space-y-6">
            
            {/* Top Grid: Gallery & Quick Purchase Info */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Photo Gallery (7 cols) */}
              <div className="lg:col-span-7 space-y-3">
                
                {/* Main Large Image */}
                <div className="relative w-full h-72 sm:h-88 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center">
                  <img
                    src={phone.images[activeImageIndex] || phone.images[0]}
                    alt={phone.title}
                    className={`w-full h-full object-cover ${phone.isSold ? 'grayscale opacity-60' : ''}`}
                  />
                  {phone.isSold && (
                    <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                      <span className="px-5 py-2 bg-red-600 text-white font-extrabold text-base rounded-lg shadow uppercase">
                        BU CİHAZ SATILDI
                      </span>
                    </div>
                  )}
                </div>

                {/* Thumbnail Selector */}
                {phone.images && phone.images.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {phone.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-18 h-18 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                          activeImageIndex === idx ? 'border-blue-600 shadow-sm scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

              </div>

              {/* Purchase Details Card (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
                
                <div className="space-y-3">
                  {/* Badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-bold">
                      {phone.brand}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                      phone.status === 'Sıfır' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {phone.status}
                    </span>
                    {phone.warrantyStatus && (
                      <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-semibold">
                        {phone.warrantyStatus}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="text-lg font-bold text-slate-900 leading-snug">
                    {phone.title}
                  </h2>

                  {/* Price Box */}
                  <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                    <span className="text-[11px] text-blue-700 font-bold uppercase block">Fiyat</span>
                    <span className="text-2xl font-extrabold text-blue-700">
                      {formatPrice(phone.price)}
                    </span>
                  </div>

                  {/* Quick Features List */}
                  <div className="space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <HardDrive className="w-3.5 h-3.5 text-blue-600" /> Dahili Hafıza
                      </span>
                      <strong className="text-slate-900">{phone.storage}</strong>
                    </div>

                    {phone.ram && (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <Cpu className="w-3.5 h-3.5 text-blue-600" /> RAM Bellek
                        </span>
                        <strong className="text-slate-900">{phone.ram}</strong>
                      </div>
                    )}

                    {phone.batteryHealth && (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                        <span className="flex items-center gap-1.5 text-emerald-800">
                          <Battery className="w-3.5 h-3.5 text-emerald-600" /> Pil Sağlığı (BTY)
                        </span>
                        <strong className="text-emerald-800 font-bold">%{phone.batteryHealth}</strong>
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
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-200 transition-all"
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
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Teknik Özellikler ve Cihaz Durumu</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                
                <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500">Marka / Model</span>
                  <span className="font-semibold text-slate-900">{phone.brand} {phone.model}</span>
                </div>

                <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500">Cihaz Durumu</span>
                  <span className="font-semibold text-slate-900">{phone.status}</span>
                </div>

                <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500">Renk</span>
                  <span className="font-semibold text-slate-900">{phone.color || 'Belirtilmedi'}</span>
                </div>

                <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500">Garanti Durumu</span>
                  <span className="font-semibold text-blue-700">{phone.warrantyStatus || 'Yok'}</span>
                </div>

              </div>
            </div>

            {/* Accessories Checklist */}
            {phone.accessories && phone.accessories.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
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
              <div className="space-y-2 pt-3 border-t border-slate-200">
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  İlan Açıklaması
                </h4>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs leading-relaxed whitespace-pre-line">
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
    </div>
  );
}
