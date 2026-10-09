"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import { pushEvent } from "@/lib/tracking/dataLayer";

interface TrackedCtaLinkProps extends ComponentProps<typeof Link> {
  contentId: string;
  contentType?: string;
}

/**
 * Link that reports a GA4 select_content event when clicked (landing
 * CTA buttons and featured-product cards). Tracking runs inside the
 * click handler, so it fires once per real click and never on re-render.
 */
export function TrackedCtaLink({
  contentId,
  contentType = "cta",
  onClick,
  ...rest
}: TrackedCtaLinkProps) {
  return (
    <Link
      {...rest}
      onClick={(event) => {
        pushEvent("select_content", {
          content_type: contentType,
          content_id: contentId,
          link_url:
            typeof rest.href === "string" ? rest.href : String(rest.href),
          cta_label: contentId,
        });
        onClick?.(event);
      }}
    />
  );
}
