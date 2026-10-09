import "dotenv/config";
import fs from "node:fs";
import path from "node:path";

import catalog from "../data/products.json";
import { db } from "../lib/db/client";
import {
  categories,
  faqs,
  featuredProducts,
  hero,
  posts,
  testimonials,
} from "../lib/db/schema";

const CATEGORY_IDS = {
  kasir: "10000000-0000-4000-8000-000000000001",
  hrPayroll: "10000000-0000-4000-8000-000000000002",
  promo: "10000000-0000-4000-8000-000000000003",
  tips: "10000000-0000-4000-8000-000000000004",
} as const;

const categorySeed = [
  { id: CATEGORY_IDS.kasir, name: "Aplikasi Kasir", slug: "kasir" },
  { id: CATEGORY_IDS.hrPayroll, name: "HR & Payroll", slug: "hr-payroll" },
  { id: CATEGORY_IDS.promo, name: "Promo", slug: "promo" },
  { id: CATEGORY_IDS.tips, name: "Tips & Panduan", slug: "tips" },
] as const;

const heroSeed = {
  id: 1,
  badge: "Promo Akhir Tahun — diskon s/d 40%",
  title: "Software bisnis UMKM yang siap dipakai hari ini",
  subtitle:
    "Aplikasi kasir, HR & payroll, dan add-on pendukung dengan lisensi berlangganan. Daftar lewat promo akhir tahun dan mulai operasional tanpa ribet.",
  imageUrl: "/images/hero.svg",
  ctaLabel: "Lihat Katalog Produk",
  ctaLink: "/products",
};

const featuredSeed = [
  { id: "20000000-0000-4000-8000-000000000001", productSlug: "kodeva-kasir", position: 0, active: true },
  { id: "20000000-0000-4000-8000-000000000002", productSlug: "kodeva-hr-payroll", position: 1, active: true },
  { id: "20000000-0000-4000-8000-000000000003", productSlug: "kodeva-stok", position: 2, active: true },
] as const;

const testimonialSeed = [
  {
    id: "30000000-0000-4000-8000-000000000001",
    name: "Siti Rahma",
    role: "Pemilik Toko Rani Mart",
    quote:
      "Tiga outlet kami akhirnya punya laporan harian yang nyambung. Kasir tidak perlu lagi rekap manual tiap malam.",
    avatarUrl: "",
    position: 0,
    active: true,
  },
  {
    id: "30000000-0000-4000-8000-000000000002",
    name: "Budi Santoso",
    role: "HR Manager, CV Anugerah Jaya",
    quote:
      "Payroll yang dulu dua hari sekarang selesai sebelum makan siang. Slip gaji langsung diterima karyawan.",
    avatarUrl: "",
    position: 1,
    active: true,
  },
  {
    id: "30000000-0000-4000-8000-000000000003",
    name: "Andi Wijaya",
    role: "Founder Kedai Kopi Sudut Lima",
    quote:
      "Stok dan kasir sinkron otomatis, jadi opname bulanan tidak lagi bikin selisih yang bikin pusing.",
    avatarUrl: "",
    position: 2,
    active: true,
  },
] as const;

