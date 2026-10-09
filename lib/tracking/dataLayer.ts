import { campaign } from "@/lib/marketplace/catalog";
import { captureUtm } from "./utm";

export interface Ga4Item {
  item_id: string;
  item_name: string;
  item_category?: string;
  item_variant?: string;
  price?: number;
  quantity?: number;
}

export interface Ga4Ecommerce {
  currency: string;
  value: number;
  items: Ga4Item[];
}

export const GA4_CURRENCY = "IDR";

/**
 * Push one event to window.dataLayer in GA4 shape. Every payload
 * automatically carries the first-touch UTM attribution, the active
 * campaign, and the current page path so events stay attributable
 * across navigations. Safe to call from client components only; it
 * is a no-op during server rendering.
 */
export function pushEvent(
  event: string,
  params: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") return;
  const target = window as Window & { dataLayer?: unknown[] };
  if (!Array.isArray(target.dataLayer)) {
    target.dataLayer = [];
  }
  target.dataLayer.push({
    event,
    ...params,
    campaign_id: campaign.id,
    campaign_name: campaign.name,
    utm: captureUtm(),
    page_path: window.location.pathname + window.location.search,
  });
}

/**
 * Build the GA4 ecommerce payload for a product-detail view. Kept in
 * this module (not the client component) so server components can
 * assemble the payload before passing it down as props.
 */
export function buildViewEcommerce(input: {
  slug: string;
  name: string;
  category: string;
  price: number;
}): Ga4Ecommerce {
  return {
    currency: GA4_CURRENCY,
    value: input.price,
    items: [
      {
        item_id: input.slug,
        item_name: input.name,
        item_category: input.category,
        price: input.price,
        quantity: 1,
      },
    ],
  };
}
