// src/components/JoinButton.tsx
"use client"

import { toggleParticipation } from "@/actions/toggle-participation"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

interface JoinButtonProps {
  eventId: string
  isJoined: boolean // Kullanıcı zaten katılmış mı?
  attendeeCount: number // Kaç kişi katılıyor?
}

export default function JoinButton({ eventId, isJoined, attendeeCount }: JoinButtonProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleParticipation(eventId)
      if (result?.error) {
        alert(result.error) // Giriş yapmamışsa uyarı ver
        router.push("/login") // Giriş sayfasına at
      }
    })
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`w-full sm:w-auto px-6 py-3 rounded-lg font-bold text-white shadow-md transition-all transform active:scale-95 ${
          isJoined
            ? "bg-gray-500 hover:bg-gray-600" // Vazgeç durumu (Gri)
            : "bg-green-600 hover:bg-green-700" // Katıl durumu (Yeşil)
        }`}
      >
        {isPending ? "İşleniyor..." : isJoined ? "Vazgeç ❌" : "Etkinliğe Katıl ✅"}
      </button>
      
      <p className="text-sm text-gray-500">
        Şu ana kadar <span className="font-bold text-black">{attendeeCount}</span> kişi katılıyor.
      </p>
    </div>
  )
}