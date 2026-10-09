import { PGlite } from "@electric-sql/pglite";
import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePglite, type PgliteDatabase } from "drizzle-orm/pglite";

import { schema } from "./schema";

/**
 * Production (Vercel): Neon Postgres via DATABASE_URL.
 * Local: PGlite (Postgres in-process, no Docker) under .pglite/.
 *
 * The db type is unified to PgliteDatabase so there is a single
 * query-builder type. Neon is only used for plain read/write
 * queries (no interactive transactions) so its API is compatible
 * with PgliteDatabase.
 */
export type AppDatabase = PgliteDatabase<typeof schema>;

function createDatabase(): AppDatabase {
  const url = process.env.DATABASE_URL;
  if (url) {
    return drizzleNeon({
      client: neon(url),
      schema,
    }) as unknown as AppDatabase;
  }
  return drizzlePglite({
    client: new PGlite(process.env.PGLITE_DIR ?? ".pglite"),
    schema,
  });
}

export const db: AppDatabase = createDatabase();
