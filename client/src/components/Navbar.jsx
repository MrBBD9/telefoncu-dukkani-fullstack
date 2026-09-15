import React from 'react';
import { Smartphone, ShieldCheck, Phone, MessageSquare, RefreshCw, ArrowRightLeft, Store, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({
  activeTab,
  onSelectTab,
  onOpenTradeIn,
  compareCount,
  onOpenCompare
}) {
  const { isAdmin, setIsAdminOpen, logout, shopInfo } = useAuth();

  const handleWhatsAppClick = () => {
    const cleanNumber = shopInfo.whatsapp.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent('Merhaba, vitrininizdeki telefon ilanları hakkında bilgi almak istiyorum.')}`, '_blank');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      
      {/* Top Mini Ticker Bar */}
      <div className="bg-gray-900 text-gray-200 py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{shopInfo.shopName} - Orijinal & Garantili İkinci El ve Sıfır Telefon Vitrini</span>
          </div>
          
          <div className="flex items-center gap-4 text-[11px] text-gray-300">
            <button
              onClick={onOpenTradeIn}
              className="flex items-center gap-1 text-emerald-400 font-bold hover:underline"
            >
              <RefreshCw className="w-3 h-3 animate-spin-slow" />
              <span>Eski Telefonunu Sat / Takas Yap</span>
            </button>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">Çalışma Saatleri: 09:00 - 21:00</span>

            {/* If Admin logged in, show subtle dashboard shortcut */}
            {isAdmin && (
              <button
                onClick={() => setIsAdminOpen(true)}
                className="text-amber-400 font-bold flex items-center gap-1 hover:underline ml-2"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Yönetim Portalı</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        
        {/* Brand Logo & Public Page Tabs */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab('storefront')}>
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black shadow-sm">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black text-gray-900 tracking-tight block leading-none">
                {shopInfo.shopName}
              </span>
              <span className="text-[11px] text-gray-500 font-semibold">Telefoncu Vitrini & Servis</span>
            </div>
          </div>

          {/* Public Page Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 border-l border-gray-200 pl-6">
            <button
              onClick={() => onSelectTab('storefront')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'storefront'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Telefon Vitrini</span>
            </button>

            <button
              onClick={() => onSelectTab('shop-intro')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'shop-intro'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Mağazamız & Hakkımızda</span>
            </button>
          </nav>
        </div>

        {/* Center & Right Public Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Mobile Tab Switcher */}
          <div className="flex md:hidden items-center gap-1 mr-1">
            <button
              onClick={() => onSelectTab('storefront')}
              className={`px-2.5 py-1 rounded text-xs font-bold ${
                activeTab === 'storefront' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Vitrin
            </button>
            <button
              onClick={() => onSelectTab('shop-intro')}
              className={`px-2.5 py-1 rounded text-xs font-bold ${
                activeTab === 'shop-intro' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Hakkımızda
            </button>
          </div>

          {/* Compare Counter Button */}
          {compareCount > 0 && (
            <button
              onClick={onOpenCompare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 font-bold text-xs transition-colors"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
              <span>Karşılaştır ({compareCount})</span>
            </button>
          )}

          {/* Trade In Button */}
          <button
            onClick={onOpenTradeIn}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 transition-colors text-xs font-bold"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
            <span>Takas Hesabı</span>
          </button>

          {/* Quick WhatsApp */}
          <button
            onClick={handleWhatsAppClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors text-xs shadow-sm"
          >
            <MessageSquare className="w-4 h-4 fill-white/20" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

        </div>
      </div>
    </header>
  );
}
