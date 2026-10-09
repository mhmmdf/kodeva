import { cacheLife, cacheTag } from "next/cache";
import { asc, eq } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { faqs, featuredProducts, hero, testimonials } from "@/lib/db/schema";
import { cacheTags } from "@/lib/cache-tags";
import { getProduct, type Product } from "@/lib/marketplace/catalog";

/**
 * Landing content reader — connected to the database via cached
 * queries ('use cache'). Admin mutations invalidate the related
 * cache tags so edits appear without a redeploy.
 */

export interface HeroContent {
  badge: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaLabel: string;
  ctaLink: string;
}

const FALLBACK_HERO: HeroContent = {
  badge: "Promo Akhir Tahun",
  title: "Software bisnis UMKM yang siap dipakai hari ini",
  subtitle:
    "Kasir, HR & payroll, absensi, dan stok dalam satu platform — tanpa setup ribet, langsung jalan.",
  imageUrl: "/images/hero.svg",
  ctaLabel: "Lihat Promo",
  ctaLink: "/products",
};

export async function getHero(): Promise<HeroContent> {
  "use cache";
  cacheTag(cacheTags.landing);
  cacheLife("max");

  const rows = await db.select().from(hero).where(eq(hero.id, 1)).limit(1);
  const row = rows[0];
  if (!row) return FALLBACK_HERO;
  return {
    badge: row.badge,
    title: row.title,
    subtitle: row.subtitle,
    imageUrl: row.imageUrl || FALLBACK_HERO.imageUrl,
    ctaLabel: row.ctaLabel,
    ctaLink: row.ctaLink,
  };
}

export async function getFeaturedProducts(): Promise<Product[]> {
  "use cache";
  cacheTag(cacheTags.featured);
  cacheLife("max");

  const rows = await db
    .select()
    .from(featuredProducts)
    .where(eq(featuredProducts.active, true))
    .orderBy(asc(featuredProducts.position));

  return rows
    .map((row) => getProduct(row.productSlug))
    .filter((product): product is Product => Boolean(product));
}

export interface TestimonialContent {
  name: string;
  role: string;
  quote: string;
  avatarUrl: string;
}

export async function getTestimonials(): Promise<TestimonialContent[]> {
  "use cache";
  cacheTag(cacheTags.testimonials);
  cacheLife("max");

  const rows = await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.active, true))
    .orderBy(asc(testimonials.position));

  return rows.map((row) => ({
    name: row.name,
    role: row.role,
    quote: row.quote,
    avatarUrl: row.avatarUrl,
  }));
}

export interface FaqContent {
  question: string;
  answer: string;
}

export async function getFaqs(): Promise<FaqContent[]> {
  "use cache";
  cacheTag(cacheTags.faqs);
  cacheLife("max");

  const rows = await db
    .select()
    .from(faqs)
    .where(eq(faqs.active, true))
    .orderBy(asc(faqs.position));

  return rows.map((row) => ({ question: row.question, answer: row.answer }));
}
