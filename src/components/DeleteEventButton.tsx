// src/components/DeleteEventButton.tsx
"use client"

import { deleteEvent } from "@/actions/delete-event"
import { useTransition } from "react"

interface DeleteEventButtonProps {
  eventId: string
}

export default function DeleteEventButton({ eventId }: DeleteEventButtonProps) {
  // useTransition: İşlem sürerken (loading) arayüzü yönetmemizi sağlar
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    // Tarayıcı penceresiyle onay alalım
    const confirmed = window.confirm("Bu etkinliği kalıcı olarak silmek istediğine emin misin?")
    
    if (confirmed) {
      startTransition(async () => {
        const result = await deleteEvent(eventId)
        if (result?.error) {
          alert(result.error)
        }
      })
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
    >
      {isPending ? "Siliniyor..." : "Etkinliği Sil 🗑️"}
    </button>
  )
}