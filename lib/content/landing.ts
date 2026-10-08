import { getProduct, type Product } from "@/lib/marketplace/catalog";

/**
 * Reader konten landing — versi STATIS (belum terhubung database).
 * Nama fungsi dan bentuk datanya disamakan dengan versi database supaya
 * saat step DB berikutnya hanya isi fungsi yang diganti, bukan komponen.
 */

export interface HeroContent {
  badge: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaLabel: string;
  ctaLink: string;
}

const hero: HeroContent = {
  badge: "Promo Akhir Tahun — diskon s/d 40%",
  title: "Software bisnis UMKM yang siap dipakai hari ini",
  subtitle:
    "Aplikasi kasir, HR & payroll, dan add-on pendukung dengan lisensi berlangganan. Daftar lewat promo akhir tahun dan mulai operasional tanpa ribet.",
  imageUrl: "/images/hero.svg",
  ctaLabel: "Lihat Katalog Produk",
  ctaLink: "/produk",
};

export async function getHero(): Promise<HeroContent> {
  return hero;
}

const featuredSlugs = ["kodeva-kasir", "kodeva-hr-payroll", "kodeva-stok"];

export async function getFeaturedProducts(): Promise<Product[]> {
  return featuredSlugs
    .map((slug) => getProduct(slug))
    .filter((product): product is Product => Boolean(product));
}

export interface TestimonialContent {
  name: string;
  role: string;
  quote: string;
  avatarUrl: string;
}

const testimonials: TestimonialContent[] = [
  {
    name: "Siti Rahma",
    role: "Pemilik Toko Rani Mart",
    quote:
      "Tiga outlet kami akhirnya punya laporan harian yang nyambung. Kasir tidak perlu lagi rekap manual tiap malam.",
    avatarUrl: "",
  },
  {
    name: "Budi Santoso",
    role: "HR Manager, CV Anugerah Jaya",
    quote:
      "Payroll yang dulu dua hari sekarang selesai sebelum makan siang. Slip gaji langsung diterima karyawan.",
    avatarUrl: "",
  },
  {
    name: "Andi Wijaya",
    role: "Founder Kedai Kopi Sudut Lima",
    quote:
      "Stok dan kasir sinkron otomatis, jadi opname bulanan tidak lagi bikin selisih yang bikin pusing.",
    avatarUrl: "",
  },
];

export async function getTestimonials(): Promise<TestimonialContent[]> {
  return testimonials;
}

export interface FaqContent {
  question: string;
  answer: string;
}

const faqs: FaqContent[] = [
  {
    question: "Apakah harga promo sudah otomatis terpotong?",
    answer:
      "Ya. Harga promo Promo Akhir Tahun sudah terpasang di halaman produk dan otomatis terhitung di keranjang. Kuota lisensi promo terbatas per produk dan akan menolak jumlah melebihi sisa kuota.",
  },
  {
    question: "Apakah ada masa trial sebelum berlangganan?",
    answer:
      "Setiap produk bisa dicoba gratis 14 hari dengan fitur lengkap. Tidak perlu kartu kredit untuk memulai trial.",
  },
  {
    question: "Bagaimana jika internet di toko mati?",
    answer:
      "Kodeva Kasir tetap bisa memproses transaksi dalam mode offline dan akan sinkron otomatis saat koneksi kembali.",
  },
  {
    question: "Bisakah data dari aplikasi lama dipindahkan?",
    answer:
      "Bisa. Tim onboarding membantu impor daftar produk, harga, stok awal, dan data karyawan dari file Excel atau aplikasi lama.",
  },
];

export async function getFaqs(): Promise<FaqContent[]> {
  return faqs;
}
