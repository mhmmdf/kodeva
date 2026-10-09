/**
 * Cache tags for CMS content (Cache Components / `use cache`).
 * Every admin mutation calls `updateTag` with the related tag so
 * changes appear without a redeploy.
 */
export const cacheTags = {
  landing: "landing",
  testimonials: "testimonials",
  faqs: "faqs",
  featured: "featured",
  postsList: "posts:list",
  post: (slug: string) => `post:${slug}`,
} as const;
