// src/types/next-auth.d.ts
import { UserRole } from "@prisma/client";
import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  // Session (Oturum) içinde role ve id olacak
  interface Session {
    user: {
      role: UserRole;
      id: string;
    } & DefaultSession["user"];
  }

  // User (Kullanıcı) içinde role olacak
  interface User {
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  // Token içinde role ve id olacak
  interface JWT {
    role: UserRole;
    id: string;
  }
}