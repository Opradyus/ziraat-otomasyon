// src/middleware.ts
import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req

  // Kullanıcı giriş yapmış mı kontrol et
  // Eğer giriş yapmadıysa ve korunan bir sayfaya gitmeye çalışıyorsa engelle
  console.log("Mevcut Yol:", nextUrl.pathname)
  console.log("Giriş Yapıldı mı?:", isLoggedIn)
})

// Hangi sayfalarda çalışacağını belirtiyoruz
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}