import React from 'react';
import { Smartphone, ShieldCheck, Lock, LayoutDashboard, Phone, MessageSquare, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAdmin, setIsAdminOpen, setIsLoginModalOpen, logout, shopInfo } = useAuth();

  const handleWhatsAppClick = () => {
    const cleanNumber = shopInfo.whatsapp.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent('Merhaba, vitrininizdeki telefon ilanları hakkında bilgi almak istiyorum.')}`, '_blank');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      
      {/* Top Mini Bar */}
      <div className="bg-gray-900 text-gray-200 py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{shopInfo.shopName} - Orijinal & Garantili İkinci El ve Sıfır Telefon Vitrini</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[11px] text-gray-300">
            <span>Çalışma Saatleri: 09:00 - 21:00</span>
            <span>Konum: Kadıköy / İstanbul</span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black shadow-sm">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black text-gray-900 tracking-tight block leading-none">
              {shopInfo.shopName}
            </span>
            <span className="text-[11px] text-gray-500 font-semibold">Telefoncu İlan Vitrini</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick WhatsApp */}
          <button
            onClick={handleWhatsAppClick}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 transition-colors text-xs font-bold"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp İletişim</span>
          </button>

          {/* Quick Phone Call */}
          <a
            href={`tel:${shopInfo.phone.replace(/\s+/g, '')}`}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 transition-colors text-xs font-semibold"
          >
            <Phone className="w-4 h-4 text-gray-600" />
            <span>{shopInfo.phone}</span>
          </a>

          {/* Admin Panel Button */}
          {isAdmin ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsAdminOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-all shadow-sm"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Yönetim Paneli</span>
              </button>
              
              <button
                onClick={logout}
                title="Çıkış Yap"
                className="p-1.5 rounded-md bg-gray-100 text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-300 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-gray-800 text-white hover:bg-gray-900 font-semibold text-xs transition-all shadow-sm"
            >
              <Lock className="w-3.5 h-3.5 text-gray-300" />
              <span>Dükkan Sahibi Girişi</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
