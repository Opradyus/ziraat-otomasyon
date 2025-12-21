// src/app/events/page.tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import Search from "@/components/Search";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
  }).format(date);
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("tr-TR", {
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
  
  const { query } = await searchParams; 
  const searchTerm = query || "";

  const events = await prisma.event.findMany({
    where: {
      OR: [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
        { city: { contains: searchTerm, mode: "insensitive" } },
        { district: { contains: searchTerm, mode: "insensitive" } },
        { location: { contains: searchTerm, mode: "insensitive" } }, // Detay adreste de ara
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
      <div className="flex flex-col gap-6 mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-end gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🌾 Tarım Etkinlikleri</h1>
            <p className="text-gray-500 mt-2 max-w-2xl">
              Çiftçiler, üreticiler ve tarım meraklıları için düzenlenen en güncel buluşmaları keşfedin.
            </p>
          </div>
          
          {isOrganizer && (
            <Link
              href="/events/create"
              className="inline-flex items-center px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-all hover:shadow-md whitespace-nowrap"
            >
              + Etkinlik Oluştur
            </Link>
          )}
        </div>

        {/* ARAMA ÇUBUĞU */}
        <div className="w-full">
           <Search placeholder="Etkinlik adı, şehir (Örn: İzmir) veya ilçe ara..." />
        </div>
      </div>

      {/* --- ETKİNLİK LİSTESİ --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-900 font-medium text-lg">
              "{searchTerm}" kriterine uygun etkinlik bulunamadı.
            </p>
            {searchTerm && (
              <a href="/events" className="text-green-600 hover:underline mt-2 text-sm font-medium">
                Tüm etkinlikleri göster
              </a>
            )}
          </div>
        ) : (
          events.map((event) => (
            <Link 
              href={`/events/${event.id}`} 
              key={event.id}
              className="group flex flex-col h-full bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-green-200 transition-all duration-300 overflow-hidden relative"
            >
              {/* KART ÜSTÜ (Kategori ve Tarih) */}
              <div className="p-5 flex justify-between items-start">
                {/* Kategori */}
                {event.category ? (
                  <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
                    {event.category.icon} {event.category.name}
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-md font-bold">GENEL</span>
                )}

                {/* Tarih Kutusu */}
                <div className="text-center bg-gray-50 border border-gray-100 rounded-lg px-3 py-1 min-w-[60px]">
                  <div className="text-xs text-gray-400 font-bold uppercase">{new Intl.DateTimeFormat("tr-TR", { month: "short" }).format(event.date)}</div>
                  <div className="text-xl font-black text-gray-800 leading-none">{new Date(event.date).getDate()}</div>
                </div>
              </div>

              {/* KART İÇERİĞİ */}
              <div className="px-5 pb-6 flex-grow">
                {/* Başlık */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors line-clamp-2">
                  {event.title}
                </h3>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3 font-medium">
                  <span>📍</span>
                  <span>{event.city} / {event.district}</span>
                </div>

                {/* Açıklama */}
                <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">
                  {event.description}
                </p>
              </div>

              <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                 <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-[10px]">
                      {event.createdBy.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="truncate max-w-[100px]">{event.createdBy.name}</span>
                 </div>
                 
                 <div className="flex items-center gap-1 font-mono">
                    🕒 {formatTime(event.date)}
                 </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}