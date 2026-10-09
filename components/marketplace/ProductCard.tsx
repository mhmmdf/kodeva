import Image from "next/image";
import Link from "next/link";

import {
  cheapestPackage,
  discountPercent,
  formatIDR,
  getCategory,
  type Product,
} from "@/lib/marketplace/catalog";

export function ProductCard({ product }: { product: Product }) {
  const pkg = cheapestPackage(product);
  const percent = pkg ? discountPercent(pkg) : 0;
  const category = getCategory(product.category);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[1200/630] overflow-hidden bg-slate-100"
      >
        <Image
          src={product.screenshots[0] || "/images/blog-1.svg"}
          alt={product.name}
          width={1200}
          height={630}
          sizes="(max-width: 768px) 100vw, 33vw"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {product.badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
            {product.badge}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          {category ? (
            <span className="rounded-full bg-indigo-50 px-2.5 py-1 font-semibold text-indigo-700">
              {category.name}
            </span>
          ) : null}
          <span className="rounded-full bg-amber-50 px-2.5 py-1 font-semibold text-amber-700">
            Sisa {product.promoRemaining} lisensi
          </span>
        </div>

        <h2 className="mt-3 text-lg font-bold leading-6 text-slate-900">
          <Link
            href={`/products/${product.slug}`}
            className="transition-colors group-hover:text-indigo-600"
          >
            {product.name}
          </Link>
        </h2>
        <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
          {product.tagline}
        </p>

        {pkg ? (
          <div className="mt-4 flex items-end justify-between gap-3">
            <div>
              {percent > 0 ? (
                <p className="text-xs font-semibold text-rose-500 line-through">
                  {formatIDR(pkg.originalPrice)}
                </p>
              ) : null}
              <p className="text-sm font-bold text-indigo-700">
                Mulai {formatIDR(pkg.price)}
                <span className="text-xs font-medium text-slate-400">
                  {" "}
                  /{pkg.licenseUnit}
                </span>
              </p>
            </div>
            <Link
              href={`/products/${product.slug}`}
              className="rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
            >
              Lihat paket
            </Link>
          </div>
        ) : null}
      </div>
    </article>
  );
}
