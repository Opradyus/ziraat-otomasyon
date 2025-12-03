// src/app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth" // src/auth.ts dosyasından çekiyoruz

export const { GET, POST } = handlers