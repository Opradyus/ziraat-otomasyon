// src/actions/register.ts
"use server" // BU ÇOK ÖNEMLİ: Bu kodun sadece sunucuda çalışacağını belirtir.

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"

export async function registerUser(formData: FormData) {
  // 1. Formdan verileri çek
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // 2. Basit doğrulama (Validation)
  if (!name || !email || !password) {
    return { error: "Lütfen tüm alanları doldurun." }
  }

  // 3. Kullanıcı zaten var mı diye kontrol et
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return { error: "Bu email adresi zaten kayıtlı!" }
  }

  // 4. Şifreleme (Hashing)
  const hashedPassword = await bcrypt.hash(password, 10)

  // 5. Veritabanına Kayıt (Prisma)
  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // role varsayılan olarak 'USER' atanacak (schema'da öyle demiştik)
      },
    })
  } catch (error) {
    return { error: "Bir hata oluştu, lütfen tekrar deneyin." }
  }

  // 6. Başarılı ise Giriş sayfasına yönlendir
  redirect("/login")
}