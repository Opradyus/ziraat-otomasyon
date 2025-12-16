// src/components/RoleSelect.tsx
"use client"

import { updateUserRole } from "@/actions/update-user-role"
import { UserRole } from "@prisma/client"
import { useTransition } from "react"

export default function RoleSelect({ userId, currentRole }: { userId: string, currentRole: UserRole }) {
  const [isPending, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newRole = e.target.value as UserRole
    
    // Kullanıcıya hemen tepki verelim ama işlemi arka planda yapalım
    const confirmed = confirm(`Bu kullanıcının rolünü ${newRole} olarak değiştirmek istiyor musun?`)
    
    if (confirmed) {
      startTransition(async () => {
        await updateUserRole(userId, newRole)
      })
    }
  }

  return (
    <select
      defaultValue={currentRole}
      onChange={handleChange}
      disabled={isPending}
      className={`text-xs font-bold py-1 px-2 rounded border ${
        currentRole === "ADMIN" ? "bg-red-50 text-red-700 border-red-200" :
        currentRole === "ORGANIZER" ? "bg-blue-50 text-blue-700 border-blue-200" :
        "bg-gray-50 text-gray-700 border-gray-200"
      }`}
    >
      <option value="USER">USER</option>
      <option value="ORGANIZER">ORGANIZER</option>
      <option value="ADMIN">ADMIN</option>
    </select>
  )
}