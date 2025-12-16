// src/actions/update-user-role.ts
"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function updateUserRole(userId: string, newRole: UserRole) {
  const session = await auth()

  // Admin kontrolü
  if (session?.user.role !== "ADMIN") {
    return { error: "Yetkisiz işlem! Sadece Adminler rol değiştirebilir." }
  }

  try {
    // Rol Güncelleme
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    })

    revalidatePath("/admin") // Admin sayfasını yenile
    return { success: "Kullanıcı rolü güncellendi." }
  } catch (error) {
    return { error: "Güncelleme sırasında hata oluştu." }
  }
}