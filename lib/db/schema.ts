import { relations, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull().default(""),
  coverUrl: text("cover_url").notNull().default(""),
  contentMd: text("content_md").notNull(),
  categoryId: uuid("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  productSlugs: jsonb("product_slugs")
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'::jsonb`),
  status: text("status").notNull().default("draft"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const hero = pgTable("hero", {
  id: integer("id").primaryKey().default(1),
  badge: text("badge").notNull().default(""),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  imageUrl: text("image_url").notNull().default(""),
  ctaLabel: text("cta_label").notNull(),
  ctaLink: text("cta_link").notNull().default("/products"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const featuredProducts = pgTable("featured_products", {
  id: uuid("id").primaryKey().defaultRandom(),
  productSlug: text("product_slug").notNull().unique(),
  position: integer("position").notNull().default(0),
  active: boolean("active").notNull().default(true),
});

export const testimonials = pgTable("testimonials", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  role: text("role").notNull().default(""),
  quote: text("quote").notNull(),
  avatarUrl: text("avatar_url").notNull().default(""),
  position: integer("position").notNull().default(0),
  active: boolean("active").notNull().default(true),
});

export const faqs = pgTable("faqs", {
  id: uuid("id").primaryKey().defaultRandom(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  position: integer("position").notNull().default(0),
  active: boolean("active").notNull().default(true),
});

export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  whatsapp: text("whatsapp"),
  page: text("page").notNull().default("/"),
  utm: jsonb("utm").$type<Record<string, string>>().notNull().default(sql`'{}'::jsonb`),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const postsRelations = relations(posts, ({ one }) => ({
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id],
  }),
}));

export const schema = {
  categories,
  posts,
  hero,
  featuredProducts,
  testimonials,
  faqs,
  leads,
  postsRelations,
};

export type Category = typeof categories.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Hero = typeof hero.$inferSelect;
export type FeaturedProduct = typeof featuredProducts.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type Faq = typeof faqs.$inferSelect;
export type Lead = typeof leads.$inferSelect;
