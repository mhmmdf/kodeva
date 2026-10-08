import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Blog content reader — STATIC version (not yet connected to the
 * database). Function names and data shapes mirror the database
 * version so the upcoming DB step only replaces function bodies,
 * not components. Metadata lives in a local manifest; article
 * bodies are plain Markdown files under `data/posts/`.
 */

export const POSTS_PER_PAGE = 5;

export interface PostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverUrl: string;
  publishedAt: string | null;
  categoryName: string | null;
}

export interface PostPage {
  items: PostListItem[];
  page: number;
  totalPages: number;
  total: number;
}

interface PostManifestEntry {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverUrl: string;
  file: string;
  categoryName: string;
  productSlugs: string[];
  status: "draft" | "published";
  publishedAt: string | null;
}

const manifest: PostManifestEntry[] = [
  {
    id: "50000000-0000-4000-8000-000000000001",
    title: "Aplikasi Kasir untuk UMKM: Mulai dari Mana?",
    slug: "aplikasi-kasir-untuk-umkm",
    excerpt:
      "Panduan memilih aplikasi kasir untuk toko dan warung: tiga hal wajib yang harus ada sebelum Anda memutuskan langganan.",
    coverUrl: "/images/blog-1.svg",
    file: "aplikasi-kasir-untuk-umkm.md",
    categoryName: "Kasir",
    productSlugs: ["kodeva-kasir", "kodeva-kasir-pro"],
    status: "published",
    publishedAt: "2026-10-01T09:00:00+07:00",
  },
  {
    id: "50000000-0000-4000-8000-000000000002",
    title: "5 Fitur Wajib Aplikasi Kasir Modern",
    slug: "fitur-wajib-aplikasi-kasir-modern",
    excerpt:
      "Lima fitur yang benar-benar menghemat waktu harian kasir, lengkap dengan tabel perbandingannya.",
    coverUrl: "/images/blog-2.svg",
    file: "fitur-wajib-aplikasi-kasir-modern.md",
    categoryName: "Kasir",
    productSlugs: ["kodeva-kasir", "kodeva-kasir-pro"],
    status: "published",
    publishedAt: "2026-10-03T10:00:00+07:00",
  },
  {
    id: "50000000-0000-4000-8000-000000000003",
    title: "Kelola HR & Payroll UMKM Tanpa Ribet",
    slug: "kelola-hr-payroll-tanpa-ribet",
    excerpt:
      "Cara merapikan cuti, approval, slip gaji, dan pelaporan dengan tim HR yang hanya berisi satu atau dua orang.",
    coverUrl: "/images/blog-3.svg",
    file: "kelola-hr-payroll-tanpa-ribet.md",
    categoryName: "HR & Payroll",
    productSlugs: ["kodeva-hr-payroll", "kodeva-attendance"],
    status: "published",
    publishedAt: "2026-10-04T08:30:00+07:00",
  },
  {
    id: "50000000-0000-4000-8000-000000000004",
    title: "Cara Hitung Gaji Karyawan dan THR yang Benar",
    slug: "cara-hitung-gaji-dan-thr-karyawan",
    excerpt:
      "Ringkasan logika payroll Indonesia: lembur, BPJS, PPh 21, dan aturan THR yang sering salah hitung.",
    coverUrl: "/images/blog-4.svg",
    file: "cara-hitung-gaji-dan-thr-karyawan.md",
    categoryName: "HR & Payroll",
    productSlugs: ["kodeva-hr-payroll"],
    status: "published",
    publishedAt: "2026-10-05T11:00:00+07:00",
  },
  {
    id: "50000000-0000-4000-8000-000000000005",
    title: "Promo Akhir Tahun Kodeva: Diskon Lisensi hingga 40%",
    slug: "promo-akhir-tahun-kodeva",
    excerpt:
      "Detail Promo Akhir Tahun: produk yang didiskon, aturan kuota lisensi, dan cara klaimnya tanpa kode voucher.",
    coverUrl: "/images/blog-5.svg",
    file: "promo-akhir-tahun-kodeva.md",
    categoryName: "Promo",
    productSlugs: ["kodeva-kasir", "kodeva-hr-payroll", "kodeva-stok"],
    status: "published",
    publishedAt: "2026-10-06T13:00:00+07:00",
  },
  {
    id: "50000000-0000-4000-8000-000000000006",
    title: "Strategi Ekspansi ke Malaysia dan Singapura",
    slug: "strategi-ekspansi-malaysia-singapura",
    excerpt:
      "Draft: catatan internal tentang localisasi konten, struktur multi-locale, dan kanal akuisisi.",
    coverUrl: "/images/blog-6.svg",
    file: "strategi-ekspansi-malaysia-singapura.md",
    categoryName: "Tips & Panduan",
    productSlugs: [],
    status: "draft",
    publishedAt: null,
  },
];

function toListItem(entry: PostManifestEntry): PostListItem {
  return {
    id: entry.id,
    title: entry.title,
    slug: entry.slug,
    excerpt: entry.excerpt,
    coverUrl: entry.coverUrl,
    publishedAt: entry.publishedAt,
    categoryName: entry.categoryName,
  };
}

export function getPublishedSlugs(): string[] {
  return manifest
    .filter((entry) => entry.status === "published")
    .map((entry) => entry.slug);
}

export async function getPublishedPosts(
  page: number,
  perPage: number = POSTS_PER_PAGE,
): Promise<PostPage> {
  const safePage = Math.max(1, Math.trunc(page) || 1);

  const published = manifest
    .filter((entry) => entry.status === "published")
    .sort((a, b) => {
      if (a.publishedAt === null) return 1;
      if (b.publishedAt === null) return -1;
      return b.publishedAt.localeCompare(a.publishedAt);
    });

  const total = published.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const offset = (safePage - 1) * perPage;

  return {
    items: published.slice(offset, offset + perPage).map(toListItem),
    page: Math.min(safePage, totalPages),
    totalPages,
    total,
  };
}

export interface PostDetail extends PostListItem {
  contentMd: string;
  productSlugs: string[];
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  const entry = manifest.find(
    (item) => item.slug === slug && item.status === "published",
  );
  if (!entry) return null;

  const contentMd = await readFile(
    join(process.cwd(), "data", "posts", entry.file),
    "utf8",
  );

  return { ...toListItem(entry), contentMd, productSlugs: entry.productSlugs };
}
