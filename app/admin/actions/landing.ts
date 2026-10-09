"use server";

import { updateTag } from "next/cache";
import { asc, desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db } from "@/lib/db/client";
import {
  featuredProducts,
  faqs,
  hero,
  testimonials,
} from "@/lib/db/schema";
import { cacheTags } from "@/lib/cache-tags";
import { getSession } from "@/lib/session";
import { faqSchema, heroSchema, testimonialSchema } from "@/lib/validation";

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

export async function saveHeroAction(formData: FormData): Promise<void> {
  await guard();
  const parsed = heroSchema.safeParse({
    badge: formData.get("badge") ?? "",
    title: formData.get("title") ?? "",
    subtitle: formData.get("subtitle") ?? "",
    imageUrl: formData.get("imageUrl") ?? "",
    ctaLabel: formData.get("ctaLabel") ?? "",
    ctaLink: formData.get("ctaLink") ?? "",
  });
  if (!parsed.success) {
    redirect(`/admin/landing?error=${encodeURIComponent(firstError(parsed.error.issues))}`);
  }

  await db
    .insert(hero)
    .values({ id: 1, ...parsed.data, updatedAt: new Date() })
    .onConflictDoUpdate({ target: hero.id, set: { ...parsed.data, updatedAt: new Date() } });

  updateTag(cacheTags.landing);
  redirect("/admin/landing?saved=hero");
}

export async function createTestimonialAction(formData: FormData): Promise<void> {
  await guard();
  const parsed = testimonialSchema.safeParse({
    name: formData.get("name") ?? "",
    role: formData.get("role") ?? "",
    quote: formData.get("quote") ?? "",
    avatarUrl: formData.get("avatarUrl") ?? "",
    active: formData.get("active") === "on",
  });
  if (!parsed.success) {
    redirect(`/admin/landing?error=${encodeURIComponent(firstError(parsed.error.issues))}`);
  }

  const [last] = await db
    .select({ position: testimonials.position })
    .from(testimonials)
    .orderBy(desc(testimonials.position))
    .limit(1);

  await db.insert(testimonials).values({
    ...parsed.data,
    position: (last?.position ?? -1) + 1,
  });

  updateTag(cacheTags.testimonials);
  redirect("/admin/landing?saved=testimonial");
}

export async function updateTestimonialAction(
  id: string,
  formData: FormData,
): Promise<void> {
  await guard();
  const parsed = testimonialSchema.safeParse({
    name: formData.get("name") ?? "",
    role: formData.get("role") ?? "",
    quote: formData.get("quote") ?? "",
    avatarUrl: formData.get("avatarUrl") ?? "",
    active: formData.get("active") === "on",
  });
  if (!parsed.success) {
    redirect(`/admin/landing?error=${encodeURIComponent(firstError(parsed.error.issues))}`);
  }

  await db.update(testimonials).set(parsed.data).where(eq(testimonials.id, id));
  updateTag(cacheTags.testimonials);
  redirect("/admin/landing?saved=testimonial");
}

export async function deleteTestimonialAction(id: string): Promise<void> {
  await guard();
  await db.delete(testimonials).where(eq(testimonials.id, id));
  updateTag(cacheTags.testimonials);
  redirect("/admin/landing?saved=testimonial-deleted");
}

export async function createFaqAction(formData: FormData): Promise<void> {
  await guard();
  const parsed = faqSchema.safeParse({
    question: formData.get("question") ?? "",
    answer: formData.get("answer") ?? "",
    active: formData.get("active") === "on",
  });
  if (!parsed.success) {
    redirect(`/admin/landing?error=${encodeURIComponent(firstError(parsed.error.issues))}`);
  }

  const [last] = await db
    .select({ position: faqs.position })
    .from(faqs)
    .orderBy(desc(faqs.position))
    .limit(1);

  await db.insert(faqs).values({ ...parsed.data, position: (last?.position ?? -1) + 1 });
  updateTag(cacheTags.faqs);
  redirect("/admin/landing?saved=faq");
}

export async function updateFaqAction(id: string, formData: FormData): Promise<void> {
  await guard();
  const parsed = faqSchema.safeParse({
    question: formData.get("question") ?? "",
    answer: formData.get("answer") ?? "",
    active: formData.get("active") === "on",
  });
  if (!parsed.success) {
    redirect(`/admin/landing?error=${encodeURIComponent(firstError(parsed.error.issues))}`);
  }

  await db.update(faqs).set(parsed.data).where(eq(faqs.id, id));
  updateTag(cacheTags.faqs);
  redirect("/admin/landing?saved=faq");
}

export async function deleteFaqAction(id: string): Promise<void> {
  await guard();
  await db.delete(faqs).where(eq(faqs.id, id));
  updateTag(cacheTags.faqs);
  redirect("/admin/landing?saved=faq-deleted");
}

export async function addFeaturedProductAction(formData: FormData): Promise<void> {
  await guard();
  const productSlug = String(formData.get("productSlug") ?? "").trim();
  if (!productSlug) {
    redirect("/admin/landing?error=Pilih%20produk%20terlebih%20dahulu");
  }

  const [last] = await db
    .select({ position: featuredProducts.position })
    .from(featuredProducts)
    .orderBy(desc(featuredProducts.position))
    .limit(1);

  await db
    .insert(featuredProducts)
    .values({ productSlug, position: (last?.position ?? -1) + 1 })
    .onConflictDoNothing();

  updateTag(cacheTags.featured);
  redirect("/admin/landing?saved=featured");
}

export async function removeFeaturedProductAction(id: string): Promise<void> {
  await guard();
  await db.delete(featuredProducts).where(eq(featuredProducts.id, id));
  updateTag(cacheTags.featured);
  redirect("/admin/landing?saved=featured");
}

export async function moveFeaturedProductAction(
  id: string,
  direction: "up" | "down",
): Promise<void> {
  await guard();

  const all = await db
    .select()
    .from(featuredProducts)
    .orderBy(asc(featuredProducts.position), asc(featuredProducts.productSlug));

  const index = all.findIndex((item) => item.id === id);
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || targetIndex < 0 || targetIndex >= all.length) {
    redirect("/admin/landing");
  }

  const current = all[index];
  const target = all[targetIndex];
  const currentId = current.id;
  const currentPos = current.position;
  const targetId = target.id;
  const targetPos = target.position;

  await db
    .update(featuredProducts)
    .set({ position: targetPos })
    .where(eq(featuredProducts.id, currentId));
  await db
    .update(featuredProducts)
    .set({ position: currentPos })
    .where(eq(featuredProducts.id, targetId));

  updateTag(cacheTags.featured);
  redirect("/admin/landing?saved=featured");
}
