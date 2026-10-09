import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { SlugSyncFields } from "@/components/admin/SlugSyncFields";
import catalog from "@/data/products.json";
import type { Category, Post } from "@/lib/db/schema";

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none";

export function PostForm({
  action,
  categories,
  post,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  categories: Category[];
  post?: Post | undefined;
  submitLabel: string;
}) {
  const selectedProducts = new Set(post?.productSlugs ?? []);

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <SlugSyncFields title={post?.title ?? ""} slug={post?.slug ?? ""} />
      </div>

      <div>
        <label htmlFor="excerpt" className="text-sm font-medium text-slate-700">
          Ringkasan (untuk daftar artikel &amp; deskripsi search engine)
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          defaultValue={post?.excerpt ?? ""}
          maxLength={200}
          rows={2}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="coverUrl" className="text-sm font-medium text-slate-700">
            Gambar cover (path /images/... atau URL https)
          </label>
          <input
            id="coverUrl"
            name="coverUrl"
            defaultValue={post?.coverUrl ?? "/images/blog-1.svg"}
            maxLength={300}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="categoryId" className="text-sm font-medium text-slate-700">
            Kategori
          </label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={post?.categoryId ?? categories[0]?.id ?? ""}
            required
            className={inputClass}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset className="rounded-lg border border-slate-200 p-3">
        <legend className="px-1 text-sm font-medium text-slate-700">
          Tautkan produk marketplace (opsional)
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {catalog.products.map((product) => (
            <label
              key={product.slug}
              className="flex items-center gap-2 text-sm text-slate-600"
            >
              <input
                type="checkbox"
                name="productSlugs"
                value={product.slug}
                defaultChecked={selectedProducts.has(product.slug)}
                className="h-4 w-4 rounded border-slate-300"
              />
              {product.name}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="status" className="text-sm font-medium text-slate-700">
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={post?.status ?? "draft"}
          className={`${inputClass} sm:max-w-xs`}
        >
          <option value="draft">Draft (tidak tampil di website)</option>
          <option value="published">Publish (tampil di website)</option>
        </select>
      </div>

      <MarkdownEditor defaultValue={post?.contentMd ?? ""} />

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          {submitLabel}
        </button>
        <span className="text-xs text-slate-400">
          Perubahan konten publish tampil otomatis tanpa deploy ulang.
        </span>
      </div>
    </form>
  );
}
