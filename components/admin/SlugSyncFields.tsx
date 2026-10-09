"use client";

import { useState } from "react";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function SlugSyncFields({
  title,
  slug,
}: {
  title: string;
  slug: string;
}) {
  const [titleValue, setTitleValue] = useState(title);
  const [slugValue, setSlugValue] = useState(slug);
  const [slugEdited, setSlugEdited] = useState(slug.length > 0);

  const inputClass =
    "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none";

  return (
    <>
      <div>
        <label htmlFor="title" className="text-sm font-medium text-slate-700">
          Judul
        </label>
        <input
          id="title"
          name="title"
          value={titleValue}
          onChange={(event) => {
            const next = event.target.value;
            setTitleValue(next);
            if (!slugEdited) {
              setSlugValue(slugify(next));
            }
          }}
          maxLength={120}
          required
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="slug" className="text-sm font-medium text-slate-700">
          Slug URL
        </label>
        <input
          id="slug"
          name="slug"
          value={slugValue}
          onChange={(event) => {
            setSlugEdited(true);
            setSlugValue(slugify(event.target.value));
          }}
          maxLength={120}
          required
          placeholder="judul-artikel"
          className={inputClass}
        />
        <p className="mt-1 text-xs text-slate-400">
          Otomatis diisi dari judul. URL: /blog/{slugValue || "slug-anda"}
        </p>
      </div>
    </>
  );
}
