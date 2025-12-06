// src/app/events/create/page.tsx
import { prisma } from "@/lib/prisma"
import EventForm from "@/components/EventForm"

export default async function CreateEventPage() {
  // Veritabanından kategorileri çek
  const categories = await prisma.category.findMany()

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Yeni Etkinlik Oluştur 🌾
        </h1>
        {/* Kategorileri forma gönder */}
        <EventForm categories={categories} />
      </div>
    </div>
  )
}