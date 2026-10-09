import "dotenv/config";
import fs from "node:fs";
import path from "node:path";

import { sql } from "drizzle-orm";

import { db } from "../lib/db/client";

type JournalEntry = { idx: number; tag: string };
type Journal = { entries: JournalEntry[] };

const root = process.cwd();
const journalPath = path.join(root, "drizzle", "meta", "_journal.json");

if (!fs.existsSync(journalPath)) {
  console.error(
    "Belum ada migration. Jalankan `npm run db:generate` terlebih dahulu.",
  );
  process.exit(1);
}

const journal = JSON.parse(fs.readFileSync(journalPath, "utf8")) as Journal;
const entries = [...journal.entries].sort((a, b) => a.idx - b.idx);

async function main() {
  await db.execute(
    sql.raw(
      `CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
        "idx" integer PRIMARY KEY,
        "tag" text NOT NULL,
        "applied_at" timestamp with time zone NOT NULL DEFAULT now()
      )`,
    ),
  );

  const appliedResult = (await db.execute(
    sql`SELECT "idx" FROM "__drizzle_migrations"`,
  )) as unknown as { rows: { idx: number }[] };

  const applied = new Set(appliedResult.rows.map((row) => Number(row.idx)));
  let ran = 0;

  for (const entry of entries) {
    if (applied.has(entry.idx)) continue;

    const file = path.join(root, "drizzle", `${entry.tag}.sql`);
    const statements = fs
      .readFileSync(file, "utf8")
      .split("--> statement-breakpoint");

    for (const statement of statements) {
      const trimmed = statement.trim();
      if (trimmed.length > 0) {
        await db.execute(sql.raw(trimmed));
      }
    }

    await db.execute(
      sql`INSERT INTO "__drizzle_migrations" ("idx", "tag") VALUES (${entry.idx}, ${entry.tag})`,
    );
    ran += 1;
    console.log(`applied: ${entry.tag}`);
  }

  console.log(
    ran === 0
      ? "Database sudah up-to-date, tidak ada migration baru."
      : `${ran} migration selesai.`,
  );
  // PGlite keeps the event loop alive; force exit once done.
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
