import type { Metadata } from "next";
import Link from "next/link";

import { ProductCard } from "@/components/marketplace/ProductCard";
import {
  catalogCategories,
  products,
} from "@/lib/marketplace/catalog";

export const instant = false;

export const metadata: Metadata = {
  title: "Katalog Produk — Kasir, HR & Payroll, Stok",
  description:
    "Jelajahi produk Kodeva untuk UMKM: aplikasi kasir, HR & payroll, absensi, manajemen stok, dan add-on — dengan promo akhir tahun s/d 40%.",
  alternates: { canonical: "/products" },
  openGraph: {
    title: "Katalog Produk Kodeva",
    description:
      "Aplikasi kasir, HR & payroll, stok, dan add-on dengan promo akhir tahun s/d 40%.",
    images: ["/images/hero.svg"],
  },
};

interface ProductsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category: categorySlug } = await searchParams;
  const activeCategory = categorySlug ?? "";

  const visible = activeCategory
    ? products.filter((product) => product.category === activeCategory)
    : products;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
          Katalog Produk
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Software bisnis untuk tiap kebutuhan
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600">
          Semua produk Kodeva berlisensi berlangganan dengan promo akhir
          tahun. Bandingkan paket, lalu masukkan ke keranjang.
        </p>
      </header>

      <nav aria-label="Filter kategori" className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/products"
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeCategory === ""
              ? "bg-indigo-600 text-white"
              : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-300"
          }`}
        >
          Semua
        </Link>
        {catalogCategories.map((category) => (
          <Link
            key={category.slug}
            href={`/products?category=${category.slug}`}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === category.slug
                ? "bg-indigo-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-300"
            }`}
          >
            {category.name}
          </Link>
        ))}
      </nav>

      {visible.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
          Tidak ada produk pada kategori ini.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
