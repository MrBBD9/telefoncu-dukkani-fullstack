const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getPhones, savePhones, getTradeIns, saveTradeIns } = require('../data/store');
const { verifyToken } = require('../middleware/authMiddleware');

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'phone-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// GET /api/phones - Public listing with filters
router.get('/', (req, res) => {
  let phones = getPhones();
  const { search, brand, status, minPrice, maxPrice, sort } = req.query;

  if (search && search.trim() !== '') {
    const q = search.toLowerCase().trim();
    phones = phones.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.model.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  if (brand && brand !== 'Tümü') {
    phones = phones.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
  }

  if (status && status !== 'Tümü') {
    phones = phones.filter(p => p.status === status);
  }

  if (minPrice && !isNaN(Number(minPrice))) {
    phones = phones.filter(p => p.price >= Number(minPrice));
  }

  if (maxPrice && !isNaN(Number(maxPrice))) {
    phones = phones.filter(p => p.price <= Number(maxPrice));
  }

  if (sort === 'price-asc') {
    phones.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    phones.sort((a, b) => b.price - a.price);
  } else if (sort === 'oldest') {
    phones.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else {
    phones.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  res.json({
    success: true,
    total: phones.length,
    phones
  });
});

// GET /api/phones/:id
router.get('/:id', (req, res) => {
  const phones = getPhones();
  const phoneIndex = phones.findIndex(p => p.id === req.params.id);

  if (phoneIndex === -1) {
    return res.status(404).json({ success: false, message: 'İlan bulunamadı.' });
  }

  phones[phoneIndex].views = (phones[phoneIndex].views || 0) + 1;
  savePhones(phones);

  res.json({
    success: true,
    phone: phones[phoneIndex]
  });
});

// POST /api/phones/upload-images
router.post('/upload-images', verifyToken, upload.array('images', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'Hiçbir dosya yüklenmedi.' });
  }

  const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
  res.json({
    success: true,
    imageUrls
  });
});

// POST /api/phones - Add listing
router.post('/', verifyToken, (req, res) => {
  const {
    title,
    brand,
    model,
    price,
    costPrice,
    originalPrice,
    status,
    storage,
    ram,
    color,
    batteryHealth,
    warrantyStatus,
    cosmeticRating,
    processor,
    screen,
    camera,
    simType,
    exchangeAvailable,
    accessories,
    images,
    description
  } = req.body;

  if (!title || !brand || !price) {
    return res.status(400).json({
      success: false,
      message: 'İlan başlığı, marka ve fiyat alanları zorunludur.'
    });
  }

  const phones = getPhones();
  const newPhone = {
    id: 'phone-' + Date.now(),
    title: title.trim(),
    brand: brand.trim(),
    model: model ? model.trim() : '',
    price: Number(price),
    costPrice: (costPrice !== undefined && costPrice !== null && costPrice !== '' && !isNaN(Number(costPrice))) ? Number(costPrice) : null,
    originalPrice: originalPrice ? Number(originalPrice) : null,
    status: status || 'İkinci El',
    isSold: false,
    storage: storage || '128 GB',
    ram: ram || '8 GB',
    color: color || '',
    batteryHealth: batteryHealth ? Number(batteryHealth) : null,
    warrantyStatus: warrantyStatus || 'Garantisi Bitti',
    cosmeticRating: cosmeticRating || '9.5 / 10',
    processor: processor || '',
    screen: screen || '',
    camera: camera || '',
    simType: simType || 'BTK Kayıtlı',
    exchangeAvailable: exchangeAvailable !== undefined ? Boolean(exchangeAvailable) : true,
    accessories: Array.isArray(accessories) ? accessories : [],
    images: Array.isArray(images) && images.length > 0 ? images : [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80"
    ],
    description: description || '',
    createdAt: new Date().toISOString(),
    views: 0
  };

  phones.unshift(newPhone);
  savePhones(phones);

  res.status(201).json({
    success: true,
    message: 'Yeni telefon ilanı yayınlandı!',
    phone: newPhone
  });
});

