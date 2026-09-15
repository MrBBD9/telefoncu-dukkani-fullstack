import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('phone_shop_token') || null);
  const [shopInfo, setShopInfo] = useState({
    shopName: 'CepMarket Mobile',
    phone: '0532 000 00 00',
    whatsapp: '905320000000',
    address: 'Merkez Mah. Atatürk Cad. No:45/A, Kadıköy / İstanbul'
  });
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const data = await api.getMe();
          if (data.success) {
            setShopInfo(data.shopInfo);
          } else {
            logout();
          }
        } catch (err) {
          console.error('Auth verification failed:', err);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  const login = async (username, password) => {
    const data = await api.login(username, password);
    if (data.success) {
      localStorage.setItem('phone_shop_token', data.token);
      setToken(data.token);
      setShopInfo(data.shopInfo);
      setIsLoginModalOpen(false);
      setIsAdminOpen(true);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('phone_shop_token');
    setToken(null);
    setIsAdminOpen(false);
  };

  const updateShopInfo = (newInfo) => {
    setShopInfo(prev => ({ ...prev, ...newInfo }));
  };

  return (
    <AuthContext.Provider value={{
      token,
      shopInfo,
      isAdmin: !!token,
      isAdminOpen,
      setIsAdminOpen,
      isLoginModalOpen,
      setIsLoginModalOpen,
      login,
      logout,
      updateShopInfo,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
