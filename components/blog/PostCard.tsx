import Image from "next/image";
import Link from "next/link";

import type { PostListItem } from "@/lib/content/posts";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "long",
});

function formatDate(value: string | null): string {
  if (!value) return "";
  return dateFormatter.format(new Date(value));
}

export function PostCard({ post }: { post: PostListItem }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link
        href={`/blog/${post.slug}`}
        className="relative block aspect-[1200/630] overflow-hidden bg-slate-100"
      >
        <Image
          src={post.coverUrl || "/images/blog-1.svg"}
          alt=""
          width={1200}
          height={630}
          sizes="(max-width: 768px) 100vw, 33vw"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          {post.categoryName ? (
            <span className="rounded-full bg-indigo-50 px-2.5 py-1 font-semibold text-indigo-700">
              {post.categoryName}
            </span>
          ) : null}
          <time dateTime={post.publishedAt ?? undefined}>
            {formatDate(post.publishedAt)}
          </time>
        </div>
        <h2 className="mt-3 text-lg font-bold leading-6 text-slate-900">
          <Link
            href={`/blog/${post.slug}`}
            className="transition-colors group-hover:text-indigo-600"
          >
            {post.title}
          </Link>
        </h2>
        <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
          {post.excerpt}
        </p>
        <Link
          href={`/blog/${post.slug}`}
          className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
        >
          Baca selengkapnya →
        </Link>
      </div>
    </article>
  );
}