// PUT /api/phones/:id - Update listing
router.put('/:id', verifyToken, (req, res) => {
  const phones = getPhones();
  const index = phones.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'İlan bulunamadı.' });
  }

  const existing = phones[index];
  const {
    title, brand, model, price, costPrice, originalPrice, status, isSold, storage, ram, color,
    batteryHealth, warrantyStatus, cosmeticRating, processor, screen, camera, simType,
    exchangeAvailable, accessories, images, description
  } = req.body;

  phones[index] = {
    ...existing,
    title: title !== undefined ? title.trim() : existing.title,
    brand: brand !== undefined ? brand.trim() : existing.brand,
    model: model !== undefined ? model.trim() : existing.model,
    price: price !== undefined ? Number(price) : existing.price,
    costPrice: costPrice !== undefined ? (costPrice !== null && costPrice !== '' && !isNaN(Number(costPrice)) ? Number(costPrice) : null) : existing.costPrice,
    originalPrice: originalPrice !== undefined ? (originalPrice ? Number(originalPrice) : null) : existing.originalPrice,
    status: status !== undefined ? status : existing.status,
    isSold: isSold !== undefined ? Boolean(isSold) : existing.isSold,
    storage: storage !== undefined ? storage : existing.storage,
    ram: ram !== undefined ? ram : existing.ram,
    color: color !== undefined ? color : existing.color,
    batteryHealth: batteryHealth !== undefined ? (batteryHealth ? Number(batteryHealth) : null) : existing.batteryHealth,
    warrantyStatus: warrantyStatus !== undefined ? warrantyStatus : existing.warrantyStatus,
    cosmeticRating: cosmeticRating !== undefined ? cosmeticRating : existing.cosmeticRating,
    processor: processor !== undefined ? processor : existing.processor,
    screen: screen !== undefined ? screen : existing.screen,
    camera: camera !== undefined ? camera : existing.camera,
    simType: simType !== undefined ? simType : existing.simType,
    exchangeAvailable: exchangeAvailable !== undefined ? Boolean(exchangeAvailable) : existing.exchangeAvailable,
    accessories: accessories !== undefined ? accessories : existing.accessories,
    images: images !== undefined && Array.isArray(images) && images.length > 0 ? images : existing.images,
    description: description !== undefined ? description : existing.description
  };

  savePhones(phones);

  res.json({
    success: true,
    message: 'İlan güncellendi.',
    phone: phones[index]
  });
});

// PATCH /api/phones/:id/toggle-sold
router.patch('/:id/toggle-sold', verifyToken, (req, res) => {
  const phones = getPhones();
  const index = phones.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'İlan bulunamadı.' });
  }

  phones[index].isSold = !phones[index].isSold;
  savePhones(phones);

  res.json({
    success: true,
    message: phones[index].isSold ? 'İlan "Satıldı" yapıldı.' : 'İlan tekrar yayında.',
    phone: phones[index]
  });
});

// DELETE /api/phones/:id
router.delete('/:id', verifyToken, (req, res) => {
  let phones = getPhones();
  const exists = phones.some(p => p.id === req.params.id);

  if (!exists) {
    return res.status(404).json({ success: false, message: 'Silinecek ilan bulunamadı.' });
  }

  phones = phones.filter(p => p.id !== req.params.id);
  savePhones(phones);

  res.json({
    success: true,
    message: 'İlan silindi.'
  });
});

// POST /api/phones/trade-in - Submit trade-in quote request
router.post('/trade-in', (req, res) => {
  const { customerName, customerPhone, userPhoneModel, condition, targetPhoneId, estimatedValue } = req.body;

  if (!customerPhone || !userPhoneModel) {
    return res.status(400).json({ success: false, message: 'Telefon numarası ve cihaz modeli zorunludur.' });
  }

  const tradeIns = getTradeIns();
  const newTradeIn = {
    id: 'trade-' + Date.now(),
    customerName: customerName || 'Anonim Müşteri',
    customerPhone,
    userPhoneModel,
    condition: condition || 'İkinci El - Temiz',
    targetPhoneId: targetPhoneId || null,
    estimatedValue: estimatedValue || 0,
    createdAt: new Date().toISOString()
  };

  tradeIns.unshift(newTradeIn);
  saveTradeIns(tradeIns);

  res.status(201).json({
    success: true,
    message: 'Takas talebiniz alındı!',
    tradeIn: newTradeIn
  });
});

// GET /api/phones/trade-in - Protected list trade ins
router.get('/trade-in/list', verifyToken, (req, res) => {
  const tradeIns = getTradeIns();
  res.json({
    success: true,
    tradeIns
  });
});

module.exports = router;
