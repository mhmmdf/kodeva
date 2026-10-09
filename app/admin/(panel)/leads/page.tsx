import { desc } from "drizzle-orm";
import { connection } from "next/server";

import { Flash } from "@/components/admin/Flash";
import { SectionCard } from "@/components/admin/SectionCard";
import { db } from "@/lib/db/client";
import { leads } from "@/lib/db/schema";

export const instant = false;

function formatUtm(utm: Record<string, string> | null): string {
  if (!utm) return "-";
  const entries = Object.entries(utm).filter(([, value]) => value);
  if (entries.length === 0) return "-";
  return entries.map(([key, value]) => `${key}=${value}`).join("&");
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  await connection();
  const leadRows = await db
    .select()
    .from(leads)
    .orderBy(desc(leads.createdAt));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Leads</h1>
        <p className="text-sm text-slate-500">
          Data dari form lead capture landing page, termasuk atribusi UTM.
        </p>
      </div>

      <Flash saved={params.saved} error={params.error} />

      <SectionCard title={`Semua lead (${leadRows.length})`}>
        {leadRows.length === 0 ? (
          <p className="text-sm text-slate-500">
            Belum ada lead masuk. Coba isi form di halaman utama untuk menguji.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500">
                  <th className="px-2 py-2 font-medium">Waktu</th>
                  <th className="px-2 py-2 font-medium">Nama</th>
                  <th className="px-2 py-2 font-medium">Email</th>
                  <th className="px-2 py-2 font-medium">WhatsApp</th>
                  <th className="px-2 py-2 font-medium">Halaman</th>
                  <th className="px-2 py-2 font-medium">UTM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leadRows.map((lead) => (
                  <tr key={lead.id}>
                    <td className="whitespace-nowrap px-2 py-2 text-xs text-slate-500">
                      {lead.createdAt.toISOString().slice(0, 16).replace("T", " ")}
                    </td>
                    <td className="px-2 py-2 text-slate-900">{lead.name}</td>
                    <td className="px-2 py-2 text-slate-700">{lead.email}</td>
                    <td className="px-2 py-2 text-slate-700">{lead.whatsapp ?? "-"}</td>
                    <td className="px-2 py-2 text-xs text-slate-500">{lead.page}</td>
                    <td className="max-w-xs px-2 py-2 text-xs text-slate-500">
                      {formatUtm(lead.utm)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
