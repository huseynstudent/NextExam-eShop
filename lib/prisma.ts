import { PrismaClient } from "@prisma/client";

// Standard Next.js + Prisma singleton pattern — without this, every hot
// reload in dev would spin up a fresh PrismaClient and eventually exhaust
// the SQLite/Postgres connection pool.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
