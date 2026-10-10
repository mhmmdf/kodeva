"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import {
  discountPercent,
  formatIDR,
  getProduct,
} from "@/lib/marketplace/catalog";
import { quotaLeft, useCart, type CartItem } from "@/lib/marketplace/cart";
import { GA4_CURRENCY, pushEvent } from "@/lib/tracking/dataLayer";
import { captureUtm } from "@/lib/tracking/utm";

const inputClassName =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200";

interface ResolvedLine {
  item: CartItem;
  name: string;
  cover: string;
  packageName: string;
  unit: string;
  price: number;
  originalPrice: number;
  maxQty: number;
}

function resolveLine(item: CartItem): ResolvedLine | null {
  const product = getProduct(item.slug);
  if (!product) return null;
  const pkg = product.packages.find((entry) => entry.id === item.packageId);
  if (!pkg) return null;
  return {
    item,
    name: product.name,
    cover: product.screenshots[0] ?? "/images/blog-1.svg",
    packageName: pkg.name,
    unit: pkg.licenseUnit,
    price: pkg.price,
    originalPrice: pkg.originalPrice,
    maxQty: 0,
  };
}

/**
 * Cart + checkout view. The cart store hydrates from localStorage
 * after mount; order submission is simulated locally (the database
 * step will replace it with a server action).
 */
const subscribe = () => () => {};

