// src/actions/update-event.ts
"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function updateEvent(eventId: string, formData: FormData) {
  const session = await auth()

  if (!session?.user || !session.user.id) {
    return { error: "Yetkisiz işlem." }
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const location = formData.get("location") as string
  const dateStr = formData.get("date") as string
  const categoryId = formData.get("categoryId") as string
  const city = formData.get("city") as string
  const district = formData.get("district") as string

  // Validasyon
  if (!title || !description || !dateStr || !city || !district || !location || !categoryId) {
    return { error: "Lütfen tüm alanları doldurun." }
  }

  // GÜVENLİK KONTROLÜ
  const existingEvent = await prisma.event.findUnique({
    where: { id: eventId },
  })

  if (!existingEvent) {
    return { error: "Etkinlik bulunamadı." }
  }

  const isOwner = existingEvent.userId === session.user.id
  const isAdmin = session.user.role === "ADMIN"

  if (!isOwner && !isAdmin) {
    return { error: "Bu etkinliği düzenleme yetkiniz yok!" }
  }

  try {
    await prisma.event.update({
      where: { id: eventId },
      data: {
        title,
        description,
        location,
        city,
        district,
        date: new Date(dateStr),
        categoryId,
      },
    })
  } catch (error) {
    return { error: "Güncelleme sırasında hata oluştu." }
  }

  revalidatePath(`/events/${eventId}`) // Detay sayfasını yenile
  revalidatePath("/events") // Listeyi yenile
  redirect(`/events/${eventId}`) // Detay sayfasına geri at
}