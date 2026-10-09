import { asc } from "drizzle-orm";
import { connection } from "next/server";

import { FaqsManager } from "@/components/admin/FaqsManager";
import { FeaturedManager } from "@/components/admin/FeaturedManager";
import { Flash } from "@/components/admin/Flash";
import { HeroForm } from "@/components/admin/HeroForm";
import { SectionCard } from "@/components/admin/SectionCard";
import { TestimonialsManager } from "@/components/admin/TestimonialsManager";
import { db } from "@/lib/db/client";
import { faqs, featuredProducts, testimonials } from "@/lib/db/schema";

export const instant = false;

export default async function AdminLandingPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  await connection();

  const [heroRow, featured, testimonialRows, faqRows] = await Promise.all([
    db.query.hero.findFirst(),
    db
      .select()
      .from(featuredProducts)
      .orderBy(asc(featuredProducts.position), asc(featuredProducts.productSlug)),
    db.select().from(testimonials).orderBy(asc(testimonials.position)),
    db.select().from(faqs).orderBy(asc(faqs.position)),
  ]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">
          Editor halaman landing
        </h1>
        <p className="text-sm text-slate-500">
          Semua perubahan di halaman ini langsung tampil di website tanpa deploy
          ulang.
        </p>
      </div>

      <Flash saved={params.saved} error={params.error} />

      <SectionCard
        title="Hero"
        description="Judul, subjudul, gambar, dan tombol CTA menuju katalog."
      >
        <HeroForm hero={heroRow ?? null} />
      </SectionCard>

      <SectionCard
        title="Produk unggulan"
        description="Produk yang tampil di bagian 'Produk Unggulan' landing page."
      >
        <FeaturedManager items={featured} />
      </SectionCard>

      <SectionCard
        title="Testimoni"
        description="Teks testimoni pelanggan yang tampil di landing page."
      >
        <TestimonialsManager items={testimonialRows} />
      </SectionCard>

      <SectionCard title="FAQ" description="Pertanyaan umum di bagian bawah landing.">
        <FaqsManager items={faqRows} />
      </SectionCard>
    </div>
  );
}
