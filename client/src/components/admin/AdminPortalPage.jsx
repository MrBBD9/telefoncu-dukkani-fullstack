import React, { useState, useEffect } from 'react';
import {
  Smartphone, ShieldCheck, Plus, Edit, Trash2, CheckCircle2, AlertCircle, ShoppingBag,
  TrendingUp, Layers, Check, Settings, LogOut, Eye, Search, Filter, Globe, ArrowLeft, Printer,
  DollarSign, AlertTriangle, PieChart, BarChart3, Award, Sparkles, ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import PhoneFormModal from './PhoneFormModal';
import PrintPriceTagModal from '../PrintPriceTagModal';

export default function AdminPortalPage({ onGoToStorefront }) {
  const { shopInfo, logout, updateShopInfo } = useAuth();
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'listings' | 'shop-settings'
  const [adminSearch, setAdminSearch] = useState('');
  const [adminStatusFilter, setAdminStatusFilter] = useState('all');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [phoneToEdit, setPhoneToEdit] = useState(null);

  // Print Modal State
  const [phoneToPrint, setPhoneToPrint] = useState(null);

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
    if (price === null || price === undefined || isNaN(price)) return '-';
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

  // FINANCIAL & ANALYTICS CALCULATIONS
  const activeCount = phones.filter(p => !p.isSold).length;
  const soldCount = phones.filter(p => p.isSold).length;
  
  // Sold phones
  const soldPhones = phones.filter(p => p.isSold);
  
  // Total Revenue (Toplanan Ciro) from all sold phones
  const totalRevenue = soldPhones.reduce((acc, curr) => acc + Number(curr.price || 0), 0);
  
  // Sold phones WITH cost price entered
  const soldWithCost = soldPhones.filter(p => p.costPrice !== null && p.costPrice !== undefined && p.costPrice !== '' && !isNaN(Number(p.costPrice)));
  const soldRevenueWithCost = soldWithCost.reduce((acc, curr) => acc + Number(curr.price || 0), 0);
  const soldTotalCost = soldWithCost.reduce((acc, curr) => acc + Number(curr.costPrice || 0), 0);
  
  // Realized Net Profit (Gerçekleşen Net Kâr)
  const netProfit = soldRevenueWithCost - soldTotalCost;
  const profitMarginPercent = soldRevenueWithCost > 0 ? ((netProfit / soldRevenueWithCost) * 100).toFixed(1) : '0';

  // Active inventory valuation & potential profit
  const totalInventoryValue = phones.filter(p => !p.isSold).reduce((acc, curr) => acc + Number(curr.price || 0), 0);
  const activeWithCost = phones.filter(p => !p.isSold && p.costPrice !== null && p.costPrice !== undefined && p.costPrice !== '' && !isNaN(Number(p.costPrice)));
  const potentialInventoryProfit = activeWithCost.reduce((acc, curr) => acc + (Number(curr.price) - Number(curr.costPrice)), 0);

  // Missing cost price count
  const missingCostPhones = phones.filter(p => p.costPrice === null || p.costPrice === undefined || p.costPrice === '' || isNaN(Number(p.costPrice)));
  const missingCostCount = missingCostPhones.length;

  // Brand analytics for charts
  const brandAnalyticsMap = {};
  phones.forEach(p => {
    const b = p.brand || 'Diğer';
    if (!brandAnalyticsMap[b]) {
      brandAnalyticsMap[b] = { brand: b, totalCount: 0, soldCount: 0, revenue: 0, profit: 0, withCostCount: 0 };
    }
    brandAnalyticsMap[b].totalCount += 1;
    if (p.isSold) {
      brandAnalyticsMap[b].soldCount += 1;
      brandAnalyticsMap[b].revenue += Number(p.price || 0);
      if (p.costPrice !== null && p.costPrice !== undefined && p.costPrice !== '' && !isNaN(Number(p.costPrice))) {
        brandAnalyticsMap[b].profit += (Number(p.price) - Number(p.costPrice));
        brandAnalyticsMap[b].withCostCount += 1;
      }
    }
  });
  const brandAnalyticsList = Object.values(brandAnalyticsMap).sort((a, b) => b.revenue - a.revenue);
  const maxBrandRevenue = Math.max(...brandAnalyticsList.map(b => b.revenue), 1);

  // Top profitable devices leaderboard
  const topProfitablePhones = phones
    .filter(p => p.costPrice !== null && p.costPrice !== undefined && p.costPrice !== '' && !isNaN(Number(p.costPrice)))
    .map(p => ({
      ...p,
      profit: Number(p.price) - Number(p.costPrice),
      margin: ((Number(p.price) - Number(p.costPrice)) / Number(p.price) * 100).toFixed(1)
    }))
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 5);

  const filteredPhones = phones.filter(p => {
    const matchesSearch = !adminSearch ||
      p.title.toLowerCase().includes(adminSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(adminSearch.toLowerCase()) ||
      p.model.toLowerCase().includes(adminSearch.toLowerCase());
    
    if (adminStatusFilter === 'active') return matchesSearch && !p.isSold;
    if (adminStatusFilter === 'sold') return matchesSearch && p.isSold;
    if (adminStatusFilter === 'missing-cost') return matchesSearch && (p.costPrice === null || p.costPrice === undefined || p.costPrice === '' || isNaN(Number(p.costPrice)));
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Subdomain Notice Bar */}
      <div className="bg-gray-900 text-white px-4 py-2 text-xs flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-mono text-gray-300">Gizli Yönetim Portalı:</span>
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
            <span>Müşteri Vitrinine Dön</span>
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
              <span className="text-[11px] text-gray-500 font-semibold">Gelişmiş Finansal Ciro, Net Kâr & Stok Ekranı</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAddForm}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
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

      {/* Admin Navigation Tabs */}
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
            <span>Finansal Dashboard & Kâr Grafikleri</span>
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
            {missingCostCount > 0 && (
              <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-extrabold">
                {missingCostCount} eksik maliyet
              </span>
            )}
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
            <span>Mağaza İletişim & Ayarlar</span>
          </button>

        </div>
      </div>

      {/* Admin Main Body Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        
        {/* TAB 1: DETAILED FINANCIAL DASHBOARD & STATS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Rule Disclaimer Banner */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div>
                  <strong className="font-bold block text-amber-950">Kâr Grafiği ve Finansal Hesaplama Kuralı:</strong>
                  <span>Alış fiyatı (maliyet) girilen ilanların kârı hesaplanır. <strong>Alış fiyatı girilmeyen ilanlar kâr grafiği ve marj oranlarına kesinlikle dahil edilmez.</strong></span>
                </div>
              </div>
              {missingCostCount > 0 && (
                <button
                  onClick={() => {
                    setAdminStatusFilter('missing-cost');
                    setActiveTab('listings');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 flex-shrink-0 transition-colors"
                >
                  <span>{missingCostCount} İlana Alış Fiyatı Ekle →</span>
                </button>
              )}
            </div>

            {/* 6 Key Financial KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              
              {/* Total Revenue (Ciro) */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 font-bold uppercase">Satış Cirosu</span>
                  <span className="p-1 rounded bg-blue-50 text-blue-600"><DollarSign className="w-3.5 h-3.5" /></span>
                </div>
                <div className="mt-2">
                  <span className="text-xl font-black text-blue-700 block">{formatPrice(totalRevenue)}</span>
                  <span className="text-[10px] text-gray-500 font-semibold">{soldCount} satılan telefon</span>
                </div>
              </div>

              {/* Net Profit (Kâr) */}
              <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-white shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-emerald-800 font-bold uppercase">Gerçekleşen Net Kâr</span>
                  <span className="p-1 rounded bg-emerald-100 text-emerald-700"><TrendingUp className="w-3.5 h-3.5" /></span>
                </div>
                <div className="mt-2">
                  <span className="text-xl font-black text-emerald-700 block">{formatPrice(netProfit)}</span>
                  <span className="text-[10px] text-emerald-800 font-semibold">Maliyeti bilinen satışlar</span>
                </div>
              </div>

              {/* Profit Margin % */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 font-bold uppercase">Kâr Marjı (%)</span>
                  <span className="p-1 rounded bg-purple-50 text-purple-600"><PieChart className="w-3.5 h-3.5" /></span>
                </div>
                <div className="mt-2">
                  <span className="text-xl font-black text-purple-700 block">%{profitMarginPercent}</span>
                  <span className="text-[10px] text-gray-500 font-semibold">Ortalama Kârlılık</span>
                </div>
              </div>

              {/* Potential Inventory Profit */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 font-bold uppercase">Potansiyel Kâr</span>
                  <span className="p-1 rounded bg-amber-50 text-amber-600"><Sparkles className="w-3.5 h-3.5" /></span>
                </div>
                <div className="mt-2">
                  <span className="text-lg font-black text-amber-600 block">{formatPrice(potentialInventoryProfit)}</span>
                  <span className="text-[10px] text-gray-500 font-semibold">Stoktaki cihaz kârı</span>
                </div>
              </div>

              {/* Total Active Inventory Value */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 font-bold uppercase">Stok Değeri</span>
                  <span className="p-1 rounded bg-gray-100 text-gray-700"><ShoppingBag className="w-3.5 h-3.5" /></span>
                </div>
                <div className="mt-2">
                  <span className="text-lg font-black text-gray-900 block">{formatPrice(totalInventoryValue)}</span>
                  <span className="text-[10px] text-emerald-700 font-semibold">{activeCount} stokta yayında</span>
                </div>
              </div>

              {/* Missing Cost Notice */}
              <div className={`p-4 rounded-xl border shadow-sm flex flex-col justify-between ${
                missingCostCount > 0 ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-gray-50 border-gray-200 text-gray-700'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase">Alış Fiyatı Boş</span>
                  <AlertCircle className={`w-3.5 h-3.5 ${missingCostCount > 0 ? 'text-amber-600' : 'text-gray-400'}`} />
                </div>
                <div className="mt-2">
                  <span className="text-xl font-black block">{missingCostCount} Cihaz</span>
                  <span className="text-[10px] opacity-80 font-medium">Kâr grafiğine dahil değil</span>
                </div>
              </div>

            </div>

            {/* Financial Visual Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* BRAND PROFIT & REVENUE VISUAL BAR CHART */}
              <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                      <span>Marka Bazlı Ciro & Kâr Grafiği</span>
                    </h3>
                    <p className="text-[11px] text-gray-500">Satılan cihazlardan elde edilen ciro ve net kâr dağılımı</p>
                  </div>
                  <span className="text-[11px] text-gray-400 font-medium italic">Sadece maliyeti girilenler hesaplanır</span>
                </div>

                <div className="space-y-4 pt-1">
                  {brandAnalyticsList.map(b => {
                    const revPct = Math.round((b.revenue / maxBrandRevenue) * 100);
                    return (
                      <div key={b.brand} className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-gray-900 flex items-center gap-2">
                            {b.brand}
                            <span className="text-[11px] font-normal text-gray-500">({b.soldCount} Satış / {b.totalCount} İlan)</span>
                          </span>
                          <div className="flex items-center gap-4 text-right">
                            <span className="text-gray-600">Ciro: <strong>{formatPrice(b.revenue)}</strong></span>
                            <span className="text-emerald-700">Kâr: <strong>+{formatPrice(b.profit)}</strong></span>
                          </div>
                        </div>

                        {/* Revenue Bar */}
                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
                          <div
                            style={{ width: `${revPct}%` }}
                            className="h-full bg-blue-600 rounded-full transition-all duration-500 relative"
                            title={`Ciro: ${formatPrice(b.revenue)}`}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* TOP PROFITABLE PHONES LEADERBOARD */}
              <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4 text-xs">
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>En Çok Kâr Getiren Telefonlar</span>
                  </h3>
                  <p className="text-[11px] text-gray-500">Alış ve satış fiyatı farkına göre en yüksek kârlılık</p>
                </div>

                <div className="divide-y divide-gray-100">
                  {topProfitablePhones.length === 0 ? (
                    <div className="py-6 text-center text-gray-400">
                      Henüz alış fiyatı girilmiş telefon bulunamadı.
                    </div>
                  ) : (
                    topProfitablePhones.map((phone, index) => (
                      <div key={phone.id} className="py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                            index === 0 ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {index + 1}
                          </span>
                          <div>
                            <span className="font-bold text-gray-900 block line-clamp-1">{phone.title}</span>
                            <span className="text-[10px] text-gray-500">Satış: {formatPrice(phone.price)} • Alış: {formatPrice(phone.costPrice)}</span>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className="text-emerald-700 font-extrabold block text-xs">+{formatPrice(phone.profit)}</span>
                          <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                            %{phone.margin} kâr
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* MISSING COST PRICE ACTION BOX */}
            {missingCostCount > 0 && (
              <div className="bg-white p-5 rounded-xl border border-amber-200 shadow-sm space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Alış Fiyatı (Maliyeti) Girilmeyen İlanlar ({missingCostCount} Adet)</span>
                  </h3>
                  <span className="text-[11px] text-gray-500">Bu ilanlar kâr grafiğinde görünmemektedir. Alış fiyatı ekleyebilirsiniz.</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {missingCostPhones.map(phone => (
                    <div key={phone.id} className="p-3 rounded-lg bg-amber-50/60 border border-amber-200 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={phone.images[0] || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'}
                          alt={phone.title}
                          className="w-8 h-8 rounded object-cover border border-amber-300"
                        />
                        <div>
                          <span className="font-bold text-gray-900 block line-clamp-1">{phone.title}</span>
                          <span className="text-[10px] text-gray-600">Satış Fiyatı: {formatPrice(phone.price)}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenEditForm(phone)}
                        className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition-colors flex-shrink-0"
                      >
                        Maliyet Gir
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                  placeholder="İlan başlığı veya marka ara..."
                  className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
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

                <button
                  onClick={() => setAdminStatusFilter('missing-cost')}
                  className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1 ${
                    adminStatusFilter === 'missing-cost' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100'
                  }`}
                >
                  <span>Maliyetsiz İlanlar</span>
                  <span className="bg-amber-700 text-white px-1.5 py-0.2 rounded-full text-[10px]">{missingCostCount}</span>
                </button>
              </div>

            </div>

            {/* Detailed Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase">
                      <th className="py-3 px-4">Telefon İlanı</th>
                      <th className="py-3 px-4">Durum</th>
                      <th className="py-3 px-4">Satış Fiyatı</th>
                      <th className="py-3 px-4">Alış Fiyatı (Maliyet)</th>
                      <th className="py-3 px-4">Tahmini / Net Kâr</th>
                      <th className="py-3 px-4">Satış Durumu</th>
                      <th className="py-3 px-4 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs text-gray-800">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-gray-400 animate-pulse">
                          İlanlar yükleniyor...
                        </td>
                      </tr>
                    ) : filteredPhones.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-gray-500">
                          Filtrenize uygun hiçbir ilan bulunamadı.
                        </td>
                      </tr>
                    ) : (
                      filteredPhones.map(phone => {
                        const hasCost = phone.costPrice !== null && phone.costPrice !== undefined && phone.costPrice !== '' && !isNaN(Number(phone.costPrice));
                        const itemProfit = hasCost ? (Number(phone.price) - Number(phone.costPrice)) : null;
                        const itemMargin = (hasCost && Number(phone.price) > 0) ? ((itemProfit / Number(phone.price)) * 100).toFixed(1) : null;

                        return (
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
                                  <span className="text-[11px] text-gray-500">{phone.brand} {phone.model} • {phone.storage} / {phone.ram || '-'}</span>
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

                            {/* Satış Fiyatı */}
                            <td className="py-2.5 px-4 font-bold text-blue-700 text-sm">
                              {formatPrice(phone.price)}
                            </td>

                            {/* Alış Fiyatı */}
                            <td className="py-2.5 px-4 font-semibold text-gray-700">
                              {hasCost ? (
                                <span className="text-gray-900">{formatPrice(phone.costPrice)}</span>
                              ) : (
                                <button
                                  onClick={() => handleOpenEditForm(phone)}
                                  className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 hover:bg-amber-200 text-[10px] font-bold border border-amber-300 transition-colors"
                                >
                                  + Alış Fiyatı Gir
                                </button>
                              )}
                            </td>

                            {/* Net / Tahmini Kâr */}
                            <td className="py-2.5 px-4 font-semibold">
                              {hasCost ? (
                                <div className="flex items-center gap-1.5">
                                  <span className={`font-black text-xs ${itemProfit >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                                    {itemProfit >= 0 ? `+${formatPrice(itemProfit)}` : formatPrice(itemProfit)}
                                  </span>
                                  <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                                    %{itemMargin}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-[11px] text-gray-400 italic">Kâr Grafiğinde Yok</span>
                              )}
                            </td>

                            {/* Satış Durumu Toggle */}
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

                            {/* Actions */}
                            <td className="py-2.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setPhoneToPrint(phone)}
                                  title="Mağaza Camı Etiketi Yazdır"
                                  className="p-1.5 rounded bg-gray-100 text-gray-700 hover:bg-emerald-600 hover:text-white transition-colors"
                                >
                                  <Printer className="w-4 h-4" />
                                </button>

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
                        );
                      })
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

      {/* Form Modal */}
      {isFormOpen && (
        <PhoneFormModal
          phoneToEdit={phoneToEdit}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            loadPhones();
          }}
        />
      )}

      {/* Printable Tag Modal */}
      {phoneToPrint && (
        <PrintPriceTagModal
          phone={phoneToPrint}
          onClose={() => setPhoneToPrint(null)}
        />
      )}

    </div>
  );
}
