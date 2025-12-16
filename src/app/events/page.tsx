// src/app/events/page.tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import Search from "@/components/Search"; // <-- YENİ

// Tarih formatlamak için yardımcı fonksiyon
function formatDate(date: Date) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const session = await auth();
  
  // 1. URL'deki arama terimini bekle ve al
  const { query } = await searchParams; 
  const searchTerm = query || "";

  // 2. Prisma sorgusunu güncelle (Filtreleme Mantığı)
  const events = await prisma.event.findMany({
    where: {
      OR: [ // "YA başlıkta geçsin YA DA konumda geçsin" mantığı
        {
          title: {
            contains: searchTerm,
            mode: "insensitive", // Büyük/küçük harf duyarsız (Postgres özelliği)
          },
        },
        {
          location: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ],
    },
    orderBy: {
      date: "asc",
    },
    include: {
      createdBy: true,
      category: true,
    },
  });
const isOrganizer = session?.user?.role === "ADMIN" || session?.user?.role === "ORGANIZER";
  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* --- ÜST KISIM --- */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🌾 Güncel Etkinlikler</h1>
            <p className="text-gray-500 mt-1">
              Şehrinizdeki tarım buluşmalarını keşfedin.
            </p>
          </div>
          
          {isOrganizer && (
            <Link
              href="/events/create"
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors whitespace-nowrap"
            >
              + Yeni Etkinlik
            </Link>
          )}
        </div>

        {/* --- YENİ: ARAMA ÇUBUĞU --- */}
        <div className="w-full sm:max-w-md">
           <Search placeholder="Etkinlik, şehir veya konu ara..." />
        </div>
      </div>

      {/* --- ETKİNLİK LİSTESİ --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">
              "{searchTerm}" ile eşleşen etkinlik bulunamadı.
            </p>
            {searchTerm && (
              <a href="/events" className="text-green-600 hover:underline mt-2 inline-block">
                Aramayı Temizle
              </a>
            )}
          </div>
        ) : (
          events.map((event) => (
             <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 flex flex-col h-full">
                {/* Kategori, Başlık, Konum vs. */}
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-2">
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full font-semibold">
                        📍 {event.location}
                      </span>
                      {event.category && (
                        <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-semibold border border-orange-200">
                          {event.category.icon} {event.category.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.description}</p>
                  
                  {/* ... Butonlar vs ... */}
                  <Link href={`/events/${event.id}`} className="text-green-600 hover:text-green-800 text-sm font-medium w-full text-left block mt-auto">
                    Detayları İncele →
                  </Link>
                </div>
             </div>
          ))
        )}
      </div>
    </div>
  );
}