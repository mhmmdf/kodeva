import type { FaqContent } from "@/lib/content/landing";

export function Faq({ items }: { items: FaqContent[] }) {
  if (items.length === 0) return null;

  return (
    <section id="faq" className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
          FAQ
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Pertanyaan yang sering diajukan
        </h2>
      </div>
      <div className="mt-8 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {items.map((item) => (
          <details key={item.question} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold text-slate-900">
              {item.question}
              <span
                aria-hidden
                className="text-slate-400 transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
