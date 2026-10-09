"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";

import { useCart } from "@/lib/marketplace/cart";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/products", label: "Produk" },
  { href: "/blog", label: "Blog" },
];

const menuLinks = [
  ...links,
  { href: "/cart", label: "Keranjang" },
  { href: "/products", label: "Lihat Promo" },
];

const subscribe = () => () => {};

function CartIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M2 3h2.5l2.2 11.1a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.55L21 7H6" />
    </svg>
  );
}

/**
 * Sticky site header. Desktop shows inline navigation; below 640px the
 * navigation collapses into a hamburger menu while the cart icon stays
 * reachable from every page (brief requirement). The cart badge defers
 * rendering until the persisted store hydrates to avoid SSR mismatch.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const items = useCart((state) => state.items);
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);

  useEffect(() => {
    void useCart.persist.rehydrate();
  }, []);

  const cartCount = hydrated
    ? items.reduce((sum, item) => sum + item.qty, 0)
    : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-black text-white">
            K
          </span>
          Kodeva
        </Link>

        <nav
          className="hidden items-center gap-1 sm:flex sm:gap-2"
          aria-label="Navigasi utama"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            aria-label={
              cartCount > 0 ? `Keranjang, ${cartCount} item` : "Keranjang"
            }
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <CartIcon />
            {cartCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold leading-none text-white">
                {cartCount}
              </span>
            ) : null}
          </Link>
          <Link
            href="/products"
            className="hidden rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 sm:block"
          >
            Lihat Promo
          </Link>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            onClick={() => setOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 sm:hidden"
          >
            {open ? (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                className="h-5 w-5"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                className="h-5 w-5"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="site-menu"
          aria-label="Navigasi seluler"
          className="absolute inset-x-0 top-full border-b border-slate-200 bg-white px-4 py-3 shadow-lg sm:hidden"
        >
          <ul className="space-y-1">
            {menuLinks.map((link) => (
              <li key={`${link.href}-${link.label}`}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
