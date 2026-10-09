import { cacheLife, cacheTag } from "next/cache";
import { and, count, desc, eq } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { categories, posts } from "@/lib/db/schema";
import { cacheTags } from "@/lib/cache-tags";

export const POSTS_PER_PAGE = 5;

export interface PostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverUrl: string;
  publishedAt: string | null;
  categoryName: string | null;
}

export interface PostPage {
  items: PostListItem[];
  page: number;
  totalPages: number;
  total: number;
}

export async function getPublishedPosts(
  page: number,
  perPage: number = POSTS_PER_PAGE,
): Promise<PostPage> {
  "use cache";
  cacheTag(cacheTags.postsList);
  cacheLife("max");

  const safePage = Math.max(1, Math.trunc(page) || 1);
  const offset = (safePage - 1) * perPage;
  const publishedFilter = eq(posts.status, "published");

  const [rows, countRows] = await Promise.all([
    db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        coverUrl: posts.coverUrl,
        publishedAt: posts.publishedAt,
        categoryName: categories.name,
      })
      .from(posts)
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(publishedFilter)
      .orderBy(desc(posts.publishedAt))
      .limit(perPage)
      .offset(offset),
    db.select({ value: count() }).from(posts).where(publishedFilter),
  ]);

  const total = countRows[0]?.value ?? 0;
  return {
    items: rows.map((row) => ({
      ...row,
      publishedAt: row.publishedAt?.toISOString() ?? null,
    })),
    page: safePage,
    total,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
  };
}

export async function getPublishedSlugs(): Promise<string[]> {
  "use cache";
  cacheTag(cacheTags.postsList);
  cacheLife("max");

  const rows = await db
    .select({ slug: posts.slug })
    .from(posts)
    .where(eq(posts.status, "published"));
  return rows.map((row) => row.slug);
}

export interface PostDetail extends PostListItem {
  contentMd: string;
  productSlugs: string[];
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  "use cache";
  cacheTag(cacheTags.post(slug), cacheTags.postsList);
  cacheLife("max");

  const rows = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      coverUrl: posts.coverUrl,
      contentMd: posts.contentMd,
      productSlugs: posts.productSlugs,
      publishedAt: posts.publishedAt,
      categoryName: categories.name,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(and(eq(posts.slug, slug), eq(posts.status, "published")))
    .limit(1);

  const row = rows[0];
  if (!row) return null;
  return {
    ...row,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    productSlugs: row.productSlugs ?? [],
  };
}
