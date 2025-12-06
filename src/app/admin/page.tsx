// src/app/admin/page.tsx
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminPage() {
  const session = await auth();

  // 1. Güvenlik Kontrolü
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md border border-red-200">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Erişim Engellendi! ⛔</h1>
          <p>Bu sayfayı görüntüleme yetkiniz yok.</p>
          <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  // 2. İstatistikleri Veritabanından Çek (Parallel Fetching)
  // Promise.all kullanarak 3 sorguyu aynı anda atıyoruz, bu sayede çok hızlı çalışır.
  const [userCount, eventCount, participationCount, recentEvents] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.participant.count(),
    // Son eklenen 5 etkinliği de çekelim
    prisma.event.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { createdBy: true },
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">Yönetici Paneli 🛠️</h1>
      <p className="text-gray-500 mb-8">Sistemin genel durumunu buradan takip edebilirsiniz.</p>
      
      {/* --- İSTATİSTİK KARTLARI --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Kullanıcı Sayısı */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-500">Toplam Kullanıcı</h3>
            <p className="text-4xl font-bold text-blue-600 mt-2">{userCount}</p>
          </div>
          <div className="text-3xl bg-blue-50 p-3 rounded-full">👥</div>
        </div>

        {/* Etkinlik Sayısı */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-500">Aktif Etkinlikler</h3>
            <p className="text-4xl font-bold text-green-600 mt-2">{eventCount}</p>
          </div>
          <div className="text-3xl bg-green-50 p-3 rounded-full">🌾</div>
        </div>

        {/* Toplam Katılım */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-500">Toplam Katılım</h3>
            <p className="text-4xl font-bold text-purple-600 mt-2">{participationCount}</p>
          </div>
          <div className="text-3xl bg-purple-50 p-3 rounded-full">🎫</div>
        </div>
      </div>

      {/* --- SON EKLENENLER TABLOSU --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-800">Son Eklenen Etkinlikler</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm whitespace-nowrap">
            <thead className="uppercase tracking-wider border-b-2 border-gray-100 bg-gray-50/50">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium text-gray-500">Etkinlik Başlığı</th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-500">Konum</th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-500">Oluşturan</th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-500">Tarih</th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-500">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {recentEvents.map((event) => (
                <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">{event.title}</td>
                  <td className="px-6 py-4 text-gray-600">{event.location}</td>
                  <td className="px-6 py-4 text-gray-600">{event.createdBy.name || "Anonim"}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(event.date).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-6 py-4">
                    <Link 
                      href={`/events/${event.id}`} 
                      className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                    >
                      Görüntüle
                    </Link>
                  </td>
                </tr>
              ))}
              {recentEvents.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 italic">
                    Henüz veri yok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 