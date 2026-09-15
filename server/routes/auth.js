const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { getAdmin, saveAdmin } = require('../data/store');
const { verifyToken, JWT_SECRET } = require('../middleware/authMiddleware');

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const admin = getAdmin();

  if (username !== admin.username || password !== admin.passwordHash) {
    return res.status(401).json({
      success: false,
      message: 'Kullanıcı adı veya şifre hatalı!'
    });
  }

  const token = jwt.sign(
    { username: admin.username, role: 'admin' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({
    success: true,
    message: 'Giriş başarılı!',
    token,
    shopInfo: {
      username: admin.username,
      shopName: admin.shopName,
      phone: admin.phone,
      whatsapp: admin.whatsapp,
      address: admin.address
    }
  });
});

// GET /api/auth/me
router.get('/me', verifyToken, (req, res) => {
  const admin = getAdmin();
  res.json({
    success: true,
    shopInfo: {
      username: admin.username,
      shopName: admin.shopName,
      phone: admin.phone,
      whatsapp: admin.whatsapp,
      address: admin.address
    }
  });
});

// PUT /api/auth/profile (Protected)
router.put('/profile', verifyToken, (req, res) => {
  const { shopName, phone, whatsapp, address, newPassword } = req.body;
  const admin = getAdmin();

  if (shopName) admin.shopName = shopName;
  if (phone) admin.phone = phone;
  if (whatsapp) admin.whatsapp = whatsapp;
  if (address) admin.address = address;
  if (newPassword && newPassword.trim().length >= 4) {
    admin.passwordHash = newPassword.trim();
  }

  saveAdmin(admin);

  res.json({
    success: true,
    message: 'Mağaza bilgileri güncellendi.',
    shopInfo: {
      username: admin.username,
      shopName: admin.shopName,
      phone: admin.phone,
      whatsapp: admin.whatsapp,
      address: admin.address
    }
  });
});

module.exports = router;
