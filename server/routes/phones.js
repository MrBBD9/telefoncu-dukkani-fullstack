const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getPhones, savePhones } = require('../data/store');
const { verifyToken } = require('../middleware/authMiddleware');

// Setup multer storage for uploaded images
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
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// GET /api/phones - Public listing with filters
router.get('/', (req, res) => {
  let phones = getPhones();
  const { search, brand, status, minPrice, maxPrice, sort } = req.query;

  // Search in title, model, description
  if (search && search.trim() !== '') {
    const q = search.toLowerCase().trim();
    phones = phones.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.model.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  // Filter by Brand
  if (brand && brand !== 'Tümü') {
    phones = phones.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
  }

  // Filter by Status (Sıfır / İkinci El / Yenilenmiş)
  if (status && status !== 'Tümü') {
    phones = phones.filter(p => p.status === status);
  }

  // Filter by Min Price
  if (minPrice && !isNaN(Number(minPrice))) {
    phones = phones.filter(p => p.price >= Number(minPrice));
  }

  // Filter by Max Price
  if (maxPrice && !isNaN(Number(maxPrice))) {
    phones = phones.filter(p => p.price <= Number(maxPrice));
  }

  // Sorting
  if (sort === 'price-asc') {
    phones.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    phones.sort((a, b) => b.price - a.price);
  } else if (sort === 'oldest') {
    phones.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else {
    // default: newest
    phones.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  res.json({
    success: true,
    total: phones.length,
    phones
  });
});

// GET /api/phones/:id - Get single details & increment view count
router.get('/:id', (req, res) => {
  const phones = getPhones();
  const phoneIndex = phones.findIndex(p => p.id === req.params.id);

  if (phoneIndex === -1) {
    return res.status(404).json({ success: false, message: 'İlan bulunamadı.' });
  }

  // Increment view counter
  phones[phoneIndex].views = (phones[phoneIndex].views || 0) + 1;
  savePhones(phones);

  res.json({
    success: true,
    phone: phones[phoneIndex]
  });
});

// POST /api/phones/upload-images - Upload image files (Protected)
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

// POST /api/phones - Add new phone listing (Protected)
router.post('/', verifyToken, (req, res) => {
  const {
    title,
    brand,
    model,
    price,
    status,
    storage,
    ram,
    color,
    batteryHealth,
    warrantyStatus,
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
    status: status || 'İkinci El',
    isSold: false,
    storage: storage || '128 GB',
    ram: ram || '8 GB',
    color: color || '',
    batteryHealth: batteryHealth ? Number(batteryHealth) : null,
    warrantyStatus: warrantyStatus || 'Garantisi Bitti',
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
    message: 'Yeni telefon ilanı başarıyla yayınlandı!',
    phone: newPhone
  });
});

// PUT /api/phones/:id - Update listing (Protected)
router.put('/:id', verifyToken, (req, res) => {
  const phones = getPhones();
  const index = phones.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Güncellenecek ilan bulunamadı.' });
  }

  const existing = phones[index];
  const {
    title,
    brand,
    model,
    price,
    status,
    isSold,
    storage,
    ram,
    color,
    batteryHealth,
    warrantyStatus,
    accessories,
    images,
    description
  } = req.body;

  phones[index] = {
    ...existing,
    title: title !== undefined ? title.trim() : existing.title,
    brand: brand !== undefined ? brand.trim() : existing.brand,
    model: model !== undefined ? model.trim() : existing.model,
    price: price !== undefined ? Number(price) : existing.price,
    status: status !== undefined ? status : existing.status,
    isSold: isSold !== undefined ? Boolean(isSold) : existing.isSold,
    storage: storage !== undefined ? storage : existing.storage,
    ram: ram !== undefined ? ram : existing.ram,
    color: color !== undefined ? color : existing.color,
    batteryHealth: batteryHealth !== undefined ? (batteryHealth ? Number(batteryHealth) : null) : existing.batteryHealth,
    warrantyStatus: warrantyStatus !== undefined ? warrantyStatus : existing.warrantyStatus,
    accessories: accessories !== undefined ? accessories : existing.accessories,
    images: images !== undefined && Array.isArray(images) && images.length > 0 ? images : existing.images,
    description: description !== undefined ? description : existing.description
  };

  savePhones(phones);

  res.json({
    success: true,
    message: 'İlan başarıyla güncellendi.',
    phone: phones[index]
  });
});

// PATCH /api/phones/:id/toggle-sold - Toggle sold status (Protected)
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
    message: phones[index].isSold ? 'İlan "Satıldı" olarak işaretlendi.' : 'İlan yayına tekrar alındı.',
    phone: phones[index]
  });
});

// DELETE /api/phones/:id - Delete listing (Protected)
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
    message: 'İlan başarıyla silindi.'
  });
});

module.exports = router;
