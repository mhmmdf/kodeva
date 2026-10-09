"use client";

import { useEffect } from "react";

import { pushEvent, type Ga4Ecommerce } from "@/lib/tracking/dataLayer";

/**
 * Fires a GA4 view_item event exactly once per product-page mount.
 * The effect only depends on the product id, so component re-renders
 * (package selection, quantity changes) never resend the event.
 */
export function ViewItemTracker({ ecommerce }: { ecommerce: Ga4Ecommerce }) {
  const itemId = ecommerce.items[0]?.item_id ?? "";
  useEffect(() => {
    pushEvent("view_item", { ecommerce });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);
  return null;
}
