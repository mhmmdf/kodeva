"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownEditor({ defaultValue = "" }: { defaultValue?: string }) {
  const [tab, setTab] = useState<"tulis" | "preview">("tulis");
  const [value, setValue] = useState(defaultValue);

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor="contentMd"
          className="text-sm font-medium text-slate-700"
        >
          Isi artikel (Markdown)
        </label>
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setTab("tulis")}
            className={`rounded-md px-3 py-1 text-xs ${
              tab === "tulis" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
            }`}
          >
            Tulis
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={`rounded-md px-3 py-1 text-xs ${
              tab === "preview"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500"
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {tab === "tulis" ? (
        <textarea
          id="contentMd"
          name="contentMd"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          rows={18}
          required
          placeholder={"# Judul bagian\n\nIsi paragraf..."}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none"
        />
      ) : (
        <>
          <input type="hidden" name="contentMd" value={value} />
          <div className="mt-1 max-h-96 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800">
            {value.trim() ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            ) : (
              <p className="text-slate-400">Belum ada isi untuk dipreview.</p>
            )}
          </div>
        </>
      )}
      <p className="mt-1 text-xs text-slate-400">
        Mendukung Markdown: # judul, **tebal**, - daftar, [tautan](/url), | tabel |.
      </p>
    </div>
  );
}
