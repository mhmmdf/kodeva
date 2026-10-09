import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminNav } from "@/components/admin/AdminNav";
import { getSession } from "@/lib/session";

export const instant = false;

export default async function AdminPanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-base font-semibold text-slate-900">
              Kodeva CMS
            </Link>
            <AdminNav />
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link
              href="/"
              target="_blank"
              className="text-slate-600 hover:text-slate-900"
            >
              Lihat situs ↗
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
