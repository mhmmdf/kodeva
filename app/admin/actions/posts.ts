"use server";

import { updateTag } from "next/cache";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import catalog from "@/data/products.json";
import { db } from "@/lib/db/client";
import { categories, posts } from "@/lib/db/schema";
import { cacheTags } from "@/lib/cache-tags";
import { getSession } from "@/lib/session";
import { categorySchema, postSchema } from "@/lib/validation";

async function guard() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}

function firstError(issues: { message: string }[]): string {
  return issues[0]?.message ?? "Input tidak valid";
}

function parsePostForm(formData: FormData) {
  return postSchema.safeParse({
    title: formData.get("title") ?? "",
    slug: formData.get("slug") ?? "",
    excerpt: formData.get("excerpt") ?? "",
    coverUrl: formData.get("coverUrl") ?? "",
    contentMd: formData.get("contentMd") ?? "",
    categoryId: formData.get("categoryId") ?? "",
    productSlugs: formData.getAll("productSlugs").map(String),
    status: formData.get("status") ?? "draft",
  });
}

function validateProductSlugs(slugs: string[]): string | null {
  const known = new Set(catalog.products.map((p) => p.slug));
  const unknown = slugs.find((slug) => !known.has(slug));
  return unknown ? `Produk "${unknown}" tidak ada di katalog` : null;
}

export async function createPostAction(formData: FormData): Promise<void> {
  await guard();
  const parsed = parsePostForm(formData);
  if (!parsed.success) {
    redirect(`/admin/posts?error=${encodeURIComponent(firstError(parsed.error.issues))}`);
  }

  const slugError = validateProductSlugs(parsed.data.productSlugs);
  if (slugError) {
    redirect(`/admin/posts?error=${encodeURIComponent(slugError)}`);
  }

  const [existing] = await db
    .select({ id: posts.id })
    .from(posts)
    .where(eq(posts.slug, parsed.data.slug))
    .limit(1);
  if (existing) {
    redirect(
      `/admin/posts?error=${encodeURIComponent(`Slug "${parsed.data.slug}" sudah dipakai artikel lain`)}`,
    );
  }

  const isPublished = parsed.data.status === "published";
  const [created] = await db
    .insert(posts)
    .values({
      ...parsed.data,
      publishedAt: isPublished ? new Date() : null,
    })
    .returning({ id: posts.id });

  updateTag(cacheTags.postsList);
  updateTag(cacheTags.post(parsed.data.slug));
  redirect(`/admin/posts/${created.id}?saved=1`);
}

export async function updatePostAction(id: string, formData: FormData): Promise<void> {
  await guard();
  const parsed = parsePostForm(formData);
  if (!parsed.success) {
    redirect(
      `/admin/posts/${id}?error=${encodeURIComponent(firstError(parsed.error.issues))}`,
    );
  }

  const slugError = validateProductSlugs(parsed.data.productSlugs);
  if (slugError) {
    redirect(`/admin/posts/${id}?error=${encodeURIComponent(slugError)}`);
  }

  const [current] = await db
    .select({ slug: posts.slug, status: posts.status, publishedAt: posts.publishedAt })
    .from(posts)
    .where(eq(posts.id, id))
    .limit(1);
  if (!current) {
    redirect("/admin/posts?error=Artikel%20tidak%20ditemukan");
  }

  const [conflict] = await db
    .select({ id: posts.id })
    .from(posts)
    .where(eq(posts.slug, parsed.data.slug))
    .limit(1);
  if (conflict && conflict.id !== id) {
    redirect(
      `/admin/posts/${id}?error=${encodeURIComponent(`Slug "${parsed.data.slug}" sudah dipakai artikel lain`)}`,
    );
  }

  const publishedAt =
    parsed.data.status === "published" && !current.publishedAt
      ? new Date()
      : current.publishedAt;

  await db
    .update(posts)
    .set({ ...parsed.data, publishedAt, updatedAt: new Date() })
    .where(eq(posts.id, id));

  updateTag(cacheTags.postsList);
  if (current.slug !== parsed.data.slug) {
    updateTag(cacheTags.post(current.slug));
  }
  updateTag(cacheTags.post(parsed.data.slug));
  redirect(`/admin/posts/${id}?saved=1`);
}

export async function deletePostAction(id: string): Promise<void> {
  await guard();
  const [deleted] = await db
    .delete(posts)
    .where(eq(posts.id, id))
    .returning({ slug: posts.slug });
  if (deleted) {
    updateTag(cacheTags.post(deleted.slug));
  }
  updateTag(cacheTags.postsList);
  redirect("/admin/posts?saved=deleted");
}

export async function createCategoryAction(formData: FormData): Promise<void> {
  await guard();
  const parsed = categorySchema.safeParse({
    name: formData.get("name") ?? "",
    slug: formData.get("slug") ?? "",
  });
  if (!parsed.success) {
    redirect(
      `/admin/posts?error=${encodeURIComponent(firstError(parsed.error.issues))}`,
    );
  }

  const [existing] = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.slug, parsed.data.slug))
    .limit(1);
  if (existing) {
    redirect(
      `/admin/posts?error=${encodeURIComponent(`Slug kategori "${parsed.data.slug}" sudah ada`)}`,
    );
  }

  await db.insert(categories).values(parsed.data);
  updateTag(cacheTags.postsList);
  redirect("/admin/posts?saved=category");
}

export async function deleteCategoryAction(id: string): Promise<void> {
  await guard();
  await db.delete(categories).where(eq(categories.id, id));
  updateTag(cacheTags.postsList);
  redirect("/admin/posts?saved=category-deleted");
}
