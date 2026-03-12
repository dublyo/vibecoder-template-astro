import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

/**
 * Prisma client singleton for Astro server-side usage.
 * Uses the PostgreSQL driver adapter required by Prisma 7.
 * Logs queries in development for debugging.
 */
let prisma: PrismaClient

export function getPrisma(): PrismaClient {
  if (!prisma) {
    const connectionString =
      process.env.DATABASE_URL ?? 'postgresql://vibecoder:vibecoder@localhost:5432/app'
    const adapter = new PrismaPg({ connectionString })

    prisma = new PrismaClient({
      adapter,
      log:
        process.env.NODE_ENV === 'development'
          ? ['warn', 'error']
          : ['error'],
    })
  }
  return prisma
}
