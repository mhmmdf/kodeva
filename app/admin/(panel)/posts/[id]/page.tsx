import { asc, eq } from "drizzle-orm";
import Link from "next/link";
import { connection } from "next/server";
import { notFound } from "next/navigation";

import { deletePostAction, updatePostAction } from "@/app/admin/actions/posts";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { Flash } from "@/components/admin/Flash";
import { PostForm } from "@/components/admin/PostForm";
import { SectionCard } from "@/components/admin/SectionCard";
import { db } from "@/lib/db/client";
import { categories, posts } from "@/lib/db/schema";

export const instant = false;

export default async function AdminEditArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  await connection();

  const post = await db.query.posts.findFirst({
    where: eq(posts.id, id),
  });
  if (!post) notFound();

  const categoryRows = await db
    .select()
    .from(categories)
    .orderBy(asc(categories.name));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">{post.title}</h1>
          <p className="text-sm text-slate-500">
            URL publik:{" "}
            <Link
              href={`/blog/${post.slug}`}
              target="_blank"
              className="text-slate-700 underline"
            >
              /blog/{post.slug}
            </Link>
          </p>
        </div>
        <Link
          href="/admin/posts"
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          ← Kembali ke daftar
        </Link>
      </div>

      <Flash saved={sp.saved} error={sp.error} />

      <SectionCard title="Konten artikel">
        <PostForm
          action={updatePostAction.bind(null, post.id)}
          categories={categoryRows}
          post={post}
          submitLabel="Simpan perubahan"
        />
      </SectionCard>

      <SectionCard title="Zona berbahaya">
        <form action={deletePostAction.bind(null, post.id)}>
          <ConfirmSubmit
            message={`Hapus artikel "${post.title}"?`}
            className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Hapus artikel ini
          </ConfirmSubmit>
        </form>
      </SectionCard>
    </div>
  );
}
