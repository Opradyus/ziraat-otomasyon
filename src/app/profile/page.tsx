// src/app/profile/page.tsx
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

// Tarih formatlayıcı
function formatDate(date: Date) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Kullanıcının verilerini, oluşturduğu ve katıldığı etkinliklerle beraber çek
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      // 1. Kendi oluşturduğu etkinlikler
      events: {
        orderBy: { date: "desc" },
      },
      // 2. Katıldığı etkinlikler (Participant tablosu üzerinden Event'e gidiyoruz)
      participations: {
        include: {
          event: true, // Köprü tablosundan asıl etkinlik detayına zıpla
        },
        orderBy: { joinedAt: "desc" },
      },
    },
  });

  if (!user) return <div>Kullanıcı bulunamadı.</div>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* --- PROFİL BAŞLIĞI --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 flex items-center gap-6">
        <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center text-3xl">
          👤
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-gray-500">{user.email}</p>
          <span className="inline-block mt-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-bold uppercase">
            {user.role}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* --- OLUŞTURDUĞUM ETKİNLİKLER --- */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            📢 Oluşturduklarım
            <span className="ml-2 bg-gray-100 text-gray-600 text-sm py-0.5 px-2 rounded-full">
              {user.events.length}
            </span>
          </h2>

          <div className="space-y-4">
            {user.events.length === 0 ? (
              <p className="text-gray-500 text-sm italic">Henüz bir etkinlik oluşturmadınız.</p>
            ) : (
              user.events.map((event) => (
                <Link 
                  href={`/events/${event.id}`} 
                  key={event.id}
                  className="block bg-white p-4 rounded-lg border border-gray-200 hover:border-green-500 transition-colors shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900">{event.title}</h3>
                    <span className="text-xs text-gray-400">{formatDate(event.date)}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">{event.location}</p>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* --- SAĞ KOLON: KATILDIĞIM ETKİNLİKLER --- */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            🎫 Katıldıklarım
            <span className="ml-2 bg-gray-100 text-gray-600 text-sm py-0.5 px-2 rounded-full">
              {user.participations.length}
            </span>
          </h2>

          <div className="space-y-4">
            {user.participations.length === 0 ? (
              <p className="text-gray-500 text-sm italic">Henüz bir etkinliğe katılmadınız.</p>
            ) : (
              user.participations.map((participation) => (
                <Link 
                  href={`/events/${participation.event.id}`} 
                  key={participation.id}
                  className="block bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900">{participation.event.title}</h3>
                    <span className="text-xs text-gray-400">{formatDate(participation.event.date)}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    📍 {participation.event.location}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}