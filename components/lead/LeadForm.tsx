"use client";

import { useState } from "react";

import { captureUtm } from "@/lib/tracking/utm";

const inputClassName =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200";

/**
 * UI-only lead form — submit is handled on the client and shows a
 * success message without persisting anything. Persistence (server
 * action + leads table) will be wired up in the database step.
 */
export function LeadForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-sm leading-6 text-emerald-800"
      >
        Terima kasih! Tim kami akan menghubungi Anda dalam 1×24 jam.
      </div>
    );
  }

  return (
    <form
      action={() => {
        // Store first-touch UTM (if present in the URL) for the upcoming tracking step.
        captureUtm();
        setSent(true);
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            Nama lengkap
          </span>
          <input
            type="text"
            name="name"
            required
            minLength={2}
            maxLength={80}
            autoComplete="name"
            placeholder="Nama Anda"
            className={inputClassName}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            Email
          </span>
          <input
            type="email"
            name="email"
            required
            maxLength={120}
            autoComplete="email"
            placeholder="nama@bisnis.co.id"
            className={inputClassName}
          />
        </label>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">
          Nomor WhatsApp{" "}
          <span className="font-normal text-slate-400">(opsional)</span>
        </span>
        <input
          type="tel"
          name="whatsapp"
          maxLength={16}
          autoComplete="tel"
          placeholder="0812xxxxxxx"
          className={inputClassName}
        />
      </label>

      <button
        type="submit"
        className="w-full rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
      >
        Minta Demo Gratis
      </button>
      <p className="text-xs leading-5 text-slate-400">
        Data Anda hanya dipakai untuk menghubungi Anda kembali. Tidak ada spam.
      </p>
    </form>
  );
}
