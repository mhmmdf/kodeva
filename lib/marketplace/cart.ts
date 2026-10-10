import { create } from "zustand";
import { persist } from "zustand/middleware";

import { getProduct } from "./catalog";

/**
 * Client-side cart store for the marketplace. Persisted to
 * localStorage; hydration is manual (skipHydration) so the SSR
 * shell never mismatches the restored client state. Persistence
 * to the database (order submission) happens in a later step.
 *
 * Promo quota is enforced here as the single source of truth: the
 * cap applies to the SUM of every license of the same product in
 * the cart, across all of its packages — not per line.
 */

export interface CartItem {
  slug: string;
  packageId: string;
  qty: number;
}

/** Remaining promo quota for a product; 0 when unknown. */
export function quotaCap(slug: string): number {
  return Math.max(0, getProduct(slug)?.promoRemaining ?? 0);
}

/** Licenses of the same product already in the cart, optionally excluding one package line. */
export function quotaUsed(
  items: CartItem[],
  slug: string,
  excludePackageId?: string,
): number {
  return items
    .filter(
      (item) =>
        item.slug === slug && item.packageId !== excludePackageId,
    )
    .reduce((sum, item) => sum + item.qty, 0);
}

/** How many more licenses of this package can still be added. */
export function quotaLeft(
  items: CartItem[],
  slug: string,
  packageId: string,
): number {
  return Math.max(0, quotaCap(slug) - quotaUsed(items, slug, packageId));
}

/**
 * Clamp restored lines so a tampered or stale localStorage payload can
 * never push one product over its promo quota: lines are applied in
 * order and cut off once the product-wide cap is reached.
 */
function clampItems(items: CartItem[]): CartItem[] {
  const used = new Map<string, number>();
  const result: CartItem[] = [];
  for (const item of items) {
    const already = used.get(item.slug) ?? 0;
    const qty = Math.min(
      Math.max(0, item.qty),
      Math.max(0, quotaCap(item.slug) - already),
    );
    if (qty <= 0) continue;
    result.push({ ...item, qty });
    used.set(item.slug, already + qty);
  }
  return result;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  setQty: (slug: string, packageId: string, qty: number) => void;
  removeItem: (slug: string, packageId: string) => void;
  clear: () => void;
}

function sameLine(item: CartItem, slug: string, packageId: string): boolean {
  return item.slug === slug && item.packageId === packageId;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          // Clamp against the product-wide quota: whatever is already
          // in the cart under other packages counts toward the same cap.
          const allowed = quotaLeft(state.items, item.slug, item.packageId);
          const qty = Math.min(item.qty, allowed);
          if (qty <= 0) return state;

          const existing = state.items.find((line) =>
            sameLine(line, item.slug, item.packageId),
          );
          if (existing) {
            return {
              items: state.items.map((line) =>
                sameLine(line, item.slug, item.packageId)
                  ? { ...line, qty: line.qty + qty }
                  : line,
              ),
            };
          }
          return { items: [...state.items, { ...item, qty }] };
        }),

      setQty: (slug, packageId, qty) =>
        set((state) => {
          const allowed = quotaLeft(state.items, slug, packageId);
          return {
            items: state.items.flatMap((line) => {
              if (!sameLine(line, slug, packageId)) return [line];
              const nextQty = Math.min(qty, allowed);
              if (nextQty <= 0) return [];
              return [{ ...line, qty: nextQty }];
            }),
          };
        }),

      removeItem: (slug, packageId) =>
        set((state) => ({
          items: state.items.filter(
            (line) => !sameLine(line, slug, packageId),
          ),
        })),

      clear: () => set({ items: [] }),
    }),
    {
      name: "kodeva:cart",
      skipHydration: true,
      merge: (persisted, current) => {
        const items = (persisted as { items?: CartItem[] } | null)?.items;
        return {
          ...current,
          items: Array.isArray(items) ? clampItems(items) : [],
        };
      },
    },
  ),
);
