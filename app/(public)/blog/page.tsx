import type { Metadata } from "next";

import { Pagination } from "@/components/blog/Pagination";
import { PostCard } from "@/components/blog/PostCard";
import { getPublishedPosts } from "@/lib/content/posts";

// `?page=`-based pagination is read per-request (render blocking).
export const instant = false;

export const metadata: Metadata = {
  title: "Blog — Insight Bisnis untuk UMKM",
  description:
    "Panduan praktis aplikasi kasir, HR & payroll, manajemen stok, dan tips mengembangkan UMKM dari tim Kodeva.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog Kodeva — Insight Bisnis untuk UMKM",
    description:
      "Panduan praktis kasir, HR & payroll, stok, dan tips mengembangkan UMKM.",
  },
};

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { page: pageParam } = await searchParams;
  const requestedPage = Number(pageParam) || 1;
  const data = await getPublishedPosts(requestedPage);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
          Blog Kodeva
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Insight bisnis untuk UMKM
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600">
          Panduan praktis seputar kasir, payroll, stok, dan cara mengembangkan
          bisnis — ditulis untuk pemilik usaha, bukan untuk ahli teknologi.
        </p>
      </header>

      {data.items.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
          Belum ada artikel yang dipublikasikan.
        </p>
      ) : (
        <>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <Pagination page={data.page} totalPages={data.totalPages} />
        </>
      )}
    </div>
  );
}
