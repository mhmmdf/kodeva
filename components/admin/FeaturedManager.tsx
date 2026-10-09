import {
  addFeaturedProductAction,
  moveFeaturedProductAction,
  removeFeaturedProductAction,
} from "@/app/admin/actions/landing";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import catalog from "@/data/products.json";

type FeaturedItem = {
  id: string;
  productSlug: string;
  position: number;
};

export function FeaturedManager({ items }: { items: FeaturedItem[] }) {
  const productsBySlug = new Map(catalog.products.map((p) => [p.slug, p]));
  const featuredSlugs = new Set(items.map((item) => item.productSlug));
  const options = catalog.products.filter((p) => !featuredSlugs.has(p.slug));

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">
          Belum ada produk unggulan. Pilih produk di bawah untuk menambahkan.
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => {
            const product = productsBySlug.get(item.productSlug);
            return (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2"
              >
                <div>
                  <span className="text-sm font-medium text-slate-900">
                    {product?.name ?? item.productSlug}
                  </span>
                  <span className="ml-2 text-xs text-slate-400">
                    {product?.tagline}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <form action={moveFeaturedProductAction.bind(null, item.id, "up")}>
                    <button
                      type="submit"
                      disabled={index === 0}
                      className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                    >
                      ↑
                    </button>
                  </form>
                  <form
                    action={moveFeaturedProductAction.bind(null, item.id, "down")}
                  >
                    <button
                      type="submit"
                      disabled={index === items.length - 1}
                      className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                    >
                      ↓
                    </button>
                  </form>
                  <form action={removeFeaturedProductAction.bind(null, item.id)}>
                    <ConfirmSubmit className="rounded border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50">
                      Hapus
                    </ConfirmSubmit>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {options.length > 0 ? (
        <form action={addFeaturedProductAction} className="flex flex-wrap gap-2">
          <select
            name="productSlug"
            defaultValue={options[0].slug}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {options.map((product) => (
              <option key={product.slug} value={product.slug}>
                {product.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Tambah produk
          </button>
        </form>
      ) : (
        <p className="text-xs text-slate-400">Semua produk sudah ditampilkan.</p>
      )}
    </div>
  );
}
