import Link from "next/link";
import { connection } from "next/server";
import { asc, desc } from "drizzle-orm";

import { createCategoryAction, deleteCategoryAction } from "@/app/admin/actions/posts";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { Flash } from "@/components/admin/Flash";
import { SectionCard } from "@/components/admin/SectionCard";
import { db } from "@/lib/db/client";
import { categories, posts } from "@/lib/db/schema";

export const instant = false;

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  await connection();

  const [postRows, categoryRows] = await Promise.all([
    db.query.posts.findMany({
      with: { category: true },
      orderBy: [desc(posts.publishedAt), desc(posts.createdAt)],
    }),
    db.select().from(categories).orderBy(asc(categories.name)),
  ]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Artikel blog</h1>
          <p className="text-sm text-slate-500">
            Kelola judul, slug, cover, isi, kategori, dan status publish.
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          + Artikel baru
        </Link>
      </div>

      <Flash saved={params.saved} error={params.error} />

      <SectionCard title="Daftar artikel">
        {postRows.length === 0 ? (
          <p className="text-sm text-slate-500">Belum ada artikel.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {postRows.map((post) => (
              <li
                key={post.id}
                className="flex flex-wrap items-center justify-between gap-2 py-3"
              >
                <div>
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="text-sm font-medium text-slate-900 hover:underline"
                  >
                    {post.title}
                  </Link>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span>/blog/{post.slug}</span>
                    <span>·</span>
                    <span>{post.category?.name ?? "Tanpa kategori"}</span>
                    <span>·</span>
                    <span>
                      {post.publishedAt
                        ? post.publishedAt.toISOString().slice(0, 10)
                        : "belum publish"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      post.status === "published"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {post.status === "published" ? "Publish" : "Draft"}
                  </span>
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="text-xs text-slate-500 hover:text-slate-900"
                  >
                    Edit
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <SectionCard
        title="Kategori"
        description="Dipakai untuk mengelompokkan artikel blog."
      >
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {categoryRows.map((category) => (
              <span
                key={category.id}
                className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
              >
                {category.name}
                <form action={deleteCategoryAction.bind(null, category.id)}>
                  <ConfirmSubmit className="text-slate-400 hover:text-red-600">
                    ×
                  </ConfirmSubmit>
                </form>
              </span>
            ))}
          </div>

          <form
            action={createCategoryAction}
            className="flex flex-wrap items-end gap-2"
          >
            <div>
              <label htmlFor="cat-name" className="text-xs text-slate-500">
                Nama kategori
              </label>
              <input
                id="cat-name"
                name="name"
                required
                maxLength={60}
                className="mt-1 block w-44 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
              />
            </div>
            <div>
              <label htmlFor="cat-slug" className="text-xs text-slate-500">
                Slug
              </label>
              <input
                id="cat-slug"
                name="slug"
                required
                maxLength={60}
                placeholder="kategori-baru"
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                className="mt-1 block w-40 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Tambah
            </button>
          </form>
        </div>
      </SectionCard>
    </div>
  );
}
