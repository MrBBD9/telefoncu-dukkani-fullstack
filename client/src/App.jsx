import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PhoneGrid from './components/PhoneGrid';
import PhoneDetailModal from './components/PhoneDetailModal';
import AdminLoginModal from './components/admin/AdminLoginModal';
import AdminDashboardModal from './components/admin/AdminDashboardModal';
import AdminPortalPage from './components/admin/AdminPortalPage';
import Footer from './components/Footer';
import { api } from './services/api';

function MainStoreContent() {
  const { isAdmin, isAdminOpen, setIsAdminOpen } = useAuth();

  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // View mode: 'storefront' | 'admin-portal'
  const [viewMode, setViewMode] = useState('storefront');

  // Filters
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('Tümü');
  const [selectedStatus, setSelectedStatus] = useState('Tümü');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');

  // Detail Modal
  const [selectedPhoneId, setSelectedPhoneId] = useState(null);

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

  // If user opens admin panel modal, offer full page portal option
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

  // If Admin Portal Mode is Active
  if (isAdmin && viewMode === 'admin-portal') {
    return (
      <AdminPortalPage
        onGoToStorefront={() => {
          setIsAdminOpen(false);
          setViewMode('storefront');
          fetchPhones();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100 text-gray-900">
      
      <div>
        <Navbar />

        <main>
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
          />
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

      {/* Admin Login Modal */}
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
