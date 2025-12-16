// src/app/admin/page.tsx 
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import RoleSelect from "@/components/RoleSelect";

export default async function AdminPage() {
  const session = await auth();

  if (session?.user.role !== "ADMIN") redirect("/");

  // Verileri paralel çekelim
  const [stats, users] = await Promise.all([
    // İstatistikler
    prisma.$transaction([
      prisma.user.count(),
      prisma.event.count(),
      prisma.participant.count(),
    ]),
    // Tüm Kullanıcılar
    prisma.user.findMany({
      orderBy: { createdAt: "desc" }, // En yeniler üstte
    }),
  ]);

  const [userCount, eventCount, participationCount] = stats;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">Yönetici Paneli 🛡️</h1>
      
      {/* --- İSTATİSTİKLER (Eski kodun aynısı kalabilir veya burayı kullan) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 mt-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <h3 className="text-gray-500">Kullanıcılar</h3>
           <p className="text-3xl font-bold text-blue-600">{userCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <h3 className="text-gray-500">Etkinlikler</h3>
           <p className="text-3xl font-bold text-green-600">{eventCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <h3 className="text-gray-500">Katılımlar</h3>
           <p className="text-3xl font-bold text-purple-600">{participationCount}</p>
        </div>
      </div>

      {/* --- KULLANICI YÖNETİMİ --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-800">Kullanıcı Yönetimi</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-3">Kullanıcı</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Rol</th>
                <th className="px-6 py-3">Kayıt Tarihi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-gray-500">{user.email}</td>
                  <td className="px-6 py-4">
                    {/* Admin kendi rolünü değiştiremesin (Güvenlik) */}
                    {user.id === session?.user.id ? (
                      <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded text-gray-500">
                        SEN (ADMIN)
                      </span>
                    ) : (
                      <RoleSelect userId={user.id} currentRole={user.role} />
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}