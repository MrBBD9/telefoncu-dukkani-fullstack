import React, { useState } from 'react';
import { Lock, User, Key, ShieldCheck, Smartphone, ArrowLeft, CheckCircle2, Layers, Printer } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginPage({ onGoToStorefront }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(username, password);
      if (!res.success) {
        setError(res.message || 'Giriş başarısız! Kullanıcı adı veya şifre hatalı.');
      }
    } catch (err) {
      setError('Sunucu bağlantı hatası oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col justify-between font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Secret Subdomain Bar */}
      <div className="bg-gray-900 text-white px-4 py-2 text-xs flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-mono text-gray-300">Güvenli Mağaza Portalı:</span>
          <strong className="font-mono text-emerald-400 bg-gray-800 px-2 py-0.5 rounded border border-gray-700">
            https://admin.cepmarket.com
          </strong>
        </div>

        <button
          onClick={onGoToStorefront}
          className="flex items-center gap-1.5 text-gray-300 hover:text-white font-bold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-blue-400" />
          <span>Müşteri Vitrinine Dön</span>
        </button>
      </div>

      {/* Main Login Content Body */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
          
          {/* Left Column: Portal Branding & Information */}
          <div className="md:col-span-6 bg-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black shadow-sm">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xl font-black text-white tracking-tight block leading-none">
                    CepMarket Mobile
                  </span>
                  <span className="text-[11px] text-gray-400 font-semibold">Dükkan Sahibi Yönetim Ekranı</span>
                </div>
              </div>

              <h1 className="text-2xl font-black text-white leading-snug pt-2">
                Mağaza İlan ve Stok Yönetim Portalı
              </h1>
              <p className="text-xs text-gray-400 leading-relaxed">
                Bu portal sadece dükkan sahibi yetkisine sahip kullanıcılar içindir. İlanlarınızı yayınlayabilir, stok durumunu güncelleyebilir ve vitrin fiyat etiketleri basabilirsiniz.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-3 pt-4 border-t border-gray-800 text-xs">
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Galerinizden Telefon Fotoğrafları Yükleyin</span>
              </div>

              <div className="flex items-center gap-2 text-gray-300">
                <Layers className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Özel RAM & Depolama Seçenekleri Tanımlayın</span>
              </div>

              <div className="flex items-center gap-2 text-gray-300">
                <Printer className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Dükkan Camı İlan Fiyat Etiketi Yazdırın</span>
              </div>
            </div>

            <div className="text-[11px] text-gray-500">
              © {new Date().getFullYear()} CepMarket Mobile • Tüm Yetkiler Saklıdır
            </div>
          </div>

          {/* Right Column: Independent Login Form */}
          <div className="md:col-span-6 p-8 sm:p-10 flex flex-col justify-center space-y-6">
            
            <div className="space-y-1">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-2">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Yönetici Giriş Sayfası</h2>
              <p className="text-xs text-gray-500">Devam etmek için dükkan sahibi bilgilerinizi giriniz.</p>
            </div>

            {/* Quick Demo Info Box */}
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Varsayılan Yönetici Bilgileri</span>
              </div>
              <p>Kullanıcı Adı: <strong>admin</strong></p>
              <p>Şifre: <strong>admin123</strong></p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Kullanıcı Adı
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Kullanıcı adınızı girin"
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Şifre
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Şifrenizi girin"
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                {loading ? 'Giriş Yapılıyor...' : 'Yönetim Portalı\'na Giriş Yap'}
              </button>

            </form>

            {/* Back to storefront link */}
            <div className="pt-2 border-t border-gray-100 text-center">
              <button
                onClick={onGoToStorefront}
                className="text-xs text-gray-500 hover:text-gray-900 font-semibold inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Müşteri Vitrinine Dön</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Footer Bar */}
      <footer className="bg-white border-t border-gray-200 py-3 text-center text-xs text-gray-500">
        CepMarket Mobile • Mağaza Sahibi Özel Güvenlikli Giriş Sayfası
      </footer>

    </div>
  );
}
