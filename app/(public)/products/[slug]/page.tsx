import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PurchasePanel } from "@/components/marketplace/PurchasePanel";
import { ViewItemTracker } from "@/components/tracking/ViewItemTracker";
import { buildViewEcommerce } from "@/lib/tracking/dataLayer";
import {
  cheapestPackage,
  getCategory,
  getProduct,
  products,
} from "@/lib/marketplace/catalog";

export const instant = false;

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

interface ProductDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Produk tidak ditemukan" };

  return {
    title: product.name,
    description: product.tagline,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.tagline,
      images: product.screenshots[0] ? [product.screenshots[0]] : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const cheapest = cheapestPackage(product);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
      <ViewItemTracker
        ecommerce={buildViewEcommerce({
          slug: product.slug,
          name: product.name,
          category: category?.name ?? product.category,
          price: cheapest?.price ?? 0,
        })}
      />
      <nav
        aria-label="Breadcrumb"
        className="text-sm text-slate-500"
      >
        <Link href="/products" className="hover:text-indigo-600">
          Produk
        </Link>
        <span aria-hidden="true" className="mx-2">
          /
        </span>
        <span className="text-slate-700">{product.name}</span>
      </nav>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
          {category ? (
            <span className="rounded-full bg-indigo-50 px-2.5 py-1 font-semibold text-indigo-700">
              {category.name}
            </span>
          ) : null}
          {product.badge ? (
            <span className="rounded-full bg-indigo-600 px-2.5 py-1 font-semibold text-white">
              {product.badge}
            </span>
          ) : null}
          <span className="rounded-full bg-amber-50 px-2.5 py-1 font-semibold text-amber-700">
            Sisa {product.promoRemaining} lisensi promo
          </span>
        </div>
        <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
          {product.name}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          {product.tagline}
        </p>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
          {product.description}
        </p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {product.screenshots.map((screenshot) => (
          <div
            key={screenshot}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"
          >
            <Image
              src={screenshot}
              alt={`Tampilan ${product.name}`}
              width={1200}
              height={630}
              sizes="(max-width: 640px) 100vw, 50vw"
              className="h-auto w-full"
            />
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_420px]">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Fitur utama
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {product.features.map((feature) => (
              <li
                key={feature}
                className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700"
              >
                <span aria-hidden="true" className="text-indigo-500">
                  ✓
                </span>
                {feature}
              </li>
            ))}
          </ul>

          <h2 className="mt-10 text-lg font-bold text-slate-900">
            Kenapa memilih {product.name}?
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            {product.description} Tersedia trial gratis 14 hari tanpa kartu
            kredit, dan data bisa dipindahkan dari aplikasi lama bersama tim
            onboarding kami.
          </p>
        </div>

        <PurchasePanel product={product} />
      </div>
    </div>
  );
}
