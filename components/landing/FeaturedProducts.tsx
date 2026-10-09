import Link from "next/link";

import { TrackedCtaLink } from "@/components/tracking/TrackedCtaLink";
import {
  cheapestPackage,
  discountPercent,
  formatIDR,
  getCategory,
  type Product,
} from "@/lib/marketplace/catalog";

export function FeaturedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Produk Unggulan
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Solusi siap pakai untuk bisnis Anda
          </h2>
        </div>
        <Link
          href="/products"
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
        >
          Lihat semua produk →
        </Link>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const pkg = cheapestPackage(product);
          const percent = pkg ? discountPercent(pkg) : 0;
          const category = getCategory(product.category);
          return (
            <article
              key={product.slug}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                  {category?.name ?? product.category}
                </span>
                {product.badge ? (
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                    {product.badge}
                  </span>
                ) : null}
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">
                {product.name}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
                {product.tagline}
              </p>
              {pkg ? (
                <div className="mt-4">
                  {percent > 0 ? (
                    <p className="text-xs font-medium text-rose-600">
                      Diskon {percent}% — sisa kuota {product.promoRemaining}
                    </p>
                  ) : null}
                  <p className="mt-1 text-sm text-slate-500">
                    Mulai{" "}
                    <span className="text-lg font-bold text-slate-900">
                      {formatIDR(pkg.price)}
                    </span>
                    <span className="ml-1 text-xs">
                      /{pkg.licenseUnit === "user" ? "user" : "outlet"}
                    </span>
                  </p>
                </div>
              ) : null}
              <TrackedCtaLink
                href={`/products/${product.slug}`}
                contentId={`featured-${product.slug}`}
                contentType="product_card"
                className="mt-5 inline-flex items-center justify-center rounded-xl border border-indigo-200 px-4 py-2.5 text-sm font-semibold text-indigo-700 transition-colors group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600"
              >
                Lihat detail
              </TrackedCtaLink>
            </article>
          );
        })}
      </div>
    </section>
  );
}
