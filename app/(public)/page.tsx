import type { Metadata } from "next";

import { Faq } from "@/components/landing/Faq";
import { FeaturedProducts } from "@/components/landing/FeaturedProducts";
import { Hero } from "@/components/landing/Hero";
import { LeadSection } from "@/components/landing/LeadSection";
import { Testimonials } from "@/components/landing/Testimonials";
import {
  getFaqs,
  getFeaturedProducts,
  getHero,
  getTestimonials,
} from "@/lib/content/landing";

export const metadata: Metadata = {
  title: "Promo Akhir Tahun — Software Bisnis UMKM | Kodeva",
  description:
    "Kasir, HR & payroll, absensi, dan stok dalam satu platform untuk UMKM. Promo akhir tahun diskon lisensi s/d 40%. Jadwalkan demo gratis hari ini.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Kodeva — Software Bisnis UMKM",
    description:
      "Kasir, HR & payroll, absensi, dan stok dalam satu platform. Promo akhir tahun diskon s/d 40%.",
    images: ["/images/hero.svg"],
  },
};

export default async function HomePage() {
  const [heroData, featured, testimonials, faqs] = await Promise.all([
    getHero(),
    getFeaturedProducts(),
    getTestimonials(),
    getFaqs(),
  ]);

  return (
    <>
      <Hero data={heroData} />
      <FeaturedProducts products={featured} />
      <Testimonials items={testimonials} />
      <Faq items={faqs} />
      <LeadSection />
    </>
  );
}
