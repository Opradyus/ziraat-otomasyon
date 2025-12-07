// src/components/Navbar.tsx
"use client"; // <-- Artık Client Component

import Link from "next/link";
import { useState } from "react";
import { handleSignOut } from "@/actions/auth-actions"; // Az önce oluşturduğumuz action
import { User } from "next-auth"; // Tip tanımlaması için

// Layout'tan gelen user bilgisini karşılıyoruz
interface NavbarProps {
  user?: User & { role?: string };
}

export default function Navbar({ user }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Menüyü açıp kapatan fonksiyon
  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  
  // Linke tıklayınca menüyü kapatan fonksiyon (Mobil için)
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* --- LOGO VE HAMBURGER BUTONU --- */}
          <div className="flex justify-between w-full sm:w-auto">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-green-700 flex items-center gap-2" onClick={closeMenu}>
                🌱 <span className="hidden xs:block">ZiraatApp</span>
              </Link>
            </div>

            {/* HAMBURGER BUTONU (Sadece Mobilde Görünür) */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={toggleMenu}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
              >
                <span className="sr-only">Menüyü aç</span>
                {/* İkon: Açık mı Kapalı mı? */}
                {isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* --- MASAÜSTÜ MENÜSÜ (Mobilde Gizli) --- */}
          <div className="hidden sm:flex sm:space-x-8 sm:ml-6 items-center">
            <Link href="/" className="text-gray-900 hover:text-green-600 px-1 pt-1 text-sm font-medium transition">
              Ana Sayfa
            </Link>
            <Link href="/events" className="text-gray-500 hover:text-green-600 px-1 pt-1 text-sm font-medium transition">
              Etkinlikler
            </Link>
            {user?.role === "ADMIN" && (
              <Link href="/admin" className="text-red-600 hover:text-red-800 px-1 pt-1 text-sm font-medium transition">
                Admin Paneli 🛡️
              </Link>
            )}
          </div>

          {/* --- MASAÜSTÜ SAĞ TARAF (Profil/Giriş) --- */}
          <div className="hidden sm:flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile" className="text-right cursor-pointer hover:opacity-80">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.role}</div>
                </Link>
                <button
                  onClick={() => handleSignOut()}
                  className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition"
                >
                  Çıkış
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link href="/login" className="text-gray-500 hover:text-green-600 px-3 py-2 text-sm font-medium">
                  Giriş Yap
                </Link>
                <Link href="/register" className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium">
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- MOBİL MENÜ (Açılır/Kapanır Alan) --- */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-200">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              onClick={closeMenu}
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-green-500 hover:text-green-700"
            >
              Ana Sayfa
            </Link>
            <Link
              href="/events"
              onClick={closeMenu}
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-green-500 hover:text-green-700"
            >
              Etkinlikler
            </Link>
            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                onClick={closeMenu}
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-red-600 hover:bg-red-50 hover:border-red-500"
              >
                Admin Paneli
              </Link>
            )}
          </div>

          {/* Mobil Kullanıcı Kısmı */}
          <div className="pt-4 pb-4 border-t border-gray-200">
            {user ? (
              <>
                <div className="flex items-center px-4 mb-3" onClick={closeMenu}>
                  <Link href="/profile" className="flex-shrink-0 flex items-center gap-3 w-full">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-lg">
                      👤
                    </div>
                    <div>
                      <div className="text-base font-medium text-gray-800">{user.name}</div>
                      <div className="text-sm font-medium text-gray-500">{user.email}</div>
                    </div>
                  </Link>
                </div>
                <div className="mt-3 space-y-1">
                  <button
                    onClick={() => {
                      closeMenu();
                      handleSignOut();
                    }}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:bg-gray-100"
                  >
                    Çıkış Yap
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-3 space-y-1 px-4">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="block text-center w-full px-4 py-2 border border-gray-300 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 mb-2"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="block text-center w-full px-4 py-2 border border-transparent rounded-md text-base font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}