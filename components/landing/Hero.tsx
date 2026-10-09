import Image from "next/image";
import Link from "next/link";

import type { HeroContent } from "@/lib/content/landing";

export function Hero({ data }: { data: HeroContent }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-slate-900">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12), transparent 40%), radial-gradient(circle at 80% 70%, rgba(99,102,241,0.35), transparent 45%)",
        }}
      />
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:py-24">
        <div>
          {data.badge ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-100">
              {data.badge}
            </span>
          ) : null}
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            {data.title}
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-indigo-100/90">
            {data.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={data.ctaLink || "/products"}
              className="rounded-xl bg-white px-6 py-3 text-base font-semibold text-indigo-700 shadow-lg transition-transform hover:-translate-y-0.5"
            >
              {data.ctaLabel}
            </Link>
            <Link
              href="#hubungi-kami"
              className="rounded-xl border border-white/40 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              Hubungi Kami
            </Link>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-white/20 pt-6 text-white">
            <div>
              <dt className="text-xs text-indigo-200">Pelanggan aktif</dt>
              <dd className="text-xl font-bold">1.200+</dd>
            </div>
            <div>
              <dt className="text-xs text-indigo-200">Transaksi/bulan</dt>
              <dd className="text-xl font-bold">4,8 jt</dd>
            </div>
            <div>
              <dt className="text-xs text-indigo-200">Uptime layanan</dt>
              <dd className="text-xl font-bold">99,9%</dd>
            </div>
          </dl>
        </div>
        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-2xl">
            <Image
              src={data.imageUrl || "/images/hero.svg"}
              alt="Pratinjau platform Kodeva"
              width={1200}
              height={800}
              priority
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
