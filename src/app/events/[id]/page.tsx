// src/app/events/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import DeleteEventButton from "@/components/DeleteEventButton";
import JoinButton from "@/components/JoinButton";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      createdBy: true,
      participants: true,
      category: true, // Kategoriyi de çekelim
    },
  });

  if (!event) notFound();

  // Yetki Kontrolleri
  const isOwner = session?.user?.id === event.userId;
  const isAdmin = session?.user?.role === "ADMIN";
  const canDelete = isOwner || isAdmin;
  const canEdit = canDelete; // Düzenleme yetkisi silme ile aynı

  const isJoined = event.participants.some((p) => p.userId === session?.user?.id);
  const attendeeCount = event.participants.length;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Üst Link */}
      <Link
        href="/events"
        className="text-gray-500 hover:text-green-600 mb-6 inline-flex items-center text-sm font-medium transition-colors"
      >
        ← Tüm Etkinliklere Dön
      </Link>

      {/* --- YENİ DÜZEN: 2 KOLONLU GRID (SOL: İÇERİK, SAĞ: KÜNYE) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SOL TARAF (ANA İÇERİK - 2 BİRİM GENİŞLİK) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Başlık Kartı */}
          <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100 p-8">
             {/* Kategori Rozeti */}
             {event.category && (
               <span className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-bold mb-4 uppercase tracking-wide">
                 {event.category.icon} {event.category.name}
               </span>
             )}
             
             <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
               {event.title}
             </h1>

             <div className="prose prose-green max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
               {event.description}
             </div>
          </div>

          {/* Katılım Kartı */}
          <div className="bg-white shadow-sm rounded-2xl p-6 border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h4 className="font-bold text-gray-900">Etkinliğe Katılacak Mısın?</h4>
              <p className="text-gray-500 text-sm">Şu an {attendeeCount} kişi katılıyor.</p>
            </div>
            <JoinButton eventId={event.id} isJoined={isJoined} attendeeCount={attendeeCount} />
          </div>

          {/* Yönetici Paneli (Sadece yetkiliye) */}
          {canEdit && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex justify-between items-center">
              <span className="text-sm text-gray-500 font-medium">Yönetici İşlemleri:</span>
              <div className="flex gap-3">
                <Link
                  href={`/events/${event.id}/edit`}
                  className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition shadow-sm"
                >
                  Düzenle ✏️
                </Link>
                <DeleteEventButton eventId={event.id} />
              </div>
            </div>
          )}
        </div>

        {/* SAĞ TARAF (YAN KUTUCUK / SIDEBAR - 1 BİRİM GENİŞLİK) */}
        <div className="space-y-6">
          
          {/* 1. Konum Kutusu */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              📍 Konum Bilgileri
            </h3>
            
            <div className="space-y-4">
              {/* İl / İlçe */}
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Şehir / İlçe</p>
                <p className="text-lg font-medium text-gray-800">
                  {event.city} <span className="text-gray-400">/</span> {event.district}
                </p>
              </div>

              {/* Detay Adres */}
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Açık Adres</p>
                <p className="text-gray-600 text-sm leading-snug bg-gray-50 p-3 rounded-lg border border-gray-200">
                  {event.location}
                </p>
              </div>
              
              {/* Haritada Göster Butonu (Opsiyonel Güzellik) */}
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.city} ${event.district} ${event.location}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center text-blue-600 text-sm font-medium hover:underline mt-2"
              >
                Haritada Göster 🗺️
              </a>
            </div>
          </div>

          {/* 2. Tarih ve Saat Kutusu */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              📅 Tarih ve Saat
            </h3>
            <p className="text-lg font-medium text-gray-800 capitalize">
              {formatDate(event.date)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              (Eklenme: {formatDate(event.createdAt).split(" ")[0]})
            </p>
          </div>

          {/* 3. Organizatör Kutusu */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              👤 Organizatör
            </h3>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">
                {event.createdBy.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-medium text-gray-900">{event.createdBy.name || "Anonim"}</p>
                <p className="text-xs text-gray-500">{event.createdBy.email}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}