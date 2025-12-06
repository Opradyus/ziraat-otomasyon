// src/components/Navbar.tsx
import Link from "next/link";
import { auth, signOut } from "@/auth";

export default async function Navbar() {
  // Oturum bilgisini sunucu tarafında çekiyoruz
  const session = await auth();
  const user = session?.user;

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* --- SOL TARAFTAKİ LOGO VE LİNKLER --- */}
          <div className="flex">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-green-700">🌱 ZiraatApp</span>
            </Link>

            {/* Menü Linkleri */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-green-500 hover:text-green-600 transition"
              >
                Ana Sayfa
              </Link>
              <Link
                href="/events"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:border-green-500 hover:text-green-600 transition"
              >
                Etkinlikler
              </Link>
              
              {/* Sadece ADMIN ise görünecek link */}
              {user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-red-600 border-b-2 border-transparent hover:border-red-500 transition"
                >
                  Admin Paneli 🛡️
                </Link>
              )}
            </div>
          </div>

          {/* --- SAĞ TARAFTAKİ KULLANICI İŞLEMLERİ --- */}
          <div className="flex items-center">
            {user ? (
              // Giriş Yapmış Kullanıcı Görünümü
              <div className="flex items-center space-x-4">
                <Link href="/profile" className="text-right hidden md:block cursor-pointer hover:opacity-80">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.role}</div>
                </Link>
                
                {/* Çıkış Yap Butonu (Server Action ile) */}
                <form
                  action={async () => {
                    "use server";
                    await signOut();
                  }}
                >
                  <button
                    type="submit"
                    className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
                  >
                    Çıkış
                  </button>
                </form>
              </div>
            ) : (
              // Giriş Yapmamış Ziyaretçi Görünümü
              <div className="flex space-x-4">
                <Link
                  href="/login"
                  className="text-gray-500 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </nav>
  );
}