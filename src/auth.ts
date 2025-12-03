// src/auth.ts
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" }, // Rol tabanlı sistemler için JWT en iyisidir
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email as string
        
        // Kullanıcıyı veritabanında bul
        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user || !user.password) {
          throw new Error("Kullanıcı bulunamadı!")
        }

        // Şifreyi kontrol et
        const isMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isMatch) {
          throw new Error("Şifre hatalı!")
        }

        // Giriş başarılı ise kullanıcıyı döndür
        return user
      },
    }),
  ],
  callbacks: {
    // JWT Token'ına kullanıcının rolünü (Role) ekle
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    // Oturum (Session) bilgisine de rolü ekle ki arayüzde kullanabilelim
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string // "ADMIN", "USER" vb.
        session.user.id = token.id as string
      }
      return session
    },
  },
})