const faqSeed = [
  {
    id: "40000000-0000-4000-8000-000000000001",
    question: "Apakah harga promo sudah otomatis terpotong?",
    answer:
      "Ya. Harga promo Promo Akhir Tahun sudah terpasang di halaman produk dan otomatis terhitung di keranjang. Kuota lisensi promo terbatas per produk dan akan menolak jumlah melebihi sisa kuota.",
    position: 0,
    active: true,
  },
  {
    id: "40000000-0000-4000-8000-000000000002",
    question: "Apakah ada masa trial sebelum berlangganan?",
    answer:
      "Setiap produk bisa dicoba gratis 14 hari dengan fitur lengkap. Tidak perlu kartu kredit untuk memulai trial.",
    position: 1,
    active: true,
  },
  {
    id: "40000000-0000-4000-8000-000000000003",
    question: "Bagaimana jika internet di toko mati?",
    answer:
      "Kodeva Kasir tetap bisa memproses transaksi dalam mode offline dan akan sinkron otomatis saat koneksi kembali.",
    position: 2,
    active: true,
  },
  {
    id: "40000000-0000-4000-8000-000000000004",
    question: "Bisakah data dari aplikasi lama dipindahkan?",
    answer:
      "Bisa. Tim onboarding membantu impor daftar produk, harga, stok awal, dan data karyawan dari file Excel atau aplikasi lama.",
    position: 3,
    active: true,
  },
  {
    id: "40000000-0000-4000-8000-000000000005",
    question: "Bagaimana cara menghubungi dukungan?",
    answer:
      "Paket Basic mendapat support lewat email pada hari kerja. Paket Pro dan Business mendapat prioritas WhatsApp dan account manager.",
    position: 4,
    active: true,
  },
] as const;

type PostSeed = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverUrl: string;
  file: string;
  categoryId: string;
  productSlugs: string[];
  status: "draft" | "published";
  publishedAt: string | null;
};

const postSeeds: PostSeed[] = [
  {
    id: "50000000-0000-4000-8000-000000000001",
    title: "Aplikasi Kasir untuk UMKM: Mulai dari Mana?",
    slug: "aplikasi-kasir-untuk-umkm",
    excerpt:
      "Panduan memilih aplikasi kasir untuk toko dan warung: tiga hal wajib yang harus ada sebelum Anda memutuskan langganan.",
    coverUrl: "/images/blog-1.svg",
    file: "aplikasi-kasir-untuk-umkm.md",
    categoryId: CATEGORY_IDS.kasir,
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
    categoryId: CATEGORY_IDS.kasir,
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
    categoryId: CATEGORY_IDS.hrPayroll,
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
    categoryId: CATEGORY_IDS.hrPayroll,
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
    categoryId: CATEGORY_IDS.promo,
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
    categoryId: CATEGORY_IDS.tips,
    productSlugs: [],
    status: "draft",
    publishedAt: null,
  },
];

const productSlugs = new Set(catalog.products.map((p) => p.slug));
for (const item of featuredSeed) {
  if (!productSlugs.has(item.productSlug)) {
    throw new Error(`featured product "${item.productSlug}" tidak ada di data/products.json`);
  }
}
for (const post of postSeeds) {
  for (const slug of post.productSlugs) {
    if (!productSlugs.has(slug)) {
      throw new Error(`post "${post.slug}" menautkan produk "${slug}" yang tidak ada di katalog`);
    }
  }
}

async function main() {
  await db.insert(categories).values([...categorySeed]).onConflictDoNothing();
  await db.insert(hero).values(heroSeed).onConflictDoNothing();
  await db.insert(featuredProducts).values([...featuredSeed]).onConflictDoNothing();
  await db.insert(testimonials).values([...testimonialSeed]).onConflictDoNothing();
  await db.insert(faqs).values([...faqSeed]).onConflictDoNothing();

  for (const post of postSeeds) {
    const contentMd = fs.readFileSync(path.join(process.cwd(), "data", "posts", post.file), "utf8");
    await db
      .insert(posts)
      .values({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        coverUrl: post.coverUrl,
        contentMd,
        categoryId: post.categoryId,
        productSlugs: [...post.productSlugs],
        status: post.status,
        publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,
      })
      .onConflictDoNothing();
  }

  const allPosts = await db.select({ slug: posts.slug, status: posts.status }).from(posts);
  const allCategories = await db.select({ slug: categories.slug }).from(categories);
  console.log(
    `Seed selesai. kategori=${allCategories.length} posts=${allPosts.length} (published=${allPosts.filter((p) => p.status === "published").length}, draft=${allPosts.filter((p) => p.status === "draft").length})`,
  );
  // PGlite keeps the event loop alive; force exit once done.
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
