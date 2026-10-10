"use client";

import { useSyncExternalStore } from "react";

import { formatIDR } from "@/lib/marketplace/catalog";

export interface MockOrder {
  id: string;
  status: "paid" | "failed";
  buyer: { name: string; email: string; whatsapp: string };
  currency: string;
  subtotal: number;
  items: {
    item_id: string;
    item_name: string;
    item_variant: string;
    price: number;
    quantity: number;
  }[];
  utm: Record<string, string>;
  createdAt: string;
}

const subscribe = () => () => {};

// localStorage is an external store; parse results are cached by the
// raw string so getSnapshot stays referentially stable between calls.
let cachedRaw: string | null = null;
let cachedOrder: MockOrder | null = null;

function readLastOrder(): MockOrder | null {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem("kodeva:last_order");
  } catch {
    return null;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedOrder = raw ? (JSON.parse(raw) as MockOrder) : null;
    } catch {
      cachedOrder = null;
    }
  }
  return cachedOrder;
}

/**
 * Summary of the last simulated order, restored from localStorage on
 * the client (checkout only exists in the browser, so the server
 * never knows about it).
 */
export function LastOrderPanel() {
  const order = useSyncExternalStore(subscribe, readLastOrder, () => null);
  // SSR shell never touches localStorage; wait for the client before
  // deciding whether an order exists.
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);

  if (!hydrated) {
    return (
      <div className="mt-8 animate-pulse rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-400">
        Memuat ringkasan pesanan…
      </div>
    );
  }

  if (!order) {
    return (
      <p className="mt-8 text-sm text-slate-500">
        Tidak ada data pesanan simulasi di perangkat ini.
      </p>
    );
  }

  const items = order.items ?? [];
  const utmEntries = Object.entries(order.utm ?? {}).filter(
    ([, value]) => value,
  );

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 text-left">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <p className="text-sm font-semibold text-slate-900">
          Ringkasan pesanan
        </p>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            order.status === "failed"
              ? "bg-rose-50 text-rose-700"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {order.status === "failed" ? "Gagal (simulasi)" : "Dibayar (simulasi)"}
        </span>
      </div>

      <dl className="mt-3 space-y-1 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500">No. pesanan</dt>
          <dd className="font-medium text-slate-900">{order.id}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500">Pemesan</dt>
          <dd className="text-right font-medium text-slate-900">
            {order.buyer.name}
            <span className="block text-xs font-normal text-slate-500">
              {order.buyer.email}
            </span>
          </dd>
        </div>
        {utmEntries.length > 0 ? (
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Sumber</dt>
            <dd className="text-right text-slate-700">
              {utmEntries.map(([key, value]) => `${key}=${value}`).join(", ")}
            </dd>
          </div>
        ) : null}
      </dl>

      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li
            key={`${item.item_id}:${item.item_variant}`}
            className="flex items-center gap-3"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900">
                {item.item_name}
              </p>
              <p className="text-xs text-slate-500">
                Paket {item.item_variant} × {item.quantity}
              </p>
            </div>
            <p className="shrink-0 text-sm font-semibold text-slate-900">
              {formatIDR(item.price * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <p className="text-sm font-semibold text-slate-900">Total</p>
        <p className="text-base font-bold text-slate-900">
          {formatIDR(order.subtotal)}
        </p>
      </div>
    </section>
  );
}
