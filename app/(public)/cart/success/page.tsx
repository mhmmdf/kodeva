import type { Metadata } from "next";
import Link from "next/link";

export const instant = false;

export const metadata: Metadata = {
  title: "Pesanan Diterima",
  description: "Simulasi pesanan produk Kodeva berhasil dibuat.",
  alternates: { canonical: "/cart/success" },
  robots: { index: false, follow: false },
};

export default function OrderSuccessPage() {
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-24 text-center sm:px-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-600">
        ✓
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
        Pesanan diterima!
      </h1>
      <p className="mt-4 text-base leading-7 text-slate-600">
        Terima kasih. Ini simulasi checkout — tim kami akan menghubungi Anda
        untuk mengaktifkan lisensi dalam 1×24 jam.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/products"
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
        >
          Lanjut belanja
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-indigo-300"
        >
          Kembali ke beranda
        </Link>
      </div>
    </div>
  );
}
