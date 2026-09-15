import React, { useState, useEffect } from 'react';
import { X, DollarSign, Check, Trash2, Calculator, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';

export default function QuickCostPriceModal({ phone, onClose, onSuccess }) {
  const [costPrice, setCostPrice] = useState(
    phone && phone.costPrice !== undefined && phone.costPrice !== null ? String(phone.costPrice) : ''
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!phone) return null;

  const sellingPrice = Number(phone.price || 0);
  const parsedCost = (costPrice !== '' && costPrice !== null && !isNaN(Number(costPrice))) ? Number(costPrice) : null;
  
  const calculatedProfit = parsedCost !== null ? (sellingPrice - parsedCost) : null;
  const calculatedMargin = (calculatedProfit !== null && sellingPrice > 0) ? ((calculatedProfit / sellingPrice) * 100).toFixed(1) : null;

  const handleQuickPercent = (discountPercent) => {
    if (!sellingPrice) return;
    const estimatedCost = Math.round(sellingPrice * (1 - discountPercent / 100));
    setCostPrice(String(estimatedCost));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payloadCost = (costPrice !== '' && costPrice !== null && !isNaN(Number(costPrice))) ? Number(costPrice) : null;

    try {
      const res = await api.updatePhone(phone.id, {
        costPrice: payloadCost
      });

      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.message || 'Alış fiyatı kaydedilemedi.');
      }
    } catch (err) {
      setError('Sunucu hatası oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearCost = async () => {
    if (!window.confirm('Bu ilanın alış fiyatını silip boş bırakmak istediğinize emin misiniz? (Kâr grafiğinden çıkarılacaktır)')) return;
    setLoading(true);
    try {
      const res = await api.updatePhone(phone.id, {
        costPrice: null
      });

      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.message || 'Alış fiyatı temizlenemedi.');
      }
    } catch (err) {
      setError('Sunucu hatası oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-emerald-50/70">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-600 text-white shadow-sm">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-gray-900">Alış Fiyatı (Maliyet) Gir</h2>
              <p className="text-[11px] text-gray-500 font-medium">Hızlı kâr & ciro hesabı güncelleme</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
          
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 font-semibold">
              {error}
            </div>
          )}

          {/* Target Phone Card */}
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-3">
            <img
              src={phone.images[0] || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'}
              alt={phone.title}
              className="w-12 h-12 rounded-lg object-cover border border-gray-300"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 line-clamp-1">{phone.title}</h4>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-[11px] text-gray-500">{phone.brand} {phone.model}</span>
                <span className="font-black text-blue-700 text-xs">
                  Satış: {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(sellingPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Cost Price Input Field */}
          <div>
            <label className="block font-bold text-gray-800 mb-1 flex items-center justify-between">
              <span>Alış Fiyatı (Maliyet Tutarınız) (TL) *</span>
              {phone.costPrice && (
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  Mevcut: {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(phone.costPrice)}
                </span>
              )}
            </label>
            <input
              type="number"
              required
              autoFocus
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
              placeholder="Örn: 48000"
              className="w-full px-3.5 py-2.5 bg-emerald-50/50 border-2 border-emerald-400 rounded-xl text-sm font-black text-emerald-900 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-sm"
            />

            {/* Quick Estimator Pills */}
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-gray-500 font-semibold mr-1">Hızlı Tahmini Maliyet:</span>
              {[10, 15, 20, 25].map(pct => {
                const est = Math.round(sellingPrice * (1 - pct / 100));
                return (
                  <button
                    type="button"
                    key={pct}
                    onClick={() => handleQuickPercent(pct)}
                    className="px-2 py-1 rounded bg-gray-100 hover:bg-emerald-100 hover:text-emerald-800 text-[10px] font-bold text-gray-700 border border-gray-200 transition-colors"
                  >
                    -%{pct} ({Math.round(est / 1000)}k)
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Live Profit Feedback */}
          {calculatedProfit !== null && (
            <div className={`p-3 rounded-xl border flex items-center justify-between font-bold text-xs ${
              calculatedProfit >= 0
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}>
              <div>
                <span className="text-[11px] text-gray-500 block font-normal">
                  {calculatedProfit >= 0 ? 'Hesaplanan Net Kâr:' : 'Hesaplanan Zarar:'}
                </span>
                <span className="text-base font-black">
                  {calculatedProfit >= 0 ? `+${calculatedProfit.toLocaleString('tr-TR')} TL` : `${calculatedProfit.toLocaleString('tr-TR')} TL`}
                </span>
              </div>

              {calculatedMargin !== null && (
                <div className="text-right bg-white px-2.5 py-1 rounded-lg border border-emerald-300 shadow-sm">
                  <span className="text-[10px] text-gray-500 block">Kâr Marjı</span>
                  <span className="text-xs font-black text-purple-700">%{calculatedMargin}</span>
                </div>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
            {phone.costPrice ? (
              <button
                type="button"
                onClick={handleClearCost}
                disabled={loading}
                className="px-3 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-700 font-bold text-xs transition-colors flex items-center gap-1"
                title="Alış Fiyatını Boş Bırak"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Maliyeti Sil</span>
              </button>
            ) : <div></div>}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold text-xs transition-colors"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{loading ? 'Kaydediliyor...' : 'Maliyeti Kaydet'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
