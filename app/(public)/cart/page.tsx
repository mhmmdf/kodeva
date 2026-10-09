import type { Metadata } from "next";

import { CartView } from "@/components/marketplace/CartView";

export const instant = false;

export const metadata: Metadata = {
  title: "Keranjang Belanja",
  description:
    "Tinjau pesanan produk Kodeva Anda sebelum checkout. Promo akhir tahun otomatis terhitung di keranjang.",
  alternates: { canonical: "/cart" },
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
          Keranjang
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Keranjang belanja Anda
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600">
          Kuota promo terbatas per produk — jumlah di keranjang otomatis
          dibatasi sisa lisensi.
        </p>
      </header>

      <CartView />
    </div>
  );
}
