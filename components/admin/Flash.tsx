const savedMessages: Record<string, string> = {
  hero: "Konten hero berhasil disimpan.",
  testimonial: "Testimoni berhasil disimpan.",
  "testimonial-deleted": "Testimoni dihapus.",
  faq: "FAQ berhasil disimpan.",
  "faq-deleted": "FAQ dihapus.",
  featured: "Produk unggulan diperbarui.",
  deleted: "Artikel dihapus.",
  category: "Kategori ditambahkan.",
  "category-deleted": "Kategori dihapus.",
  lead: "",
};

export function Flash({
  saved,
  error,
}: {
  saved?: string | undefined;
  error?: string | undefined;
}) {
  if (error) {
    return (
      <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!saved) return null;
  if (saved === "1") {
    return (
      <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
        Perubahan tersimpan. Konten publik sudah di-revalidate.
      </div>
    );
  }

  const message = savedMessages[saved];
  if (!message) return null;

  return (
    <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
      {message}
    </div>
  );
}
