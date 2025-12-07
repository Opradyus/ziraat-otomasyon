// src/actions/auth-actions.ts
"use server"

import { signOut } from "@/auth"

export async function handleSignOut() {
  await signOut()
}