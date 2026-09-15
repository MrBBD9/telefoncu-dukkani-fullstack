import React, { useState, useEffect } from 'react';
import {
  Smartphone, ShieldCheck, Plus, Edit, Trash2, CheckCircle2, AlertCircle, ShoppingBag,
  TrendingUp, Layers, Check, Settings, LogOut, Eye, Search, Filter, Globe, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import PhoneFormModal from './PhoneFormModal';

export default function AdminPortalPage({ onGoToStorefront }) {
  const { shopInfo, logout, updateShopInfo } = useAuth();
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [adminSearch, setAdminSearch] = useState('');
  const [adminStatusFilter, setAdminStatusFilter] = useState('all');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [phoneToEdit, setPhoneToEdit] = useState(null);

  const [shopName, setShopName] = useState(shopInfo.shopName);
  const [phoneNum, setPhoneNum] = useState(shopInfo.phone);
  const [whatsappNum, setWhatsappNum] = useState(shopInfo.whatsapp);
  const [address, setAddress] = useState(shopInfo.address);
  const [newPassword, setNewPassword] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  const loadPhones = async () => {
    setLoading(true);
    try {
      const res = await api.getPhones();
      if (res.success) {
        setPhones(res.phones);
      }
    } catch (err) {
      console.error('Failed to load admin phones:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhones();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(price);
  };

  const handleToggleSold = async (id) => {
    try {
      const res = await api.toggleSold(id);
      if (res.success) {
        loadPhones();
      }
    } catch (err) {
      alert('İlan durumu değiştirilemedi.');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`"${title}" ilanını silmek istediğinize emin misiniz?`)) return;
    try {
      const res = await api.deletePhone(id);
      if (res.success) {
        loadPhones();
      }
    } catch (err) {
      alert('İlan silinemedi.');
    }
  };

  const handleOpenAddForm = () => {
    setPhoneToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (phone) => {
    setPhoneToEdit(phone);
    setIsFormOpen(true);
  };

  const handleSaveShopSettings = async (e) => {
    e.preventDefault();
    setSaveSuccess('');
    try {
      const res = await api.updateProfile({
        shopName,
        phone: phoneNum,
        whatsapp: whatsappNum,
        address,
        newPassword
      });
      if (res.success) {
        updateShopInfo(res.shopInfo);
        setSaveSuccess('Mağaza ve iletişim bilgileri başarıyla güncellendi.');
        setTimeout(() => setSaveSuccess(''), 3000);
      }
    } catch (err) {
      alert('Profil güncellenemedi.');
    }
  };

  const activeCount = phones.filter(p => !p.isSold).length;
  const soldCount = phones.filter(p => p.isSold).length;
  const totalValue = phones.reduce((acc, curr) => acc + Number(curr.price || 0), 0);
  const avgPrice = phones.length > 0 ? Math.round(totalValue / phones.length) : 0;

  const filteredPhones = phones.filter(p => {
    const matchesSearch = !adminSearch ||
      p.title.toLowerCase().includes(adminSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(adminSearch.toLowerCase()) ||
      p.model.toLowerCase().includes(adminSearch.toLowerCase());
    
    if (adminStatusFilter === 'active') return matchesSearch && !p.isSold;
    if (adminStatusFilter === 'sold') return matchesSearch && p.isSold;
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Subdomain Notice Bar */}
      <div className="bg-gray-900 text-white px-4 py-2 text-xs flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-mono text-gray-300">Yönetim Portalı:</span>
          <strong className="font-mono text-emerald-400 bg-gray-800 px-2 py-0.5 rounded border border-gray-700">
            https://admin.cepmarket.com
          </strong>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onGoToStorefront}
            className="flex items-center gap-1 text-gray-300 hover:text-white font-bold transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>Müşteri Vitrinine Git</span>
          </button>
        </div>
      </div>

      {/* Main Admin Navigation Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm font-black">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-black text-gray-900 leading-none block">
                {shopInfo.shopName} Yönetim Portalı
              </span>
              <span className="text-[11px] text-gray-500 font-semibold">Detaylı İlan & Stok Kontrol Ekranı</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAddForm}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Telefon İlanı Ekle</span>
            </button>

            <button
              onClick={onGoToStorefront}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 font-bold text-xs transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Vitrini Gör</span>
            </button>

            <button
              onClick={logout}
              title="Çıkış Yap"
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-300 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Admin Navigation Sidebar / Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto py-2">
          
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Genel Bakış & İstatistikler</span>
          </button>

          <button
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'listings'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Layers className="w-4 h-4 text-blue-400" />
            <span>Tüm Telefon İlanları ({phones.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('shop-settings')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'shop-settings'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Settings className="w-4 h-4 text-amber-400" />
            <span>Mağaza İletişim & Şifre Ayarları</span>
          </button>

        </div>
      </div>

      {/* Admin Main Body Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        
        {/* TAB 1: OVERVIEW & STATS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                <span className="text-xs text-gray-500 font-bold uppercase">Toplam İlan</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-black text-gray-900">{phones.length}</span>
                  <span className="text-[11px] text-gray-500 font-semibold">Cihaz</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                <span className="text-xs text-gray-500 font-bold uppercase">Aktif Yayında</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-black text-emerald-600">{activeCount}</span>
                  <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Stokta</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                <span className="text-xs text-gray-500 font-bold uppercase">Satılan Telefonlar</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-black text-amber-600">{soldCount}</span>
                  <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Tamamlandı</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                <span className="text-xs text-gray-500 font-bold uppercase">Toplam Envanter Değeri</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-lg font-black text-blue-700">{formatPrice(totalValue)}</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                <span className="text-xs text-gray-500 font-bold uppercase">Ortalama İlan Fiyatı</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-lg font-black text-gray-900">{formatPrice(avgPrice)}</span>
                </div>
              </div>

            </div>

            {/* Quick Actions & Recent Listings */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    <span>Son Eklenen İlanlar</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('listings')}
                    className="text-xs text-blue-600 font-bold hover:underline"
                  >
                    Tümünü Gör ({phones.length}) →
                  </button>
                </div>

                <div className="divide-y divide-gray-100">
                  {phones.slice(0, 5).map(p => (
                    <div key={p.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0] || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'}
                          alt={p.title}
                          className="w-10 h-10 rounded object-cover border border-gray-200"
                        />
                        <div>
                          <span className="font-bold text-gray-900 block line-clamp-1">{p.title}</span>
                          <span className="text-[11px] text-gray-500">{p.brand} {p.model} • {p.storage} / {p.ram}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <strong className="text-blue-700 text-sm">{formatPrice(p.price)}</strong>
                        <button
                          onClick={() => handleToggleSold(p.id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.isSold ? 'bg-gray-200 text-gray-700' : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {p.isSold ? 'Satıldı' : 'Yayında'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4 text-xs">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Mağaza İletişim Bilgileri</span>
                </h3>

                <div className="space-y-2 text-gray-700">
                  <p><strong>Mağaza Adı:</strong> {shopInfo.shopName}</p>
                  <p><strong>Telefon:</strong> {shopInfo.phone}</p>
                  <p><strong>WhatsApp:</strong> {shopInfo.whatsapp}</p>
                  <p><strong>Adres:</strong> {shopInfo.address}</p>
                </div>

                <button
                  onClick={() => setActiveTab('shop-settings')}
                  className="w-full py-2 px-3 rounded-lg bg-gray-900 text-white font-bold text-xs hover:bg-gray-800 transition-colors"
                >
                  Bilgileri Düzenle
                </button>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: DETAILED LISTINGS MANAGEMENT TABLE */}
        {activeTab === 'listings' && (
          <div className="space-y-4">
            
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  placeholder="İlanlar içinde ara..."
                  className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-bold text-gray-500 uppercase">Filtre:</span>
                <button
                  onClick={() => setAdminStatusFilter('all')}
                  className={`px-3 py-1 rounded text-xs font-bold ${
                    adminStatusFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Tümü ({phones.length})
                </button>

                <button
                  onClick={() => setAdminStatusFilter('active')}
                  className={`px-3 py-1 rounded text-xs font-bold ${
                    adminStatusFilter === 'active' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Yayındakiler ({activeCount})
                </button>

                <button
                  onClick={() => setAdminStatusFilter('sold')}
                  className={`px-3 py-1 rounded text-xs font-bold ${
                    adminStatusFilter === 'sold' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Satılanlar ({soldCount})
                </button>
              </div>

            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase">
                      <th className="py-3 px-4">Telefon İlanı</th>
                      <th className="py-3 px-4">Durum</th>
                      <th className="py-3 px-4">Fiyat</th>
                      <th className="py-3 px-4">Özel RAM / Hafıza</th>
                      <th className="py-3 px-4">Satış Durumu</th>
                      <th className="py-3 px-4 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs text-gray-800">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-gray-400 animate-pulse">
                          İlanlar yükleniyor...
                        </td>
                      </tr>
                    ) : filteredPhones.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-gray-500">
                          Filtrenize uygun hiçbir ilan bulunamadı.
                        </td>
                      </tr>
                    ) : (
                      filteredPhones.map(phone => (
                        <tr key={phone.id} className="hover:bg-gray-50 transition-colors">
                          
                          <td className="py-2.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={phone.images[0] || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'}
                                alt={phone.title}
                                className="w-10 h-10 rounded object-cover border border-gray-200 flex-shrink-0"
                              />
                              <div>
                                <span className="font-bold text-gray-900 block line-clamp-1">{phone.title}</span>
                                <span className="text-[11px] text-gray-500">{phone.brand} {phone.model}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-2.5 px-4">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              phone.status === 'Sıfır' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {phone.status}
                            </span>
                          </td>

                          <td className="py-2.5 px-4 font-bold text-blue-700 text-sm">
                            {formatPrice(phone.price)}
                          </td>

                          <td className="py-2.5 px-4 font-semibold text-gray-700">
                            {phone.storage} / {phone.ram || '-'}
                          </td>

                          <td className="py-2.5 px-4">
                            <button
                              onClick={() => handleToggleSold(phone.id)}
                              className={`px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 ${
                                phone.isSold
                                  ? 'bg-gray-200 text-gray-700 border border-gray-300'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200'
                              }`}
                            >
                              {phone.isSold ? (
                                <>
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  <span>Satıldı</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Yayında</span>
                                </>
                              )}
                            </button>
                          </td>

                          <td className="py-2.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditForm(phone)}
                                title="Düzenle"
                                className="p-1.5 rounded bg-gray-100 text-gray-700 hover:bg-blue-600 hover:text-white transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleDelete(phone.id, phone.title)}
                                title="Sil"
                                className="p-1.5 rounded bg-gray-100 text-gray-700 hover:bg-red-600 hover:text-white transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: SHOP SETTINGS */}
        {activeTab === 'shop-settings' && (
          <div className="max-w-xl mx-auto bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4 text-xs">
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-0.5">Mağaza İletişim Bilgileri ve Şifre</h3>
              <p className="text-xs text-gray-500">Müşterilerin dükkanınıza ulaşabilmesi için WhatsApp ve telefon numaralarını buradan yönetin.</p>
            </div>

            {saveSuccess && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{saveSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveShopSettings} className="space-y-3">
              
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Dükkan / Mağaza Adı
                </label>
                <input
                  type="text"
                  required
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Telefon Numarası
                  </label>
                  <input
                    type="text"
                    required
                    value={phoneNum}
                    onChange={(e) => setPhoneNum(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    WhatsApp İletişim Hattı
                  </label>
                  <input
                    type="text"
                    required
                    value={whatsappNum}
                    onChange={(e) => setWhatsappNum(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Dükkan Adresi / Konum
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-blue-600"
                ></textarea>
              </div>

              <div className="pt-2 border-t border-gray-200">
                <label className="block font-bold text-gray-700 mb-1">
                  Yeni Yönetici Şifresi (İsteğe Bağlı)
                </label>
                <input
                  type="password"
                  placeholder="Değiştirmek istemiyorsanız boş bırakın"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                Bilgileri Güncelle
              </button>

            </form>
          </div>
        )}

      </main>

      {/* Nested Form Modal */}
      {isFormOpen && (
        <PhoneFormModal
          phoneToEdit={phoneToEdit}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            loadPhones();
          }}
        />
      )}

    </div>
  );
}
