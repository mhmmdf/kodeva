import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const urlPattern = /^(\/[^\s]*|https?:\/\/[^\s]+)$/;

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(80),
  email: z.email("Format email tidak valid").max(120),
  whatsapp: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{8,16}$/, "Format nomor tidak valid")
    .optional()
    .or(z.literal("")),
  page: z.string().max(300).default("/"),
  utm: z.record(z.string(), z.string()).default({}),
  website: z.string().max(0).optional(), // honeypot: must stay empty
});

export const loginSchema = z.object({
  email: z.email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export const heroSchema = z.object({
  badge: z.string().trim().max(60, "Maksimal 60 karakter"),
  title: z.string().trim().min(3, "Judul minimal 3 karakter").max(100),
  subtitle: z.string().trim().min(10, "Subjudul minimal 10 karakter").max(300),
  imageUrl: z
    .string()
    .trim()
    .regex(urlPattern, "Harus path (/images/...) atau URL http(s)")
    .max(300),
  ctaLabel: z.string().trim().min(2, "Label CTA minimal 2 karakter").max(40),
  ctaLink: z
    .string()
    .trim()
    .regex(urlPattern, "Harus path (/products) atau URL http(s)")
    .max(300),
});

export const testimonialSchema = z.object({
  name: z.string().trim().min(2).max(60),
  role: z.string().trim().max(60),
  quote: z.string().trim().min(10, "Testimoni minimal 10 karakter").max(400),
  avatarUrl: z.string().trim().max(300).default(""),
  active: z.boolean().default(true),
});

export const faqSchema = z.object({
  question: z.string().trim().min(3, "Pertanyaan minimal 3 karakter").max(200),
  answer: z.string().trim().min(5, "Jawaban minimal 5 karakter").max(1000),
  active: z.boolean().default(true),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2).max(60),
  slug: z.string().trim().regex(slugPattern, "Huruf kecil, angka, dan tanda minus"),
});

export const postSchema = z.object({
  title: z.string().trim().min(3, "Judul minimal 3 karakter").max(120),
  slug: z
    .string()
    .trim()
    .regex(slugPattern, "Huruf kecil, angka, dan tanda minus (contoh: judul-artikel)"),
  excerpt: z.string().trim().max(200, "Ringkasan maksimal 200 karakter"),
  coverUrl: z
    .string()
    .trim()
    .regex(urlPattern, "Harus path (/images/...) atau URL http(s)")
    .max(300),
  contentMd: z.string().trim().min(20, "Isi artikel minimal 20 karakter"),
  categoryId: z.uuid("Kategori tidak valid"),
  productSlugs: z.array(z.string()).max(10).default([]),
  status: z.enum(["draft", "published"]).default("draft"),
});

export type LeadInput = z.infer<typeof leadSchema>;
export type HeroInput = z.infer<typeof heroSchema>;
export type TestimonialInput = z.infer<typeof testimonialSchema>;
export type FaqInput = z.infer<typeof faqSchema>;
export type PostInput = z.infer<typeof postSchema>;
