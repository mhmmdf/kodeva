import Link from "next/link";

interface PaginationProps {
  page: number;
  totalPages: number;
}

function pageHref(page: number): string {
  return page <= 1 ? "/blog" : `/blog?page=${page}`;
}

export function Pagination({ page, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;

  const numbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      aria-label="Navigasi halaman blog"
      className="mt-10 flex items-center justify-center gap-2"
    >
      {page > 1 ? (
        <Link
          href={pageHref(page - 1)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
        >
          ← Sebelumnya
        </Link>
      ) : null}
      {numbers.map((number) => (
        <Link
          key={number}
          href={pageHref(number)}
          aria-current={number === page ? "page" : undefined}
          className={`min-h-10 min-w-10 rounded-lg px-3 py-2 text-center text-sm font-medium ${
            number === page
              ? "bg-indigo-600 text-white"
              : "border border-slate-300 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
          }`}
        >
          {number}
        </Link>
      ))}
      {page < totalPages ? (
        <Link
          href={pageHref(page + 1)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
        >
          Berikutnya →
        </Link>
      ) : null}
    </nav>
  );
}