export function CartView() {
  const router = useRouter();
  const items = useCart((state) => state.items);
  const setQty = useCart((state) => state.setQty);
  const removeItem = useCart((state) => state.removeItem);
  const clear = useCart((state) => state.clear);
  // Server-rendered shell shows a placeholder; the store restores
  // from localStorage after mount (manual hydration, see cart.ts).
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);

  useEffect(() => {
    void useCart.persist.rehydrate();
  }, []);

  if (!hydrated) {
    return (
      <div className="mt-10 animate-pulse rounded-2xl border border-slate-200 bg-slate-50 p-8 text-sm text-slate-400">
        Memuat keranjang…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
        <p className="text-sm font-medium text-slate-600">
          Keranjang Anda masih kosong.
        </p>
        <Link
          href="/products"
          className="mt-4 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
        >
          Jelajahi katalog produk
        </Link>
      </div>
    );
  }

  const lines = items
    .map(resolveLine)
    .filter((line): line is ResolvedLine => line !== null)
    .map((line) => ({
      ...line,
      // The promo cap spans every package of the same product, so the
      // per-line headroom is what is left after the other lines.
      maxQty: quotaLeft(items, line.item.slug, line.item.packageId),
    }));

  const subtotal = lines.reduce(
    (sum, line) => sum + line.price * line.item.qty,
    0,
  );
  const originalTotal = lines.reduce(
    (sum, line) => sum + line.originalPrice * line.item.qty,
    0,
  );
  const savings = originalTotal - subtotal;

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="space-y-4">
        {lines.map((line) => {
          const lineTotal = line.price * line.item.qty;
          const percent = discountPercent({
            id: line.item.packageId,
            name: line.packageName,
            licenseUnit: line.unit as "user" | "outlet",
            price: line.price,
            originalPrice: line.originalPrice,
            description: "",
            features: [],
          });
          return (
            <article
              key={`${line.item.slug}:${line.item.packageId}`}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4"
            >
              <Image
                src={line.cover}
                alt=""
                width={160}
                height={90}
                className="hidden h-[90px] w-[160px] shrink-0 rounded-xl object-cover sm:block"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-900">
                      <Link
                        href={`/products/${line.item.slug}`}
                        className="hover:text-indigo-600"
                      >
                        {line.name}
                      </Link>
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Paket {line.packageName} · per {line.unit}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      removeItem(line.item.slug, line.item.packageId)
                    }
                    className="text-xs font-medium text-slate-400 hover:text-rose-600"
                  >
                    Hapus
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center rounded-lg border border-slate-300">
                    <button
                      type="button"
                      aria-label={`Kurangi ${line.name}`}
                      onClick={() =>
                        setQty(
                          line.item.slug,
                          line.item.packageId,
                          line.item.qty - 1,
                        )
                      }
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-sm font-semibold text-slate-900">
                      {line.item.qty}
                    </span>
              <button
                type="button"
                aria-label={`Tambah ${line.name}`}
                disabled={line.item.qty >= line.maxQty}
                onClick={() =>
                  setQty(
                    line.item.slug,
                    line.item.packageId,
                    Math.min(line.maxQty, line.item.qty + 1),
                  )
                }
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300"
              >
                +
              </button>
            </div>
            {line.item.qty >= line.maxQty ? (
              <p className="text-xs text-amber-600">
                Maks. {line.maxQty} — batas kuota promo produk ini
                (dihitung dari total seluruh paket)
              </p>
            ) : null}
                  <div className="text-right">
                    {percent > 0 ? (
                      <p className="text-xs font-semibold text-rose-500 line-through">
                        {formatIDR(line.originalPrice * line.item.qty)}
                      </p>
                    ) : null}
                    <p className="text-sm font-bold text-slate-900">
                      {formatIDR(lineTotal)}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-bold text-slate-900">Ringkasan pesanan</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between text-slate-500">
            <dt>Subtotal</dt>
            <dd>{formatIDR(originalTotal)}</dd>
          </div>
          {savings > 0 ? (
            <div className="flex justify-between font-medium text-rose-600">
              <dt>Diskon promo</dt>
              <dd>−{formatIDR(savings)}</dd>
            </div>
          ) : null}
          <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-900">
            <dt>Total</dt>
            <dd>{formatIDR(subtotal)}</dd>
          </div>
        </dl>

        <form
          className="mt-5 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            const utm = captureUtm();
            // Payment is simulated locally; the buyer picks which
            // outcome to exercise (success or failure) in the form.
            const simulatedFailed = form.get("simulated_result") === "failed";

            // Mock order payload: mirrors what a future backend would
            // receive on checkout, including first-touch UTM attribution.
            const mockOrder = {
              id: `mock-${Date.now()}`,
              status: simulatedFailed ? "failed" : "paid",
              buyer: {
                name: String(form.get("name") ?? ""),
                email: String(form.get("email") ?? ""),
                whatsapp: String(form.get("whatsapp") ?? ""),
              },
              currency: GA4_CURRENCY,
              subtotal,
              items: lines.map((line) => ({
                item_id: line.item.slug,
                item_name: line.name,
                item_variant: line.packageName,
                price: line.price,
                quantity: line.item.qty,
              })),
              utm,
              createdAt: new Date().toISOString(),
            };

            pushEvent("begin_checkout", {
              ecommerce: {
                currency: GA4_CURRENCY,
                value: subtotal,
                items: mockOrder.items,
              },
              checkout_id: mockOrder.id,
            });
            try {
              localStorage.setItem(
                "kodeva:last_order",
                JSON.stringify(mockOrder),
              );
            } catch {
              // private mode / storage full — keep checkout working
            }

            if (simulatedFailed) {
              // Keep the cart so the buyer can retry after the failure.
              router.push("/cart/failed");
              return;
            }
            clear();
            router.push("/cart/success");
          }}
        >
          <p className="text-sm font-semibold text-slate-900">
            Data pemesan
          </p>
          <label className="block">
            <span className="sr-only">Nama lengkap</span>
            <input
              type="text"
              name="name"
              required
              minLength={2}
              maxLength={80}
              autoComplete="name"
              placeholder="Nama lengkap"
              className={inputClassName}
            />
          </label>
          <label className="block">
            <span className="sr-only">Email</span>
            <input
              type="email"
              name="email"
              required
              maxLength={120}
              autoComplete="email"
              placeholder="Email"
              className={inputClassName}
            />
          </label>
          <label className="block">
            <span className="sr-only">Nomor WhatsApp</span>
            <input
              type="tel"
              name="whatsapp"
              maxLength={16}
              autoComplete="tel"
              placeholder="Nomor WhatsApp (opsional)"
              className={inputClassName}
            />
          </label>
          <fieldset className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <legend className="px-1 text-sm font-semibold text-slate-900">
              Hasil simulasi pembayaran
            </legend>
            <div className="mt-1 flex gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="radio"
                  name="simulated_result"
                  value="success"
                  defaultChecked
                  className="h-4 w-4 accent-indigo-600"
                />
                Sukses
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="radio"
                  name="simulated_result"
                  value="failed"
                  className="h-4 w-4 accent-indigo-600"
                />
                Gagal
              </label>
            </div>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Pembayaran masih simulasi, jadi hasilnya bisa dipilih. Kalau
              gagal, keranjang tetap tersimpan untuk dicoba lagi.
            </p>
          </fieldset>
          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
          >
            Buat Pesanan
          </button>
          <p className="text-xs leading-5 text-slate-400">
            Simulasi checkout — pesanan belum benar-benar diproses.
          </p>
        </form>
      </aside>
    </div>
  );
}
