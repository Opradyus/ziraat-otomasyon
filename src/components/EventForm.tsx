// src/components/EventForm.tsx
"use client"

import { createEvent } from "@/actions/create-event"
import { useState } from "react"

// Kategorileri dışarıdan (Server'dan) alacağız
interface EventFormProps {
  categories: { id: string; name: string; icon: string | null }[]
}

export default function EventForm({ categories }: EventFormProps) {
  const [error, setError] = useState<string | null>(null)

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

      <div className="grid grid-cols-2 gap-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Konum</label>
            <input type="text" name="location" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
            <input type="datetime-local" name="date" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
        </div>
      </div>

      <button type="submit" className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700">
        Etkinliği Yayınla
      </button>
    </form>
  )
}