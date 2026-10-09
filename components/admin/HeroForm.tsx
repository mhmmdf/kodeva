import { saveHeroAction } from "@/app/admin/actions/landing";
import type { Hero } from "@/lib/db/schema";

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none";

export function HeroForm({ hero }: { hero: Hero | null }) {
  return (
    <form action={saveHeroAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="badge" className="text-sm font-medium text-slate-700">
            Badge (teks kecil di atas judul)
          </label>
          <input
            id="badge"
            name="badge"
            defaultValue={hero?.badge ?? ""}
            maxLength={60}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="ctaLabel" className="text-sm font-medium text-slate-700">
            Label tombol CTA
          </label>
          <input
            id="ctaLabel"
            name="ctaLabel"
            defaultValue={hero?.ctaLabel ?? ""}
            maxLength={40}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="title" className="text-sm font-medium text-slate-700">
          Judul hero
        </label>
        <input
          id="title"
          name="title"
          defaultValue={hero?.title ?? ""}
          maxLength={100}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="subtitle" className="text-sm font-medium text-slate-700">
          Subjudul
        </label>
        <textarea
          id="subtitle"
          name="subtitle"
          defaultValue={hero?.subtitle ?? ""}
          maxLength={300}
          rows={3}
          required
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="imageUrl" className="text-sm font-medium text-slate-700">
            Gambar hero (path /images/... atau URL https)
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            defaultValue={hero?.imageUrl ?? "/images/hero.svg"}
            maxLength={300}
            required
            className={inputClass}
          />
          {hero?.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hero.imageUrl}
              alt="Preview hero"
              className="mt-2 h-24 w-auto rounded-lg border border-slate-200"
            />
          ) : null}
        </div>
        <div>
          <label htmlFor="ctaLink" className="text-sm font-medium text-slate-700">
            Tujuan CTA (contoh: /products)
          </label>
          <input
            id="ctaLink"
            name="ctaLink"
            defaultValue={hero?.ctaLink ?? "/products"}
            maxLength={300}
            required
            className={inputClass}
          />
          <p className="mt-1 text-xs text-slate-400">
            Perubahan langsung tampil di halaman utama setelah disimpan.
          </p>
        </div>
      </div>

      <button
        type="submit"
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
      >
        Simpan hero
      </button>
    </form>
  );
}
