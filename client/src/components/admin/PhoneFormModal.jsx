import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Upload, FileImage, Check, Smartphone } from 'lucide-react';
import { api } from '../../services/api';

const DEFAULT_ACCESSORIES = [
  'Orijinal Kutu',
  'Fatura var',
  'Orijinal Şarj Kablosu',
  'Adaptör',
  'Hediye Kılıf & Ekran Koruyucu',
  'Kulaklık'
];

const BRANDS = ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Honor', 'Oppo', 'Realme', 'Poco', 'OnePlus', 'Diğer'];
const QUICK_STORAGES = ['64 GB', '128 GB', '256 GB', '512 GB', '1 TB', '2 TB'];
const QUICK_RAMS = ['3 GB', '4 GB', '6 GB', '8 GB', '12 GB', '16 GB', '18 GB', '24 GB'];

export default function PhoneFormModal({ phoneToEdit, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('Apple');
  const [model, setModel] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState('İkinci El');
  const [storage, setStorage] = useState('128 GB');
  const [ram, setRam] = useState('8 GB');
  const [color, setColor] = useState('');
  const [batteryHealth, setBatteryHealth] = useState('');
  const [warrantyStatus, setWarrantyStatus] = useState('1 Yıl Garantili');
  const [accessories, setAccessories] = useState(['Orijinal Kutu', 'Fatura var']);
  
  const [images, setImages] = useState([]);
  const [urlInput, setUrlInput] = useState('');
  const [description, setDescription] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (phoneToEdit) {
      setTitle(phoneToEdit.title || '');
      setBrand(phoneToEdit.brand || 'Apple');
      setModel(phoneToEdit.model || '');
      setPrice(phoneToEdit.price || '');
      setStatus(phoneToEdit.status || 'İkinci El');
      setStorage(phoneToEdit.storage || '128 GB');
      setRam(phoneToEdit.ram || '8 GB');
      setColor(phoneToEdit.color || '');
      setBatteryHealth(phoneToEdit.batteryHealth || '');
      setWarrantyStatus(phoneToEdit.warrantyStatus || '');
      setAccessories(phoneToEdit.accessories || []);
      setImages(phoneToEdit.images || []);
      setDescription(phoneToEdit.description || '');
    }
  }, [phoneToEdit]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    files.forEach(file => {
      if (!file.type.startsWith('image/')) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target.result;
        setImages(prev => [...prev, base64Url]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    setImages(prev => [...prev, urlInput.trim()]);
    setUrlInput('');
  };

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const toggleAccessory = (acc) => {
    if (accessories.includes(acc)) {
      setAccessories(accessories.filter(a => a !== acc));
    } else {
      setAccessories([...accessories, acc]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !price || !brand) {
      setError('Lütfen İlan Başlığı, Marka ve Fiyat alanlarını doldurunuz.');
      return;
    }

    const finalImages = images.length > 0 ? images : [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80"
    ];

    const payload = {
      title,
      brand,
      model,
      price: Number(price),
      status,
      storage,
      ram,
      color,
      batteryHealth: batteryHealth ? Number(batteryHealth) : null,
      warrantyStatus,
      accessories,
      images: finalImages,
      description
    };

    setLoading(true);
    try {
      let res;
      if (phoneToEdit) {
        res = await api.updatePhone(phoneToEdit.id, payload);
      } else {
        res = await api.createPhone(payload);
      }

      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.message || 'İşlem başarısız.');
      }
    } catch (err) {
      setError('Sunucu hatası oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden my-6 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50 sticky top-0 z-20">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-600" />
            <span>{phoneToEdit ? 'İlanı Düzenle' : 'Yeni Telefon İlanı Ekle'}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 font-semibold">
              {error}
            </div>
          )}

          {/* Title & Brand & Price Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            
            <div className="sm:col-span-8">
              <label className="block font-bold text-gray-700 mb-1">
                İlan Başlığı *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: iPhone 15 Pro Max 256GB Naturel Titanyum - Çiziksiz"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block font-bold text-gray-700 mb-1">
                Fiyat (TL) *
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Örn: 58500"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold text-blue-700 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

          </div>

          {/* Brand, Model, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Marka *
              </label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-blue-600"
              >
                {BRANDS.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Model
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Örn: 15 Pro Max, S24 Ultra"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Cihaz Durumu
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-blue-600"
              >
                <option value="Sıfır">Sıfır (Kapalı Kutu)</option>
                <option value="İkinci El">İkinci El (Kullanılmış)</option>
                <option value="Yenilenmiş">Yenilenmiş (A+ Kalite)</option>
              </select>
            </div>

          </div>

          {/* CUSTOM RAM & CUSTOM STORAGE WITH QUICK SELECTION PILLS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-xl bg-gray-50 border border-gray-200">
            
            <div>
              <label className="block font-bold text-gray-800 mb-1">
                Depolama (Hafıza) (Özel Değer Girilebilir)
              </label>
              <input
                type="text"
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
                placeholder="Örn: 256 GB veya 1 TB + 512 GB"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-blue-600 mb-1.5"
              />
              <div className="flex flex-wrap gap-1">
                <span className="text-[10px] text-gray-500 font-semibold self-center mr-1">Hızlı Seç:</span>
                {QUICK_STORAGES.map(s => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setStorage(s)}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-colors ${
                      storage === s ? 'bg-blue-600 text-white border-blue-600 font-bold' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1">
                RAM Bellek (Özel Değer Girilebilir)
              </label>
              <input
                type="text"
                value={ram}
                onChange={(e) => setRam(e.target.value)}
                placeholder="Örn: 8 GB veya 18 GB (12+6 Sanal RAM)"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-blue-600 mb-1.5"
              />
              <div className="flex flex-wrap gap-1">
                <span className="text-[10px] text-gray-500 font-semibold self-center mr-1">Hızlı Seç:</span>
                {QUICK_RAMS.map(r => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setRam(r)}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-colors ${
                      ram === r ? 'bg-blue-600 text-white border-blue-600 font-bold' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Color, Battery, Warranty */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Renk
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="Örn: Uzay Siyahı, Titanyum"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Pil Sağlığı (%) (iPhone)
              </label>
              <input
                type="number"
                min="50"
                max="100"
                value={batteryHealth}
                onChange={(e) => setBatteryHealth(e.target.value)}
                placeholder="Örn: 95"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Garanti Durumu
              </label>
              <input
                type="text"
                value={warrantyStatus}
                onChange={(e) => setWarrantyStatus(e.target.value)}
                placeholder="Örn: 18 Ay Türkiye Apple Garantili"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-blue-600"
              />
            </div>

          </div>

          {/* GALLERY IMAGE UPLOAD SECTION */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-gray-900 flex items-center gap-1.5">
                <FileImage className="w-4 h-4 text-blue-600" />
                <span>Telefon Fotoğrafları (Galeriden veya Bağlantı İle)</span>
              </label>
              <span className="text-[11px] text-gray-500 font-medium">Toplam {images.length} fotoğraf</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all">
                <Upload className="w-4 h-4" />
                <span>📱 Galeriden Fotoğraf Yükle</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Veya Görsel URL Bağlantısı Yapıştırın (https://...)"
                className="flex-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-blue-600"
              />
              <button
                type="button"
                onClick={handleAddUrl}
                className="px-3 py-1.5 rounded-lg bg-gray-800 text-white font-bold text-xs hover:bg-gray-900"
              >
                URL Ekle
              </button>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-2">
                {images.map((imgUrl, idx) => (
                  <div key={idx} className="relative group w-full h-24 rounded-lg overflow-hidden border border-gray-300 bg-white">
                    <img src={imgUrl} alt={`Yüklenen ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 rounded bg-slate-800 text-white opacity-90 hover:bg-red-600 transition-colors"
                      title="Kaldır"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Accessories Checkboxes */}
          <div>
            <label className="block font-bold text-gray-700 mb-2">
              Yanında Verilecek Aksesuarlar
            </label>
            <div className="flex flex-wrap gap-1.5">
              {DEFAULT_ACCESSORIES.map(acc => {
                const checked = accessories.includes(acc);
                return (
                  <button
                    type="button"
                    key={acc}
                    onClick={() => toggleAccessory(acc)}
                    className={`px-3 py-1 rounded-lg text-xs transition-all flex items-center gap-1.5 ${
                      checked
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold'
                        : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    <Check className={`w-3.5 h-3.5 ${checked ? 'opacity-100' : 'opacity-0'}`} />
                    <span>{acc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              İlan Açıklaması
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Cihazın kozmetik durumu, batarya sağlığı ve diğer detaylar..."
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-blue-600"
            ></textarea>
          </div>

          {/* Submit Action */}
          <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold text-xs transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              {loading ? 'Kaydediliyor...' : phoneToEdit ? 'Değişiklikleri Kaydet' : 'İlanı Yayınla'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
