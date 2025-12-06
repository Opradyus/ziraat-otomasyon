// src/actions/toggle-participation.ts
"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function toggleParticipation(eventId: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { error: "Etkinliğe katılmak için giriş yapmalısınız." }
  }

  const userId = session.user.id

  // 1. Kullanıcı bu etkinliğe zaten katılmış mı?
  const existingParticipant = await prisma.participant.findUnique({
    where: {
      userId_eventId: {
        userId,
        eventId,
      },
    },
  })

  try {
    if (existingParticipant) {
      // Zaten katılmış -> Kaydı Sil (Vazgeç)
      await prisma.participant.delete({
        where: {
          userId_eventId: {
            userId,
            eventId,
          },
        },
      })
      revalidatePath(`/events/${eventId}`)
      return { status: "removed", message: "Katılım iptal edildi." }
    } else {
      // Katılmamış -> Yeni Kayıt Ekle
      await prisma.participant.create({
        data: {
          userId,
          eventId,
        },
      })
      revalidatePath(`/events/${eventId}`)
      return { status: "added", message: "Etkinliğe katıldınız! 🎉" }
    }
  } catch (error) {
    return { error: "İşlem sırasında bir hata oluştu." }
  }
}