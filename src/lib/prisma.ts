// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client"

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"], // İstersen sorguları terminalde görmek için bunu açık tutabilirsin
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma