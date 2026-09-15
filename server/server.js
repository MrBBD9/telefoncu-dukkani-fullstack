const express = require('express');
const cors = require('cors');
const path = require('path');
const { initStore } = require('./data/store');

const authRoutes = require('./routes/auth');
const phoneRoutes = require('./routes/phones');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize DB / JSON store
initStore();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/phones', phoneRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Telefoncu Backend Sunucusu Hazır! Port: ${PORT}`);
  console.log(`📍 API Adresi: http://localhost:${PORT}/api/phones`);
  console.log(`====================================================`);
});
