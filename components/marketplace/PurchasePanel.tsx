"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  discountPercent,
  formatIDR,
  type Product,
} from "@/lib/marketplace/catalog";
import { quotaLeft, useCart } from "@/lib/marketplace/cart";
import { GA4_CURRENCY, pushEvent } from "@/lib/tracking/dataLayer";

/**
 * Purchase panel: pick a package, choose a quantity (capped by the
 * remaining promo quota of the product as a whole — licenses already
 * in the cart under a different package count toward the same cap),
 * and push the line into the cart store.
 */
export function PurchasePanel({ product }: { product: Product }) {
  const router = useRouter();
  const items = useCart((state) => state.items);
  const addItem = useCart((state) => state.addItem);
  const [packageId, setPackageId] = useState(product.packages[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  // The store hydrates lazily from localStorage (skipHydration); pull
  // the current cart in so the quota cap sees other packages too.
  useEffect(() => {
    void useCart.persist.rehydrate();
  }, []);

  const selected = product.packages.find((pkg) => pkg.id === packageId);
  const maxQty = quotaLeft(items, product.slug, packageId);
  const effectiveQty = Math.min(Math.max(1, qty), Math.max(1, maxQty));
  const total = selected ? selected.price * effectiveQty : 0;

  if (product.packages.length === 0) {
    return (
      <p className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
        Paket untuk produk ini sedang tidak tersedia.
      </p>
    );
  }

  return (
    <section aria-label="Pilih paket" className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Pilih paket</h2>
        <ul className="mt-3 space-y-3">
          {product.packages.map((pkg) => {
            const percent = discountPercent(pkg);
            const active = pkg.id === packageId;
            return (
              <li key={pkg.id}>
                <button
                  type="button"
                  onClick={() => setPackageId(pkg.id)}
                  aria-pressed={active}
                  className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                    active
                      ? "border-indigo-500 bg-indigo-50/60 ring-2 ring-indigo-200"
                      : "border-slate-200 bg-white hover:border-indigo-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {pkg.name}
                        <span className="ml-2 text-xs font-medium text-slate-400">
                          per {pkg.licenseUnit}
                        </span>
                      </p>
                      <p className="mt-1 text-sm leading-5 text-slate-500">
                        {pkg.description}
                      </p>
                    </div>
                    <div className="text-right">
                      {percent > 0 ? (
                        <p className="text-xs font-semibold text-rose-500 line-through">
                          {formatIDR(pkg.originalPrice)}
                        </p>
                      ) : null}
                      <p className="text-sm font-bold text-indigo-700">
                        {formatIDR(pkg.price)}
                      </p>
                      {percent > 0 ? (
                        <span className="mt-1 inline-block rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-600">
                          -{percent}%
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <ul className="mt-3 grid gap-1.5 text-xs text-slate-600 sm:grid-cols-2">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex gap-2">
                        <span aria-hidden="true" className="text-indigo-500">
                          ✓
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-700">Jumlah</span>
            <div className="flex items-center rounded-lg border border-slate-300">
              <button
                type="button"
                aria-label="Kurangi jumlah"
                onClick={() => setQty((value) => Math.max(1, value - 1))}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100"
              >
                −
              </button>
              <span className="w-10 text-center text-sm font-semibold text-slate-900">
                {effectiveQty}
              </span>
              <button
                type="button"
                aria-label="Tambah jumlah"
                disabled={maxQty <= 0}
                onClick={() =>
                  setQty((value) => Math.min(maxQty, value + 1))
                }
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300"
              >
                +
              </button>
            </div>
            {maxQty > 0 ? (
              <span className="text-xs text-amber-600">
                Maks. {maxQty} (sisa kuota promo)
              </span>
            ) : (
              <span className="text-xs font-medium text-rose-600">
                Kuota promo produk ini sudah habis di keranjang Anda
              </span>
            )}
          </div>
          <p className="text-lg font-bold text-slate-900">
            {formatIDR(total)}
          </p>
        </div>

        <button
          type="button"
          disabled={maxQty <= 0}
          onClick={() => {
            pushEvent("add_to_cart", {
              ecommerce: {
                currency: GA4_CURRENCY,
                value: total,
                items: [
                  {
                    item_id: product.slug,
                    item_name: product.name,
                    item_category: product.category,
                    item_variant: selected?.name,
                    price: selected?.price,
                    quantity: effectiveQty,
                  },
                ],
              },
            });
            addItem({
              slug: product.slug,
              packageId: selected?.id ?? "",
              qty: effectiveQty,
            });
            setAdded(true);
            router.push("/cart");
          }}
          className="mt-4 w-full rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {maxQty <= 0 ? "Kuota Promo Habis" : added ? "Ditambahkan!" : "Tambah ke Keranjang"}
        </button>
        <p className="mt-2 text-xs leading-5 text-slate-400">
          Kuota promo terbatas — batasnya dihitung dari total seluruh
          lisensi produk ini di keranjang, lintas paket.
        </p>
      </div>
    </section>
  );
}
