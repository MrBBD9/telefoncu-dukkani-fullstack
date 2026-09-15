import React, { useState } from 'react';
import { X, RefreshCw, Calculator, MessageSquare, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const SAMPLE_OLD_DEVICES = [
  { name: 'iPhone 11 64GB', baseValue: 14500 },
  { name: 'iPhone 11 128GB', baseValue: 16500 },
  { name: 'iPhone 12 128GB', baseValue: 21000 },
  { name: 'iPhone 12 Pro 128GB', baseValue: 26000 },
  { name: 'iPhone 13 128GB', baseValue: 28500 },
  { name: 'iPhone 13 Pro 128GB', baseValue: 36000 },
  { name: 'iPhone 14 128GB', baseValue: 34000 },
  { name: 'iPhone 14 Pro 128GB', baseValue: 43000 },
  { name: 'Samsung S21 FE 128GB', baseValue: 12500 },
  { name: 'Samsung S22 128GB', baseValue: 17500 },
  { name: 'Samsung S23 128GB', baseValue: 24000 },
  { name: 'Xiaomi 12T 256GB', baseValue: 13500 },
  { name: 'Diğer Model (Özel Teklif İste)', baseValue: 10000 }
];

export default function TradeInModal({ phones, onClose }) {
  const { shopInfo } = useAuth();

  const [selectedDevice, setSelectedDevice] = useState(SAMPLE_OLD_DEVICES[0]);
  const [customDeviceName, setCustomDeviceName] = useState('');
  const [conditionMultiplier, setConditionMultiplier] = useState(1.0); // 1.0 = Kusursuz, 0.9 = Kılcal çizikli, 0.8 = Pil düşük
  const [selectedTargetPhoneId, setSelectedTargetPhoneId] = useState(phones[0]?.id || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(price);
  };

  const calculatedValue = Math.round(selectedDevice.baseValue * conditionMultiplier);
  const targetPhone = phones.find(p => p.id === selectedTargetPhoneId) || phones[0];
  const cashDifference = targetPhone ? Math.max(0, targetPhone.price - calculatedValue) : 0;

  const handleWhatsAppSend = async () => {
    const deviceName = selectedDevice.name.includes('Diğer') ? customDeviceName || 'Eski Cihaz' : selectedDevice.name;
    const targetTitle = targetPhone ? targetPhone.title : 'Yeni Telefon';

    // Submit to backend
    try {
      await api.createPhone; // trigger or call trade-in API endpoint
      fetch('http://localhost:5000/api/phones/trade-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: 'Müşteri',
          customerPhone: customerPhone || 'Belirtilmedi',
          userPhoneModel: deviceName,
          condition: conditionMultiplier === 1.0 ? 'Kusursuz' : conditionMultiplier === 0.9 ? 'Kılcal Çizikli' : 'Yıpranmış / Pil Düşük',
          targetPhoneId: targetPhone?.id,
          estimatedValue: calculatedValue
        })
      });
    } catch (e) {
      console.error(e);
    }

    const message = `Merhaba ${shopInfo.shopName}, Takas Hesaplayıcınız üzerinden teklif aldım!\n\n📱 Benim Cihazım: ${deviceName}\n💰 Tahmini Takas Değeri: ${formatPrice(calculatedValue)}\n🎯 Almak İstediğim Cihaz: ${targetTitle} (${formatPrice(targetPhone?.price)})\n💵 Ödeyeceğim Tahmini Fark: ${formatPrice(cashDifference)}\n\nCihazımı mağazanıza getirip takas yapmak istiyorum.`;

    const cleanNumber = shopInfo.whatsapp.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden my-6 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Eski Telefonunu Sat / Takas Yap</h2>
              <p className="text-xs text-gray-500">Cihazının değerini hesapla, farkı öde yeni telefonuna kavuş!</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Step 1: Select Current Device */}
          <div className="space-y-1.5">
            <label className="block font-bold text-gray-800">
              1. Elinizdeki Eski Telefonun Modelini Seçin
            </label>
            <select
              value={selectedDevice.name}
              onChange={(e) => {
                const found = SAMPLE_OLD_DEVICES.find(d => d.name === e.target.value);
                if (found) setSelectedDevice(found);
              }}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-semibold text-gray-900 focus:outline-none focus:border-emerald-600"
            >
              {SAMPLE_OLD_DEVICES.map(dev => (
                <option key={dev.name} value={dev.name}>{dev.name}</option>
              ))}
            </select>

            {selectedDevice.name.includes('Diğer') && (
              <input
                type="text"
                placeholder="Lütfen marka ve modelinizi yazın (Örn: Huawei P30 Pro 128GB)"
                value={customDeviceName}
                onChange={(e) => setCustomDeviceName(e.target.value)}
                className="w-full mt-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-emerald-600"
              />
            )}
          </div>

          {/* Step 2: Device Condition */}
          <div className="space-y-1.5">
            <label className="block font-bold text-gray-800">
              2. Cihazınızın Kozmetik ve Çalışma Durumu
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setConditionMultiplier(1.0)}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  conditionMultiplier === 1.0 ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold' : 'border-gray-200 bg-gray-50 text-gray-700'
                }`}
              >
                <strong className="block text-xs">Kusursuz / Sıfır Ayarında</strong>
                <span className="text-[10px] text-gray-500">Çiziksiz, tamirli değil, kutulu</span>
              </button>

              <button
                type="button"
                onClick={() => setConditionMultiplier(0.9)}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  conditionMultiplier === 0.9 ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold' : 'border-gray-200 bg-gray-50 text-gray-700'
                }`}
              >
                <strong className="block text-xs">Temiz / Kılcal Çizikli</strong>
                <span className="text-[10px] text-gray-500">Ufak kullanma izleri var</span>
              </button>

              <button
                type="button"
                onClick={() => setConditionMultiplier(0.8)}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  conditionMultiplier === 0.8 ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold' : 'border-gray-200 bg-gray-50 text-gray-700'
                }`}
              >
                <strong className="block text-xs">Yıpranmış / Pil Düşük</strong>
                <span className="text-[10px] text-gray-500">Çizikler var veya servis uyarısı</span>
              </button>
            </div>
          </div>

          {/* Step 3: Target Store Phone */}
          <div className="space-y-1.5">
            <label className="block font-bold text-gray-800">
              3. Mağazamızdan Almak İstediğiniz Telefon
            </label>
            <select
              value={selectedTargetPhoneId}
              onChange={(e) => setSelectedTargetPhoneId(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-semibold text-gray-900 focus:outline-none focus:border-emerald-600"
            >
              {phones.map(p => (
                <option key={p.id} value={p.id}>
                  {p.title} ({formatPrice(p.price)})
                </option>
              ))}
            </select>
          </div>

          {/* Result Calculation Box */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 font-semibold">Eski Cihazınızın Tahmini Değeri:</span>
              <strong className="text-emerald-700 text-sm">{formatPrice(calculatedValue)}</strong>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-emerald-200">
              <span className="text-gray-900 font-bold">Ödeyeceğiniz Tahmini Nakit Farkı:</span>
              <strong className="text-blue-700 text-base font-black">{formatPrice(cashDifference)}</strong>
            </div>
          </div>

          {/* Action Send */}
          <div className="pt-2">
            <button
              onClick={handleWhatsAppSend}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 fill-white/20" />
              <span>Bu Takas Teklifini WhatsApp İle Mağazaya Gönder</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
