// src/app/events/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import DeleteEventButton from "@/components/DeleteEventButton";
import JoinButton from "@/components/JoinButton";

// Tarih formatlayıcı
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

  // Veritabanından etkinliği ve ilişkileri çek
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      createdBy: true,
      participants: true, 
    },
  });

  if (!event) {
    notFound();
  }

  // --- YETKİ VE DURUM KONTROLLERİ ---
  
  // 1. Silme Yetkisi (Admin veya Sahibi)
  const isOwner = session?.user?.id === event.userId;
  const isAdmin = session?.user?.role === "ADMIN";
  const canDelete = isOwner || isAdmin;

  // 2. Katılım Durumu
  const isJoined = event.participants.some(
    (p) => p.userId === session?.user?.id
  );

  const attendeeCount = event.participants.length;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Geri Dön Linki */}
      <Link
        href="/events"
        className="text-gray-500 hover:text-green-600 mb-6 inline-flex items-center text-sm font-medium transition-colors"
      >
        ← Tüm Etkinliklere Dön
      </Link>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        {/* Üst Başlık Kısmı */}
        <div className="bg-green-600 px-8 py-10 text-white">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{event.title}</h1>
          <div className="flex flex-wrap gap-4 text-green-100 text-sm font-medium">
            <span className="flex items-center bg-green-700/50 px-3 py-1 rounded-full">
              📍 {event.location}
            </span>
            <span className="flex items-center bg-green-700/50 px-3 py-1 rounded-full">
              📅 {formatDate(event.date)}
            </span>
            <span className="flex items-center bg-green-700/50 px-3 py-1 rounded-full">
              👤 {event.createdBy.name || "Bilinmiyor"}
            </span>
          </div>
        </div>

        {/* İçerik Kısmı */}
        <div className="p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Etkinlik Hakkında</h3>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg mb-8">
            {event.description}
          </p>

          {/* KATIL BUTONU ALANI */}
          <div className="bg-green-50 rounded-xl p-6 border border-green-100 flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div>
              <h4 className="font-bold text-green-900">Orada Olacak Mısın?</h4>
              <p className="text-green-700 text-sm">Katılım durumunu buradan yönetebilirsin.</p>
            </div>
            <JoinButton 
              eventId={event.id} 
              isJoined={isJoined} 
              attendeeCount={attendeeCount} 
            />
          </div>

          {/* ALT BİLGİ VE SİLME BUTONU */}
          <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
             <span className="text-gray-400 text-sm">
               Oluşturulma: {formatDate(event.createdAt)}
             </span>
             
             {/* SİLME BUTONU  */}
             {canDelete && (
               <DeleteEventButton eventId={event.id} />
             )}
          </div>
        </div>
      </div>
    </div>
  );
}