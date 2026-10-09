import Link from "next/link";

const columns = [
  {
    title: "Produk",
    links: [
      { href: "/products", label: "Semua produk" },
      { href: "/products/kodeva-kasir", label: "Kodeva Kasir" },
      { href: "/products/kodeva-hr-payroll", label: "HR & Payroll" },
      { href: "/products/kodeva-stok", label: "Kodeva Stok" },
    ],
  },
  {
    title: "Perusahaan",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/#testimoni", label: "Testimoni" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    title: "Dukungan",
    links: [
      { href: "/#hubungi-kami", label: "Hubungi kami" },
      { href: "/blog", label: "Panduan UMKM" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-black text-white">
              K
            </span>
            Kodeva
          </div>
          <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">
            Software bisnis untuk UMKM Indonesia: kasir, HR & payroll,
            absensi, dan manajemen stok dalam satu platform.
          </p>
        </div>
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h3 className="text-sm font-semibold text-slate-900">
              {column.title}
            </h3>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={`${column.title}-${link.label}-${link.href}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 transition-colors hover:text-indigo-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-slate-200">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© 2026 Kodeva — PT Digital Solusi Grup. Data contoh untuk keperluan demo.</p>
          <p>Jakarta, Indonesia · halo@kodeva.test</p>
        </div>
      </div>
    </footer>
  );
}
