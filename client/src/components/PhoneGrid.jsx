import React from 'react';
import PhoneCard from './PhoneCard';
import { Frown, RotateCcw } from 'lucide-react';

export default function PhoneGrid({
  phones,
  loading,
  onSelectPhone,
  onResetFilters,
  compareList = [],
  onToggleCompare
}) {
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="bg-white rounded-xl p-4 h-96 animate-pulse border border-slate-200 flex flex-col justify-between">
              <div className="w-full h-44 bg-slate-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-200/60 rounded w-1/2 mb-4"></div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="h-8 bg-slate-100 rounded"></div>
                <div className="h-8 bg-slate-100 rounded"></div>
              </div>
              <div className="h-9 bg-slate-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (phones.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="bg-white max-w-md mx-auto p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-500">
            <Frown className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">İlan Bulunamadı</h3>
          <p className="text-xs text-slate-500 mb-5">
            Arama kriterlerinize uygun hiçbir telefon ilanı eşleşmedi. Filtreleri temizleyerek tekrar deneyebilirsiniz.
          </p>
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Filtreleri Sıfırla</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {phones.map(phone => (
          <PhoneCard
            key={phone.id}
            phone={phone}
            onSelectPhone={onSelectPhone}
            isCompared={compareList.some(p => p.id === phone.id)}
            onToggleCompare={onToggleCompare}
          />
        ))}
      </div>
    </div>
  );
}
