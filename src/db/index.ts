import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// Utilisation d'un fallback factice si DATABASE_URL est indisponible durant le build Vercel
const databaseUrl =
  process.env.DATABASE_URL ||
  "postgres://placeholder:placeholder@localhost:5432/placeholder";

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);