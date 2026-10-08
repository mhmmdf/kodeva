import { LeadForm } from "@/components/lead/LeadForm";

export function LeadSection() {
  return (
    <section id="hubungi-kami" className="bg-slate-900 py-16 sm:py-20">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-300">
            Hubungi Kami
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
            Coba gratis, langsung dengan tim kami
          </h2>
          <p className="mt-4 max-w-lg text-base leading-7 text-slate-300">
            Isi form di bawah dan tim Kodeva akan menghubungi Anda dalam
            1×24 jam untuk demo sesuai kebutuhan bisnis Anda — tanpa biaya,
            tanpa komitmen.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-slate-300">
            <li className="flex items-start gap-3">
              <span aria-hidden className="mt-0.5 text-indigo-400">✓</span>
              Demo langsung sesuai alur bisnis Anda
            </li>
            <li className="flex items-start gap-3">
              <span aria-hidden className="mt-0.5 text-indigo-400">✓</span>
              Rekomendasi paket & estimasi biaya transparan
            </li>
            <li className="flex items-start gap-3">
              <span aria-hidden className="mt-0.5 text-indigo-400">✓</span>
              Bantuan migrasi data dari sistem lama
            </li>
          </ul>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-xl sm:p-8">
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
