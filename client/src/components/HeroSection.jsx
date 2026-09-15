import React from 'react';
import { Search, ArrowUpDown, RotateCcw } from 'lucide-react';

const BRANDS = ['Tümü', 'Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Honor', 'Oppo'];
const STATUSES = ['Tümü', 'Sıfır', 'İkinci El', 'Yenilenmiş'];

export default function HeroSection({
  search,
  setSearch,
  selectedBrand,
  setSelectedBrand,
  selectedStatus,
  setSelectedStatus,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  sort,
  setSort,
  totalCount,
  onResetFilters
}) {
  return (
    <div className="pt-5 pb-3 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Search & Filter Container */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-3.5">
        
        {/* Search Bar & Sort */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
          
          <div className="md:col-span-8 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Telefon modeli veya marka yazın... (Örn: iPhone 15 Pro, Samsung S24 Ultra)"
              className="block w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 text-xs focus:outline-none focus:border-blue-600 focus:bg-white"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-500 hover:text-gray-800"
              >
                Temizle
              </button>
            )}
          </div>

          <div className="md:col-span-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ArrowUpDown className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="block w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 text-xs font-medium focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value="newest">En Yeni İlanlar</option>
              <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
              <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
              <option value="oldest">En Eski İlanlar</option>
            </select>
          </div>

        </div>

        {/* Brand Selector Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-bold text-gray-500 mr-1 uppercase">Marka:</span>
          {BRANDS.map(brand => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                selectedBrand === brand
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>

        {/* Status Filter & Price */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2.5 border-t border-gray-100">
          
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-gray-500 mr-1 uppercase">Durumu:</span>
            {STATUSES.map(status => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  selectedStatus === status
                    ? 'bg-gray-900 text-white font-bold'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Price Range Filter Inputs */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-gray-500 uppercase text-[11px]">Fiyat:</span>
            <input
              type="number"
              placeholder="Min ₺"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-20 px-2 py-1 bg-gray-50 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Maks ₺"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-20 px-2 py-1 bg-gray-50 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
            />

            {(search || selectedBrand !== 'Tümü' || selectedStatus !== 'Tümü' || minPrice || maxPrice) && (
              <button
                onClick={onResetFilters}
                className="flex items-center gap-1 text-xs text-slate-700 hover:text-gray-900 ml-1 font-bold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Sıfırla
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Summary */}
      <div className="flex items-center justify-between mt-3 px-1 text-xs font-semibold text-gray-600">
        <span>Vitrinde Toplam <strong>{totalCount}</strong> İlan Bulunmaktadır</span>
      </div>

    </div>
  );
}
