import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PhoneGrid from './components/PhoneGrid';
import PhoneDetailModal from './components/PhoneDetailModal';
import AdminLoginModal from './components/admin/AdminLoginModal';
import AdminPortalPage from './components/admin/AdminPortalPage';
import CompareModal from './components/CompareModal';
import TradeInModal from './components/TradeInModal';
import ShopIntroPage from './components/ShopIntroPage';
import Footer from './components/Footer';
import { api } from './services/api';

function MainStoreContent() {
  const { isAdmin, isAdminOpen, setIsAdminOpen, setIsLoginModalOpen } = useAuth();

  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Public tab: 'storefront' | 'shop-intro'
  const [activeTab, setActiveTab] = useState('storefront');

  // View mode: 'storefront' | 'admin-portal'
  const [viewMode, setViewMode] = useState('storefront');

  // Comparison State
  const [compareList, setCompareList] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Trade In Modal State
  const [isTradeInOpen, setIsTradeInOpen] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('Tümü');
  const [selectedStatus, setSelectedStatus] = useState('Tümü');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');

  // Detail Modal
  const [selectedPhoneId, setSelectedPhoneId] = useState(null);

  // SECRET LINK LISTENER: Listen for secret URL hash or path '#/patron-giris' or '/patron-giris'
  useEffect(() => {
    const checkSecretRoute = () => {
      const hash = window.location.hash;
      const pathname = window.location.pathname;
      
      if (hash === '#/patron-giris' || pathname === '/patron-giris' || hash === '#/admin' || pathname === '/admin') {
        if (isAdmin) {
          setViewMode('admin-portal');
        } else {
          setIsLoginModalOpen(true);
        }
      }
    };

    checkSecretRoute();
    window.addEventListener('hashchange', checkSecretRoute);
    return () => window.removeEventListener('hashchange', checkSecretRoute);
  }, [isAdmin, setIsLoginModalOpen]);

  const fetchPhones = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getPhones({
        search,
        brand: selectedBrand,
        status: selectedStatus,
        minPrice,
        maxPrice,
        sort
      });
      if (res.success) {
        setPhones(res.phones);
      }
    } catch (err) {
      console.error('Fetch phones error:', err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedBrand, selectedStatus, minPrice, maxPrice, sort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPhones();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchPhones]);

  useEffect(() => {
    if (isAdminOpen) {
      setViewMode('admin-portal');
    }
  }, [isAdminOpen]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedBrand('Tümü');
    setSelectedStatus('Tümü');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
  };

  const handleToggleCompare = (phone) => {
    setCompareList(prev => {
      const exists = prev.some(p => p.id === phone.id);
      if (exists) {
        return prev.filter(p => p.id !== phone.id);
      } else {
        if (prev.length >= 3) {
          alert('En fazla 3 telefonu aynı anda karşılaştırabilirsiniz.');
          return prev;
        }
        return [...prev, phone];
      }
    });
  };

  const handleRemoveFromCompare = (id) => {
    setCompareList(prev => prev.filter(p => p.id !== id));
  };

  // If Admin Portal Mode is Active
  if (isAdmin && viewMode === 'admin-portal') {
    return (
      <AdminPortalPage
        onGoToStorefront={() => {
          setIsAdminOpen(false);
          setViewMode('storefront');
          window.location.hash = '';
          fetchPhones();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100 text-gray-900 font-sans selection:bg-blue-600 selection:text-white">
      
      <div>
        <Navbar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onOpenTradeIn={() => setIsTradeInOpen(true)}
          compareCount={compareList.length}
          onOpenCompare={() => setIsCompareModalOpen(true)}
        />

        <main>
          {activeTab === 'storefront' ? (
            <>
              <HeroSection
                search={search}
                setSearch={setSearch}
                selectedBrand={selectedBrand}
                setSelectedBrand={setSelectedBrand}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                sort={sort}
                setSort={setSort}
                totalCount={phones.length}
                onResetFilters={handleResetFilters}
              />

              <PhoneGrid
                phones={phones}
                loading={loading}
                onSelectPhone={(phone) => setSelectedPhoneId(phone.id)}
                onResetFilters={handleResetFilters}
                compareList={compareList}
                onToggleCompare={handleToggleCompare}
              />
            </>
          ) : (
            <ShopIntroPage
              onGoToStorefront={() => setActiveTab('storefront')}
              onOpenTradeIn={() => setIsTradeInOpen(true)}
            />
          )}
        </main>
      </div>

      <Footer />

      {/* Detail Modal */}
      {selectedPhoneId && (
        <PhoneDetailModal
          phoneId={selectedPhoneId}
          onClose={() => {
            setSelectedPhoneId(null);
            fetchPhones();
          }}
        />
      )}

      {/* Compare Modal */}
      {isCompareModalOpen && (
        <CompareModal
          comparePhones={compareList}
          onRemoveFromCompare={handleRemoveFromCompare}
          onClose={() => setIsCompareModalOpen(false)}
        />
      )}

      {/* Trade In Calculator Modal */}
      {isTradeInOpen && (
        <TradeInModal
          phones={phones}
          onClose={() => setIsTradeInOpen(false)}
        />
      )}

      {/* Admin Login Modal (Triggered by Secret URL) */}
      <AdminLoginModal />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainStoreContent />
    </AuthProvider>
  );
}
