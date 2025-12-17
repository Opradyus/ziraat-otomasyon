// src/actions/create-event.ts
"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function createEvent(formData: FormData) {
  const session = await auth()
  
  //  Yetki Kontrolü (Admin veya Organizer olmalı)
  if (!session?.user || !session.user.id) {
    return { error: "Giriş yapmalısınız." }
  }
  
  if (session.user.role !== "ADMIN" && session.user.role !== "ORGANIZER") {
    return { error: "Etkinlik oluşturmak için 'Organizer' yetkisine sahip olmalısınız." }
  }

  //  Verileri Al
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const location = formData.get("location") as string
  const dateStr = formData.get("date") as string
  const categoryId = formData.get("categoryId") as string

  if (!title || !description || !dateStr || !location || !categoryId) {
    return { error: "Lütfen tüm alanları doldurun." }
  }

  try {
    // Etkinliği Oluştur VE Oluşturanı Katılımcı Olarak Ekle
    await prisma.event.create({
      data: {
        title,
        description,
        location,
        date: new Date(dateStr),
        userId: session.user.id, // Etkinliğin sahibi
        categoryId,
        
        // Etkinlik oluşurken aynı anda participants tablosuna da kayıt atıyoruz.
        participants: {
          create: {
            userId: session.user.id // Beni katılımcı olarak ekle
          }
        }
      },
    })
  } catch (error) {
    console.error("Etkinlik oluşturma hatası:", error)
    return { error: "Veritabanı hatası." }
  }

  revalidatePath("/events")
  redirect("/events")
}