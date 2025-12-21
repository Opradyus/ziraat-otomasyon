// src/components/EventForm.tsx
"use client"

import { createEvent } from "@/actions/create-event"
import { useState } from "react"
import { TURKEY_CITIES } from "@/constants/cities" // Yeni veri seti

// Kategorileri dışarıdan (Server'dan) alacağız
interface EventFormProps {
  categories: { id: string; name: string; icon: string | null }[]
}

export default function EventForm({ categories }: EventFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [selectedCityName, setSelectedCityName] = useState<string>("")

  // YENİ MANTIK: Seçilen isme göre o şehrin OBJESİNİ buluyoruz
  // Eğer şehir seçilmediyse boş dizi [] döner
  const currentDistricts = selectedCityName 
    ? TURKEY_CITIES.find(c => c.name === selectedCityName)?.counties || []
    : [];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    const formData = new FormData(event.currentTarget)
    const result = await createEvent(formData)
    if (result?.error) setError(result.error)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
       {/* Hata Mesajı Alanı */}
       {error && <div className="text-red-600 bg-red-50 p-3 rounded">{error}</div>}

       {/* --- YENİ KATEGORİ SEÇİMİ --- */}
       <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Seçin</label>
        <select 
          name="categoryId" 
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500"
        >
          <option value="">Bir kategori seçin...</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* --- DİĞER ALANLAR (Aynen Kopyala) --- */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
        <input type="text" name="title" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
        <textarea name="description" rows={3} required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* İL SEÇİMİ */}
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
              <option key={city.plate} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* İLÇE SEÇİMİ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">İlçe</label>
          <select 
            name="district" 
            required 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 disabled:bg-gray-100 capitalize"
            disabled={!selectedCityName}
          >
            <option value="">
              {selectedCityName ? "İlçe Seçiniz..." : "Önce İl Seçiniz"}
            </option>
            {/* Bulduğumuz ilçeleri listeliyoruz */}
            {currentDistricts.map((dist) => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>
        </div>
      </div>

          
       <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Konum Detayı / Açık Adres</label>
          <input type="text" name="location" required placeholder="Örn: Meydan, Saat Kulesi Önü" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
      </div>

      <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
          <input type="datetime-local" name="date" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
        <textarea name="description" rows={3} required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
      </div>

      <button type="submit" className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700">
        Etkinliği Yayınla
      </button>
    </form>
  )
}