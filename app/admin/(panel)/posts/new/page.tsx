import { asc } from "drizzle-orm";
import { connection } from "next/server";

import { createPostAction } from "@/app/admin/actions/posts";
import { Flash } from "@/components/admin/Flash";
import { PostForm } from "@/components/admin/PostForm";
import { SectionCard } from "@/components/admin/SectionCard";
import { db } from "@/lib/db/client";
import { categories } from "@/lib/db/schema";

export const instant = false;

export default async function AdminCreateArticlePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  await connection();
  const categoryRows = await db.select().from(categories).orderBy(asc(categories.name));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Artikel baru</h1>
        <p className="text-sm text-slate-500">
          Tulis artikel dalam Markdown, lalu tentukan status draft atau publish.
        </p>
      </div>

      <Flash error={params.error} saved={params.saved} />

      <SectionCard title="Konten artikel">
        <PostForm
          action={createPostAction}
          categories={categoryRows}
          submitLabel="Buat artikel"
        />
      </SectionCard>
    </div>
  );
}
