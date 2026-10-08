import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Markdown } from "@/components/blog/Markdown";
import { getPostBySlug, getPublishedSlugs } from "@/lib/content/posts";
import {
  cheapestPackage,
  formatIDR,
  getProduct,
} from "@/lib/marketplace/catalog";

// Static content version: every published slug is prerendered at build
// time; unknown slugs (including drafts) should return a real 404.
// The database version will drop this and render per-request again
// so CMS edits show up immediately.
export const instant = false;

export function generateStaticParams() {
  return getPublishedSlugs().map((slug) => ({ slug }));
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "long",
});

interface PostDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PostDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Artikel tidak ditemukan" };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt ?? undefined,
      images: post.coverUrl ? [post.coverUrl] : undefined,
    },
  };
}

export default async function PostDetailPage({ params }: PostDetailProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const relatedProducts = post.productSlugs
    .map((productSlug) => getProduct(productSlug))
    .filter((product): product is NonNullable<typeof product> =>
      Boolean(product),
    );

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 sm:py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <Link href="/blog" className="hover:text-indigo-600">
          Blog
        </Link>
        <span aria-hidden className="mx-2">
          /
        </span>
        <span className="text-slate-700">{post.title}</span>
      </nav>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
          {post.categoryName ? (
            <span className="rounded-full bg-indigo-50 px-2.5 py-1 font-semibold text-indigo-700">
              {post.categoryName}
            </span>
          ) : null}
          {post.publishedAt ? (
            <time dateTime={post.publishedAt}>
              {dateFormatter.format(new Date(post.publishedAt))}
            </time>
          ) : null}
        </div>
        <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
          {post.title}
        </h1>
        {post.excerpt ? (
          <p className="mt-4 text-lg leading-8 text-slate-600">
            {post.excerpt}
          </p>
        ) : null}
      </header>

      {post.coverUrl ? (
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
          <Image
            src={post.coverUrl}
            alt=""
            width={1200}
            height={630}
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="h-auto w-full"
          />
        </div>
      ) : null}

      <div className="mt-10">
        <Markdown content={post.contentMd} />
      </div>

      {relatedProducts.length > 0 ? (
        <aside
          aria-label="Produk terkait"
          className="mt-12 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-6"
        >
          <h2 className="text-base font-bold text-slate-900">
            Produk yang dibahas artikel ini
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {relatedProducts.map((product) => {
              const pkg = cheapestPackage(product);
              return (
                <Link
                  key={product.slug}
                  href={`/produk/${product.slug}`}
                  className="group rounded-xl border border-white bg-white p-4 shadow-sm transition-shadow hover:shadow"
                >
                  <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600">
                    {product.name}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {product.tagline}
                  </p>
                  {pkg ? (
                    <p className="mt-2 text-sm font-bold text-indigo-700">
                      Mulai {formatIDR(pkg.price)}
                    </p>
                  ) : null}
                </Link>
              );
            })}
          </div>
        </aside>
      ) : null}

      <footer className="mt-12 border-t border-slate-200 pt-6">
        <Link
          href="/blog"
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
        >
          ← Kembali ke semua artikel
        </Link>
      </footer>
    </article>
  );
}
