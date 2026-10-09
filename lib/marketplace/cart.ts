import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Client-side cart store for the marketplace. Persisted to
 * localStorage; hydration is manual (skipHydration) so the SSR
 * shell never mismatches the restored client state. Persistence
 * to the database (order submission) happens in a later step.
 */

export interface CartItem {
  slug: string;
  packageId: string;
  qty: number;
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
          const existing = state.items.find((line) =>
            sameLine(line, item.slug, item.packageId),
          );
          if (existing) {
            return {
              items: state.items.map((line) =>
                sameLine(line, item.slug, item.packageId)
                  ? { ...line, qty: line.qty + item.qty }
                  : line,
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      setQty: (slug, packageId, qty) =>
        set((state) => ({
          items: state.items.flatMap((line) => {
            if (!sameLine(line, slug, packageId)) return [line];
            if (qty <= 0) return [];
            return [{ ...line, qty }];
          }),
        })),

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
    },
  ),
);
