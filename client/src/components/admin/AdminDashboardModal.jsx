import React, { useState, useEffect } from 'react';
import {
  X, Plus, Edit, Trash2, CheckCircle2, AlertCircle, ShoppingBag,
  TrendingUp, Layers, Check, Settings, Smartphone
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import PhoneFormModal from './PhoneFormModal';

export default function AdminDashboardModal() {
  const { isAdminOpen, setIsAdminOpen, shopInfo, logout, updateShopInfo } = useAuth();
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [phoneToEdit, setPhoneToEdit] = useState(null);
  const [activeTab, setActiveTab] = useState('listings'); // 'listings' | 'shop-settings'

  // Shop Settings Form State
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
    if (isAdminOpen) {
      loadPhones();
    }
  }, [isAdminOpen]);

  if (!isAdminOpen) return null;

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

  // Stats
  const activeCount = phones.filter(p => !p.isSold).length;
  const soldCount = phones.filter(p => p.isSold).length;
  const totalValue = phones.reduce((acc, curr) => acc + Number(curr.price || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 bg-slate-50 sticky top-0 z-20">
          
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Mağaza Yönetim Paneli</span>
              </h2>
              <p className="text-xs text-slate-500">{shopInfo.shopName} - İlan ve Mağaza Yönetimi</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Sub Header Tabs */}
        <div className="px-6 py-2.5 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('listings')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'listings'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>İlan Listesi ({phones.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('shop-settings')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'shop-settings'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Dükkan İletişim Ayarları</span>
            </button>
          </div>

          {activeTab === 'listings' && (
            <button
              onClick={handleOpenAddForm}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Telefon İlanı Ekle</span>
            </button>
          )}
        </div>

        {/* Main Content Scroll Area */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          
          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium block">Toplam İlan</span>
                <span className="text-xl font-bold text-slate-900">{phones.length}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-blue-100 text-blue-700">
                <Smartphone className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium block">Aktif Yayında</span>
                <span className="text-xl font-bold text-emerald-700">{activeCount}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium block">Satılan Telefonlar</span>
                <span className="text-xl font-bold text-amber-700">{soldCount}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-100 text-amber-700">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium block">Stok Değeri</span>
                <span className="text-base font-bold text-slate-900">{formatPrice(totalValue)}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-200 text-slate-700">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>

          </div>

          {/* TAB 1: LISTINGS MANAGEMENT TABLE */}
          {activeTab === 'listings' && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-3 px-4">Telefon İlanı</th>
                      <th className="py-3 px-4">Durum</th>
                      <th className="py-3 px-4">Fiyat</th>
                      <th className="py-3 px-4">Hafıza / RAM</th>
                      <th className="py-3 px-4">Satış Durumu</th>
                      <th className="py-3 px-4 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400 animate-pulse">
                          İlanlar yükleniyor...
                        </td>
                      </tr>
                    ) : phones.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-500">
                          Henüz ilan eklenmemiş. Yukarıdaki "Yeni Telefon İlanı Ekle" butonuna tıklayarak ilk ilanınızı açabilirsiniz.
                        </td>
                      </tr>
                    ) : (
                      phones.map(phone => (
                        <tr key={phone.id} className="hover:bg-slate-50 transition-colors">
                          
                          {/* Image & Title */}
                          <td className="py-2.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={phone.images[0] || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'}
                                alt={phone.title}
                                className="w-10 h-10 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                              />
                              <div>
                                <span className="font-bold text-slate-900 block line-clamp-1">{phone.title}</span>
                                <span className="text-[11px] text-slate-500">{phone.brand} {phone.model}</span>
                              </div>
                            </div>
                          </td>

                          {/* Condition */}
                          <td className="py-2.5 px-4">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              phone.status === 'Sıfır' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                            }`}>
                              {phone.status}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="py-2.5 px-4 font-bold text-blue-700 text-sm">
                            {formatPrice(phone.price)}
                          </td>

                          {/* Storage & RAM */}
                          <td className="py-2.5 px-4 text-slate-700 font-medium">
                            {phone.storage} / {phone.ram || '-'}
                          </td>

                          {/* Sold Toggle */}
                          <td className="py-2.5 px-4">
                            <button
                              onClick={() => handleToggleSold(phone.id)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                                phone.isSold
                                  ? 'bg-red-100 text-red-700 border border-red-200'
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

                          {/* Actions */}
                          <td className="py-2.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditForm(phone)}
                                title="Düzenle"
                                className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleDelete(phone.id, phone.title)}
                                title="Sil"
                                className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-red-600 hover:text-white transition-colors"
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
          )}

          {/* TAB 2: SHOP SETTINGS */}
          {activeTab === 'shop-settings' && (
            <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 text-xs">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-0.5">Mağaza İletişim Bilgileri</h3>
                <p className="text-xs text-slate-500">Bu bilgiler vitrinde müşterilere gösterilecek iletişim kanallarıdır.</p>
              </div>

              {saveSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{saveSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSaveShopSettings} className="space-y-3.5">
                
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Dükkan / Mağaza Adı
                  </label>
                  <input
                    type="text"
                    required
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Telefon Numarası
                    </label>
                    <input
                      type="text"
                      required
                      value={phoneNum}
                      onChange={(e) => setPhoneNum(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      WhatsApp İletişim Hattı
                    </label>
                    <input
                      type="text"
                      required
                      value={whatsappNum}
                      onChange={(e) => setWhatsappNum(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Dükkan Adresi / Konum
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  ></textarea>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <label className="block font-bold text-slate-700 mb-1">
                    Yeni Yönetici Şifresi (İsteğe Bağlı)
                  </label>
                  <input
                    type="password"
                    placeholder="Değiştirmek istemiyorsanız boş bırakın"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600"
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

        </div>

      </div>

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
