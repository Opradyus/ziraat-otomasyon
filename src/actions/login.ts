// src/actions/login.ts
"use server"

import { signIn } from "@/auth" 
import { AuthError } from "next-auth"

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Lütfen tüm alanları doldurun." }
  }

  try {
    // NextAuth'un kendi signIn fonksiyonunu
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/", // Giriş başarılıysa ana sayfaya at
    })
  } catch (error) {
    // Next.js'de yönlendirme işlemi bir hata fırlatarak çalışır.
    // O yüzden "NEXT_REDIRECT" hatasını yakalayıp tekrar fırlatmalıyız.
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Email veya şifre hatalı!" }
        default:
          return { error: "Bir şeyler ters gitti." }
      }
    }
    throw error // Yönlendirme hatasını engelleme
  }
}