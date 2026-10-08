import type { TestimonialContent } from "@/lib/content/landing";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function Testimonials({ items }: { items: TestimonialContent[] }) {
  if (items.length === 0) return null;

  return (
    <section id="testimoni" className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Testimoni
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Dipercaya pemilik bisnis di seluruh Indonesia
          </h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <figure
              key={`${item.name}-${item.role}`}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <blockquote className="flex-1 text-sm leading-6 text-slate-600">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                {item.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.avatarUrl}
                    alt=""
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700"
                  >
                    {initials(item.name)}
                  </span>
                )}
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-500">{item.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
