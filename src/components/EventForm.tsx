// src/components/EventForm.tsx
"use client"

import { createEvent } from "@/actions/create-event"
import { useState } from "react"
import { TURKEY_CITIES } from "@/constants/cities" // Yeni veri seti
import { updateEvent } from "@/actions/update-event"

// Kategorileri dışarıdan (Server'dan) alacağız
interface EventData {
  id: string;
  title: string;
  description: string;
  location: string;
  city: string;
  district: string;
  date: Date;
  categoryId: string | null;
}

interface EventFormProps {
  categories: { id: string; name: string; icon: string | null }[];
  initialData?: EventData; // <-- YENİ: Düzenlenecek veri (Opsiyonel)
}

export default function EventForm({ categories, initialData }: EventFormProps) {
  const [error, setError] = useState<string | null>(null)
  
  // State'leri initialData varsa onunla başlatıyoruz, yoksa boş
  const [selectedCityName, setSelectedCityName] = useState<string>(initialData?.city || "")
  
  // Tarihi input formatına (YYYY-MM-DDTHH:MM) çevirmemiz lazım
  const defaultDate = initialData?.date 
    ? new Date(initialData.date).toISOString().slice(0, 16) 
    : "";

  const currentDistricts = selectedCityName 
    ? TURKEY_CITIES.find(c => c.name === selectedCityName)?.counties || []
    : [];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    const formData = new FormData(event.currentTarget)
    
    // KARAR ANI: Ekleme mi yapacağız, Güncelleme mi?
    let result;
    if (initialData) {
      // Güncelleme Modu
      result = await updateEvent(initialData.id, formData)
    } else {
      // Ekleme Modu
      result = await createEvent(formData)
    }

    if (result?.error) setError(result.error)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
       {error && <div className="text-red-600 bg-red-50 p-3 rounded">{error}</div>}

       {/* KATEGORİ */}
       <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
        <select 
          name="categoryId" 
          required 
          defaultValue={initialData?.categoryId || ""} // Varsayılan değer
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500"
        >
          <option value="">Seçiniz...</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
          ))}
        </select>
      </div>

      {/* BAŞLIK */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
        <input 
          type="text" 
          name="title" 
          required 
          defaultValue={initialData?.title} // Varsayılan değer
          className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
        />
      </div>

      {/* KONUM SEÇİMİ (State ile yönetiliyor) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">İl</label>
          <select 
            name="city" 
            required 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 capitalize"
            value={selectedCityName}
            onChange={(e) => setSelectedCityName(e.target.value)}
          >
            <option value="">İl Seçiniz...</option>
            {TURKEY_CITIES.map((city) => (
              <option key={city.plate} value={city.name}>{city.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">İlçe</label>
          <select 
            name="district" 
            required 
            defaultValue={initialData?.district} // İlçe için defaultValue kullanabiliriz
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 disabled:bg-gray-100 capitalize"
            disabled={!selectedCityName}
          >
            <option value="">İlçe Seçiniz...</option>
            {currentDistricts.map((dist) => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>
        </div>
      </div>

      {/* DETAY ADRES */}
      <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Konum Detayı</label>
          <input 
            type="text" 
            name="location" 
            required 
            defaultValue={initialData?.location}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
          />
      </div>

      {/* TARİH */}
      <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
          <input 
            type="datetime-local" 
            name="date" 
            required 
            defaultValue={defaultDate} // Formatlanmış tarih
            className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
          />
      </div>

      {/* AÇIKLAMA */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
        <textarea 
          name="description" 
          rows={3} 
          required 
          defaultValue={initialData?.description}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
        />
      </div>

      {/* BUTON METNİ DEĞİŞKEN */}
      <button type="submit" className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700">
        {initialData ? "Değişiklikleri Kaydet" : "Etkinliği Yayınla"}
      </button>
    </form>
  )
}