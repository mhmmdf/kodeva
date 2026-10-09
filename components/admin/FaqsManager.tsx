import { createFaqAction, deleteFaqAction, updateFaqAction } from "@/app/admin/actions/landing";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import type { Faq } from "@/lib/db/schema";

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none";

export function FaqsManager({ items }: { items: Faq[] }) {
  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">Belum ada FAQ.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="rounded-lg border border-slate-200 p-3">
              <form action={updateFaqAction.bind(null, item.id)} className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-600">
                    Pertanyaan
                  </label>
                  <input
                    name="question"
                    defaultValue={item.question}
                    maxLength={200}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">Jawaban</label>
                  <textarea
                    name="answer"
                    defaultValue={item.answer}
                    maxLength={1000}
                    rows={3}
                    required
                    className={inputClass}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-slate-600">
                    <input
                      type="checkbox"
                      name="active"
                      defaultChecked={item.active}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                    Tampilkan di landing page
                  </label>
                  <button
                    type="submit"
                    className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700"
                  >
                    Simpan
                  </button>
                </div>
              </form>
              <form action={deleteFaqAction.bind(null, item.id)} className="mt-2 text-right">
                <ConfirmSubmit className="text-xs text-red-600 hover:underline">
                  Hapus FAQ
                </ConfirmSubmit>
              </form>
            </li>
          ))}
        </ul>
      )}

      <details className="rounded-lg border border-dashed border-slate-300 p-3">
        <summary className="cursor-pointer text-sm font-medium text-slate-700">
          Tambah FAQ baru
        </summary>
        <form action={createFaqAction} className="mt-3 space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-600">Pertanyaan</label>
            <input name="question" maxLength={200} required className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Jawaban</label>
            <textarea
              name="answer"
              maxLength={1000}
              rows={3}
              required
              className={inputClass}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-slate-600">
              <input
                type="checkbox"
                name="active"
                defaultChecked
                className="h-4 w-4 rounded border-slate-300"
              />
              Tampilkan di landing page
            </label>
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700"
            >
              Tambah
            </button>
          </div>
        </form>
      </details>
    </div>
  );
}
