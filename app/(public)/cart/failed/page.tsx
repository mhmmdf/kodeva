import type { Metadata } from "next";
import Link from "next/link";

import { LastOrderPanel } from "@/components/marketplace/LastOrderPanel";

export const instant = false;

export const metadata: Metadata = {
  title: "Pembayaran Gagal",
  description: "Simulasi pembayaran pesanan Kodeva gagal diproses.",
  alternates: { canonical: "/cart/failed" },
  robots: { index: false, follow: false },
};

export default function OrderFailedPage() {
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-24 sm:px-6">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-3xl text-rose-600">
          ✕
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
          Pembayaran gagal
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Ini simulasi pembayaran yang gagal — tidak ada uang yang dipotong dan
          keranjang Anda masih tersimpan, jadi bisa langsung dicoba lagi.
        </p>
      </div>

      <LastOrderPanel />

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/cart"
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
        >
          Coba bayar lagi
        </Link>
        <Link
          href="/products"
          className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-indigo-300"
        >
          Lanjut belanja
        </Link>
      </div>
    </div>
  );
}
