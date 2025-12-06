// src/actions/delete-event.ts
"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function deleteEvent(eventId: string) {
  const session = await auth()
  
  // 1. Kullanıcı giriş yapmış mı?
  if (!session?.user) {
    return { error: "Yetkisiz işlem!" }
  }

  // 2. Silinecek etkinliği bul
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  })

  if (!event) {
    return { error: "Etkinlik bulunamadı." }
  }

  // 3. YETKİ KONTROLÜ
  // Kullanıcı ADMIN değilse VE etkinliğin sahibi de değilse engelle.
  const isOwner = event.userId === session.user.id
  const isAdmin = session.user.role === "ADMIN"

  if (!isOwner && !isAdmin) {
    return { error: "Bu etkinliği silme yetkiniz yok!" }
  }

  // 4. Silme İşlemi
  try {
    await prisma.event.delete({
      where: { id: eventId },
    })
  } catch (error) {
    return { error: "Silme işlemi sırasında hata oluştu." }
  }

  // 5. Listeyi yenile ve yönlendir
  revalidatePath("/events") 
  redirect("/events")
}