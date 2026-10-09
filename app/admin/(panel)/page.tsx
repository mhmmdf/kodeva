import Link from "next/link";
import { desc, eq } from "drizzle-orm";

import { connection } from "next/server";

import { db } from "@/lib/db/client";
import { faqs, leads, posts, testimonials } from "@/lib/db/schema";

export const instant = false;

export default async function AdminDashboardPage() {
  await connection();
  const [allPosts, leadCount, testimonialCount, faqCount, latestLeads] =
    await Promise.all([
      db.select({ status: posts.status }).from(posts),
      db.select({ id: leads.id }).from(leads),
      db.select({ id: testimonials.id }).from(testimonials).where(eq(testimonials.active, true)),
      db.select({ id: faqs.id }).from(faqs).where(eq(faqs.active, true)),
      db.select().from(leads).orderBy(desc(leads.createdAt)).limit(5),
    ]);

  const published = allPosts.filter((post) => post.status === "published").length;
  const drafts = allPosts.length - published;

  const stats = [
    { label: "Lead masuk", value: leadCount.length, href: "/admin/leads" },
    { label: "Artikel publish", value: published, href: "/admin/posts" },
    { label: "Artikel draft", value: drafts, href: "/admin/posts" },
    { label: "Testimoni aktif", value: testimonialCount.length, href: "/admin/landing" },
    { label: "FAQ aktif", value: faqCount.length, href: "/admin/landing" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">
          Ringkasan konten &amp; lead campaign Promo Akhir Tahun.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl border border-slate-200 bg-white p-4 hover:border-slate-400"
          >
            <div className="text-2xl font-semibold text-slate-900">{stat.value}</div>
            <div className="mt-1 text-xs text-slate-500">{stat.label}</div>
          </Link>
        ))}
      </div>

      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-900">Lead terbaru</h2>
          <Link href="/admin/leads" className="text-xs text-slate-500 hover:text-slate-900">
            Lihat semua
          </Link>
        </div>
        {latestLeads.length === 0 ? (
          <p className="px-4 py-6 text-sm text-slate-500">
            Belum ada lead. Lead dari form landing page akan muncul di sini.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {latestLeads.map((lead) => (
              <li key={lead.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                <div>
                  <span className="font-medium text-slate-900">{lead.name}</span>{" "}
                  <span className="text-slate-500">{lead.email}</span>
                </div>
                <span className="text-xs text-slate-400">
                  {lead.createdAt.toISOString().slice(0, 16).replace("T", " ")} UTC · {lead.page}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
