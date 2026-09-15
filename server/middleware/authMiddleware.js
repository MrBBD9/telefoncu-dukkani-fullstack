const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'telefoncu_dukkani_secret_key_2026';

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Yetkilendirme başlığı eksik.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Erişim jetonu bulunamadı.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Geçersiz veya süresi dolmuş oturum jetonu.' });
  }
}

module.exports = { verifyToken, JWT_SECRET };
